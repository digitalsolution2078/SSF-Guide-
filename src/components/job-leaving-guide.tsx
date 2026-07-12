"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Job Leaving Scenario Guide — guided simulator per product spec §8.4.
 * Pure client-side decision logic over verified rules; the result is
 * always labelled preliminary guidance.
 */

interface Question {
  key: string;
  prompt: string;
  promptEn: string;
  options: Array<{ value: string; label: string; labelEn: string }>;
}

const QUESTIONS: Question[] = [
  {
    key: "leaving",
    prompt: "तपाईं एउटा रोजगारदाता छाड्दै हुनुहुन्छ कि स्थायी रूपमा अवकाश लिँदै?",
    promptEn: "Are you leaving one employer, or retiring permanently?",
    options: [
      { value: "switching", label: "जागिर फेर्दै छु", labelEn: "Changing jobs" },
      { value: "retiring", label: "स्थायी अवकाश लिँदै छु", labelEn: "Retiring permanently" },
      { value: "abroad", label: "विदेश जाँदै छु", labelEn: "Going abroad" },
      { value: "none", label: "अहिले केही योजना छैन", labelEn: "No plans right now" },
    ],
  },
  {
    key: "nextEmployer",
    prompt: "अर्को SSF-सूचीकृत रोजगारदातामा जानुहुन्छ?",
    promptEn: "Are you moving to another SSF-registered employer?",
    options: [
      { value: "yes", label: "हो, SSF भएकै ठाउँमा", labelEn: "Yes, to a place with SSF" },
      { value: "no", label: "छैन / थाहा छैन", labelEn: "No / not sure" },
      { value: "self", label: "आफ्नै व्यवसाय/स्वरोजगार गर्छु", labelEn: "Starting my own business / self-employment" },
    ],
  },
  {
    key: "duration",
    prompt: "SSF मा कति समय योगदान गर्नुभएको छ?",
    promptEn: "How long have you contributed to SSF?",
    options: [
      { value: "lt36", label: "३ वर्षभन्दा कम", labelEn: "Less than 3 years" },
      { value: "36to180", label: "३–१५ वर्ष", labelEn: "3–15 years" },
      { value: "gte180", label: "१५ वर्ष (१८० महिना) भन्दा बढी", labelEn: "More than 15 years (180 months)" },
    ],
  },
  {
    key: "age",
    prompt: "तपाईंको उमेर समूह?",
    promptEn: "Your age group?",
    options: [
      { value: "lt50", label: "५० वर्षमुनि", labelEn: "Under 50" },
      { value: "50to59", label: "५०–५९ वर्ष", labelEn: "50–59" },
      { value: "gte60", label: "६० वर्ष वा माथि", labelEn: "60 or older" },
    ],
  },
  {
    key: "concern",
    prompt: "तपाईंलाई मुख्यतः कुन रकम/सुविधाबारे जान्नु छ?",
    promptEn: "Which amount/benefit do you mainly want to know about?",
    options: [
      { value: "lump", label: "एकमुष्ट पाइने रकम", labelEn: "The lump-sum amount" },
      { value: "pension", label: "Pension", labelEn: "Pension" },
      { value: "medical", label: "उपचार सुविधा", labelEn: "Medical treatment benefit" },
      { value: "all", label: "सबै", labelEn: "All of them" },
    ],
  },
];

interface ResultSection {
  heading: string;
  points: string[];
}

