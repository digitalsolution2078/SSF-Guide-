import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { pageSeo } from "@/lib/seo";
import {
  loanProducts,
  otherLoanFacilities,
  LOANS_SYNCED_AT,
  LOAN_DESK_PHONE,
  LOAN_DESK_EMAIL,
  LOAN_INFO_URL,
  LOAN_FORM_URL,
} from "@/content/loans";
import { toNe } from "@/content/ssf-stats";
import { LoanEligibilityCalculator } from "@/components/loan-eligibility-calculator";
import { LoanCalculator } from "@/components/loan-calculator";
import { Icon, type IconName } from "@/components/icons";
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
    path: "/loans",
    title: isEn
      ? "SSF Loans — home loan up to Rs 1.5 crore at 5.85–6%, education & special loans"
      : "SSF सापटी — रु. १.५ करोडसम्म घर सापटी ५.८५–६% ब्याजमा, शैक्षिक र विशेष सापटी",
    description: isEn
      ? "Everything about Social Security Fund contributor loans: home loan (Rs 1.5 crore, 18 months' contribution, 5.85–6%), education loan (Rs 35 lakh), collateral-free special loan (80% of retirement balance) — eligibility calculator, EMI, documents and steps."
      : "सामाजिक सुरक्षा कोषका सबै सापटी एकै ठाउँमा: घर सापटी (रु. १.५ करोड, १८ महिना योगदान, ५.८५–६%), शैक्षिक सापटी (रु. ३५ लाख), धितो नचाहिने विशेष सापटी (अवकाश रकमको ८०%) — योग्यता क्याल्कुलेटर, EMI, कागजात र प्रक्रिया।",
  });
}

const PRODUCT_ICON: Record<string, IconName> = { home: "home", education: "grad", special: "sparkles" };

