import { Link } from "@/i18n/navigation";
import { Icon } from "./icons";

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
    <div className="container-narrow py-16">
      <div className="surface p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
          <Icon name="clock" size={28} />
        </span>
        <h1 className="mt-5 text-2xl md:text-3xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-600">
          {description ??
            "यो पृष्ठ निर्माणाधीन छ — चाँडै उपलब्ध हुनेछ। यहाँको जानकारी स्रोतसहित प्रमाणित गरेर मात्र प्रकाशित गरिन्छ।"}
        </p>
        <p className="mt-3">
          <span className="badge-neutral">{stage}</span>
        </p>
        <div className="mt-8">
          <Link href="/calculators/contribution" className="btn-primary btn-lg">
            Contribution Calculator प्रयोग गर्नुहोस्
            <Icon name="arrowRight" size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
