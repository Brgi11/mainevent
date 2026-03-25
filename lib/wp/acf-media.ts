/** Normalize ACF / WPGraphQL image fields (URL string, MediaItem, or node wrapper). */

export type WpAcfImageish =
  | string
  | null
  | undefined
  | {
      sourceUrl?: string | null;
      mediaItemUrl?: string | null;
      node?: {
        sourceUrl?: string | null;
        mediaItemUrl?: string | null;
        altText?: string | null;
      } | null;
    };

export function acfImageUrl(field: WpAcfImageish): string {
  if (field == null) return "";
  if (typeof field === "string") return field.trim();
  if (typeof field !== "object") return "";
  const direct = field.sourceUrl ?? field.mediaItemUrl;
  if (direct) return direct.trim();
  const n = field.node;
  if (!n) return "";
  return (n.sourceUrl ?? n.mediaItemUrl ?? "").trim();
}

export function acfImageAlt(field: WpAcfImageish, fallback: string): string {
  if (field != null && typeof field === "object" && field.node?.altText) {
    return field.node.altText.trim() || fallback;
  }
  return fallback;
}
