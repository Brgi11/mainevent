"use client";

import type { ArtistCardModel } from "@/lib/wp/types";
import Link from "next/link";
import { useEffect } from "react";
import { useLang } from "@/components/i18n/LanguageProvider";

export function ArtistsHomeGrid({ artists }: { artists: ArtistCardModel[] }) {
  const { lang } = useLang();
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(
      ".artists-section .artist-card"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    cards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      observer.observe(card);
    });

    function handleTldr(e: Event) {
      if (e.type === "touchend") {
        e.preventDefault();
      }
      e.preventDefault();
      e.stopPropagation();
      const btn = e.currentTarget as HTMLButtonElement;
      const imageWrapper = btn.closest(".artist-image-wrapper");
      if (!imageWrapper) return;
      const isActive = imageWrapper.classList.contains(
        "mobile-description-active"
      );
      document
        .querySelectorAll(".artists-section .artist-image-wrapper")
        .forEach((wrapper) => {
          wrapper.classList.remove("mobile-description-active");
          wrapper
            .querySelector(".artist-tldr-button")
            ?.classList.remove("active");
        });
      if (!isActive) {
        imageWrapper.classList.add("mobile-description-active");
        btn.classList.add("active");
      }
    }

    const tldrButtons = document.querySelectorAll(
      ".artists-section .artist-tldr-button"
    );
    tldrButtons.forEach((button) => {
      button.addEventListener("click", handleTldr);
      button.addEventListener("touchend", handleTldr, { passive: false });
    });

    return () => {
      observer.disconnect();
      tldrButtons.forEach((button) => {
        button.removeEventListener("click", handleTldr);
        button.removeEventListener("touchend", handleTldr);
      });
    };
  }, [artists]);

  return (
    <section id="artists" className="artists-section">
      <div className="artists-container">
        <h2 className="artists-title">
          {lang === "hr" ? "naši izvođači." : "our artists."}
        </h2>
        <div className="artists-scroll-wrapper">
          <div className="artists-grid">
            {artists.map((a) => (
              <Link
                key={a.slug}
                href={`/artists/${a.slug}`}
                className="artist-card"
                data-artist-type={a.typeLabel}
              >
                <div className="artist-image-wrapper">
                  {a.imageUrl ? (
                    <img
                      src={a.imageUrl}
                      alt={a.name}
                      className="artist-image"
                    />
                  ) : null}
                  {a.hoverText ? (
                    <>
                      <div className="artist-description-overlay">
                        <p className="artist-description-text">{a.hoverText}</p>
                      </div>
                      <button
                        type="button"
                        className="artist-tldr-button"
                        aria-label={
                          lang === "hr" ? "Prikaži pregled" : "Show overview"
                        }
                      >
                        {lang === "hr" ? "Pregled" : "Overview"}
                      </button>
                    </>
                  ) : null}
                </div>
                {a.tagLabel ? (
                  <p className="artist-card-meta">{a.tagLabel}</p>
                ) : null}
                <h3 className="artist-card-title">{a.name}</h3>
              </Link>
            ))}
          </div>
        </div>
        <div className="artists-link-wrapper">
          <Link href="/artists" className="artists-link">
            {lang === "hr" ? "Pogledaj više. →" : "see more. →"}
          </Link>
        </div>
      </div>
    </section>
  );
}
