import { getArtistsArchiveFromWordPress } from "@/lib/data/artists";
import { isArtistCategoryTerm } from "@/lib/wp/artist-category";
import { wpGraphQL } from "@/lib/wp/graphql";
import { QUERY_POST_BY_SLUG } from "@/lib/wp/queries";
import type { WpPostNode } from "@/lib/wp/types";
import { stripExcerpt } from "@/lib/wp/types";

type PostsData = { posts?: { nodes?: WpPostNode[] | null } | null };
type PostsPageData = {
  posts?: {
    pageInfo?: {
      hasNextPage?: boolean | null;
      endCursor?: string | null;
    } | null;
    nodes?: WpPostNode[] | null;
  } | null;
};
type PostData = { post?: WpPostNode | null };

export type JournalCard = {
  slug: string;
  title: string;
  date: string;
  category: string;
  imageUrl: string;
  description: string;
};

/**
 * TEMPORARY: hardcode the only journal post you provided via `journal-post.html`.
 * This avoids WPGraphQL rewrites / querying for now.
 */
const HARD_CODED_JOURNAL_SLUG = "journal-post";

const HARD_CODED_JOURNAL_TITLE =
  "What It's Like Playing a Wedding at Villa Dalmacija – Fjok Collective DJ's venue spotlight";

const HARD_CODED_JOURNAL_CATEGORY = "Venue Spotlight";

// Parsed from `09/5/2025` (dd/mm/yyyy) in `journal-post.html`
const HARD_CODED_JOURNAL_DATE_ISO = "2025-05-09T00:00:00.000Z";

const HARD_CODED_JOURNAL_FEATURED_IMAGE_URL =
  "https://eiz.hr/mainevent/wp-content/uploads/2026/03/Drone-6-scaled-1.jpeg";

const HARD_CODED_JOURNAL_FEATURED_IMAGE_ALT =
  "Villa Dalmacija – Fjok Collective DJ's venue spotlight";

// Excerpt used for the card: we keep it as HTML because `stripExcerpt()` handles it.
const HARD_CODED_JOURNAL_EXCERPT = `<p class="journal-post-intro">Villa Dalmacija in Split is one of those rare venues that has it all: history, charm, sea views, and that relaxed Mediterranean energy couples love. AND of course, plenty of parking space which we love and adore.</p>`;

const HARD_CODED_JOURNAL_CONTENT = `
<p class="journal-post-intro">Villa Dalmacija in Split is one of those rare venues that has it all: history, charm, sea views, and that relaxed Mediterranean energy couples love. AND of course, plenty of parking space which we love and adore.</p>

<p>Here's how we usually approach the day and what couples can expect when they book us for their Villa Dalmacija wedding.</p>

<h2 class="journal-post-subtitle">Garden Cocktails</h2>
<p>When the ceremony ends, our day usually kicks off in the villa's garden with cocktails and smiles all around. For this part, we set up a smaller DJ booth tucked neatly into the space, so it blends with the vibe without being in the way. We keep the music light and sunny. Think tropical beats, funky pop, and laid-back disco. It's the kind of playlist that gets heads nodding, setting the perfect tone without overpowering conversations. Of course, we curate these playlists based on your preferences so no cocktail hour is truly the same, but the vibe is there!</p>

<div class="journal-post-inline-image">
  <img src="https://eiz.hr/mainevent/wp-content/uploads/2026/03/Drone-10-scaled-1.jpeg" alt="Villa Dalmacija garden cocktails">
</div>

<h2 class="journal-post-subtitle">Dinner</h2>
<p>Once everyone moves to the dinner area, the mood shifts, and so does the music. We go into background mode – smooth tunes that add atmosphere without stealing the spotlight.</p>
<p>Our saxophonist jumps in between courses with a few live moments – just enough to keep the energy up and give guests something to smile at while they wait for the next plate.</p>
<p>We're also there to help with:</p>
<ul>
  <li>Playing entrance songs or special tracks,</li>
  <li>Timing music for speeches and toasts</li>
  <li>Making sure transitions between dinner moments feel natural</li>
</ul>

<h2 class="journal-post-subtitle">The Party</h2>
<p>After dinner, it's game time. We usually open the dance floor with some classic songs that get the older guests moving and loosen everyone up. From there, we read the room and slowly shift into more personal favorites that we've discussed with the couple beforehand.</p>
<p>This part is always different, depending on the couple and their friends – but whether it's singalongs, house beats, or something off the beaten path, we're all in.</p>

<h2 class="journal-post-subtitle">Why Couples Love Working with Us at Villa Dalmacija</h2>
<ul>
  <li>We're locals who know the space and how to use it. Separate setups for garden and courtyard area.</li>
  <li>We balance DJing with live saxophone to keep things dynamic.</li>
  <li>We're chill, responsive, and always in sync with the flow of the day.</li>
  <li>Most importantly, we know when to bring the energy and when to hold back.</li>
</ul>

<p>If you're planning your wedding at Villa Dalmacija, don't hesitate to reach out!</p>
 
<div class="journal-post-gallery">
  <img src="https://eiz.hr/mainevent/wp-content/uploads/2026/03/KJ-173-scaled-1.jpeg" alt="Villa Dalmacija wedding" />
  <img src="https://eiz.hr/mainevent/wp-content/uploads/2026/03/KJ-177-scaled-1.jpeg" alt="Villa Dalmacija wedding" />
  <img src="https://eiz.hr/mainevent/wp-content/uploads/2026/03/Drone-scaled-1.jpeg" alt="Villa Dalmacija aerial view" />
</div>
`;

