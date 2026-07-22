"use client";

import { FormEvent, useMemo, useState } from "react";
import { Bot, Send, X } from "lucide-react";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Salom! Yo'nalish, budget yoki sana yozing. Men saytdagi mavjud turlar asosida tavsiya beraman.",
    },
  ]);

  const base = useMemo(() => process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api", []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = new FormData(form).get("message")?.toString().trim();
    if (!input) return;
    form.reset();
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setLoading(true);
    try {
      const response = await fetch(`${base}/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply || "Javob olinmadi." }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Assistant hozir ulanmagan. Backend ishga tushganini va OPENAI_API_KEY sozlanganini tekshiring.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button className="chat-launcher" onClick={() => setOpen(true)} aria-label="Open AI assistant">
        <Bot size={22} />
      </button>
      {open && (
        <section className="chat-panel" aria-label="SuperTour AI assistant">
          <div className="chat-head">
            <div>
              <strong>SuperTour Assistant</strong>
              <span>Tourlar va kompaniya ma'lumotlari</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <p className={message.role} key={`${message.role}-${index}`}>
                {message.text}
              </p>
            ))}
            {loading && <p className="assistant">Yozmoqda...</p>}
          </div>
          <form className="chat-form" onSubmit={submit}>
            <input name="message" placeholder="Masalan: Dubai uchun 5 kunlik tur bormi?" />
            <button disabled={loading} aria-label="Send message">
              <Send size={17} />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
