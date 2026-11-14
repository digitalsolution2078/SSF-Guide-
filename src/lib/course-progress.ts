"use client";

import { useCallback, useEffect, useState } from "react";
import { COURSES_STORAGE_KEY, type Course } from "@/content/courses";

/**
 * SSF School course progress — kept ONLY in the browser (localStorage), no
 * account. Shape under "ssf-courses-v1":
 *   { [courseSlug]: { lessons: string[], quizScore?: number, completedAt?: string } }
 * A custom event keeps every component on the page in sync.
 */

export interface CourseProgress {
  lessons: string[];
  /** percentage 0–100 of the best quiz attempt */
  quizScore?: number;
  /** ISO date when the quiz was passed */
  completedAt?: string;
}

export type AllProgress = Record<string, CourseProgress>;

const EVENT = "ssf-courses-change";

export function readAllProgress(): AllProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(COURSES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as AllProgress;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(next: AllProgress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* storage unavailable — progress just won't persist */
  }
}

export function setLessonDone(courseSlug: string, lessonSlug: string, done = true): void {
  const all = readAllProgress();
  const cur = all[courseSlug] ?? { lessons: [] };
  const set = new Set(cur.lessons);
  if (done) set.add(lessonSlug);
  else set.delete(lessonSlug);
  writeAll({ ...all, [courseSlug]: { ...cur, lessons: [...set] } });
}

export function setQuizResult(courseSlug: string, scorePct: number, passed: boolean): void {
  const all = readAllProgress();
  const cur = all[courseSlug] ?? { lessons: [] };
  const best = Math.max(cur.quizScore ?? 0, scorePct);
  writeAll({
    ...all,
    [courseSlug]: {
      ...cur,
      quizScore: best,
      completedAt: passed ? (cur.completedAt ?? new Date().toISOString()) : cur.completedAt,
    },
  });
}

/** 0–100: lessons done out of total (quiz passing counts as one extra unit). */
export function coursePercent(course: Course, p?: CourseProgress): number {
  const total = course.lessons.length + 1;
  const done = course.lessons.filter((l) => p?.lessons.includes(l.slug)).length + (p?.completedAt ? 1 : 0);
  return Math.round((done / total) * 100);
}

export function nextLesson(course: Course, p?: CourseProgress) {
  return course.lessons.find((l) => !p?.lessons.includes(l.slug));
}

/** Hydrates after mount and re-renders when any component updates progress. */
export function useCourseProgress() {
  const [all, setAll] = useState<AllProgress>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAll(readAllProgress());
    setReady(true);
    const onChange = () => setAll(readAllProgress());
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const markLesson = useCallback((courseSlug: string, lessonSlug: string, done = true) => {
    setLessonDone(courseSlug, lessonSlug, done);
    setAll(readAllProgress());
  }, []);

  const recordQuiz = useCallback((courseSlug: string, scorePct: number, passed: boolean) => {
    setQuizResult(courseSlug, scorePct, passed);
    setAll(readAllProgress());
  }, []);

  return { all, ready, markLesson, recordQuiz };
}
