import { NextRequest, NextResponse } from "next/server";

type Body = {
  firstName?: string;
  email?: string;
  eventType?: string;
  location?: string;
  eventDate?: string;
  duration?: string;
  message?: string;
};

/**
 * Proxies to Contact Form 7 REST feedback when WORDPRESS_URL + CF7_FORM_ID are set.
 * Map env vars to your form’s mail tags (see .env.example).
 */
export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const wp = process.env.WORDPRESS_URL?.replace(/\/$/, "");
  const formId = process.env.CF7_FORM_ID;

  const nameField = process.env.CF7_FIELD_NAME || "your-name";
  const emailField = process.env.CF7_FIELD_EMAIL || "your-email";
  const messageField = process.env.CF7_FIELD_MESSAGE || "your-message";

  const composed = [
    body.message,
    body.eventType && `Event type: ${body.eventType}`,
    body.location && `Location: ${body.location}`,
    body.eventDate && `Date: ${body.eventDate}`,
    body.duration && `Duration: ${body.duration}`,
  ]
    .filter(Boolean)
    .join("\n");

  if (!wp || !formId) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Contact backend not configured. Set WORDPRESS_URL and CF7_FORM_ID in .env.local.",
      },
      { status: 503 }
    );
  }

  const fd = new FormData();
  fd.append("_wpcf7", formId);
  fd.append("_wpcf7_version", "5.9");
  fd.append(nameField, body.firstName ?? "");
  fd.append(emailField, body.email ?? "");
  fd.append(messageField, composed || "");

  const url = `${wp}/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`;

  try {
    const res = await fetch(url, {
      method: "POST",
      body: fd,
      headers: {
        Accept: "application/json",
      },
    });

    const data = (await res.json()) as {
      status?: string;
      message?: string;
    };

    if (data.status === "mail_sent" || data.status === "mail_failed") {
      if (data.status === "mail_sent") {
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json(
        { ok: false, message: data.message || "Mail could not be sent." },
        { status: 502 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, message: data.message || "WordPress rejected the request." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/contact]", e);
    return NextResponse.json(
      { ok: false, message: "Could not reach WordPress." },
      { status: 502 }
    );
  }
}
