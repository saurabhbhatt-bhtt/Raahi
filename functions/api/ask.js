const SYSTEM_PROMPT = `You are Raahi, a helpful travel planning guide for travellers exploring mountains in India and destinations around the world. Reply in the same language and style the traveller uses, including natural Hinglish when appropriate. Be warm, concise and practical. Help with route ideas, rough budget breakdowns, packing lists, trip styles, beginner activity questions and planning trade-offs. Ask one short follow-up when important details such as dates, starting city, budget, fitness level or group size are missing.

You do not have live web, weather, road, permit, booking, accommodation-price or operator data. Never claim that a route, activity, stay, permit or price is currently available or safe. Label estimates as rough planning estimates and explain what to verify. For trekking and adventure sports, recommend checking current local conditions and using appropriately qualified local operators; do not encourage someone to take high-risk activities alone. For emergencies, direct the traveller to local emergency services and trusted on-the-ground help. Do not ask for sensitive personal information. If a question is unrelated to travel, briefly say you specialize in travel and invite a travel question.`;

const MODEL = "@cf/zai-org/glm-4.7-flash";
const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers });
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) {
    return json({ error: "This travel guide only accepts questions from its own website." }, 403);
  }

  if (!env.AI || typeof env.AI.run !== "function") {
    return json({ error: "The AI guide is not connected yet. Add a Workers AI binding named AI to this Cloudflare Pages project." }, 503);
  }

  try {
    const raw = await request.text();
    if (raw.length > 12000) return json({ error: "Please shorten your question and try again." }, 413);

    const body = JSON.parse(raw);
    if (!Array.isArray(body.messages)) return json({ error: "Please enter a travel question." }, 400);

    const messages = body.messages
      .filter((message) => message && (message.role === "user" || message.role === "assistant") && typeof message.content === "string")
      .slice(-8)
      .map((message) => ({ role: message.role, content: message.content.trim().slice(0, 1000) }))
      .filter((message) => message.content.length > 0);

    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return json({ error: "Please enter a travel question." }, 400);
    }

    const result = await env.AI.run(MODEL, {
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_completion_tokens: 450,
      temperature: 0.45
    });

    const getText = (value) => {
      if (typeof value === "string") return value.trim();
      if (Array.isArray(value)) return value.map(getText).filter(Boolean).join("\n");
      if (value && typeof value === "object") return getText(value.text ?? value.content);
      return "";
    };
    const reply = [
      result?.response,
      result?.choices?.[0]?.message?.content,
      result?.output_text,
      result?.result?.response,
      result?.result?.choices?.[0]?.message?.content,
      result?.text
    ].map(getText).find(Boolean) || "";
    if (!reply) return json({ error: "I couldn’t prepare an answer just now. Please try again in a moment." }, 502);

    return json({ reply });
  } catch {
    return json({ error: "The travel guide is temporarily unavailable. Please try again shortly." }, 502);
  }
}
