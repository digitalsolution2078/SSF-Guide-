/**
 * Phase 1 seed — spec §11.
 * Idempotent: upserts by natural keys so it can run repeatedly.
 *
 * Rate parameters mirror src/lib/calculation/rules.ts, whose numbers come
 * from knowledge-base/verified-facts.md §1 (source-cited).
 */
import { PrismaClient, UserCategoryKey } from "@prisma/client";
import {
  FOREIGN_EMPLOYMENT_RULE_V1,
  FORMAL_RULE_V1,
  INFORMAL_RULE_V1,
  SELF_EMPLOYED_RULE_V1,
} from "../src/lib/calculation/rules";
import { videos } from "../src/content/videos";

const prisma = new PrismaClient();

// २०८२ वैशाख १ — effective date of the 5th Amendment allocation
const EFFECTIVE_2082_BAISAKH_1 = new Date("2025-04-14T00:00:00Z");

const userCategories: Array<{
  key: UserCategoryKey;
  nameNe: string;
  nameEn: string;
}> = [
  { key: "EMPLOYEE", nameNe: "कर्मचारी", nameEn: "Employee" },
  { key: "EMPLOYER", nameNe: "रोजगारदाता/HR", nameEn: "Employer / HR" },
  { key: "FOREIGN_EMPLOYMENT", nameNe: "वैदेशिक रोजगारी", nameEn: "Foreign employment" },
  { key: "SELF_EMPLOYED", nameNe: "स्वरोजगार", nameEn: "Self-employed" },
  { key: "INFORMAL_SECTOR", nameNe: "अनौपचारिक क्षेत्र", nameEn: "Informal sector" },
  { key: "CONTRIBUTOR_BENEFICIARY", nameNe: "हालका योगदानकर्ता", nameEn: "Current contributor" },
  { key: "DEPENDENT_FAMILY", nameNe: "परिवार/आश्रित", nameEn: "Family / dependent" },
  { key: "UNSURE", nameNe: "निश्चित छैन", nameEn: "Not sure" },
];

const learningCategories = [
  { slug: "ssf-parichaya", titleNe: "SSF परिचय", titleEn: "Introduction to SSF" },
  { slug: "karmachari-ra-rojgardata", titleNe: "कर्मचारी र रोजगारदाता", titleEn: "Employees & employers" },
  { slug: "yogdan-ra-badfad", titleNe: "योगदान र रकमको बाँडफाँट", titleEn: "Contributions & allocation" },
  { slug: "pension-ra-retirement", titleNe: "Pension र Retirement Benefit", titleEn: "Pension & retirement benefit" },
  { slug: "medical-maternity-accident-dependent", titleNe: "Medical, Maternity, Accident र Dependent Benefits", titleEn: "Medical, maternity, accident & dependent benefits" },
  { slug: "baideshik-rojgari", titleNe: "वैदेशिक रोजगारी", titleEn: "Foreign employment" },
  { slug: "kyc-profile-nominee", titleNe: "KYC, Profile र Nominee", titleEn: "KYC, profile & nominee" },
  { slug: "claims-problems-solutions", titleNe: "Claims, Problems र Solutions", titleEn: "Claims, problems & solutions" },
];

