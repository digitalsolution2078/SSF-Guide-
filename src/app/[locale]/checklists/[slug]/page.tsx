import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { checklists, checklistBySlug, CHECKLIST_CONFIRM_NOTE } from "@/content/checklists";
import { videoById } from "@/content/videos";
import { SourceBlock, VerificationBadge } from "@/components/verification-badge";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { TickableChecklist } from "@/components/tickable-checklist";
import { Link } from "@/i18n/navigation";

export function generateStaticParams() {
  return checklists.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const checklist = checklistBySlug(slug);
  if (!checklist) return {};
  return { title: `${checklist.processName} — Checklist` };
}

export default async function ChecklistPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const base = checklistBySlug(slug);
  if (!base) notFound();
  const useEn = locale === "en" && Boolean(base.en);
  const checklist = useEn && base.en ? { ...base, ...base.en } : base;

  const checklistVideos = (checklist.videoIds ?? [])
    .map((id) => videoById(id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="text-sm text-gray-500 print:hidden">
        <Link href="/checklists" className="hover:text-primary-600">
          Checklists
        </Link>
      </nav>
      <h1 className="mt-2 text-2xl font-bold text-primary-900 md:text-3xl">
        📋 {checklist.processName}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <VerificationBadge lastVerified={checklist.lastVerified} />
        <span className="text-sm text-gray-500">{checklist.applicableUser}</span>
      </div>

      {locale === "en" && !base.en && (
        <p className="mt-4 rounded-lg bg-primary-50 px-4 py-2 text-sm text-gray-600">
          🌐 This checklist is currently in Nepali — English translation coming soon.
        </p>
      )}

      <div className="mt-6">
        <TickableChecklist slug={checklist.slug} items={checklist.items} />
      </div>

      <section className="mt-8 rounded-xl border border-primary-100 bg-white p-5">
        <p className="font-semibold text-primary-900">
          {useEn ? "Where/how to submit" : "कहाँ/कसरी बुझाउने"}
        </p>
        <p className="mt-1 text-sm text-gray-700">{checklist.whereCompleted}</p>
        <ol className="mt-3 list-inside list-decimal space-y-1 text-sm text-gray-700">
          {checklist.expectedWorkflow.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ol>
      </section>

      {checklist.commonErrors.length > 0 && (
        <section className="mt-6 rounded-xl border-l-4 border-action-500 bg-action-50 p-5">
          <p className="font-semibold text-gray-900">
            ⚠️ {useEn ? "Common mistakes" : "सामान्य गल्ती"}
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-800">
            {checklist.commonErrors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-6 text-sm text-gray-500">
        💡{" "}
        {useEn
          ? "The final list is as prescribed by SSF — check the official notice before submitting."
          : CHECKLIST_CONFIRM_NOTE}
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

      <Link
        href={checklist.relatedServiceHref ?? "/request"}
        className="mt-6 block rounded-xl bg-action-500 p-4 text-center text-sm font-semibold text-white hover:bg-action-600 print:hidden"
      >
        {useEn
          ? "Need help with this process? Contact Digital Solution →"
          : "यो प्रक्रियामा सहायता चाहिन्छ? Digital Solution लाई सम्पर्क गर्नुहोस् →"}
      </Link>
    </div>
  );
}
