"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { courseBySlug, lessonHref } from "@/content/courses";
import { toNe } from "@/content/ssf-stats";
import { trackEvent } from "@/lib/analytics";
import { useCourseProgress } from "@/lib/course-progress";
import { Icon } from "./icons";

/**
 * Small course strip shown at the top of an article that is a course lesson:
 * "Course: X · Lesson 3/8 · Mark complete / Next lesson". Minimal by design.
 */
export function LessonProgress({ courseSlug, lessonSlug }: { courseSlug: string; lessonSlug: string }) {
  const locale = useLocale();
  const isEn = locale === "en";
  const n = (s: string | number) => (isEn ? String(s) : toNe(String(s)));
  const course = courseBySlug(courseSlug);
  const { all, markLesson } = useCourseProgress();
  if (!course) return null;
  const index = course.lessons.findIndex((l) => l.slug === lessonSlug);
  if (index < 0) return null;
  const p = all[course.slug];
  const done = p?.lessons.includes(lessonSlug) ?? false;
  const nextLesson = course.lessons[index + 1];
  const nextHref = nextLesson ? lessonHref(course, nextLesson) : `/school/courses/${course.slug}/quiz`;

  function complete() {
    markLesson(course!.slug, lessonSlug, true);
    trackEvent("course_progress", { course: course!.slug, lesson: lessonSlug });
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-primary-200 bg-primary-50 px-3.5 py-2.5 text-sm print:hidden">
      <Icon name="grad" size={16} className="shrink-0 text-primary-600" />
      <span className="min-w-0 text-ink-700">
        <span className="text-ink-500">{isEn ? "Course:" : "कोर्स:"}</span>{" "}
        <Link href={`/school/courses/${course.slug}`} className="font-semibold text-primary-800 hover:underline">
          {isEn ? course.titleEn : course.titleNe}
        </Link>
        <span className="text-ink-400"> · </span>
        <span>
          {isEn ? "Lesson" : "पाठ"} {n(index + 1)}/{n(course.lessons.length)}
        </span>
      </span>
      <span className="ml-auto flex flex-wrap items-center gap-2">
        {done ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
            <Icon name="checkCircle" size={14} />
            {isEn ? "Completed" : "पूरा भयो"}
          </span>
        ) : (
          <button type="button" onClick={complete} className="btn-primary btn-sm">
            <Icon name="check" size={14} />
            {isEn ? "Mark complete" : "पूरा भयो"}
          </button>
        )}
        <Link href={nextHref} onClick={() => !done && complete()} className="btn-outline btn-sm">
          {nextLesson ? (isEn ? "Next lesson" : "अर्को पाठ") : isEn ? "Take quiz" : "Quiz दिनुहोस्"}
          <Icon name="arrowRight" size={14} />
        </Link>
      </span>
    </div>
  );
}
