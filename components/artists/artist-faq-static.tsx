"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "What are your normal set lengths?",
    a: "Our standard set lengths are typically 60-90 minutes, but we can customize the duration based on your event needs. We're flexible and can accommodate shorter or longer sets as required.",
  },
  {
    q: "Do you have different line-up options?",
    a: "Yes, we offer various line-up configurations. You can choose from solo performances, duos, or full band setups. We'll work with you to create the perfect musical arrangement for your event.",
  },
  {
    q: "Do you provide your own sound & lighting equipment? What is it or what's included in the price?",
    a: "We bring professional-grade sound equipment including speakers, microphones, mixers, and amplifiers. Basic lighting is included in our standard package. Premium lighting options are available for an additional fee. All equipment is fully insured and maintained to the highest standards.",
  },
  {
    q: "Do you provide a laptop playlist / DJ service in between and after your live sets?",
    a: "Absolutely! We provide continuous music coverage throughout your event. Between live sets, we offer DJ services with curated playlists that match your event's atmosphere. This ensures there's never a moment of silence.",
  },
  {
    q: "What time do you normally arrive at the venue to set up?",
    a: "We typically arrive 2-3 hours before the event start time. This allows us ample time to set up equipment, perform sound checks, and ensure everything is perfect before your guests arrive.",
  },
  {
    q: "How long does it take for you to set up, sound check etc?",
    a: "Setup and sound check usually takes approximately 60-90 minutes. This includes equipment installation, cable management, sound balancing, and a brief performance test to ensure optimal audio quality.",
  },
  {
    q: "Can you learn song requests (e.g. a first dance)?",
    a: "Yes, we're happy to learn specific songs for special moments like first dances, ceremony music, or other significant parts of your event. Please provide song requests at least 2 weeks in advance to ensure we can prepare them properly.",
  },
  {
    q: "How much space do you need for your performance area?",
    a: "We typically need a minimum of 3x3 meters (10x10 feet) for our performance area. However, we can adapt to smaller spaces if needed. For larger setups with full bands, we'll discuss space requirements during the planning phase.",
  },
  {
    q: "Are you comfortable performing outdoors or in unusual settings (e.g. barns, beaches)?",
    a: "Yes, we're experienced in performing in various settings including outdoor venues, barns, beaches, and other unique locations. We have weather-resistant equipment and can adapt our setup to accommodate different environments. Additional considerations may apply for outdoor events.",
  },
];

export function ArtistFaqStatic() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  return (
    <div className="artist-faq-section">
      <h2 className="faq-title">FAQs</h2>
      <div className="faq-list">
        {FAQ_ITEMS.map((item, idx) => {
          const open = activeIdx === idx;
          return (
            <button
              key={item.q}
              type="button"
              className={open ? "faq-item active" : "faq-item"}
              onClick={() => setActiveIdx(open ? null : idx)}
              aria-expanded={open}
            >
              <p className="faq-question">{item.q}</p>
              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
