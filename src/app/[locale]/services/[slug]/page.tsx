import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, serviceBySlug } from "@/content/services";
import { Link } from "@/i18n/navigation";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return {};
  return { title: s.titleNe, description: s.description };
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-6">
      <h2 className="font-bold text-primary-900">{title}</h2>
      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-700">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </section>
  );
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) notFound();

  const leadSlug =
    slug === "employer-registration" ? "employer_assistance" : slug.replace(/-/g, "_");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="text-sm text-gray-500">
        <Link href="/services" className="hover:text-primary-600">
          Services
        </Link>
      </nav>
      <h1 className="mt-2 text-2xl font-bold text-primary-900 md:text-3xl">
        {s.titleNe}
      </h1>
      <p className="mt-3 text-gray-700">{s.description}</p>

      <Section title="कसलाई चाहिन्छ?" items={s.whoNeeds} />
      <Section title="सामान्य समस्या" items={s.commonProblems} />
      <Section title="हामी के गर्छौँ" items={s.ourRole} />

      <p className="mt-6 rounded-lg border-l-4 border-action-500 bg-action-50 px-4 py-3 text-sm text-gray-800">
        {s.limitations} सेवा शुल्क र आधिकारिक शुल्क (भए) छुट्टाछुट्टै र अग्रिम रूपमा
        जानकारी गराइन्छ।
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {s.checklistSlug && (
          <Link
            href={`/checklists/${s.checklistSlug}`}
            className="rounded-xl border-2 border-primary-200 bg-white p-4 text-center text-sm font-semibold text-primary-800 hover:border-primary-400"
          >
            📋 कागजात checklist हेर्नुहोस्
          </Link>
        )}
        <Link
          href={`/request?service=${leadSlug}`}
          className="rounded-xl bg-action-500 p-4 text-center text-sm font-semibold text-white hover:bg-action-600"
        >
          अनुरोध सुरु गर्नुहोस् →
        </Link>
      </div>
    </div>
  );
}
