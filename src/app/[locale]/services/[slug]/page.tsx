import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, serviceBySlug } from "@/content/services";
import { Link } from "@/i18n/navigation";
import { pageSeo } from "@/lib/seo";
import { Icon, type IconName } from "@/components/icons";
import { PageHero, SectionHead } from "@/components/ui";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return pageSeo({ locale, path: `/services/${slug}` });
  const isEn = locale === "en";
  return pageSeo({
    locale,
    path: `/services/${slug}`,
    title: isEn && s.titleEn ? s.titleEn : s.titleNe,
    description: s.description,
  });
}

/** Pick an icon from the service slug (kyc → user, registration → file, correction → refresh, employer → building). */
function serviceIcon(slug: string): IconName {
  if (slug.includes("employer")) return "building";
  if (slug.includes("kyc")) return "user";
  if (slug.includes("correction")) return "refresh";
  if (slug.includes("registration")) return "file";
  return "briefcase";
}

function BulletSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-10">
      <SectionHead as="h3" title={title} />
      <ul className="mt-4 space-y-2 text-ink-700">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-3">
            <Icon name="check" size={18} className="mt-0.5 shrink-0 text-primary-500" />
            <span className="leading-relaxed">{i}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StepsSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-10">
      <SectionHead as="h3" title={title} />
      <ol className="mt-4 space-y-3">
        {items.map((i, idx) => (
          <li key={i} className="flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-600 font-display text-sm font-bold text-white">
              {idx + 1}
            </span>
            <span className="pt-0.5 leading-relaxed text-ink-700">{i}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const base = serviceBySlug(slug);
  if (!base) notFound();
  const useEn = locale === "en" && Boolean(base.en);
  const s = useEn && base.en ? { ...base, ...base.en } : base;

  const leadSlug =
    slug === "employer-registration" ? "employer_assistance" : slug.replace(/-/g, "_");

  return (
    <div>
      <PageHero
        width="narrow"
        icon={serviceIcon(slug)}
        eyebrow={useEn ? "Service" : "सेवा"}
        title={locale === "en" ? s.titleEn : s.titleNe}
        lead={s.description}
        crumbs={[
          { label: locale === "en" ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: locale === "en" ? "Services" : "सेवाहरू", href: "/services" },
          { label: locale === "en" ? s.titleEn : s.titleNe },
        ]}
      />

      <div className="container-narrow py-12">
        <BulletSection title={useEn ? "Who needs this?" : "कसलाई चाहिन्छ?"} items={s.whoNeeds} />
        <BulletSection title={useEn ? "Common problems" : "सामान्य समस्या"} items={s.commonProblems} />
        <StepsSection title={useEn ? "What we do" : "हामी के गर्छौँ"} items={s.ourRole} />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="surface p-5">
            <span className="eyebrow">{useEn ? "Limitations" : "सीमा"}</span>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{s.limitations}</p>
          </div>
          <div className="surface p-5">
            <span className="eyebrow">{useEn ? "Fees" : "शुल्क"}</span>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              {useEn
                ? "Service fees and any official fees are communicated separately and in advance."
                : "सेवा शुल्क र आधिकारिक शुल्क (भए) छुट्टाछुट्टै र अग्रिम रूपमा जानकारी गराइन्छ।"}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href={`/request?service=${leadSlug}`} className="btn-accent btn-lg flex-1">
            {useEn ? "Start a request" : "अनुरोध सुरु गर्नुहोस्"}
            <Icon name="arrowRight" size={18} />
          </Link>
          {s.checklistSlug && (
            <Link href={`/checklists/${s.checklistSlug}`} className="btn-outline btn-lg flex-1">
              <Icon name="list" size={18} />
              {useEn ? "View the document checklist" : "कागजात checklist हेर्नुहोस्"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
