import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { pageSeo, SITE_URL } from "@/lib/seo";
import { ssfStats, formatLakh, toNe } from "@/content/ssf-stats";
import { ssfDesks } from "@/content/ssf-offices";
import { checklistBySlug } from "@/content/checklists";
import { videosByCategory } from "@/content/videos";
import { faqs } from "@/content/faqs";
import { PROVINCES, PROVINCE_ORDER } from "@/content/hospitals";
import { FOREIGN_EMPLOYMENT_RULE_V1, MIN_BASIC_REMUNERATION } from "@/lib/calculation/rules";
import { calculateForeignEmployment } from "@/lib/calculation/engine";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { ContentBlocks } from "@/components/content-blocks";
import { CountryPanel } from "@/components/foreign/country-panel";
import { ForeignCta } from "@/components/foreign/foreign-cta";
import { Icon, type IconName } from "@/components/icons";
import { Callout, LinkCard, PageHero, SectionHead, Stat } from "@/components/ui";

const OFFICIAL_CONCESSIONS_URL =
  "https://ssf.gov.np/services/arrangements-related-to-discounts-and-concessions-received-by-workers-in-foreign-employment";
const SOSYS_CONTRIBUTOR_LOGIN = "https://sosys.ssf.gov.np/Modules/REGISTRATION/ContributorLogin.aspx";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  const minMonthly = calculateForeignEmployment({ base: MIN_BASIC_REMUNERATION, periodMonths: 1 }, FOREIGN_EMPLOYMENT_RULE_V1).monthlyTotal;
  return pageSeo({
    locale,
    path: "/foreign",
    title: isEn
      ? `SSF for migrant workers — pay from abroad, Rs ${minMonthly.toLocaleString("en-IN")}/month, family treatment in Nepal`
      : `वैदेशिक रोजगारीमा SSF — विदेशबाट कसरी तिर्ने, रु. ${toNe(minMonthly.toLocaleString("en-IN"))}/महिना, परिवारको उपचार नेपालमा`,
    description: isEn
      ? `${formatLakh(ssfStats.contributors.foreign, true)} of SSF's contributors work abroad. Country-wise monthly amount in your currency, SSF office hours in your local time, how to pay from abroad, family medical cover (OPD Rs 25,000, inpatient Rs 1 lakh), the pre-departure checklist and what happens when you return.`
      : `SSF का ${formatLakh(ssfStats.contributors.foreign, false)} योगदानकर्ता विदेशमा छन्। देशअनुसार मासिक रकम आफ्नो मुद्रामा, SSF कार्यालय समय आफ्नो समयमा, विदेशबाट तिर्ने तरिका, परिवारको उपचार (OPD रु. २५ हजार, भर्ना रु. १ लाख), जानुअघिको checklist र फर्किएपछि के हुन्छ।`,
  });
}

