import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { pageSeo, SITE_URL } from "@/lib/seo";
import { ssfStats, formatCount, toNe } from "@/content/ssf-stats";
import { ssfDesks } from "@/content/ssf-offices";
import { checklistBySlug } from "@/content/checklists";
import { videosByCategory } from "@/content/videos";
import { faqs } from "@/content/faqs";
import { FORMAL_RULE_V1, MIN_BASIC_REMUNERATION } from "@/lib/calculation/rules";
import { DEPOSIT_GRACE_DAYS } from "@/lib/nepali-date";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { ContentBlocks } from "@/components/content-blocks";
import { PayrollSheet } from "@/components/employer/payroll-sheet";
import { DeadlineCalendar } from "@/components/employer/deadline-calendar";
import { Icon, type IconName } from "@/components/icons";
import { Callout, LinkCard, PageHero, SectionHead, Stat } from "@/components/ui";

const SOSYS_EMPLOYER_LOGIN = "https://sosys.ssf.gov.np/Modules/REGISTRATION/EmployerLogin.aspx";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return pageSeo({
    locale,
    path: "/employer",
    title: isEn
      ? "Employer SSF toolkit — payroll 11%/20%/31% sheet, deposit deadlines, new-employee listing, penalties"
      : "रोजगारदाताको SSF toolkit — payroll ११%/२०%/३१% sheet, दाखिला म्याद, नयाँ कर्मचारी सूचीकरण, जरिवाना",
    description: isEn
      ? `The monthly SSF routine for HR in 5 minutes: paste your payroll to get every employee's 11% + 20% = 31% and the total to deposit, the ${DEPOSIT_GRACE_DAYS}-day deadline calendar with a calendar reminder, the 3-month rule for listing new staff, and exactly what happens if you deposit late.`
      : `HR को मासिक SSF काम ५ मिनेटमा: payroll paste गरेर हरेक कर्मचारीको ११% + २०% = ३१% र दाखिला गर्ने जम्मा रकम, ${toNe(String(DEPOSIT_GRACE_DAYS))} दिने म्याद क्यालेन्डर र रिमाइन्डर, नयाँ कर्मचारी सूचीकरणको ३ महिने नियम, र ढिलो तिरे के हुन्छ।`,
  });
}

