"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { courseBySlug, lessonHref, type CourseLesson } from "@/content/courses";
import { videoById } from "@/content/videos";
import { toNe } from "@/content/ssf-stats";
import { trackEvent } from "@/lib/analytics";
import { coursePercent, nextLesson, useCourseProgress } from "@/lib/course-progress";
import { Icon } from "./icons";
import { ProgressRing } from "./course-cards";
import { YouTubeEmbed } from "./youtube-embed";

/**
 * Course syllabus — lesson list with done ticks, a "Continue" button that
 * jumps to the next undone lesson, inline video lessons and per-lesson
 * mark-done buttons (localStorage via useCourseProgress).
 */
export function CourseSyllabus({ courseSlug }: { courseSlug: string }) {
  const locale = useLocale();
  const isEn = locale === "en";
  const n = (s: string | number) => (isEn ? String(s) : toNe(String(s)));
  const course = courseBySlug(courseSlug);
  const { all, ready, markLesson } = useCourseProgress();
  const [openVideo, setOpenVideo] = useState<string | null>(null);

  if (!course) return null;
  const p = all[course.slug];
  const pct = coursePercent(course, p);
  const next = nextLesson(course, p);
  const doneCount = course.lessons.filter((l) => p?.lessons.includes(l.slug)).length;
  const allLessonsDone = doneCount === course.lessons.length;

  function toggle(lesson: CourseLesson) {
    const isDone = p?.lessons.includes(lesson.slug) ?? false;
    markLesson(course!.slug, lesson.slug, !isDone);
    if (!isDone) trackEvent("course_progress", { course: course!.slug, lesson: lesson.slug });
  }

  function continueHref() {
    if (!next) return `/school/courses/${course!.slug}/quiz`;
    return lessonHref(course!, next);
  }

  return (
    <div>
      {/* progress summary */}
      <div className="card flex flex-wrap items-center gap-4 p-5">
        <ProgressRing pct={pct} size={56} label={`${n(pct)}%`} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink-900">
            {ready ? (isEn ? `${doneCount} of ${course.lessons.length} lessons done` : `${n(course.lessons.length)} मध्ये ${n(doneCount)} पाठ पूरा`) : "…"}
            {p?.completedAt && <span className="badge-health ml-2">{isEn ? `Quiz passed · ${p.quizScore}%` : `Quiz पास · ${n(p.quizScore ?? 0)}%`}</span>}
          </p>
          <p className="mt-0.5 text-sm text-ink-500">
            {allLessonsDone
              ? isEn
                ? "All lessons done — take the quiz to earn your certificate."
                : "सबै पाठ पूरा — प्रमाणपत्रका लागि quiz दिनुहोस्।"
              : isEn
                ? "Progress is saved in this browser only."
                : "प्रगति यही browser मा मात्र सुरक्षित रहन्छ।"}
          </p>
        </div>
        {next ? (
          <Link href={continueHref()} onClick={() => next.kind === "video" && setOpenVideo(next.slug)} className="btn-primary">
            {doneCount === 0 ? (isEn ? "Start course" : "कोर्स सुरु") : isEn ? "Continue" : "जारी राख्नुहोस्"}
            <Icon name="arrowRight" size={16} />
          </Link>
        ) : (
          <Link href={`/school/courses/${course.slug}/quiz`} className="btn-accent">
            <Icon name="grad" size={16} />
            {p?.completedAt ? (isEn ? "Retake quiz" : "फेरि quiz") : isEn ? "Take the quiz" : "Quiz दिनुहोस्"}
          </Link>
        )}
      </div>

      {/* lessons */}
      <ol className="mt-6 space-y-3">
        {course.lessons.map((lesson, i) => {
          const done = p?.lessons.includes(lesson.slug) ?? false;
          const isNext = next?.slug === lesson.slug;
          const video = lesson.kind === "video" ? videoById(lesson.videoId) : undefined;
          const open = lesson.kind === "video" && openVideo === lesson.slug;
          return (
            <li key={lesson.slug} id={`lesson-${lesson.slug}`} className={`card scroll-mt-24 p-4 ${isNext ? "border-primary-300 ring-1 ring-primary-200" : ""}`}>
              <div className="flex items-start gap-3.5">
                <button
                  type="button"
                  onClick={() => toggle(lesson)}
                  aria-pressed={done}
                  aria-label={done ? (isEn ? "Mark as not done" : "पूरा भएको हटाउनुहोस्") : isEn ? "Mark as done" : "पूरा भयो"}
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 font-display text-xs font-bold transition ${
                    done ? "border-emerald-500 bg-emerald-500 text-white" : "border-ink-300 text-ink-500 hover:border-primary-500 hover:text-primary-700"
                  }`}
                >
                  {done ? <Icon name="check" size={14} /> : n(i + 1)}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`badge ${lesson.kind === "video" ? "bg-action-50 text-action-700" : "bg-primary-50 text-primary-700"}`}>
                      <Icon name={lesson.kind === "video" ? "eye" : "book"} size={11} />
                      {lesson.kind === "video" ? (isEn ? "Video" : "भिडियो") : isEn ? "Guide" : "Guide"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-ink-400">
                      <Icon name="clock" size={11} />
                      {n(lesson.minutes)} {isEn ? "min" : "मिनेट"}
                    </span>
                    {isNext && <span className="badge-action">{isEn ? "Next" : "अर्को"}</span>}
                  </div>
                  <p className={`mt-1.5 font-semibold leading-snug ${done ? "text-ink-500" : "text-ink-900"}`}>{isEn ? lesson.titleEn : lesson.titleNe}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {lesson.kind === "article" ? (
                      <Link href={lessonHref(course, lesson)} className="btn-outline btn-sm">
                        <Icon name="book" size={14} />
                        {isEn ? "Read the guide" : "Guide पढ्नुहोस्"}
                      </Link>
                    ) : (
                      <button type="button" onClick={() => setOpenVideo(open ? null : lesson.slug)} className="btn-outline btn-sm">
                        <Icon name={open ? "chevronDown" : "eye"} size={14} />
                        {open ? (isEn ? "Hide video" : "भिडियो लुकाउनुहोस्") : isEn ? "Watch here" : "यहीँ हेर्नुहोस्"}
                      </button>
                    )}
                    <button type="button" onClick={() => toggle(lesson)} className={`btn-sm ${done ? "btn-ghost" : "btn-primary"}`}>
                      <Icon name={done ? "refresh" : "check"} size={14} />
                      {done ? (isEn ? "Undo" : "पूर्ववत्") : isEn ? "Mark complete" : "पूरा भयो"}
                    </button>
                  </div>
                  {open && video && (
                    <div className="mt-4">
                      <YouTubeEmbed id={video.youtubeId} title={video.title} />
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
        <li className={`card p-4 ${allLessonsDone && !p?.completedAt ? "border-action-500 ring-1 ring-action-200" : ""}`}>
          <div className="flex items-start gap-3.5">
            <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${p?.completedAt ? "border-emerald-500 bg-emerald-500 text-white" : "border-ink-300 text-ink-500"}`}>
              {p?.completedAt ? <Icon name="check" size={14} /> : <Icon name="grad" size={14} />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink-900">{isEn ? `Final quiz — ${course.quiz.length} questions, pass at 70%` : `अन्तिम quiz — ${n(course.quiz.length)} प्रश्न, ७०% मा पास`}</p>
              <p className="mt-1 text-sm text-ink-500">{isEn ? "Pass to unlock a printable (educational) certificate." : "पास गरे print गर्न मिल्ने (शैक्षिक) प्रमाणपत्र पाइन्छ।"}</p>
              <Link href={`/school/courses/${course.slug}/quiz`} className="btn-accent btn-sm mt-3">
                <Icon name="grad" size={14} />
                {p?.completedAt ? (isEn ? "Retake / view certificate" : "फेरि दिनुहोस् / प्रमाणपत्र") : isEn ? "Take the quiz" : "Quiz दिनुहोस्"}
              </Link>
            </div>
          </div>
        </li>
      </ol>
    </div>
  );
}