function hardcodedJournalPost(): WpPostNode {
  return {
    slug: HARD_CODED_JOURNAL_SLUG,
    title: HARD_CODED_JOURNAL_TITLE,
    excerpt: HARD_CODED_JOURNAL_EXCERPT,
    date: HARD_CODED_JOURNAL_DATE_ISO,
    categories: {
      nodes: [
        {
          slug: "",
          name: HARD_CODED_JOURNAL_CATEGORY,
        },
      ],
    },
    featuredImage: {
      node: {
        sourceUrl: HARD_CODED_JOURNAL_FEATURED_IMAGE_URL,
        altText: HARD_CODED_JOURNAL_FEATURED_IMAGE_ALT,
      },
    },
    content: HARD_CODED_JOURNAL_CONTENT,
  };
}

const JOURNAL_POST_FIELDS = `
  slug
  title
  excerpt
  date
  categories {
    nodes {
      slug
      name
    }
  }
  featuredImage {
    node {
      sourceUrl
      altText
    }
  }
`;

const QUERY_JOURNAL_POSTS =
  `
    query JournalPosts($first: Int!) {
      posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
` +
  JOURNAL_POST_FIELDS +
  `
        }
      }
    }
  `;

const QUERY_JOURNAL_POSTS_PAGE =
  `
    query JournalPostsPage($first: Int!, $after: String) {
      posts(
        first: $first
        after: $after
        where: { orderby: { field: DATE, order: DESC } }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
` +
  JOURNAL_POST_FIELDS +
  `
        }
      }
    }
  `;

function filterJournalNodes(nodes: WpPostNode[]): WpPostNode[] {
  return nodes.filter(
    (n) => !(n.categories?.nodes ?? []).some((c) => isArtistCategoryTerm(c))
  );
}

/** Journal = published posts that are not in the artists category. */
export async function getJournalPosts(first = 48): Promise<WpPostNode[]> {
  // TEMP: Hardcoded single post
  return first >= 1 ? [hardcodedJournalPost()] : [];
}

/**
 * Fetches journal posts with cursor pagination until `maxTotal` non-artist posts
 * are collected or the connection ends. Use on the homepage when you need the
 * full set for client-side filtering.
 */
async function fetchJournalPostsPage(
  first: number,
  cursor: string | undefined
): Promise<PostsPageData["posts"]> {
  const vars: Record<string, unknown> = { first };
  if (cursor) vars.after = cursor;
  const { data } = await wpGraphQL<PostsPageData>(
    QUERY_JOURNAL_POSTS_PAGE,
    vars
  );
  return data?.posts ?? null;
}

export async function getAllJournalPosts(maxTotal = 300): Promise<WpPostNode[]> {
  // TEMP: Hardcoded single post
  return maxTotal >= 1 ? [hardcodedJournalPost()] : [];
}

export async function getJournalPostBySlug(slug: string) {
  // TEMP: Hardcoded single post
  if (slug !== HARD_CODED_JOURNAL_SLUG) return null;
  return hardcodedJournalPost();
}

export function postToJournalCardModel(post: WpPostNode): JournalCard {
  const slug = post.slug ?? "";
  const title = post.title ?? slug;
  const date = post.date ? formatPostDate(post.date) : "";
  const category =
    post.categories?.nodes?.find((c) => c?.name)?.name ?? "Journal";
  const imageUrl = post.featuredImage?.node?.sourceUrl ?? "";
  const description = post.excerpt ? stripExcerpt(post.excerpt) : "";
  return { slug, title, date, category, imageUrl, description };
}

function formatPostDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB");
}

/** Slugs for generateStaticParams – optional. */
export async function getArtistSlugs(): Promise<string[]> {
  const { artists, status } = await getArtistsArchiveFromWordPress({
    maxArtists: 500,
  });
  if (status !== "ok") return [];
  return artists.map((a) => a.slug);
}

export async function getJournalSlugs(): Promise<string[]> {
  return [HARD_CODED_JOURNAL_SLUG];
}
