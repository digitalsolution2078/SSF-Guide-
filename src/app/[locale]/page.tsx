import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Link } from "@/i18n/navigation";
import { AssessmentPopup } from "@/components/assessment-popup";
import { categories as schoolCategories } from "@/content/categories";
import { articlesByCategory, articleBySlug } from "@/content/articles";
import { videosByCategory } from "@/content/videos";

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

  const mostRead = MOST_READ_SLUGS.map((s) => articleBySlug(s)).filter(
    (a): a is NonNullable<typeof a> => Boolean(a),
  );

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

      {/* Hero — deep purple, School identity, search-first */}
      <section className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 text-center">
          <p className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-action-500">
            🎓 SSF School · Powered by Digital Solution
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold leading-snug md:text-5xl md:leading-tight">
            {hero("headline")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-primary-100 md:text-lg">
            {hero("subtext")}
          </p>

          {/* hero search */}
          <form
            action="/search"
            method="get"
            className="mx-auto mt-8 flex max-w-xl overflow-hidden rounded-2xl bg-white p-1.5 shadow-2xl"
          >
            <input
              type="search"
              name="q"
              placeholder={
                isEn
                  ? "Search anything — pension, KYC, foreign, 31%…"
                  : "केही पनि खोज्नुहोस् — pension, KYC, विदेश, ३१%…"
              }
              className="w-full rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-action-500 px-6 py-3 font-bold text-white transition hover:bg-action-600"
            >
              🔍 {isEn ? "Search" : "खोज्नुहोस्"}
            </button>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/calculators/financial-planner"
              className="rounded-xl bg-action-500 px-6 py-3 font-bold text-white shadow-lg transition hover:scale-[1.02] hover:bg-action-600"
            >
              💰 Financial Planner
            </Link>
            <Link
              href="/assessment"
              className="rounded-xl bg-white/10 px-6 py-3 font-bold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/20"
            >
              📊 SSF Assessment
            </Link>
            <Link
              href="/school"
              className="rounded-xl bg-white px-6 py-3 font-bold text-primary-800 shadow-lg transition hover:scale-[1.02]"
            >
              🎓 {isEn ? "Start learning" : "सिक्न सुरु गर्नुहोस्"}
            </Link>
          </div>
          <p className="mt-7 text-sm text-primary-200">{hero("trustLine")}</p>
        </div>
      </section>

      {/* SSF School — the centerpiece */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center text-2xl font-bold text-primary-900">
          🎓 SSF School — {isEn ? "what do you want to learn?" : "के सिक्न चाहनुहुन्छ?"}
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {schoolCategories.map((c) => {
            const a = articlesByCategory(c.slug).length;
            const v = videosByCategory(c.slug).length;
            return (
              <Link
                key={c.slug}
                href={`/school/${c.slug}`}
                className="rounded-xl border border-primary-100 bg-white p-4 shadow-sm transition hover:border-primary-400 hover:shadow"
              >
                <span className="text-2xl">{c.icon}</span>
                <p className="mt-1 text-sm font-semibold text-primary-900">
                  {isEn ? c.titleEn : c.titleNe}
                </p>
                <p className="mt-1 text-xs text-gray-400">
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
        <section className="bg-primary-50/50">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-bold text-primary-900">
                🔥 {isEn ? "Most read guides" : "सबैभन्दा धेरै पढिएका guides"}
              </h2>
              <Link
                href="/school"
                className="text-sm font-semibold text-primary-700 hover:text-primary-900"
              >
                {isEn ? "See all →" : "सबै हेर्नुहोस् →"}
              </Link>
            </div>
            <div className="-mx-4 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:thin]">
              {mostRead.map((a, i) => {
                const useEn = isEn && Boolean(a.en);
                const title = useEn && a.en ? a.en.title : a.title;
                const short = useEn && a.en ? a.en.shortAnswer : a.shortAnswer;
                return (
                  <Link
                    key={a.slug}
                    href={`/school/${a.categorySlug}/${a.slug}`}
                    className="flex w-72 shrink-0 snap-start flex-col rounded-2xl border border-primary-100 bg-white p-5 shadow-sm transition hover:border-primary-400 hover:shadow"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-action-500 text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      {a.isCornerstone && (
                        <span className="rounded bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                          ⭐ {isEn ? "Cornerstone" : "मुख्य guide"}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 font-semibold leading-snug text-primary-900">
                      {title}
                    </p>
                    <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                      {short}
                    </p>
                    <span className="mt-auto pt-3 text-sm font-semibold text-primary-700">
                      {isEn ? "Read →" : "पढ्नुहोस् →"}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Category selector */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center text-2xl font-bold text-primary-900">
          {cat("headline")}
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.key}
              href={`/school?category=${c.key}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-primary-100 bg-white p-4 text-center shadow-sm transition hover:border-primary-400 hover:shadow"
            >
              <span className="text-3xl">{c.icon}</span>
              <span className="text-sm font-medium text-gray-800">
                {c.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Main actions */}
      <section className="bg-primary-50/50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-center text-2xl font-bold text-primary-900">
            {act("headline")}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {actions.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="rounded-lg border border-primary-100 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm transition hover:border-primary-400"
              >
                {a.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured tools */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center text-2xl font-bold text-primary-900">
          {tools("headline")}
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {toolCards.map((tc) => (
            <Link
              key={tc.href}
              href={tc.href}
              className="rounded-xl border-2 border-primary-100 bg-white p-5 text-sm font-semibold text-primary-800 shadow-sm transition hover:border-action-500"
            >
              🧮 {tc.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Popular questions */}
      <section className="bg-primary-50/50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-center text-2xl font-bold text-primary-900">
            {pop("headline")}
          </h2>
          <ul className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
            {questions.map((q) => (
              <li key={q.key}>
                <Link
                  href={q.href}
                  className="block rounded-lg border border-primary-100 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm hover:border-primary-400"
                >
                  ❓ {pop(q.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Service conversion */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center text-2xl font-bold text-primary-900">
          {svc("headline")}
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-xl bg-primary-600 p-5 text-sm font-semibold text-white shadow transition hover:bg-primary-700"
            >
              {s.label} →
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