export default async function LoansPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  const n = (s: string) => (isEn ? s : toNe(s));

  const faq = [
    {
      q: isEn ? "Is the SSF home loan cheaper than a bank?" : "SSF को घर सापटी बैंकभन्दा सस्तो छ?",
      a: isEn
        ? "Yes, by a wide margin today: 5.85% (buy/build) and 6% (land) p.a. against roughly 8–11% at commercial banks, with only a 0.15% management fee. The trade-off is strict caps (15 years' salary, 60% EMI rule) and slower processing than a bank."
        : "हो, अहिले धेरै अन्तर छ: वार्षिक ५.८५% (खरिद/निर्माण) र ६% (जग्गा) — वाणिज्य बैंकको करिब ८–११% को तुलनामा, व्यवस्थापन शुल्क ०.१५% मात्र। सीमा भने कडा छ (१५ वर्षको तलब, ६०% किस्ता नियम) र प्रक्रिया बैंकभन्दा ढिलो हुन सक्छ।",
    },
    {
      q: isEn ? "I have only 20 months of contribution — what can I get?" : "मेरो २० महिना मात्र योगदान छ — के पाइन्छ?",
      a: isEn
        ? "The home loan (18-month rule) — if you have at least 2 years of service left and collateral. Education and special loans need 36 months."
        : "घर सापटी (१८ महिनाको नियम) — अवकाश हुन २ वर्ष बाँकी र धितो भए। शैक्षिक र विशेष सापटीका लागि ३६ महिना चाहिन्छ।",
    },
    {
      q: isEn ? "How fast is the special loan?" : "विशेष सापटी कति छिटो आउँछ?",
      a: isEn
        ? "It is approved inside the SSF app without collateral or office visits; contributors commonly report the money in their bank within 24 hours."
        : "SSF App भित्रै धितो र कार्यालय नगई स्वीकृत हुन्छ; योगदानकर्ताहरू २४ घण्टाभित्रै बैंकमा रकम आएको बताउँछन्।",
    },
    {
      q: isEn ? "What happens to my pension if I take a loan?" : "सापटी लिए पेन्सनमा असर पर्छ?",
      a: isEn
        ? "Home and education loans are collateral loans and do not touch your pension. The special loan is drawn against your Retirement Amount (gratuity side); the Pension Amount (20%) stays untouched unless you were contributing before Asar 2078 and choose to transfer up to 98% of it."
        : "घर र शैक्षिक सापटी धितोमा आधारित हुन्छन् — पेन्सन छुँदैनन्। विशेष सापटी अवकाश रकम (उपदान तर्फ) बाट लिइन्छ; Pension Amount (२०%) जस्ताको तस्तै रहन्छ — २०७८ असारअघिदेखि योगदान गर्नेले चाहेमा मात्र ९८% सम्म सार्न सक्छन्।",
    },
  ];

  return (
    <div>
      <PageHero
        tone="primary"
        icon="coins"
        eyebrow={isEn ? `Contributor loans · updated ${LOANS_SYNCED_AT}` : `योगदानकर्ता सापटी · अद्यावधिक ${toNe(LOANS_SYNCED_AT)}`}
        title={isEn ? "SSF loans — borrow from your own fund" : "SSF सापटी — आफ्नै कोषबाट ऋण"}
        lead={
          isEn
            ? "Three loans every contributor should know: a home loan up to Rs 1.5 crore at 5.85–6%, an education loan up to Rs 35 lakh, and a collateral-free special loan paid within a day from the app. Check what you qualify for, estimate the EMI, and see exactly which papers to carry."
            : "हरेक योगदानकर्ताले जान्नैपर्ने ३ सापटी: ५.८५–६% ब्याजमा रु. १.५ करोडसम्म घर सापटी, रु. ३५ लाखसम्म शैक्षिक सापटी, र App बाटै एक दिनमा आउने धितो नचाहिने विशेष सापटी। आफू के योग्य, किस्ता कति र कुन कागजात चाहिन्छ — यहीँ हेर्नुहोस्।"
        }
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: isEn ? "Loans" : "सापटी" }]}
      >
        <div className="flex flex-wrap gap-2">
          <a href="#check" className="btn-primary">
            <Icon name="checkCircle" size={16} />
            {isEn ? "Check my eligibility" : "मेरो योग्यता जाँच्नुहोस्"}
          </a>
          <a href="#emi" className="btn-outline">
            <Icon name="calculator" size={16} />
            {isEn ? "EMI calculator" : "EMI क्याल्कुलेटर"}
          </a>
          <a href="#documents" className="btn-ghost">
            {isEn ? "Documents & steps" : "कागजात र प्रक्रिया"}
          </a>
        </div>
      </PageHero>

      {/* Key numbers */}
      <section className="container-page py-10">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat value={isEn ? "Rs 1.5 cr" : "रु. १.५ करोड"} label={isEn ? "Home loan ceiling" : "घर सापटी अधिकतम"} hint={isEn ? "up to 20 years" : "२० वर्षसम्म"} />
          <Stat value={n("5.85%")} label={isEn ? "Buy / build a house" : "घर खरिद / निर्माण ब्याज"} hint={isEn ? "6% for land purchase" : "जग्गा खरिदमा ६%"} tone="health" />
          <Stat value={isEn ? "18 mo" : "१८ महिना"} label={isEn ? "Contribution for a home loan" : "घर सापटीका लागि योगदान"} hint={isEn ? "36 months for education / special" : "शैक्षिक/विशेषका लागि ३६ महिना"} tone="neutral" />
          <Stat value={n("80%")} label={isEn ? "Special loan, no collateral" : "विशेष सापटी, धितो बिना"} hint={isEn ? "of your Retirement Amount" : "अवकाश रकमको"} />
        </div>
      </section>

      {/* Products */}
      <section className="border-y border-ink-200 bg-ink-50">
        <div className="container-page py-14">
          <SectionHead
            eyebrow={isEn ? "The three loans" : "तीन सापटी"}
            title={isEn ? "Which loan fits your need?" : "तपाईंको आवश्यकताअनुसार कुन सापटी?"}
          />
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {loanProducts.map((p) => (
              <a key={p.key} href={`#${p.key}`} className="card card-hover group flex flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="icon-tile">
                    <Icon name={PRODUCT_ICON[p.key]} size={20} />
                  </span>
                  <span className={p.collateral ? "badge-neutral" : "badge-health"}>
                    {p.collateral ? (isEn ? "Collateral" : "धितो चाहिने") : isEn ? "No collateral" : "धितो नचाहिने"}
                  </span>
                </div>
                <p className="mt-4 font-display text-xl font-bold text-ink-900 group-hover:text-primary-700">{isEn ? p.nameEn : p.nameNe}</p>
                <p className="mt-1 text-sm text-ink-500">{isEn ? p.taglineEn : p.taglineNe}</p>
                <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                  <dt className="text-ink-500">{isEn ? "Maximum" : "अधिकतम"}</dt>
                  <dd className="font-semibold text-ink-900">{isEn ? p.ceilingLabelEn : p.ceilingLabelNe}</dd>
                  <dt className="text-ink-500">{isEn ? "Contribution" : "योगदान"}</dt>
                  <dd className="font-semibold text-ink-900">{isEn ? `${p.minMonths} months` : `${toNe(String(p.minMonths))} महिना`}</dd>
                  <dt className="text-ink-500">{isEn ? "Interest" : "ब्याज"}</dt>
                  <dd className="font-semibold text-ink-900">
                    {p.rates.length ? p.rates.map((r) => `${n(String(r.pct))}%`).join(" / ") : isEn ? "Set by Fund" : "कोषले तोक्ने"}
                  </dd>
                  {p.maxTermYears && (
                    <>
                      <dt className="text-ink-500">{isEn ? "Term" : "अवधि"}</dt>
                      <dd className="font-semibold text-ink-900">{isEn ? `up to ${p.maxTermYears} yrs` : `${toNe(String(p.maxTermYears))} वर्षसम्म`}</dd>
                    </>
                  )}
                </dl>
                <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-primary-700">
                  {isEn ? "Details" : "विवरण"} <Icon name="arrowRight" size={14} />
                </span>
              </a>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            {otherLoanFacilities.map((o) => (
              <div key={o.nameEn} className="flex gap-3 rounded-2xl border border-ink-200 bg-white p-4">
                <Icon name="info" size={18} className="mt-0.5 shrink-0 text-primary-500" />
                <div>
                  <p className="text-sm font-semibold text-ink-900">{isEn ? o.nameEn : o.nameNe}</p>
                  <p className="mt-1 text-sm text-ink-500">{isEn ? o.descEn : o.descNe}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility calculator */}
      <section id="check" className="container-page scroll-mt-20 py-14">
        <SectionHead
          eyebrow={isEn ? "Calculator 1" : "क्याल्कुलेटर १"}
          title={isEn ? "What can I borrow today?" : "म आज कति सापटी लिन सक्छु?"}
          lead={isEn ? "Enter three numbers — salary, age, months contributed — and see every loan's answer at once." : "तीन अङ्क राख्नुहोस् — तलब, उमेर, योगदान महिना — र चारै सापटीको जवाफ एकैपटक हेर्नुहोस्।"}
        />
        <div className="mt-7">
          <LoanEligibilityCalculator />
        </div>
      </section>

      {/* EMI */}
      <section id="emi" className="scroll-mt-20 border-y border-ink-200 bg-ink-50">
        <div className="container-page py-14">
          <SectionHead
            eyebrow={isEn ? "Calculator 2" : "क्याल्कुलेटर २"}
            title={isEn ? "Monthly instalment (EMI)" : "मासिक किस्ता (EMI)"}
            lead={isEn ? "Presets use the Fund's published rates; drag the sliders for your own scenario." : "Presets मा कोषकै प्रकाशित ब्याजदर छ; आफ्नो अवस्थाका लागि slider चलाउनुहोस्।"}
          />
          <div className="mx-auto mt-7 max-w-3xl">
            <LoanCalculator />
          </div>
        </div>
      </section>

      {/* Product details */}
      <section id="documents" className="container-page scroll-mt-20 py-14">
        <SectionHead
          eyebrow={isEn ? "Rules, steps & documents" : "नियम, प्रक्रिया र कागजात"}
          title={isEn ? "Each loan in detail" : "हरेक सापटी विस्तारमा"}
          lead={isEn ? "Straight from the Fund's notices — nothing added, nothing left out." : "कोषकै सूचनाबाट — केही थपिएको छैन, केही छुटेको छैन।"}
        />
        <div className="mt-8 space-y-6">
          {loanProducts.map((p) => (
            <article key={p.key} id={p.key} className="card scroll-mt-20 overflow-hidden">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-200 bg-ink-50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="icon-tile">
                    <Icon name={PRODUCT_ICON[p.key]} size={20} />
                  </span>
                  <div>
                    <h3 className="text-xl">{isEn ? p.nameEn : p.nameNe}</h3>
                    <p className="text-xs text-ink-500">
                      {isEn ? "Fund notice" : "कोषको सूचना"} {p.noticeDateNe}
                    </p>
                  </div>
                </div>
                <a href={p.noticeUrl} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm">
                  <Icon name="file" size={14} />
                  {isEn ? "Official PDF" : "आधिकारिक PDF"}
                </a>
              </header>
              <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-2 md:p-6">
                <Block title={isEn ? "Who & what for" : "को र केका लागि"} icon="users" items={isEn ? p.purposesEn : p.purposesNe} />
                <Block title={isEn ? "How much (lowest of)" : "कति (जुन कम)"} icon="percent" items={isEn ? p.limitsEn : p.limitsNe} />
                <Block
                  title={isEn ? "Interest & fees" : "ब्याज र शुल्क"}
                  icon="coins"
                  items={[
                    ...p.rates.map((r) => `${isEn ? r.labelEn : r.labelNe}: ${n(String(r.pct))}% ${isEn ? "p.a." : "वार्षिक"}`),
                    ...(p.ratesNoteNe ? [isEn ? p.ratesNoteEn! : p.ratesNoteNe] : []),
                    ...(isEn ? p.feesEn : p.feesNe),
                  ]}
                />
                <Block title={isEn ? "Conditions" : "शर्त"} icon="shield" items={[
                  isEn ? `At least ${p.minMonths} months of regular contribution` : `कम्तीमा ${toNe(String(p.minMonths))} महिना नियमित योगदान`,
                  isEn ? "At least 2 years of service left before retirement" : "अवकाश हुन कम्तीमा २ वर्ष सेवा अवधि बाँकी",
                  ...(isEn ? p.notesEn : p.notesNe),
                ]} />
                <div className="md:col-span-2">
                  <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                    <Icon name="list" size={16} className="text-primary-600" />
                    {isEn ? "Step by step" : "चरणबद्ध प्रक्रिया"}
                  </p>
                  <ol className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                    {(isEn ? p.stepsEn : p.stepsNe).map((s, i) => (
                      <li key={s} className="flex gap-3 rounded-xl border border-ink-200 bg-white p-3 text-sm text-ink-700">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 font-display text-xs font-bold text-primary-700">{n(String(i + 1))}</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
                <details className="group md:col-span-2">
                  <summary className="no-marker flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink-900">
                    <Icon name="chevronRight" size={16} className="text-primary-600 transition group-open:rotate-90" />
                    {isEn ? `Documents to attach (${p.documentsEn.length})` : `संलग्न गर्नुपर्ने कागजात (${toNe(String(p.documentsNe.length))})`}
                  </summary>
                  <ul className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                    {(isEn ? p.documentsEn : p.documentsNe).map((d) => (
                      <li key={d} className="flex gap-2 text-sm text-ink-700">
                        <Icon name="check" size={16} className="mt-0.5 shrink-0 text-health-600" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ + official */}
      <section className="border-t border-ink-200 bg-ink-50">
        <div className="container-page py-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <SectionHead eyebrow={isEn ? "FAQ" : "प्रश्नोत्तर"} title={isEn ? "Common questions" : "धेरै सोधिने प्रश्न"} href="/school/pension-ra-retirement/sapati-loan-guide" linkLabel={isEn ? "Full loan guide" : "पूरा सापटी guide"} />
              <div className="mt-6 space-y-3">
                {faq.map((f) => (
                  <details key={f.q} className="card group p-4">
                    <summary className="no-marker flex cursor-pointer items-start gap-3 font-semibold text-ink-900">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-100 font-display text-xs font-bold text-primary-700">?</span>
                      <span className="flex-1">{f.q}</span>
                      <Icon name="chevronDown" size={16} className="mt-1 text-ink-400 transition group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 pl-9 text-sm leading-relaxed text-ink-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
            <div>
              <SectionHead eyebrow={isEn ? "Official" : "आधिकारिक"} title={isEn ? "Forms, notices & loan desk" : "फारम, सूचना र सापटी डेस्क"} />
              <ul className="mt-6 space-y-3">
                {[
                  { href: LOAN_FORM_URL, t: isEn ? "Loan demand form (Annex 1) — PDF" : "सापटी माग फारम (अनुसूची १) — PDF", d: isEn ? "Get it recommended by your employer." : "रोजगारदाताबाट सिफारिस गराउनुहोस्।" },
                  { href: LOAN_INFO_URL, t: isEn ? "Fund's loan information page" : "कोषको सापटी जानकारी पृष्ठ", d: isEn ? "Latest notices for all three loans." : "तीनै सापटीका पछिल्ला सूचना।" },
                  { href: "https://sosys.ssf.gov.np/Modules/REGISTRATION/ContributorLogin.aspx", t: isEn ? "Contributor login (SOSYS)" : "योगदानकर्ता लगइन (SOSYS)", d: isEn ? "Check months contributed and retirement balance." : "योगदान महिना र अवकाश रकम जाँच्नुहोस्।" },
                ].map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="card card-hover group flex items-center gap-4 p-4">
                      <span className="icon-tile">
                        <Icon name="external" size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-ink-900 group-hover:text-primary-700">{l.t}</span>
                        <span className="block text-sm text-ink-500">{l.d}</span>
                      </span>
                      <Icon name="arrowUpRight" size={18} className="text-ink-300" />
                    </a>
                  </li>
                ))}
              </ul>
              <div className="card mt-4 p-5">
                <p className="text-sm text-ink-500">{isEn ? "SSF loan desk (head office)" : "SSF सापटी डेस्क (केन्द्रीय कार्यालय)"}</p>
                <a href={`tel:${LOAN_DESK_PHONE.replace(/-/g, "")}`} className="mt-1 block font-display text-3xl font-bold text-primary-700">
                  {LOAN_DESK_PHONE}
                </a>
                <a href={`mailto:${LOAN_DESK_EMAIL}`} className="text-sm text-ink-600 hover:text-primary-700">{LOAN_DESK_EMAIL}</a>
              </div>
              <div className="mt-4">
                <Callout tone="info">
                  {isEn
                    ? "Digital Solution can prepare your loan file (form, collateral papers, SOSYS checks) — an independent service, not the Fund."
                    : "Digital Solution ले तपाईंको सापटी फाइल (फारम, धितो कागजात, SOSYS जाँच) तयार गरिदिन्छ — स्वतन्त्र सेवा, कोष होइन।"}{" "}
                  <Link href="/request" className="font-semibold underline">
                    {isEn ? "Request assistance" : "सहायता अनुरोध"}
                  </Link>
                </Callout>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Block({ title, icon, items }: { title: string; icon: IconName; items: string[] }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
        <Icon name={icon} size={16} className="text-primary-600" />
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((it) => (
          <li key={it} className="flex gap-2 text-sm text-ink-700">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
