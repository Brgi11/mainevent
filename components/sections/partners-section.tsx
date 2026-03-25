 "use client";

import { useLang } from "@/components/i18n/LanguageProvider";

export function PartnersSection() {
  const { lang } = useLang();
  return (
    <section id="partners" className="partners-section">
      <div className="partners-container">
        <h2 className="partners-title">
          {lang === "hr" ? "naši pouzdani partneri." : "our trusted partners."}
        </h2>

        <div className="partners-grid partners-grid--top">
          <div className="partner-item">
            <img
              src="https://eiz.hr/mainevent/wp-content/uploads/2026/02/Brown.png"
              alt="Brown"
              className="partner-image"
            />
          </div>
          <div className="partner-item">
            <img
              src="https://eiz.hr/mainevent/wp-content/uploads/2026/02/KeuneN-scaled.png"
              alt="Keune"
              className="partner-image"
            />
          </div>
          <div className="partner-item">
            <img
              src="https://eiz.hr/mainevent/wp-content/uploads/2026/02/Kontraloop.png"
              alt="Kontraloop"
              className="partner-image"
            />
          </div>
          <div className="partner-item">
            <img
              src="https://eiz.hr/mainevent/wp-content/uploads/2026/02/Mandrach.png"
              alt="Mandrach"
              className="partner-image"
            />
          </div>
        </div>

        <div className="partners-grid partners-grid--bottom">
          <div className="partner-item">
            <img
              src="https://eiz.hr/mainevent/wp-content/uploads/2026/02/MasterCharterN.png"
              alt="Master Charter"
              className="partner-image"
            />
          </div>
          <div className="partner-item">
            <img
              src="https://eiz.hr/mainevent/wp-content/uploads/2026/02/Revicon.png"
              alt="Revicon"
              className="partner-image"
            />
          </div>
          <div className="partner-item">
            <img
              src="https://eiz.hr/mainevent/wp-content/uploads/2026/02/RN.png"
              alt="RN"
              className="partner-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