function buildResult(answers: Record<string, string>, isEn: boolean): ResultSection[] {
  const T = (ne: string, en: string) => (isEn ? en : ne);
  const sections: ResultSection[] = [];

  sections.push({
    heading: T("तपाईंको रकमका दुई भाग", "Your money has two parts"),
    points: [
      T(
        "अवकाश सुविधा योजना (८.३३% + स्वेच्छिक थप + हस्तान्तरित रकम): रोजगारी अन्त्य वा अवकाशमा एकमुष्ट पाइन्छ।",
        "Retirement Benefit Scheme (8.33% + voluntary additions + transferred amounts): paid as a lump sum when employment ends or at retirement.",
      ),
      T(
        "निवृत्तभरण योजना (२०%): ६० वर्षसम्म कोषमै रहन्छ र प्रतिफलसहित बढ्छ — ‘सबै पैसा फिर्ता’ हुँदैन।",
        "Pension Scheme (20%): stays in the Fund until 60 and grows with returns — you don't get 'all the money back'.",
      ),
    ],
  });

  if (answers.nextEmployer === "yes") {
    sections.push({
      heading: T("जागिर फेर्दा", "When changing jobs"),
      points: [
        T(
          "SSN जीवनभर उही रहन्छ — नयाँ रोजगारदाताले त्यही नम्बरमा योगदान गर्छ, केही गुम्दैन।",
          "Your SSN stays the same for life — the new employer contributes to that number, nothing is lost.",
        ),
        T(
          "अवकाश सुविधाको रकम झिक्न पनि सकिन्छ, वा राखिराखे प्रतिफल जोडिँदै जान्छ।",
          "You can withdraw the Retirement Benefit amount, or leave it in and keep earning returns.",
        ),
      ],
    });
  } else if (answers.nextEmployer === "self") {
    sections.push({
      heading: T("स्वरोजगारमा जाँदा", "When moving to self-employment"),
      points: [
        T(
          "स्वरोजगार योजनामार्फत योगदान निरन्तर राख्न सकिन्छ — रोजेको आधार (न्यूनतम पारिश्रमिकको १–३ गुणा) को ३१%।",
          "You can keep contributing through the self-employed scheme — 31% of your chosen base (1–3× the minimum wage).",
        ),
        T(
          "निरन्तरता राखे १८० महिनाको pension योग्यता जोडिँदै जान्छ।",
          "Keeping it continuous keeps building your 180-month pension eligibility.",
        ),
      ],
    });
  } else if (answers.leaving === "abroad") {
    sections.push({
      heading: T("विदेश जाँदा", "When going abroad"),
      points: [
        T(
          "वैदेशिक रोजगार योजनामार्फत योगदान जारी राख्न सकिन्छ (औद्योगिक न्यूनतमको कम्तीमा २१.३३%)।",
          "You can continue contributing through the Foreign Employment Scheme (at least 21.33% of the industrial minimum).",
        ),
        T(
          "श्रम स्वीकृति लिँदा सूचीकरण हुन्छ; विदेशबाटै online योगदान गर्न मिल्छ।",
          "Registration happens with your labour permit; you can contribute online from abroad.",
        ),
      ],
    });
  }

  if (answers.age === "gte60") {
    if (answers.duration === "gte180") {
      sections.push({
        heading: "Pension",
        points: [
          T(
            "६० वर्ष + १८० महिना योगदान पुगेकाले आजीवन मासिक pension को योग्यता देखिन्छ।",
            "With age 60 + 180 months of contributions, you appear eligible for a lifelong monthly pension.",
          ),
          T(
            "सूत्र: (निवृत्तभरण खातामा जम्मा + प्रतिफल) ÷ १६० = मासिक रकम, मुद्रास्फीति समायोजनसहित।",
            "Formula: (pension account deposits + returns) ÷ 160 = monthly amount, with inflation adjustment.",
          ),
        ],
      });
    } else {
      sections.push({
        heading: T("Pension विकल्प", "Pension options"),
        points: [
          T(
            "६० वर्ष पुगे तर १८० महिना नपुगेकाले दुई विकल्प: सम्पूर्ण रकम एकमुष्ट लिने, वा सोही रकम ÷ १६० को आजीवन मासिक pension।",
            "You're 60 but under 180 months, so two options: take the entire amount as a lump sum, or a lifelong monthly pension of that amount ÷ 160.",
          ),
        ],
      });
    }
  } else if (answers.duration === "gte180") {
    sections.push({
      heading: "Pension",
      points: [
        T(
          "१८० महिना पुगिसकेकाले ६० वर्ष पुगेपछि आजीवन मासिक pension सुरु हुन्छ — बीचमा योगदान रोकिए पनि जम्मा रकम सुरक्षित रहन्छ।",
          "Having reached 180 months, your lifelong monthly pension starts at 60 — even if contributions pause, the accumulated amount stays safe.",
        ),
      ],
    });
  } else {
    sections.push({
      heading: T("Pension योग्यता", "Pension eligibility"),
      points: [
        T(
          "१८० महिना (१५ वर्ष) पुगेपछि मात्र ६० वर्षमा आजीवन pension पाइन्छ — निरन्तर योगदानले योग्यता जोगाउँछ।",
          "A lifelong pension at 60 only comes after 180 months (15 years) — continuous contributions protect your eligibility.",
        ),
      ],
    });
  }

  if (answers.concern === "medical" || answers.concern === "all") {
    sections.push({
      heading: T("उपचार सुविधा", "Medical treatment benefit"),
      points: [
        T(
          "योगदान रोकिएपछि औषधि उपचार सुविधा ३ महिनासम्म मात्र कायम रहन्छ; दुर्घटना सुविधा तुरुन्तै रोकिन्छ।",
          "After contributions stop, the medical treatment benefit lasts only 3 months; the accident benefit stops immediately.",
        ),
      ],
    });
  }

  if (answers.duration !== "lt36") {
    sections.push({
      heading: T("थप सुविधा", "Additional facilities"),
      points: [
        T(
          "३६ महिना योगदान पुगेकाले सापटी सुविधा (घर रु. ७५ लाखसम्म, शैक्षिक रु. ३५ लाखसम्म, विशेष सापटी) को योग्यता देखिन्छ।",
          "With 36 months of contributions you appear eligible for loans (home up to Rs. 7.5 million, education up to Rs. 3.5 million, special loan).",
        ),
      ],
    });
  }

  sections.push({
    heading: T("आवश्यक कागजात (एकमुष्ट दाबीका लागि)", "Required documents (for the lump-sum claim)"),
    points: [
      T(
        "रोजगारी अन्त्यको प्रमाण, नागरिकता, बैंक खाता विवरण र दाबी फाराम (अनुसूची ८–१०)।",
        "Proof of employment ending, citizenship, bank account details, and the claim form (Schedule 8–10).",
      ),
      T(
        "रोजगारदाताले रोजगारी सकिएको जानकारी १ महिनाभित्र कोषलाई दिएको हुनुपर्छ।",
        "The employer must have notified the Fund within 1 month that your employment ended.",
      ),
    ],
  });

  return sections;
}

