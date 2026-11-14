import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courses, courseBySlug, lessonHref } from "@/content/courses";
import { toNe } from "@/content/ssf-stats";
import { CourseSyllabus } from "@/components/course-syllabus";
import { Icon } from "@/components/icons";
import { Callout, PageHero } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { absoluteUrl, pageSeo, SITE_URL } from "@/lib/seo";

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
  if (!course) return pageSeo({ locale, path: `/school/courses/${slug}` });
  const isEn = locale === "en";
  return pageSeo({
    locale,
    path: `/school/courses/${slug}`,
    title: `${isEn ? course.titleEn : course.titleNe} | SSF School`,
    description: isEn ? course.descEn : course.descNe,
  });
}

const LEVEL: Record<string, { ne: string; en: string }> = {
  beginner: { ne: "सुरुवाती", en: "Beginner" },
  intermediate: { ne: "मध्यम", en: "Intermediate" },
  advanced: { ne: "उन्नत", en: "Advanced" },
};

export default async function CoursePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const course = courseBySlug(slug);
  if (!course) notFound();
  const isEn = locale === "en";
  const n = (s: string | number) => (isEn ? String(s) : toNe(String(s)));
  const url = absoluteUrl(locale, `/school/courses/${course.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: isEn ? course.titleEn : course.titleNe,
    description: isEn ? course.descEn : course.descNe,
    url,
    inLanguage: locale,
    isAccessibleForFree: true,
    educationalLevel: course.level,
    timeRequired: `PT${course.minutes}M`,
    numberOfLessons: course.lessons.length,
    provider: { "@type": "Organization", name: "SSF Guide Nepal · Digital Solution", url: SITE_URL },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `PT${course.minutes}M`,
    },
    syllabusSections: course.lessons.map((l, i) => ({
      "@type": "Syllabus",
      position: i + 1,
      name: isEn ? l.titleEn : l.titleNe,
      url: `${SITE_URL}${locale === "en" ? "/en" : ""}${lessonHref(course, l)}`,
      timeRequired: `PT${l.minutes}M`,
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        width="narrow"
        icon={course.icon}
        eyebrow={`SSF School · ${isEn ? LEVEL[course.level].en : LEVEL[course.level].ne} · ~${n(course.minutes)} ${isEn ? "min" : "मिनेट"}`}
        title={isEn ? course.titleEn : course.titleNe}
        lead={isEn ? course.descEn : course.descNe}
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "SSF School", href: "/school" },
          { label: isEn ? "Courses" : "कोर्स", href: "/school/courses" },
          { label: isEn ? course.titleEn : course.titleNe },
        ]}
      >
        <div className="flex flex-wrap gap-2 text-sm text-ink-600">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1">
            <Icon name="book" size={14} className="text-primary-600" />
            {n(course.lessons.filter((l) => l.kind === "article").length)} {isEn ? "guides" : "guide"}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1">
            <Icon name="eye" size={14} className="text-primary-600" />
            {n(course.lessons.filter((l) => l.kind === "video").length)} {isEn ? "videos" : "भिडियो"}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1">
            <Icon name="grad" size={14} className="text-primary-600" />
            {n(course.quiz.length)} {isEn ? "quiz questions" : "quiz प्रश्न"}
          </span>
        </div>
      </PageHero>

      <section className="container-narrow py-10">
        <CourseSyllabus courseSlug={course.slug} />
        <div className="mt-8">
          <Callout tone="info">
            {isEn
              ? "Lessons open the full source-verified guide or play the video right here. Your progress is stored only in this browser; the certificate is educational, not an official SSF document."
              : "पाठले पूरा स्रोत-प्रमाणित guide खोल्छ वा भिडियो यहीँ चलाउँछ। प्रगति यही browser मा मात्र रहन्छ; प्रमाणपत्र शैक्षिक हो, आधिकारिक SSF कागजात होइन।"}
          </Callout>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/school/courses" className="btn-ghost -ml-2">
            <Icon name="list" size={16} />
            {isEn ? "All courses" : "सबै कोर्स"}
          </Link>
        </div>
      </section>
    </div>
  );
}
