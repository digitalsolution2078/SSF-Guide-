"use client";

import { useState } from "react";
import {
  assessmentQuestions,
  scoreAssessment,
  type AssessmentResult,
} from "@/lib/assessment";
import { Link } from "@/i18n/navigation";

export function SsfAssessment() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const total = assessmentQuestions.length;

  if (result) {
    const pct = result.score * 10;
    const color =
      result.score >= 8 ? "#dc2626" : result.score >= 5 ? "#F97316" : "#16a34a";
    return (
      <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
        {/* gauge */}
        <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full"
          style={{ background: `conic-gradient(${color} ${pct * 3.6}deg, #f3f4f6 0deg)` }}>
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
            <span className="text-3xl font-bold" style={{ color }}>
              {result.score}
            </span>
            <span className="text-xs text-gray-400">/ 10</span>
          </div>
        </div>

        <h2 className="mt-5 text-center text-xl font-bold text-primary-900">
          {result.headline}
        </h2>
        <p className="mt-3 text-gray-700">{result.summary}</p>

        {result.factors.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-semibold text-gray-800">
              तपाईंको अवस्थाका मुख्य कारण:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-700">
              {result.factors.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/calculators/contribution"
            className="rounded-xl border-2 border-primary-200 bg-white p-4 text-center text-sm font-semibold text-primary-800 hover:border-primary-400"
          >
            🧮 मासिक योगदान कति पर्छ हेर्नुहोस्
          </Link>
          <Link
            href="/request?service=registration"
            className="rounded-xl bg-action-500 p-4 text-center text-sm font-semibold text-white hover:bg-action-600"
          >
            🤝 SSF जोडिन सहायता लिनुहोस्
          </Link>
        </div>

        <p className="mt-5 text-xs text-gray-500">
          ⚠️ यो शैक्षिक प्रारम्भिक मूल्याङ्कन हो, वित्तीय सल्लाह होइन। अन्तिम
          योग्यता र सुविधा आधिकारिक SSF नियमबमोजिम हुन्छ।
        </p>

        <button
          type="button"
          onClick={() => {
            setAnswers({});
            setStep(0);
            setResult(null);
          }}
          className="mt-4 text-sm text-gray-400 hover:text-primary-600"
        >
          ↺ फेरि गर्नुहोस्
        </button>
      </div>
    );
  }

  const q = assessmentQuestions[step];
  return (
    <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
      <p className="text-xs text-gray-400">
        प्रश्न {step + 1} / {total}
      </p>
      <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
        <div
          className="h-1.5 rounded-full bg-primary-500 transition-all"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-900">{q.prompt}</p>
      <div className="mt-4 flex flex-col gap-2">
        {q.options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => {
              const next = { ...answers, [q.key]: o.value };
              setAnswers(next);
              if (step + 1 >= total) setResult(scoreAssessment(next));
              else setStep(step + 1);
            }}
            className="rounded-lg border border-primary-200 px-4 py-3 text-left text-sm text-gray-800 transition hover:border-primary-500 hover:bg-primary-50"
          >
            {o.label}
          </button>
        ))}
      </div>
      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="mt-4 text-sm text-gray-400 hover:text-primary-600"
        >
          ← पछाडि
        </button>
      )}
    </div>
  );
}
