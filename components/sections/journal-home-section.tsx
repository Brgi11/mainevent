"use client";

import type { JournalCard } from "@/lib/data/posts";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/components/i18n/LanguageProvider";

const TLDR_SCOPE = "[data-journal-tldr-scope]";
const HARD_CODED_JOURNAL_SLUG = "journal-post";
const HARD_CODED_JOURNAL_TITLE_HR =
  "Kako izgleda svirati na vjenčanju u Villi Dalmacija – Fjok Collective DJ spotlight lokacije";
const HARD_CODED_JOURNAL_CATEGORY_HR = "Izdvojena lokacija";
const HARD_CODED_JOURNAL_DESCRIPTION_HR =
  "Villa Dalmacija u Splitu jedna je od rijetkih lokacija koja ima sve: povijest, šarm, pogled na more i onu opuštenu mediteransku energiju koju parovi obožavaju. I naravno, puno parkirnog prostora koji mi posebno cijenimo.";

type JournalHomeSectionProps = {
  posts: JournalCard[];
  /** `home`: compact strip + link to /journal. `archive`: full journal page. */
  mode?: "home" | "archive";
};

export function JournalHomeSection({
  posts,
  mode = "home",
}: JournalHomeSectionProps) {
  const { lang } = useLang();
  const categories = useMemo(() => {
    const names = new Set<string>();
    for (const p of posts) {
      if (p.category) names.add(p.category);
    }
    return ["All", ...Array.from(names).sort((a, b) => a.localeCompare(b))];
  }, [posts]);

  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    if (activeCategory === "All") return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [posts, activeCategory]);

  useEffect(() => {
    function handleTldr(e: Event) {
      e.preventDefault();
      e.stopPropagation();
      const btn = e.currentTarget as HTMLButtonElement;
      if (!btn.closest(TLDR_SCOPE)) return;
      const wrap = btn.closest(".journal-page-image-wrapper");
      if (!wrap) return;
      const active = wrap.classList.contains("mobile-description-active");
      document
        .querySelectorAll(`${TLDR_SCOPE} .journal-page-image-wrapper`)
        .forEach((w) => {
          w.classList.remove("mobile-description-active");
          w.querySelector(".journal-page-tldr-button")?.classList.remove("active");
        });
      if (!active) {
        wrap.classList.add("mobile-description-active");
        btn.classList.add("active");
      }
    }

    const buttons = document.querySelectorAll(
      `${TLDR_SCOPE} .journal-page-tldr-button`
    );
    buttons.forEach((b) => {
      b.addEventListener("click", handleTldr);
      b.addEventListener("touchend", handleTldr);
    });
    return () => {
      buttons.forEach((b) => {
        b.removeEventListener("click", handleTldr);
        b.removeEventListener("touchend", handleTldr);
      });
    };
  }, [filtered]);

  if (posts.length === 0) return null;

  const isHome = mode === "home";

  return (
    <section
      id={isHome ? "journal" : "journal-page"}
      className={
        isHome
          ? "journal-page-section journal-posts-browser journal-home-compact"
          : "journal-page-section journal-posts-browser"
      }
      data-journal-tldr-scope
      aria-labelledby={isHome ? "journal-home-heading" : "journal-archive-heading"}
    >
      <div className="journal-page-container">
        <h2
          id={isHome ? "journal-home-heading" : "journal-archive-heading"}
          className="journal-page-title"
        >
          {lang === "hr" ? "novosti." : "journal."}
        </h2>
        {isHome ? null : (
          <p className="journal-page-description">
            Stay updated with our latest events, news, and behind-the-scenes
            stories from Main Event.
          </p>
        )}
        <div className="journal-home-toolbar">
          {isHome ? (
            <Link href="/journal" className="journal-home-archive-link">
              {lang === "hr" ? "Pogledaj sve →" : "View all →"}
            </Link>
          ) : (
            <div
              className="journal-home-filters"
              role="group"
              aria-label="Filter by category"
            >
              {categories.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={
                    name === activeCategory
                      ? "journal-home-filter journal-home-filter-active"
                      : "journal-home-filter"
                  }
                  onClick={() => setActiveCategory(name)}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
        {!isHome ? (
          <p className="journal-home-count" aria-live="polite">
            {filtered.length} post{filtered.length === 1 ? "" : "s"}
            {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
          </p>
        ) : null}
        <div className="journal-page-cards journal-home-cards">
          {filtered.map((p) => (
            (() => {
              const isHardcodedJournal = p.slug === HARD_CODED_JOURNAL_SLUG;
              const title =
                lang === "hr" && isHardcodedJournal
                  ? HARD_CODED_JOURNAL_TITLE_HR
                  : p.title;
              const category =
                lang === "hr" && isHardcodedJournal
                  ? HARD_CODED_JOURNAL_CATEGORY_HR
                  : p.category;
              const description =
                lang === "hr" && isHardcodedJournal
                  ? HARD_CODED_JOURNAL_DESCRIPTION_HR
                  : p.description;

              return (
            <Link
              key={p.slug}
              href={`/journal/${p.slug}`}
              className="journal-page-card"
              onClick={(e) => {
                const el = e.target as HTMLElement;
                if (
                  el.closest(".journal-page-tldr-button") ||
                  el.closest(".journal-page-description-overlay")
                ) {
                  e.preventDefault();
                }
              }}
            >
              <div className="journal-page-image-wrapper">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="journal-page-image"
                  />
                ) : null}
                {description ? (
                  <>
                    <div className="journal-page-description-overlay">
                      <p className="journal-page-description-text">
                        {description}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="journal-page-tldr-button"
                      aria-label="Show description"
                    >
                      TLDR
                    </button>
                  </>
                ) : null}
              </div>
              <p className="journal-page-card-meta">
                {p.date} / {category}
              </p>
              <h3 className="journal-page-card-title">{title}</h3>
            </Link>
              );
            })()
          ))}
        </div>
      </div>
    </section>
  );
}
