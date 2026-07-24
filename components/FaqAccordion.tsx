"use client";

import { useState } from "react";

interface FaqItem {
  question?: string;
  answer?: string;
  q?: string;
  a?: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const question = item.question ?? item.q ?? "";
        const answer = item.answer ?? item.a ?? "";
        return (
          <div
            key={i}
            className={`rounded-[14px] border overflow-hidden transition-all duration-200 ${
              isOpen ? "border-white/20 bg-white/10" : "border-white/8 bg-white/5"
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
            >
              <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wide leading-snug">
                {question}
              </span>
              <svg
                className={`w-4 h-4 flex-shrink-0 text-white/40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 text-xs text-white/60 font-semibold leading-relaxed border-t border-white/8 pt-3">
                {answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}