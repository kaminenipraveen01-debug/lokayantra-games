"use client";

import { useState } from "react";
import Link from "next/link";

const WEB3FORMS_ACCESS_KEY = "40cce453-dc81-41b9-8b73-f88d7dfc9187";

const TOPICS = ["General", "Bug Report", "Game Suggestion", "Business / Ads", "Other"];

const CONTACT_FAQS = [
  { q: "How fast do you reply?", a: "Usually within 24–48 hours. LokaYantra is built and run by one person, so replies aren't instant — but every message gets read." },
  { q: "Found a broken game?", a: "Pick \"Bug Report\" below and include the game name and what went wrong — this is the fastest way to get it fixed." },
  { q: "Want to suggest a game?", a: "We'd love to hear it. Pick \"Game Suggestion\" and drop the name — new titles get added regularly." },
  { q: "Interested in advertising?", a: "Pick \"Business / Ads\" and share a few details about what you have in mind." },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
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
          topic,
          message: message.trim(),
          subject: `New LokaYantra Contact [${topic}]: ${name.trim()}`,
        }),
      });

      const data = await res.json();

      if (!res.ok || data?.success !== true) {
        throw new Error(data?.message || "Failed to send message.");
      }

      setSubmitted(true);
      setName("");
      setEmail("");
      setTopic(TOPICS[0]);
      setMessage("");
    } catch (err) {
      console.error("Contact form submit error:", err);
      setError("Something went wrong sending your message. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="w-full min-h-screen text-white font-sans pb-12 relative overflow-hidden select-none bg-[#0a0a0d]">
      {/* WHITE BUBBLES — migatha pages tho consistent */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-50px] left-[20%] w-[180px] h-[180px] rounded-full bg-white/10" />
        <div className="absolute top-[50px] left-[5%] w-[150px] h-[150px] rounded-full bg-white/8" />
        <div className="absolute top-[20px] right-[10%] w-[160px] h-[160px] rounded-full bg-white/5" />
        <div className="absolute top-[280px] left-[8%] w-[110px] h-[110px] rounded-full bg-white/5" />
        <div className="absolute bottom-[220px] right-[8%] w-[200px] h-[200px] rounded-full bg-white/5" />
        <div className="absolute bottom-[-30px] left-[15%] w-[190px] h-[190px] rounded-full bg-white/5" />
        <div className="absolute bottom-[-60px] right-[20%] w-[220px] h-[220px] rounded-full bg-white/10" />
      </div>

      <div className="w-full max-w-[650px] mx-auto px-4 mt-[110px] sm:mt-[120px] relative z-10">

        {/* INTRO */}
        <div className="text-center mb-6">
          <span className="text-xs font-black uppercase tracking-widest text-white/50">We&apos;d Love to Hear From You</span>
          <p className="mt-2 text-xs sm:text-sm font-semibold text-white/60 leading-relaxed max-w-lg mx-auto">
            Bug to report, game to suggest, or a business idea to pitch — LokaYantra is built and run by one
            developer, and every message that comes through here is read personally. Expect a reply within 24–48 hours.
          </p>
        </div>

        {/* FORM CARD — white island (intentional, like other pop-accent
            elements site-wide) — icons/text inside stay black-on-white */}
        <div
          className="border border-black/10 p-8 sm:p-10 rounded-[32px] shadow-2xl backdrop-blur-xl space-y-6"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.92)" }}
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
              <h2 className="text-xl font-black uppercase text-black">Transmission Received!</h2>
              <p className="text-xs font-bold text-black/60 uppercase">The LokaYantra team will respond shortly.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-black underline uppercase text-black"
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
                  className="w-full h-[46px] px-4 rounded-[16px] bg-white border border-black/10 focus:border-black outline-none font-bold text-sm text-black placeholder-black/40 transition-all"
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
                  className="w-full h-[46px] px-4 rounded-[16px] bg-white border border-black/10 focus:border-black outline-none font-bold text-sm text-black placeholder-black/40 transition-all"
                  placeholder="YOU@EXAMPLE.COM"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-black/60">Topic</label>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTopic(t)}
                      className={`text-[10px] font-black uppercase tracking-wide px-3 py-2 rounded-full border transition-all ${
                        topic === t
                          ? "bg-[#161920] text-white border-[#161920]"
                          : "bg-white text-black/60 border-black/10 hover:border-black/30"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-black/60">Transmission / Message</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 rounded-[16px] bg-white border border-black/10 focus:border-black outline-none font-bold text-sm text-black placeholder-black/40 transition-all resize-none"
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

          {/* SOCIAL LINKS */}
          <div className="border-t border-black/10 pt-5 flex items-center justify-center gap-3">
            <Link href="https://www.instagram.com/lokayantraofficial?utm_source=qr&igsh=MXBndWQ3MG9uaDE1bw%3D%3D" target="_blank" rel="noopener noreferrer" aria-label="LokaYantra on Instagram"
              className="w-9 h-9 bg-black rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-md">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </Link>
            <Link href="https://youtube.com/@official.lokayantra?si=0SE7fSqRAd5WxW3h" target="_blank" rel="noopener noreferrer" aria-label="LokaYantra on YouTube"
              className="w-9 h-9 bg-black rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-md">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </Link>
          </div>

          <div className="border-t border-black/10 pt-4 text-center">
            <Link href="/" className="text-xs font-black uppercase tracking-wider text-black/40 hover:text-black transition-colors">
              ← Return Home
            </Link>
          </div>
        </div>

        {/* MINI FAQ */}
        <div className="mt-8 mb-4">
          <h2 className="text-center text-[11px] font-black uppercase tracking-[0.2em] text-white/50 mb-4">
            Before You Send — Quick Answers
          </h2>
          <div className="flex flex-col gap-3">
            {CONTACT_FAQS.map((f, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-[11px] font-black uppercase tracking-wide text-white/80 mb-1">{f.q}</h3>
                <p className="text-xs text-white/60 font-semibold leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}