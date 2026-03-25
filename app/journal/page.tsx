import { JournalHomeSection } from "@/components/sections/journal-home-section";
import { getAllJournalPosts, postToJournalCardModel } from "@/lib/data/posts";
import "@/styles/journal-page.css";

export const revalidate = 60;

export default async function JournalPage() {
  const wpPosts = await getAllJournalPosts(300);
  const cards = wpPosts.map(postToJournalCardModel);

  return (
    <>
      {cards.length === 0 ? (
        <section className="journal-page-section">
          <div className="journal-page-container">
            <h2 className="journal-page-title">journal.</h2>
            <p className="journal-page-description">
              No posts loaded yet. Set{" "}
              <code>NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL</code> (or{" "}
              <code>WORDPRESS_GRAPHQL_URL</code>) in <code>.env.local</code> and
              ensure posts exist outside the artists category.
            </p>
          </div>
        </section>
      ) : (
        <JournalHomeSection posts={cards} mode="archive" />
      )}
    </>
  );
}
