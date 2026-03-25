"use client";

import { useLang } from "@/components/i18n/LanguageProvider";

export function SoundPageContent() {
  const { lang } = useLang();
  const isHr = lang === "hr";

  return (
    <section id="sound" className="prod-section">
      <div className="prod-container">
        <h1 className="prod-title">{isHr ? "razglas." : "sound."}</h1>
        <div className="prod-content">
          <section className="prod-block prod-block-intro">
            <div className="prod-intro-inner">
              <div className="prod-intro-text">
                <h2 className="prod-intro-headline">
                  {isHr
                    ? "Produkcija koju ne primjećujete - dok ne postane ključna."
                    : "Production that feels invisible - until it matters."}
                </h2>
                <p className="prod-lead">
                  {isHr ? (
                    <>
                      Naši su setupi dizajnirani da nadopune prostor, ne da ga
                      preuzmu.
                      <br />
                      Čist zvuk. Skladna rasvjeta.
                      <br />
                      Sve pod jednim tehničkim standardom.
                    </>
                  ) : (
                    <>
                      Our setups are designed to complement the space, not
                      compete with it. Clean design. Clear sound. Thoughtful
                      lighting. Everything aligned under one technical team.
                    </>
                  )}
                </p>
              </div>
            </div>
          </section>

          <section className="prod-block">
            <h2 className="prod-block-title">{isHr ? "Razglas" : "Sound Systems"}</h2>
            <div className="prod-boxes">
              <div className="prod-box">{isHr ? "Za govore." : "For speeches."}</div>
              <div className="prod-box">{isHr ? "Za večere." : "For dinners."}</div>
              <div className="prod-box">
                {isHr ? "Za proslave do 150 gostiju." : "For 150 guest receptions."}
              </div>
              <div className="prod-box">
                {isHr ? "Za velike evente do 400 gostiju." : "For 400 guest celebrations."}
              </div>
            </div>

            <p className="prod-lead">
              {isHr ? (
                <>
                  Uvijek podešen od strane tehničara.
                  <br />
                  Uvijek spreman prije dolaska prvog gosta.
                </>
              ) : (
                <>
                  Always tuned by a dedicated technician. Always ready before
                  the first guest arrives.
                </>
              )}
            </p>
            <p className="prod-close">{isHr ? "Jednostavno. Elegantno. Pouzdano." : "Simple. Elegant. Reliable."}</p>
          </section>

          <section className="prod-block prod-block-how">
            <h2 className="prod-block-title">{isHr ? "Kako radimo" : "How we work"}</h2>
            <p className="prod-lead">
              {isHr ? (
                <>
                  Jedan tim. Jedna estetika. Jedan standard. Od dostave do
                  završnog tona - sve teče glatko, za vas i vaše partnere.
                </>
              ) : (
                <>
                  One team. One aesthetic. One standard. From delivery to
                  setup, we ensure the experience moves smoothly - for you,
                  your planner, and your guests.
                </>
              )}
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}

