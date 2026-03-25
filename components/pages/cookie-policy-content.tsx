"use client";

import { useLang } from "@/components/i18n/LanguageProvider";

export function CookiePolicyContent() {
  const { lang } = useLang();
  const isHr = lang === "hr";

  return (
    <section className="legal-page-section" aria-labelledby="cookies-heading">
      <div className="legal-container">
        <h1 id="cookies-heading" className="legal-title">
          {isHr ? "Politika kolačića" : "Cookie Policy"}
        </h1>
        <p className="legal-updated">
          {isHr ? "Zadnje ažuriranje: 25/03/2026" : "Last updated: 25/03/2026"}
        </p>

        <div className="legal-blocks">
          <div className="legal-block">
            <h2 className="legal-block-title">{isHr ? "1. UVOD" : "1. INTRODUCTION"}</h2>
            <p className="legal-p">
              {isHr
                ? "Ova web stranica koristi minimalne ili nikakve kolačiće i ne koristi ih za praćenje ili analitiku."
                : "This website uses minimal or no cookies and does not use cookies for tracking or analytics."}
            </p>
          </div>

          <div className="legal-block">
            <h2 className="legal-block-title">
              {isHr ? "2. VRSTE KOLAČIĆA" : "2. COOKIES WE USE"}
            </h2>
            <p className="legal-p">
              {isHr ? "Koriste se samo nužni kolačići za:" : "Only essential cookies for:"}
            </p>
            <ul className="legal-list">
              {isHr ? (
                <>
                  <li>Funkcionalnost</li>
                  <li>Sigurnost</li>
                </>
              ) : (
                <>
                  <li>Basic functionality</li>
                  <li>Security</li>
                </>
              )}
            </ul>
          </div>

          <div className="legal-block">
            <h2 className="legal-block-title">{isHr ? "3. BEZ PRAĆENJA" : "3. NO TRACKING"}</h2>
            <p className="legal-p">{isHr ? "Ne koristimo:" : "We do not use:"}</p>
            <ul className="legal-list">
              {isHr ? (
                <>
                  <li>Analitiku</li>
                  <li>Marketinške kolačiće</li>
                  <li>Alate za praćenje</li>
                </>
              ) : (
                <>
                  <li>Analytics</li>
                  <li>Marketing cookies</li>
                  <li>Tracking tools</li>
                </>
              )}
            </ul>
          </div>

          <div className="legal-block">
            <h2 className="legal-block-title">
              {isHr ? "4. KOLAČIĆI TREĆIH STRANA" : "4. THIRD-PARTY COOKIES"}
            </h2>
            <p className="legal-p">
              {isHr
                ? "Treće strane mogu koristiti tehničke kolačiće za rad usluge."
                : "Third-party services may set necessary technical cookies."}
            </p>
          </div>

          <div className="legal-block">
            <h2 className="legal-block-title">{isHr ? "5. PRIVOLA" : "5. CONSENT"}</h2>
            <p className="legal-p">
              {isHr
                ? "S obzirom da nema neobaveznih kolačića, banner nije potreban."
                : "No consent banner is required due to lack of non-essential cookies."}
            </p>
          </div>

          <div className="legal-block">
            <h2 className="legal-block-title">{isHr ? "6. PROMJENE" : "6. CHANGES"}</h2>
            <p className="legal-p">
              {isHr ? "Politika se može ažurirati." : "We may update this policy if needed."}
            </p>
          </div>

          <div className="legal-block">
            <h2 className="legal-block-title">{isHr ? "7. KONTAKT" : "7. CONTACT"}</h2>
            <p className="legal-contact">
              Main Event
              <br />
              Email: <a href="mailto:info@mainevent.hr">info@mainevent.hr</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
