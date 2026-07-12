import { useLocale } from "next-intl";
import { sourceByKey } from "@/content/sources";
import { Link } from "@/i18n/navigation";

export function VerificationBadge({ lastVerified }: { lastVerified: string }) {
  const locale = useLocale();
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
      ✓ {locale === "en" ? "Verified" : "प्रमाणित"}: {lastVerified}
    </span>
  );
}

export function SourceBlock({ sourceKeys }: { sourceKeys: string[] }) {
  const locale = useLocale();
  const isEn = locale === "en";
  const entries = sourceKeys
    .map((k) => sourceByKey(k))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  if (entries.length === 0) return null;

  return (
    <div className="rounded-xl border border-primary-100 bg-primary-50/50 p-4">
      <p className="text-sm font-semibold text-primary-900">
        📜 {isEn ? "Official sources" : "आधिकारिक स्रोत"}
      </p>
      <ul className="mt-2 space-y-1 text-sm text-gray-700">
        {entries.map((s) => (
          <li key={s.key}>
            <Link href="/sources" className="hover:text-primary-600">
              {s.title}
            </Link>{" "}
            <span className="text-gray-400">({s.date})</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-gray-500">
        {isEn
          ? "For legal purposes always consult the original documents and latest amendments. Rates and limits can change through amendments."
          : "कानुनी प्रयोजनका लागि सधैँ मूल दस्तावेज र पछिल्ला संशोधन हेर्नुहोस्। दर र सीमा संशोधनद्वारा परिवर्तन हुन सक्छन्।"}
      </p>
    </div>
  );
}
