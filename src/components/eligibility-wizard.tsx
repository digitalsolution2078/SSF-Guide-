"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";

/**
 * Preliminary eligibility checker — product spec §9.
 * Client-side rules from knowledge-base/verified-facts.md §3.
 * Never shows a hard "Not Eligible" unless the rule is unequivocal.
 */

type Verdict = "LIKELY" | "CONDITIONS" | "MORE_HISTORY" | "INFO";

interface Result {
  verdict: Verdict;
  title: string;
  reasons: string[];
  nextSteps: string[];
  checklistSlug?: string;
}

const OUTCOMES = [
  { key: "pension", label: "Pension (निवृत्तभरण)" },
  { key: "medical", label: "औषधि उपचार सुविधा" },
  { key: "maternity", label: "मातृत्व सुविधा" },
  { key: "accident", label: "दुर्घटना सुविधा" },
  { key: "dependent", label: "आश्रित परिवार सुविधा" },
  { key: "registration", label: "नयाँ Registration / KYC" },
] as const;

const MONTHS_OPTS = [
  { value: "0", label: "योगदान सुरु गरेको छैन" },
  { value: "lt3", label: "३ महिनाभन्दा कम" },
  { value: "3to12", label: "३–१२ महिना" },
  { value: "12to180", label: "१ वर्षदेखि १५ वर्ष" },
  { value: "gte180", label: "१८० महिना (१५ वर्ष) वा बढी" },
];

