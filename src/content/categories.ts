import type { CategorySlug } from "./types";

export interface CategoryInfo {
  slug: CategorySlug;
  titleNe: string;
  titleEn: string;
  icon: string;
  description: string;
}

/** 8 SSF School learning categories — product spec §5.1 */
export const categories: CategoryInfo[] = [
  {
    slug: "ssf-parichaya",
    titleNe: "SSF परिचय",
    titleEn: "Introduction to SSF",
    icon: "🏛️",
    description: "SSF के हो, कानुनी आधार र चार सुरक्षा योजनाको परिचय।",
  },
  {
    slug: "karmachari-ra-rojgardata",
    titleNe: "कर्मचारी र रोजगारदाता",
    titleEn: "Employees & Employers",
    icon: "🤝",
    description: "सूचीकरण, आबद्धता र रोजगारदाताको मासिक दायित्व।",
  },
  {
    slug: "yogdan-ra-badfad",
    titleNe: "योगदान र रकमको बाँडफाँट",
    titleEn: "Contributions & Allocation",
    icon: "🧮",
    description: "३१% कसरी बन्छ, कहाँ जान्छ र कसरी दाखिला गर्ने।",
  },
  {
    slug: "pension-ra-retirement",
    titleNe: "Pension र Retirement Benefit",
    titleEn: "Pension & Retirement",
    icon: "👴",
    description: "निवृत्तभरणको ÷१६० सूत्र, अवकाश सुविधा र सापटी।",
  },
  {
    slug: "medical-maternity-accident-dependent",
    titleNe: "Medical, Maternity, Accident र Dependent Benefits",
    titleEn: "Medical, Maternity, Accident & Dependent Benefits",
    icon: "🏥",
    description: "उपचार सीमा, प्रसूति सुविधा, दुर्घटना र परिवार सुरक्षा।",
  },
  {
    slug: "baideshik-rojgari",
    titleNe: "वैदेशिक रोजगारी",
    titleEn: "Foreign Employment",
    icon: "✈️",
    description: "विदेशबाट जोडिने, योगदान गर्ने र फर्किएपछिको प्रक्रिया।",
  },
  {
    slug: "kyc-profile-nominee",
    titleNe: "KYC, Profile र Nominee",
    titleEn: "KYC, Profile & Nominee",
    icon: "🪪",
    description: "KYC verification, विवरण सच्याउने र nominee अद्यावधिक।",
  },
  {
    slug: "claims-problems-solutions",
    titleNe: "Claims, Problems र Solutions",
    titleEn: "Claims, Problems & Solutions",
    icon: "📋",
    description: "दाबी प्रक्रिया, अस्वीकृत भए के गर्ने र सामान्य समस्या।",
  },
];

export function categoryBySlug(slug: string): CategoryInfo | undefined {
  return categories.find((c) => c.slug === slug);
}
