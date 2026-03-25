 "use client";

import type { WpPostNode } from "@/lib/wp/types";
import Link from "next/link";
import { useLang } from "@/components/i18n/LanguageProvider";

type Props = { post: WpPostNode };

export function JournalPostView({ post }: Props) {
  const { lang } = useLang();
  const HARD_CODED_JOURNAL_SLUG = "journal-post";
  const HARD_CODED_JOURNAL_TITLE_HR =
    "Kako izgleda svirati na vjenčanju u Villi Dalmacija – Fjok Collective DJ spotlight lokacije";
  const HARD_CODED_JOURNAL_CATEGORY_HR = "Izdvojena lokacija";

  const isHardcodedJournal = post.slug === HARD_CODED_JOURNAL_SLUG;

  const title =
    lang === "hr" && isHardcodedJournal
      ? HARD_CODED_JOURNAL_TITLE_HR
      : post.title ?? "";
  const date = post.date
    ? new Date(post.date).toLocaleDateString("en-GB")
    : "";
  const cat =
    lang === "hr" && isHardcodedJournal
      ? HARD_CODED_JOURNAL_CATEGORY_HR
      : post.categories?.nodes?.[0]?.name ?? "Journal";
  const img = post.featuredImage?.node?.sourceUrl ?? "";
  const alt = post.featuredImage?.node?.altText ?? title;
  const html = post.content ?? "";

  return (
    <section id="journal-post" className="journal-post-section">
      <div className="journal-post-container">
        <div className="journal-post-header">
          <p className="journal-post-meta">
            {date} / {cat}
          </p>
          <h1 className="journal-post-title">{title}</h1>
        </div>
        {img ? (
          <div className="journal-post-featured-image">
            <img src={img} alt={alt} />
          </div>
        ) : null}
        <div className="journal-post-content">
          <div
            className="journal-post-body wp-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
        <div className="journal-post-related">
          <Link href="/journal" className="journal-back-link">
            ← {lang === "hr" ? "Povratak na blog" : "Back to journal"}
          </Link>
        </div>
      </div>
    </section>
  );
}