export function JobLeavingGuide() {
  const locale = useLocale();
  const isEn = locale === "en";
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const done = step >= QUESTIONS.length;

  return (
    <div className="rounded-xl border border-primary-100 bg-white p-6 shadow-sm">
      {!done ? (
        <div>
          <p className="text-xs text-gray-400">
            {isEn ? "Question" : "प्रश्न"} {step + 1} / {QUESTIONS.length}
          </p>
          <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
            <div
              className="h-1.5 rounded-full bg-primary-500 transition-all"
              style={{ width: `${(step / QUESTIONS.length) * 100}%` }}
            />
          </div>
          <p className="mt-4 font-semibold text-gray-900">
            {isEn ? QUESTIONS[step].promptEn : QUESTIONS[step].prompt}
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {QUESTIONS[step].options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  setAnswers((a) => ({ ...a, [QUESTIONS[step].key]: o.value }));
                  setStep((s) => s + 1);
                }}
                className="rounded-lg border border-primary-200 px-4 py-2.5 text-left text-sm text-gray-800 transition hover:border-primary-500 hover:bg-primary-50"
              >
                {isEn ? o.labelEn : o.label}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="mt-4 text-sm text-gray-400 hover:text-primary-600"
            >
              ← {isEn ? "Back" : "पछाडि"}
            </button>
          )}
        </div>
      ) : (
        <div>
          <p className="rounded-lg bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-800">
            {isEn
              ? "Preliminary information for your situation"
              : "तपाईंको अवस्थाअनुसारको प्रारम्भिक जानकारी"}
          </p>
          <div className="mt-4 space-y-5">
            {buildResult(answers, isEn).map((s) => (
              <div key={s.heading}>
                <p className="font-semibold text-gray-900">{s.heading}</p>
                <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-700">
                  {s.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-6 rounded-lg border-l-4 border-action-500 bg-action-50 px-4 py-3 text-sm text-gray-800">
            ⚠️{" "}
            {isEn
              ? "This is preliminary guidance only, not an official decision. Final amounts and eligibility follow SSF's rules and the actual details of your account."
              : "यो प्रारम्भिक guidance मात्र हो, आधिकारिक निर्णय होइन। अन्तिम रकम र योग्यता SSF को नियम र तपाईंको खाताको वास्तविक विवरणअनुसार हुन्छ।"}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/school/pension-ra-retirement/jagir-chadepachi-ke-huncha"
              className="rounded-xl border-2 border-primary-200 bg-white p-4 text-sm font-semibold text-primary-800 hover:border-primary-400"
            >
              📖 {isEn ? "Read the detailed guide →" : "विस्तृत guide पढ्नुहोस् →"}
            </Link>
            <Link
              href="/request"
              className="rounded-xl bg-action-500 p-4 text-sm font-semibold text-white hover:bg-action-600"
            >
              🤝 {isEn ? "Talk to a human →" : "मान्छेसँग कुरा गर्नुहोस् →"}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setStep(0);
            }}
            className="mt-4 text-sm text-gray-400 hover:text-primary-600"
          >
            ↺ {isEn ? "Start over" : "फेरि सुरु गर्नुहोस्"}
          </button>
        </div>
      )}
    </div>
  );
}
