"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { courses } from "@/content/courses";
import { toNe } from "@/content/ssf-stats";
import { coursePercent, useCourseProgress } from "@/lib/course-progress";
import { Icon } from "./icons";

/** Circular progress indicator (SVG) — 0–100. */
export function ProgressRing({ pct, size = 48, label }: { pct: number; size?: number; label?: string }) {
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, pct)) / 100) * c;
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }} role="img" aria-label={label ?? `${pct}%`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" focusable="false" className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-ink-100" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className={`transition-[stroke-dashoffset] duration-500 ${pct >= 100 ? "text-emerald-500" : "text-primary-600"}`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-[11px] font-bold text-ink-800">
        {pct >= 100 ? <Icon name="check" size={16} className="text-emerald-600" /> : label ?? `${pct}%`}
      </span>
    </span>
  );
}

const LEVEL: Record<string, { ne: string; en: string }> = {
  beginner: { ne: "सुरुवाती", en: "Beginner" },
  intermediate: { ne: "मध्यम", en: "Intermediate" },
  advanced: { ne: "उन्नत", en: "Advanced" },
};

export function CourseCards() {
  const locale = useLocale();
  const isEn = locale === "en";
  const n = (s: string | number) => (isEn ? String(s) : toNe(String(s)));
  const { all } = useCourseProgress();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {courses.map((c) => {
        const p = all[c.slug];
        const pct = coursePercent(c, p);
        const done = c.lessons.filter((l) => p?.lessons.includes(l.slug)).length;
        const started = done > 0 || Boolean(p?.completedAt);
        return (
          <Link key={c.slug} href={`/school/courses/${c.slug}`} className="card card-hover group flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="icon-tile">
                <Icon name={c.icon} size={20} />
              </span>
              <ProgressRing pct={pct} label={`${n(pct)}%`} />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="badge-neutral">{isEn ? LEVEL[c.level].en : LEVEL[c.level].ne}</span>
              <span className="inline-flex items-center gap-1 text-xs text-ink-400">
                <Icon name="clock" size={12} />
                {isEn ? `~${c.minutes} min` : `~${n(c.minutes)} मिनेट`}
              </span>
              {p?.completedAt && (
                <span className="badge-health">
                  <Icon name="checkCircle" size={11} />
                  {isEn ? "Certified" : "प्रमाणपत्र प्राप्त"}
                </span>
              )}
            </div>
            <p className="mt-3 font-display text-lg font-semibold leading-snug text-ink-900 group-hover:text-primary-700">{isEn ? c.titleEn : c.titleNe}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{isEn ? c.descEn : c.descNe}</p>
            <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink-100 pt-4">
              <span className="text-xs text-ink-500">
                {n(done)}/{n(c.lessons.length)} {isEn ? "lessons" : "पाठ"} · {n(c.quiz.length)} {isEn ? "quiz questions" : "प्रश्न"}
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700">
                {started ? (isEn ? "Continue" : "जारी राख्नुहोस्") : isEn ? "Start" : "सुरु गर्नुहोस्"}
                <Icon name="arrowRight" size={14} className="transition group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
