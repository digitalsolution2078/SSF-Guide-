import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "SSF Calculators",
  description:
    "SSF योगदान, ३१% बाँडफाँट, वैदेशिक रोजगार योगदान र जागिर छाड्दाको अवस्था — सबै हिसाब एकै ठाउँमा।",
};

const calculators = [
  {
    href: "/calculators/financial-planner",
    title: "SSF Financial Planner ⭐",
    desc: "३० वर्ष योगदान गरे ६० वर्षमा कति मासिक pension? प्रतिफल दर (६–७%) आफैँ मिलाएर projection हेर्नुहोस्।",
    descEn:
      "Contribute for 30 years — how much monthly pension at 60? Adjust the return rate (6–7%) yourself and see the projection.",
    ready: true,
  },
  {
    href: "/calculators/contribution",
    title: "Employee–Employer Contribution Calculator",
    desc: "श्रमिक ११% + रोजगारदाता २०% = ३१% — मासिक र वार्षिक योगदान हिसाब गर्नुहोस्।",
    descEn:
      "Worker 11% + employer 20% = 31% — calculate the monthly and annual contribution.",
    ready: true,
  },
  {
    href: "/calculators/allocation",
    title: "31% Contribution Breakdown",
    desc: "जम्मा भएको रकम चार योजनामा कसरी बाँडिन्छ हेर्नुहोस् (१.२० / ०.८० / ०.६७ / २८.३३)।",
    descEn:
      "See how the deposited amount is split across the four schemes (1.20 / 0.80 / 0.67 / 28.33).",
    ready: true,
  },
  {
    href: "/calculators/foreign-employment",
    title: "Foreign Employment Contribution Calculator",
    desc: "वैदेशिक रोजगारीमा हुनेका लागि न्यूनतम २१.३३% योगदानको हिसाब।",
    descEn:
      "The minimum 21.33% contribution calculation for those in foreign employment.",
    ready: true,
  },
  {
    href: "/calculators/job-leaving",
    title: "Job Leaving Scenario Guide",
    desc: "जागिर छाडेपछि निवृत्तभरण (२०%) र अवकाश सुविधा (८.३३%) रकमको के हुन्छ — निर्देशित जानकारी।",
    descEn:
      "What happens to your pension (20%) and retirement benefit (8.33%) money after leaving a job — guided information.",
    ready: true,
  },
];

export default async function CalculatorsHub({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        SSF Calculators
      </h1>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {calculators.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-xl border border-primary-100 bg-white p-5 shadow-sm transition hover:border-primary-400"
          >
            <p className="font-semibold text-primary-800">
              🧮 {c.title}
              {!c.ready && (
                <span className="ml-2 rounded bg-primary-50 px-2 py-0.5 text-xs font-normal text-primary-600">
                  {isEn ? "Coming soon" : "चाँडै आउँदै"}
                </span>
              )}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              {isEn ? c.descEn : c.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
