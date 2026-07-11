import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Link } from "@/i18n/navigation";

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return <HomeContent />;
}

function HomeContent() {
  const hero = useTranslations("hero");
  const cat = useTranslations("categories");
  const act = useTranslations("actions");
  const tools = useTranslations("tools");
  const pop = useTranslations("popular");
  const svc = useTranslations("servicesSection");

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
    { label: tools("contribution"), href: "/calculators/contribution" },
    { label: tools("allocation"), href: "/calculators/allocation" },
    { label: tools("foreign"), href: "/calculators/foreign-employment" },
    { label: tools("jobLeaving"), href: "/calculators/job-leaving" },
  ];

  const questions = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

  const services = [
    { label: svc("kyc"), href: "/services/kyc-verification" },
    { label: svc("registration"), href: "/services/registration" },
    { label: svc("correction"), href: "/services/profile-correction" },
    { label: svc("employer"), href: "/services/employer-registration" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-snug text-primary-900 md:text-5xl md:leading-tight">
            {hero("headline")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 md:text-lg">
            {hero("subtext")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/ask"
              className="rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white shadow hover:bg-primary-700"
            >
              {hero("ctaAsk")}
            </Link>
            <Link
              href="/eligibility"
              className="rounded-xl bg-action-500 px-6 py-3 font-semibold text-white shadow hover:bg-action-600"
            >
              {hero("ctaEligibility")}
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">{hero("trustLine")}</p>
        </div>
      </section>

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
              <li key={q}>
                <Link
                  href="/faq"
                  className="block rounded-lg border border-primary-100 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm hover:border-primary-400"
                >
                  ❓ {pop(q)}
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
