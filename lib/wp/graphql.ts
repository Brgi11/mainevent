import * as http from "node:http";
import * as https from "node:https";
import { URL } from "node:url";

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);
const MAX_REDIRECTS = 10;

/** Some hosts/WAFs block requests without a normal browser User-Agent on POST. */
const GRAPHQL_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/** Trim env values. Use static `process.env.NAME` access so Next.js / Turbopack expose vars on Netlify (dynamic `process.env[key]` often stays empty in server bundles). */
function trimEnv(value: string | undefined): string {
  return (value ?? "").trim();
}

function buildGraphqlHeaders(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": GRAPHQL_UA,
  };
  const site = trimEnv(process.env.WORDPRESS_URL).replace(/\/+$/, "");
  if (site) {
    try {
      const base = new URL(site.endsWith("/") ? site : `${site}/`);
      h["Origin"] = base.origin;
      h["Referer"] = base.href;
    } catch {
      /* ignore */
    }
  }
  return h;
}

/** Matches browser-style `fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })`. */
function buildMinimalGraphqlPostHeaders(): Record<string, string> {
  return { "Content-Type": "application/json" };
}

/**
 * Full WPGraphQL endpoint URL (POST + JSON). Prefer NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL
 * so the name matches Next conventions; WORDPRESS_GRAPHQL_URL is a legacy alias.
 */
function graphqlHttpUrlFromEnv(): string {
  return (
    trimEnv(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL) ||
    trimEnv(process.env.WORDPRESS_GRAPHQL_URL)
  );
}

/** Dev / broken-chain workaround: disables TLS verification for this URL only. */
function useInsecureWordPressTls(): boolean {
  const v = trimEnv(process.env.WORDPRESS_GRAPHQL_INSECURE_TLS).toLowerCase();
  return ["1", "true", "yes", "on"].includes(v);
}

/** Try alternate paths when POST 404s (permalink / trailing slash / index.php). */
function graphqlEndpointVariants(endpoint: string): string[] {
  const u = endpoint.trim();
  const out: string[] = [u];
  if (u.endsWith("/")) out.push(u.slice(0, -1));
  else out.push(`${u}/`);

  // Some installs expose GraphQL only via query-string style:
  //   /index.php?graphql&query=...
  // In that case we must preserve the `graphql` query param and avoid
  // rewriting to /graphql or /index.php/graphql.
  try {
    const parsed = new URL(u);
    if (parsed.searchParams.has("graphql")) {
      return [...new Set(out)];
    }
  } catch {
    /* ignore */
  }

  try {
    const parsed = new URL(u);
    const pathNoSlash = parsed.pathname.replace(/\/$/, "");
    if (pathNoSlash.endsWith("/graphql")) {
      const base = pathNoSlash.slice(0, -"/graphql".length);
      const indexPath = `${base}/index.php/graphql`;
      if (indexPath !== pathNoSlash) {
        const copy = new URL(parsed.href);
        copy.pathname = indexPath + (u.endsWith("/") ? "/" : "");
        out.push(copy.href);
        out.push(
          copy.href.endsWith("/") ? copy.href.slice(0, -1) : `${copy.href}/`
        );
      }
    }

    // Site at domain root but WordPress lives in a subfolder (common on staging / eiz.hr-style hosts).
    if (pathNoSlash === "/graphql") {
      const origin = parsed.origin;
      const extra = trimEnv(process.env.WORDPRESS_GRAPHQL_PATH_PREFIXES);
      const segments = extra
        ? extra
            .split(/[,;\s]+/)
            .map((s: string) => s.replace(/^\/+|\/+$/g, ""))
            .filter(Boolean)
            .map((s: string) => `/${s}`)
        : ["/wp", "/wordpress", "/mainevent", "/blog"];
      for (const seg of segments) {
        const gql = `${origin}${seg}/graphql`;
        out.push(gql, gql.endsWith("/") ? gql.slice(0, -1) : `${gql}/`);
        const idx = `${origin}${seg}/index.php/graphql`;
        out.push(idx, idx.endsWith("/") ? idx.slice(0, -1) : `${idx}/`);
      }
    }
  } catch {
    /* ignore */
  }

  return [...new Set(out)];
}

/** True if we have at least one way to derive the GraphQL HTTP URL. */
export function isWpGraphqlConfigured(): boolean {
  return graphqlRootBases().length > 0;
}

