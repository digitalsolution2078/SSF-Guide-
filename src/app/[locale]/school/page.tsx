import type { Metadata } from "next";
import { categories } from "@/content/categories";
import { articlesByCategory } from "@/content/articles";
import { videosByCategory } from "@/content/videos";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "SSF School — सिक्ने ठाउँ",
  description:
    "सामाजिक सुरक्षा कोष (SSF) का ८ विषयमा स्रोतसहित प्रमाणित guides, भिडियो र FAQ — SSF परिचयदेखि claims सम्म।",
};

export default function SchoolIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        🎓 SSF School
      </h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        Category रोज्नुहोस् — प्रत्येक विषयमा स्रोतसहित प्रमाणित guide, भिडियो र
        FAQ छन्।
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => {
          const articleCount = articlesByCategory(c.slug).length;
          const videoCount = videosByCategory(c.slug).length;
          return (
            <Link
              key={c.slug}
              href={`/school/${c.slug}`}
              className="rounded-xl border border-primary-100 bg-white p-5 shadow-sm transition hover:border-primary-400 hover:shadow"
            >
              <span className="text-3xl">{c.icon}</span>
              <p className="mt-2 font-semibold text-primary-900">{c.titleNe}</p>
              <p className="mt-1 text-sm text-gray-600">{c.description}</p>
              <p className="mt-3 text-xs text-gray-400">
                {articleCount > 0 && `${articleCount} guide`}
                {articleCount > 0 && videoCount > 0 && " · "}
                {videoCount > 0 && `${videoCount} भिडियो`}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
