"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

type Confidence = "VERIFIED" | "CONDITIONAL" | "INSUFFICIENT" | "UNSUPPORTED";

interface Citation {
  title: string;
  href: string;
  sources: string[];
  lastVerified: string;
}

interface Message {
  role: "user" | "model";
  text: string;
  confidence?: Confidence;
  citations?: Citation[];
  needsEscalation?: boolean;
  waFallback?: boolean;
}

const WELCOME =
  "नमस्कार! म Digital Solution को SSF Guide Assistant हुँ। म तपाईंलाई SSF सम्बन्धी जानकारी, calculation, document checklist र process guidance दिन सक्छु।";

const CATEGORIES = [
  "कर्मचारी",
  "रोजगारदाता/HR",
  "वैदेशिक रोजगारी",
  "स्वरोजगार",
  "योगदानकर्ता/Beneficiary",
  "निश्चित छैन",
];

const TOPICS = [
  "Registration",
  "KYC",
  "Contribution",
  "Pension/Retirement",
  "Claim/Benefit",
  "Profile Correction",
  "अन्य प्रश्न",
];

const CONFIDENCE_BADGE: Record<Confidence, { text: string; cls: string }> = {
  VERIFIED: {
    text: "✓ स्रोतसहित प्रमाणित जानकारी",
    cls: "bg-green-50 text-green-700",
  },
  CONDITIONAL: {
    text: "यो उत्तर तपाईंको अवस्थाअनुसार फरक पर्न सक्छ।",
    cls: "bg-primary-50 text-primary-700",
  },
  INSUFFICIENT: { text: "थप जानकारी चाहिन्छ", cls: "bg-gray-100 text-gray-600" },
  UNSUPPORTED: {
    text: "Verified जानकारी अपुग",
    cls: "bg-action-50 text-action-700",
  },
};

export function SsfChat() {
  const [step, setStep] = useState<"category" | "topic" | "chat">("category");
  const [category, setCategory] = useState<string>();
  const [topic, setTopic] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, step]);

  async function send(text: string) {
    const userMessage: Message = { role: "user", text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, text }) => ({ role, text })),
          userCategory: category,
          topic,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((m) => [
          ...m,
          { role: "model", text: data.error ?? "त्रुटि भयो — पुनः प्रयास गर्नुहोस्।" },
        ]);
        return;
      }
      setMessages((m) => [
        ...m,
        {
          role: "model",
          text: data.followUpQuestion
            ? `${data.answer}\n\n${data.followUpQuestion}`
            : data.answer,
          confidence: data.confidence,
          citations: data.citations,
          needsEscalation: data.needsEscalation,
          waFallback: data.aiAvailable === false,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "model", text: "नेटवर्क समस्या भयो — पुनः प्रयास गर्नुहोस्।" },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-[70vh] flex-col rounded-xl border border-primary-100 bg-white shadow-sm">
      {/* transcript */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <Bubble role="model" text={WELCOME} />

        {step === "category" && (
          <div className="space-y-2">
            <Bubble role="model" text="तपाईं कुन Category मा पर्नुहुन्छ?" />
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  onClick={() => {
                    setCategory(c);
                    setStep("topic");
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {step !== "category" && category && (
          <Bubble role="user" text={category} />
        )}

        {step === "topic" && (
          <div className="space-y-2">
            <Bubble role="model" text="तपाईंलाई कुन विषयमा सहायता चाहिएको हो?" />
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  onClick={() => {
                    setTopic(t);
                    setStep("chat");
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {step === "chat" && topic && <Bubble role="user" text={topic} />}
        {step === "chat" && messages.length === 0 && (
          <Bubble
            role="model"
            text={`ठिक छ — ${topic} सम्बन्धी आफ्नो प्रश्न लेख्नुहोस्।`}
          />
        )}

        {messages.map((m, i) => (
          <div key={i} className="space-y-2">
            <Bubble role={m.role} text={m.text} />
            {m.role === "model" && m.confidence && (
              <p
                className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${CONFIDENCE_BADGE[m.confidence].cls}`}
              >
                {CONFIDENCE_BADGE[m.confidence].text}
              </p>
            )}
            {m.role === "model" && m.citations && m.citations.length > 0 && (
              <div className="ml-2 space-y-1 border-l-2 border-primary-100 pl-3 text-xs text-gray-500">
                {m.citations.map((c) => (
                  <p key={c.href}>
                    📖{" "}
                    <Link href={c.href} className="underline hover:text-primary-600">
                      {c.title}
                    </Link>{" "}
                    (प्रमाणित: {c.lastVerified})
                  </p>
                ))}
              </div>
            )}
            {m.role === "model" && m.waFallback && (
              <a
                href="https://whatsapp.digitalsolutionnepal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
              >
                💬 WhatsApp मा सीधै कुरा गर्नुहोस् →
              </a>
            )}
            {m.role === "model" && m.needsEscalation && (
              <Link
                href="/request"
                className="inline-block rounded-lg bg-action-500 px-4 py-2 text-sm font-semibold text-white hover:bg-action-600"
              >
                Digital Solution बाट सहायता लिनुहोस् →
              </Link>
            )}
          </div>
        ))}

        {busy && (
          <p className="text-sm text-gray-400">SSF Assistant सोच्दै छ…</p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const text = input.trim();
          if (text && !busy) {
            if (step !== "chat") setStep("chat");
            void send(text);
          }
        }}
        className="border-t border-primary-100 p-3"
      >
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="SSF सम्बन्धी प्रश्न लेख्नुहोस्…"
            maxLength={2000}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
          <button
            type="submit"
            disabled={busy || input.trim().length === 0}
            className="rounded-lg bg-primary-600 px-5 py-2.5 font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
          >
            पठाउनुहोस्
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          ⚠️ संवेदनशील कागजात, OTP वा Password chat मा नपठाउनुहोस्। उत्तरहरू
          शैक्षिक जानकारी हुन् — आधिकारिक निर्णय SSF को नियमबमोजिम हुन्छ।
        </p>
      </form>
    </div>
  );
}

function Bubble({ role, text }: { role: "user" | "model"; text: string }) {
  return (
    <div className={role === "user" ? "flex justify-end" : "flex justify-start"}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          role === "user"
            ? "bg-primary-600 text-white"
            : "bg-gray-50 text-gray-800"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function Chip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-primary-200 bg-white px-4 py-1.5 text-sm text-primary-800 transition hover:bg-primary-50"
    >
      {label}
    </button>
  );
}
