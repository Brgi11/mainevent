import type { WpAcfImageish } from "@/lib/wp/acf-media";

export type WpFeaturedImage = {
  node?: {
    sourceUrl?: string | null;
    altText?: string | null;
  } | null;
} | null;

export type WpTermNode = { name?: string | null; slug?: string | null };

/** ACF group exposed as `artists` on Post (camelCase in GraphQL). */
export type WpArtistAcf = {
  artistName?: string | null;
  bioEn?: string | null;
  bioHr?: string | null;
  // WPGraphQL can expose these as a list of strings (e.g. ["Wedding","Corporate"...]).
  // Some installs may still return a single string, so we allow both.
  eventType?: string[] | string | null;
  vibe?: string[] | string | null;
  hoverPreviewEn?: string | null;
  hoverPreviewHr?: string | null;
  image1?: WpAcfImageish;
  image2?: WpAcfImageish;
  image3?: WpAcfImageish;
} | null;

export type WpArtistPostNode = {
  slug?: string | null;
  title?: string | null;
  excerpt?: string | null;
  content?: string | null;
  date?: string | null;
  tags?: { nodes?: WpTermNode[] | null } | null;
  categories?: { nodes?: WpTermNode[] | null } | null;
  featuredImage?: WpFeaturedImage;
  artists?: WpArtistAcf;
};

/** Journal and artist posts share the same node shape; `artists` is only on artist queries. */
export type WpPostNode = WpArtistPostNode;

export type ArtistCardModel = {
  slug: string;
  name: string;
  typeLabel: string;
  tagLabel: string;
  // Normalized arrays (lower-cased) used for filtering.
  eventType: string[];
  vibe: string[];
  imageUrl: string;
  hoverText: string;
};

export function stripExcerpt(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}
