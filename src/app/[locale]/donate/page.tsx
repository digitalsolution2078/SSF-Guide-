import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "सहयोग गर्नुहोस् — Support SSF Guide Nepal",
  description:
    "SSF Guide Nepal पूर्ण निःशुल्क छ। मन परे रु. १ देखि जति पनि — FonePay/eSewa QR बाट सहयोग गर्न सक्नुहुन्छ।",
};

export default async function DonatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-xl px-4 py-10 text-center">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        ❤️ {isEn ? "Support this platform" : "यो platform लाई सहयोग गर्नुहोस्"}
      </h1>
      {isEn ? (
        <p className="mt-3 text-gray-600">
          SSF Guide Nepal is <strong>completely free</strong> for everyone — but
          building, running, and keeping it updated costs real money. If you
          find this platform useful, you can contribute{" "}
          <strong>anything from Rs. 1 upward</strong> — whatever feels right.
        </p>
      ) : (
        <p className="mt-3 text-gray-600">
          SSF Guide Nepal सबैका लागि <strong>पूर्ण निःशुल्क</strong> छ — तर यसलाई
          बनाउन, चलाउन र अद्यावधिक राख्न राम्रै खर्च लाग्छ। तपाईंलाई यो platform
          उपयोगी लागेको छ भने <strong>रु. १ देखि जति पनि</strong> — जति मन लाग्छ,
          त्यति सहयोग गर्न सक्नुहुन्छ।
        </p>
      )}

      <div className="mx-auto mt-8 max-w-sm rounded-2xl border-2 border-primary-200 bg-white p-6 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/donation-qr.jpg"
          alt="Digital Solution FonePay/eSewa donation QR — scan to contribute"
          className="mx-auto w-full rounded-xl"
        />
        <p className="mt-4 text-sm font-semibold text-gray-800">
          {isEn
            ? "Scan with FonePay / eSewa / Mobile Banking"
            : "FonePay / eSewa / Mobile Banking बाट scan गर्नुहोस्"}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Digital Solution · Terminal: 2222020011490667 · Pokhara Lekhnath MP
        </p>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        {isEn
          ? "Contributions are entirely voluntary — everything on the platform stays free either way. Your small contribution keeps new guides, calculators, and the AI assistant running. Thank you! 🙏"
          : "सहयोग पूर्ण स्वैच्छिक हो — नगर्दा पनि platform का सबै सुविधा उस्तै निःशुल्क रहन्छन्। तपाईंको सानो सहयोगले नयाँ guides, calculators र AI सुविधा चलिरहन्छन्। धन्यवाद! 🙏"}
      </p>

      <Link
        href="/"
        className="mt-8 inline-block rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700"
      >
        {isEn ? "← Back to Home" : "← Home फर्कनुहोस्"}
      </Link>
    </div>
  );
}
