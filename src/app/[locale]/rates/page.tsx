import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { pageSeo } from "@/lib/seo";
import {
  ssfStats,
  SSF_STATS_AS_OF_BS,
  SSF_STATS_AS_OF_ISO,
  SSF_STATS_SOURCE_URL,
  formatArab,
  formatCount,
  formatLakh,
} from "@/content/ssf-stats";
import { Icon } from "@/components/icons";
import { Callout, PageHero, SectionHead, Stat } from "@/components/ui";

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

const LAST_UPDATED = "2026-11-07";

function Table({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="card mt-6 overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="bg-ink-50 text-left">
            {headers.map((h, i) => (
              <th
                key={h}
                className={`px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink-500 ${
                  i === headers.length - 1 ? "text-right" : ""
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-t border-ink-100">
              {r.map((c, ci) => (
                <td
                  key={ci}
                  className={`px-4 py-3 ${ci === 0 ? "font-medium text-ink-900" : "text-ink-600"} ${
                    ci === r.length - 1 ? "text-right" : ""
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
      <PageHero
        icon="landmark"
        eyebrow={isEn ? "Reference · FY 2082/83" : "सन्दर्भ · आ.व. २०८२/८३"}
        title={isEn ? "SSF Rates & Figures" : "SSF दर र तथ्यांक"}
        lead={
          isEn
            ? "Every current Social Security Fund number in one place — contribution rates, the 31% split, minimum wage, interest rate, income-tax slabs and deadlines."
            : "सामाजिक सुरक्षा कोषका सबै पछिल्ला आँकडा एकै ठाउँमा — योगदान दर, ३१% बाँडफाँट, न्यूनतम ज्याला, ब्याजदर, आयकर स्ल्याब र म्याद।"
        }
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: isEn ? "Rates & figures" : "दर र तथ्यांक" }]}
      >
        <p className="text-sm text-ink-400">
          {isEn ? "Last updated" : "अद्यावधिक"}: {LAST_UPDATED} ·{" "}
          {isEn ? "verify against" : "आधिकारिक स्रोत"}{" "}
          <a
            href="https://ssf.gov.np"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-primary-700 hover:underline"
          >
            ssf.gov.np
            <Icon name="arrowUpRight" size={14} />
          </a>
        </p>
      </PageHero>

      {/* The Fund today */}
      <section className="container-page py-12">
        <SectionHead
          eyebrow={isEn ? "SSF in numbers" : "SSF तथ्यांकमा"}
          title={isEn ? "The Fund today" : "कोष आज"}
          lead={isEn ? `From the Fund's daily summary report dated ${SSF_STATS_AS_OF_ISO}.` : `कोषको दैनिक संक्षेप रिपोर्ट, ${SSF_STATS_AS_OF_BS} अनुसार।`}
        />
        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat
            value={formatLakh(ssfStats.contributors.total, isEn)}
            label={isEn ? "Total contributors" : "कुल योगदानकर्ता"}
            hint={isEn ? `${formatLakh(ssfStats.contributors.foreign, true)} in foreign employment` : `${formatLakh(ssfStats.contributors.foreign, false)} वैदेशिक रोजगारमा`}
          />
          <Stat
            value={formatCount(ssfStats.employers, isEn)}
            label={isEn ? "Registered employers" : "सूचीकृत रोजगारदाता"}
            hint={isEn ? `Bagmati alone: ${formatCount(ssfStats.formalByProvince.bagmati.employers, true)}` : `बागमती मात्र: ${formatCount(ssfStats.formalByProvince.bagmati.employers, false)}`}
          />
          <Stat
            value={formatArab(ssfStats.collectionNpr, isEn)}
            label={isEn ? "Contributions collected" : "जम्मा योगदान संकलन"}
            tone="neutral"
          />
          <Stat
            value={formatArab(ssfStats.claims.paidNpr, isEn)}
            label={isEn ? "Benefits paid out" : "दाबी भुक्तानी"}
            hint={isEn ? `${formatLakh(ssfStats.claims.paid, true)} claims paid` : `${formatLakh(ssfStats.claims.paid, false)} दाबी भुक्तानी`}
            tone="health"
          />
        </div>
        <p className="mt-4 text-xs text-ink-400">
          {isEn ? "Source: the Fund's daily summary report, " : "स्रोत: कोषको दैनिक संक्षेप रिपोर्ट, "}
          <a href={SSF_STATS_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-700">
            {SSF_STATS_AS_OF_BS}
          </a>
        </p>
      </section>

      {/* Contribution rates */}
      <section className="border-t border-ink-200 bg-ink-50">
        <div className="container-page py-14">
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
        </div>
      </section>

      {/* 31% split */}
      <section className="border-t border-ink-200">
        <div className="container-page py-14">
          <SectionHead
            eyebrow={isEn ? "Allocation" : "बाँडफाँट"}
            title={isEn ? "Where the 31% goes (formal)" : "औपचारिकको ३१% कहाँ जान्छ"}
            href="/calculators/allocation"
            linkLabel={isEn ? "Open the 31% breakdown calculator" : "३१% breakdown क्याल्कुलेटर खोल्नुहोस्"}
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
        </div>
      </section>

      {/* Minimum wage */}
      <section className="border-t border-ink-200 bg-ink-50">
        <div className="container-page py-14">
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
        </div>
      </section>

      {/* Interest rate */}
      <section className="border-t border-ink-200">
        <div className="container-page py-14">
          <SectionHead
            eyebrow={isEn ? "Interest" : "ब्याज"}
            title={isEn ? "SSF interest on your balance" : "जम्मा रकममा SSF ब्याज"}
            href="/blog/ssf-interest-rate-reduced-3-20-nepal"
            linkLabel={isEn ? "Read: what the rate cut means" : "पढ्नुहोस्: ब्याज घटौतीको असर"}
          />
          <Table
            headers={isEn ? ["Detail", "Rate"] : ["विवरण", "दर"]}
            rows={[
              [isEn ? "Current rate (annual)" : "हालको दर (वार्षिक)", "३.२०%"],
              [isEn ? "Previous rate" : "अघिल्लो दर", "३.६०%"],
            ]}
          />
        </div>
      </section>

      {/* Income tax slabs */}
      <section className="border-t border-ink-200 bg-ink-50">
        <div className="container-page py-14">
          <SectionHead
            eyebrow={isEn ? "Income tax" : "आयकर"}
            title={isEn ? "Income-tax slabs (FY 2083/84)" : "आयकर स्ल्याब (आ.व. २०८३/८४)"}
            lead={
              isEn
                ? "Single rate for everyone; SSF contributors get the first 1% social-security tax waived."
                : "सबैलाई एउटै दर; SSF योगदानकर्तालाई पहिलो १% सामाजिक सुरक्षा कर छुट।"
            }
            href="/calculators/income-tax"
            linkLabel={isEn ? "Open the income-tax calculator" : "आयकर क्याल्कुलेटर खोल्नुहोस्"}
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
        </div>
      </section>

      {/* Deadlines & key figures */}
      <section className="border-t border-ink-200">
        <div className="container-page py-14">
          <SectionHead
            eyebrow={isEn ? "Deadlines" : "म्याद"}
            title={isEn ? "Deadlines & other figures" : "म्याद र अन्य आँकडा"}
          />
          <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              {
                icon: "clock" as const,
                t: isEn
                  ? "Monthly contribution must be deposited within 25 days of the end of each Nepali month (Act §4, 2082 amendment); late payment attracts 10% interest."
                  : "मासिक योगदान हरेक नेपाली महिना सकिएको २५ दिनभित्र जम्मा गर्नुपर्छ (ऐन दफा ४, २०८२ संशोधन); ढिलो भए १०% ब्याज लाग्छ।",
              },
              {
                icon: "hospital" as const,
                t: isEn
                  ? "Minimum 3 months' contribution for medical/health benefit; schemes have their own qualifying periods."
                  : "औषधि/स्वास्थ्य सुविधाका लागि कम्तीमा ३ महिना योगदान; हरेक योजनाको आफ्नै योग्यता अवधि हुन्छ।",
              },
              {
                icon: "coins" as const,
                t: isEn
                  ? "Pension eligibility: contribution continued until age 60 with the required years (see the pension guide)."
                  : "पेन्सन योग्यता: ६० वर्षसम्म आवश्यक अवधि योगदान गरेपछि (पेन्सन गाइड हेर्नुहोस्)।",
              },
            ].map((d) => (
              <li key={d.t} className="card flex gap-3.5 p-5">
                <span className="icon-tile h-10 w-10">
                  <Icon name={d.icon} size={18} />
                </span>
                <p className="text-sm leading-relaxed text-ink-700">{d.t}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Disclaimer + links */}
      <section className="border-t border-ink-200 bg-ink-50">
        <div className="container-page py-14">
          <Callout tone="warn">
            {isEn
              ? "These figures are compiled from official SSF notices and the national budget/finance act. Rates and limits change through amendments — for any official or legal purpose, confirm with ssf.gov.np or the relevant gazette."
              : "यी आँकडा आधिकारिक SSF सूचना र बजेट/आर्थिक ऐनबाट संकलित हुन्। दर र सीमा संशोधनद्वारा फेरिन्छन् — कुनै पनि आधिकारिक वा कानुनी प्रयोजनका लागि ssf.gov.np वा सम्बन्धित राजपत्रमा पुष्टि गर्नुहोस्।"}
          </Callout>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/calculators" className="btn-outline">
              <Icon name="calculator" size={16} />
              {isEn ? "Financial Tools" : "Financial Tools"}
            </Link>
            <Link href="/sources" className="btn-outline">
              <Icon name="file" size={16} />
              {isEn ? "Source registry" : "स्रोत सूची"}
            </Link>
            <Link href="/school" className="btn-outline">
              <Icon name="book" size={16} />
              {isEn ? "SSF School" : "SSF School"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
