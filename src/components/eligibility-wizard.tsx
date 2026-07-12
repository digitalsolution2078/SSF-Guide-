"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
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
  { key: "pension", label: "Pension (निवृत्तभरण)", labelEn: "Pension" },
  { key: "medical", label: "औषधि उपचार सुविधा", labelEn: "Medical treatment benefit" },
  { key: "maternity", label: "मातृत्व सुविधा", labelEn: "Maternity benefit" },
  { key: "accident", label: "दुर्घटना सुविधा", labelEn: "Accident benefit" },
  { key: "dependent", label: "आश्रित परिवार सुविधा", labelEn: "Dependent family benefit" },
  { key: "registration", label: "नयाँ Registration / KYC", labelEn: "New Registration / KYC" },
] as const;

const MONTHS_OPTS = [
  { value: "0", label: "योगदान सुरु गरेको छैन", labelEn: "Haven't started contributing" },
  { value: "lt3", label: "३ महिनाभन्दा कम", labelEn: "Less than 3 months" },
  { value: "3to12", label: "३–१२ महिना", labelEn: "3–12 months" },
  { value: "12to180", label: "१ वर्षदेखि १५ वर्ष", labelEn: "1 to 15 years" },
  { value: "gte180", label: "१८० महिना (१५ वर्ष) वा बढी", labelEn: "180 months (15 years) or more" },
];

