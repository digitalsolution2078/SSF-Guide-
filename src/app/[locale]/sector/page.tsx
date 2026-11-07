import type { Metadata } from "next";
import { sectors } from "@/content/sectors";
import { sectorIcon } from "@/content/icon-map";
import { Link } from "@/i18n/navigation";
import { pageSeo } from "@/lib/seo";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return pageSeo({
    locale,
    path: "/sector",
    title: isEn
      ? "Which sector are you in? — Formal, Informal, Self-employed, Foreign SSF"
      : "कुन सेक्टरबाट SSF हेर्ने? — औपचारिक, अनौपचारिक, स्वरोजगार, वैदेशिक",
    description: isEn
      ? "Pick your sector to see how much you contribute, where it goes (pension/gratuity/insurance) and which guides and processes apply — all in one place."
      : "आफ्नो सेक्टर रोज्नुहोस् — तपाईंको योगदान कति, कहाँ (पेन्सन/उपदान/बीमा) जान्छ, कस्ता guide र प्रक्रिया लागू हुन्छन् एकै ठाउँमा हेर्नुहोस्।",
  });
}

export default async function SectorIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div>
      <PageHero
        icon="compass"
        eyebrow={isEn ? "By sector" : "क्षेत्र अनुसार"}
        title={isEn ? "Browse SSF by your sector" : "आफ्नो सेक्टरबाट SSF हेर्नुहोस्"}
        lead={
          isEn
            ? "Pick the sector you contribute from. You'll see how much you pay, exactly where it goes (pension / gratuity / insurance), and the guides and steps that apply to you."
            : "तपाईं कुन सेक्टरबाट योगदान गर्नुहुन्छ रोज्नुहोस् — कति तिर्नुहुन्छ, कहाँ (पेन्सन/उपदान/बीमा) जान्छ, र तपाईंलाई लागू हुने guide र प्रक्रिया हेर्नुहोस्।"
        }
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: isEn ? "Sectors" : "सेक्टरहरू" }]}
      />

      <section className="container-page py-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sectors.map((s) => (
            <Link key={s.slug} href={`/sector/${s.slug}`} className="card card-hover group flex flex-col p-5">
              <span className="icon-tile">
                <Icon name={sectorIcon(s.key)} size={20} />
              </span>
              <p className="mt-4 font-display text-lg font-bold leading-snug text-ink-900 group-hover:text-primary-700">
                {isEn ? s.titleEn : s.titleNe}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                {isEn ? s.taglineEn : s.taglineNe}
              </p>
              <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-primary-700">
                {isEn ? "Explore" : "हेर्नुहोस्"}
                <Icon name="arrowRight" size={14} className="transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
