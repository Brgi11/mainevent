"use client";

import type { ArtistsArchiveStatus } from "@/lib/data/artists";
import type { ArtistCardModel } from "@/lib/wp/types";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useLang } from "@/components/i18n/LanguageProvider";

type Props = {
  artists: ArtistCardModel[];
  loadStatus: ArtistsArchiveStatus;
  errorDetail?: string;
  /** Shown only in dev-oriented empty states (category filter hint). */
  categoryFilter?: string;
};

const EVENT_TYPE_OPTIONS = [
  { value: "all", label: "All Events" },
  { value: "wedding", label: "Wedding" },
  { value: "corporate", label: "Corporate" },
  { value: "yacht", label: "Yacht" },
  { value: "private", label: "Private" },
] as const;

const VIBE_OPTIONS = [
  { value: "all", label: "All Vibes" },
  { value: "elegant", label: "Elegant" },
  { value: "energetic", label: "Energetic" },
  { value: "lounge", label: "Lounge" },
  { value: "party", label: "Party" },
  { value: "acoustic", label: "Acoustic" },
] as const;

export function ArtistsArchiveClient({
  artists,
  loadStatus,
  errorDetail,
  categoryFilter,
}: Props) {
  const { lang } = useLang();
  const isHr = lang === "hr";

  const notice =
    loadStatus === "no_endpoint"
      ? {
          title: "WordPress is not connected",
          body: "Set NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL (or WORDPRESS_GRAPHQL_URL) and WORDPRESS_URL in Netlify environment variables (or frontend/.env.local locally), then clear cache and redeploy.",
        }
      : loadStatus === "fetch_error"
        ? {
            title: "Could not load artists",
            body: "The GraphQL request failed. Check the endpoint URL, that WPGraphQL is active, and the server console for [wpGraphQL] errors.",
          }
        : loadStatus === "empty"
          ? {
              title: "No artists in WordPress yet",
              body: `Publish posts in the artist category (GraphQL filter: categoryName "${categoryFilter ?? "Artist"}") with the ACF artists fields filled in.`,
            }
          : null;

  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [vibeFilter, setVibeFilter] = useState("all");

  const filtered = useMemo(() => {
    let out = artists;
    if (eventTypeFilter !== "all") {
      const f = eventTypeFilter.toLowerCase();
      out = out.filter((a) => a.eventType.includes(f));
    }
    if (vibeFilter !== "all") {
      const f = vibeFilter.toLowerCase();
      out = out.filter((a) => a.vibe.includes(f));
    }
    return out;
  }, [artists, eventTypeFilter, vibeFilter]);

  useEffect(() => {
    function handleTldr(e: Event) {
      e.preventDefault();
      (e as Event).stopPropagation();
      const btn = e.currentTarget as HTMLButtonElement;
      const imageWrapper = btn.closest(".artist-page-image-wrapper");
      if (!imageWrapper) return;
      const isActive = imageWrapper.classList.contains("mobile-description-active");
      document
        .querySelectorAll("[data-artists-tldr-scope] .artist-page-image-wrapper")
        .forEach((wrapper) => {
          wrapper.classList.remove("mobile-description-active");
          wrapper
            .querySelector(".artist-page-tldr-button")
            ?.classList.remove("active");
        });
      if (!isActive) {
        imageWrapper.classList.add("mobile-description-active");
        btn.classList.add("active");
      }
    }

    const scope = document.querySelector("[data-artists-tldr-scope]");
    if (!scope) return;
    const buttons = scope.querySelectorAll(".artist-page-tldr-button");
    buttons.forEach((button) => {
      button.addEventListener("click", handleTldr);
      button.addEventListener("touchend", handleTldr);
    });

    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("click", handleTldr);
        button.removeEventListener("touchend", handleTldr);
      });
    };
  }, [filtered]);

  return (
    <section
      id="artists-page"
      className="artists-page-section"
      data-artists-tldr-scope
    >
      <div className="artists-page-container">
        <h2 className="artists-page-title">
          {isHr ? "izvođači." : "artists."}
        </h2>
        <p className="artists-page-description">
          {isHr
            ? "Otkrijte naš pažljivo odabran izbor talentiranih izvođača. Od DJ-eva do live glazbenika, donosimo savršen zvuk koji podiže vaš događaj na višu razinu."
            : "Discover our curated selection of talented performers. From DJs to live musicians, we bring the perfect sound to elevate your event."}
        </p>

        {notice ? (
          <div className="artists-page-wp-notice" role="status">
            <p className="artists-page-wp-notice-title">{notice.title}</p>
            <p className="artists-page-wp-notice-body">{notice.body}</p>
            {loadStatus === "fetch_error" && errorDetail ? (
              <pre className="artists-page-wp-notice-detail">{errorDetail}</pre>
            ) : null}
            {loadStatus === "fetch_error" ? (
              <ul className="artists-page-wp-notice-hint">
                <li>
                  Confirm <code>NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL</code> (or{" "}
                  <code>WORDPRESS_GRAPHQL_URL</code>) in <code>.env.local</code>{" "}
                  matches WP Admin → GraphQL → Settings (ends with{" "}
                  <code>/graphql</code>).
                </li>
                <li>
                  From the same PC (PowerShell), replace the URL:
                  <code className="artists-page-wp-notice-cmd">
                    {`Invoke-WebRequest -Uri "YOUR_GRAPHQL_URL" -Method Post -ContentType "application/json" -Body '{"query":"{ __typename }"}'`}
                  </code>
                </li>
                <li>
                  If the browser opens the site but Node fails: SSL/proxy/VPN/firewall
                  or antivirus HTTPS scanning, try another network or pause SSL
                  inspection for that host.
                </li>
              </ul>
            ) : null}
          </div>
        ) : null}

        {loadStatus !== "ok" ? null : (
          <>
            <div className="artists-filters">
              <div className="filter-group">
                <label htmlFor="eventTypeFilter" className="filter-label">
                  {isHr ? "Tip događaja" : "EVENT TYPE"}
                </label>
                <select
                  id="eventTypeFilter"
                  className="filter-select"
                  value={eventTypeFilter}
                  onChange={(e) => setEventTypeFilter(e.target.value)}
                >
                  {EVENT_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {isHr
                        ? o.value === "all"
                          ? "Svi događaji"
                          : o.value === "wedding"
                            ? "Vjenčanje"
                            : o.value === "corporate"
                              ? "Korporativno"
                              : o.value === "yacht"
                                ? "Jahta"
                                : o.value === "private"
                                  ? "Privatno"
                                  : ""
                        : o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="vibeFilter" className="filter-label">
                  {isHr ? "Atmosfera" : "VIBE"}
                </label>
                <select
                  id="vibeFilter"
                  className="filter-select"
                  value={vibeFilter}
                  onChange={(e) => setVibeFilter(e.target.value)}
                >
                  {VIBE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {isHr
                        ? o.value === "all"
                          ? "Sve atmosfere"
                          : o.value === "elegant"
                            ? "Elegantno"
                            : o.value === "energetic"
                              ? "Energično"
                              : o.value === "lounge"
                                ? "Lounge"
                                : o.value === "party"
                                  ? "Party"
                                  : o.value === "acoustic"
                                    ? "Akustično"
                                  : ""
                        : o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div
              className="artists-page-grid mainevent-artists-grid"
              id="artistsGrid"
            >
              {filtered.map((a) => (
                <Link
                  key={a.slug}
                  href={`/artists/${a.slug}`}
                  className="artist-page-card mainevent-artist-card"
                  data-artist-type={a.typeLabel}
                  scroll
                  onClick={(e) => {
                    const el = e.target as HTMLElement;
                    if (
                      el.closest(".artist-page-tldr-button") ||
                      el.closest(".artist-page-description-overlay")
                    ) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="artist-page-image-wrapper">
                    {a.imageUrl ? (
                      <img
                        src={a.imageUrl}
                        alt={a.name}
                        className="artist-page-image"
                      />
                    ) : null}
                    {a.hoverText ? (
                      <>
                        <div className="artist-page-description-overlay">
                          <p className="artist-page-description-text">
                            {a.hoverText}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="artist-page-tldr-button"
                          aria-label="Show description"
                        >
                          TLDR
                        </button>
                      </>
                    ) : null}
                  </div>
                  {a.tagLabel ? (
                    <p className="artist-page-card-meta">{a.tagLabel}</p>
                  ) : null}
                  <h3 className="artist-page-card-title">{a.name}</h3>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
