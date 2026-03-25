"use client";

import { useLang } from "@/components/i18n/LanguageProvider";

export function AboutUsPageContent() {
  const { lang } = useLang();
  const isHr = lang === "hr";

  return (
    <section id="about-us" className="about-us-section">
      <div className="about-us-container">
        <h1 className="about-us-title">{isHr ? "o nama." : "about us."}</h1>
        <div className="about-us-content">
          <section className="about-block about-block-story">
            <h2 className="about-block-title">{isHr ? "Naša Priča" : "Our Story"}</h2>
            <div className="about-story-inner">
              <div className="about-story-text">
                <p className="about-lead">
                  {isHr ? (
                    <>
                      Godine iskustva s nastupima na najpoznatijim lokacijama u
                      Hrvatskoj pokazale su nam što klijentima zaista treba:
                      jedan pouzdan partner koji spaja glazbu i produkciju -
                      elegantno i jednostavno.
                      <br />
                      Zato smo stvorili upravo to.
                    </>
                  ) : (
                    <>
                      With years under our belt performing across Croatia&apos;s
                      most iconic venues, we learned what clients truly need: one
                      reliable partner who brings music and production together -
                      beautifully.
                      <br />
                      So we built exactly that.
                    </>
                  )}
                </p>

                <ul className="about-list">
                  {isHr ? (
                    <>
                      <li>Odabrani izvođači.</li>
                      <li>Usklađen tehnički tim.</li>
                      <li>Jedinstveno iskustvo koje djeluje prirodno i drži sve pod kontrolom.</li>
                    </>
                  ) : (
                    <>
                      <li>A curated selection of artists.</li>
                      <li>A unified technical team.</li>
                      <li>A refined, seamless experience.</li>
                    </>
                  )}
                </ul>

                <p className="about-close">
                  {isHr
                    ? "Sve je dizajnirano da bude jednostavno, elegantno i pod kontrolom."
                    : "Everything designed to feel simple, elegant, and under control."}
                </p>
              </div>

              <div className="about-story-image">
                <img
                  src="https://eiz.hr/mainevent/wp-content/uploads/2026/02/Vice-2.jpeg"
                  alt=""
                  loading="lazy"
                />
              </div>
            </div>
          </section>

          <section className="about-block">
            <h2 className="about-block-title">{isHr ? "Pristup" : "Approach"}</h2>
            <div className="about-approach-items">
              {isHr ? (
                <>
                  <div className="about-approach-item">Krećemo od vaše vizije.</div>
                  <div className="about-approach-item">Zatim oblikujemo raspoloženje.</div>
                  <div className="about-approach-item">Biramo izvođača.</div>
                  <div className="about-approach-item">Prilagođavamo zvuk i rasvjetu tijeku večeri.</div>
                </>
              ) : (
                <>
                  <div className="about-approach-item">We start with your vision.</div>
                  <div className="about-approach-item">We design the mood.</div>
                  <div className="about-approach-item">We match the artist.</div>
                  <div className="about-approach-item">We shape the sound, the lighting, the flow.</div>
                </>
              )}
            </div>

            <p className="about-tagline">{isHr ? "Bez nesporazuma. Bez viška koraka." : "No friction. No guesswork."}</p>
            <p className="about-close">
              {isHr
                ? "Samo skladan događaj - od prvog tona do posljednjeg trenutka."
                : "Just a cohesive event - from the first note to the final moment."}
            </p>
          </section>

          <section className="about-block about-block-defines">
            <h2 className="about-block-title">{isHr ? "Što nas definira" : "What defines us"}</h2>
            <div className="about-defines-items">
              {isHr ? (
                <>
                  <div className="about-defines-item">Biramo, ne gomilamo.</div>
                  <div className="about-defines-item">Profinjeno, a nenametljivo.</div>
                  <div className="about-defines-item">Profesionalno, ali blisko.</div>
                </>
              ) : (
                <>
                  <div className="about-defines-item">Curated, not crowded.</div>
                  <div className="about-defines-item">Polished, not intrusive.</div>
                  <div className="about-defines-item">Professional, not distant.</div>
                </>
              )}
            </div>
            <p className="about-phrase about-phrase-accent">
              {isHr
                ? "Hrvatska baza, globalan standard."
                : "Croatian roots with an international standard."}
            </p>
          </section>

          <section className="about-block about-block-locations">
            <h2 className="about-block-title">{isHr ? "Gdje radimo" : "Where we work"}</h2>
            <p className="about-locations">
              {isHr ? (
                <>
                  Split, Hvar, Brač, Vis, Šolta, Dubrovnik -
                  <br />
                  i bilo gdje između.
                </>
              ) : (
                <>
                  Split, Hvar, Brač, Vis, Šolta, Dubrovnik -
                  <br />
                  and every venue in between.
                </>
              )}
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}

