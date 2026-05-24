import { createServerFn } from "@tanstack/react-start";

interface Msg { role: "user" | "assistant" | "system"; content: string }

export const chatWithGemini = createServerFn({ method: "POST" })
  .inputValidator((d: { messages: Msg[] }) => d)
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY missing");
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are DevPath AI, a friendly expert assistant for computer science learners. Answer questions about algorithms, data structures, system design, code concepts, web development, and software engineering. Keep answers clear, concise, and use markdown with code blocks when helpful.",
          },
          ...data.messages,
        ],
      }),
    });
    if (res.status === 429) return { error: "Rate limit reached, please slow down." };
    if (res.status === 402) return { error: "AI credits exhausted. Please add credits in Workspace Usage." };
    if (!res.ok) {
      const t = await res.text();
      console.error("AI gateway", res.status, t);
      return { error: "AI service unavailable" };
    }
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content ?? "Sorry, I had no reply.";
    return { content };
  });