/**
 * All GraphQL endpoint roots to try. Subdirectory installs often need both
 * the explicit GraphQL URL and WORDPRESS_URL, if the first misses /subdir, the second fixes it.
 */
function graphqlRootBases(): string[] {
  const list: string[] = [];
  const g = graphqlHttpUrlFromEnv();
  const w = trimEnv(process.env.WORDPRESS_URL).replace(/\/+$/, "");
  const homePath = trimEnv(process.env.WORDPRESS_HOME_PATH).replace(
    /^\/+|\/+$/g,
    ""
  );

  // If the env already points at a query-string endpoint, do not rewrite it.
  // Example:
  //   https://host/index.php?graphql
  if (g) {
    try {
      const u = new URL(g);
      if (u.searchParams.has("graphql")) {
        return [g];
      }
    } catch {
      /* ignore */
    }
  }

  if (g) list.push(g);

  if (g) {
    try {
      const u = new URL(g);
      const p = u.pathname.replace(/\/$/, "");
      if (!p.endsWith("graphql")) {
        const u2 = new URL(g);
        u2.pathname = `${p === "/" ? "" : p}/graphql`.replace(/\/+/g, "/");
        list.push(u2.href);
      }
    } catch {
      /* ignore */
    }
  }

  if (w) {
    list.push(`${w}/graphql`);
    list.push(`${w}/index.php/graphql`);
  }

  if (w && homePath) {
    const base = w.replace(/\/+$/, "");
    list.push(`${base}/${homePath}/graphql`);
    list.push(`${base}/${homePath}/index.php/graphql`);
  }

  if (!w && homePath && g) {
    try {
      const origin = new URL(g).origin;
      list.push(`${origin}/${homePath}/graphql`);
      list.push(`${origin}/${homePath}/index.php/graphql`);
    } catch {
      /* ignore */
    }
  }

  return [...new Set(list.map((x) => x.trim()).filter(Boolean))];
}

function buildGraphqlGetUrl(
  endpointBase: string,
  query: string,
  variables?: Record<string, unknown>
): string {
  const u = new URL(endpointBase);
  u.searchParams.set("query", query);
  if (variables && Object.keys(variables).length > 0) {
    u.searchParams.set("variables", JSON.stringify(variables));
  }
  return u.href;
}

type InsecureInit = {
  method: string;
  headers: Record<string, string>;
  body?: string;
};

function fetchWithInsecureTlsOnce(urlStr: string, init: InsecureInit): Promise<Response> {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const isHttps = url.protocol === "https:";
    const lib = isHttps ? https : http;
    const port = url.port
      ? Number(url.port)
      : isHttps
        ? 443
        : 80;

    const headers: Record<string, string | number> = {
      ...init.headers,
    };
    if (init.body != null) {
      headers["Content-Length"] = Buffer.byteLength(init.body, "utf8");
    }

    const options: https.RequestOptions = {
      hostname: url.hostname,
      port,
      path: `${url.pathname}${url.search}`,
      method: init.method,
      headers,
      ...(isHttps
        ? {
            agent: new https.Agent({
              rejectUnauthorized: false,
              servername: url.hostname,
            }),
          }
        : {}),
    };

    const req = lib.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (c: Buffer) => chunks.push(c));
      res.on("end", () => {
        const raw = Buffer.concat(chunks).toString("utf8");
        const headersOut = new Headers();
        for (const [key, value] of Object.entries(res.headers)) {
          if (value == null) continue;
          if (Array.isArray(value)) headersOut.set(key, value.join(", "));
          else headersOut.set(key, value);
        }
        resolve(
          new Response(raw, {
            status: res.statusCode ?? 0,
            statusText: res.statusMessage ?? "",
            headers: headersOut,
          })
        );
      });
    });

    req.on("error", reject);
    if (init.body != null) req.write(init.body, "utf8");
    req.end();
  });
}

type GraphqlRequestMode = "minimal" | "full";

