import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { pageSeo } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return pageSeo({
    locale,
    path: "/calculators",
    title: isEn
      ? "Financial Tools — SSF Calculators & Planners"
      : "Financial Tools — SSF Calculators र Planners",
    description: isEn
      ? "SSF contribution, 31% allocation, foreign employment, job-leaving, pension projection, income tax, take-home and SIP — every financial tool in one place."
      : "SSF योगदान, ३१% बाँडफाँट, वैदेशिक रोजगार, जागिर छाड्दाको अवस्था, pension projection र SIP — सबै वित्तीय उपकरण एकै ठाउँमा।",
  });
}

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
        href: "/calculators/retirement-goal",
        title: "Retirement Goal Calculator",
        icon: "🎯",
        desc: "६० वर्षमा कति कोष चाहिन्छ र अहिलेदेखि मासिक कति बचाउने — SSF ले कति ढाक्छ हेर्नुहोस्।",
        descEn:
          "How much corpus you need at 60 and how much to save monthly — see how much SSF already covers.",
      },
      {
        href: "/calculators/pension-topup",
        title: "Pension Top-Up Simulator",
        icon: "🎯",
        desc: "SSF पेन्सन नपुगे खाडल पुर्‍याउन मासिक कति SIP चाहिन्छ।",
        descEn: "If your SSF pension falls short, the monthly SIP needed to cover the gap.",
      },
    ],
  },
  {
    key: "invest",
    titleNe: "लगानी उपकरण (Investing)",
    titleEn: "Investing tools",
    tools: [
      {
        href: "/calculators/sip",
        title: "SIP Calculator",
        icon: "📈",
        desc: "हरेक महिना निश्चित रकम लगानी गर्दा वर्षौंमा कति बन्छ — compounding को असर सरल तरिकाले हेर्नुहोस्।",
        descEn:
          "How much a fixed monthly investment grows over the years — see the effect of compounding simply.",
        featured: true,
      },
      {
        href: "/calculators/goal-sip",
        title: "Goal SIP Calculator",
        icon: "🎯",
        desc: "घर, शिक्षा वा कुनै लक्ष्य रकम पुर्‍याउन हरेक महिना कति लगानी गर्नुपर्छ (reverse SIP)।",
        descEn:
          "How much to invest each month to reach a goal amount like a house or education (reverse SIP).",
      },
      {
        href: "/calculators/fd",
        title: "FD / Lumpsum Calculator",
        icon: "🏛️",
        desc: "एकमुष्ट रकम वा Fixed Deposit को परिपक्व मूल्य र ब्याज — compounding आवृत्ति रोजेर।",
        descEn:
          "Maturity value and interest for a lump sum or fixed deposit — choose the compounding frequency.",
      },
      {
        href: "/calculators/fd-income",
        title: "FD Monthly Income Calculator",
        icon: "🏦",
        desc: "FD को ब्याजबाट मासिक/त्रैमासिक कति आम्दानी (ब्याज कर कटाएर) — अवकाशप्राप्तका लागि।",
        descEn: "Monthly/quarterly income from FD interest (after tax) — for retirees.",
      },
    ],
  },
  {
    key: "loan",
    titleNe: "सापटी उपकरण (Loan)",
    titleEn: "Loan tools",
    tools: [
      {
        href: "/calculators/loan",
        title: "Loan / EMI Calculator",
        icon: "🏦",
        desc: "घर, शैक्षिक वा SSF विशेष सापटीको मासिक किस्ता (EMI), कुल ब्याज र भुक्तानी हिसाब गर्नुहोस्।",
        descEn:
          "Monthly EMI, total interest, and payment for a home, education, or SSF special loan.",
      },
    ],
  },
  {
    key: "tax",
    titleNe: "कर उपकरण (Tax)",
    titleEn: "Tax tools",
    tools: [
      {
        href: "/calculators/take-home",
        title: "Take-home Salary Calculator",
        icon: "💵",
        desc: "SSF (११%) र आयकर कटाएपछि हातमा कति आउँछ — रोजगारदाताले थप्ने २०% सहित।",
        descEn:
          "Cash-in-hand after SSF (11%) and income tax — including the 20% your employer adds.",
        featured: true,
      },
      {
        href: "/calculators/income-tax",
        title: "Salary Income Tax Calculator",
        icon: "🧾",
        desc: "नेपालको तलब आयकर — आ.व. २०८३/८४ र २०८२/८३ स्ल्याब, SSF १% छुट, बीमा कटौती र breakdown सहित।",
        descEn:
          "Nepal salary income tax — FY 2083/84 & 2082/83 slabs, SSF 1% waiver, insurance deductions, and breakdown.",
      },
      {
        href: "/calculators/net-to-gross",
        title: "Net ↔ Gross Converter",
        icon: "🔁",
        desc: "हातमा चाहिएको तलबबाट करारमा लेख्ने कुल तलब (वा उल्टो) — SSF र करसहित।",
        descEn: "Desired take-home → contract gross salary (or the reverse) — with SSF and tax.",
      },
      {
        href: "/calculators/dashain-bonus",
        title: "Dashain Bonus Calculator",
        icon: "🎁",
        desc: "चाडपर्व बोनस (१३औँ महिना) मा कति कर लाग्छ र हातमा कति आउँछ।",
        descEn: "How much tax the festival (13th-month) bonus attracts and what lands in hand.",
      },
      {
        href: "/calculators/rebate-optimizer",
        title: "Tax Rebate Optimizer",
        icon: "🧮",
        desc: "असारअघि SSF/बीमा/अवकाशमा अझै कति लगानी गरे कर छुट अधिकतम हुन्छ।",
        descEn: "How much more to invest in SSF/insurance/retirement to maximize deductions before year-end.",
      },
    ],
  },
  {
    key: "salary",
    titleNe: "तलब उपकरण (Salary & Work)",
    titleEn: "Salary & work tools",
    tools: [
      {
        href: "/calculators/wage-overtime",
        title: "Daily Wage & Overtime",
        icon: "⏱️",
        desc: "दैनिक दर, घण्टा दर र १.५× ओभरटाइम रकम — श्रम ऐन २०७४ अनुसार।",
        descEn: "Daily rate, hourly rate, and 1.5× overtime pay under the Labour Act 2074.",
      },
    ],
  },
  {
    key: "protect",
    titleNe: "सुरक्षा उपकरण (Protection)",
    titleEn: "Protection tools",
    tools: [
      {
        href: "/calculators/emergency-fund",
        title: "Emergency Fund Calculator",
        icon: "🛟",
        desc: "जागिर गुम्ने, medical copayment र झट्का धान्न कति आकस्मिक कोष चाहिन्छ र अझै कति बचाउने।",
        descEn:
          "How big an emergency fund you need for job loss, copayments, and shocks — and how much more to save.",
      },
      {
        href: "/calculators/inflation",
        title: "Inflation Calculator",
        icon: "📉",
        desc: "मुद्रास्फीतिले आजको रकम भविष्यमा कति पर्छ र मूल्य कति घट्छ — किन बचत जरुरी छ।",
        descEn:
          "How inflation raises future costs and erodes idle cash — and why saving matters.",
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
