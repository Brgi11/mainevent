export type Cf7SubmitInput = {
  firstName: string;
  email: string;
  message: string;
  eventType?: string;
  location?: string;
  eventDate?: string;
  duration?: string;
};

// CF7 uses two different identifiers:
// - unit_tag: 7-char shortcode hash (used for _wpcf7_unit_tag)
// - form_post_id: numeric WP post ID (used for /contact-forms/{id}/feedback and _wpcf7)
const CF7_UNIT_TAG_DEFAULT = "26948cd";
const CF7_FORM_POST_ID_DEFAULT = "211";

// CF7 mail-tags from your shortcode:
// [text* text-45 ...]
// [email* email-669 ...]
// [select* select-355 ... "Wedding" ...]
// [text text-305 ...]
// [date* date-821 ...]
// [text text-483 ...]
// [textarea* textarea-428 ...] Message/details
const CF7_TAG_FIRST_NAME = "text-45";
const CF7_TAG_EMAIL = "email-669";
const CF7_TAG_EVENT_TYPE = "select-355";
const CF7_TAG_LOCATION = "text-305";
const CF7_TAG_EVENT_DATE = "date-821";
const CF7_TAG_DURATION = "text-483";
const CF7_TAG_MESSAGE = "textarea-428";

function getWpBaseUrl(): string | null {
  const wp = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  if (!wp) return null;
  return wp.replace(/\/+$/, "");
}

function cf7RestFormIds(): string[] {
  const ids: string[] = [];
  const envPostId = process.env.NEXT_PUBLIC_CF7_FORM_POST_ID;
  if (envPostId && envPostId.trim()) ids.push(envPostId.trim());

  // Backup: attempt numeric-only derived id from the unit tag, but primary is env numeric.
  const numericBackup = CF7_UNIT_TAG_DEFAULT.replace(/\D+/g, "");
  if (numericBackup) ids.push(numericBackup);

  // De-dupe.
  return [...new Set(ids)];
}

function cf7FeedbackUrls(wpBase: string, formId: string): string[] {
  const wp = wpBase.replace(/\/+$/, "");
  const pathStyle = `${wp}/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`;
  const restRouteStyle = `${wp}/?rest_route=/contact-form-7/v1/contact-forms/${formId}/feedback`;
  return [pathStyle, restRouteStyle];
}

export async function submitCf7Feedback(
  input: Cf7SubmitInput
): Promise<{ ok: true }> {
  const wp = getWpBaseUrl();
  if (!wp) {
    throw new Error(
      "WordPress CF7 not configured: set NEXT_PUBLIC_WORDPRESS_URL in frontend/.env.local"
    );
  }

  const unitTag = process.env.NEXT_PUBLIC_CF7_UNIT_TAG ?? CF7_UNIT_TAG_DEFAULT;
  if (!unitTag) {
    throw new Error(
      "WordPress CF7 not configured: set NEXT_PUBLIC_CF7_UNIT_TAG in frontend/.env.local"
    );
  }

  let lastErr: unknown = null;

  for (const cf7FormId of cf7RestFormIds()) {
    if (!cf7FormId) continue;
    const urls = cf7FeedbackUrls(wp, cf7FormId);

    for (const url of urls) {
      const fd = new FormData();
      // _wpcf7 = numeric form post ID
      fd.append("_wpcf7", cf7FormId);
      // _wpcf7_unit_tag = shortcode/unit tag
      fd.append("_wpcf7_unit_tag", unitTag);
      fd.append("_wpcf7_version", "5.9");
      fd.append(CF7_TAG_FIRST_NAME, input.firstName);
      fd.append(CF7_TAG_EMAIL, input.email);
      if (input.eventType) fd.append(CF7_TAG_EVENT_TYPE, input.eventType);
      if (input.location) fd.append(CF7_TAG_LOCATION, input.location);
      if (input.eventDate) fd.append(CF7_TAG_EVENT_DATE, input.eventDate);
      if (input.duration) fd.append(CF7_TAG_DURATION, input.duration);
      fd.append(CF7_TAG_MESSAGE, input.message);

      try {
        const res = await fetch(url, {
          method: "POST",
          body: fd,
          headers: { Accept: "application/json" },
        });

        const data = (await res.json().catch(() => null)) as
          | { status?: string; message?: string }
          | null;

        if (!res.ok) {
          // If endpoint exists but id is wrong, CF7 commonly returns 404.
          lastErr = data?.message || `HTTP ${res.status}`;
          if (res.status === 404) continue;
          throw new Error(data?.message || "WordPress rejected the request.");
        }

        // Be strict: only consider it a real success if CF7 says mail was sent.
        if (data?.status) {
          if (data.status === "mail_sent") return { ok: true };
          if (data.status === "mail_failed") {
            throw new Error(data.message || "CF7 mail_failed.");
          }

          throw new Error(
            `CF7 did not confirm mail_sent (status=${data.status}${
              data.message ? `, message=${data.message}` : ""
            }).`
          );
        }

        // If CF7 didn't send a structured status, fall back to HTTP 2xx.
        return { ok: true };
      } catch (e) {
        lastErr = e;
        // Try next url (and/or next id).
      }
    }
  }

  const msg =
    lastErr instanceof Error ? lastErr.message : "WordPress rejected the request.";
  throw new Error(msg);
}

