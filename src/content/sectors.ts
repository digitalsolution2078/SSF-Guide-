import type { SectorKey } from "@/lib/calculation/sector-breakdown";
import type { UserCategorySlug } from "./types";

export interface SectorInfo {
  key: SectorKey;
  slug: SectorKey;
  icon: string;
  titleNe: string;
  titleEn: string;
  taglineNe: string;
  taglineEn: string;
  /** default contribution base shown in the explorer */
  defaultBase: number;
  baseLabelNe: string;
  baseLabelEn: string;
  calculatorHref: string;
  registrationHref: string;
  /** article/FAQ userCategories that belong to this sector */
  userCategories: UserCategorySlug[];
}

export const sectors: SectorInfo[] = [
  {
    key: "formal",
    slug: "formal",
    icon: "🏢",
    titleNe: "औपचारिक क्षेत्र",
    titleEn: "Formal sector",
    taglineNe: "कम्पनी/संस्थामा तलब खाने कर्मचारी — रोजगारदातामार्फत अनिवार्य सूचीकरण।",
    taglineEn: "Salaried employees at a company/organization — mandatory registration via the employer.",
    defaultBase: 30_000,
    baseLabelNe: "मासिक आधारभूत तलब (रु.)",
    baseLabelEn: "Monthly basic salary (Rs.)",
    calculatorHref: "/calculators/contribution",
    registrationHref: "/services/registration",
    userCategories: ["employee", "employer"],
  },
  {
    key: "informal",
    slug: "informal",
    icon: "🧑‍🌾",
    titleNe: "अनौपचारिक क्षेत्र",
    titleEn: "Informal sector",
    taglineNe: "कृषि, घरेलु काम, ज्याला-मजदुरी — तपाईं ११% मात्र, सरकार ९.३७% थप्छ।",
    taglineEn: "Agriculture, domestic work, daily wage — you pay just 11%, the government adds 9.37%.",
    defaultBase: 12_170,
    baseLabelNe: "न्यूनतम पारिश्रमिक आधार (रु.)",
    baseLabelEn: "Minimum wage base (Rs.)",
    calculatorHref: "/calculators/contribution",
    registrationHref: "/services/registration",
    userCategories: ["informal"],
  },
  {
    key: "self-employed",
    slug: "self-employed",
    icon: "🛠️",
    titleNe: "स्वरोजगार",
    titleEn: "Self-employed",
    taglineNe: "पसल, व्यवसाय, freelancer — आफ्नो आधार आफैँ रोजेर ३१% योगदान।",
    taglineEn: "Shop owners, businesses, freelancers — choose your own base and contribute 31%.",
    defaultBase: 20_000,
    baseLabelNe: "रोजेको आधार रकम (रु.)",
    baseLabelEn: "Chosen base amount (Rs.)",
    calculatorHref: "/calculators/financial-planner",
    registrationHref: "/services/registration",
    userCategories: ["selfEmployed"],
  },
  {
    key: "foreign",
    slug: "foreign",
    icon: "✈️",
    titleNe: "वैदेशिक रोजगार",
    titleEn: "Foreign employment",
    taglineNe: "विदेशमा काम गर्ने नेपाली — श्रम स्वीकृतिसँगै सूचीकरण, कम्तीमा २१.३३%।",
    taglineEn: "Nepalis working abroad — registered with the labour permit, at least 21.33%.",
    defaultBase: 12_170,
    baseLabelNe: "औद्योगिक न्यूनतम आधार (रु.)",
    baseLabelEn: "Industrial minimum base (Rs.)",
    calculatorHref: "/calculators/foreign-employment",
    registrationHref: "/services/registration",
    userCategories: ["foreign"],
  },
];

export function sectorBySlug(slug: string): SectorInfo | undefined {
  return sectors.find((s) => s.slug === slug);
}
