import { describe, expect, it } from "vitest";
import { courses, courseBySlug, lessonsForArticle, lessonHref, validateCourses, type Course } from "./courses";

describe("SSF School courses", () => {
  it("every lesson resolves to an existing article/video and every quiz is well formed", () => {
    expect(validateCourses()).toEqual([]);
  });

  it("ships the four planned courses with 6–10 lessons each", () => {
    expect(courses.map((c) => c.slug).sort()).toEqual(["contributor-pro", "employer-essentials", "migrant-worker", "ssf-basics"]);
    for (const c of courses) {
      expect(c.lessons.length).toBeGreaterThanOrEqual(6);
      expect(c.lessons.length).toBeLessThanOrEqual(10);
      expect(c.quiz.length).toBeGreaterThanOrEqual(6);
      expect(c.quiz.length).toBeLessThanOrEqual(8);
    }
  });

  it("flags a missing article or video slug", () => {
    const broken: Course[] = [
      {
        ...courses[0],
        slug: "broken",
        lessons: [
          ...courses[0].lessons.slice(0, 5),
          { slug: "x", titleNe: "x", titleEn: "x", kind: "article", articleSlug: "does-not-exist", minutes: 1 },
          { slug: "y", titleNe: "y", titleEn: "y", kind: "video", videoId: "nope", minutes: 1 },
        ],
      },
    ];
    const problems = validateCourses(broken);
    expect(problems.some((p) => p.includes('unknown article "does-not-exist"'))).toBe(true);
    expect(problems.some((p) => p.includes('unknown video "nope"'))).toBe(true);
  });

  it("maps articles back to their course lessons and builds hrefs", () => {
    const refs = lessonsForArticle("kyc-profile-claim-guide");
    expect(refs.map((r) => r.course.slug).sort()).toEqual(["contributor-pro", "migrant-worker"]);
    const basics = courseBySlug("ssf-basics")!;
    expect(lessonHref(basics, basics.lessons[0])).toBe("/school/ssf-parichaya/ssf-bhaneko-ke-ho");
    expect(lessonHref(basics, basics.lessons[1])).toBe("/school/courses/ssf-basics#lesson-ssf-overview-video");
  });
});