async function graphqlRequestFollowingRedirects(
  urlStr: string,
  init: { method: "POST" | "GET"; body?: string },
  insecure: boolean,
  depth = 0,
  mode: GraphqlRequestMode = "full"
): Promise<Response> {
  if (depth > MAX_REDIRECTS) {
    return new Response(
      JSON.stringify({
        errors: [{ message: `Too many redirects (>${MAX_REDIRECTS})` }],
      }),
      { status: 508, headers: { "Content-Type": "application/json" } }
    );
  }

  const headers: Record<string, string> =
    mode === "minimal"
      ? init.method === "POST"
        ? { ...buildMinimalGraphqlPostHeaders() }
        : { Accept: "application/json" }
      : { ...buildGraphqlHeaders() };
  if (init.method === "POST" && mode === "full") {
    headers["Content-Type"] = "application/json";
  }

  const res = insecure
    ? await fetchWithInsecureTlsOnce(urlStr, {
        method: init.method,
        headers,
        body: init.body,
      })
    : await fetch(urlStr, {
        method: init.method,
        headers,
        body: init.method === "POST" ? init.body : undefined,
        cache: "no-store",
      });

  if (REDIRECT_STATUSES.has(res.status)) {
    const loc = res.headers.get("location");
    if (loc) {
      if (!insecure) {
        await res.arrayBuffer().catch(() => undefined);
      }
      const nextUrl = new URL(loc, urlStr).href;
      if (depth === 0) {
        console.warn(
          `[wpGraphQL] Following redirect ${res.status} → ${nextUrl}`
        );
      }
      return graphqlRequestFollowingRedirects(
        nextUrl,
        init,
        insecure,
        depth + 1,
        mode
      );
    }
  }

  return res;
}

/** True if body looks like GraphQL JSON (not a WordPress HTML page). */
async function responseBodyLooksLikeGraphqlJson(res: Response): Promise<boolean> {
  if (!res.ok) return false;
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) return true;
  try {
    const start = (await res.clone().text()).trimStart().slice(0, 2);
    return start.startsWith("{") || start.startsWith("[");
  } catch {
    return false;
  }
}

async function executeGraphqlHttp(
  query: string,
  variables: Record<string, unknown> | undefined,
  insecure: boolean
): Promise<Response> {
  const body = JSON.stringify({ query, variables });
  const roots = graphqlRootBases();
  let last: Response | null = null;

  const explicit = graphqlHttpUrlFromEnv();
  if (explicit) {
    for (const base of graphqlEndpointVariants(explicit)) {
      const res = await graphqlRequestFollowingRedirects(
        base,
        { method: "POST", body },
        insecure,
        0,
        "minimal"
      );
      last = res;
      if (res.status === 404) continue;
      if (!res.ok) return res;
      if (await responseBodyLooksLikeGraphqlJson(res)) return res;
    }
  }

  for (const root of roots) {
    for (const base of graphqlEndpointVariants(root)) {
      const res = await graphqlRequestFollowingRedirects(
        base,
        { method: "POST", body },
        insecure,
        0,
        "full"
      );
      last = res;
      if (res.status === 404) continue;
      if (!res.ok) return res;
      if (await responseBodyLooksLikeGraphqlJson(res)) return res;
    }
  }

  console.warn(
    "[wpGraphQL] POST did not return GraphQL JSON; trying WPGraphQL HTTP GET (?query=…)"
  );

  for (const root of roots) {
    for (const base of graphqlEndpointVariants(root)) {
      const getUrl = buildGraphqlGetUrl(base, query, variables);
      const res = await graphqlRequestFollowingRedirects(
        getUrl,
        { method: "GET" },
        insecure,
        0,
        "full"
      );
      last = res;
      if (res.status === 404) continue;
      if (!res.ok) continue;
      if (await responseBodyLooksLikeGraphqlJson(res)) return res;
    }
  }

  return last ?? new Response("No response", { status: 599 });
}

type ErrLike = Error & {
  cause?: unknown;
  code?: string;
  errno?: number;
  syscall?: string;
  address?: string;
  port?: number;
};

