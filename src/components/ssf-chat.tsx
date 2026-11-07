"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "./icons";

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
const WELCOME_EN =
  "Namaste! I'm Digital Solution's SSF Guide Assistant. I can help you with SSF information, calculations, document checklists, and process guidance.";

const CATEGORIES = [
  "कर्मचारी",
  "रोजगारदाता/HR",
  "वैदेशिक रोजगारी",
  "स्वरोजगार",
  "योगदानकर्ता/Beneficiary",
  "निश्चित छैन",
];
const CATEGORIES_EN = [
  "Employee",
  "Employer/HR",
  "Foreign employment",
  "Self-employed",
  "Contributor/Beneficiary",
  "Not sure",
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
const TOPICS_EN = [
  "Registration",
  "KYC",
  "Contribution",
  "Pension/Retirement",
  "Claim/Benefit",
  "Profile Correction",
  "Other question",
];

const CONFIDENCE_BADGE: Record<Confidence, { text: string; textEn: string; cls: string }> = {
  VERIFIED: {
    text: "स्रोतसहित प्रमाणित जानकारी",
    textEn: "Source-verified information",
    cls: "badge-health",
  },
  CONDITIONAL: {
    text: "यो उत्तर तपाईंको अवस्थाअनुसार फरक पर्न सक्छ।",
    textEn: "This answer may vary depending on your situation.",
    cls: "badge-primary",
  },
  INSUFFICIENT: {
    text: "थप जानकारी चाहिन्छ",
    textEn: "More information needed",
    cls: "badge-neutral",
  },
  UNSUPPORTED: {
    text: "Verified जानकारी अपुग",
    textEn: "Insufficient verified information",
    cls: "badge-action",
  },
};

export function SsfChat() {
  const locale = useLocale();
  const isEn = locale === "en";
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
          {
            role: "model",
            text:
              data.error ??
              (isEn
                ? "Something went wrong — please try again."
                : "त्रुटि भयो — पुनः प्रयास गर्नुहोस्।"),
          },
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
        {
          role: "model",
          text: isEn
            ? "Network problem — please try again."
            : "नेटवर्क समस्या भयो — पुनः प्रयास गर्नुहोस्।",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card flex h-[70vh] flex-col overflow-hidden">
      {/* transcript */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
        <Bubble role="model" text={isEn ? WELCOME_EN : WELCOME} />

        {step === "category" && (
          <div className="space-y-3">
            <Bubble
              role="model"
              text={isEn ? "Which category do you fall into?" : "तपाईं कुन Category मा पर्नुहुन्छ?"}
            />
            <div className="flex flex-wrap gap-2">
              {(isEn ? CATEGORIES_EN : CATEGORIES).map((c) => (
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
          <div className="space-y-3">
            <Bubble
              role="model"
              text={isEn ? "Which topic do you need help with?" : "तपाईंलाई कुन विषयमा सहायता चाहिएको हो?"}
            />
            <div className="flex flex-wrap gap-2">
              {(isEn ? TOPICS_EN : TOPICS).map((t) => (
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
            text={
              isEn
                ? `Great — write your question about ${topic}.`
                : `ठिक छ — ${topic} सम्बन्धी आफ्नो प्रश्न लेख्नुहोस्।`
            }
          />
        )}

        {messages.map((m, i) => (
          <div key={i} className="space-y-2">
            <Bubble role={m.role} text={m.text} />
            {m.role === "model" && m.confidence && (
              <p>
                <span className={CONFIDENCE_BADGE[m.confidence].cls}>
                  {m.confidence === "VERIFIED" && <Icon name="check" size={12} />}
                  {isEn
                    ? CONFIDENCE_BADGE[m.confidence].textEn
                    : CONFIDENCE_BADGE[m.confidence].text}
                </span>
              </p>
            )}
            {m.role === "model" && m.citations && m.citations.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-ink-400">{isEn ? "Sources:" : "स्रोत:"}</span>
                {m.citations.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="badge-primary hover:bg-primary-100"
                    title={`${isEn ? "verified" : "प्रमाणित"}: ${c.lastVerified}`}
                  >
                    <Icon name="book" size={12} />
                    {c.title}
                  </Link>
                ))}
              </div>
            )}
            {m.role === "model" && m.waFallback && (
              <a
                href="https://whatsapp.digitalsolutionnepal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm bg-[#25D366] text-white shadow-sm hover:bg-[#1DA851]"
              >
                <Icon name="chat" size={14} />
                {isEn ? "Chat directly on WhatsApp" : "WhatsApp मा सीधै कुरा गर्नुहोस्"}
                <Icon name="arrowUpRight" size={14} />
              </a>
            )}
            {m.role === "model" && m.needsEscalation && (
              <Link href="/request" className="btn-accent btn-sm">
                {isEn ? "Get help from Digital Solution" : "Digital Solution बाट सहायता लिनुहोस्"}
                <Icon name="arrowRight" size={14} />
              </Link>
            )}
          </div>
        ))}

        {busy && (
          <p className="flex items-center gap-2 text-sm text-ink-400">
            <span className="inline-flex gap-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-400" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-400 [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-400 [animation-delay:300ms]" />
            </span>
            {isEn ? "SSF Assistant is thinking…" : "SSF Assistant सोच्दै छ…"}
          </p>
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
        className="border-t border-ink-200 bg-ink-50 p-3 sm:p-4"
      >
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isEn ? "Write your SSF question…" : "SSF सम्बन्धी प्रश्न लेख्नुहोस्…"}
            maxLength={2000}
            className="input"
          />
          <button
            type="submit"
            disabled={busy || input.trim().length === 0}
            className="btn-primary shrink-0"
            aria-label={isEn ? "Send" : "पठाउनुहोस्"}
          >
            <Icon name="send" size={18} />
            <span className="hidden sm:inline">{isEn ? "Send" : "पठाउनुहोस्"}</span>
          </button>
        </div>
        <p className="mt-2 flex items-start gap-1.5 text-xs text-ink-400">
          <Icon name="alert" size={13} className="mt-0.5 shrink-0" />
          <span>
            {isEn
              ? "Do not send sensitive documents, OTPs, or passwords in the chat. Answers are educational information — official decisions follow SSF's rules."
              : "संवेदनशील कागजात, OTP वा Password chat मा नपठाउनुहोस्। उत्तरहरू शैक्षिक जानकारी हुन् — आधिकारिक निर्णय SSF को नियमबमोजिम हुन्छ।"}
          </span>
        </p>
      </form>
    </div>
  );
}

function Bubble({ role, text }: { role: "user" | "model"; text: string }) {
  return (
    <div className={role === "user" ? "flex justify-end" : "flex justify-start"}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap px-4 py-2.5 text-sm leading-relaxed ${
          role === "user"
            ? "rounded-2xl rounded-br-md bg-primary-600 text-white"
            : "rounded-2xl rounded-bl-md bg-ink-50 text-ink-800"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function Chip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="chip">
      {label}
    </button>
  );
}
