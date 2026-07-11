// File-based content layer for Stage 2.
// Mirrors the Prisma content models; migrates into the CMS database via
// prisma/seed.ts so nothing here is throwaway.

export type CategorySlug =
  | "ssf-parichaya"
  | "karmachari-ra-rojgardata"
  | "yogdan-ra-badfad"
  | "pension-ra-retirement"
  | "medical-maternity-accident-dependent"
  | "baideshik-rojgari"
  | "kyc-profile-nominee"
  | "claims-problems-solutions";

export type UserCategorySlug =
  | "employee"
  | "employer"
  | "foreign"
  | "selfEmployed"
  | "informal"
  | "contributor"
  | "family";

export interface VideoItem {
  youtubeId: string;
  title: string;
  description: string;
  categorySlug: CategorySlug;
  userCategories: UserCategorySlug[];
  /** how-to/explainer videos are embedded; opinion/commentary stays catalog-only */
  kind: "howto" | "explainer" | "news" | "opinion";
}

// Structured blocks — no raw HTML, no markdown parser needed.
export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "steps"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "note"; text: string };

export interface ArticleSectionContent {
  kind:
    | "MAIN"
    | "EXAMPLE"
    | "ELIGIBILITY"
    | "DOCUMENTS"
    | "STEPS"
    | "MISTAKES"
    | "CAUTION";
  heading: string;
  blocks: ContentBlock[];
}

export interface ArticleContent {
  slug: string;
  categorySlug: CategorySlug;
  title: string;
  shortAnswer: string; // छोटो उत्तर — 2-4 sentences
  isCornerstone: boolean;
  readingMinutes: number;
  userCategories: UserCategorySlug[];
  sections: ArticleSectionContent[];
  videoIds: string[]; // youtubeIds embedded at the end of the article
  relatedCalculatorHref?: string;
  relatedServiceHref?: string;
  sourceKeys: string[]; // keys into sources.ts registry
  lastVerified: string; // ISO date
}

export interface FaqItem {
  slug: string;
  question: string;
  answerBlocks: ContentBlock[];
  categorySlug: CategorySlug;
  userCategories: UserCategorySlug[];
  popular: boolean;
  relatedArticleSlug?: string;
  videoIds?: string[];
  sourceKeys: string[];
  lastVerified: string;
}

export interface ChecklistItemContent {
  label: string;
  conditional?: boolean;
  conditionNote?: string;
}

export interface ChecklistContent {
  slug: string;
  processName: string;
  applicableUser: string;
  items: ChecklistItemContent[];
  whereCompleted: string;
  expectedWorkflow: string[];
  commonErrors: string[];
  relatedServiceHref?: string;
  videoIds?: string[];
  sourceKeys: string[];
  lastVerified: string;
}

export interface SourceEntry {
  key: string;
  title: string;
  issuingAuthority: string;
  docType: string;
  date: string; // B.S.
  summary: string;
}
