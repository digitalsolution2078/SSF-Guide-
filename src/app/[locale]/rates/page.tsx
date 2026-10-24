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
    path: "/rates",
    title: isEn
      ? "SSF Rates & Figures — contribution %, min wage, interest, tax slabs"
      : "SSF दर र तथ्यांक — योगदान %, न्यूनतम ज्याला, ब्याज, कर स्ल्याब",
    description: isEn
      ? "All current Social Security Fund (SSF) numbers in one place: contribution rates by sector, the 31% split, minimum wage Rs 19,550, SSF interest rate 3.20%, income-tax slabs and deadlines — with sources."
      : "सामाजिक सुरक्षा कोष (SSF) का सबै पछिल्ला आँकडा एकै ठाउँमा: क्षेत्रअनुसार योगदान दर, ३१% बाँडफाँट, न्यूनतम ज्याला रु. १९,५५०, SSF ब्याजदर ३.२०%, आयकर स्ल्याब र म्याद — स्रोतसहित।",
  });
}

const LAST_UPDATED = "2026-10-24";

function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <div className="border-b border-ink-200 pb-3">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-2 text-xl font-medium text-ink-900 md:text-2xl">{title}</h2>
      {lead && <p className="mt-1.5 text-sm text-ink-500">{lead}</p>}
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-ink-300 text-left">
            {headers.map((h, i) => (
              <th
                key={h}
                className={`py-2.5 pr-4 font-semibold text-ink-700 ${i === headers.length - 1 ? "text-right pr-0" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-b border-ink-100">
              {r.map((c, ci) => (
                <td
                  key={ci}
                  className={`py-2.5 pr-4 ${ci === 0 ? "font-medium text-ink-900" : "text-ink-600"} ${
                    ci === r.length - 1 ? "pr-0 text-right" : ""
                  }`}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function RatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-ink-200 bg-ink-50">
        <div className="mx-auto max-w-4xl px-4 pb-12 pt-14">
          <span className="eyebrow">
            {isEn ? "Reference" : "सन्दर्भ"}
            <span className="h-1 w-1 rounded-full bg-ink-300" />
            {isEn ? "FY 2082/83" : "आ.व. २०८२/८३"}
          </span>
          <h1 className="mt-4 text-3xl font-medium leading-tight text-ink-900 md:text-5xl">
            {isEn ? "SSF Rates & Figures" : "SSF दर र तथ्यांक"}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ink-500 md:text-lg">
            {isEn
              ? "Every current Social Security Fund number in one place — contribution rates, the 31% split, minimum wage, interest rate, income-tax slabs and deadlines."
              : "सामाजिक सुरक्षा कोषका सबै पछिल्ला आँकडा एकै ठाउँमा — योगदान दर, ३१% बाँडफाँट, न्यूनतम ज्याला, ब्याजदर, आयकर स्ल्याब र म्याद।"}
          </p>
          <p className="mt-5 text-sm text-ink-400">
            {isEn ? "Last updated" : "अद्यावधिक"}: {LAST_UPDATED} ·{" "}
            {isEn ? "verify against" : "आधिकारिक स्रोत"}{" "}
            <a href="https://ssf.gov.np" target="_blank" rel="noopener noreferrer" className="text-primary-700 hover:underline">
              ssf.gov.np ↗
            </a>
          </p>
        </div>
      </section>

      {/* Contribution rates */}
      <section className="mx-auto max-w-4xl px-4 py-14">
        <SectionHead
          eyebrow={isEn ? "Contribution" : "योगदान"}
          title={isEn ? "Contribution rates by sector" : "क्षेत्रअनुसार योगदान दर"}
          lead={
            isEn
              ? "Contribution is charged on the basic remuneration, not the gross salary."
              : "योगदान आधारभूत पारिश्रमिकमा लाग्छ, कुल ज्यालामा होइन।"
          }
        />
        <Table
          headers={
            isEn
              ? ["Sector", "Rate", "Minimum base"]
              : ["क्षेत्र", "दर", "न्यूनतम आधार"]
          }
          rows={[
            [
              isEn ? "Formal (job)" : "औपचारिक (जागिर)",
              isEn ? "Worker 11% + employer 20% = 31%" : "श्रमिक ११% + रोजगारदाता २०% = ३१%",
              "रु. १२,१७०",
            ],
            [
              isEn ? "Informal" : "अनौपचारिक",
              isEn ? "Worker 11% + government 9.37% = 20.37%" : "श्रमिक ११% + सरकार ९.३७% = २०.३७%",
              "रु. १२,१७०",
            ],
            [
              isEn ? "Self-employed" : "स्वरोजगार",
              isEn ? "31% (base 1–3× minimum)" : "३१% (आधार १–३× न्यूनतम)",
              "रु. १२,१७०",
            ],
            [
              isEn ? "Foreign employment" : "वैदेशिक रोजगार",
              isEn ? "21.33% minimum (up to 3×)" : "२१.३३% न्यूनतम (३× सम्म)",
              "≈ रु. २,५९६/" + (isEn ? "mo" : "महिना"),
            ],
          ]}
        />
        <p className="mt-3 text-xs text-ink-400">
          {isEn
            ? "Foreign-employment minimum ≈ 21.33% × Rs 12,170 ≈ Rs 2,596/month."
            : "वैदेशिक न्यूनतम ≈ २१.३३% × रु. १२,१७० ≈ रु. २,५९६/महिना।"}
        </p>
      </section>

      {/* 31% split */}
      <section className="border-t border-ink-200 bg-ink-50">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <SectionHead
            eyebrow={isEn ? "Allocation" : "बाँडफाँट"}
            title={isEn ? "Where the 31% goes (formal)" : "औपचारिकको ३१% कहाँ जान्छ"}
          />
          <Table
            headers={isEn ? ["Scheme", "% of basic"] : ["योजना", "आधारभूतको %"]}
            rows={[
              [isEn ? "Medical, health & maternity" : "औषधि, स्वास्थ्य र मातृत्व", "१.२०%"],
              [isEn ? "Accident & disability" : "दुर्घटना र अशक्तता", "०.८०%"],
              [isEn ? "Dependent family" : "आश्रित परिवार", "०.६७%"],
              [isEn ? "Old-age (pension + gratuity)" : "वृद्धावस्था (पेन्सन + उपदान)", "२८.३३%"],
              [isEn ? "Total" : "जम्मा", "३१.००%"],
            ]}
          />
          <p className="mt-4 text-sm text-ink-500">
            <Link href="/calculators/allocation" className="font-semibold text-primary-700 hover:underline">
              {isEn ? "Open the 31% breakdown calculator →" : "३१% breakdown क्याल्कुलेटर खोल्नुहोस् →"}
            </Link>
          </p>
        </div>
      </section>

      {/* Minimum wage */}
      <section className="mx-auto max-w-4xl px-4 py-14">
        <SectionHead
          eyebrow={isEn ? "Minimum wage" : "न्यूनतम ज्याला"}
          title={isEn ? "Minimum remuneration (FY 2082/83)" : "न्यूनतम पारिश्रमिक (आ.व. २०८२/८३)"}
        />
        <Table
          headers={isEn ? ["Component", "Amount (Rs/month)"] : ["अवयव", "रकम (रु./महिना)"]}
          rows={[
            [isEn ? "Basic remuneration" : "आधारभूत पारिश्रमिक", "१२,१७०"],
            [isEn ? "Dearness allowance" : "महँगी भत्ता", "७,३८०"],
            [isEn ? "Total minimum wage" : "कुल न्यूनतम ज्याला", "१९,५५०"],
          ]}
        />
        <p className="mt-3 text-xs text-ink-400">
          {isEn
            ? "Effective from Shrawan 1, 2082. SSF contribution is based on the Rs 12,170 basic portion."
            : "श्रावण १, २०८२ देखि लागू। SSF योगदान रु. १२,१७० आधारभूत रकममा आधारित हुन्छ।"}
        </p>
      </section>

      {/* Interest rate */}
      <section className="border-t border-ink-200 bg-ink-50">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <SectionHead
            eyebrow={isEn ? "Interest" : "ब्याज"}
            title={isEn ? "SSF interest on your balance" : "जम्मा रकममा SSF ब्याज"}
          />
          <Table
            headers={isEn ? ["Detail", "Rate"] : ["विवरण", "दर"]}
            rows={[
              [isEn ? "Current rate (annual)" : "हालको दर (वार्षिक)", "३.२०%"],
              [isEn ? "Previous rate" : "अघिल्लो दर", "३.६०%"],
            ]}
          />
          <p className="mt-4 text-sm text-ink-500">
            <Link href="/blog/ssf-interest-rate-reduced-3-20-nepal" className="font-semibold text-primary-700 hover:underline">
              {isEn ? "Read: what the rate cut means →" : "पढ्नुहोस्: ब्याज घटौतीको असर →"}
            </Link>
          </p>
        </div>
      </section>

      {/* Income tax slabs */}
      <section className="mx-auto max-w-4xl px-4 py-14">
        <SectionHead
          eyebrow={isEn ? "Income tax" : "आयकर"}
          title={isEn ? "Income-tax slabs (FY 2083/84)" : "आयकर स्ल्याब (आ.व. २०८३/८४)"}
          lead={
            isEn
              ? "Single rate for everyone; SSF contributors get the first 1% social-security tax waived."
              : "सबैलाई एउटै दर; SSF योगदानकर्तालाई पहिलो १% सामाजिक सुरक्षा कर छुट।"
          }
        />
        <Table
          headers={isEn ? ["Annual income", "Rate"] : ["आम्दानी (वार्षिक)", "दर"]}
          rows={[
            [isEn ? "Up to Rs 10 lakh" : "रु. १० लाखसम्म", isEn ? "1% (waived if in SSF)" : "१% (SSF भए छुट)"],
            [isEn ? "Rs 10–15 lakh" : "रु. १०–१५ लाख", "१०%"],
            [isEn ? "Rs 15–25 lakh" : "रु. १५–२५ लाख", "२०%"],
            [isEn ? "Rs 25–40 lakh" : "रु. २५–४० लाख", "२७%"],
            [isEn ? "Above Rs 40 lakh" : "रु. ४० लाखभन्दा माथि", "२९%"],
          ]}
        />
        <p className="mt-4 text-sm text-ink-500">
          <Link href="/calculators/income-tax" className="font-semibold text-primary-700 hover:underline">
            {isEn ? "Open the income-tax calculator →" : "आयकर क्याल्कुलेटर खोल्नुहोस् →"}
          </Link>
        </p>
      </section>

      {/* Deadlines & key figures */}
      <section className="border-t border-ink-200 bg-ink-50">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <SectionHead
            eyebrow={isEn ? "Deadlines" : "म्याद"}
            title={isEn ? "Deadlines & other figures" : "म्याद र अन्य आँकडा"}
          />
          <ul className="mt-5 space-y-3 text-sm text-ink-700">
            <li className="flex gap-3">
              <span className="font-serif text-primary-400">·</span>
              {isEn
                ? "Monthly contribution must be deposited by the 15th of each Nepali month."
                : "मासिक योगदान हरेक नेपाली महिनाको १५ गतेभित्र जम्मा गर्नुपर्छ।"}
            </li>
            <li className="flex gap-3">
              <span className="font-serif text-primary-400">·</span>
              {isEn
                ? "Minimum 3 months' contribution for medical/health benefit; schemes have their own qualifying periods."
                : "औषधि/स्वास्थ्य सुविधाका लागि कम्तीमा ३ महिना योगदान; हरेक योजनाको आफ्नै योग्यता अवधि हुन्छ।"}
            </li>
            <li className="flex gap-3">
              <span className="font-serif text-primary-400">·</span>
              {isEn
                ? "Pension eligibility: contribution continued until age 60 with the required years (see the pension guide)."
                : "पेन्सन योग्यता: ६० वर्षसम्म आवश्यक अवधि योगदान गरेपछि (पेन्सन गाइड हेर्नुहोस्)।"}
            </li>
          </ul>
        </div>
      </section>

      {/* Disclaimer + links */}
      <section className="mx-auto max-w-4xl px-4 py-14">
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
          {isEn
            ? "These figures are compiled from official SSF notices and the national budget/finance act. Rates and limits change through amendments — for any official or legal purpose, confirm with ssf.gov.np or the relevant gazette."
            : "यी आँकडा आधिकारिक SSF सूचना र बजेट/आर्थिक ऐनबाट संकलित हुन्। दर र सीमा संशोधनद्वारा फेरिन्छन् — कुनै पनि आधिकारिक वा कानुनी प्रयोजनका लागि ssf.gov.np वा सम्बन्धित राजपत्रमा पुष्टि गर्नुहोस्।"}
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link href="/calculators" className="rounded-full border border-ink-300 bg-white px-4 py-2 font-semibold text-ink-700 hover:border-ink-500 hover:text-ink-900">
            {isEn ? "Financial Tools" : "Financial Tools"}
          </Link>
          <Link href="/sources" className="rounded-full border border-ink-300 bg-white px-4 py-2 font-semibold text-ink-700 hover:border-ink-500 hover:text-ink-900">
            {isEn ? "Source registry" : "स्रोत सूची"}
          </Link>
          <Link href="/school" className="rounded-full border border-ink-300 bg-white px-4 py-2 font-semibold text-ink-700 hover:border-ink-500 hover:text-ink-900">
            {isEn ? "SSF School" : "SSF School"}
          </Link>
        </div>
      </section>
    </div>
  );
}