export default async function EmployerHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  const n = (s: string | number) => (isEn ? String(s) : toNe(String(s)));

  const listing = checklistBySlug("employee-registration");
  const listingItems = listing ? (isEn && listing.en ? listing.en.items : listing.items) : [];
  const listingSteps = listing ? (isEn && listing.en ? listing.en.expectedWorkflow : listing.expectedWorkflow) : [];
  const vids = videosByCategory("karmachari-ra-rojgardata").filter(
    (v) => (v.kind === "howto" || v.kind === "explainer") && v.userCategories.includes("employer"),
  );
  const faqList = faqs.filter((f) => f.userCategories.includes("employer")).slice(0, 4);
  const collectionDesk = ssfDesks.find((d) => d.email === "collection@ssf.gov.np");
  const regDesk = ssfDesks.find((d) => d.email === "reg@ssf.gov.np");

  const prefix = isEn ? "/en" : "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: isEn ? "Home" : "गृहपृष्ठ", item: `${SITE_URL}${prefix}/` },
      { "@type": "ListItem", position: 2, name: isEn ? "Employer toolkit" : "रोजगारदाता toolkit", item: `${SITE_URL}${prefix}/employer` },
    ],
  };

  const routine: { icon: IconName; t: string; d: string; href: string }[] = isEn
    ? [
        { icon: "calculator", t: "1 · Run the payroll sheet", d: "Paste names + basic salaries, get 11% / 20% / 31% per person and the total to deposit.", href: "#payroll" },
        { icon: "clock", t: "2 · Check the deadline", d: `Within ${DEPOSIT_GRACE_DAYS} days of the Nepali month-end. Add the next one to your calendar.`, href: "#deadlines" },
        { icon: "users", t: "3 · List new staff, mark exits", d: "New employees within 3 months of joining; exits reported to the Fund.", href: "#listing" },
        { icon: "shield", t: "4 · Know the cost of being late", d: "10% interest, enforcement, and you personally owe benefits during default.", href: "#penalty" },
      ]
    : [
        { icon: "calculator", t: "१ · Payroll sheet चलाउनुहोस्", d: "नाम + आधारभूत तलब paste गर्नुहोस्; प्रति व्यक्ति ११% / २०% / ३१% र दाखिला गर्ने जम्मा रकम आउँछ।", href: "#payroll" },
        { icon: "clock", t: "२ · म्याद जाँच्नुहोस्", d: `नेपाली महिना सकिएको ${n(DEPOSIT_GRACE_DAYS)} दिनभित्र। आगामी म्याद क्यालेन्डरमा राख्नुहोस्।`, href: "#deadlines" },
        { icon: "users", t: "३ · नयाँ कर्मचारी सूचीकरण, छाडेकाको exit", d: "नयाँ कर्मचारी नियुक्तिको ३ महिनाभित्र; छाडेकाको जानकारी कोषलाई।", href: "#listing" },
        { icon: "shield", t: "४ · ढिलो गर्दाको मूल्य बुझ्नुहोस्", d: "१०% ब्याज, कारबाही, र नबुझाएको अवधिको सुविधा तपाईं स्वयंले तिर्नुपर्ने।", href: "#penalty" },
      ];

  const penaltyRows = isEn
    ? [
        ["Deposit after the 25-day deadline", "10% interest on the outstanding amount", "Act §9"],
        ["Keep not depositing", "Bank account / property freeze, concessions and licence suspended, passport hold", "Act §9"],
        ["Employee has an accident or dies while you are in default", "You, the employer, must pay an amount equal to the accident / death benefit", "Act §9"],
        ["New employee not listed within 3 months", "Worker can apply directly; the Fund orders the employer to list within 15 days", "Act §20; Listing Procedure 2075 §5"],
        ["Benefits obtained with false details", "Fine equal to the amount involved; if unknown, up to Rs 1,00,000 and/or up to 1 year imprisonment", "Act §47"],
      ]
    : [
        ["२५ दिनको म्यादपछि दाखिला", "बाँकी रकममा १०% ब्याज", "ऐन दफा ९"],
        ["दाखिला नै नगरिरहे", "बैंक खाता / सम्पत्ति रोक्का, छुट-सहुलियत र इजाजत निलम्बन, राहदानी रोक्का", "ऐन दफा ९"],
        ["नबुझाएको अवधिमा कर्मचारीको दुर्घटना वा मृत्यु", "दुर्घटना / मृत्यु सुविधा बराबरको रकम रोजगारदाता स्वयंले तिर्नुपर्ने", "ऐन दफा ९"],
        ["नयाँ कर्मचारी ३ महिनाभित्र सूचीकरण नगरे", "श्रमिक आफैँ निवेदन दिन सक्छ; कोषले १५ दिनभित्र सूचीकरण गर्न रोजगारदातालाई आदेश दिन्छ", "ऐन दफा २०; सूचीकरण कार्यविधि २०७५ दफा ५"],
        ["झुटा विवरणले सुविधा लिए/दिलाए", "बिगो बमोजिम जरिवाना; बिगो नखुले रु. १,००,००० सम्म जरिवाना वा १ वर्ष कैद वा दुवै", "ऐन दफा ४७"],
      ];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        tone="primary"
        icon="building"
        eyebrow={isEn ? "Employer toolkit" : "रोजगारदाता toolkit"}
        title={isEn ? "The employer's monthly SSF work — in 5 minutes" : "रोजगारदाताको मासिक SSF काम — ५ मिनेटमा"}
        lead={
          isEn
            ? `${formatCount(ssfStats.employers, true)} employers are listed with the Fund. Every month each one declares payroll and deposits 31% of basic salary within ${DEPOSIT_GRACE_DAYS} days of the Nepali month-end. This page does the arithmetic, keeps the deadline, and spells out the penalties — so HR never pays the 10%.`
            : `${formatCount(ssfStats.employers, false)} रोजगारदाता कोषमा सूचीकृत छन्। हरेकले हरेक महिना payroll declaration गरी आधारभूत तलबको ३१% नेपाली महिना सकिएको ${n(DEPOSIT_GRACE_DAYS)} दिनभित्र दाखिला गर्नुपर्छ। यो पृष्ठले हिसाब गर्छ, म्याद सम्झाउँछ र जरिवाना स्पष्ट पार्छ — HR ले कहिल्यै १०% तिर्नु नपरोस्।`
        }
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: isEn ? "Employer toolkit" : "रोजगारदाता toolkit" }]}
      >
        <div className="flex flex-wrap gap-2">
          <a href="#payroll" className="btn-primary">
            <Icon name="calculator" size={16} />
            {isEn ? "Payroll sheet" : "Payroll sheet"}
          </a>
          <a href="#deadlines" className="btn-outline">
            <Icon name="clock" size={16} />
            {isEn ? "Deposit deadlines" : "दाखिला म्याद"}
          </a>
          <a href="#penalty" className="btn-ghost">
            {isEn ? "What if we are late?" : "ढिलो भए के हुन्छ?"}
          </a>
        </div>
      </PageHero>

      {/* Key numbers */}
      <section className="container-page py-10">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat value={`${n(FORMAL_RULE_V1.employeePct)}% + ${n(FORMAL_RULE_V1.employerPct)}%`} label={isEn ? "Employee + employer" : "कर्मचारी + रोजगारदाता"} hint={isEn ? "= 31% of basic salary" : "= आधारभूत तलबको ३१%"} />
          <Stat value={isEn ? `${DEPOSIT_GRACE_DAYS} days` : `${n(DEPOSIT_GRACE_DAYS)} दिन`} label={isEn ? "After month-end to deposit" : "महिना सकिएपछि दाखिला गर्न"} hint={isEn ? "Act §4 (2082 amendment)" : "ऐन दफा ४ (२०८२ संशोधन)"} tone="health" />
          <Stat value={n("10%")} label={isEn ? "Interest when late" : "ढिलो भए ब्याज"} hint={isEn ? "Act §9" : "ऐन दफा ९"} tone="neutral" />
          <Stat value={isEn ? "3 months" : "३ महिना"} label={isEn ? "To list a new employee" : "नयाँ कर्मचारी सूचीकरण गर्न"} hint={isEn ? "from the start of employment, Act §20" : "रोजगार सम्बन्ध सुरु भएदेखि, ऐन दफा २०"} />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {routine.map((r) => (
            <a key={r.href} href={r.href} className="card card-hover group flex gap-3 p-4">
              <span className="icon-tile">
                <Icon name={r.icon} size={20} />
              </span>
              <span>
                <span className="block font-semibold text-ink-900 group-hover:text-primary-700">{r.t}</span>
                <span className="mt-1 block text-sm text-ink-500">{r.d}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Payroll sheet */}
      <section id="payroll" className="scroll-mt-20 border-y border-ink-200 bg-ink-50">
        <div className="container-page py-14">
          <SectionHead
            eyebrow={isEn ? "Tool 1" : "उपकरण १"}
            title={isEn ? "Payroll sheet — 11% / 20% / 31% for every employee" : "Payroll sheet — हरेक कर्मचारीको ११% / २०% / ३१%"}
            lead={isEn ? "Runs entirely in your browser; nothing is uploaded. Download the CSV for your accountant or print it for the file." : "सबै तपाईंको ब्राउजरमै चल्छ; केही upload हुँदैन। लेखापालका लागि CSV डाउनलोड गर्नुहोस् वा फाइलका लागि print।"}
            href="/calculators/contribution"
            linkLabel={isEn ? "Single-employee calculator" : "एक कर्मचारीको क्याल्कुलेटर"}
          />
          <div className="mt-7">
            <PayrollSheet />
          </div>
        </div>
      </section>

      {/* Deadlines */}
      <section id="deadlines" className="container-page scroll-mt-20 py-14">
        <SectionHead
          eyebrow={isEn ? "Tool 2" : "उपकरण २"}
          title={isEn ? "Deposit deadline calendar" : "दाखिला म्याद क्यालेन्डर"}
          lead={isEn ? "Each Nepali month's contribution and the last day to deposit it without the 10% late interest." : "हरेक नेपाली महिनाको योगदान र १०% ढिलो ब्याज बिना दाखिला गर्ने अन्तिम दिन।"}
        />
        <div className="mt-7">
          <DeadlineCalendar count={6} />
        </div>
      </section>

      {/* New employee listing */}
      <section id="listing" className="scroll-mt-20 border-y border-ink-200 bg-ink-50">
        <div className="container-page py-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <SectionHead
                eyebrow={isEn ? "Tool 3" : "उपकरण ३"}
                title={isEn ? "Listing a new employee" : "नयाँ कर्मचारी सूचीकरण"}
                lead={isEn ? "Rule: list within 3 months of the start of the employment relationship (Act §20). The Fund issues the 11-digit SSN within 35 days." : "नियम: रोजगार सम्बन्ध सुरु भएको ३ महिनाभित्र सूचीकरण (ऐन दफा २०)। कोषले ३५ दिनभित्र ११ अङ्कको SSN जारी गर्छ।"}
              />
              <ul className="card mt-6 divide-y divide-ink-100 p-5">
                {listingItems.map((it) => (
                  <li key={it.label} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0 text-sm text-ink-800">
                    <Icon name="checkCircle" size={18} className="mt-0.5 shrink-0 text-health-600" />
                    <span>
                      {it.label}
                      {it.conditional && <span className="block text-xs text-ink-500">{it.conditionNote ?? (isEn ? "conditional" : "सशर्त")}</span>}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={SOSYS_EMPLOYER_LOGIN} target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm">
                  <Icon name="external" size={14} />
                  {isEn ? "SOSYS employer login" : "SOSYS रोजगारदाता login"}
                </a>
                <Link href="/checklists/employee-registration" className="btn-outline btn-sm">
                  <Icon name="list" size={14} />
                  {isEn ? "Tickable checklist" : "टिक गर्ने checklist"}
                </Link>
              </div>
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <Icon name="list" size={16} className="text-primary-600" />
                {isEn ? "How it goes in SOSYS" : "SOSYS मा कसरी हुन्छ"}
              </p>
              <ol className="mt-3 space-y-2">
                {listingSteps.map((s, i) => (
                  <li key={s} className="flex gap-3 rounded-xl border border-ink-200 bg-white p-3 text-sm text-ink-700">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 font-display text-xs font-bold text-primary-700">{n(i + 1)}</span>
                    {s}
                  </li>
                ))}
              </ol>
              <div className="mt-4">
                <Callout tone="info" title={isEn ? "Also every month" : "हरेक महिना यो पनि"}>
                  {isEn
                    ? `Verify no basic salary is below Rs ${MIN_BASIC_REMUNERATION.toLocaleString("en-IN")} (the minimum basic remuneration, FY 2082/83), mark exits for staff who left, and keep the bank voucher with the declaration in your HR records.`
                    : `कुनै आधारभूत तलब रु. ${n(MIN_BASIC_REMUNERATION.toLocaleString("en-IN"))} (न्यूनतम आधारभूत पारिश्रमिक, आ.व. २०८२/८३) भन्दा कम नहोस्, छाडेका कर्मचारीको exit जनाउनुहोस्, र बैंक भौचर declaration सँगै HR record मा राख्नुहोस्।`}
                </Callout>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Penalty explainer */}
      <section id="penalty" className="container-page scroll-mt-20 py-14">
        <SectionHead
          eyebrow={isEn ? "The cost of being late" : "ढिलो गर्दाको मूल्य"}
          title={isEn ? "What happens if you do not deposit" : "नतिर्दा के हुन्छ"}
          href="/school/karmachari-ra-rojgardata/employer-monthly-compliance"
          linkLabel={isEn ? "Full compliance guide" : "पूरा compliance guide"}
        />
        <div className="mt-6">
          <Callout tone="warn" title={isEn ? "10% interest is the smallest part" : "१०% ब्याज त सबैभन्दा सानो भाग हो"}>
            {isEn
              ? "The Act recovers late contributions with 10% interest, and lets the Fund freeze bank accounts and property, suspend concessions and licences, and hold passports (Act §9). Most costly: if an employee has an accident or dies while you are in default, the employer itself must pay the equivalent benefit — the scheme's protection stops being the Fund's problem and becomes yours."
              : "ऐनले ढिलो योगदान १०% ब्याजसहित असुल गर्छ, र कोषलाई बैंक खाता र सम्पत्ति रोक्का, छुट-सहुलियत र इजाजत निलम्बन, राहदानी रोक्कासम्मको अधिकार दिन्छ (ऐन दफा ९)। सबैभन्दा महँगो: नबुझाएको अवधिमा कर्मचारीको दुर्घटना वा मृत्यु भए सुविधा बराबरको रकम रोजगारदाता स्वयंले तिर्नुपर्छ — योजनाको सुरक्षा कोषको होइन, तपाईंको दायित्व बन्छ।"}
          </Callout>
        </div>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-200">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-ink-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-600">
                <th className="px-4 py-2.5">{isEn ? "If…" : "यदि…"}</th>
                <th className="px-4 py-2.5">{isEn ? "Then" : "त्यसो भए"}</th>
                <th className="px-4 py-2.5">{isEn ? "Source" : "स्रोत"}</th>
              </tr>
            </thead>
            <tbody>
              {penaltyRows.map((r) => (
                <tr key={r[0]} className="border-t border-ink-100 align-top">
                  <td className="px-4 py-3 font-medium text-ink-900">{r[0]}</td>
                  <td className="px-4 py-3 text-ink-700">{r[1]}</td>
                  <td className="px-4 py-3 text-xs text-ink-500">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-400">
          {isEn ? "Source: Contribution-based Social Security Act 2074 (2082 amendment) and knowledge-base verified facts. Decisions can be appealed to the Labour Court within 35 days (Act §52)." : "स्रोत: योगदानमा आधारित सामाजिक सुरक्षा ऐन २०७४ (२०८२ संशोधन)। कोषको निर्णयउपर ३५ दिनभित्र श्रम अदालतमा पुनरावेदन गर्न सकिन्छ (ऐन दफा ५२)।"}
        </p>
      </section>

      {/* Videos */}
      {vids.length > 0 && (
        <section className="border-t border-ink-200 bg-ink-50">
          <div className="container-page py-14">
            <SectionHead eyebrow={isEn ? "Watch" : "भिडियो"} title={isEn ? "Registration, deposit and claims — on screen" : "सूचीकरण, दाखिला र दाबी — स्क्रिनमै"} />
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {vids.slice(0, 3).map((v) => (
                <YouTubeEmbed key={v.youtubeId} id={v.youtubeId} title={v.title} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ + links + CTA */}
      <section className="container-page py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHead eyebrow={isEn ? "FAQ" : "प्रश्नोत्तर"} title={isEn ? "Employers ask" : "रोजगारदाताले सोध्ने प्रश्न"} href="/faq" linkLabel={isEn ? "All FAQs" : "सबै प्रश्न"} />
            <div className="mt-6 space-y-3">
              {faqList.map((f) => {
                const q = isEn && f.en ? f.en.question : f.question;
                const blocks = isEn && f.en ? f.en.answerBlocks : f.answerBlocks;
                return (
                  <details key={f.slug} className="card group p-4">
                    <summary className="no-marker flex cursor-pointer items-start gap-3 font-semibold text-ink-900">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-100 font-display text-xs font-bold text-primary-700">?</span>
                      <span className="flex-1">{q}</span>
                      <Icon name="chevronDown" size={16} className="mt-1 text-ink-400 transition group-open:rotate-180" />
                    </summary>
                    <div className="mt-3 pl-9 text-sm [&_.prose-ssf]:text-sm [&_.prose-ssf]:leading-relaxed [&_.prose-ssf]:text-ink-600">
                      <ContentBlocks blocks={blocks} />
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
          <div className="space-y-3">
            <SectionHead eyebrow={isEn ? "Read & do" : "पढ्नुहोस् र गर्नुहोस्"} title={isEn ? "Guides, checklists, help" : "Guide, checklist र सहायता"} />
            <LinkCard
              href="/school/karmachari-ra-rojgardata/employer-monthly-compliance"
              icon="book"
              title={isEn ? "Employer's monthly SSF compliance guide (for HR)" : "रोजगारदाताको मासिक SSF compliance guide (HR का लागि)"}
              description={isEn ? "The full monthly routine, penalties table and what to tell employees." : "पूरा मासिक routine, जरिवाना तालिका र कर्मचारीलाई बुझाउनुपर्ने कुरा।"}
            />
            <LinkCard
              href="/checklists/employer-registration"
              icon="list"
              title={isEn ? "Employer registration checklist" : "रोजगारदाता सूचीकरण checklist"}
              description={isEn ? "Not listed yet? Documents for the 16-digit employer number." : "अझै सूचीकृत छैन? १६ अङ्कको रोजगारदाता नम्बरका लागि कागजात।"}
            />
            <LinkCard
              href={SOSYS_EMPLOYER_LOGIN}
              external
              icon="external"
              title={isEn ? "SOSYS employer login" : "SOSYS रोजगारदाता login"}
              description={isEn ? "Contribution declaration, new employees, exits." : "Contribution declaration, नयाँ कर्मचारी, exit।"}
            />
            <div className="card p-5">
              <p className="text-sm text-ink-500">{isEn ? "SSF desks for employers" : "रोजगारदाताका लागि SSF डेस्क"}</p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {[regDesk, collectionDesk].filter(Boolean).map((d) => (
                  <li key={d!.email} className="flex flex-wrap justify-between gap-x-3">
                    <span className="text-ink-700">{isEn ? d!.topicEn : d!.topicNe}</span>
                    <span className="text-ink-900">
                      {d!.phone && (
                        <a href={`tel:${d!.phone.replace(/-/g, "")}`} className="font-semibold hover:text-primary-700">
                          {isEn ? d!.phone : toNe(d!.phone)}
                        </a>
                      )}
                      {d!.email && (
                        <>
                          {" · "}
                          <a href={`mailto:${d!.email}`} className="hover:text-primary-700">
                            {d!.email}
                          </a>
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-primary-200 bg-primary-50 p-5">
              <p className="eyebrow">Digital Solution</p>
              <h3 className="mt-1.5 text-xl">{isEn ? "Hand the whole thing to us" : "सबै काम हामीलाई दिनुहोस्"}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {isEn
                  ? "Employer registration, bulk employee listing, monthly declaration and deposit support — an independent service, not the Fund."
                  : "रोजगारदाता सूचीकरण, कर्मचारी bulk सूचीकरण, मासिक declaration र दाखिला सहयोग — स्वतन्त्र सेवा, कोष होइन।"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/services/employer-registration" className="btn-accent">
                  <Icon name="building" size={16} />
                  {isEn ? "Employer onboarding service" : "रोजगारदाता onboarding सेवा"}
                </Link>
                <Link href="/request?service=employer_assistance" className="btn-outline">
                  <Icon name="send" size={16} />
                  {isEn ? "Request assistance" : "सहायता अनुरोध"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
