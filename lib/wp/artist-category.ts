import {
  ARTISTS_CATEGORY_SLUG,
  ARTISTS_GRAPHQL_CATEGORY,
} from "@/lib/wp/queries";
import type { WpTermNode } from "@/lib/wp/types";

/** True if this category term marks an artist post (slug or name vs env markers). */
export function isArtistCategoryTerm(c: WpTermNode | null | undefined): boolean {
  if (!c) return false;
  const markers = new Set(
    [ARTISTS_CATEGORY_SLUG, ARTISTS_GRAPHQL_CATEGORY]
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  );
  const slug = c.slug?.trim().toLowerCase() ?? "";
  const name = c.name?.trim().toLowerCase() ?? "";
  return markers.has(slug) || markers.has(name);
}

export function postHasArtistCategory(
  categories: { nodes?: WpTermNode[] | null } | null | undefined
): boolean {
  return (categories?.nodes ?? []).some((n) => isArtistCategoryTerm(n));
}
