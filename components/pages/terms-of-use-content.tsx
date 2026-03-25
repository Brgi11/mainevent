"use client";

import { useLang } from "@/components/i18n/LanguageProvider";

export function TermsOfUseContent() {
  const { lang } = useLang();
  const isHr = lang === "hr";

  return (
    <section className="legal-page-section" aria-labelledby="terms-heading">
      <div className="legal-container">
        <h1 id="terms-heading" className="legal-title">
          {isHr ? "Uvjeti korištenja" : "Terms of Use"}
        </h1>
        <p className="legal-updated">
          {isHr ? "Zadnje ažuriranje: 25/03/2026" : "Last updated: 25/03/2026"}
        </p>

        <div className="legal-blocks">
          <div className="legal-block">
            <h2 className="legal-block-title">
              {isHr ? "1. OPĆE ODREDBE" : "1. GENERAL"}
            </h2>
            {isHr ? (
              <>
                <p className="legal-p">
                  Ovi uvjeti reguliraju korištenje web stranice Main Event.
                </p>
                <p className="legal-p">Korištenjem stranice prihvaćate ove uvjete.</p>
              </>
            ) : (
              <>
                <p className="legal-p">
                  These Terms of Use govern your use of this website operated by Main Event,
                  based in Croatia.
                </p>
                <p className="legal-p">By accessing this website, you agree to these terms.</p>
              </>
            )}
          </div>

          <div className="legal-block">
            <h2 className="legal-block-title">
              {isHr ? "2. SVRHA STRANICE" : "2. WEBSITE PURPOSE"}
            </h2>
            <p className="legal-p">
              {isHr
                ? "Stranica pruža informacije o glazbenim i event uslugama te omogućuje kontakt."
                : "This website provides information about our music and event services and allows users to contact us regarding potential bookings."}
            </p>
          </div>

          <div className="legal-block">
            <h2 className="legal-block-title">{isHr ? "3. KORIŠTENJE" : "3. USE OF WEBSITE"}</h2>
            <p className="legal-p">{isHr ? "Obvezujete se:" : "You agree to:"}</p>
            <ul className="legal-list">
              {isHr ? (
                <>
                  <li>Koristiti stranicu zakonito</li>
                  <li>Ne ometati rad stranice</li>
                  <li>Ne unositi netočne podatke</li>
                </>
              ) : (
                <>
                  <li>Use the website lawfully</li>
                  <li>Not misuse or attempt to disrupt the website</li>
                  <li>Not submit false or misleading information</li>
                </>
              )}
            </ul>
          </div>

          <div className="legal-block">
            <h2 className="legal-block-title">
              {isHr ? "4. INTELEKTUALNO VLASNIŠTVO" : "4. INTELLECTUAL PROPERTY"}
            </h2>
            {isHr ? (
              <p className="legal-p">Sav sadržaj je vlasništvo Main Event.</p>
            ) : (
              <>
                <p className="legal-p">
                  All content on this website is owned by or licensed to Main Event.
                </p>
                <p className="legal-p">
                  You may not reproduce or distribute content without permission.
                </p>
              </>
            )}
          </div>

          <div className="legal-block">
            <h2 className="legal-block-title">
              {isHr ? "5. KONTAKT OBRAZAC" : "5. CONTACT FORM"}
            </h2>
            <p className="legal-p">{isHr ? "Slanjem obrasca:" : "By submitting the contact form:"}</p>
            <ul className="legal-list">
              {isHr ? (
                <>
                  <li>potvrđujete točnost podataka</li>
                  <li>dajete privolu za kontakt</li>
                </>
              ) : (
                <>
                  <li>You confirm that the information is accurate</li>
                  <li>You consent to being contacted</li>
                </>
              )}
            </ul>
          </div>

          <div className="legal-block">
            <h2 className="legal-block-title">
              {isHr ? "6. ODGOVORNOST" : "6. LIMITATION OF LIABILITY"}
            </h2>
            <p className="legal-p">
              {isHr
                ? "Ne jamčimo stalnu dostupnost ili potpunu točnost sadržaja."
                : "We do not guarantee uninterrupted availability or error-free content."}
            </p>
          </div>

          <div className="legal-block">
            <h2 className="legal-block-title">
              {isHr ? "7. TREĆE STRANE" : "7. THIRD-PARTY SERVICES"}
            </h2>
            <p className="legal-p">
              {isHr
                ? "Mogu se koristiti usluge trećih strana (npr. email servisi)."
                : "We may use third-party services (e.g. email providers) for functionality."}
            </p>
          </div>

          <div className="legal-block">
            <h2 className="legal-block-title">
              {isHr ? "8. MJERODAVNO PRAVO" : "8. GOVERNING LAW"}
            </h2>
            <p className="legal-p">
              {isHr
                ? "Primjenjuje se pravo Republike Hrvatske."
                : "These terms are governed by Croatian law."}
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
