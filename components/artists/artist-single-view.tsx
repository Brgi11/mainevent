"use client";

import { acfImageAlt, acfImageUrl } from "@/lib/wp/acf-media";
import type { WpArtistPostNode } from "@/lib/wp/types";
import { getArtistDisplayName } from "@/lib/data/artists";
import Link from "next/link";
import { ArtistFaqStatic } from "./artist-faq-static";
import { ArtistInquiryForm } from "@/components/artists/artist-inquiry-form";
import { useEffect, useMemo, useState } from "react";

type Props = { post: WpArtistPostNode };

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  if (typeof value === "string") return [value];
  return [];
}

export function ArtistSingleView({ post }: Props) {
  const slug = post.slug ?? "";
  const acf = post.artists;
  const name = getArtistDisplayName(post);
  const eventTypes = toStringArray(acf?.eventType).map((s) => s.trim()).filter(Boolean);
  const vibes = toStringArray(acf?.vibe).map((s) => s.trim()).filter(Boolean);
  const tagNames =
    post.tags?.nodes
      ?.map((t) => (typeof t?.name === "string" ? t.name.trim() : ""))
      .filter(Boolean) ?? [];

  const mainImageDefault = acfImageUrl(acf?.image1);
  const alt = acfImageAlt(acf?.image1, name);
  const bioHtml = (acf?.bioEn?.trim() || acf?.bioHr?.trim() || "").trim();

  const galleryUrlsDefault = useMemo(
    () => [acfImageUrl(acf?.image2), acfImageUrl(acf?.image3)].filter(Boolean),
    [acf?.image2, acf?.image3]
  );

  // We swap the clicked thumbnail with the main image:
  //  - new main = clicked thumbnail
  //  - clicked thumbnail slot becomes the old main image
  const [mainImage, setMainImage] = useState<string>(mainImageDefault);
  const [galleryUrls, setGalleryUrls] = useState<string[]>(galleryUrlsDefault);

  const galleryKey = galleryUrlsDefault.join("|");
  useEffect(() => {
    setMainImage(mainImageDefault);
    setGalleryUrls(galleryUrlsDefault);
  }, [mainImageDefault, galleryKey]);

  return (
    <section id="artist-single" className="artist-single-section">
      <div className="artist-single-container">
        <div className="artist-single-topbar">
          <Link href="/artists" className="artist-single-back" scroll>
            ← Back to artists
          </Link>
        </div>
        <div className="artist-landing">
          <div className="artist-main-content">
            <div className="artist-main-image-wrapper">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={alt}
                  className="artist-main-image"
                />
              ) : null}
            </div>
            <div className="artist-info-content">
              <h1 className="artist-single-name">{name}</h1>

              {tagNames.length > 0 ? (
                <p className="artist-single-tags" aria-label="Tags">
                  {tagNames.join(" / ")}
                </p>
              ) : null}

              {eventTypes.length > 0 || vibes.length > 0 ? (
                <div className="artist-single-traits" aria-label="Artist traits">
                  {eventTypes.length > 0 ? (
                    <div className="artist-single-trait">
                      <p className="artist-single-trait-label">Event type</p>
                      <p className="artist-single-trait-value">
                        {eventTypes.join(" · ")}
                      </p>
                    </div>
                  ) : null}
                  {vibes.length > 0 ? (
                    <div className="artist-single-trait">
                      <p className="artist-single-trait-label">Vibe</p>
                      <p className="artist-single-trait-value">
                        {vibes.join(" · ")}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {bioHtml ? (
                <div
                  className="artist-single-description wp-content"
                  dangerouslySetInnerHTML={{ __html: bioHtml }}
                />
              ) : null}
              <div className="artist-cta-wrapper">
                <Link href="#contact-form" className="artist-cta-button" scroll>
                  Send Inquiry
                </Link>
              </div>
            </div>
          </div>
          {galleryUrls.length > 0 ? (
            <div className="artist-gallery" role="list">
              {galleryUrls.map((url, idx) => {
                return (
                  <button
                    key={idx}
                    type="button"
                    className="gallery-thumbnail"
                    role="listitem"
                    onClick={() => {
                      const oldMain = mainImage;
                      const newMain = url;
                      setMainImage(newMain);
                      setGalleryUrls((prev) => {
                        const next = [...prev];
                        next[idx] = oldMain;
                        return next;
                      });
                    }}
                    aria-label="Select gallery image"
                  >
                    <img src={url} alt="" />
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <ArtistFaqStatic />
        <ArtistInquiryForm artistSlug={slug} artistName={name} />
      </div>
    </section>
  );
}