/** Node/undici often only say "fetch failed"; real reason is usually in `cause` or `code`. */
function formatFetchFailure(e: unknown): string {
  if (!(e instanceof Error)) return String(e);

  const parts: string[] = [];
  const err = e as ErrLike;
  if (err.name && err.name !== "Error") parts.push(err.name);
  if (err.message) parts.push(err.message);
  if (err.code) parts.push(`code: ${err.code}`);
  if (err.errno != null) parts.push(`errno: ${err.errno}`);
  if (err.syscall) parts.push(`syscall: ${err.syscall}`);
  if (err.address) parts.push(`host: ${err.address}`);
  if (err.port != null) parts.push(`port: ${err.port}`);

  let depth = 0;
  let c: unknown = err.cause;
  while (c != null && depth < 6) {
    depth += 1;
    if (c instanceof Error) {
      parts.push(`↳ ${c.message}`);
      c = (c as ErrLike).cause;
    } else if (typeof c === "object" && c !== null && "message" in c) {
      parts.push(`↳ ${String((c as { message: unknown }).message)}`);
      break;
    } else {
      parts.push(`↳ ${String(c)}`);
      break;
    }
  }

  const insecureSet = useInsecureWordPressTls();
  const certIssue = /certificate|issuer|ssl|tls|UNABLE_TO_VERIFY/i.test(
    parts.join(" ")
  );

  let hint = "";
  if (certIssue && !insecureSet) {
    hint =
      " Add WORDPRESS_GRAPHQL_INSECURE_TLS=1 (frontend/.env.local locally, or Netlify env vars in production), then restart dev / redeploy.";
  } else if (certIssue && insecureSet) {
    hint =
      " (TLS bypass is ON but still failing, check NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL or WORDPRESS_GRAPHQL_URL and WORDPRESS_URL in Netlify environment variables or frontend/.env.local.)";
  }

  return parts.join(", ") + hint;
}

/** Human-readable summary for UI / logs */
export function formatWpGraphQLError(errors: unknown): string {
  if (errors == null) return "Unknown error";
  if (Array.isArray(errors)) {
    return errors
      .map((e) => {
        if (e && typeof e === "object" && "message" in e) {
          return String((e as { message: string }).message);
        }
        return String(e);
      })
      .filter(Boolean)
      .join("; ");
  }
  if (errors instanceof Error) return formatFetchFailure(errors);
  return String(errors);
}

export async function wpGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<{ data: T | null; errors?: unknown }> {
  if (graphqlRootBases().length === 0) {
    return { data: null };
  }

  const insecure = useInsecureWordPressTls();

  if (insecure) {
    console.warn(
      "[wpGraphQL] WORDPRESS_GRAPHQL_INSECURE_TLS: TLS verification is OFF for WordPress only. Fix host certs or NODE_EXTRA_CA_CERTS for production."
    );
  }

  try {
    const res = await executeGraphqlHttp(query, variables, insecure);

    const raw = await res.text();
    const ct = res.headers.get("content-type") ?? "";

    if (!res.ok) {
      let msg = `HTTP ${res.status} ${res.statusText}${raw ? `: ${raw.slice(0, 280)}` : ""}`;
      if (
        /<!DOCTYPE/i.test(raw) ||
        (raw.includes("<html") && ct.includes("text/html"))
      ) {
        msg +=
          ", Server returned a WordPress HTML page (not GraphQL JSON). For HTTP 404 on every /graphql path: install and activate the WPGraphQL plugin on this WordPress site, then copy the exact endpoint from WP Admin → GraphQL → Settings. WORDPRESS_URL should be the site home with no /graphql (e.g. https://host or https://host/mywp). If the site uses “Plain” permalinks, the endpoint may be …/index.php/graphql. Optional: WORDPRESS_HOME_PATH for subdirectory installs.";
      }
      console.error("[wpGraphQL]", msg);
      return { data: null, errors: [{ message: msg }] };
    }

    if (!ct.includes("application/json")) {
      const msg = `Expected JSON from GraphQL endpoint, got "${ct}". Start of body: ${raw.slice(0, 200)}`;
      console.error("[wpGraphQL]", msg);
      return { data: null, errors: [{ message: msg }] };
    }

    let json: { data?: T; errors?: { message: string }[] };
    try {
      json = JSON.parse(raw) as { data?: T; errors?: { message: string }[] };
    } catch {
      const msg = `Invalid JSON from server: ${raw.slice(0, 200)}`;
      console.error("[wpGraphQL]", msg);
      return { data: null, errors: [{ message: msg }] };
    }

    if (json.errors?.length) {
      console.error("[wpGraphQL]", json.errors);
      return { data: null, errors: json.errors };
    }

    return { data: (json.data as T) ?? null };
  } catch (e) {
    console.error("[wpGraphQL] fetch failed", e);
    return {
      data: null,
      errors: [{ message: formatFetchFailure(e) }],
    };
  }
}
