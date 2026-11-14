import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { MySsfDashboard } from "@/components/my-ssf-dashboard";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return pageSeo({
    locale,
    path: "/my-ssf",
    title: isEn ? "My SSF — your contribution, pension, loans and benefits in one snapshot" : "My SSF — तपाईंको योगदान, पेन्सन, सापटी र सुविधा एकै snapshot मा",
    description: isEn
      ? "Enter salary, age and months contributed once; see your monthly contribution, projected pension, which SSF loans you qualify for, medical cover status, upcoming milestones and nearby hospitals. Saved only in your browser."
      : "तलब, उमेर र योगदान महिना एकपटक राख्नुहोस्; मासिक योगदान, अनुमानित पेन्सन, योग्य सापटी, उपचार सुविधा, आगामी milestone र नजिकका अस्पताल हेर्नुहोस्। तपाईंकै browser मा मात्र सेभ हुन्छ।",
  });
}

export default async function MySsfPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div>
      <PageHero
        tone="primary"
        icon="user"
        eyebrow={isEn ? "Personal snapshot · private" : "व्यक्तिगत snapshot · निजी"}
        title={isEn ? "My SSF" : "My SSF — मेरो सामाजिक सुरक्षा"}
        lead={
          isEn
            ? "Three numbers once — then every calculator, loan check and milestone on this site is already filled in for you. Nothing leaves your browser."
            : "तीन अङ्क एकपटक — त्यसपछि यो साइटका सबै क्याल्कुलेटर, सापटी जाँच र milestone तपाईंका लागि भरिइसकेका हुन्छन्। Browser बाहिर केही जाँदैन।"
        }
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: "My SSF" }]}
      />
      <section className="container-page py-10">
        <MySsfDashboard />
      </section>
    </div>
  );
}
