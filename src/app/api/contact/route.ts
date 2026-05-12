import { NextResponse } from "next/server";

/**
 * Placeholder contact endpoint. Validates and returns success without
 * delivering. The real wiring (Resend / forwarded mail) lands at M4 —
 * see docs/TRACKING_PLAN.md.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPIC_OPTIONS = new Set(["Partnership", "Press / interview", "Other"]);

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { error: "Invalid payload." },
      { status: 400 },
    );
  }

  const { name, email, organisation, topic, message } = body as Record<
    string,
    unknown
  >;

  if (typeof name !== "string" || name.trim().length < 1) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "That doesn't look like a valid email." },
      { status: 400 },
    );
  }
  if (typeof topic !== "string" || !TOPIC_OPTIONS.has(topic)) {
    return NextResponse.json({ error: "Invalid topic." }, { status: 400 });
  }
  if (typeof message !== "string" || message.trim().length < 5) {
    return NextResponse.json(
      { error: "Message is too short." },
      { status: 400 },
    );
  }

  if (process.env.NODE_ENV !== "production") {

    console.info("[contact:placeholder]", {
      name,
      email,
      organisation,
      topic,
      messagePreview: message.slice(0, 80),
    });
  }

  return NextResponse.json({ ok: true });
}
