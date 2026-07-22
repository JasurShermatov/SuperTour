"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type Props = {
  tourId?: number;
  compact?: boolean;
};

export function InquiryForm({ tourId, compact = false }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(formData: FormData) {
    setStatus("sending");
    const payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      preferred_messenger: formData.get("preferred_messenger") || "WhatsApp",
      tour: tourId || null,
      message: formData.get("message"),
    };
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";
      const response = await fetch(`${base}/inquiries/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(response.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className={compact ? "inquiry-form compact" : "inquiry-form"} action={submit}>
      <label>
        Ism
        <input autoComplete="name" name="name" required placeholder="Ismingiz" />
      </label>
      <label>
        Telefon
        <input autoComplete="tel" inputMode="tel" name="phone" required placeholder="+998 ..." type="tel" />
      </label>
      <label>
        Messenger
        <select name="preferred_messenger" defaultValue="WhatsApp">
          <option>WhatsApp</option>
          <option>Telegram</option>
          <option>Telefon</option>
        </select>
      </label>
      <label>
        Email
        <input autoComplete="email" name="email" type="email" placeholder="ixtiyoriy" />
      </label>
      <label className="full">
        Xabar
        <textarea name="message" placeholder="Yo'nalish, sana, odam soni yoki budgetni yozing" />
      </label>
      <button className="primary-button" disabled={status === "sending"} type="submit">
        <Send size={18} />
        {status === "sending" ? "Yuborilmoqda" : "So'rov yuborish"}
      </button>
      {status === "sent" && <p className="form-note success">So'rovingiz qabul qilindi. Menejer bog'lanadi.</p>}
      {status === "error" && <p className="form-note error">Hozircha yuborilmadi. Keyinroq qayta urinib ko'ring.</p>}
    </form>
  );
}
