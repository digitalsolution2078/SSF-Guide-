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
import { TestimonialsSection } from "@/components/testimonials-section";

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
      ? "SSF Guide Nepal — Social Security Fund Guides, Calculators & Help"
      : "SSF Guide Nepal — सामाजिक सुरक्षा कोष सम्बन्धी सबै जानकारी",
    description: isEn
      ? "Understand Nepal's Social Security Fund (SSF): free guides, contribution & pension calculators, eligibility assessment and an AI assistant. By Digital Solution."
      : "SSF बुझ्नुहोस्, योगदान र पेन्सन हिसाब गर्नुहोस्, eligibility जाँच्नुहोस् — गाइड, क्याल्कुलेटर र AI सहायक एकै ठाउँमा। Digital Solution द्वारा।",
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

/** Editorial section heading — eyebrow · serif title · optional lead + link. */
function SectionHead({
  eyebrow,
  title,
  lead,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-6 border-b border-ink-200 pb-4">
      <div className="max-w-2xl">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="mt-2 text-2xl font-medium text-ink-900 md:text-3xl">{title}</h2>
        {lead && <p className="mt-2 text-sm text-ink-500 md:text-base">{lead}</p>}
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="shrink-0 whitespace-nowrap text-sm font-semibold text-primary-700 transition-colors hover:text-primary-900"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

function HomeContent({ locale }: { locale: string }) {
  const isEn = locale === "en";
  const hero = useTranslations("hero");
  const cat = useTranslations("categories");
  const act = useTranslations("actions");
  const tools = useTranslations("tools");
  const pop = useTranslations("popular");
  const svc = useTranslations("servicesSection");

  const mostRead = MOST_READ_SLUGS.map((s) => articleBySlug(s)).filter(
    (a): a is NonNullable<typeof a> => Boolean(a),
  );
  const latestPosts = sortedBlogPosts().slice(0, 3);

  const categories = [
    { key: "employee", label: cat("employee"), icon: "👩‍💼" },
    { key: "employer", label: cat("employer"), icon: "🏢" },
    { key: "foreign", label: cat("foreign"), icon: "✈️" },
    { key: "selfEmployed", label: cat("selfEmployed"), icon: "🛠️" },
    { key: "contributor", label: cat("contributor"), icon: "💳" },
    { key: "family", label: cat("family"), icon: "👪" },
  ];

  const actions = [
    { label: act("understand"), href: "/school" },
    { label: act("calculate"), href: "/calculators/contribution" },
    { label: act("eligibility"), href: "/eligibility" },
    { label: act("kyc"), href: "/services/kyc-verification" },
    { label: act("registration"), href: "/services/registration" },
    { label: act("claim"), href: "/school" },
    { label: act("correction"), href: "/services/profile-correction" },
    { label: act("expert"), href: "/request" },
  ];

  const toolCards = [
    { label: tools("planner"), href: "/calculators/financial-planner" },
    { label: tools("sip"), href: "/calculators/sip" },
    { label: tools("contribution"), href: "/calculators/contribution" },
    { label: tools("allocation"), href: "/calculators/allocation" },
    { label: tools("foreign"), href: "/calculators/foreign-employment" },
    { label: tools("jobLeaving"), href: "/calculators/job-leaving" },
  ];

  const questions = [
    { key: "q1", href: "/faq/31-percent-kaha-jancha" },
    { key: "q2", href: "/faq/jagir-chadepachi-paisa" },
    { key: "q3", href: "/faq/pension-kahile-paincha" },
    { key: "q4", href: "/faq/bidesh-bata-yogdan" },
    { key: "q5", href: "/faq/kyc-kina-avashyak" },
    { key: "q6", href: "/faq/contribution-nadekhiema" },
  ] as const;

  const services = [
    { label: svc("kyc"), href: "/services/kyc-verification" },
    { label: svc("registration"), href: "/services/registration" },
    { label: svc("correction"), href: "/services/profile-correction" },
    { label: svc("employer"), href: "/services/employer-registration" },
  ];

  return (
    <div>
      <AssessmentPopup />

      {/* Hero — editorial, light, search-first */}
      <section className="relative border-b border-ink-200 bg-ink-50">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent" />
        <div className="mx-auto max-w-4xl px-4 pb-16 pt-16 md:pt-20">
          <span className="eyebrow">
            SSF School
            <span className="h-1 w-1 rounded-full bg-ink-300" />
            Powered by Digital Solution
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-medium leading-[1.12] text-ink-900 md:text-6xl">
            {hero("headline")}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-500 md:text-lg">
            {hero("subtext")}
          </p>

          {/* hero search */}
          <form
            action="/search"
            method="get"
            className="mt-8 flex max-w-xl overflow-hidden rounded-full border border-ink-300 bg-white p-1 shadow-card focus-within:border-primary-400"
          >
            <input
              type="search"
              name="q"
              placeholder={
                isEn
                  ? "Search anything — pension, KYC, foreign, 31%…"
                  : "केही पनि खोज्नुहोस् — pension, KYC, विदेश, ३१%…"
              }
              className="w-full rounded-full bg-transparent px-5 py-2.5 text-ink-900 placeholder:text-ink-400 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-action-500 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-action-600"
            >
              {isEn ? "Search" : "खोज्नुहोस्"}
            </button>
          </form>

          <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2">
            <Link
              href="/calculators"
              className="rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              {isEn ? "Financial Tools" : "Financial Tools (उपकरण)"}
            </Link>
            <Link
              href="/calculators/financial-planner"
              className="rounded-full border border-ink-300 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:border-ink-500 hover:text-ink-900"
            >
              Financial Planner
            </Link>
            <Link
              href="/assessment"
              className="rounded-full border border-ink-300 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:border-ink-500 hover:text-ink-900"
            >
              SSF Assessment
            </Link>
            <Link
              href="/school"
              className="px-2 py-2.5 text-sm font-semibold text-primary-700 underline-offset-4 transition-colors hover:text-primary-900 hover:underline"
            >
              {isEn ? "Start learning →" : "सिक्न सुरु गर्नुहोस् →"}
            </Link>
          </div>
          <p className="mt-8 text-sm text-ink-400">{hero("trustLine")}</p>
        </div>
      </section>

      {/* SSF School — the centerpiece */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHead
          eyebrow={isEn ? "Learn" : "सिकाइ"}
          title={isEn ? "SSF School — what do you want to learn?" : "SSF School — के सिक्न चाहनुहुन्छ?"}
        />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {schoolCategories.map((c) => {
            const a = articlesByCategory(c.slug).length;
            const v = videosByCategory(c.slug).length;
            return (
              <Link
                key={c.slug}
                href={`/school/${c.slug}`}
                className="card-editorial group flex flex-col p-5"
              >
                <span className="text-2xl opacity-90">{c.icon}</span>
                <p className="mt-3 font-semibold leading-snug text-ink-900 group-hover:text-primary-700">
                  {isEn ? c.titleEn : c.titleNe}
                </p>
                <p className="mt-1.5 text-xs text-ink-400">
                  {a > 0 && `${a} guide`}
                  {a > 0 && v > 0 && " · "}
                  {v > 0 && `${v} ${isEn ? "videos" : "भिडियो"}`}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Most read guides — horizontal scroller */}
      {mostRead.length > 0 && (
        <section className="border-y border-ink-200 bg-ink-50">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <SectionHead
              eyebrow={isEn ? "Most read" : "धेरै पढिएका"}
              title={isEn ? "Most read guides" : "सबैभन्दा धेरै पढिएका guides"}
              href="/school"
              linkLabel={isEn ? "See all" : "सबै हेर्नुहोस्"}
            />
            <div className="scrollbar-thin -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3">
              {mostRead.map((a, i) => {
                const useEn = isEn && Boolean(a.en);
                const title = useEn && a.en ? a.en.title : a.title;
                const short = useEn && a.en ? a.en.shortAnswer : a.shortAnswer;
                return (
                  <Link
                    key={a.slug}
                    href={`/school/${a.categorySlug}/${a.slug}`}
                    className="card-editorial group flex w-72 shrink-0 snap-start flex-col p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-3xl leading-none text-ink-300">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {a.isCornerstone && (
                        <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                          {isEn ? "Cornerstone" : "मुख्य guide"}
                        </span>
                      )}
                    </div>
                    <p className="mt-4 font-semibold leading-snug text-ink-900 group-hover:text-primary-700">
                      {title}
                    </p>
                    <p className="mt-2 line-clamp-3 text-sm text-ink-500">
                      {short}
                    </p>
                    <span className="mt-auto pt-4 text-sm font-semibold text-primary-700">
                      {isEn ? "Read →" : "पढ्नुहोस् →"}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Browse by sector */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHead
          eyebrow={isEn ? "By sector" : "क्षेत्र अनुसार"}
          title={isEn ? "Which sector do you contribute from?" : "तपाईं कुन सेक्टरबाट योगदान गर्नुहुन्छ?"}
          lead={
            isEn
              ? "See your exact contribution split — pension, gratuity, and insurance — plus the guides that apply to you."
              : "आफ्नो योगदान कति पेन्सन, कति उपदान र कति बीमामा जान्छ र तपाईंलाई लागू हुने guide हेर्नुहोस्।"
          }
        />
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {sectors.map((s) => (
            <Link
              key={s.slug}
              href={`/sector/${s.slug}`}
              className="card-editorial group flex items-center gap-3 p-5"
            >
              <span className="text-2xl opacity-90">{s.icon}</span>
              <span className="font-semibold text-ink-900 group-hover:text-primary-700">
                {isEn ? s.titleEn : s.titleNe}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Category selector */}
      <section className="border-t border-ink-200">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SectionHead eyebrow={isEn ? "By person" : "व्यक्ति अनुसार"} title={cat("headline")} />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => (
              <Link
                key={c.key}
                href={`/school?category=${c.key}`}
                className="card-editorial group flex flex-col items-center gap-2 p-4 text-center"
              >
                <span className="text-2xl opacity-90">{c.icon}</span>
                <span className="text-sm font-medium text-ink-700 group-hover:text-primary-700">
                  {c.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main actions */}
      <section className="border-t border-ink-200 bg-ink-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SectionHead eyebrow={isEn ? "Get things done" : "काम गर्नुहोस्"} title={act("headline")} />
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {actions.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="group flex items-center justify-between rounded-xl border border-ink-200 bg-white px-4 py-3.5 text-sm font-medium text-ink-800 transition-all hover:border-ink-400 hover:shadow-card"
              >
                {a.label}
                <span className="text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-600">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured tools */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHead
          eyebrow={isEn ? "Calculate" : "हिसाब"}
          title={tools("headline")}
          href="/calculators"
          linkLabel={isEn ? "All tools" : "सबै उपकरण"}
        />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toolCards.map((tc) => (
            <Link
              key={tc.href}
              href={tc.href}
              className="card-editorial group flex items-center gap-3 p-5 text-sm font-semibold text-ink-800"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <path d="M8 6h8M8 10h8M8 14h3M15 14h1M8 18h3M15 18h1" />
                </svg>
              </span>
              <span className="group-hover:text-primary-700">{tc.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular questions */}
      <section className="border-t border-ink-200 bg-ink-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SectionHead eyebrow={isEn ? "FAQ" : "प्रश्नोत्तर"} title={pop("headline")} />
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {questions.map((q) => (
              <li key={q.key}>
                <Link
                  href={q.href}
                  className="group flex items-start gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3.5 text-sm text-ink-800 transition-all hover:border-ink-400 hover:shadow-card"
                >
                  <span className="font-serif text-primary-400">Q.</span>
                  <span className="group-hover:text-ink-900">{pop(q.key)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonials — renders only when admin has published some */}
      <TestimonialsSection />

      {/* Latest from the blog */}
      {latestPosts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <SectionHead
            eyebrow={isEn ? "Journal" : "ब्लग"}
            title={isEn ? "Latest from the blog" : "Blog का पछिल्ला पोस्ट"}
            href="/blog"
            linkLabel={isEn ? "All posts" : "सबै पोस्ट"}
          />
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {latestPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col border-t-2 border-ink-900 pt-4 transition-colors hover:border-primary-600"
              >
                <div className="flex items-center justify-between">
                  <span className="eyebrow !tracking-wider text-ink-400">{p.category}</span>
                  <span className="text-xl opacity-80">{p.emoji}</span>
                </div>
                <p className="mt-3 font-serif text-lg leading-snug text-ink-900 group-hover:text-primary-700">
                  {isEn && p.en ? p.en.title : p.title}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-ink-500">
                  {isEn && p.en ? p.en.excerpt : p.excerpt}
                </p>
                <span className="mt-3 text-sm font-semibold text-primary-700">
                  {isEn ? "Read →" : "पढ्नुहोस् →"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Service conversion */}
      <section className="border-t border-ink-200 bg-primary-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <span className="eyebrow text-primary-300">{isEn ? "Need a hand?" : "सहयोग चाहियो?"}</span>
          <h2 className="mt-2 max-w-2xl text-2xl font-medium text-white md:text-3xl">
            {svc("headline")}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex items-center justify-between gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-white/40 hover:bg-white/10"
              >
                {s.label}
                <span className="text-white/50 transition-transform group-hover:translate-x-0.5 group-hover:text-action-500">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
