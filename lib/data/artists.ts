import { acfImageUrl } from "@/lib/wp/acf-media";
import { postHasArtistCategory } from "@/lib/wp/artist-category";
import { FALLBACK_HOME_ARTISTS } from "@/lib/data/fallback-artists";
import {
  formatWpGraphQLError,
  isWpGraphqlConfigured,
  wpGraphQL,
} from "@/lib/wp/graphql";
import {
  ARTISTS_GRAPHQL_CATEGORY,
  QUERY_ARTISTS,
  QUERY_ARTISTS_PAGE,
  QUERY_ARTIST_BY_SLUG,
} from "@/lib/wp/queries";
import type { ArtistCardModel, WpArtistPostNode } from "@/lib/wp/types";
import { stripExcerpt } from "@/lib/wp/types";

type PostsData = { posts?: { nodes?: WpArtistPostNode[] | null } | null };
type ArtistsPostsPageData = {
  posts?: {
    pageInfo?: {
      hasNextPage?: boolean | null;
      endCursor?: string | null;
    } | null;
    nodes?: WpArtistPostNode[] | null;
  } | null;
};
type ArtistBySlugData = { posts?: { nodes?: WpArtistPostNode[] | null } | null };

/** WordPress-only archive: no static fallback. */
export type ArtistsArchiveStatus =
  | "ok"
  | "no_endpoint"
  | "fetch_error"
  | "empty";

export type ArtistsArchiveResult = {
  artists: ArtistCardModel[];
  status: ArtistsArchiveStatus;
  errorDetail?: string;
};

async function fetchArtistCardsFromWordPress(
  first: number
): Promise<ArtistCardModel[]> {
  const { data, errors } = await wpGraphQL<PostsData>(QUERY_ARTISTS, {
    first,
    category: ARTISTS_GRAPHQL_CATEGORY,
  });
  if (errors || data == null) return [];
  const mapped = (data.posts?.nodes ?? [])
    .map(mapPostToArtistCard)
    .filter((x): x is ArtistCardModel => x !== null);

  // Ensure stable alphabetical ordering for UI consistency.
  return mapped.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );
}

function isArtistPost(post: WpArtistPostNode | null | undefined): boolean {
  if (!post?.slug) return false;
  if (postHasArtistCategory(post.categories)) return true;
  const a = post.artists;
  if (!a) return false;
  return !!(
    (typeof a.artistName === "string" && a.artistName.trim()) ||
    acfImageUrl(a.image1) ||
    (typeof a.bioEn === "string" && a.bioEn.trim()) ||
    (typeof a.bioHr === "string" && a.bioHr.trim())
  );
}

function trimMaybe(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeStringArrayLower(value: unknown): string[] {
  const arr: unknown[] = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
  return arr
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeStringArrayRaw(value: unknown): string[] {
  const arr: unknown[] = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
  return arr
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.trim())
    .filter(Boolean);
}

function mapPostToArtistCard(node: WpArtistPostNode): ArtistCardModel | null {
  const slug = node.slug?.trim();
  if (!slug) return null;
  const acf = node.artists;
  const name = trimMaybe(acf?.artistName) || trimMaybe(node.title) || slug;
  const tagLabel =
    (node.tags?.nodes?.find((t) => typeof t?.name === "string" && t.name.trim())
      ?.name ?? "")
      .trim();
  const eventTypeRaw = normalizeStringArrayRaw(acf?.eventType);
  const vibeRaw = normalizeStringArrayRaw(acf?.vibe);

  const eventType = normalizeStringArrayLower(acf?.eventType);
  const vibe = normalizeStringArrayLower(acf?.vibe);

  const typeLabel = (eventTypeRaw[0] || vibeRaw[0] || "").trim();
  const imageUrl = acfImageUrl(acf?.image1);
  const hoverRaw = trimMaybe(acf?.hoverPreviewEn) || trimMaybe(acf?.hoverPreviewHr) || "";
  const hoverText = hoverRaw
    ? stripExcerpt(hoverRaw)
    : typeLabel || name;
  return {
    slug,
    name,
    typeLabel,
    tagLabel,
    eventType,
    vibe,
    imageUrl,
    hoverText,
  };
}

export function getArtistDisplayName(post: WpArtistPostNode): string {
  return (
    trimMaybe(post.artists?.artistName) ||
    trimMaybe(post.title) ||
    trimMaybe(post.slug) ||
    "Artist"
  );
}

export async function getArtistsForHome(
  limit = 12
): Promise<ArtistCardModel[]> {
  const mapped = await fetchArtistCardsFromWordPress(limit);
  if (mapped.length > 0) return mapped;
  // Keep fallback deterministic as well.
  return [...FALLBACK_HOME_ARTISTS].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );
}

async function fetchArtistPostsConnection(
  first: number,
  category: string,
  cursor: string | undefined
): Promise<{
  nodes: WpArtistPostNode[];
  hasNext: boolean;
  endCursor: string | null;
  errors?: unknown;
}> {
  const vars: Record<string, unknown> = { first, category };
  if (cursor) vars.after = cursor;
  const { data, errors } = await wpGraphQL<ArtistsPostsPageData>(
    QUERY_ARTISTS_PAGE,
    vars
  );
  if (errors) {
    return {
      nodes: [],
      hasNext: false,
      endCursor: null,
      errors,
    };
  }
  const conn = data?.posts;
  return {
    nodes: conn?.nodes ?? [],
    hasNext: !!conn?.pageInfo?.hasNextPage,
    endCursor: conn?.pageInfo?.endCursor ?? null,
  };
}

/**
 * Artists archive (/artists): loads all artist-category posts via cursor
 * pagination (for client-side filters). No static placeholders.
 */
export async function getArtistsArchiveFromWordPress(options?: {
  maxArtists?: number;
}): Promise<ArtistsArchiveResult> {
  const maxTotal = options?.maxArtists ?? 500;
  if (!isWpGraphqlConfigured()) {
    return { artists: [], status: "no_endpoint" };
  }

  const category = ARTISTS_GRAPHQL_CATEGORY;
  const pageSize = 80;
  const raw: WpArtistPostNode[] = [];
  let cursor: string | undefined;

  while (raw.length < maxTotal) {
    const page = await fetchArtistPostsConnection(
      pageSize,
      category,
      cursor
    );
    if (page.errors) {
      return {
        artists: [],
        status: "fetch_error",
        errorDetail: formatWpGraphQLError(page.errors),
      };
    }
    raw.push(...page.nodes);
    if (!page.hasNext || !page.endCursor) break;
    cursor = page.endCursor;
    if (page.nodes.length === 0) break;
  }

  const artists = raw
    .slice(0, maxTotal)
    .map(mapPostToArtistCard)
    .filter((x): x is ArtistCardModel => x !== null)
    // Ensure stable alphabetical ordering for the client-side filters.
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

  if (artists.length === 0) {
    return { artists: [], status: "empty" };
  }

  return { artists, status: "ok" };
}

export async function getArtistPost(slug: string) {
  const { data, errors } = await wpGraphQL<ArtistBySlugData>(QUERY_ARTIST_BY_SLUG, { slug });
  if (errors) return null;
  const post = data?.posts?.nodes?.[0] ?? null;
  if (!post?.slug) return null;
  if (!isArtistPost(post)) return null;
  return post;
}
