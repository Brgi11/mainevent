"use client";

import { FormEvent, useState } from "react";
import { useLang } from "@/components/i18n/LanguageProvider";
import { submitCf7Feedback } from "@/lib/wp/cf7-client";

export function ContactSection() {
  const { lang } = useLang();
  const isHr = lang === "hr";
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const firstName = String(fd.get("text-45") ?? "").trim();
    const email = String(fd.get("email-669") ?? "").trim();
    const eventType = String(fd.get("select-355") ?? "").trim();
    const location = String(fd.get("text-305") ?? "").trim();
    const eventDate = String(fd.get("date-821") ?? "").trim();
    const bodyMessage = String(fd.get("textarea-428") ?? "").trim();

    if (!firstName || !email || !eventType || !location || !eventDate || !bodyMessage) {
      setMessage({
        text: isHr
          ? "Molimo ispunite sva obavezna polja."
          : "Please fill in all required fields.",
        type: "error",
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({
        text: isHr ? "Molimo unesite ispravnu email adresu." : "Please enter a valid email address.",
        type: "error",
      });
      return;
    }

    setPending(true);
    try {
      await submitCf7Feedback({
        firstName,
        email,
        message: bodyMessage,
        eventType,
        location,
        eventDate,
        duration: String(fd.get("text-483") ?? "").trim(),
      });

      setMessage({
        text: isHr ? "Hvala, javit ćemo vam se uskoro." : "Thank you, we will get back to you shortly.",
        type: "success",
      });
      form.reset();
    } catch {
      setMessage({
        text: isHr
          ? "Ne možemo poslati poruku. Pokušajte ponovno ili nam pošaljite email izravno."
          : "Could not send the message. Try again or email us directly.",
        type: "error",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <h2 className="contact-title">{lang === "hr" ? "kontakt." : "contact."}</h2>
        <div className="contact-top-row">
          <div className="contact-intro">
            <p className="contact-description">
              {lang === "hr"
                ? "Kontaktirajte nas kako bismo razgovarali o vašem događaju. Ovdje smo da vašu viziju pretvorimo u stvarnost."
                : "Get in touch with us to discuss your event. We&apos;re here to help bring your vision to life."}
            </p>
          </div>
          <div className="contact-address-block">
            <p className="contact-address">Kopilica 62, 21000 Split</p>
            <p className="contact-email">
              <a href="mailto:info@mainevent.hr">info@mainevent.hr</a>
            </p>
          </div>
        </div>
        <div className="contact-form-wrapper">
          <h3 className="form-title">
            {lang === "hr" ? "Pošaljite nam poruku" : "Send us a message"}
          </h3>
          <form className="contact-form" id="contactForm" onSubmit={onSubmit}>
            {message ? (
              <p className={`form-message ${message.type}`}>{message.text}</p>
            ) : null}
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  id="firstName"
                  name="text-45"
                  placeholder={isHr ? "Ime" : "Name"}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className="form-input"
                  id="email"
                  name="email-669"
                  placeholder={isHr ? "E-mail" : "Email"}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <select
                  className="form-input form-select"
                  id="eventType"
                  name="select-355"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    {isHr ? "Vrsta događaja" : "Event type"}
                  </option>
                  <option value="Wedding">{isHr ? "Vjenčanje" : "Wedding"}</option>
                  <option value="Birthday">{isHr ? "Rođendan" : "Birthday"}</option>
                  <option value="Corporate event">
                    {isHr ? "Korporativno" : "Corporate event"}
                  </option>
                  <option value="Private event">
                    {isHr ? "Privatno" : "Private event"}
                  </option>
                  <option value="Other">{isHr ? "Ostalo" : "Other"}</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  id="location"
                  name="text-305"
                  placeholder={isHr ? "Lokacija" : "Location"}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="date"
                  className="form-input"
                  id="eventDate"
                  name="date-821"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  id="duration"
                  name="text-483"
                  placeholder={isHr ? "Trajanje (npr. 3 sata)" : "Duration (e.g. 3 hours)"}
                />
              </div>
            </div>

            <div className="form-group full-width">
              <textarea
                className="form-textarea"
                id="message"
                name="textarea-428"
                placeholder={isHr ? "Poruka / detalji" : "Message / details"}
                rows={6}
                required
              />
            </div>

            <button type="submit" className="form-submit" disabled={pending}>
              {pending
                ? lang === "hr"
                  ? "Slanje…"
                  : "Sending…"
                : lang === "hr"
                  ? "Pošalji"
                  : "Send"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