function evaluate(
  outcome: string,
  answers: Record<string, string>,
): Result {
  const m = answers.months;
  const regular = answers.regular === "yes";

  switch (outcome) {
    case "pension": {
      if (answers.age === "gte60" && m === "gte180")
        return {
          verdict: "LIKELY",
          title: "आजीवन मासिक pension को योग्यता देखिन्छ",
          reasons: ["६० वर्ष पूरा + १८० महिना योगदान (कार्यविधि २०७५, दफा २१)"],
          nextSteps: ["अनुसूची ८–१० फाराम भरी दाबी गर्नुहोस्", "रकम = (जम्मा + प्रतिफल) ÷ १६०"],
        };
      if (answers.age === "gte60")
        return {
          verdict: "CONDITIONS",
          title: "६० वर्ष पुग्नुभयो तर १८० महिना पुगेको छैन — दुई विकल्प",
          reasons: ["एकमुष्ट रकम (प्रतिफलसहित) लिने, वा", "सोही रकम ÷ १६० को आजीवन मासिक pension रोज्ने"],
          nextSteps: ["Financial Planner मा दुवै विकल्प तुलना गर्नुहोस्"],
        };
      return {
        verdict: "INFO",
        title: "६० वर्षपछि pension — अहिलेदेखि योजना बनाउनुहोस्",
        reasons: ["योग्यता: ६० वर्ष + १८० महिना योगदान", "जति चाँडो सुरु, १८० महिना त्यति सजिलो पुग्छ"],
        nextSteps: ["Financial Planner मा आफ्नो projection हेर्नुहोस्"],
      };
    }
    case "medical":
    case "maternity": {
      if (m === "0" || m === "lt3")
        return {
          verdict: "MORE_HISTORY",
          title: "अझै योगदान अवधि पुगेको छैन",
          reasons: ["योग्यता: पछिल्ला ६ महिनामा कम्तीमा ३ महिना नियमित योगदान (दफा ४)"],
          nextSteps: ["योगदान नियमित राख्नुहोस् — ३ महिना पुगेपछि सुविधा सुरु हुन्छ"],
          checklistSlug: outcome === "maternity" ? "maternity-claim" : "medical-claim",
        };
      if (!regular)
        return {
          verdict: "CONDITIONS",
          title: "योगदान अनियमित — यकिन गर्न contribution history हेर्नुहोस्",
          reasons: ["पछिल्ला ६ महिनामा ३ महिना नियमित भए मात्र सुविधा पाइन्छ", "योगदान छाडेको ३ महिनासम्म मात्र सुविधा कायम रहन्छ"],
          nextSteps: ["SOSYS मा पछिल्लो ६ महिनाको history जाँच्नुहोस्"],
          checklistSlug: outcome === "maternity" ? "maternity-claim" : "medical-claim",
        };
      return {
        verdict: "LIKELY",
        title: "सुविधाको योग्यता देखिन्छ",
        reasons: [
          outcome === "maternity"
            ? "प्रति शिशु १ महिनाको न्यूनतम पारिश्रमिक + उपचार खर्च (सीमाभित्र)"
            : "भर्ना उपचार वार्षिक रु. १ लाखसम्म + OPD रु. २० हजार (२०% सह-भुक्तानी)",
        ],
        nextSteps: ["कागजात checklist हेरेर दाबी पेश गर्नुहोस्"],
        checklistSlug: outcome === "maternity" ? "maternity-claim" : "medical-claim",
      };
    }
    case "accident": {
      if (answers.workRelated === "yes")
        return {
          verdict: "LIKELY",
          title: "रोजगारीजन्य दुर्घटना — पहिलो दिनदेखि नै सुविधा",
          reasons: ["पूरै उपचार खर्च कोषले व्यहोर्छ (योगदान सुरु भएदेखि लागू)"],
          nextSteps: ["७ दिनभित्र कोषलाई जानकारी गराउनुहोस् — नत्र सम्झौता नभएको अस्पतालमा रु. ७ लाख मात्र", "अनुसूची ४/५ फाराम भर्नुहोस्"],
          checklistSlug: "accident-disability-claim",
        };
      return {
        verdict: "CONDITIONS",
        title: "गैर-रोजगारीजन्य दुर्घटना — सीमासहित सुविधा",
        reasons: ["उपचार खर्च रु. ७ लाखसम्म मात्र", "अन्य बीमाबाट ७ लाख वा बढी पाए कोषले व्यहोर्दैन", "योगदान चालु हुनुपर्छ"],
        nextSteps: ["कागजातसहित दाबी पेश गर्नुहोस्"],
        checklistSlug: "accident-disability-claim",
      };
    }
    case "dependent": {
      if (answers.workRelated === "yes")
        return {
          verdict: "LIKELY",
          title: "रोजगारीजन्य मृत्यु — पहिलो दिनदेखि सुविधा लागू",
          reasons: ["पति/पत्नीलाई तलबको ६०% आजीवन", "२ सन्ततिसम्म ४०% शैक्षिक वृत्ति", "अन्तिम संस्कार रु. २५,०००"],
          nextSteps: ["नाता प्रमाणित र मृत्यु दर्तासहित अनुसूची ६/७ पेश गर्नुहोस्"],
        };
      if (m === "12to180" || m === "gte180")
        return {
          verdict: "LIKELY",
          title: "१२ महिना योगदान पुगेको — सुविधाको योग्यता देखिन्छ",
          reasons: ["अन्य कारणको मृत्युमा १२ महिना नियमित योगदान चाहिन्छ (५औँ संशोधन)"],
          nextSteps: ["अनुसूची ६/७ फाराम + कागजात पेश गर्नुहोस्"],
        };
      return {
        verdict: "CONDITIONS",
        title: "उपलब्ध जानकारीका आधारमा eligibility पुष्टि गर्न सकिएन",
        reasons: ["गैर-रोजगारीजन्य मृत्युमा १२ महिना नियमित योगदान आवश्यक हुन्छ", "contribution history हेरेर मात्र यकिन हुन्छ"],
        nextSteps: ["Digital Solution लाई history सहित सम्पर्क गर्नुहोस् — निःशुल्क जाँच गरिदिन्छौँ"],
      };
    }
    default: // registration
      return {
        verdict: "LIKELY",
        title: "तपाईं SSF मा आबद्ध हुन सक्नुहुन्छ",
        reasons: [
          "औपचारिक क्षेत्र: रोजगारदातामार्फत अनिवार्य",
          "स्वरोजगार/अनौपचारिक/वैदेशिक: आफैँ सूचीकरण गर्न मिल्ने",
        ],
        nextSteps: ["आफ्नो क्षेत्रको checklist हेरेर सुरु गर्नुहोस्"],
        checklistSlug: "kyc-verification",
      };
  }
}

const VERDICT_STYLE: Record<Verdict, { badge: string; cls: string }> = {
  LIKELY: { badge: "✅ सम्भावित योग्य", cls: "bg-green-50 text-green-800 border-green-300" },
  CONDITIONS: { badge: "⚠️ थप शर्त लागू हुनसक्छ", cls: "bg-action-50 text-action-700 border-action-500/40" },
  MORE_HISTORY: { badge: "⏳ थप योगदान अवधि आवश्यक", cls: "bg-primary-50 text-primary-800 border-primary-300" },
  INFO: { badge: "ℹ️ जानकारी", cls: "bg-gray-50 text-gray-700 border-gray-300" },
};

