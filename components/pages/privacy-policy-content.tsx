"use client";

import { useLang } from "@/components/i18n/LanguageProvider";

export function PrivacyPolicyContent() {
  const { lang } = useLang();
  const isHr = lang === "hr";
  return (
    <section className="legal-page-section" aria-labelledby="privacy-heading">
      <div className="legal-container">
        <h1 id="privacy-heading" className="legal-title">
          {isHr ? "Politika privatnosti" : "Privacy Policy"}
        </h1>
        <p className="legal-updated">
          {isHr ? "Zadnje ažuriranje: 25/03/2026" : "Last updated: 25/03/2026"}
        </p>

        <div className="legal-blocks">
          <div className="legal-block">
            <h2 className="legal-block-title">{isHr ? "1. UVOD" : "1. INTRODUCTION"}</h2>
            {isHr ? (
              <>
                <p className="legal-p">
                  Ova Politika privatnosti objašnjava kako Main Event (&quot;mi&quot;,
                  &quot;nas&quot;, &quot;naš&quot;) prikuplja, koristi i štiti osobne podatke kada
                  koristite našu web stranicu.
                </p>
                <p className="legal-p">
                  Sjedište nam je u Hrvatskoj i sve poslovne aktivnosti obavljamo unutar
                  Hrvatske. Postupamo u skladu s Općom uredbom o zaštiti podataka (GDPR) i
                  važećim zakonima Republike Hrvatske.
                </p>
              </>
            ) : (
              <>
                <p className="legal-p">
                  This Privacy Policy explains how Main Event (&quot;we&quot;, &quot;us&quot;,
                  &quot;our&quot;) collects, uses, and protects personal data when you use our
                  website.
                </p>
                <p className="legal-p">
                  We are based in Croatia and conduct all of our business within Croatia. We
                  comply with the General Data Protection Regulation (GDPR) and applicable
                  Croatian data protection laws.
                </p>
              </>
            )}
          </div>

          <div className="legal-block">
            <h2 className="legal-block-title">
              {isHr ? "2. PODACI KOJE PRIKUPLJAMO" : "2. DATA WE COLLECT"}
            </h2>
            <p className="legal-p">
              {isHr
                ? "Prikupljamo isključivo osobne podatke koje dobrovoljno unesete putem kontakt obrasca, uključujući:"
                : "We only collect personal data that you voluntarily provide through our contact form. This may include:"}
            </p>
            <ul className="legal-list">
              {isHr ? (
                <>
                  <li>Ime</li>
                  <li>Email adresu</li>
                  <li>Telefonski broj (ako je naveden)</li>
                  <li>Detalje događaja ili sadržaj poruke</li>
                </>
              ) : (
                <>
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number (if provided)</li>
                  <li>Event details or message content</li>
                </>
              )}
            </ul>
            <p className="legal-p">
              {isHr
                ? "Ne koristimo analitiku niti alate za praćenje."
                : "We do not use analytics, tracking tools, or cookies for tracking purposes."}
            </p>
          </div>

          <div className="legal-block">
            <h2 className="legal-block-title">
              {isHr ? "3. SVRHA OBRADE" : "3. PURPOSE OF PROCESSING"}
            </h2>
            <p className="legal-p">
              {isHr ? "Vaše podatke koristimo isključivo za:" : "We process your data solely to:"}
            </p>
            <ul className="legal-list">
              {isHr ? (
                <>
                  <li>Odgovaranje na upite</li>
                  <li>Komunikaciju vezanu uz organizaciju događaja ili usluga</li>
                </>
              ) : (
                <>
                  <li>Respond to your inquiries</li>
                  <li>Communicate regarding event bookings or services</li>
                </>
              )}
            </ul>
            <p className="legal-p">
              {isHr
                ? "Podatke ne koristimo u marketinške svrhe bez vaše izričite suglasnosti."
                : "We do not use your data for marketing unless explicitly agreed."}
            </p>
          </div>

          <div className="legal-block">
            <h2 className="legal-block-title">
              {isHr ? "4. PRAVNA OSNOVA" : "4. LEGAL BASIS"}
            </h2>
            <p className="legal-p">
              {isHr ? "Obrada se temelji na:" : "We process your personal data based on:"}
            </p>
            <ul className="legal-list">
              {isHr ? (
                <>
                  <li>Vašoj privoli (slanjem obrasca)</li>
                  <li>Našem legitimnom interesu za odgovaranje na upite</li>
                </>
              ) : (
                <>
                  <li>Your consent (by submitting the contact form)</li>
                  <li>Our legitimate interest in responding to inquiries and providing services</li>
                </>
              )}
            </ul>
          </div>

          <div className="legal-block">
            <h2 className="legal-block-title">
              {isHr ? "5. POHRANA PODATAKA" : "5. DATA RETENTION"}
            </h2>
            <p className="legal-p">{isHr ? "Podatke čuvamo:" : "We retain your data only as long as necessary:"}</p>
            <ul className="legal-list">
              {isHr ? (
                <>
                  <li>Najduže 6 mjeseci od zadnjeg kontakta</li>
                  <li>Nakon toga se trajno brišu, osim ako zakon nalaže drugačije</li>
                </>
              ) : (
                <>
                  <li>Maximum of 6 months after last contact</li>
                  <li>After that, data is permanently deleted unless required for legal obligations</li>
                </>
              )}
            </ul>
          </div>

          <div className="legal-block">
            <h2 className="legal-block-title">
              {isHr ? "6. DIJELJENJE PODATAKA" : "6. DATA SHARING"}
            </h2>
            <p className="legal-p">
              {isHr
                ? "Ne prodajemo niti dijelimo podatke s trećim stranama, osim:"
                : "We do not sell or share your data with third parties, except:"}
            </p>
            <ul className="legal-list">
              {isHr ? (
                <>
                  <li>Pružateljima usluga nužnim za komunikaciju (npr. email hosting)</li>
                  <li>Kada je to zakonski obavezno</li>
                </>
              ) : (
                <>
                  <li>Service providers necessary for email communication (e.g. email hosting)</li>
                  <li>When required by law</li>
                </>
              )}
            </ul>
          </div>

          <div className="legal-block">
            <h2 className="legal-block-title">
              {isHr ? "7. SIGURNOST" : "7. DATA STORAGE"}
            </h2>
            <p className="legal-p">
              {isHr
                ? "Podaci se čuvaju sigurno uz odgovarajuće tehničke i organizacijske mjere zaštite."
                : "Data is stored securely within our systems and email infrastructure. We take appropriate technical and organizational measures to protect your data."}
            </p>
          </div>

          <div className="legal-block">
            <h2 className="legal-block-title">{isHr ? "8. VAŠA PRAVA" : "8. YOUR RIGHTS"}</h2>
            <p className="legal-p">{isHr ? "Imate pravo na:" : "Under GDPR, you have the right to:"}</p>
            <ul className="legal-list">
              {isHr ? (
                <>
                  <li>Pristup podacima</li>
                  <li>Ispravak podataka</li>
                  <li>Brisanje podataka</li>
                  <li>Ograničenje obrade</li>
                  <li>Prigovor</li>
                  <li>Prenosivost podataka</li>
                </>
              ) : (
                <>
                  <li>Access your data</li>
                  <li>Rectify inaccurate data</li>
                  <li>Request deletion (&quot;right to be forgotten&quot;)</li>
                  <li>Restrict processing</li>
                  <li>Object to processing</li>
                  <li>Data portability</li>
                </>
              )}
            </ul>
            <p className="legal-p">
              {isHr ? (
                <>
                  Kontakt:{" "}
                  <a href="mailto:info@mainevent.hr">info@mainevent.hr</a>
                </>
              ) : (
                <>
                  To exercise your rights, contact us at:{" "}
                  <a href="mailto:info@mainevent.hr">info@mainevent.hr</a>
                </>
              )}
            </p>
          </div>

          <div className="legal-block">
            <h2 className="legal-block-title">{isHr ? "9. KONTAKT" : "9. CONTACT"}</h2>
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
