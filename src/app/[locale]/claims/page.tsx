import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { pageSeo, absoluteUrl } from "@/lib/seo";
import { claimTypes, rejectionReasons, APPEAL_NOTE } from "@/content/claims";
import { toNe } from "@/content/ssf-stats";
import { ClaimWizard } from "@/components/claim-wizard";
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
    path: "/claims",
    title: isEn
      ? "SSF Claim Wizard — medical, maternity, accident, pension: eligibility, documents & where to go"
      : "SSF दाबी Wizard — उपचार, मातृत्व, दुर्घटना, पेन्सन: योग्यता, कागजात र कहाँ जाने",
    description: isEn
      ? "Pick what happened and get your SSF claim plan in 3 steps: eligibility verdict, limits, exactly where to file, numbered steps, a printable document checklist and the official forms. Plus: why claims get rejected and how to fix each reason."
      : "के भयो रोज्नुहोस् र ३ चरणमा SSF दाबी योजना पाउनुहोस्: योग्यता, सीमा, ठ्याक्कै कहाँ पेश गर्ने, चरणबद्ध प्रक्रिया, print गर्न मिल्ने कागजात checklist र आधिकारिक फारम। साथै: दाबी किन अस्वीकृत हुन्छ र हरेक कारणको समाधान।",
  });
}

