import { useEffect, useRef, useState } from "react";
import { Bot, X, Send, Zap, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { chatWithGemini } from "@/lib/chat.functions";

interface Msg { role: "user" | "assistant"; content: string }

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! How can I help you? ⚡\n\nAsk me anything about computer science — algorithms, data structures, system design, code concepts, and more!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const send = useServerFn(chatWithGemini);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const submit = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await send({ data: { messages: next } });
      if ("error" in res && res.error) {
        setMessages((m) => [...m, { role: "assistant", content: `⚠️ ${res.error}` }]);
      } else if ("content" in res) {
        setMessages((m) => [...m, { role: "assistant", content: res.content }]);
      }
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: "⚠️ Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open DevPath AI"
          className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow hover:scale-105 transition"
        >
          <Bot className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-50 w-[min(380px,calc(100vw-2rem))] h-[min(560px,calc(100vh-2.5rem))] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand text-primary-foreground">
              <Bot className="h-4 w-4" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                DevPath AI <Sparkles className="h-3.5 w-3.5 text-accent" />
              </div>
              <div className="flex items-center gap-1 text-xs text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "assistant" && (
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/15 text-primary shrink-0">
                    <Bot className="h-3.5 w-3.5" />
                  </span>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"
                  }`}
                >
                  <div className="prose prose-sm max-w-none prose-p:my-1 prose-pre:my-2 prose-pre:bg-background prose-pre:text-foreground prose-code:text-foreground">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/15 text-primary"><Bot className="h-3.5 w-3.5" /></span>
                <div className="rounded-2xl bg-secondary px-3.5 py-2 text-sm text-muted-foreground">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
                placeholder="Ask about CS concepts..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button onClick={submit} disabled={loading || !input.trim()} className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              Powered by DevPath AI · CS concepts &amp; code explanations
            </p>
          </div>
        </div>
      )}
    </>
  );
}
