import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "SSF Calculators",
  description:
    "SSF योगदान, ३१% बाँडफाँट, वैदेशिक रोजगार योगदान र जागिर छाड्दाको अवस्था — सबै हिसाब एकै ठाउँमा।",
};

const calculators = [
  {
    href: "/calculators/contribution",
    title: "Employee–Employer Contribution Calculator",
    desc: "श्रमिक ११% + रोजगारदाता २०% = ३१% — मासिक र वार्षिक योगदान हिसाब गर्नुहोस्।",
    ready: true,
  },
  {
    href: "/calculators/allocation",
    title: "31% Contribution Breakdown",
    desc: "जम्मा भएको रकम चार योजनामा कसरी बाँडिन्छ हेर्नुहोस् (१.२० / ०.८० / ०.६७ / २८.३३)।",
    ready: true,
  },
  {
    href: "/calculators/foreign-employment",
    title: "Foreign Employment Contribution Calculator",
    desc: "वैदेशिक रोजगारीमा हुनेका लागि न्यूनतम २१.३३% योगदानको हिसाब।",
    ready: true,
  },
  {
    href: "/calculators/job-leaving",
    title: "Job Leaving Scenario Guide",
    desc: "जागिर छाडेपछि निवृत्तभरण (२०%) र अवकाश सुविधा (८.३३%) रकमको के हुन्छ — निर्देशित जानकारी।",
    ready: true,
  },
];

export default function CalculatorsHub() {
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
                  चाँडै आउँदै
                </span>
              )}
            </p>
            <p className="mt-2 text-sm text-gray-600">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
