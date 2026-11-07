"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import {
  assessmentQuestions,
  scoreAssessment,
  type AssessmentResult,
} from "@/lib/assessment";
import { Link } from "@/i18n/navigation";
import { Icon } from "./icons";

export function SsfAssessment() {
  const locale = useLocale();
  const isEn = locale === "en";
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const total = assessmentQuestions.length;

  if (result) {
    const pct = result.score * 10;
    const color =
      result.score >= 8 ? "#dc2626" : result.score >= 5 ? "#F26B1D" : "#16a34a";
    return (
      <div className="card p-5 md:p-6">
        {/* gauge */}
        <div
          className="mx-auto flex h-36 w-36 items-center justify-center rounded-full"
          style={{ background: `conic-gradient(${color} ${pct * 3.6}deg, #EEF0F4 0deg)` }}
        >
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
            <span className="font-display text-4xl font-bold tracking-tight" style={{ color }}>
              {result.score}
            </span>
            <span className="text-xs text-ink-400">/ 10</span>
          </div>
        </div>

        <h2 className="mt-5 text-center text-2xl">
          {result.headline}
        </h2>
        <p className="mt-3 text-center leading-relaxed text-ink-700">{result.summary}</p>

        {result.factors.length > 0 && (
          <div className="surface mt-6 p-4">
            <p className="text-sm font-semibold text-ink-900">
              {isEn
                ? "Key factors in your situation:"
                : "तपाईंको अवस्थाका मुख्य कारण:"}
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-700">
              {result.factors.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <Icon name="check" size={16} className="mt-0.5 shrink-0 text-primary-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/request?service=registration" className="btn-accent">
            <Icon name="chat" size={16} />
            {isEn ? "Get help joining SSF" : "SSF जोडिन सहायता लिनुहोस्"}
          </Link>
          <Link href="/calculators/contribution" className="btn-outline">
            <Icon name="calculator" size={16} />
            {isEn
              ? "See what your monthly contribution would be"
              : "मासिक योगदान कति पर्छ हेर्नुहोस्"}
          </Link>
        </div>

        <p className="mt-5 flex gap-2 text-xs text-ink-500">
          <Icon name="alert" size={14} className="mt-0.5 shrink-0" />
          <span>
            {isEn
              ? "This is a preliminary educational assessment, not financial advice. Final eligibility and benefits follow official SSF rules."
              : "यो शैक्षिक प्रारम्भिक मूल्याङ्कन हो, वित्तीय सल्लाह होइन। अन्तिम योग्यता र सुविधा आधिकारिक SSF नियमबमोजिम हुन्छ।"}
          </span>
        </p>

        <button
          type="button"
          onClick={() => {
            setAnswers({});
            setStep(0);
            setResult(null);
          }}
          className="btn-ghost btn-sm -ml-2 mt-3"
        >
          <Icon name="refresh" size={14} />
          {isEn ? "Start over" : "फेरि गर्नुहोस्"}
        </button>
      </div>
    );
  }

  const q = assessmentQuestions[step];
  return (
    <div className="card p-5 md:p-6">
      {/* progress */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5" aria-hidden>
          {assessmentQuestions.map((qq, i) => (
            <span
              key={qq.key}
              className={`h-2 rounded-full transition-all ${
                i < step ? "w-4 bg-primary-600" : i === step ? "w-6 bg-primary-400" : "w-2 bg-ink-200"
              }`}
            />
          ))}
        </div>
        <span className="badge-neutral whitespace-nowrap">
          {isEn ? "Question" : "प्रश्न"} {step + 1} / {total}
        </span>
      </div>

      <p className="mt-5 font-display text-xl font-semibold leading-snug text-ink-900">
        {isEn ? q.promptEn : q.prompt}
      </p>
      <div className="mt-4 flex flex-col gap-2">
        {q.options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => {
              const next = { ...answers, [q.key]: o.value };
              setAnswers(next);
              if (step + 1 >= total) setResult(scoreAssessment(next, locale));
              else setStep(step + 1);
            }}
            className={`card card-hover group flex items-center justify-between gap-3 p-4 text-left text-sm text-ink-800 ${
              answers[q.key] === o.value ? "border-primary-600 bg-primary-50 font-semibold text-primary-900" : ""
            }`}
          >
            <span>{isEn ? o.labelEn : o.label}</span>
            <Icon name="chevronRight" size={16} className="shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-primary-600" />
          </button>
        ))}
      </div>
      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="btn-ghost btn-sm -ml-2 mt-4"
        >
          <Icon name="arrowRight" size={14} className="rotate-180" />
          {isEn ? "Back" : "पछाडि"}
        </button>
      )}
    </div>
  );
}
