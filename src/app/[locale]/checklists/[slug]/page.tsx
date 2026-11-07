import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { checklists, checklistBySlug, CHECKLIST_CONFIRM_NOTE } from "@/content/checklists";
import { videoById } from "@/content/videos";
import { SourceBlock, VerificationBadge } from "@/components/verification-badge";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { TickableChecklist } from "@/components/tickable-checklist";
import { Link } from "@/i18n/navigation";
import { pageSeo } from "@/lib/seo";
import { Icon } from "@/components/icons";
import { Callout, PageHero } from "@/components/ui";

export function generateStaticParams() {
  return checklists.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const base = checklistBySlug(slug);
  if (!base) return pageSeo({ locale, path: `/checklists/${slug}` });
  const useEn = locale === "en" && Boolean(base.en);
  const processName = useEn && base.en ? base.en.processName : base.processName;
  return pageSeo({
    locale,
    path: `/checklists/${slug}`,
    title: `${processName} — Checklist`,
    description:
      locale === "en"
        ? `Step-by-step document checklist and process for ${processName} under Nepal's SSF.`
        : `${processName} का लागि आवश्यक कागजात र प्रक्रिया — SSF checklist।`,
  });
}

export default async function ChecklistPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const base = checklistBySlug(slug);
  if (!base) notFound();
  const isEn = locale === "en";
  const useEn = isEn && Boolean(base.en);
  const checklist = useEn && base.en ? { ...base, ...base.en } : base;

  const checklistVideos = (checklist.videoIds ?? [])
    .map((id) => videoById(id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  return (
    <div>
      <PageHero
        width="narrow"
        icon="list"
        eyebrow={isEn ? "Document checklist" : "कागजात checklist"}
        title={checklist.processName}
        lead={checklist.applicableUser}
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "Checklists", href: "/checklists" },
          { label: checklist.processName },
        ]}
      >
        <div className="flex flex-wrap items-center gap-2">
          <VerificationBadge lastVerified={checklist.lastVerified} />
        </div>
      </PageHero>

      <section className="container-narrow py-10">
        {locale === "en" && !base.en && (
          <div className="mb-6">
            <Callout tone="info">
              This checklist is currently in Nepali — English translation coming soon.
            </Callout>
          </div>
        )}

        <TickableChecklist slug={checklist.slug} items={checklist.items} />

        <section className="card mt-6 p-5">
          <div className="flex items-center gap-3">
            <span className="icon-tile h-9 w-9">
              <Icon name="mapPin" size={18} />
            </span>
            <h2 className="text-lg">
              {useEn ? "Where/how to submit" : "कहाँ/कसरी बुझाउने"}
            </h2>
          </div>
          <p className="mt-3 text-sm text-ink-700">{checklist.whereCompleted}</p>
          <ol className="mt-3 space-y-2 text-sm text-ink-700">
            {checklist.expectedWorkflow.map((w, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary-100 font-display text-xs font-bold text-primary-700">
                  {i + 1}
                </span>
                <span>{w}</span>
              </li>
            ))}
          </ol>
        </section>

        {checklist.commonErrors.length > 0 && (
          <div className="mt-6">
            <Callout tone="warn" title={useEn ? "Common mistakes" : "सामान्य गल्ती"}>
              <ul className="list-inside list-disc space-y-1">
                {checklist.commonErrors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </Callout>
          </div>
        )}

        <p className="mt-6 flex gap-2 text-sm text-ink-500">
          <Icon name="info" size={16} className="mt-0.5 shrink-0 text-ink-400" />
          <span>
            {useEn
              ? "The final list is as prescribed by SSF — check the official notice before submitting."
              : CHECKLIST_CONFIRM_NOTE}
          </span>
        </p>

        {checklistVideos.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-4 print:hidden sm:grid-cols-2">
            {checklistVideos.map((v) => (
              <YouTubeEmbed key={v.youtubeId} id={v.youtubeId} title={v.title} />
            ))}
          </div>
        )}

        <div className="mt-8">
          <SourceBlock sourceKeys={checklist.sourceKeys} />
        </div>

        <div className="mt-8 print:hidden">
          <Link href={checklist.relatedServiceHref ?? "/request"} className="btn-accent btn-lg w-full">
            {useEn
              ? "Need help with this process? Contact Digital Solution"
              : "यो प्रक्रियामा सहायता चाहिन्छ? Digital Solution लाई सम्पर्क गर्नुहोस्"}
            <Icon name="arrowRight" size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
