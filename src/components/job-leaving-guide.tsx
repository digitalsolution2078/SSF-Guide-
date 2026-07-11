"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";

/**
 * Job Leaving Scenario Guide — guided simulator per product spec §8.4.
 * Pure client-side decision logic over verified rules; the result is
 * always labelled preliminary guidance.
 */

interface Question {
  key: string;
  prompt: string;
  options: Array<{ value: string; label: string }>;
}

const QUESTIONS: Question[] = [
  {
    key: "leaving",
    prompt: "तपाईं एउटा रोजगारदाता छाड्दै हुनुहुन्छ कि स्थायी रूपमा अवकाश लिँदै?",
    options: [
      { value: "switching", label: "जागिर फेर्दै छु" },
      { value: "retiring", label: "स्थायी अवकाश लिँदै छु" },
      { value: "abroad", label: "विदेश जाँदै छु" },
      { value: "none", label: "अहिले केही योजना छैन" },
    ],
  },
  {
    key: "nextEmployer",
    prompt: "अर्को SSF-सूचीकृत रोजगारदातामा जानुहुन्छ?",
    options: [
      { value: "yes", label: "हो, SSF भएकै ठाउँमा" },
      { value: "no", label: "छैन / थाहा छैन" },
      { value: "self", label: "आफ्नै व्यवसाय/स्वरोजगार गर्छु" },
    ],
  },
  {
    key: "duration",
    prompt: "SSF मा कति समय योगदान गर्नुभएको छ?",
    options: [
      { value: "lt36", label: "३ वर्षभन्दा कम" },
      { value: "36to180", label: "३–१५ वर्ष" },
      { value: "gte180", label: "१५ वर्ष (१८० महिना) भन्दा बढी" },
    ],
  },
  {
    key: "age",
    prompt: "तपाईंको उमेर समूह?",
    options: [
      { value: "lt50", label: "५० वर्षमुनि" },
      { value: "50to59", label: "५०–५९ वर्ष" },
      { value: "gte60", label: "६० वर्ष वा माथि" },
    ],
  },
  {
    key: "concern",
    prompt: "तपाईंलाई मुख्यतः कुन रकम/सुविधाबारे जान्नु छ?",
    options: [
      { value: "lump", label: "एकमुष्ट पाइने रकम" },
      { value: "pension", label: "Pension" },
      { value: "medical", label: "उपचार सुविधा" },
      { value: "all", label: "सबै" },
    ],
  },
];

interface ResultSection {
  heading: string;
  points: string[];
}

