 "use client";

import Link from "next/link";
import { useLang } from "@/components/i18n/LanguageProvider";

const DEFAULT_HERO_BG =
  "https://eiz.hr/mainevent/wp-content/uploads/2026/03/heroHq.jpg";

export function HeroSection() {
  const { lang } = useLang();
  const bg =
    process.env.NEXT_PUBLIC_HERO_BACKGROUND_URL?.trim() || DEFAULT_HERO_BG;

  return (
    <section
      id="hero"
      className="hero-section"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.42), rgba(0,0,0,0.5)), url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="hero-container">
        <div className="hero-content">
          <img
            src="https://eiz.hr/mainevent/wp-content/uploads/2026/02/MainEventWhite.png"
            alt="Main Event"
            className="hero-logo"
          />
          <p className="hero-description">
            {lang === "hr" ? (
              <>
                Premium Izvođači i
                <br />
                Event Produkcija u Hrvatskoj
              </>
            ) : (
              <>
                premium entertainment
                <br />
                and event production.
              </>
            )}
          </p>
          {lang === "hr" ? null : (
            <p className="hero-location">based in Split, Croatia</p>
          )}
          <div className="hero-ctas">
            <Link href="/#artists" className="hero-link" scroll>
              {lang === "hr" ? "Pretraži Glazbenike." : "discover our artists"}{" "}
              →
            </Link>
            <Link href="/#contactForm" className="hero-link" scroll>
              {lang === "hr" ? "Kontaktiraj Nas." : "contact us"} →{" "}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