export default async function ClaimsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ type?: string }>;
}) {
  const { locale } = await params;
  const sp = searchParams ? await searchParams : {};
  const isEn = locale === "en";
  const n = (s: string) => (isEn ? s : toNe(s));
  const reasons = rejectionReasons();

  // FAQPage JSON-LD built from four rejection reasons (bilingual page, one language per locale).
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: reasons.slice(0, 4).map((r) => ({
      "@type": "Question",
      name: isEn ? `SSF claim rejected: ${r.reason.en} — what to do?` : `SSF दाबी अस्वीकृत: ${r.reason.ne} — के गर्ने?`,
      acceptedAnswer: { "@type": "Answer", text: isEn ? r.fix.en : r.fix.ne },
    })),
    url: absoluteUrl(locale, "/claims"),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <PageHero
        tone="primary"
        icon="shield"
        eyebrow={isEn ? "Claim Wizard" : "दाबी Wizard"}
        title={isEn ? "What happened? Let's build your SSF claim" : "के भयो? तपाईंको SSF दाबी योजना बनाऔँ"}
        lead={
          isEn
            ? "Medical, maternity, accident, disability, dependent family, retirement or pension — answer 2–3 questions and get the eligibility verdict, what you get, exactly where to go, the steps, a tickable document checklist and the official forms. No personal details are collected."
            : "उपचार, मातृत्व, दुर्घटना, अशक्तता, आश्रित परिवार, अवकाश वा पेन्सन — २–३ प्रश्नको उत्तर दिनुहोस् र योग्यता, के पाइन्छ, ठ्याक्कै कहाँ जाने, प्रक्रिया, टिक लगाउन मिल्ने कागजात checklist र आधिकारिक फारम पाउनुहोस्। कुनै व्यक्तिगत विवरण मागिँदैन।"
        }
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: isEn ? "Claims" : "दाबी" }]}
      >
        <div className="flex flex-wrap gap-2 print:hidden">
          <a href="#wizard" className="btn-primary">
            <Icon name="checkCircle" size={16} />
            {isEn ? "Start the wizard" : "Wizard सुरु गर्नुहोस्"}
          </a>
          <a href="#rejected" className="btn-outline">
            <Icon name="alert" size={16} />
            {isEn ? "Claim rejected?" : "दाबी अस्वीकृत भयो?"}
          </a>
        </div>
      </PageHero>

      {/* Key numbers */}
      <section className="container-page py-10 print:hidden">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat value={isEn ? "3 of 6" : "६ मा ३"} label={isEn ? "Months for medical claims" : "उपचार दाबीका लागि महिना"} hint={isEn ? "regular contributions" : "नियमित योगदान"} />
          <Stat value={n("20%")} label={isEn ? "Co-payment on every claim" : "प्रत्येक दाबीमा सह-भुक्तानी"} hint={isEn ? "OPD Rs 20k · inpatient Rs 1 lakh/yr" : "OPD रु. २० हजार · भर्ना रु. १ लाख/वर्ष"} tone="health" />
          <Stat value={isEn ? "7 days" : "७ दिन"} label={isEn ? "To report a workplace accident" : "रोजगारीजन्य दुर्घटना जानकारी"} hint={isEn ? "else max Rs 7 lakh at non-listed hospital" : "नत्र सम्झौता नभएको अस्पतालमा रु. ७ लाख मात्र"} tone="neutral" />
          <Stat value={isEn ? "35 days" : "३५ दिन"} label={isEn ? "To appeal a rejection" : "अस्वीकृतिमा पुनरावेदन"} hint={isEn ? "Labour Court, Act §52" : "श्रम अदालत, ऐन दफा ५२"} />
        </div>
      </section>

      {/* Wizard */}
      <section id="wizard" className="scroll-mt-20 border-y border-ink-200 bg-ink-50 print:border-0 print:bg-white">
        <div className="container-narrow py-12">
          <ClaimWizard initialType={sp.type} />
        </div>
      </section>

      {/* All claim types at a glance */}
      <section className="container-page py-14 print:hidden">
        <SectionHead
          eyebrow={isEn ? "At a glance" : "एकै नजरमा"}
          title={isEn ? "Every SSF claim and its qualifying period" : "हरेक SSF दाबी र त्यसको योग्यता अवधि"}
          lead={isEn ? "From the Scheme Operation Procedure 2075 (5th amendment). Loans are separate — see /loans." : "योजना सञ्चालन कार्यविधि २०७५ (५औँ संशोधन) बाट। सापटी छुट्टै हो — /loans हेर्नुहोस्।"}
        />
        <div className="mt-8 overflow-x-auto rounded-2xl border border-ink-200">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-ink-50 text-ink-700">
                {[isEn ? "Claim" : "दाबी", isEn ? "Who" : "को", isEn ? "Qualifying period" : "योग्यता अवधि", isEn ? "Where" : "कहाँ"].map((h) => (
                  <th key={h} className="border-b border-ink-200 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {claimTypes.map((c) => (
                <tr key={c.key} className="border-b border-ink-100 last:border-b-0">
                  <td className="px-4 py-2.5 align-top">
                    <Link href={`/claims?type=${c.key}#wizard`} className="flex items-center gap-2 font-semibold text-ink-900 hover:text-primary-700">
                      <Icon name={c.icon} size={16} className="shrink-0 text-primary-600" />
                      {isEn ? c.nameEn : c.nameNe}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 align-top text-ink-700">{isEn ? c.whoEn : c.whoNe}</td>
                  <td className="px-4 py-2.5 align-top text-ink-700">{isEn ? c.qualifyingEn : c.qualifyingNe}</td>
                  <td className="px-4 py-2.5 align-top text-ink-700">
                    {c.where.map((w) => (w === "hospital-desk" ? (isEn ? "Hospital SSF desk" : "अस्पताल SSF डेस्क") : w === "sosys" ? "SOSYS/App" : isEn ? "SSF office" : "SSF कार्यालय")).join(" · ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Rejected? diagnostic */}
      <section id="rejected" className="scroll-mt-20 border-t border-ink-200 bg-ink-50 print:hidden">
        <div className="container-page py-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <SectionHead
                eyebrow={isEn ? "Diagnostic" : "निदान"}
                title={isEn ? "Claim rejected? Find your reason and the fix" : "दाबी अस्वीकृत भयो? कारण र समाधान खोज्नुहोस्"}
                lead={isEn ? "Most rejections are fixable. Read the exact reason in SOSYS, match it below, fix and resubmit — there is no restriction on resubmitting." : "अधिकांश अस्वीकृति सच्याउन मिल्छ। SOSYS मा exact कारण पढ्नुहोस्, तल मिलाउनुहोस्, सच्याएर पुनः पेश गर्नुहोस् — पुनः पेश गर्न रोक छैन।"}
                href="/school/claims-problems-solutions/claim-reject-samadhan"
                linkLabel={isEn ? "Full guide" : "पूरा guide"}
              />
              <div className="mt-6 space-y-2.5">
                {reasons.map((r, i) => (
                  <details key={r.reason.ne} className="card group p-4">
                    <summary className="no-marker flex cursor-pointer items-start gap-3 font-semibold text-ink-900">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-100 font-display text-xs font-bold text-amber-800">{n(String(i + 1))}</span>
                      <span className="flex-1">{isEn ? r.reason.en : r.reason.ne}</span>
                      <Icon name="chevronDown" size={16} className="mt-1 text-ink-400 transition group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 flex gap-2 pl-9 text-sm leading-relaxed text-ink-700">
                      <Icon name="checkCircle" size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                      <span>
                        <span className="font-semibold text-ink-900">{isEn ? "Fix: " : "समाधान: "}</span>
                        {isEn ? r.fix.en : r.fix.ne}
                      </span>
                    </p>
                  </details>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Callout tone="warn" title={isEn ? "Appeal — 35 days" : "पुनरावेदन — ३५ दिन"}>
                {isEn ? APPEAL_NOTE.en : APPEAL_NOTE.ne}
              </Callout>
              <Callout tone="info" title={isEn ? "Resubmission kit" : "पुनः पेश गर्दा तयार राख्ने"}>
                <ul className="list-disc space-y-1 pl-4">
                  {(isEn
                    ? ["The rejection notice/screenshot", "Original bills, prescriptions, discharge summary", "Proof of your contribution history", "The correct schedule form (Downloads page)", "Proof of corrected KYC/profile (if applicable)"]
                    : ["Rejection notice/screenshot", "सक्कल बिल, प्रेस्क्रिप्सन, discharge summary", "Contribution history को प्रमाण", "सही अनुसूची फाराम (Downloads page बाट)", "KYC/profile सच्याइएको प्रमाण (लागू भए)"]
                  ).map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href="/downloads" className="btn-outline btn-sm">
                    <Icon name="download" size={14} />
                    {isEn ? "Official forms" : "आधिकारिक फारम"}
                  </Link>
                  <Link href="/services/kyc-verification" className="btn-outline btn-sm">
                    <Icon name="user" size={14} />
                    KYC
                  </Link>
                </div>
              </Callout>
              <Callout tone="health">
                {isEn
                  ? "Claiming with false details is an offence — a fine equal to the amount involved or even imprisonment (Act §47). Always submit truthful information only."
                  : "झुटा विवरणले दाबी गर्नु कसूर हो — बिगो बमोजिम जरिवाना वा कैदसम्म हुनसक्छ (ऐन दफा ४७)। सधैँ सत्य विवरण मात्र पेश गर्नुहोस्।"}
              </Callout>
              <div className="card p-5">
                <p className="text-sm font-semibold text-ink-900">{isEn ? "Need a hand with a rejected claim?" : "अस्वीकृत दाबीमा सहयोग चाहियो?"}</p>
                <p className="mt-1 text-sm text-ink-500">
                  {isEn ? "Digital Solution reviews the rejection reason and documents — an independent service, not the Fund." : "Digital Solution ले अस्वीकृतिको कारण र कागजात जाँच गरिदिन्छ — स्वतन्त्र सेवा, कोष होइन।"}
                </p>
                <Link href="/request" className="btn-accent btn-sm mt-3">
                  <Icon name="chat" size={14} />
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
