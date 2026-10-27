"use client";
import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState({ type: "idle", message: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus({ type: "loading", message: "" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: "Message envoyé, merci !" });
        form.reset();
      } else {
        const detail = body.details?.map((d) => `${d.champ} : ${d.message}`).join(" / ");
        setStatus({ type: "error", message: detail || body.message });
      }
    } catch {
      setStatus({ type: "error", message: "Impossible de joindre le serveur." });
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="name">Nom</label>
      <input id="name" name="name" autoComplete="name" />
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" autoComplete="email" />
      <label htmlFor="message">Message</label>
      <textarea id="message" name="message" rows={5} />
      <button type="submit" disabled={status.type === "loading"}>Envoyer</button>
      {status.message && (
        <p role="status" className={`form-${status.type}`}>{status.message}</p>
      )}
    </form>
  );
}
