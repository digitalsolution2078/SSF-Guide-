import type { Metadata } from "next";
import { courses } from "@/content/courses";
import { toNe } from "@/content/ssf-stats";
import { CourseCards } from "@/components/course-cards";
import { Icon } from "@/components/icons";
import { Callout, PageHero } from "@/components/ui";
import { pageSeo } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return pageSeo({
    locale,
    path: "/school/courses",
    title: isEn ? "SSF School Courses — 4 guided paths with quiz & certificate" : "SSF School कोर्स — quiz र प्रमाणपत्रसहित ४ guided path",
    description: isEn
      ? "Learn SSF step by step: Basics, Contributor Pro, Employer Essentials and Migrant Worker. Each course is 6–10 lessons from verified guides and videos, a quiz and a printable educational certificate. Progress saves in your browser."
      : "SSF चरणबद्ध सिक्नुहोस्: Basics, Contributor Pro, Employer Essentials र Migrant Worker। हरेक कोर्समा प्रमाणित guide र भिडियोका ६–१० पाठ, quiz र print गर्न मिल्ने शैक्षिक प्रमाणपत्र। प्रगति तपाईंको browser मा सुरक्षित रहन्छ।",
  });
}

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  const totalLessons = courses.reduce((s, c) => s + c.lessons.length, 0);
  const n = (s: string | number) => (isEn ? String(s) : toNe(String(s)));

  return (
    <div>
      <PageHero
        icon="grad"
        eyebrow="SSF School"
        title={isEn ? "Courses" : "कोर्सहरू"}
        lead={
          isEn
            ? `${courses.length} guided paths, ${totalLessons} lessons built from our verified guides and videos. Finish the quiz (70%) to earn a printable educational certificate. No account — progress is saved in this browser.`
            : `${n(courses.length)} guided path, प्रमाणित guide र भिडियोबाट बनेका ${n(totalLessons)} पाठ। Quiz (७०%) पास गरे print गर्न मिल्ने शैक्षिक प्रमाणपत्र। खाता चाहिँदैन — प्रगति यही browser मा सुरक्षित रहन्छ।`
        }
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "SSF School", href: "/school" },
          { label: isEn ? "Courses" : "कोर्स" },
        ]}
      >
        <div className="flex flex-wrap gap-2 text-sm text-ink-600">
          {[
            { icon: "book" as const, t: isEn ? "Source-verified lessons" : "स्रोत-प्रमाणित पाठ" },
            { icon: "checkCircle" as const, t: isEn ? "Quiz with explanations" : "व्याख्यासहित quiz" },
            { icon: "file" as const, t: isEn ? "Printable certificate" : "Print गर्न मिल्ने प्रमाणपत्र" },
          ].map((x) => (
            <span key={x.t} className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1">
              <Icon name={x.icon} size={14} className="text-primary-600" />
              {x.t}
            </span>
          ))}
        </div>
      </PageHero>

      <section className="container-page py-12 md:py-14">
        <CourseCards />
        <div className="mt-8">
          <Callout tone="info">
            {isEn
              ? "Certificates are educational, issued by SSF Guide Nepal (Digital Solution) — not by the Social Security Fund."
              : "प्रमाणपत्र शैक्षिक हो, SSF Guide Nepal (Digital Solution) ले जारी गरेको — सामाजिक सुरक्षा कोषले होइन।"}
          </Callout>
        </div>
      </section>
    </div>
  );
}
