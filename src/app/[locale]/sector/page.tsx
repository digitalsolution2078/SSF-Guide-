import type { Metadata } from "next";
import { sectors } from "@/content/sectors";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "कुन सेक्टरबाट SSF हेर्ने? — औपचारिक, अनौपचारिक, स्वरोजगार, वैदेशिक",
  description:
    "आफ्नो सेक्टर रोज्नुहोस् — तपाईंको योगदान कति, कहाँ (पेन्सन/उपदान/बीमा) जान्छ, कस्ता guide र प्रक्रिया लागू हुन्छन् एकै ठाउँमा हेर्नुहोस्।",
};

export default async function SectorIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        🧭 {isEn ? "Browse SSF by your sector" : "आफ्नो सेक्टरबाट SSF हेर्नुहोस्"}
      </h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        {isEn
          ? "Pick the sector you contribute from. You'll see how much you pay, exactly where it goes (pension / gratuity / insurance), and the guides and steps that apply to you."
          : "तपाईं कुन सेक्टरबाट योगदान गर्नुहुन्छ रोज्नुहोस् — कति तिर्नुहुन्छ, कहाँ (पेन्सन/उपदान/बीमा) जान्छ, र तपाईंलाई लागू हुने guide र प्रक्रिया हेर्नुहोस्।"}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sectors.map((s) => (
          <Link
            key={s.slug}
            href={`/sector/${s.slug}`}
            className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm transition hover:border-primary-400 hover:shadow"
          >
            <span className="text-4xl">{s.icon}</span>
            <p className="mt-3 text-lg font-bold text-primary-900">
              {isEn ? s.titleEn : s.titleNe}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {isEn ? s.taglineEn : s.taglineNe}
            </p>
            <span className="mt-3 inline-block text-sm font-semibold text-primary-700">
              {isEn ? "Explore →" : "हेर्नुहोस् →"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
