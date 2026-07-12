import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Mukta } from "next/font/google";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ShareBar } from "@/components/share-bar";
import { InstallAppBanner } from "@/components/install-app-banner";
import { FloatingActions } from "@/components/floating-actions";
import { Analytics } from "@/components/analytics";
import "../globals.css";

const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ssf.digitalsolutionnepal.com"),
  title: {
    default: "SSF Guide Nepal — सामाजिक सुरक्षा कोष सम्बन्धी सबै जानकारी",
    template: "%s | SSF Guide Nepal",
  },
  description:
    "SSF बुझ्नुहोस्, Contribution Calculate गर्नुहोस्, Pension projection हेर्नुहोस्। Digital Solution द्वारा सञ्चालित स्वतन्त्र प्लेटफर्म — आधिकारिक SSF वेबसाइट होइन।",
  keywords: [
    "SSF Nepal",
    "सामाजिक सुरक्षा कोष",
    "Social Security Fund Nepal",
    "SSF contribution calculator",
    "SSF pension",
    "SSF KYC",
    "SSF registration",
    "वैदेशिक रोजगार SSF",
  ],
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: "SSF Guide Nepal",
    title: "SSF Guide Nepal — सामाजिक सुरक्षा कोष सम्बन्धी सबै जानकारी",
    description:
      "Guides, calculators, SSF Assessment र AI सहायक — सबै एकै ठाउँमा। Powered by Digital Solution.",
    url: "https://ssf.digitalsolutionnepal.com",
    locale: "ne_NP",
  },
  other: { "theme-color": "#5B2D8E" },
};

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Digital Solution Pvt. Ltd.",
      url: "https://digitalsolutionnepal.com",
      telephone: "+9779705433699",
      email: "mail@digitalsolutionnepal.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Balodaya Chowk, Birauta, Ward No. 17",
        addressLocality: "Pokhara Metropolitan City",
        addressRegion: "Gandaki",
        addressCountry: "NP",
      },
      founder: { "@type": "Person", name: "Rabin Paudel", url: "https://rabinpaudel.com" },
      sameAs: [
        "https://facebook.com/rabinpaudelofficial",
        "https://youtube.com/@rabinpaudel",
        "https://tiktok.com/@digitalsolution2079",
        "https://rabinpaudel.com",
      ],
    },
    {
      "@type": "WebSite",
      name: "SSF Guide Nepal",
      url: "https://ssf.digitalsolutionnepal.com",
      inLanguage: ["ne", "en"],
      publisher: { "@type": "Organization", name: "Digital Solution", url: "https://digitalsolutionnepal.com" },
      description:
        "Independent educational platform about Nepal's Social Security Fund (SSF) — guides, calculators, assessment, and AI assistant.",
    },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={mukta.className}>
      <body className="flex min-h-screen flex-col">
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
        <NextIntlClientProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <ShareBar />
          <SiteFooter />
          <FloatingActions />
          <InstallAppBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
