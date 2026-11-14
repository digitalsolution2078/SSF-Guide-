import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Link } from "@/i18n/navigation";
import { pageSeo } from "@/lib/seo";
import { AssessmentPopup } from "@/components/assessment-popup";
import { categories as schoolCategories } from "@/content/categories";
import { sectors } from "@/content/sectors";
import { articlesByCategory, articleBySlug } from "@/content/articles";
import { sortedBlogPosts } from "@/content/blog";
import { videosByCategory } from "@/content/videos";
import { hospitals, PROVINCES, PROVINCE_ORDER, provinceCounts, HOSPITALS_SYNCED_AT } from "@/content/hospitals";
import { loanProducts } from "@/content/loans";
import { ssfStats, SSF_STATS_AS_OF_BS, SSF_STATS_AS_OF_ISO, formatArab, formatCount, formatLakh, toNe } from "@/content/ssf-stats";
import { categoryIcon, sectorIcon, USER_CATEGORY_ICON } from "@/content/icon-map";
import { TestimonialsSection } from "@/components/testimonials-section";
import { MySsfCard } from "@/components/my-ssf-card";
import { Icon, type IconName } from "@/components/icons";
import { SectionHead, Stat } from "@/components/ui";

/** Curated "most read" guides — shown in a horizontal scroller on the home page. */
const MOST_READ_SLUGS = [
  "ssf-bhaneko-ke-ho",
  "swasthya-bima-ki-ssf-medical",
  "yogdan-kasari-calculate-huncha",
  "pension-ra-retirement-guide",
  "foreign-employment-guide",
  "31-pratishat-kaha-jancha",
  "jagir-chadepachi-ke-huncha",
  "claim-reject-samadhan",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return pageSeo({
    locale,
    path: "",
    title: isEn
      ? "SSF Guide Nepal — Social Security Fund guides, calculators, hospital list & help"
      : "SSF Guide Nepal — सामाजिक सुरक्षा कोष सम्बन्धी सबै जानकारी",
    description: isEn
      ? `Understand Nepal's Social Security Fund (SSF): free guides, contribution & pension calculators, all ${hospitals.length} affiliated hospitals, eligibility assessment and an AI assistant. By Digital Solution.`
      : `SSF बुझ्नुहोस्, योगदान र पेन्सन हिसाब गर्नुहोस्, ${toNe(String(hospitals.length))} आबद्ध अस्पताल खोज्नुहोस्, eligibility जाँच्नुहोस् — गाइड, क्याल्कुलेटर र AI सहायक एकै ठाउँमा। Digital Solution द्वारा।`,
  });
}

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return <HomeContent locale={locale} />;
}

