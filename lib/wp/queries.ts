/**
 * Artist posts: WPGraphQL + ACF group `artists` on Post.
 * If image fields error in GraphiQL, try `image1 { sourceUrl }` (no `node`) per your schema.
 */

/** Passed to posts(where: { categoryName }), often the category slug (e.g. artist) or name. */
export const ARTISTS_GRAPHQL_CATEGORY =
  process.env.ARTISTS_GRAPHQL_CATEGORY ?? "Artist";

/** Used to detect artist posts via post.categories (slug/name), e.g. artist */
export const ARTISTS_CATEGORY_SLUG =
  process.env.ARTISTS_CATEGORY_SLUG ?? "artist";

const ARTIST_ARCHIVE_NODE_FIELDS = `
        id
        slug
        title
        tags(first: 8) {
          nodes {
            name
          }
        }
        artists {
          artistName
          bioEn
          bioHr
          eventType
          vibe
          hoverPreviewEn
          hoverPreviewHr
          # In your schema, image1/image2/image3 are plain String URLs.
          # Request them without sub-selections to avoid:
          # "Field \"image1\" of type \"String\" must not have a sub selection".
          image1
          image2
          image3
        }
`;

export const QUERY_ARTISTS =
  `
  query GetArtistPosts($first: Int, $category: String!) {
    posts(
      first: $first
      where: {
        categoryName: $category
        orderby: { field: MENU_ORDER, order: ASC }
      }
    ) {
      nodes {
` +
  ARTIST_ARCHIVE_NODE_FIELDS +
  `
      }
    }
  }
`;

/** Paginated list for archive, same node shape as {@link QUERY_ARTISTS}. */
export const QUERY_ARTISTS_PAGE =
  `
  query GetArtistPostsPage($first: Int!, $after: String, $category: String!) {
    posts(
      first: $first
      after: $after
      where: {
        categoryName: $category
        orderby: { field: MENU_ORDER, order: ASC }
      }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
` +
  ARTIST_ARCHIVE_NODE_FIELDS +
  `
      }
    }
  }
`;

/** Single artist, categories for journal routing; ACF for display */
export const QUERY_ARTIST_BY_SLUG = `
  query GetArtistBySlug($slug: String!) {
    posts(first: 1, where: { name: $slug }) {
      nodes {
        slug
        title
        tags(first: 12) {
          nodes {
            name
          }
        }
        categories {
          nodes {
            slug
            name
          }
        }
        artists {
          artistName
          bioEn
          bioHr
          eventType
          vibe
          hoverPreviewEn
          hoverPreviewHr
          # Same schema note as archive: images are String URLs.
          image1
          image2
          image3
        }
      }
    }
  }
`;

export const QUERY_POST_BY_SLUG = `
  query PostBySlug($slug: String!) {
    post(id: $slug, idType: SLUG) {
      slug
      title
      date
      excerpt
      content
      categories {
        nodes {
          slug
          name
        }
      }
      tags(first: 8) {
        nodes {
          name
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;
