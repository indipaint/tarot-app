const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const openaiApiKey = defineSecret("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function sanitizeText(value, maxLen = 2000) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLen);
}

function buildSystemPrompt(locale) {
  const lang = String(locale || "de").toLowerCase();
  if (lang.startsWith("pt")) {
    return "Tu es um coach de tarot empatico e pratico. Responde com clareza, em frases curtas, com foco em apoio emocional e passos concretos. Evita diagnosticos medicos, legais ou financeiros. Nao inventes fatos.";
  }
  if (lang.startsWith("en")) {
    return "You are a warm tarot reflection coach. Keep responses practical, grounded, and emotionally supportive. Use short paragraphs and concrete next steps. Avoid medical/legal/financial diagnoses. Do not invent facts.";
  }
  if (lang.startsWith("fr")) {
    return "Tu es un coach de tarot empathique et concret. Reponds clairement, avec soutien emotionnel et etapes pratiques. Evite les diagnostics medicaux, juridiques ou financiers. N'invente pas de faits.";
  }
  if (lang.startsWith("es")) {
    return "Eres un coach de tarot empatico y practico. Responde con claridad, apoyo emocional y pasos concretos. Evita diagnosticos medicos, legales o financieros. No inventes hechos.";
  }
  return "Du bist ein einfühlsamer Tarot-Coach. Antworte klar, unterstützend und praxisnah in Du-Form. Gib konkrete nächste Schritte. Keine medizinischen, rechtlichen oder finanziellen Diagnosen. Erfinde keine Fakten.";
}

exports.coachChat = onRequest(
  {
    region: "europe-west1",
    secrets: [openaiApiKey],
    maxInstances: 10,
    timeoutSeconds: 30,
    cors: true,
  },
  async (req, res) => {
    Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }
    if (req.method !== "POST") {
      res.status(405).json({ error: "method_not_allowed" });
      return;
    }

    try {
      const locale = sanitizeText(req.body?.locale || "de", 10);
      const entry = req.body?.entry || {};
      const history = Array.isArray(req.body?.history) ? req.body.history : [];
      const message = sanitizeText(req.body?.message, 1200);

      if (!message) {
        res.status(400).json({ error: "message_required" });
        return;
      }

      const contextCard = sanitizeText(entry.cardTitle, 120);
      const contextQuestion = sanitizeText(entry.question, 300);
      const contextNote = sanitizeText(entry.note, 1200);

      const normalizedHistory = history
        .slice(-12)
        .map((m) => ({
          role: m?.role === "assistant" ? "assistant" : "user",
          content: sanitizeText(m?.text, 1200),
        }))
        .filter((m) => !!m.content);

      const messages = [
        { role: "system", content: buildSystemPrompt(locale) },
        {
          role: "system",
          content:
            `Tarot-Kontext:\n` +
            `Karte: ${contextCard || "-"}\n` +
            `Frage: ${contextQuestion || "-"}\n` +
            `Tagebuch: ${contextNote || "-"}`,
        },
        ...normalizedHistory,
        { role: "user", content: message },
      ];

      const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey.value()}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.7,
          max_tokens: 300,
          messages,
        }),
      });

      if (!openaiRes.ok) {
        const errText = await openaiRes.text();
        res.status(502).json({ error: "openai_failed", detail: errText.slice(0, 400) });
        return;
      }

      const data = await openaiRes.json();
      const reply = sanitizeText(data?.choices?.[0]?.message?.content || "", 4000);
      if (!reply) {
        res.status(502).json({ error: "empty_reply" });
        return;
      }

      res.status(200).json({ reply });
    } catch (error) {
      res.status(500).json({ error: "internal_error", detail: String(error || "") });
    }
  }
);
