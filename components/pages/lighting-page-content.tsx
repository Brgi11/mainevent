"use client";

import { useLang } from "@/components/i18n/LanguageProvider";

export function LightingPageContent() {
  const { lang } = useLang();
  const isHr = lang === "hr";

  return (
    <section id="lighting" className="prod-section">
      <div className="prod-container">
        <h1 className="prod-title">{isHr ? "rasvjeta." : "lighting."}</h1>
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
            <h2 className="prod-block-title">{isHr ? "Rasvjeta" : "Lighting"}</h2>
            <p className="prod-lead">
              {isHr
                ? "Rasvjeta oblikuje doživljaj."
                : "Lighting shapes the mood - we treat it accordingly."}
            </p>

            <div className="prod-boxes prod-boxes-three">
              <div className="prod-box">
                {isHr
                  ? "Blaga atmosfera za rane sate."
                  : "Soft ambience for the early hours."}
              </div>
              <div className="prod-box">
                {isHr
                  ? "Energija sinkronizirana s plesom."
                  : "Music-synced energy when the night unfolds."}
              </div>
              <div className="prod-box">
                {isHr
                  ? "Potpuni light-show kad trenutak to traži."
                  : "Full show capability when the moment calls for it."}
              </div>
            </div>
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

