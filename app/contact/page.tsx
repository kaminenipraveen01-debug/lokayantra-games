"use client";

import { useState } from "react";
import Link from "next/link";

const WEB3FORMS_ACCESS_KEY = "40cce453-dc81-41b9-8b73-f88d7dfc9187";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          subject: `New LokaYantra Contact: ${name.trim()}`,
        }),
      });

      const data = await res.json();

      if (!res.ok || data?.success !== true) {
        throw new Error(data?.message || "Failed to send message.");
      }

      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("Contact form submit error:", err);
      setError("Something went wrong sending your message. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="w-full min-h-screen text-black font-sans pb-12 relative overflow-hidden select-none bg-[#cfcfcf]">
      {/* BACKGROUND CIRCLES LAYER */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-[160px] h-[160px] rounded-full bg-black" />
        <div className="absolute bottom-[15%] left-[5%] w-[200px] h-[200px] rounded-full bg-black" />
      </div>

      <div className="w-full max-w-[650px] mx-auto px-4 mt-[120px] relative z-10">
        <div
          className="border border-black/10 p-8 sm:p-10 rounded-[32px] shadow-2xl backdrop-blur-xl space-y-6"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.55)" }}
        >
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-black/60">GET IN TOUCH</span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-[#161920]">
              CONTACT STATION
            </h1>
          </div>

          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="text-4xl">🐼</div>
              <h2 className="text-xl font-black uppercase">Transmission Received!</h2>
              <p className="text-xs font-bold text-black/60 uppercase">The LokaYantra team will respond shortly.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-black underline uppercase"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 uppercase tracking-wide">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-black/60">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-[46px] px-4 rounded-[16px] bg-white/60 border border-black/10 focus:border-black outline-none font-bold text-sm transition-all"
                  placeholder="GAMER TAG / NAME"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-black/60">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[46px] px-4 rounded-[16px] bg-white/60 border border-black/10 focus:border-black outline-none font-bold text-sm transition-all"
                  placeholder="YOU@EXAMPLE.COM"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-black/60">Transmission / Message</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 rounded-[16px] bg-white/60 border border-black/10 focus:border-black outline-none font-bold text-sm transition-all resize-none"
                  placeholder="WHAT'S ON YOUR MIND?"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-[46px] font-black uppercase tracking-wider text-xs rounded-full bg-[#161920] text-white hover:scale-[1.02] active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}

          <div className="border-t border-black/10 pt-4 text-center">
            <Link href="/" className="text-xs font-black uppercase tracking-wider text-black/40 hover:text-black transition-colors">
              ← Return Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}