function evaluate(
  outcome: string,
  answers: Record<string, string>,
  isEn: boolean,
): Result {
  const T = (ne: string, en: string) => (isEn ? en : ne);
  const m = answers.months;
  const regular = answers.regular === "yes";

  switch (outcome) {
    case "pension": {
      if (answers.age === "gte60" && m === "gte180")
        return {
          verdict: "LIKELY",
          title: T("आजीवन मासिक pension को योग्यता देखिन्छ", "You appear eligible for a lifelong monthly pension"),
          reasons: [T("६० वर्ष पूरा + १८० महिना योगदान (कार्यविधि २०७५, दफा २१)", "Age 60 completed + 180 months of contributions (Procedure 2075, section 21)")],
          nextSteps: [
            T("अनुसूची ८–१० फाराम भरी दाबी गर्नुहोस्", "Claim by filling in Schedule 8–10 forms"),
            T("रकम = (जम्मा + प्रतिफल) ÷ १६०", "Amount = (deposits + returns) ÷ 160"),
          ],
        };
      if (answers.age === "gte60")
        return {
          verdict: "CONDITIONS",
          title: T("६० वर्ष पुग्नुभयो तर १८० महिना पुगेको छैन — दुई विकल्प", "You're 60 but haven't reached 180 months — two options"),
          reasons: [
            T("एकमुष्ट रकम (प्रतिफलसहित) लिने, वा", "Take the lump sum (with returns), or"),
            T("सोही रकम ÷ १६० को आजीवन मासिक pension रोज्ने", "Choose a lifelong monthly pension of that amount ÷ 160"),
          ],
          nextSteps: [T("Financial Planner मा दुवै विकल्प तुलना गर्नुहोस्", "Compare both options in the Financial Planner")],
        };
      return {
        verdict: "INFO",
        title: T("६० वर्षपछि pension — अहिलेदेखि योजना बनाउनुहोस्", "Pension after 60 — start planning now"),
        reasons: [
          T("योग्यता: ६० वर्ष + १८० महिना योगदान", "Eligibility: age 60 + 180 months of contributions"),
          T("जति चाँडो सुरु, १८० महिना त्यति सजिलो पुग्छ", "The earlier you start, the easier it is to reach 180 months"),
        ],
        nextSteps: [T("Financial Planner मा आफ्नो projection हेर्नुहोस्", "See your projection in the Financial Planner")],
      };
    }
    case "medical":
    case "maternity": {
      if (m === "0" || m === "lt3")
        return {
          verdict: "MORE_HISTORY",
          title: T("अझै योगदान अवधि पुगेको छैन", "You haven't reached the qualifying period yet"),
          reasons: [T("योग्यता: पछिल्ला ६ महिनामा कम्तीमा ३ महिना नियमित योगदान (दफा ४)", "Eligibility: at least 3 months of regular contributions within the last 6 (section 4)")],
          nextSteps: [T("योगदान नियमित राख्नुहोस् — ३ महिना पुगेपछि सुविधा सुरु हुन्छ", "Keep contributing regularly — the benefit starts once you reach 3 months")],
          checklistSlug: outcome === "maternity" ? "maternity-claim" : "medical-claim",
        };
      if (!regular)
        return {
          verdict: "CONDITIONS",
          title: T("योगदान अनियमित — यकिन गर्न contribution history हेर्नुहोस्", "Irregular contributions — check your contribution history to be sure"),
          reasons: [
            T("पछिल्ला ६ महिनामा ३ महिना नियमित भए मात्र सुविधा पाइन्छ", "The benefit applies only with 3 regular months within the last 6"),
            T("योगदान छाडेको ३ महिनासम्म मात्र सुविधा कायम रहन्छ", "After contributions stop, the benefit lasts only 3 more months"),
          ],
          nextSteps: [T("SOSYS मा पछिल्लो ६ महिनाको history जाँच्नुहोस्", "Check your last 6 months' history in SOSYS")],
          checklistSlug: outcome === "maternity" ? "maternity-claim" : "medical-claim",
        };
      return {
        verdict: "LIKELY",
        title: T("सुविधाको योग्यता देखिन्छ", "You appear eligible for the benefit"),
        reasons: [
          outcome === "maternity"
            ? T("प्रति शिशु १ महिनाको न्यूनतम पारिश्रमिक + उपचार खर्च (सीमाभित्र)", "One month's minimum wage per child + treatment costs (within limits)")
            : T("भर्ना उपचार वार्षिक रु. १ लाखसम्म + OPD रु. २० हजार (२०% सह-भुक्तानी)", "Inpatient treatment up to Rs. 100,000/year + OPD Rs. 20,000 (20% co-payment)"),
        ],
        nextSteps: [T("कागजात checklist हेरेर दाबी पेश गर्नुहोस्", "Review the document checklist and submit your claim")],
        checklistSlug: outcome === "maternity" ? "maternity-claim" : "medical-claim",
      };
    }
    case "accident": {
      if (answers.workRelated === "yes")
        return {
          verdict: "LIKELY",
          title: T("रोजगारीजन्य दुर्घटना — पहिलो दिनदेखि नै सुविधा", "Workplace accident — covered from day one"),
          reasons: [T("पूरै उपचार खर्च कोषले व्यहोर्छ (योगदान सुरु भएदेखि लागू)", "The Fund covers the full treatment cost (applies from when contributions started)")],
          nextSteps: [
            T("७ दिनभित्र कोषलाई जानकारी गराउनुहोस् — नत्र सम्झौता नभएको अस्पतालमा रु. ७ लाख मात्र", "Inform the Fund within 7 days — otherwise only Rs. 700,000 at a non-contracted hospital"),
            T("अनुसूची ४/५ फाराम भर्नुहोस्", "Fill in the Schedule 4/5 forms"),
          ],
          checklistSlug: "accident-disability-claim",
        };
      return {
        verdict: "CONDITIONS",
        title: T("गैर-रोजगारीजन्य दुर्घटना — सीमासहित सुविधा", "Non-work accident — benefit with limits"),
        reasons: [
          T("उपचार खर्च रु. ७ लाखसम्म मात्र", "Treatment costs only up to Rs. 700,000"),
          T("अन्य बीमाबाट ७ लाख वा बढी पाए कोषले व्यहोर्दैन", "If you receive Rs. 700,000 or more from other insurance, the Fund doesn't pay"),
          T("योगदान चालु हुनुपर्छ", "Contributions must be active"),
        ],
        nextSteps: [T("कागजातसहित दाबी पेश गर्नुहोस्", "Submit your claim with documents")],
        checklistSlug: "accident-disability-claim",
      };
    }
    case "dependent": {
      if (answers.workRelated === "yes")
        return {
          verdict: "LIKELY",
          title: T("रोजगारीजन्य मृत्यु — पहिलो दिनदेखि सुविधा लागू", "Work-related death — the benefit applies from day one"),
          reasons: [
            T("पति/पत्नीलाई तलबको ६०% आजीवन", "The spouse receives 60% of the salary for life"),
            T("२ सन्ततिसम्म ४०% शैक्षिक वृत्ति", "Education stipend of 40% for up to 2 children"),
            T("अन्तिम संस्कार रु. २५,०००", "Funeral costs Rs. 25,000"),
          ],
          nextSteps: [T("नाता प्रमाणित र मृत्यु दर्तासहित अनुसूची ६/७ पेश गर्नुहोस्", "Submit Schedule 6/7 with the certified relationship document and death registration")],
        };
      if (m === "12to180" || m === "gte180")
        return {
          verdict: "LIKELY",
          title: T("१२ महिना योगदान पुगेको — सुविधाको योग्यता देखिन्छ", "12 months of contributions reached — you appear eligible"),
          reasons: [T("अन्य कारणको मृत्युमा १२ महिना नियमित योगदान चाहिन्छ (५औँ संशोधन)", "For deaths from other causes, 12 months of regular contributions are required (5th amendment)")],
          nextSteps: [T("अनुसूची ६/७ फाराम + कागजात पेश गर्नुहोस्", "Submit the Schedule 6/7 forms + documents")],
        };
      return {
        verdict: "CONDITIONS",
        title: T("उपलब्ध जानकारीका आधारमा eligibility पुष्टि गर्न सकिएन", "Eligibility couldn't be confirmed from the available information"),
        reasons: [
          T("गैर-रोजगारीजन्य मृत्युमा १२ महिना नियमित योगदान आवश्यक हुन्छ", "Non-work deaths require 12 months of regular contributions"),
          T("contribution history हेरेर मात्र यकिन हुन्छ", "It can only be confirmed by checking the contribution history"),
        ],
        nextSteps: [T("Digital Solution लाई history सहित सम्पर्क गर्नुहोस् — निःशुल्क जाँच गरिदिन्छौँ", "Contact Digital Solution with the history — we'll check it for free")],
      };
    }
    default: // registration
      return {
        verdict: "LIKELY",
        title: T("तपाईं SSF मा आबद्ध हुन सक्नुहुन्छ", "You can join SSF"),
        reasons: [
          T("औपचारिक क्षेत्र: रोजगारदातामार्फत अनिवार्य", "Formal sector: mandatory via the employer"),
          T("स्वरोजगार/अनौपचारिक/वैदेशिक: आफैँ सूचीकरण गर्न मिल्ने", "Self-employed/informal/foreign: you can register yourself"),
        ],
        nextSteps: [T("आफ्नो क्षेत्रको checklist हेरेर सुरु गर्नुहोस्", "Start with the checklist for your sector")],
        checklistSlug: "kyc-verification",
      };
  }
}

