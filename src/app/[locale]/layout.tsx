import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Noto_Sans_Devanagari, Anek_Devanagari } from "next/font/google";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BottomNav } from "@/components/bottom-nav";
import { ShareBar } from "@/components/share-bar";
import { InstallAppBanner } from "@/components/install-app-banner";
import { FloatingActions } from "@/components/floating-actions";
import { Analytics } from "@/components/analytics";
import { PushOptIn } from "@/components/push-optin";
import "../globals.css";

// Body — Noto Sans Devanagari: the most legible Devanagari UI face, with a
// matched Latin so mixed Nepali/English lines sit on one baseline.
const bodyFont = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  display: "swap",
  variable: "--font-body",
});

// Display — Anek Devanagari: modern, confident headlines (Devanagari + Latin).
const displayFont = Anek_Devanagari({
  subsets: ["devanagari", "latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ssf.digitalsolutionnepal.com"),
  title: {
    default: "SSF Guide Nepal — सामाजिक सुरक्षा कोष सम्बन्धी सबै जानकारी",
    template: "%s | SSF Guide Nepal",
  },
  description:
    "SSF बुझ्नुहोस्, Contribution Calculate गर्नुहोस्, Pension projection हेर्नुहोस्, आबद्ध अस्पताल खोज्नुहोस्। Digital Solution द्वारा सञ्चालित स्वतन्त्र प्लेटफर्म — आधिकारिक SSF वेबसाइट होइन।",
  keywords: [
    "SSF Nepal",
    "सामाजिक सुरक्षा कोष",
    "Social Security Fund Nepal",
    "SSF contribution calculator",
    "SSF pension",
    "SSF KYC",
    "SSF registration",
    "SSF hospital list",
    "SSF आबद्ध अस्पताल",
    "वैदेशिक रोजगार SSF",
  ],
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: "SSF Guide Nepal",
    title: "SSF Guide Nepal — सामाजिक सुरक्षा कोष सम्बन्धी सबै जानकारी",
    description:
      "Guides, calculators, आबद्ध अस्पताल सूची, SSF Assessment र AI सहायक — सबै एकै ठाउँमा। Powered by Digital Solution.",
    url: "https://ssf.digitalsolutionnepal.com",
    locale: "ne_NP",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "SSF Guide Nepal" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SSF Guide Nepal — सामाजिक सुरक्षा कोष सम्बन्धी सबै जानकारी",
    description:
      "SSF बुझ्नुहोस्, Contribution Calculate गर्नुहोस्, Pension projection हेर्नुहोस्, आबद्ध अस्पताल खोज्नुहोस्।",
    images: ["/og.png"],
  },
  // Search Console / Bing verification — set the token in the VPS .env so the
  // domain can be verified and the sitemap submitted.
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
      : {}),
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
        "Independent educational platform about Nepal's Social Security Fund (SSF) — guides, calculators, affiliated-hospital directory, assessment, and AI assistant.",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://ssf.digitalsolutionnepal.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
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
    <html lang={locale} className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
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
          <BottomNav />
          <FloatingActions />
          <InstallAppBanner />
          <PushOptIn />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
