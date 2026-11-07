import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/donate",
    title: "सहयोग गर्नुहोस् — Support SSF Guide Nepal",
    description: "SSF Guide Nepal पूर्ण निःशुल्क छ। मन परे रु. १ देखि जति पनि — FonePay/eSewa QR बाट सहयोग गर्न सक्नुहुन्छ।",
  });
}

export default async function DonatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div>
      <PageHero
        width="narrow"
        icon="heart"
        tone="primary"
        eyebrow={isEn ? "Support" : "सहयोग"}
        title={isEn ? "Support this platform" : "यो platform लाई सहयोग गर्नुहोस्"}
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: isEn ? "Donate" : "सहयोग" }]}
      />

      <div className="container-narrow py-12">
        <div className="mx-auto max-w-xl text-center">
          {isEn ? (
            <p className="text-base leading-relaxed text-ink-600 md:text-lg">
              SSF Guide Nepal is <strong className="text-ink-900">completely free</strong> for everyone — but
              building, running, and keeping it updated costs real money. If you
              find this platform useful, you can contribute{" "}
              <strong className="text-ink-900">anything from Rs. 1 upward</strong> — whatever feels right.
            </p>
          ) : (
            <p className="text-base leading-relaxed text-ink-600 md:text-lg">
              SSF Guide Nepal सबैका लागि <strong className="text-ink-900">पूर्ण निःशुल्क</strong> छ — तर यसलाई
              बनाउन, चलाउन र अद्यावधिक राख्न राम्रै खर्च लाग्छ। तपाईंलाई यो platform
              उपयोगी लागेको छ भने <strong className="text-ink-900">रु. १ देखि जति पनि</strong> — जति मन लाग्छ,
              त्यति सहयोग गर्न सक्नुहुन्छ।
            </p>
          )}

          <div className="card mx-auto mt-8 max-w-sm p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/donation-qr.jpg"
              alt="Digital Solution FonePay/eSewa donation QR — scan to contribute"
              className="mx-auto w-full rounded-xl"
            />
            <p className="mt-4 text-sm font-semibold text-ink-900">
              {isEn
                ? "Scan with FonePay / eSewa / Mobile Banking"
                : "FonePay / eSewa / Mobile Banking बाट scan गर्नुहोस्"}
            </p>
            <p className="mt-1 text-xs text-ink-500">
              Digital Solution · Terminal: 2222020011490667 · Pokhara Lekhnath MP
            </p>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-ink-500">
            {isEn
              ? "Contributions are entirely voluntary — everything on the platform stays free either way. Your small contribution keeps new guides, calculators, and the AI assistant running. Thank you!"
              : "सहयोग पूर्ण स्वैच्छिक हो — नगर्दा पनि platform का सबै सुविधा उस्तै निःशुल्क रहन्छन्। तपाईंको सानो सहयोगले नयाँ guides, calculators र AI सुविधा चलिरहन्छन्। धन्यवाद!"}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-primary btn-lg">
              <Icon name="home" size={18} />
              {isEn ? "Back to Home" : "Home फर्कनुहोस्"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