export function EligibilityWizard() {
  const [outcome, setOutcome] = useState<string>();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Result | null>(null);

  const needsAge = outcome === "pension";
  const needsWorkRelated = outcome === "accident" || outcome === "dependent";
  const needsMonths = outcome !== "registration" && outcome !== "accident";
  const needsRegular = outcome === "medical" || outcome === "maternity";

  const ready =
    outcome &&
    (!needsAge || answers.age) &&
    (!needsWorkRelated || answers.workRelated) &&
    (!needsMonths || answers.months) &&
    (!needsRegular || answers.regular);

  const btn = (active: boolean) =>
    `rounded-lg border px-4 py-2.5 text-sm text-left transition ${active ? "border-primary-600 bg-primary-50 font-semibold" : "border-primary-200 hover:border-primary-400"}`;

  if (result) {
    const style = VERDICT_STYLE[result.verdict];
    return (
      <div className={`rounded-2xl border-2 bg-white p-6 shadow-sm ${style.cls.split(" ").pop()}`}>
        <span className={`inline-block rounded-full border px-4 py-1.5 text-sm font-bold ${style.cls}`}>
          {style.badge}
        </span>
        <h2 className="mt-4 text-xl font-bold text-gray-900">{result.title}</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-700">
          {result.reasons.map((r) => <li key={r}>{r}</li>)}
        </ul>
        <p className="mt-4 text-sm font-semibold text-gray-800">अर्को कदम:</p>
        <ul className="mt-1 list-inside list-decimal space-y-1 text-sm text-gray-700">
          {result.nextSteps.map((s) => <li key={s}>{s}</li>)}
        </ul>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {result.checklistSlug && (
            <Link href={`/checklists/${result.checklistSlug}`} className="rounded-xl border-2 border-primary-200 bg-white p-4 text-center text-sm font-semibold text-primary-800 hover:border-primary-400">
              📋 कागजात checklist
            </Link>
          )}
          <Link href="/request" className="rounded-xl bg-action-500 p-4 text-center text-sm font-semibold text-white hover:bg-action-600">
            🤝 सहायता लिनुहोस्
          </Link>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          ⚠️ यो प्रारम्भिक शैक्षिक जाँच हो — अन्तिम योग्यता SSF को नियम र तपाईंको वास्तविक अभिलेखअनुसार हुन्छ। (स्रोत: योजना सञ्चालन कार्यविधि २०७५, ५औँ संशोधन)
        </p>
        <button type="button" onClick={() => { setOutcome(undefined); setAnswers({}); setResult(null); }} className="mt-3 text-sm text-gray-400 hover:text-primary-600">
          ↺ फेरि जाँच्नुहोस्
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
      <p className="font-semibold text-gray-900">कुन सुविधा/प्रक्रिया जाँच्ने?</p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {OUTCOMES.map((o) => (
          <button key={o.key} type="button" onClick={() => { setOutcome(o.key); setAnswers({}); }} className={btn(outcome === o.key)}>
            {o.label}
          </button>
        ))}
      </div>

      {needsAge && (
        <>
          <p className="mt-5 font-semibold text-gray-900">तपाईंको उमेर?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[["lt60", "६० मुनि"], ["gte60", "६० वा माथि"]].map(([v, l]) => (
              <button key={v} type="button" onClick={() => setAnswers((a) => ({ ...a, age: v }))} className={btn(answers.age === v)}>{l}</button>
            ))}
          </div>
        </>
      )}

      {needsWorkRelated && (
        <>
          <p className="mt-5 font-semibold text-gray-900">{outcome === "accident" ? "दुर्घटना काम/रोजगारीसँग सम्बन्धित हो?" : "मृत्यु रोजगारीजन्य दुर्घटनाबाट भएको हो?"}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[["yes", "हो"], ["no", "होइन"]].map(([v, l]) => (
              <button key={v} type="button" onClick={() => setAnswers((a) => ({ ...a, workRelated: v }))} className={btn(answers.workRelated === v)}>{l}</button>
            ))}
          </div>
        </>
      )}

      {needsMonths && (
        <>
          <p className="mt-5 font-semibold text-gray-900">कति समय योगदान भएको छ?</p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {MONTHS_OPTS.map((o) => (
              <button key={o.value} type="button" onClick={() => setAnswers((a) => ({ ...a, months: o.value }))} className={btn(answers.months === o.value)}>{o.label}</button>
            ))}
          </div>
        </>
      )}

      {needsRegular && (
        <>
          <p className="mt-5 font-semibold text-gray-900">पछिल्ला ६ महिनामा कम्तीमा ३ महिना नियमित योगदान छ?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[["yes", "छ"], ["no", "छैन / थाहा छैन"]].map(([v, l]) => (
              <button key={v} type="button" onClick={() => setAnswers((a) => ({ ...a, regular: v }))} className={btn(answers.regular === v)}>{l}</button>
            ))}
          </div>
        </>
      )}

      <button
        type="button"
        disabled={!ready}
        onClick={() => outcome && setResult(evaluate(outcome, answers))}
        className="mt-6 w-full rounded-xl bg-primary-600 py-3 font-bold text-white hover:bg-primary-700 disabled:opacity-40"
      >
        नतिजा हेर्नुहोस् →
      </button>
    </div>
  );
}