function HomeContent({ locale }: { locale: string }) {
  const isEn = locale === "en";
  const hero = useTranslations("hero");
  const cat = useTranslations("categories");
  const act = useTranslations("actions");
  const tools = useTranslations("tools");
  const pop = useTranslations("popular");
  const svc = useTranslations("servicesSection");
  const n = (v: number | string) => (isEn ? String(v) : toNe(String(v)));

  const mostRead = MOST_READ_SLUGS.map((s) => articleBySlug(s)).filter(
    (a): a is NonNullable<typeof a> => Boolean(a),
  );
  const latestPosts = sortedBlogPosts().slice(0, 3);
  const counts = provinceCounts();

  const paths: { href: string; icon: IconName; title: string; desc: string; tone: string }[] = [
    {
      href: "/school",
      icon: "book",
      title: isEn ? "Learn" : "सिक्नुहोस्",
      desc: isEn ? "Guides, FAQs & videos on 8 topics" : "८ विषयमा guide, FAQ र भिडियो",
      tone: "bg-primary-50 text-primary-700",
    },
    {
      href: "/calculators",
      icon: "calculator",
      title: isEn ? "Calculate" : "हिसाब गर्नुहोस्",
      desc: isEn ? "Contribution, pension, tax & more" : "योगदान, पेन्सन, कर र थप",
      tone: "bg-action-50 text-action-600",
    },
    {
      href: "/hospitals",
      icon: "hospital",
      title: isEn ? "Find a hospital" : "अस्पताल खोज्नुहोस्",
      desc: isEn ? `${hospitals.length} affiliated hospitals, with maps` : `${n(hospitals.length)} आबद्ध अस्पताल, नक्सासहित`,
      tone: "bg-health-50 text-health-700",
    },
    {
      href: "/loans",
      icon: "coins",
      title: isEn ? "Take a loan" : "सापटी लिनुहोस्",
      desc: isEn ? "Home loan to Rs 1.5 crore at 5.85%" : "रु. १.५ करोडसम्म घर सापटी ५.८५% मा",
      tone: "bg-primary-50 text-primary-700",
    },
  ];

  const actions: { label: string; href: string; icon: IconName }[] = [
    { label: act("understand"), href: "/school", icon: "book" },
    { label: act("calculate"), href: "/calculators/contribution", icon: "percent" },
    { label: act("eligibility"), href: "/eligibility", icon: "checkCircle" },
    { label: act("kyc"), href: "/services/kyc-verification", icon: "user" },
    { label: act("registration"), href: "/services/registration", icon: "file" },
    { label: act("claim"), href: "/school/claims-problems-solutions", icon: "shield" },
    { label: act("correction"), href: "/services/profile-correction", icon: "refresh" },
    { label: act("expert"), href: "/request", icon: "chat" },
  ];

  const toolCards: { label: string; href: string; icon: IconName }[] = [
    { label: tools("planner"), href: "/calculators/financial-planner", icon: "trending" },
    { label: tools("contribution"), href: "/calculators/contribution", icon: "percent" },
    { label: tools("allocation"), href: "/calculators/allocation", icon: "layers" },
    { label: tools("foreign"), href: "/calculators/foreign-employment", icon: "plane" },
    { label: tools("jobLeaving"), href: "/calculators/job-leaving", icon: "briefcase" },
    { label: tools("sip"), href: "/calculators/sip", icon: "coins" },
  ];

  const questions = [
    { key: "q1", href: "/faq/31-percent-kaha-jancha" },
    { key: "q2", href: "/faq/jagir-chadepachi-paisa" },
    { key: "q3", href: "/faq/pension-kahile-paincha" },
    { key: "q4", href: "/faq/bidesh-bata-yogdan" },
    { key: "q5", href: "/faq/kyc-kina-avashyak" },
    { key: "q6", href: "/faq/contribution-nadekhiema" },
  ] as const;

  const people: { key: string; label: string }[] = [
    { key: "employee", label: cat("employee") },
    { key: "employer", label: cat("employer") },
    { key: "foreign", label: cat("foreign") },
    { key: "selfEmployed", label: cat("selfEmployed") },
    { key: "contributor", label: cat("contributor") },
    { key: "family", label: cat("family") },
  ];

  const services = [
    { label: svc("kyc"), href: "/services/kyc-verification" },
    { label: svc("registration"), href: "/services/registration" },
    { label: svc("correction"), href: "/services/profile-correction" },
    { label: svc("employer"), href: "/services/employer-registration" },
  ];

  return (
    <div>
      <AssessmentPopup />

      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden border-b border-ink-200 bg-gradient-to-b from-primary-50 via-white to-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-100/60 blur-3xl"
        />
        <div className="container-page relative pb-12 pt-10 md:pb-16 md:pt-16">
          <span className="eyebrow">
            {isEn ? "Independent SSF guide" : "स्वतन्त्र SSF गाइड"}
            <span className="h-1 w-1 rounded-full bg-ink-300" />
            Powered by Digital Solution
          </span>
          <h1 className="mt-4 max-w-3xl text-[2.1rem] leading-[1.18] md:text-[3.4rem]">{hero("headline")}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-600 md:text-lg">{hero("subtext")}</p>

          {/* search */}
          <form action="/search" method="get" className="mt-7 flex max-w-2xl gap-2">
            <label className="relative flex-1">
              <span className="sr-only">{isEn ? "Search" : "खोज्नुहोस्"}</span>
              <Icon name="search" size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="search"
                name="q"
                placeholder={isEn ? "Search — pension, KYC, 31%, hospital in Pokhara…" : "खोज्नुहोस् — pension, KYC, ३१%, पोखराको अस्पताल…"}
                className="input rounded-2xl py-3.5 pl-12 text-base shadow-card"
              />
            </label>
            <button type="submit" className="btn-primary btn-lg shrink-0 rounded-2xl">
              {isEn ? "Search" : "खोज्नुहोस्"}
            </button>
          </form>

          {/* 4 paths */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {paths.map((p) => (
              <Link key={p.href} href={p.href} className="card card-hover group flex items-center gap-4 p-4 sm:flex-col sm:items-start sm:p-5">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${p.tone}`}>
                  <Icon name={p.icon} size={24} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 font-display text-lg font-bold text-ink-900 group-hover:text-primary-700">
                    {p.title}
                    <Icon name="arrowRight" size={16} className="text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-primary-600" />
                  </span>
                  <span className="block text-sm text-ink-500">{p.desc}</span>
                </span>
              </Link>
            ))}
          </div>

          <MySsfCard />

          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-500">
            {[
              isEn ? `${formatLakh(ssfStats.contributors.total, true)} contributors` : `${formatLakh(ssfStats.contributors.total, false)} योगदानकर्ता`,
              isEn ? `${hospitals.length} affiliated hospitals` : `${n(hospitals.length)} आबद्ध अस्पताल`,
              isEn ? "20 official source documents" : "२० आधिकारिक स्रोत दस्तावेज",
              isEn ? "Nepali + English" : "नेपाली + English",
            ].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Icon name="check" size={14} className="text-primary-500" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── Hospital finder ───────── */}
      <section className="border-b border-ink-200 bg-health-50/60">
        <div className="container-page py-12 md:py-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <div>
              <SectionHead
                eyebrow={isEn ? "Hospital directory" : "अस्पताल सूची"}
                title={isEn ? `Which hospitals accept SSF? All ${hospitals.length}, by province.` : `SSF बाट कुन अस्पतालमा उपचार? सबै ${n(hospitals.length)}, प्रदेश अनुसार।`}
                lead={
                  isEn
                    ? "Cashless treatment at affiliated hospitals — the Fund pays 80%, you pay 20%. Search by district, open in Maps, or sort by distance."
                    : "आबद्ध अस्पतालमा क्यासलेस उपचार — कोषले ८०%, तपाईंले २०%। जिल्लाबाट खोज्नुहोस्, नक्सामा खोल्नुहोस् वा नजिकका अनुसार हेर्नुहोस्।"
                }
              />
              <form action="/hospitals" method="get" className="mt-6 flex max-w-xl gap-2">
                <label className="relative flex-1">
                  <span className="sr-only">{isEn ? "Search hospitals" : "अस्पताल खोज्नुहोस्"}</span>
                  <Icon name="mapPin" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-health-600" />
                  <input
                    type="search"
                    name="q"
                    placeholder={isEn ? "District or hospital — e.g. Chitwan, Bir" : "जिल्ला वा अस्पताल — जस्तै चितवन, बीर"}
                    className="input pl-10"
                  />
                </label>
                <button type="submit" className="btn-health shrink-0">
                  {isEn ? "Find" : "खोज्नुहोस्"}
                </button>
              </form>
              <div className="mt-4 flex flex-wrap gap-2">
                {PROVINCE_ORDER.map((p) => (
                  <Link key={p} href={`/hospitals?province=${p}`} className="chip">
                    {isEn ? PROVINCES[p].en : PROVINCES[p].short}
                    <span className="rounded-full bg-health-100 px-1.5 text-xs font-bold text-health-700">{n(counts[p])}</span>
                  </Link>
                ))}
              </div>
              <p className="mt-4 text-xs text-ink-400">
                {isEn ? "Synced from ssf.gov.np on " : "ssf.gov.np बाट अद्यावधिक: "}
                {isEn ? HOSPITALS_SYNCED_AT : toNe(HOSPITALS_SYNCED_AT)}
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { icon: "card" as IconName, t: isEn ? "Carry your SSN" : "SSN साथमा लैजानुहोस्", d: isEn ? "11-digit Social Security Number or the SSF app." : "११ अङ्कको सामाजिक सुरक्षा नम्बर वा SSF एप।" },
                { icon: "percent" as IconName, t: isEn ? "20% co-payment" : "२०% सह-भुक्तानी", d: isEn ? "OPD up to Rs 20,000/yr · inpatient up to Rs 1 lakh/yr." : "OPD रु. २०,०००/वर्ष · भर्ना रु. १ लाख/वर्ष।" },
                { icon: "alert" as IconName, t: isEn ? "Accident? Report in 7 days" : "दुर्घटना? ७ दिनभित्र खबर", d: isEn ? "Otherwise non-listed hospitals are capped at Rs 7 lakh." : "नत्र असूचीकृत अस्पतालमा बढीमा रु. ७ लाख।" },
              ].map((f) => (
                <li key={f.t} className="flex gap-3 rounded-2xl border border-health-200 bg-white p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-health-50 text-health-700">
                    <Icon name={f.icon} size={18} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink-900">{f.t}</span>
                    <span className="block text-xs leading-relaxed text-ink-500">{f.d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────── Loans ───────── */}
      <section className="border-b border-ink-200">
        <div className="container-page py-12 md:py-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <SectionHead
                eyebrow={isEn ? "SSF loans" : "SSF सापटी"}
                title={isEn ? "Borrow from your own fund — cheaper than any bank" : "आफ्नै कोषबाट सापटी — बैंकभन्दा सस्तो"}
                lead={
                  isEn
                    ? "Home loan up to Rs 1.5 crore at 5.85–6% after just 18 months of contribution, education loan up to Rs 35 lakh, and a collateral-free special loan from the app within a day."
                    : "१८ महिना योगदानपछि नै ५.८५–६% ब्याजमा रु. १.५ करोडसम्म घर सापटी, रु. ३५ लाखसम्म शैक्षिक सापटी, र App बाटै एक दिनमा आउने धितो नचाहिने विशेष सापटी।"
                }
              />
              <div className="mt-6 flex flex-wrap gap-2">
                <Link href="/loans#check" className="btn-primary">
                  <Icon name="checkCircle" size={16} />
                  {isEn ? "Check what I can borrow" : "म कति लिन सक्छु?"}
                </Link>
                <Link href="/loans" className="btn-outline">
                  {isEn ? "All loan details" : "सबै सापटी विवरण"}
                </Link>
              </div>
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {loanProducts.map((p) => (
                <li key={p.key}>
                  <Link href={`/loans#${p.key}`} className="card card-hover group flex h-full flex-col p-4">
                    <span className="icon-tile">
                      <Icon name={p.key === "home" ? "home" : p.key === "education" ? "grad" : "sparkles"} size={20} />
                    </span>
                    <p className="mt-3 font-semibold text-ink-900 group-hover:text-primary-700">{isEn ? p.nameEn : p.nameNe}</p>
                    <p className="mt-1 font-display text-xl font-bold text-primary-700">{isEn ? p.ceilingLabelEn : p.ceilingLabelNe}</p>
                    <p className="mt-1 text-xs text-ink-500">
                      {p.rates.length ? `${p.rates.map((r) => n(String(r.pct))).join("–")}% · ` : ""}
                      {isEn ? `${p.minMonths} months` : `${n(String(p.minMonths))} महिना`}
                      {!p.collateral && (isEn ? " · no collateral" : " · धितो बिना")}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────── For you: audience hubs ───────── */}
      <section className="border-b border-ink-200 bg-ink-50">
        <div className="container-page py-12">
          <SectionHead
            eyebrow={isEn ? "For you" : "तपाईंका लागि"}
            title={isEn ? "Pages built around your situation" : "तपाईंको अवस्थाअनुसार बनेका पृष्ठ"}
          />
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/foreign", icon: "plane" as IconName, t: isEn ? "Working abroad?" : "विदेशमा काम गर्दै हुनुहुन्छ?", d: isEn ? `${formatLakh(ssfStats.contributors.foreign, true)} migrant contributors — pay from abroad, family medical, returnee rules.` : `${formatLakh(ssfStats.contributors.foreign, false)} वैदेशिक योगदानकर्ता — विदेशबाट तिर्ने, परिवारको उपचार, फर्किएपछि।` },
              { href: "/employer", icon: "building" as IconName, t: isEn ? "Employer / HR?" : "रोजगारदाता / HR?", d: isEn ? "Payroll sheet, this month's deposit deadline, new-hire listing in 5 minutes." : "Payroll sheet, यो महिनाको दाखिला म्याद, नयाँ कर्मचारी सूचीकरण ५ मिनेटमा।" },
              { href: "/claims", icon: "shield" as IconName, t: isEn ? "Need to claim?" : "दाबी गर्नुपर्‍यो?", d: isEn ? "Pick what happened → where to go, which papers, what if rejected." : "के भयो रोज्नुहोस् → कहाँ जाने, कुन कागजात, अस्वीकृत भए के गर्ने।" },
              { href: "/school/courses", icon: "grad" as IconName, t: isEn ? "Want to learn properly?" : "राम्रोसँग सिक्न चाहनुहुन्छ?", d: isEn ? "4 short courses with quiz and certificate." : "quiz र प्रमाणपत्रसहित ४ छोटा कोर्स।" },
            ].map((c) => (
              <Link key={c.href} href={c.href} className="card card-hover group flex flex-col p-5">
                <span className="icon-tile">
                  <Icon name={c.icon} size={20} />
                </span>
                <p className="mt-3 font-semibold text-ink-900 group-hover:text-primary-700">{c.t}</p>
                <p className="mt-1.5 text-sm text-ink-500">{c.d}</p>
                <span className="mt-auto flex items-center gap-1 pt-3 text-sm font-semibold text-primary-700">
                  {isEn ? "Open" : "खोल्नुहोस्"} <Icon name="arrowRight" size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── What do you want to do ───────── */}
      <section className="container-page py-14">
        <SectionHead eyebrow={isEn ? "Quick start" : "छिटो सुरु"} title={act("headline")} />
        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((a) => (
            <Link key={a.href + a.label} href={a.href} className="card card-hover group flex items-center gap-3 px-4 py-3.5">
              <span className="icon-tile h-10 w-10">
                <Icon name={a.icon} size={18} />
              </span>
              <span className="flex-1 text-sm font-semibold text-ink-800 group-hover:text-primary-700">{a.label}</span>
              <Icon name="chevronRight" size={16} className="text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-primary-600" />
            </Link>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm text-ink-500">{cat("headline")}</span>
          {people.map((p) => (
            <Link key={p.key} href={`/school?category=${p.key}`} className="chip">
              <Icon name={USER_CATEGORY_ICON[p.key] ?? "user"} size={14} className="text-ink-400" />
              {p.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ───────── SSF School ───────── */}
      <section className="border-y border-ink-200 bg-ink-50">
        <div className="container-page py-14">
          <SectionHead
            eyebrow={isEn ? "Learn" : "सिकाइ"}
            title={isEn ? "SSF School — pick a topic" : "SSF School — विषय रोज्नुहोस्"}
            lead={isEn ? "Every guide is checked against the official Act, Regulation and Procedures." : "हरेक guide आधिकारिक ऐन, नियमावली र कार्यविधिसँग जाँचिएको छ।"}
            href="/school"
            linkLabel={isEn ? "All topics" : "सबै विषय"}
          />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {schoolCategories.map((c) => {
              const a = articlesByCategory(c.slug).length;
              const v = videosByCategory(c.slug).length;
              return (
                <Link key={c.slug} href={`/school/${c.slug}`} className="card card-hover group flex flex-col p-4 md:p-5">
                  <span className="icon-tile">
                    <Icon name={categoryIcon(c.slug)} size={20} />
                  </span>
                  <p className="mt-3 font-semibold leading-snug text-ink-900 group-hover:text-primary-700">
                    {isEn ? c.titleEn : c.titleNe}
                  </p>
                  <p className="mt-1.5 text-xs text-ink-400">
                    {a > 0 && `${n(a)} guide`}
                    {a > 0 && v > 0 && " · "}
                    {v > 0 && `${n(v)} ${isEn ? "videos" : "भिडियो"}`}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── Most read ───────── */}
      {mostRead.length > 0 && (
        <section className="container-page py-14">
          <SectionHead
            eyebrow={isEn ? "Most read" : "धेरै पढिएका"}
            title={isEn ? "Start with these guides" : "यी guide बाट सुरु गर्नुहोस्"}
            href="/school"
            linkLabel={isEn ? "See all" : "सबै हेर्नुहोस्"}
          />
          <div className="scrollbar-thin -mx-4 mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6">
            {mostRead.map((a, i) => {
              const useEn = isEn && Boolean(a.en);
              const title = useEn && a.en ? a.en.title : a.title;
              const short = useEn && a.en ? a.en.shortAnswer : a.shortAnswer;
              return (
                <Link
                  key={a.slug}
                  href={`/school/${a.categorySlug}/${a.slug}`}
                  className="card card-hover group flex w-72 shrink-0 snap-start flex-col p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl font-bold leading-none text-ink-200">{n(String(i + 1).padStart(2, "0"))}</span>
                    {a.isCornerstone && <span className="badge-primary">{isEn ? "Cornerstone" : "मुख्य guide"}</span>}
                  </div>
                  <p className="mt-4 font-semibold leading-snug text-ink-900 group-hover:text-primary-700">{title}</p>
                  <p className="mt-2 line-clamp-3 text-sm text-ink-500">{short}</p>
                  <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-primary-700">
                    {isEn ? "Read" : "पढ्नुहोस्"} <Icon name="arrowRight" size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ───────── Tools ───────── */}
      <section className="border-y border-ink-200 bg-ink-50">
        <div className="container-page py-14">
          <SectionHead
            eyebrow={isEn ? "Calculate" : "हिसाब"}
            title={tools("headline")}
            lead={isEn ? "21 Nepal-specific calculators — SSF, salary, tax and savings." : "२१ नेपाल-विशेष क्याल्कुलेटर — SSF, तलब, कर र बचत।"}
            href="/calculators"
            linkLabel={isEn ? "All tools" : "सबै उपकरण"}
          />
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {toolCards.map((tc) => (
              <Link key={tc.href} href={tc.href} className="card card-hover group flex items-center gap-3.5 p-4">
                <span className="icon-tile bg-action-50 text-action-600">
                  <Icon name={tc.icon} size={20} />
                </span>
                <span className="flex-1 text-sm font-semibold text-ink-800 group-hover:text-primary-700">{tc.label}</span>
                <Icon name="chevronRight" size={16} className="text-ink-300 group-hover:text-primary-600" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Live figures ───────── */}
      <section className="container-page py-14">
        <SectionHead
          eyebrow={isEn ? "SSF in numbers" : "SSF तथ्यांकमा"}
          title={isEn ? "The Fund today" : "कोष आज"}
          lead={isEn ? `From the Fund's daily summary report dated ${SSF_STATS_AS_OF_ISO}.` : `कोषको दैनिक संक्षेप रिपोर्ट, ${SSF_STATS_AS_OF_BS} अनुसार।`}
          href="/rates"
          linkLabel={isEn ? "All rates & figures" : "सबै दर र तथ्यांक"}
        />
        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat value={formatLakh(ssfStats.contributors.total, isEn)} label={isEn ? "Total contributors" : "कुल योगदानकर्ता"} hint={isEn ? `${formatLakh(ssfStats.contributors.foreign, true)} in foreign employment` : `${formatLakh(ssfStats.contributors.foreign, false)} वैदेशिक रोजगारमा`} />
          <Stat value={formatCount(ssfStats.employers, isEn)} label={isEn ? "Registered employers" : "सूचीकृत रोजगारदाता"} hint={isEn ? "Bagmati alone: 15,551" : "बागमती मात्र: १५,५५१"} />
          <Stat value={formatArab(ssfStats.collectionNpr, isEn)} label={isEn ? "Contributions collected" : "जम्मा योगदान संकलन"} tone="neutral" />
          <Stat value={formatArab(ssfStats.claims.paidNpr, isEn)} label={isEn ? "Benefits paid out" : "दाबी भुक्तानी"} hint={isEn ? `${formatLakh(ssfStats.claims.paid, true)} claims paid` : `${formatLakh(ssfStats.claims.paid, false)} दाबी भुक्तानी`} tone="health" />
        </div>
      </section>

      {/* ───────── Sectors ───────── */}
      <section className="border-t border-ink-200">
        <div className="container-page py-14">
          <SectionHead
            eyebrow={isEn ? "By sector" : "क्षेत्र अनुसार"}
            title={isEn ? "Which sector do you contribute from?" : "तपाईं कुन सेक्टरबाट योगदान गर्नुहुन्छ?"}
            lead={isEn ? "See your exact split — pension, gratuity, insurance — and the guides that apply." : "तपाईंको योगदान कति पेन्सन, उपदान र बीमामा जान्छ र कुन guide लागू हुन्छ हेर्नुहोस्।"}
          />
          <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {sectors.map((s) => (
              <Link key={s.slug} href={`/sector/${s.slug}`} className="card card-hover group flex items-center gap-3 p-4">
                <span className="icon-tile">
                  <Icon name={sectorIcon(s.key)} size={20} />
                </span>
                <span className="font-semibold text-ink-900 group-hover:text-primary-700">{isEn ? s.titleEn : s.titleNe}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Popular questions ───────── */}
      <section className="border-t border-ink-200 bg-ink-50">
        <div className="container-page py-14">
          <SectionHead eyebrow={isEn ? "FAQ" : "प्रश्नोत्तर"} title={pop("headline")} href="/faq" linkLabel={isEn ? "All questions" : "सबै प्रश्न"} />
          <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {questions.map((q) => (
              <li key={q.key}>
                <Link href={q.href} className="card card-hover group flex items-start gap-3 px-4 py-3.5 text-sm text-ink-800">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-100 font-display text-xs font-bold text-primary-700">?</span>
                  <span className="group-hover:text-ink-900">{pop(q.key)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <TestimonialsSection />

      {/* ───────── Blog ───────── */}
      {latestPosts.length > 0 && (
        <section className="container-page py-14">
          <SectionHead
            eyebrow={isEn ? "News" : "समाचार"}
            title={isEn ? "Latest SSF updates" : "SSF का पछिल्ला अपडेट"}
            href="/blog"
            linkLabel={isEn ? "All posts" : "सबै पोस्ट"}
          />
          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {latestPosts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="card card-hover group flex flex-col p-5">
                <span className="badge-neutral self-start">{p.category}</span>
                <p className="mt-3 font-display text-lg font-bold leading-snug text-ink-900 group-hover:text-primary-700">
                  {isEn && p.en ? p.en.title : p.title}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-ink-500">{isEn && p.en ? p.en.excerpt : p.excerpt}</p>
                <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-primary-700">
                  {isEn ? "Read" : "पढ्नुहोस्"} <Icon name="arrowRight" size={14} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ───────── Service CTA ───────── */}
      <section className="border-t border-ink-200 bg-primary-900 text-white">
        <div className="container-page py-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="eyebrow text-primary-300">{isEn ? "Need a hand?" : "सहयोग चाहियो?"}</span>
              <h2 className="mt-2 text-2xl text-white md:text-3xl">{svc("headline")}</h2>
              <p className="mt-3 text-sm text-primary-200">
                {isEn
                  ? "Digital Solution's team handles KYC, registration and corrections end-to-end — independent of the Fund, transparent pricing."
                  : "Digital Solution को टोलीले KYC, registration र correction सुरुदेखि अन्त्यसम्म गर्छ — कोषबाट स्वतन्त्र, पारदर्शी शुल्क।"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/request" className="btn-accent btn-lg">{isEn ? "Request assistance" : "सहायता अनुरोध गर्नुहोस्"}</Link>
              <Link href="/ask" className="btn btn-lg border border-white/20 bg-white/10 text-white hover:bg-white/15">{isEn ? "Ask SSF AI" : "SSF AI लाई सोध्नुहोस्"}</Link>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex items-center justify-between gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
              >
                {s.label}
                <Icon name="arrowRight" size={16} className="text-white/50 transition group-hover:translate-x-0.5 group-hover:text-action-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