function buildResult(answers: Record<string, string>): ResultSection[] {
  const sections: ResultSection[] = [];

  sections.push({
    heading: "तपाईंको रकमका दुई भाग",
    points: [
      "अवकाश सुविधा योजना (८.३३% + स्वेच्छिक थप + हस्तान्तरित रकम): रोजगारी अन्त्य वा अवकाशमा एकमुष्ट पाइन्छ।",
      "निवृत्तभरण योजना (२०%): ६० वर्षसम्म कोषमै रहन्छ र प्रतिफलसहित बढ्छ — ‘सबै पैसा फिर्ता’ हुँदैन।",
    ],
  });

  if (answers.nextEmployer === "yes") {
    sections.push({
      heading: "जागिर फेर्दा",
      points: [
        "SSN जीवनभर उही रहन्छ — नयाँ रोजगारदाताले त्यही नम्बरमा योगदान गर्छ, केही गुम्दैन।",
        "अवकाश सुविधाको रकम झिक्न पनि सकिन्छ, वा राखिराखे प्रतिफल जोडिँदै जान्छ।",
      ],
    });
  } else if (answers.nextEmployer === "self") {
    sections.push({
      heading: "स्वरोजगारमा जाँदा",
      points: [
        "स्वरोजगार योजनामार्फत योगदान निरन्तर राख्न सकिन्छ — रोजेको आधार (न्यूनतम पारिश्रमिकको १–३ गुणा) को ३१%।",
        "निरन्तरता राखे १८० महिनाको pension योग्यता जोडिँदै जान्छ।",
      ],
    });
  } else if (answers.leaving === "abroad") {
    sections.push({
      heading: "विदेश जाँदा",
      points: [
        "वैदेशिक रोजगार योजनामार्फत योगदान जारी राख्न सकिन्छ (औद्योगिक न्यूनतमको कम्तीमा २१.३३%)।",
        "श्रम स्वीकृति लिँदा सूचीकरण हुन्छ; विदेशबाटै online योगदान गर्न मिल्छ।",
      ],
    });
  }

  if (answers.age === "gte60") {
    if (answers.duration === "gte180") {
      sections.push({
        heading: "Pension",
        points: [
          "६० वर्ष + १८० महिना योगदान पुगेकाले आजीवन मासिक pension को योग्यता देखिन्छ।",
          "सूत्र: (निवृत्तभरण खातामा जम्मा + प्रतिफल) ÷ १६० = मासिक रकम, मुद्रास्फीति समायोजनसहित।",
        ],
      });
    } else {
      sections.push({
        heading: "Pension विकल्प",
        points: [
          "६० वर्ष पुगे तर १८० महिना नपुगेकाले दुई विकल्प: सम्पूर्ण रकम एकमुष्ट लिने, वा सोही रकम ÷ १६० को आजीवन मासिक pension।",
        ],
      });
    }
  } else if (answers.duration === "gte180") {
    sections.push({
      heading: "Pension",
      points: [
        "१८० महिना पुगिसकेकाले ६० वर्ष पुगेपछि आजीवन मासिक pension सुरु हुन्छ — बीचमा योगदान रोकिए पनि जम्मा रकम सुरक्षित रहन्छ।",
      ],
    });
  } else {
    sections.push({
      heading: "Pension योग्यता",
      points: [
        "१८० महिना (१५ वर्ष) पुगेपछि मात्र ६० वर्षमा आजीवन pension पाइन्छ — निरन्तर योगदानले योग्यता जोगाउँछ।",
      ],
    });
  }

  if (answers.concern === "medical" || answers.concern === "all") {
    sections.push({
      heading: "उपचार सुविधा",
      points: [
        "योगदान रोकिएपछि औषधि उपचार सुविधा ३ महिनासम्म मात्र कायम रहन्छ; दुर्घटना सुविधा तुरुन्तै रोकिन्छ।",
      ],
    });
  }

  if (answers.duration !== "lt36") {
    sections.push({
      heading: "थप सुविधा",
      points: [
        "३६ महिना योगदान पुगेकाले सापटी सुविधा (घर रु. ७५ लाखसम्म, शैक्षिक रु. ३५ लाखसम्म, विशेष सापटी) को योग्यता देखिन्छ।",
      ],
    });
  }

  sections.push({
    heading: "आवश्यक कागजात (एकमुष्ट दाबीका लागि)",
    points: [
      "रोजगारी अन्त्यको प्रमाण, नागरिकता, बैंक खाता विवरण र दाबी फाराम (अनुसूची ८–१०)।",
      "रोजगारदाताले रोजगारी सकिएको जानकारी १ महिनाभित्र कोषलाई दिएको हुनुपर्छ।",
    ],
  });

  return sections;
}

export function JobLeavingGuide() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const done = step >= QUESTIONS.length;

  return (
    <div className="rounded-xl border border-primary-100 bg-white p-6 shadow-sm">
      {!done ? (
        <div>
          <p className="text-xs text-gray-400">
            प्रश्न {step + 1} / {QUESTIONS.length}
          </p>
          <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
            <div
              className="h-1.5 rounded-full bg-primary-500 transition-all"
              style={{ width: `${(step / QUESTIONS.length) * 100}%` }}
            />
          </div>
          <p className="mt-4 font-semibold text-gray-900">
            {QUESTIONS[step].prompt}
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
                {o.label}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="mt-4 text-sm text-gray-400 hover:text-primary-600"
            >
              ← पछाडि
            </button>
          )}
        </div>
      ) : (
        <div>
          <p className="rounded-lg bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-800">
            तपाईंको अवस्थाअनुसारको प्रारम्भिक जानकारी
          </p>
          <div className="mt-4 space-y-5">
            {buildResult(answers).map((s) => (
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
            ⚠️ यो प्रारम्भिक guidance मात्र हो, आधिकारिक निर्णय होइन। अन्तिम रकम र
            योग्यता SSF को नियम र तपाईंको खाताको वास्तविक विवरणअनुसार हुन्छ।
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/school/pension-ra-retirement/jagir-chadepachi-ke-huncha"
              className="rounded-xl border-2 border-primary-200 bg-white p-4 text-sm font-semibold text-primary-800 hover:border-primary-400"
            >
              📖 विस्तृत guide पढ्नुहोस् →
            </Link>
            <Link
              href="/request"
              className="rounded-xl bg-action-500 p-4 text-sm font-semibold text-white hover:bg-action-600"
            >
              🤝 मान्छेसँग कुरा गर्नुहोस् →
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
            ↺ फेरि सुरु गर्नुहोस्
          </button>
        </div>
      )}
    </div>
  );
}