// Key legal sources (subset of the 20-document registry most used by rules;
// the full registry lives in knowledge-base/verified-facts.md §4)
const sources = [
  {
    key: "act-2074",
    title: "योगदानमा आधारित सामाजिक सुरक्षा ऐन, २०७४",
    issuingAuthority: "नेपाल सरकार",
    docType: "Act",
    publicationDate: "२०७४।०४।२९",
    internalSummary:
      "SSF को मूल ऐन — योगदान अनिवार्यता, सूचीकरण, कोष स्थापना, दण्ड सजाय। २०७५ र २०८२ का संशोधनसहित (दाखिला अवधि २५ दिन)।",
  },
  {
    key: "procedure-2075-5th",
    title: "सामाजिक सुरक्षा योजना सञ्चालन कार्यविधि, २०७५ (५औँ संशोधन)",
    issuingAuthority: "श्रम, रोजगार तथा सामाजिक सुरक्षा मन्त्रालय",
    docType: "Procedure",
    publicationDate: "२०८१।०९।१०",
    internalSummary:
      "औपचारिक क्षेत्रका चार योजनाको सञ्चालन — ३१% योगदान, बाँडफाँट १.२०/०.८०/०.६७/२८.३३, सुविधा-सीमा, दाबी प्रक्रिया। लागू २०८२।०१।०१।",
  },
  {
    key: "informal-procedure-2079",
    title: "अनौपचारिक क्षेत्रका श्रमिक र स्वरोजगार कार्यविधि, २०७९ (१म संशोधन)",
    issuingAuthority: "श्रम, रोजगार तथा सामाजिक सुरक्षा मन्त्रालय",
    docType: "Procedure",
    publicationDate: "२०७९।०८।२५",
    internalSummary:
      "अनौपचारिक: २०.३७% (श्रमिक ११% + सरकार ९.३७%); स्वरोजगार: रोजेको आधारको ३१% (बाँडफाँट २.४/०.८/१.८/२६)।",
  },
  {
    key: "foreign-procedure-2079",
    title: "वैदेशिक रोजगारमा रहेका श्रमिकको योजना सञ्चालन कार्यविधि, २०७९ (१म संशोधन)",
    issuingAuthority: "श्रम, रोजगार तथा सामाजिक सुरक्षा मन्त्रालय",
    docType: "Procedure",
    publicationDate: "२०७९।०८।२५",
    internalSummary:
      "वैदेशिक रोजगार: औद्योगिक न्यूनतम पारिश्रमिकको कम्तीमा २१.३३% (३ गुणासम्म); बाँडफाँट ७.४८% + १३.८५%।",
  },
  {
    key: "listing-procedure-2075",
    title: "रोजगारदाता र श्रमिकको सूचीकरण सम्बन्धी कार्यविधि, २०७५",
    issuingAuthority: "सामाजिक सुरक्षा कोष",
    docType: "Procedure",
    publicationDate: "२०७५",
    internalSummary:
      "सूचीकरण प्रक्रिया — रोजगारदाता १६ अङ्कको नम्बर, SSN ११ अङ्क, ३५ दिनभित्र सूचीकरण।",
  },
  {
    key: "loan-directive-2079",
    title: "योगदानकर्ता सापटी निर्देशिका, २०७९ (१म संशोधन)",
    issuingAuthority: "सामाजिक सुरक्षा कोष",
    docType: "Directive",
    publicationDate: "२०७९।०३।३१",
    internalSummary:
      "घर (रु. ७५ लाख), शैक्षिक (रु. ३५ लाख), सामाजिक कार्य स्वाप र विशेष सापटी (अवकाश रकमको ८०%)।",
  },
];

const calculators = [
  { key: "CONTRIBUTION", titleNe: "Employee–Employer Contribution Calculator", titleEn: "Employee–Employer Contribution Calculator" },
  { key: "ALLOCATION", titleNe: "31% Contribution Breakdown", titleEn: "31% Contribution Breakdown" },
  { key: "FOREIGN_EMPLOYMENT", titleNe: "Foreign Employment Contribution Calculator", titleEn: "Foreign Employment Contribution Calculator" },
  { key: "JOB_LEAVING", titleNe: "Job Leaving Scenario Guide", titleEn: "Job Leaving Scenario Guide" },
];

