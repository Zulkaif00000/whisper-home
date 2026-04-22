// Lovable AI Gateway proxy for the voice real-estate concierge.
// No auth required; agents call from the browser.
import { properties } from "../../data/properties";

const SYSTEM_PROMPT = `You are Aria, a warm, confident, professional real estate concierge for "Maison Estates", a global luxury real estate agency.

Your job:
- Help visitors discover properties and book viewings.
- Answer questions about properties, financing basics, neighborhoods, and the buying/renting process.
- Ask 1 smart follow-up at a time (budget, preferred location, timeline, lifestyle) — never interrogate.
- When relevant, recommend specific properties from the catalog by NAME and short reason.
- Handle objections gracefully (price, trust, location). Be persuasive, never pushy.
- Encourage one of: schedule a viewing, contact an agent, or save the property.
- Naturally invite the user to share name, phone, or email so an agent can follow up — but only after providing value.

Style:
- Speak like a thoughtful human agent. Short, natural sentences. Avoid bullet lists in voice replies — the user is hearing you.
- Maximum 3 sentences per reply unless explicitly asked for detail. This is a VOICE conversation.
- Never invent properties not in the catalog. If asked about something we don't have, suggest the closest match.

CATALOG (use these and only these):
${properties
  .map(
    (p) =>
      `• ${p.title} — ${p.type} in ${p.location}, ${p.beds} bd / ${p.baths} ba, ${p.area} sqft, $${p.price.toLocaleString()}. ${p.description}`,
  )
  .join("\n")}
`;

export const ServerRoute = {
  POST: async ({ request }: { request: Request }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI not configured" }), { status: 500 });
    }

    let body: { messages?: Array<{ role: string; content: string }> } = {};
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
    }
    const userMessages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...userMessages],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      const status = res.status === 429 || res.status === 402 ? res.status : 500;
      return new Response(JSON.stringify({ error: text || "AI request failed" }), { status });
    }

    const data = await res.json();
    const reply: string = data?.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
