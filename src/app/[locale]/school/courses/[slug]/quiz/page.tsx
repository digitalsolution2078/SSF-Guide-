import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courses, courseBySlug, QUIZ_PASS_PCT } from "@/content/courses";
import { toNe } from "@/content/ssf-stats";
import { CourseQuiz } from "@/components/course-quiz";
import { PageHero } from "@/components/ui";
import { pageSeo } from "@/lib/seo";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const course = courseBySlug(slug);
  if (!course) return pageSeo({ locale, path: `/school/courses/${slug}/quiz` });
  const isEn = locale === "en";
  return pageSeo({
    locale,
    path: `/school/courses/${slug}/quiz`,
    title: isEn ? `Quiz: ${course.titleEn} | SSF School` : `Quiz: ${course.titleNe} | SSF School`,
    description: isEn
      ? `${course.quiz.length} questions on ${course.titleEn}. Score ${QUIZ_PASS_PCT}% or more to earn a printable educational certificate.`
      : `${course.titleNe} का ${toNe(String(course.quiz.length))} प्रश्न। ${toNe(String(QUIZ_PASS_PCT))}% वा बढी ल्याए print गर्न मिल्ने शैक्षिक प्रमाणपत्र।`,
  });
}

export default async function CourseQuizPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const course = courseBySlug(slug);
  if (!course) notFound();
  const isEn = locale === "en";
  const n = (s: string | number) => (isEn ? String(s) : toNe(String(s)));

  return (
    <div>
      <div className="print:hidden">
        <PageHero
          width="narrow"
          icon="grad"
          eyebrow={isEn ? "Final quiz" : "अन्तिम quiz"}
          title={isEn ? course.titleEn : course.titleNe}
          lead={
            isEn
              ? `${course.quiz.length} questions, one at a time, with an explanation after every answer. Pass mark ${QUIZ_PASS_PCT}%.`
              : `${n(course.quiz.length)} प्रश्न, एक-एक गरी, हरेक उत्तरपछि व्याख्यासहित। पास अङ्क ${n(QUIZ_PASS_PCT)}%।`
          }
          crumbs={[
            { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
            { label: "SSF School", href: "/school" },
            { label: isEn ? "Courses" : "कोर्स", href: "/school/courses" },
            { label: isEn ? course.titleEn : course.titleNe, href: `/school/courses/${course.slug}` },
            { label: "Quiz" },
          ]}
        />
      </div>
      <section className="container-narrow py-10 print:py-0">
        <CourseQuiz courseSlug={course.slug} />
      </section>
    </div>
  );
}
