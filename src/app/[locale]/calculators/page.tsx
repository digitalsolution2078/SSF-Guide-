import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Financial Tools — SSF Calculators र Planners",
  description:
    "SSF योगदान, ३१% बाँडफाँट, वैदेशिक रोजगार, जागिर छाड्दाको अवस्था, pension projection र SIP — सबै वित्तीय उपकरण एकै ठाउँमा।",
};

interface Tool {
  href: string;
  title: string;
  icon: string;
  desc: string;
  descEn: string;
  featured?: boolean;
}

const GROUPS: { key: string; titleNe: string; titleEn: string; tools: Tool[] }[] = [
  {
    key: "planning",
    titleNe: "योजना उपकरण (Planning)",
    titleEn: "Planning tools",
    tools: [
      {
        href: "/calculators/financial-planner",
        title: "SSF Financial Planner",
        icon: "💰",
        desc: "३० वर्ष योगदान गरे ६० वर्षमा कति मासिक pension? प्रतिफल दर (६–७%) आफैँ मिलाएर projection हेर्नुहोस्।",
        descEn:
          "Contribute for 30 years — how much monthly pension at 60? Adjust the return rate (6–7%) and see the projection.",
        featured: true,
      },
      {
        href: "/calculators/sip",
        title: "SIP Calculator",
        icon: "📈",
        desc: "हरेक महिना निश्चित रकम लगानी गर्दा वर्षौंमा कति बन्छ — compounding को असर सरल तरिकाले हेर्नुहोस्।",
        descEn:
          "How much a fixed monthly investment grows over the years — see the effect of compounding simply.",
        featured: true,
      },
    ],
  },
  {
    key: "contribution",
    titleNe: "योगदान उपकरण (Contribution)",
    titleEn: "Contribution tools",
    tools: [
      {
        href: "/calculators/contribution",
        title: "Employee–Employer Contribution",
        icon: "🧮",
        desc: "श्रमिक ११% + रोजगारदाता २०% = ३१% — मासिक र वार्षिक योगदान हिसाब गर्नुहोस् (सबै क्षेत्र)।",
        descEn:
          "Worker 11% + employer 20% = 31% — calculate the monthly and annual contribution (all sectors).",
      },
      {
        href: "/calculators/allocation",
        title: "31% Contribution Breakdown",
        icon: "🥧",
        desc: "जम्मा भएको रकम चार योजनामा कसरी बाँडिन्छ हेर्नुहोस् (१.२० / ०.८० / ०.६७ / २८.३३)।",
        descEn:
          "See how the deposited amount splits across the four schemes (1.20 / 0.80 / 0.67 / 28.33).",
      },
      {
        href: "/calculators/foreign-employment",
        title: "Foreign Employment Contribution",
        icon: "✈️",
        desc: "वैदेशिक रोजगारीमा हुनेका लागि न्यूनतम २१.३३% योगदानको हिसाब।",
        descEn:
          "The minimum 21.33% contribution calculation for those in foreign employment.",
      },
    ],
  },
  {
    key: "scenario",
    titleNe: "अवस्था उपकरण (Scenario)",
    titleEn: "Scenario tools",
    tools: [
      {
        href: "/calculators/job-leaving",
        title: "Job Leaving Scenario Guide",
        icon: "🚪",
        desc: "जागिर छाडेपछि निवृत्तभरण (२०%) र अवकाश सुविधा (८.३३%) रकमको के हुन्छ — निर्देशित जानकारी।",
        descEn:
          "What happens to your pension (20%) and retirement benefit (8.33%) after leaving a job — guided.",
      },
    ],
  },
];

export default async function FinancialToolsHub({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        🧰 {isEn ? "Financial Tools" : "Financial Tools (वित्तीय उपकरण)"}
      </h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        {isEn
          ? "Free calculators and planners for SSF and your finances — contributions, allocation, pension projection, and SIP growth. All preliminary educational estimates."
          : "SSF र तपाईंको वित्तका लागि निःशुल्क calculators र planners — योगदान, बाँडफाँट, pension projection र SIP वृद्धि। सबै प्रारम्भिक शैक्षिक अनुमान हुन्।"}
      </p>

      {GROUPS.map((g) => (
        <section key={g.key} className="mt-8">
          <h2 className="text-lg font-bold text-primary-900">
            {isEn ? g.titleEn : g.titleNe}
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {g.tools.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={`rounded-xl border-2 bg-white p-5 shadow-sm transition hover:border-action-500 ${
                  t.featured ? "border-primary-200" : "border-primary-100"
                }`}
              >
                <p className="text-sm font-semibold text-primary-800">
                  {t.icon} {t.title}
                  {t.featured && (
                    <span className="ml-2 rounded bg-action-50 px-1.5 py-0.5 text-xs font-normal text-action-700">
                      ⭐ {isEn ? "Popular" : "लोकप्रिय"}
                    </span>
                  )}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  {isEn ? t.descEn : t.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
