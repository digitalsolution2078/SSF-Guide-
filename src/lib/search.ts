import { articles } from "@/content/articles";
import { faqs } from "@/content/faqs";
import { checklists } from "@/content/checklists";
import { videos } from "@/content/videos";

export interface SearchResult {
  type: "article" | "faq" | "checklist" | "video" | "calculator";
  title: string;
  snippet: string;
  href: string;
}

/** Nepali/English keyword → content mapping for common intents (spec §6) */
const KEYWORD_HINTS: Array<{ pattern: RegExp; hrefs: string[] }> = [
  { pattern: /पैसा\s*फिर्ता|refund|फिर्ता/i, hrefs: ["/school/pension-ra-retirement/jagir-chadepachi-ke-huncha"] },
  { pattern: /kyc|केवाइसी/i, hrefs: ["/school/kyc-profile-nominee/kyc-profile-claim-guide", "/checklists/kyc-verification"] },
  { pattern: /31|३१|percent|प्रतिशत/i, hrefs: ["/school/yogdan-ra-badfad/31-pratishat-kaha-jancha", "/calculators/allocation"] },
  { pattern: /विदेश|बिदेश|foreign|abroad/i, hrefs: ["/school/baideshik-rojgari/foreign-employment-guide", "/calculators/foreign-employment"] },
  { pattern: /pension|पेन्सन|निवृत्तभरण/i, hrefs: ["/school/pension-ra-retirement/pension-ra-retirement-guide"] },
  { pattern: /देखिएन|missing|नदेखिए/i, hrefs: ["/faq/contribution-nadekhiema"] },
  { pattern: /जागिर|छाडे|leaving|quit/i, hrefs: ["/school/pension-ra-retirement/jagir-chadepachi-ke-huncha", "/calculators/job-leaving"] },
  { pattern: /सापटी|loan|ऋण/i, hrefs: ["/faq/sapati-kasari-line"] },
];

const calculatorEntries: SearchResult[] = [
  {
    type: "calculator",
    title: "Employee–Employer Contribution Calculator",
    snippet: "श्रमिक ११% + रोजगारदाता २०% = ३१% — मासिक/वार्षिक योगदान हिसाब।",
    href: "/calculators/contribution",
  },
  {
    type: "calculator",
    title: "31% Contribution Breakdown",
    snippet: "जम्मा रकम चार योजनामा कसरी बाँडिन्छ।",
    href: "/calculators/allocation",
  },
  {
    type: "calculator",
    title: "Foreign Employment Contribution Calculator",
    snippet: "वैदेशिक रोजगारीको न्यूनतम २१.३३% योगदान।",
    href: "/calculators/foreign-employment",
  },
  {
    type: "calculator",
    title: "Job Leaving Scenario Guide",
    snippet: "जागिर छाडेपछि रकमको के हुन्छ — निर्देशित जानकारी।",
    href: "/calculators/job-leaving",
  },
];

function matches(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export function searchContent(query: string): SearchResult[] {
  const q = query.trim();
  if (q.length < 2) return [];

  const results: SearchResult[] = [];
  const seen = new Set<string>();
  const push = (r: SearchResult) => {
    if (!seen.has(r.href)) {
      seen.add(r.href);
      results.push(r);
    }
  };

  // keyword-intent hints first
  for (const hint of KEYWORD_HINTS) {
    if (hint.pattern.test(q)) {
      for (const href of hint.hrefs) {
        const all: SearchResult[] = [
          ...articles.map((a) => ({
            type: "article" as const,
            title: a.title,
            snippet: a.shortAnswer.slice(0, 140),
            href: `/school/${a.categorySlug}/${a.slug}`,
          })),
          ...checklists.map((c) => ({
            type: "checklist" as const,
            title: c.processName,
            snippet: c.applicableUser,
            href: `/checklists/${c.slug}`,
          })),
          ...faqs.map((f) => ({
            type: "faq" as const,
            title: f.question,
            snippet: "",
            href: `/faq/${f.slug}`,
          })),
          ...calculatorEntries,
        ];
        const found = all.find((r) => r.href === href);
        if (found) push(found);
      }
    }
  }

  // full-text over titles + bodies
  for (const a of articles) {
    const body =
      a.title +
      " " +
      a.shortAnswer +
      " " +
      a.sections.map((s) => s.heading).join(" ");
    if (matches(body, q)) {
      push({
        type: "article",
        title: a.title,
        snippet: a.shortAnswer.slice(0, 140),
        href: `/school/${a.categorySlug}/${a.slug}`,
      });
    }
  }
  for (const f of faqs) {
    const body =
      f.question +
      " " +
      f.answerBlocks
        .map((b) => ("text" in b ? b.text : "items" in b ? b.items.join(" ") : ""))
        .join(" ");
    if (matches(body, q)) {
      push({ type: "faq", title: f.question, snippet: "", href: `/faq/${f.slug}` });
    }
  }
  for (const c of checklists) {
    if (matches(c.processName + " " + c.applicableUser, q)) {
      push({
        type: "checklist",
        title: c.processName,
        snippet: c.applicableUser,
        href: `/checklists/${c.slug}`,
      });
    }
  }
  for (const calc of calculatorEntries) {
    if (matches(calc.title + " " + calc.snippet, q)) push(calc);
  }
  for (const v of videos) {
    if (v.kind !== "opinion" && matches(v.title + " " + v.description, q)) {
      push({
        type: "video",
        title: v.title,
        snippet: v.description,
        href: `/school/${v.categorySlug}`,
      });
    }
  }

  return results.slice(0, 20);
}
