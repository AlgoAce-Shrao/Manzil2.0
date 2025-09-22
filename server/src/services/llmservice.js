const fetch = require("node-fetch");
const { GROQ_API_KEY } = require("../config");

async function askLLM(prompt) {
  const safeStub = () => `Stubbed response: ${String(prompt).slice(0, 180)}`;

  const apiKey = GROQ_API_KEY;

  if (!apiKey) {
    console.warn("[LLM] GROQ_API_KEY missing; returning stubbed response.");
    return safeStub();
  }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // ✅ supported Groq model
        messages: [
          {
            role: "system",
            content:
              "You are a concise, helpful career guidance assistant. Provide detailed and practical career advice."
          },
          { role: "user", content: String(prompt) }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[LLM] Groq API error ${res.status}: ${text.slice(0, 300)}`);
      return safeStub();
    }

    const data = await res.json();
    const output =
      (data &&
        data.choices &&
        data.choices[0] &&
        data.choices[0].message &&
        data.choices[0].message.content) ||
      "";

    if (!output) {
      console.warn("[LLM] Empty completion; returning stub.");
      return safeStub();
    }

    return output;
  } catch (err) {
    console.error("[LLM] Exception calling Groq:", err?.message || err);
    return safeStub();
  }
}

module.exports = { askLLM };