export default async function ForeignHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  const n = (s: string | number) => (isEn ? String(s) : toNe(String(s)));

  const minRow = calculateForeignEmployment({ base: MIN_BASIC_REMUNERATION, periodMonths: 1 }, FOREIGN_EMPLOYMENT_RULE_V1);
  const foreignShare = Math.round((ssfStats.contributors.foreign / ssfStats.contributors.total) * 100);
  const checklist = checklistBySlug("foreign-employment-registration");
  const checklistItems = checklist ? (isEn && checklist.en ? checklist.en.items : checklist.items) : [];
  const vids = videosByCategory("baideshik-rojgari");
  const faqList = faqs.filter((f) => f.userCategories.includes("foreign")).slice(0, 4);
  const desk = ssfDesks.find((d) => d.email === "migrantworker@ssf.gov.np");
  const deskPhone = desk?.phone ?? "9851351754";
  const deskEmail = desk?.email ?? "migrantworker@ssf.gov.np";

  const prefix = isEn ? "/en" : "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: isEn ? "Home" : "गृहपृष्ठ", item: `${SITE_URL}${prefix}/` },
      { "@type": "ListItem", position: 2, name: isEn ? "Foreign employment" : "वैदेशिक रोजगार", item: `${SITE_URL}${prefix}/foreign` },
    ],
  };

  const paySteps: { icon: IconName; t: string; d: string }[] = isEn
    ? [
        { icon: "card", t: "Check you are registered", d: "Registration happens when you take the labour permit. Already abroad without an ID/password? Apply online or recover your credentials (video below)." },
        { icon: "user", t: "Log in to SOSYS or the SSF app", d: "Use the Contributor login. Complete KYC first — without it, claims cannot be paid." },
        { icon: "coins", t: "Choose your contribution", d: `Minimum ${FOREIGN_EMPLOYMENT_RULE_V1.minPct}% of Rs ${MIN_BASIC_REMUNERATION.toLocaleString("en-IN")} (about Rs ${minRow.monthlyTotal.toLocaleString("en-IN")}/month); you may pick a base up to 3×. Monthly or quarterly.` },
        { icon: "send", t: "Pay through the channels the Fund lists", d: "Banks and remittance partners that have an arrangement with the Fund accept SSF deposits from abroad; the current list is on ssf.gov.np." },
        { icon: "checkCircle", t: "Check the deposit in SOSYS", d: "Your contribution history should show the month within a few days. Keep the receipt until it does." },
      ]
    : [
        { icon: "card", t: "सूचीकृत हुनुहुन्छ कि जाँच्नुहोस्", d: "श्रम स्वीकृति लिँदा नै सूचीकरण हुन्छ। विदेशमा भइसक्नुभयो तर ID/password छैन? Online निवेदन दिनुहोस् वा रिकभरी गर्नुहोस् (तलको भिडियो)।" },
        { icon: "user", t: "SOSYS वा SSF app मा login", d: "Contributor login प्रयोग गर्नुहोस्। पहिले KYC पूरा गर्नुहोस् — नगरे दाबी भुक्तानी हुँदैन।" },
        { icon: "coins", t: "योगदान रकम रोज्नुहोस्", d: `न्यूनतम रु. ${toNe(MIN_BASIC_REMUNERATION.toLocaleString("en-IN"))} को ${toNe(String(FOREIGN_EMPLOYMENT_RULE_V1.minPct))}% (करिब रु. ${toNe(minRow.monthlyTotal.toLocaleString("en-IN"))}/महिना); आधार ३ गुणासम्म रोज्न मिल्छ। मासिक वा त्रैमासिक।` },
        { icon: "send", t: "कोषले तोकेका माध्यमबाट तिर्नुहोस्", d: "कोषसँग व्यवस्था भएका बैंक र रेमिट्यान्स साझेदारले विदेशबाट SSF जम्मा लिन्छन्; हालको सूची ssf.gov.np मा छ।" },
        { icon: "checkCircle", t: "SOSYS मा जम्मा देखियो कि हेर्नुहोस्", d: "केही दिनभित्र contribution history मा महिना देखिनुपर्छ। नदेखिएसम्म रसिद राख्नुहोस्।" },
      ];

  const medicalFacts = isEn
    ? [
        { t: "OPD", v: "Rs 25,000 / year", d: "Foreign-employment scheme ceiling (formal sector gets Rs 20,000)." },
        { t: "Inpatient", v: "Rs 1,00,000 / year", d: "Family total — you, spouse and children up to 18." },
        { t: "Co-payment", v: "20%", d: "Of every claim; the Fund pays 80%." },
        { t: "Qualifying", v: "3 of last 6 months", d: "Keep paying regularly or cover stops after 3 months." },
      ]
    : [
        { t: "OPD", v: "रु. २५,००० / वर्ष", d: "वैदेशिक रोजगार योजनाको सीमा (औपचारिक क्षेत्रमा रु. २०,०००)।" },
        { t: "भर्ना उपचार", v: "रु. १,००,००० / वर्ष", d: "परिवार जम्मा — तपाईं, पति/पत्नी र १८ वर्षसम्मका छोराछोरी।" },
        { t: "सह-भुक्तानी", v: "२०%", d: "हरेक दाबीको; कोषले ८०% तिर्छ।" },
        { t: "योग्यता", v: "६ महिनामा ३ महिना", d: "नियमित तिर्नुहोस् — रोकिए ३ महिनापछि सुविधा रोकिन्छ।" },
      ];

  const returnFacts = isEn
    ? [
        "Your SSN (11 digits) stays the same for life — a new employer in Nepal contributes to the same number; if you start a business, switch to the self-employed scheme.",
        "The 13.85% old-age share keeps growing. Pension needs age 60 and 180 months of contributions: (deposits + returns) ÷ 160 = lifelong monthly pension.",
        "Fewer than 180 months at 60? You choose: lump sum, or the ÷160 monthly pension. If a contributor dies before 60, heirs receive deposits + returns as a lump sum.",
        "Treatment cover lasts 3 months after your last contribution — resume paying soon after you land.",
      ]
    : [
        "तपाईंको SSN (११ अङ्क) जीवनभर उही रहन्छ — नेपालमा नयाँ रोजगारदाताले त्यही नम्बरमा योगदान गर्छ; व्यवसाय गरे स्वरोजगार योजनामा सर्नुहोस्।",
        "१३.८५% को वृद्ध अवस्था रकम बढिरहन्छ। पेन्सनका लागि ६० वर्ष उमेर र १८० महिना योगदान चाहिन्छ: (जम्मा + प्रतिफल) ÷ १६० = आजीवन मासिक पेन्सन।",
        "६० वर्षमा १८० महिना नपुगे? विकल्प तपाईंको: एकमुष्ट लिने वा ÷१६० को मासिक पेन्सन। ६० अघि मृत्यु भए हकवालाले जम्मा + प्रतिफल एकमुष्ट पाउँछन्।",
        "अन्तिम योगदानपछि ३ महिनासम्म उपचार सुविधा रहन्छ — फर्किएपछि चाँडै योगदान निरन्तर गर्नुहोस्।",
      ];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        tone="primary"
        icon="plane"
        eyebrow={isEn ? "Migrant worker hub" : "वैदेशिक रोजगार हब"}
        title={isEn ? `${formatLakh(ssfStats.contributors.foreign, true)} contributors are abroad — this page is for you` : `${formatLakh(ssfStats.contributors.foreign, false)} योगदानकर्ता विदेशमा — यो पृष्ठ तपाईंकै लागि`}
        lead={
          isEn
            ? `${foreignShare}% of everyone in the Social Security Fund works outside Nepal. Pick your country to see the monthly amount in your currency and the Fund's office hours in your time, learn how to pay from abroad, and how your family gets treatment in Nepal.`
            : `सामाजिक सुरक्षा कोषका ${n(foreignShare)}% योगदानकर्ता नेपालबाहिर काम गर्छन्। देश छानेर मासिक रकम आफ्नो मुद्रामा र कोषको कार्यालय समय आफ्नो समयमा हेर्नुहोस्, विदेशबाट कसरी तिर्ने जान्नुहोस्, र परिवारले नेपालमा उपचार कसरी पाउँछ बुझ्नुहोस्।`
        }
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: isEn ? "Foreign employment" : "वैदेशिक रोजगार" }]}
      >
        <div className="flex flex-wrap gap-2">
          <a href="#pay" className="btn-primary">
            <Icon name="send" size={16} />
            {isEn ? "How to pay" : "कसरी तिर्ने"}
          </a>
          <a href="#country" className="btn-outline">
            <Icon name="calculator" size={16} />
            {isEn ? "How much to pay" : "कति तिर्ने"}
          </a>
          <a href="#family" className="btn-ghost">
            <Icon name="family" size={16} />
            {isEn ? "Family treatment" : "परिवारको उपचार"}
          </a>
        </div>
      </PageHero>

      {/* Key numbers */}
      <section className="container-page py-10">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat value={formatLakh(ssfStats.contributors.foreign, isEn)} label={isEn ? "Migrant contributors" : "वैदेशिक रोजगार योगदानकर्ता"} hint={isEn ? `of ${formatLakh(ssfStats.contributors.total, true)} total` : `जम्मा ${formatLakh(ssfStats.contributors.total, false)} मध्ये`} />
          <Stat value={`${isEn ? "Rs" : "रु."} ${n(minRow.monthlyTotal.toLocaleString("en-IN"))}`} label={isEn ? "Minimum per month" : "न्यूनतम मासिक योगदान"} hint={isEn ? `${FOREIGN_EMPLOYMENT_RULE_V1.minPct}% of Rs ${MIN_BASIC_REMUNERATION.toLocaleString("en-IN")}` : `रु. ${n(MIN_BASIC_REMUNERATION.toLocaleString("en-IN"))} को ${n(FOREIGN_EMPLOYMENT_RULE_V1.minPct)}%`} tone="health" />
          <Stat value={isEn ? "Rs 25,000" : "रु. २५,०००"} label={isEn ? "Family OPD per year" : "परिवारको OPD, वर्षमा"} hint={isEn ? "+ Rs 1 lakh inpatient" : "+ भर्ना रु. १ लाख"} tone="neutral" />
          <Stat value={`${n(FOREIGN_EMPLOYMENT_RULE_V1.allocation.oldAge)}%`} label={isEn ? "Goes to your old age" : "तपाईंको वृद्ध अवस्थामा"} hint={isEn ? `${FOREIGN_EMPLOYMENT_RULE_V1.allocation.protection}% to protection schemes` : `${n(FOREIGN_EMPLOYMENT_RULE_V1.allocation.protection)}% सुरक्षा योजनामा`} />
        </div>
      </section>

      {/* Country panel */}
      <section id="country" className="scroll-mt-20 border-y border-ink-200 bg-ink-50">
        <div className="container-page py-14">
          <SectionHead
            eyebrow={isEn ? "Your country" : "तपाईंको देश"}
            title={isEn ? "How much, in your currency — and when Nepal is awake" : "कति तिर्ने, आफ्नो मुद्रामा — र नेपाल कहिले खुला हुन्छ"}
            lead={isEn ? "Saved in your browser only. Rates are indicative; your remittance company's rate is what counts." : "तपाईंको ब्राउजरमा मात्र सुरक्षित। दर सांकेतिक हो; रेमिट कम्पनीको दर नै लागू हुन्छ।"}
            href="/calculators/foreign-employment"
            linkLabel={isEn ? "Full calculator" : "पूरा क्याल्कुलेटर"}
          />
          <div className="mt-7">
            <CountryPanel />
          </div>
        </div>
      </section>

      {/* How to pay */}
      <section id="pay" className="container-page scroll-mt-20 py-14">
        <SectionHead
          eyebrow={isEn ? "Step by step" : "चरणबद्ध"}
          title={isEn ? "How to pay SSF from abroad" : "विदेशबाट कसरी तिर्ने"}
          href="/school/baideshik-rojgari/foreign-employment-guide"
          linkLabel={isEn ? "Full guide" : "पूरा guide"}
        />
        <ol className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paySteps.map((s, i) => (
            <li key={s.t} className="card flex gap-4 p-5">
              <div className="flex flex-col items-center gap-2">
                <span className="icon-tile">
                  <Icon name={s.icon} size={20} />
                </span>
                <span className="font-display text-xl font-bold text-ink-200">{n(i + 1)}</span>
              </div>
              <div>
                <p className="font-semibold text-ink-900">{s.t}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{s.d}</p>
              </div>
            </li>
          ))}
          <li className="flex">
            <a href={SOSYS_CONTRIBUTOR_LOGIN} target="_blank" rel="noopener noreferrer" className="card card-hover group flex w-full items-center gap-4 p-5">
              <span className="icon-tile">
                <Icon name="external" size={20} />
              </span>
              <span className="flex-1">
                <span className="block font-semibold text-ink-900 group-hover:text-primary-700">{isEn ? "Open SOSYS contributor login" : "SOSYS योगदानकर्ता login खोल्नुहोस्"}</span>
                <span className="block text-sm text-ink-500">sosys.ssf.gov.np</span>
              </span>
              <Icon name="arrowUpRight" size={18} className="text-ink-300" />
            </a>
          </li>
        </ol>
        <div className="mt-6">
          <Callout tone="info" title={isEn ? "Which banks and remittance companies?" : "कुन बैंक र रेमिट कम्पनी?"}>
            {isEn
              ? "The Fund publishes the current list of partner banks, remittance companies and the advance-payment concession for migrant workers on its own page — partners change, so we link rather than copy it. "
              : "साझेदार बैंक, रेमिट्यान्स कम्पनी र वैदेशिक रोजगार श्रमिकले पाउने अग्रिम भुक्तानी सहुलियतको हालको सूची कोषले आफ्नै पृष्ठमा राख्छ — साझेदार फेरिने हुँदा हामी नक्कल नगरी लिंक दिन्छौँ। "}
            <a href={OFFICIAL_CONCESSIONS_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
              {isEn ? "Official page on ssf.gov.np" : "ssf.gov.np को आधिकारिक पृष्ठ"}
            </a>
          </Callout>
        </div>
      </section>

      {/* Family treatment */}
      <section id="family" className="scroll-mt-20 border-y border-ink-200 bg-health-50/40">
        <div className="container-page py-14">
          <SectionHead
            eyebrow={isEn ? "While you are away" : "तपाईं विदेशमा हुँदा"}
            title={isEn ? "How your family gets treatment in Nepal" : "परिवारले नेपालमा उपचार कसरी पाउँछ"}
            lead={isEn ? "Spouse and children up to 18 are covered at the Fund's affiliated hospitals — cashless, with your 11-digit SSN." : "पति/पत्नी र १८ वर्षसम्मका छोराछोरीले कोषसँग आबद्ध अस्पतालमा तपाईंको ११ अङ्कको SSN देखाएर क्यासलेस उपचार पाउँछन्।"}
            href="/hospitals"
            linkLabel={isEn ? "All affiliated hospitals" : "सबै आबद्ध अस्पताल"}
          />
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {medicalFacts.map((f) => (
              <div key={f.t} className="card p-5">
                <p className="text-sm font-medium text-ink-500">{f.t}</p>
                <p className="mt-1 font-display text-2xl font-bold text-health-700">{f.v}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-500">{f.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 card p-5">
            <p className="text-sm font-semibold text-ink-900">{isEn ? "Find a hospital near your family" : "परिवार नजिकको अस्पताल खोज्नुहोस्"}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {PROVINCE_ORDER.map((p) => (
                <Link key={p} href={`/hospitals?province=${p}`} className="chip">
                  <Icon name="mapPin" size={14} className="text-health-600" />
                  {isEn ? PROVINCES[p].en : PROVINCES[p].short}
                </Link>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-500">
              {isEn
                ? "Accident treatment up to Rs 7 lakh. Workplace accidents must be reported to the Fund within 7 days. Keep contributions regular — cover stops 3 months after your last payment."
                : "दुर्घटना उपचार रु. ७ लाखसम्म। रोजगारीजन्य दुर्घटना ७ दिनभित्र कोषलाई खबर गर्नुपर्छ। योगदान नियमित राख्नुहोस् — अन्तिम भुक्तानीको ३ महिनापछि सुविधा रोकिन्छ।"}
            </p>
          </div>
        </div>
      </section>

      {/* Pre-departure checklist + returnee */}
      <section className="container-page py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <SectionHead
              eyebrow={isEn ? "Before you leave" : "जानुअघि"}
              title={isEn ? "Pre-departure checklist" : "जानुअघिको checklist"}
              lead={isEn ? "Have these ready when you take the labour permit." : "श्रम स्वीकृति लिँदा यी तयार राख्नुहोस्।"}
            />
            <ul className="card mt-6 divide-y divide-ink-100 p-5">
              {checklistItems.map((it) => (
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
              <Link href="/checklists/foreign-employment-registration" className="btn-outline btn-sm">
                <Icon name="file" size={14} />
                {isEn ? "Tick & print the checklist" : "Checklist टिक गर्नुहोस् / print"}
              </Link>
              <Link href="/checklists/kyc-verification" className="btn-ghost btn-sm">
                {isEn ? "KYC checklist" : "KYC checklist"}
                <Icon name="arrowRight" size={14} />
              </Link>
            </div>
            <p className="mt-3 text-xs text-ink-400">
              {isEn ? "Most common mistake: leaving without knowing your SSF ID/password — recovery from abroad takes extra steps." : "सबैभन्दा सामान्य गल्ती: SSF ID/password नबुझी विदेश जानु — विदेशबाट रिकभरी गर्न थप प्रक्रिया चाहिन्छ।"}
            </p>
          </div>
          <div>
            <SectionHead
              eyebrow={isEn ? "When you come back" : "फर्किएपछि"}
              title={isEn ? "What happens to the money" : "पैसाको के हुन्छ"}
              href="/school/pension-ra-retirement/pension-ra-retirement-guide"
              linkLabel={isEn ? "Pension guide" : "पेन्सन guide"}
            />
            <ul className="mt-6 space-y-3">
              {returnFacts.map((f) => (
                <li key={f} className="card flex gap-3 p-4 text-sm leading-relaxed text-ink-700">
                  <Icon name="trending" size={18} className="mt-0.5 shrink-0 text-primary-600" />
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink-400">
              {isEn ? "Source: Scheme Operation Procedure 2075 (5th Amendment) ch. 5; Foreign Employment Procedure 2079. Exact amounts are as set by the Fund." : "स्रोत: योजना सञ्चालन कार्यविधि २०७५ (५औँ संशोधन) परिच्छेद ५; वैदेशिक रोजगार कार्यविधि २०७९। रकम कोषले तोकेबमोजिम।"}
            </p>
          </div>
        </div>
      </section>

      {/* Videos */}
      {vids.length > 0 && (
        <section className="border-t border-ink-200 bg-ink-50">
          <div className="container-page py-14">
            <SectionHead eyebrow={isEn ? "Watch" : "भिडियो"} title={isEn ? "Explained in Nepali" : "नेपालीमा बुझ्नुहोस्"} lead={isEn ? "Digital Solution's SSF videos for migrant workers." : "वैदेशिक रोजगारीमा हुनेका लागि Digital Solution का SSF भिडियो।"} />
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {vids.slice(0, 6).map((v) => (
                <YouTubeEmbed key={v.youtubeId} id={v.youtubeId} title={v.title} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ + desk */}
      <section className="container-page py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHead eyebrow={isEn ? "FAQ" : "प्रश्नोत्तर"} title={isEn ? "Common questions from abroad" : "विदेशबाट धेरै सोधिने प्रश्न"} href="/faq" linkLabel={isEn ? "All FAQs" : "सबै प्रश्न"} />
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
          <div className="space-y-4">
            <SectionHead eyebrow={isEn ? "The Fund's migrant desk" : "कोषको वैदेशिक रोजगार डेस्क"} title={isEn ? "Contact SSF from abroad" : "विदेशबाट SSF लाई सम्पर्क"} />
            <div className="card p-5">
              <p className="text-sm text-ink-500">{isEn ? "WhatsApp / Viber (SSF migrant worker desk)" : "WhatsApp / Viber (SSF वैदेशिक रोजगार डेस्क)"}</p>
              <a href={`https://wa.me/977${deskPhone}`} target="_blank" rel="noopener noreferrer" className="mt-1 block font-display text-3xl font-bold text-primary-700">
                +977 {deskPhone}
              </a>
              <a href={`mailto:${deskEmail}`} className="text-sm text-ink-600 hover:text-primary-700">
                {deskEmail}
              </a>
              <p className="mt-3 text-xs text-ink-400">
                {isEn ? "Official Fund desk. Office hours are shown above in your local time." : "कोषको आधिकारिक डेस्क। कार्यालय समय माथि तपाईंको स्थानीय समयमा देखिन्छ।"}
              </p>
            </div>
            <LinkCard
              href={OFFICIAL_CONCESSIONS_URL}
              external
              icon="external"
              title={isEn ? "Concessions & payment arrangements (ssf.gov.np)" : "सहुलियत र भुक्तानी व्यवस्था (ssf.gov.np)"}
              description={isEn ? "The Fund's own page for foreign-employment contributors." : "वैदेशिक रोजगार योगदानकर्ताका लागि कोषको आफ्नै पृष्ठ।"}
            />
            <ForeignCta />
          </div>
        </div>
      </section>
    </div>
  );
}