async function main() {
  // user categories
  for (const [i, c] of userCategories.entries()) {
    await prisma.userCategory.upsert({
      where: { key: c.key },
      create: { ...c, sortOrder: i },
      update: { nameNe: c.nameNe, nameEn: c.nameEn, sortOrder: i },
    });
  }

  // learning categories
  for (const [i, c] of learningCategories.entries()) {
    await prisma.learningCategory.upsert({
      where: { slug: c.slug },
      create: { ...c, sortOrder: i },
      update: { titleNe: c.titleNe, titleEn: c.titleEn, sortOrder: i },
    });
  }

  // sources
  const sourceIds: Record<string, string> = {};
  for (const s of sources) {
    const existing = await prisma.source.findFirst({ where: { title: s.title } });
    const row =
      existing ??
      (await prisma.source.create({
        data: {
          title: s.title,
          issuingAuthority: s.issuingAuthority,
          docType: s.docType,
          publicationDate: s.publicationDate,
          accessedAt: new Date(),
          internalSummary: s.internalSummary,
          status: "CURRENT",
        },
      }));
    sourceIds[s.key] = row.id;
  }

  // calculators
  for (const c of calculators) {
    await prisma.calculator.upsert({
      where: { key: c.key },
      create: c,
      update: { titleNe: c.titleNe, titleEn: c.titleEn },
    });
  }

  // calculation rules v1 (PUBLISHED, effective २०८२।०१।०१)
  const rules = [
    {
      calculatorKey: "CONTRIBUTION",
      name: "Formal sector 31% (5th Amendment)",
      userCategory: "EMPLOYEE" as UserCategoryKey,
      parameters: FORMAL_RULE_V1,
      sourceKey: "procedure-2075-5th",
    },
    {
      calculatorKey: "ALLOCATION",
      name: "Formal allocation 1.20/0.80/0.67/28.33 (5th Amendment)",
      userCategory: "EMPLOYEE" as UserCategoryKey,
      parameters: FORMAL_RULE_V1,
      sourceKey: "procedure-2075-5th",
    },
    {
      calculatorKey: "CONTRIBUTION",
      name: "Informal sector 20.37%",
      userCategory: "INFORMAL_SECTOR" as UserCategoryKey,
      parameters: INFORMAL_RULE_V1,
      sourceKey: "informal-procedure-2079",
    },
    {
      calculatorKey: "CONTRIBUTION",
      name: "Self-employed 31% of chosen base",
      userCategory: "SELF_EMPLOYED" as UserCategoryKey,
      parameters: SELF_EMPLOYED_RULE_V1,
      sourceKey: "informal-procedure-2079",
    },
    {
      calculatorKey: "FOREIGN_EMPLOYMENT",
      name: "Foreign employment 21.33% minimum",
      userCategory: "FOREIGN_EMPLOYMENT" as UserCategoryKey,
      parameters: FOREIGN_EMPLOYMENT_RULE_V1,
      sourceKey: "foreign-procedure-2079",
    },
  ];

  for (const r of rules) {
    await prisma.calculationRule.upsert({
      where: {
        calculatorKey_userCategory_version: {
          calculatorKey: r.calculatorKey,
          userCategory: r.userCategory,
          version: 1,
        },
      },
      create: {
        calculatorKey: r.calculatorKey,
        name: r.name,
        userCategory: r.userCategory,
        parameters: JSON.parse(JSON.stringify(r.parameters)),
        sourceId: sourceIds[r.sourceKey],
        version: 1,
        status: "PUBLISHED",
        effectiveFrom: EFFECTIVE_2082_BAISAKH_1,
      },
      update: {},
    });
  }

  // video catalog (from src/content/videos.ts)
  for (const [i, v] of videos.entries()) {
    const category = await prisma.learningCategory.findUnique({
      where: { slug: v.categorySlug },
    });
    const existing = await prisma.video.findFirst({
      where: { youtubeId: v.youtubeId },
    });
    if (!existing) {
      await prisma.video.create({
        data: {
          title: v.title,
          youtubeId: v.youtubeId,
          categoryId: category?.id,
          // opinion/commentary videos stay unpublished on educational pages
          status: v.kind === "opinion" ? "DRAFT" : "PUBLISHED",
          sortOrder: i,
        },
      });
    }
  }

  // site settings
  const settings: Array<[string, unknown]> = [
    ["responseWindowHours", 24],
    ["whatsappNumber", "9779800000000"],
    ["lastPlatformUpdate", new Date().toISOString().slice(0, 10)],
    // ⚠ placeholder — enter the gazette-notified figure before launch
    ["minimumBasicRemunerationNPR", 15000],
  ];
  for (const [key, value] of settings) {
    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value: value as object, updatedById: "seed" },
      update: {},
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
