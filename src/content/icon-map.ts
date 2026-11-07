import type { IconName } from "@/components/icons";

/** Consistent SVG icon per SSF School category (replaces emoji). */
export const CATEGORY_ICON: Record<string, IconName> = {
  "ssf-parichaya": "landmark",
  "karmachari-ra-rojgardata": "briefcase",
  "yogdan-ra-badfad": "percent",
  "pension-ra-retirement": "coins",
  "medical-maternity-accident-dependent": "hospital",
  "baideshik-rojgari": "plane",
  "kyc-profile-nominee": "user",
  "claims-problems-solutions": "shield",
};

export const SECTOR_ICON: Record<string, IconName> = {
  formal: "building",
  informal: "wrench",
  "self-employed": "sparkles",
  foreign: "plane",
};

export const USER_CATEGORY_ICON: Record<string, IconName> = {
  employee: "user",
  employer: "building",
  foreign: "plane",
  selfEmployed: "wrench",
  informal: "wrench",
  contributor: "card",
  family: "family",
};

export function categoryIcon(slug: string): IconName {
  return CATEGORY_ICON[slug] ?? "book";
}
export function sectorIcon(key: string): IconName {
  return SECTOR_ICON[key] ?? "briefcase";
}
