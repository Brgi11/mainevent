"use client";

import { FormEvent, useState } from "react";
import { useLang } from "@/components/i18n/LanguageProvider";
import { submitCf7Feedback } from "@/lib/wp/cf7-client";

type Props = { artistSlug: string; artistName: string };

export function ArtistInquiryForm({ artistSlug, artistName }: Props) {
  const { lang } = useLang();
  const isHr = lang === "hr";
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const firstName = String(fd.get("text-45") ?? "").trim();
    const email = String(fd.get("email-669") ?? "").trim();
    const eventType = String(fd.get("select-355") ?? "").trim();
    const location = String(fd.get("text-305") ?? "").trim();
    const eventDate = String(fd.get("date-821") ?? "").trim();
    const message = String(fd.get("textarea-428") ?? "").trim();

    if (!firstName || !email || !eventType || !location || !eventDate || !message) {
      setMsg({
        text: isHr ? "Molimo ispunite sva obavezna polja." : "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    setPending(true);
    try {
      const suffix = `\n\n[Artist inquiry: ${artistName} (${artistSlug})]`;
      await submitCf7Feedback({
        firstName,
        email,
        message: message + suffix,
        eventType,
        location,
        eventDate,
        duration: String(fd.get("text-483") ?? "").trim(),
      });

      setMsg({
        text: isHr ? "Hvala, javit ćemo vam se uskoro." : "Thank you, we will get back to you shortly.",
        type: "success",
      });
      form.reset();
    } catch {
      setMsg({
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
    <div id="contact-form" className="artist-contact-form-section">
      <div className="artist-contact-form-container">
        <h2 className="artist-form-title">
          {isHr ? "Pošaljite nam poruku" : "Send us a message"}
        </h2>
        <form className="artist-contact-form" onSubmit={onSubmit}>
          {msg ? <p className={`form-message ${msg.type}`}>{msg.text}</p> : null}
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                  name="text-45"
                placeholder={isHr ? "Ime" : "Name"}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-input"
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
                name="select-355"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  {isHr ? "Vrsta događaja" : "Event type"}
                </option>
                <option value="Wedding">
                  {isHr ? "Vjenčanje" : "Wedding"}
                </option>
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
                name="date-821"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                name="text-483"
                placeholder={isHr ? "Trajanje (npr. 3 sata)" : "Duration (e.g. 3 hours)"}
              />
            </div>
          </div>
          <div className="form-group full-width">
            <textarea
              className="form-textarea"
              name="textarea-428"
              placeholder={isHr ? "Poruka / detalji" : "Message / details"}
              rows={6}
              required
            />
          </div>
          <button type="submit" className="form-submit" disabled={pending}>
            {pending ? (isHr ? "Slanje…" : "Sending…") : isHr ? "Pošalji" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
