"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/components/i18n/LanguageProvider";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { lang, setLang } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("inner-page", !isHome);
    return () => document.body.classList.remove("inner-page");
  }, [isHome]);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const headerClass = isHome
    ? scrolled
      ? "scrolled"
      : "top"
    : "inner scrolled";

  return (
    <>
      <header id="header" className={headerClass}>
        <div className="nav">
          <Link href="/" className="logo">
            <img
              className="logo-light"
              src="https://eiz.hr/mainevent/wp-content/uploads/2026/02/MEsmallLogoWhite.png"
              alt="Main Event"
            />
            <img
              className="logo-dark"
              src="https://eiz.hr/mainevent/wp-content/uploads/2026/02/MEsmallLogoBlack.png"
              alt="Main Event"
            />
          </Link>

          <nav className="menu">
            <Link href="/artists">
              {lang === "hr" ? "izvođači." : "artists."}
            </Link>

            <div className="menu-item">
              <button type="button">
                <span>{lang === "hr" ? "produkcija." : "production."}</span>{" "}
                <span className="arrow"></span>
              </button>
              <div className="dropdown">
                <Link href="/sound">
                  {lang === "hr" ? "razglas." : "sound."}
                </Link>
                <Link href="/lighting">
                  {lang === "hr" ? "rasvjeta." : "lighting."}
                </Link>
              </div>
            </div>

            <div className="menu-item">
              <button type="button">
                <span>{lang === "hr" ? "istraži." : "explore."}</span>{" "}
                <span className="arrow"></span>
              </button>
              <div className="dropdown">
                <Link href="/about-us">
                  {lang === "hr" ? "o nama." : "about us."}
                </Link>
                <Link href="/journal">{lang === "hr" ? "novosti." : "journal."}</Link>
              </div>
            </div>

            <Link href="/#contact">{lang === "hr" ? "kontakt." : "contact."}</Link>

            <div className="language-switch">
              <button
                type="button"
                className={`lang-button${lang === "en" ? " active" : ""}`}
                data-lang="en"
                onClick={() => setLang("en")}
              >
                EN
              </button>
              <span className="lang-separator">/</span>
              <button
                type="button"
                className={`lang-button${lang === "hr" ? " active" : ""}`}
                data-lang="hr"
                onClick={() => setLang("hr")}
              >
                HR
              </button>
            </div>
          </nav>

          <button
            type="button"
            className="hamburger"
            id="hamburger"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            ☰
          </button>
        </div>
      </header>

      <div
        className={`mobile-menu${mobileOpen ? " active" : ""}`}
        id="mobileMenu"
      >
        <button
          type="button"
          className="close"
          onClick={() => setMobileOpen(false)}
        >
          close.
        </button>
        <Link href="/artists" onClick={() => setMobileOpen(false)}>
          {lang === "hr" ? "izvođači." : "artists."}
        </Link>
        <Link href="/sound" onClick={() => setMobileOpen(false)}>
          {lang === "hr" ? "razglas." : "sound."}
        </Link>
        <Link href="/lighting" onClick={() => setMobileOpen(false)}>
          {lang === "hr" ? "rasvjeta." : "lighting."}
        </Link>
        <Link href="/about-us" onClick={() => setMobileOpen(false)}>
          {lang === "hr" ? "o nama." : "about us."}
        </Link>
        <Link href="/journal" onClick={() => setMobileOpen(false)}>
          {lang === "hr" ? "novosti." : "journal."}
        </Link>
        <Link href="/#contact" onClick={() => setMobileOpen(false)}>
          {lang === "hr" ? "kontakt." : "contact."}
        </Link>
        <div className="mobile-language-switch">
          <button
            type="button"
            className={`lang-button${lang === "en" ? " active" : ""}`}
            data-lang="en"
            onClick={() => setLang("en")}
          >
            EN
          </button>
          <span className="lang-separator">/</span>
          <button
            type="button"
            className={`lang-button${lang === "hr" ? " active" : ""}`}
            data-lang="hr"
            onClick={() => setLang("hr")}
          >
            HR
          </button>
        </div>
      </div>
    </>
  );
}
