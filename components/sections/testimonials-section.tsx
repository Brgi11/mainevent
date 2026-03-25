"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useLang } from "@/components/i18n/LanguageProvider";

const testimonials = [
  {
    textEn:
      "We found FJOK Collective in Instagram and were instantly drawn to their energy. The vibe they brought to our reception was even better than we hoped for. We'd never seen a setup with two DJs before, but the guys really proved their worth. The saxophone added such a unique live element and made it feel like a proper show. Our friends are getting married on Hvar as well next year and booked them right after our wedding.",
    textHr:
      "FJOK Collective smo pronašli na Instagramu i odmah nas je privukla njihova energija. Atmosfera koju su donijeli na našu svadbenu proslavu bila je još bolja nego što smo se nadali. Nikada prije nismo vidjeli setup s dva DJ-a, ali dečki su stvarno opravdali očekivanja. Saksofon je dodao jedinstveni live element i učinio cijeli doživljaj pravim showom. Naši prijatelji se također vjenčaju na Hvaru sljedeće godine i rezervirali su ih odmah nakon naše svadbe.",
    author: "Ingrid & Mikkel",
    titleEn: "Wedding at Fort George in Vis, Croatia",
    titleHr: "Vjenčanje u Fort Georgeu na Visu, Hrvatska",
  },
  {
    textEn:
      "They absolutely nailed it! The setup Main Event brought was super-clean and didn't interfere with the 400 year old venue at all! From the first beat to the final song, they brought the perfect energy and vibe to our wedding. Super professional, incredibly well-prepared, and genuinely attentive to all our wishes - nothing was left to chance. The music was spot on throughout the entire event - chill when it needed to be, and full of energy when it was time to dance. The DJ and sax combo gave the whole evening a unique, unforgettable touch that had everyone smiling, dancing, and asking where we found them. If you're looking for a team that knows how to read the room and elevate your celebration with class and style - this is it.",
    textHr:
      "Apsolutno su rasturili! Setup koji je Main Event donio bio je izuzetno čist i uopće nije narušio prostor star 400 godina! Od prve note do posljednje pjesme donijeli su savršenu energiju i atmosferu našem vjenčanju. Izuzetno profesionalni, vrhunski pripremljeni i iskreno pažljivi prema svim našim željama – ništa nije bilo prepušteno slučaju. Glazba je bila savršeno pogođena tijekom cijelog događaja – opuštena kada je trebalo, a puna energije kada je došlo vrijeme za ples. Kombinacija DJ-a i saksofona dala je cijeloj večeri jedinstven i nezaboravan doživljaj koji je sve goste držao nasmijanima, na plesnom podiju i znatiželjnima gdje smo ih pronašli. Ako tražite tim koji zna pročitati atmosferu i podići vaše slavlje na višu razinu uz stil i eleganciju – to je to.",
    author: "Tonka & Nordin",
    titleEn: "Wedding at Kaštil Gospodnetić in Brač, Croatia",
    titleHr: "Vjenčanje u Kaštilu Gospodnetić na Braču, Hrvatska",
  },
  {
    textEn:
      "We're from Australia and booked Main Event as recommended by our planner. They were great to talk to and we felt super confident from the start. The whole process was smooth and stress-free. On the day, we didn't have to worry about a thing. The party was amazing, everything looked and sounded gorgeous and our friends absolutely loved the music.",
    textHr:
      "Dolazimo iz Australije i rezervirali smo Main Event po preporuci našeg wedding planera. Bilo je jako ugodno komunicirati s njima i od samog početka smo imali potpuno povjerenje. Cijeli proces bio je jednostavan i bez stresa. Na sam dan nismo morali brinuti ni o čemu. Party je bio nevjerojatan, sve je izgledalo i zvučalo odlično, a naši gosti su bili oduševljeni glazbom.",
    author: "Emma & Josh Murray",
    titleEn: "Wedding at Portus in Sukošan, Croatia",
    titleHr: "Vjenčanje u Portusu u Sukošanu, Hrvatska",
  },
  {
    textEn:
      "I'm Canadian and my husband is German so our guests came from more than ten countries. We were a bit nervous about how the music would work for such a mixed crowd, but Jerry and Mirko absolutely nailed it. They managed to create a vibe that brought everyone together and kept the energy high all night. Everyone had so much fun. We had a dream team of vendors in Croatia and we also really recommend Villa Dalmacija. If you're planning a wedding here and want the party to be something special, They are a perfect fit.",
    textHr:
      "Ja sam iz Kanade, a moj suprug je Nijemac, tako da su naši gosti došli iz više od deset zemalja. Bili smo pomalo nervozni kako će glazba funkcionirati za tako raznoliku publiku, ali Jerry i Mirko su to savršeno odradili. Uspjeli su stvoriti atmosferu koja je povezala sve goste i održala energiju visokom cijelu večer. Svi su se odlično zabavili. Imali smo fantastičan tim dobavljača u Hrvatskoj, a posebno preporučujemo Villu Dalmaciju. Ako planirate vjenčanje ovdje i želite da zabava bude nešto posebno, oni su savršen izbor.",
    author: "Caroline & Lukas",
    titleEn: "Wedding at Villa Dalmacija in Split, Croatia",
    titleHr: "Vjenčanje u Villi Dalmacija u Splitu, Hrvatska",
  },
];

export function TestimonialsSection() {
  const { lang } = useLang();
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const innerRef = useRef<HTMLDivElement>(null);
  const [shellHeight, setShellHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const measure = () => {
      const h = el.getBoundingClientRect().height;
      if (h > 0) setShellHeight(Math.ceil(h));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [index]);

  const go = useCallback((next: number) => {
    setFade(false);
    window.setTimeout(() => {
      setIndex(next);
      setFade(true);
    }, 300);
  }, []);

  const nextSlide = useCallback(() => {
    go((index + 1) % testimonials.length);
  }, [go, index]);

  const prevSlide = useCallback(() => {
    go((index - 1 + testimonials.length) % testimonials.length);
  }, [go, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [nextSlide, prevSlide]);

  const t = testimonials[index];
  const active = fade ? "active" : "";
  const text = lang === "hr" ? t.textHr : t.textEn;
  const title = lang === "hr" ? t.titleHr : t.titleEn;

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="testimonials-container">
        <h2 className="testimonials-title">
          {lang === "hr" ? "Recenzije" : "Testimonials"}
        </h2>
        <div className="testimonials-content-wrapper">
          <button
            type="button"
            className="testimonial-nav testimonial-prev"
            aria-label="Previous testimonial"
            onClick={prevSlide}
          >
            ←
          </button>
          <div
            className="testimonials-content-shell"
            style={
              shellHeight !== null ? { height: `${shellHeight}px` } : undefined
            }
          >
            <div ref={innerRef} className="testimonials-content-inner">
              <p className={`testimonial-text ${active}`}>{text}</p>
              <div className="testimonial-author-info">
                <p className={`testimonial-author-name ${active}`}>{t.author}</p>
                <p className={`testimonial-author-title ${active}`}>
                  {title}
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="testimonial-nav testimonial-next"
            aria-label="Next testimonial"
            onClick={nextSlide}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
