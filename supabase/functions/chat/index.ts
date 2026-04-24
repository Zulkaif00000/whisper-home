// Lovable Cloud Edge Function: Aria voice concierge
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PROPERTIES = [
  { title: "Skyline Residence", type: "Apartment", location: "Downtown, Dubai", beds: 3, baths: 2, area: 1800, price: 1250000, description: "Sun-drenched apartment with floor-to-ceiling windows framing the city skyline." },
  { title: "Azure Beachfront Villa", type: "Villa", location: "Palm Jumeirah, Dubai", beds: 5, baths: 6, area: 6200, price: 4800000, description: "Beachfront villa with infinity pool, private beach access and sunset views." },
  { title: "Summit Penthouse", type: "Penthouse", location: "Manhattan, New York", beds: 4, baths: 4, area: 3400, price: 6750000, description: "Sculpted penthouse with wraparound terrace above the city." },
  { title: "Olive Grove Villa", type: "Villa", location: "Tuscany, Italy", beds: 4, baths: 3, area: 4100, price: 1980000, description: "Stone villa with terracotta roof and a centuries-old olive grove." },
  { title: "Garden Townhouse", type: "Townhouse", location: "Lahore, Pakistan", beds: 3, baths: 3, area: 2400, price: 420000, description: "Bright family townhouse in a quiet, leafy neighbourhood." },
  { title: "Alpine Chalet", type: "Chalet", location: "Verbier, Switzerland", beds: 5, baths: 5, area: 4800, price: 3950000, description: "Reclaimed timber and stone chalet with views of the Alps." },
];

const SYSTEM_PROMPT = `You are Aria, a warm, confident, professional real estate concierge for "Maison Estates", a global luxury real estate agency.

Your job:
- Help visitors discover properties and book viewings.
- Answer questions about properties, financing basics, neighborhoods, and the buying/renting process.
- Ask 1 smart follow-up at a time (budget, preferred location, timeline, lifestyle) — never interrogate.
- When relevant, recommend specific properties from the catalog by NAME and short reason.
- Encourage one of: schedule a viewing, contact an agent, or save the property.
- Naturally invite the user to share name, phone, or email so an agent can follow up — but only after providing value.

Style:
- Speak like a thoughtful human agent. Short, natural sentences. Avoid bullet lists — this is a VOICE conversation.
- Maximum 3 sentences per reply unless explicitly asked for detail.
- Never invent properties not in the catalog.

CATALOG:
${PROPERTIES.map((p) => `- ${p.title} — ${p.type} in ${p.location}, ${p.beds} bd / ${p.baths} ba, ${p.area} sqft, $${p.price.toLocaleString()}. ${p.description}`).join("\n")}
`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const userMessages = Array.isArray(body?.messages) ? body.messages.slice(-12) : [];

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
      if (res.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (res.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please top up your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await res.text();
      console.error("AI gateway error:", res.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
