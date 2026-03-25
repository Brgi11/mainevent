"use client";

import Link from "next/link";
import { useLang } from "@/components/i18n/LanguageProvider";

export function SiteFooter() {
  const { lang } = useLang();
  const isHr = lang === "hr";

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-about">
          <p>
            {isHr ? (
              <>
                Premium Izvođači i
                <br />
                Event Produkcija u Hrvatskoj
              </>
            ) : (
              <>
                Premium entertainment and
                <br />
                event production based in Split,
                <br />
                Croatia.
              </>
            )}
          </p>
        </div>

        <div className="footer-col">
          <h4>{isHr ? "USLUGE" : "SERVICES"}</h4>
          <Link href="/artists">{isHr ? "izvođači." : "Artists"}</Link>
          <Link href="/sound">{isHr ? "razglas." : "Sound Production"}</Link>
          <Link href="/lighting">{isHr ? "rasvjeta." : "Lighting"}</Link>
          <Link href="/journal">{isHr ? "novosti." : "Journal"}</Link>
        </div>

        <div className="footer-col">
          <h4>{isHr ? "KONTAKT" : "CONTACT"}</h4>
          <a href="tel:+385953537050">+385 95 3537 050</a>
          <a href="mailto:info@mainevent.hr">info@mainevent.hr</a>
          <Link href="/#contact" className="cta" scroll={true}>
            {isHr ? "KONTAKTIRAJ NAS." : "GET IN TOUCH"}
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2025 Main Event. All rights reserved.</span>
        <div className="legal">
          <Link href="/privacy-policy">
            {isHr ? "Politika privatnosti" : "Privacy Policy"}
          </Link>
          <Link href="/cookie-policy">
            {isHr ? "Politika kolačića" : "Cookie Policy"}
          </Link>
          <Link href="/terms-of-use">
            {isHr ? "Uvjeti korištenja" : "Terms of Use"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
