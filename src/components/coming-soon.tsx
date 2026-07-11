import { Link } from "@/i18n/navigation";

export function ComingSoon({
  title,
  stage,
  description,
}: {
  title: string;
  stage: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        {title}
      </h1>
      <p className="mt-4 text-gray-600">
        {description ??
          "यो पृष्ठ निर्माणाधीन छ — चाँडै उपलब्ध हुनेछ। यहाँको जानकारी स्रोतसहित प्रमाणित गरेर मात्र प्रकाशित गरिन्छ।"}
      </p>
      <p className="mt-2 text-sm text-gray-400">({stage})</p>
      <div className="mt-8">
        <Link
          href="/calculators/contribution"
          className="rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700"
        >
          Contribution Calculator प्रयोग गर्नुहोस् →
        </Link>
      </div>
    </div>
  );
}
