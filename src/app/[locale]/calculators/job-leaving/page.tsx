import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { JobLeavingGuide } from "@/components/job-leaving-guide";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/job-leaving",
    title: "Job Leaving Scenario Guide",
    description:
      "जागिर छाड्दा वा अवकाश लिँदा SSF को रकम के हुन्छ — तपाईंको अवस्थाअनुसारको निर्देशित प्रारम्भिक जानकारी।",
  });
}

export default async function JobLeavingPage({
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
        icon="briefcase"
        title="Job Leaving Scenario Guide"
        lead="५ वटा प्रश्नको उत्तर दिनुहोस् — निवृत्तभरण र अवकाश सुविधाको के हुन्छ, तपाईंको अवस्थाअनुसार देखिन्छ।"
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "Financial Tools", href: "/calculators" },
          { label: "Job Leaving Scenario Guide" },
        ]}
      />
      <section className="container-narrow py-10">
        <JobLeavingGuide />
      </section>
    </div>
  );
}