const VERDICT_STYLE: Record<Verdict, { badge: string; badgeEn: string; cls: string }> = {
  LIKELY: { badge: "✅ सम्भावित योग्य", badgeEn: "✅ Likely eligible", cls: "bg-green-50 text-green-800 border-green-300" },
  CONDITIONS: { badge: "⚠️ थप शर्त लागू हुनसक्छ", badgeEn: "⚠️ Additional conditions may apply", cls: "bg-action-50 text-action-700 border-action-500/40" },
  MORE_HISTORY: { badge: "⏳ थप योगदान अवधि आवश्यक", badgeEn: "⏳ More contribution history needed", cls: "bg-primary-50 text-primary-800 border-primary-300" },
  INFO: { badge: "ℹ️ जानकारी", badgeEn: "ℹ️ Information", cls: "bg-gray-50 text-gray-700 border-gray-300" },
};

export function EligibilityWizard() {
  const locale = useLocale();
  const isEn = locale === "en";
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
          {isEn ? style.badgeEn : style.badge}
        </span>
        <h2 className="mt-4 text-xl font-bold text-gray-900">{result.title}</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-700">
          {result.reasons.map((r) => <li key={r}>{r}</li>)}
        </ul>
        <p className="mt-4 text-sm font-semibold text-gray-800">
          {isEn ? "Next steps:" : "अर्को कदम:"}
        </p>
        <ul className="mt-1 list-inside list-decimal space-y-1 text-sm text-gray-700">
          {result.nextSteps.map((s) => <li key={s}>{s}</li>)}
        </ul>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {result.checklistSlug && (
            <Link href={`/checklists/${result.checklistSlug}`} className="rounded-xl border-2 border-primary-200 bg-white p-4 text-center text-sm font-semibold text-primary-800 hover:border-primary-400">
              📋 {isEn ? "Document checklist" : "कागजात checklist"}
            </Link>
          )}
          <Link href="/request" className="rounded-xl bg-action-500 p-4 text-center text-sm font-semibold text-white hover:bg-action-600">
            🤝 {isEn ? "Get help" : "सहायता लिनुहोस्"}
          </Link>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          ⚠️{" "}
          {isEn
            ? "This is a preliminary educational check — final eligibility follows SSF's rules and your actual records. (Source: Scheme Operation Procedure 2075, 5th amendment)"
            : "यो प्रारम्भिक शैक्षिक जाँच हो — अन्तिम योग्यता SSF को नियम र तपाईंको वास्तविक अभिलेखअनुसार हुन्छ। (स्रोत: योजना सञ्चालन कार्यविधि २०७५, ५औँ संशोधन)"}
        </p>
        <button type="button" onClick={() => { setOutcome(undefined); setAnswers({}); setResult(null); }} className="mt-3 text-sm text-gray-400 hover:text-primary-600">
          ↺ {isEn ? "Check again" : "फेरि जाँच्नुहोस्"}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
      <p className="font-semibold text-gray-900">
        {isEn ? "Which benefit/process do you want to check?" : "कुन सुविधा/प्रक्रिया जाँच्ने?"}
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {OUTCOMES.map((o) => (
          <button key={o.key} type="button" onClick={() => { setOutcome(o.key); setAnswers({}); }} className={btn(outcome === o.key)}>
            {isEn ? o.labelEn : o.label}
          </button>
        ))}
      </div>

      {needsAge && (
        <>
          <p className="mt-5 font-semibold text-gray-900">{isEn ? "Your age?" : "तपाईंको उमेर?"}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[["lt60", "६० मुनि", "Under 60"], ["gte60", "६० वा माथि", "60 or older"]].map(([v, l, le]) => (
              <button key={v} type="button" onClick={() => setAnswers((a) => ({ ...a, age: v }))} className={btn(answers.age === v)}>{isEn ? le : l}</button>
            ))}
          </div>
        </>
      )}

      {needsWorkRelated && (
        <>
          <p className="mt-5 font-semibold text-gray-900">
            {outcome === "accident"
              ? isEn
                ? "Was the accident work/employment related?"
                : "दुर्घटना काम/रोजगारीसँग सम्बन्धित हो?"
              : isEn
                ? "Was the death caused by a workplace accident?"
                : "मृत्यु रोजगारीजन्य दुर्घटनाबाट भएको हो?"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[["yes", "हो", "Yes"], ["no", "होइन", "No"]].map(([v, l, le]) => (
              <button key={v} type="button" onClick={() => setAnswers((a) => ({ ...a, workRelated: v }))} className={btn(answers.workRelated === v)}>{isEn ? le : l}</button>
            ))}
          </div>
        </>
      )}

      {needsMonths && (
        <>
          <p className="mt-5 font-semibold text-gray-900">
            {isEn ? "How long have you been contributing?" : "कति समय योगदान भएको छ?"}
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {MONTHS_OPTS.map((o) => (
              <button key={o.value} type="button" onClick={() => setAnswers((a) => ({ ...a, months: o.value }))} className={btn(answers.months === o.value)}>{isEn ? o.labelEn : o.label}</button>
            ))}
          </div>
        </>
      )}

      {needsRegular && (
        <>
          <p className="mt-5 font-semibold text-gray-900">
            {isEn
              ? "Have you contributed regularly for at least 3 of the last 6 months?"
              : "पछिल्ला ६ महिनामा कम्तीमा ३ महिना नियमित योगदान छ?"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[["yes", "छ", "Yes"], ["no", "छैन / थाहा छैन", "No / not sure"]].map(([v, l, le]) => (
              <button key={v} type="button" onClick={() => setAnswers((a) => ({ ...a, regular: v }))} className={btn(answers.regular === v)}>{isEn ? le : l}</button>
            ))}
          </div>
        </>
      )}

      <button
        type="button"
        disabled={!ready}
        onClick={() => outcome && setResult(evaluate(outcome, answers, isEn))}
        className="mt-6 w-full rounded-xl bg-primary-600 py-3 font-bold text-white hover:bg-primary-700 disabled:opacity-40"
      >
        {isEn ? "See result →" : "नतिजा हेर्नुहोस् →"}
      </button>
    </div>
  );
}
