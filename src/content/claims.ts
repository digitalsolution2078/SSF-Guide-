import type { IconName } from "@/components/icons";
import { articleBySlug } from "./articles";
import { checklistBySlug } from "./checklists";
import { downloadCategories } from "./downloads";

/**
 * Claim Wizard data — every SSF benefit a contributor (or their family) can
 * claim, with qualifying period, limits, where to go, steps, documents and the
 * official forms. Loans are NOT claims and are deliberately excluded (see /loans).
 *
 * Facts: knowledge-base/verified-facts.md §2–3 (Procedure 2075, 5th Amendment),
 * wording reused from src/content/articles.ts, checklists.ts and faqs.ts.
 * Where a timeline is not set in those sources we say "कोषले तोकेबमोजिम".
 */

export type ClaimKey =
  | "medical-opd"
  | "medical-inpatient"
  | "critical-illness"
  | "maternity"
  | "sick-leave"
  | "accident-workplace"
  | "accident-other"
  | "disability"
  | "dependent-family"
  | "retirement-lumpsum"
  | "pension";

export type ClaimWhere = "hospital-desk" | "sosys" | "office";

export interface Bi {
  ne: string;
  en: string;
}

export interface ClaimDoc extends Bi {
  conditional?: boolean;
  noteNe?: string;
  noteEn?: string;
}

export interface ClaimOption extends Bi {
  value: string;
}

export interface ClaimQuestion extends Bi {
  id: string;
  options: ClaimOption[];
  /** which profile number can pre-answer this question */
  prefill?: "months3" | "months180" | "age60";
}

export interface ClaimForm {
  title: string;
  titleEn: string;
  url: string;
}

export interface ClaimType {
  key: ClaimKey;
  icon: IconName;
  nameNe: string;
  nameEn: string;
  /** who files the claim */
  who: "contributor" | "family" | "both";
  whoNe: string;
  whoEn: string;
  qualifyingNe: string;
  qualifyingEn: string;
  /** what you get — ceilings, co-pay, formulas */
  limits: Bi[];
  where: ClaimWhere[];
  whereNote?: Bi;
  steps: Bi[];
  documents: ClaimDoc[];
  /** deadlines and traps */
  caveats: Bi[];
  relatedArticleSlug: string;
  relatedChecklistSlug?: string;
  formUrls: ClaimForm[];
  videoIds: string[];
  questions: ClaimQuestion[];
}

export const WHERE_LABEL: Record<ClaimWhere, Bi> = {
  "hospital-desk": { ne: "आबद्ध अस्पतालको SSF डेस्क", en: "SSF desk at an affiliated hospital" },
  sosys: { ne: "SOSYS / SSF App", en: "SOSYS / SSF App" },
  office: { ne: "SSF कार्यालय", en: "SSF office" },
};

export const WHERE_HINT: Record<ClaimWhere, Bi> = {
  "hospital-desk": {
    ne: "सूचीकृत अस्पतालमा क्यासलेस — SSN देखाउनुहोस्, अस्पतालले कोषमा दाबी पेश गर्छ",
    en: "Cashless at listed hospitals — show your SSN; the hospital files the claim with the Fund",
  },
  sosys: {
    ne: "sosys.ssf.gov.np वा SSF mobile app मा login → Claim → योजना रोज्नुहोस्",
    en: "Log in at sosys.ssf.gov.np or the SSF mobile app → Claim → choose the scheme",
  },
  office: {
    ne: "केन्द्रीय कार्यालय थापाथली वा शाखा/सम्पर्क कार्यालय (१११६ टोल-फ्री)",
    en: "Head office Thapathali or a branch/contact office (toll-free 1116)",
  },
};

const UNKNOWN_DEADLINE: Bi = {
  ne: "दाबी पेश गर्ने समयसीमा: कोषले तोकेबमोजिम — ढिलो नगर्नुहोस्, कागजात तयार हुनासाथ पेश गर्नुहोस्",
  en: "Filing deadline: as set by the Fund — do not delay; file as soon as the documents are ready",
};

const CONFIRM_DOCS: Bi = {
  ne: "अन्तिम कागजात सूची SSF ले तोकेबमोजिम हुन्छ — पेश गर्नुअघि आधिकारिक सूचना जाँच्नुहोस्",
  en: "The final document list is as set by SSF — check the official notice before submitting",
};

const CLAIM_CATEGORY = downloadCategories.find((c) => c.slug.includes("claim"));
const APPLICATION_CATEGORY = downloadCategories.find((c) => c.slug === "application-forms");

/** Pick an official PDF from the claim-forms download category by a title fragment. */
function form(fragment: string, titleEn: string, category = CLAIM_CATEGORY): ClaimForm[] {
  const item = category?.items.find((i) => i.title.includes(fragment));
  return item ? [{ title: item.title, titleEn, url: item.url }] : [];
}

/** Reuse checklist items (ne + en aligned by index) as claim documents. */
function docsFromChecklist(slug: string): ClaimDoc[] {
  const c = checklistBySlug(slug);
  if (!c) return [];
  return c.items.map((it, i) => {
    const en = c.en?.items[i];
    return {
      ne: it.label,
      en: en?.label ?? it.label,
      conditional: it.conditional,
      noteNe: it.conditionNote,
      noteEn: en?.conditionNote,
    };
  });
}

const Q_MONTHS3: ClaimQuestion = {
  id: "months3",
  ne: "पछिल्ला ६ महिनामा कम्तीमा ३ महिना नियमित योगदान छ?",
  en: "Have you contributed regularly for at least 3 of the last 6 months?",
  prefill: "months3",
  options: [
    { value: "yes", ne: "छ", en: "Yes" },
    { value: "stopped", ne: "योगदान रोकिएको ३ महिना भित्र छ", en: "Contributions stopped less than 3 months ago" },
    { value: "no", ne: "छैन / थाहा छैन", en: "No / not sure" },
  ],
};

const Q_AFFILIATED: ClaimQuestion = {
  id: "affiliated",
  ne: "उपचार SSF-आबद्ध (सूचीकृत) अस्पतालमा भएको हो?",
  en: "Was the treatment at an SSF-affiliated (listed) hospital?",
  options: [
    { value: "yes", ne: "हो", en: "Yes" },
    { value: "no", ne: "होइन / थाहा छैन", en: "No / not sure" },
  ],
};

const Q_PATIENT: ClaimQuestion = {
  id: "patient",
  ne: "बिरामी को हो?",
  en: "Who is the patient?",
  options: [
    { value: "self", ne: "म (योगदानकर्ता)", en: "Me (the contributor)" },
    { value: "family", ne: "पति/पत्नी वा १८ वर्षमुनिको छोराछोरी", en: "Spouse or child under 18" },
    { value: "other", ne: "अन्य परिवार सदस्य", en: "Another family member" },
  ],
};

const MEDICAL_STEPS: Bi[] = [
  { ne: "उपचारपछि सबै बिल/रिपोर्ट जम्मा पार्ने (सक्कल)", en: "Collect all bills/reports after treatment (originals)" },
  { ne: "SOSYS मा login → Claim → औषधि उपचार योजना रोजी अनुसूची १/२ फाराम भर्ने", en: "Log in to SOSYS → Claim → choose the medical scheme and fill in Schedule 1/2" },
  { ne: "बिल, प्रेस्क्रिप्सन, discharge summary अपलोड गर्ने", en: "Upload bills, prescriptions, discharge summary" },
  { ne: "स्वीकृतिपछि रकम बैंक खातामा (२०% सह-भुक्तानी कटाएर)", en: "After approval the money arrives in your bank account (minus the 20% co-payment)" },
];

export const claimTypes: ClaimType[] = [
  {
    key: "medical-opd",
    icon: "activity",
    nameNe: "औषधि उपचार — OPD / प्रेस्क्रिप्सन",
    nameEn: "Medical treatment — OPD / prescriptions",
    who: "both",
    whoNe: "योगदानकर्ता, पति/पत्नी र १८ वर्षमुनिका छोराछोरी",
    whoEn: "Contributor, spouse and children under 18",
    qualifyingNe: "पछिल्ला ६ महिनामा कम्तीमा ३ महिना योगदान (नयाँ योगदानकर्ता: पहिलो ३ महिनापछि; योगदान रोकिएपछि ३ महिनासम्म कायम)",
    qualifyingEn: "At least 3 of the last 6 months of contributions (new contributors: after the first 3 months; cover lasts 3 months after stopping)",
    limits: [
      { ne: "OPD/प्रेस्क्रिप्सन: वार्षिक रु. २०,००० सम्म (अनौपचारिक र वैदेशिक रोजगारी: रु. २५,०००)", en: "OPD/prescriptions: up to Rs. 20,000/year (informal & foreign employment: Rs. 25,000)" },
      { ne: "प्रत्येक दाबीको २०% आफैँले व्यहोर्ने (सह-भुक्तानी)", en: "You bear 20% of every claim (co-payment)" },
      { ne: "भुक्तानी दर स्वास्थ्य संस्था छनौट कार्यविधि, २०७६ अनुसार", en: "Payment rates follow the Health Institution Selection Procedure 2076" },
    ],
    where: ["hospital-desk", "sosys"],
    steps: MEDICAL_STEPS,
    documents: docsFromChecklist("medical-claim"),
    caveats: [
      { ne: "सक्कल बिल/रसिद नभए दाबी अस्वीकृत हुने प्रमुख कारण हो", en: "Missing original bills/receipts is the main reason claims are rejected" },
      { ne: "गैर-दुर्घटना plastic/dental surgery, bariatric surgery जस्ता खर्च समेटिँदैन", en: "Non-accident plastic/dental surgery, bariatric surgery and similar costs are excluded" },
      UNKNOWN_DEADLINE,
    ],
    relatedArticleSlug: "swasthya-bima-ki-ssf-medical",
    relatedChecklistSlug: "medical-claim",
    formUrls: [...form("औषधी उपचार तथा स्वास्थ्य", "Medical & health scheme claim form (Schedule 1)"), ...form("अस्पतालले कोष समक्ष", "Hospital-to-Fund claim form (Schedule 2)")],
    videoIds: ["m2oKN85hFhU", "9LzsyY_4DsM"],
    questions: [Q_PATIENT, Q_MONTHS3, Q_AFFILIATED],
  },
  {
    key: "medical-inpatient",
    icon: "hospital",
    nameNe: "औषधि उपचार — अस्पताल भर्ना (IPD)",
    nameEn: "Medical treatment — hospital admission (IPD)",
    who: "both",
    whoNe: "योगदानकर्ता, पति/पत्नी र १८ वर्षमुनिका छोराछोरी",
    whoEn: "Contributor, spouse and children under 18",
    qualifyingNe: "पछिल्ला ६ महिनामा कम्तीमा ३ महिना योगदान (योगदान रोकिएपछि ३ महिनासम्म कायम)",
    qualifyingEn: "At least 3 of the last 6 months of contributions (cover lasts 3 months after stopping)",
    limits: [
      { ne: "भर्ना उपचार: परिवारसमेत वार्षिक रु. १,००,००० सम्म", en: "Inpatient treatment: up to Rs. 100,000/year (family total)" },
      { ne: "प्रत्येक दाबीको २०% सह-भुक्तानी", en: "20% co-payment on every claim" },
      { ne: "६० महिना योगदान गरेकालाई सूचीकृत अस्पतालमा रु. १–१० लाखको ५०% कोषले थप व्यहोर्छ", en: "With 60 months of contributions, the Fund additionally covers 50% of Rs. 100,000–1,000,000 at listed hospitals" },
      { ne: "OPD सीमा पूरा प्रयोग नभए सोही वर्ष IPD मा समायोजन — कुल रु. १ लाखभन्दा बढी हुँदैन", en: "Unused OPD limit can adjust into IPD the same year — total does not exceed Rs. 100,000" },
    ],
    where: ["hospital-desk", "sosys"],
    whereNote: { ne: "सूचीकृत अस्पतालमा भर्ना हुँदा नै SSN दिनुहोस् — क्यासलेस हुन्छ", en: "Give your SSN at admission at a listed hospital — it becomes cashless" },
    steps: MEDICAL_STEPS,
    documents: docsFromChecklist("medical-claim"),
    caveats: [
      { ne: "वार्षिक सीमा (भर्ना १ लाख / OPD २० हजार) कटिसकेको भए बाँकी खर्च आगामी वर्षको सीमामा पर्छ", en: "If the annual limit (inpatient Rs. 100,000 / OPD Rs. 20,000) is used up, the rest falls under next year's limit" },
      { ne: "एउटै खर्च दुर्घटना र औषधि उपचार दुवै योजनाबाट दाबी गर्न मिल्दैन", en: "The same expense cannot be claimed under both the accident and medical schemes" },
      UNKNOWN_DEADLINE,
    ],
    relatedArticleSlug: "swasthya-bima-ki-ssf-medical",
    relatedChecklistSlug: "medical-claim",
    formUrls: [...form("औषधी उपचार तथा स्वास्थ्य", "Medical & health scheme claim form (Schedule 1)"), ...form("अस्पतालले कोष समक्ष", "Hospital-to-Fund claim form (Schedule 2)")],
    videoIds: ["m2oKN85hFhU", "9LzsyY_4DsM"],
    questions: [Q_PATIENT, Q_MONTHS3, Q_AFFILIATED],
  },
  {
    key: "critical-illness",
    icon: "heart",
    nameNe: "घातक रोग (क्यान्सर, मृगौला, मुटु…)",
    nameEn: "Critical illness (cancer, kidney, heart…)",
    who: "contributor",
    whoNe: "योगदानकर्ता",
    whoEn: "The contributor",
    qualifyingNe: "पछिल्ला २८ महिनामा कम्तीमा २४ महिना नियमित योगदान (योगदान रोकिएपछि २४ महिनासम्म कायम; निवृत्तभरण पाउनेलाई ७ वर्ष)",
    qualifyingEn: "At least 24 of the last 28 months of regular contributions (cover lasts 24 months after stopping; 7 years for pensioners)",
    limits: [
      { ne: "सेवा अवधिभर जम्मा रु. १०,००,००० सम्म", en: "Up to Rs. 1,000,000 in total over the service period" },
      { ne: "रोग पहिचान (diagnosis) खर्च रु. १ लाखसम्म", en: "Diagnosis costs up to Rs. 100,000" },
      { ne: "मेडिकल बोर्डको सिफारिसमा विदेशी अस्पताल रु. ७ लाखसम्म", en: "Foreign hospital up to Rs. 700,000 on Medical Board recommendation" },
      { ne: "डिस्चार्जपछिको पुनः परीक्षण रु. २ लाखसम्म", en: "Post-discharge follow-up tests up to Rs. 200,000" },
    ],
    where: ["hospital-desk", "office", "sosys"],
    whereNote: { ne: "विदेशी अस्पतालको उपचारका लागि पहिले मेडिकल बोर्डको सिफारिस चाहिन्छ", en: "Treatment at a foreign hospital first needs a Medical Board recommendation" },
    steps: [
      { ne: "सूचीकृत रोग (क्यान्सर, मृगौला, हृदय शल्यक्रिया, मस्तिष्कघात, पार्किन्सन्स, अल्जाइमर्स, spinal/head injury, थालासेमिया आदि) पहिचान भएको diagnosis रिपोर्ट लिनुहोस्", en: "Get the diagnosis report for a listed illness (cancer, kidney disease, heart surgery, stroke, Parkinson's, Alzheimer's, spinal/head injury, thalassemia, etc.)" },
      { ne: "SSF-आबद्ध अस्पतालमा उपचार गराउनुहोस्; विदेशमा उपचार चाहिए मेडिकल बोर्डको सिफारिस लिनुहोस्", en: "Get treated at an SSF-affiliated hospital; for treatment abroad obtain the Medical Board recommendation" },
      { ne: "SOSYS मा औषधि उपचार योजनाअन्तर्गत दाबी पेश गर्नुहोस् — सबै बिल, रिपोर्ट, सिफारिस अपलोड", en: "File the claim under the medical scheme in SOSYS — upload all bills, reports and recommendations" },
      { ne: "स्वीकृतिपछि रकम बैंक खातामा", en: "After approval the money arrives in your bank account" },
    ],
    documents: [
      { ne: "रोग पहिचान (diagnosis) रिपोर्ट", en: "Diagnosis report" },
      { ne: "अस्पतालका बिल र रसिदहरू (सक्कल)", en: "Hospital bills and receipts (originals)" },
      { ne: "Discharge summary", en: "Discharge summary", conditional: true, noteNe: "भर्ना भएको भए", noteEn: "if admitted" },
      { ne: "मेडिकल बोर्डको सिफारिस", en: "Medical Board recommendation", conditional: true, noteNe: "विदेशी अस्पतालमा उपचार गर्दा", noteEn: "for treatment at a foreign hospital" },
      { ne: "दाबी फाराम (अनुसूची १/२)", en: "Claim form (Schedule 1/2)" },
      { ne: "बैंक खाता विवरण", en: "Bank account details" },
    ],
    caveats: [
      { ne: "योग्यता अवधि २४/२८ महिना हो — सामान्य उपचारको ३/६ महिना होइन", en: "The qualifying period is 24 of 28 months — not the 3 of 6 for ordinary treatment" },
      CONFIRM_DOCS,
      UNKNOWN_DEADLINE,
    ],
    relatedArticleSlug: "swasthya-bima-ki-ssf-medical",
    relatedChecklistSlug: "medical-claim",
    formUrls: form("औषधी उपचार तथा स्वास्थ्य", "Medical & health scheme claim form (Schedule 1)"),
    videoIds: ["9LzsyY_4DsM"],
    questions: [
      {
        id: "months24",
        ne: "पछिल्ला २८ महिनामा कम्तीमा २४ महिना नियमित योगदान छ?",
        en: "Have you contributed regularly for at least 24 of the last 28 months?",
        options: [
          { value: "yes", ne: "छ", en: "Yes" },
          { value: "no", ne: "छैन / थाहा छैन", en: "No / not sure" },
        ],
      },
      {
        id: "abroad",
        ne: "उपचार कहाँ हुँदैछ?",
        en: "Where is the treatment?",
        options: [
          { value: "nepal", ne: "नेपालको SSF-आबद्ध अस्पताल", en: "SSF-affiliated hospital in Nepal" },
          { value: "abroad", ne: "विदेशी अस्पताल", en: "Foreign hospital" },
        ],
      },
    ],
  },
  {
    key: "maternity",
    icon: "baby",
    nameNe: "मातृत्व (सुत्केरी) सुविधा",
    nameEn: "Maternity benefit",
    who: "both",
    whoNe: "योगदानकर्ता वा योगदानकर्ताकी पत्नी (दुवै योगदानकर्ता भए एकजनाले मात्र)",
    whoEn: "The contributor or the contributor's wife (if both contribute, only one may claim)",
    qualifyingNe: "पछिल्ला ६ महिनामा कम्तीमा ३ महिना योगदान (औषधि उपचार, स्वास्थ्य तथा मातृत्व योजना, कार्यविधि २०७५ परिच्छेद २)",
    qualifyingEn: "At least 3 of the last 6 months of contributions (medical, health & maternity scheme, Procedure 2075 Chapter 2)",
    limits: [
      { ne: "प्रसूति स्याहार: प्रति शिशु एक महिनाको न्यूनतम पारिश्रमिक बराबर — २४ हप्तापछिको गर्भपतन/मृत शिशु जन्ममा पनि", en: "Newborn care: one month's minimum remuneration per child — also for miscarriage after 24 weeks or stillbirth" },
      { ne: "गर्भ परीक्षण, प्रसूति शल्यक्रिया/उपचार, सुत्केरीपछि ६ हप्तासम्म र ३ महिनासम्मको शिशु उपचार (उपचार सीमाभित्र)", en: "Pregnancy tests, delivery surgery/treatment, care up to 6 weeks after delivery and infant care up to 3 months (within treatment limits)" },
      { ne: "प्रसूति बिदा रकम: रोजगारदाताको ६० दिनबाहेकको अवधिमा आधारभूत पारिश्रमिकको ६०% (जम्मा ९८ दिनसम्म)", en: "Maternity-leave payment: 60% of basic salary beyond the employer's 60 days (up to 98 days total)" },
    ],
    where: ["sosys", "hospital-desk"],
    steps: [
      { ne: "सुत्केरी भएपछि कागजात तयार पार्ने — discharge रिपोर्ट, जन्मदर्ता, बिल", en: "Prepare the documents after delivery — discharge report, birth registration, bills" },
      { ne: "SOSYS/App मा login → Claim → मातृत्व सुरक्षा योजना → अनुसूची ३ फाराम भर्ने (mobile बाटै सम्भव)", en: "Log in to SOSYS/App → Claim → maternity scheme → fill in Schedule 3 (possible from mobile)" },
      { ne: "कागजात अपलोड गरी पेश गर्ने", en: "Upload the documents and submit" },
      { ne: "प्रति शिशु १ महिनाको न्यूनतम पारिश्रमिक + उपचार खर्च खातामा आउने", en: "One month's minimum wage per child + treatment costs arrive in your account" },
    ],
    documents: docsFromChecklist("maternity-claim"),
    caveats: [
      { ne: "पति-पत्नी दुवैले दाबी गर्नु अस्वीकृतिको कारण हो — एकजनाले मात्र पाइन्छ", en: "Both spouses claiming is a rejection reason — only one may claim" },
      { ne: "अवैध गर्भपतन समेटिँदैन", en: "Illegal abortion is excluded" },
      UNKNOWN_DEADLINE,
    ],
    relatedArticleSlug: "swasthya-bima-ki-ssf-medical",
    relatedChecklistSlug: "maternity-claim",
    formUrls: form("मातृत्व सुरक्षा", "Maternity scheme claim form (Schedule 3)"),
    videoIds: ["S_Ch2yO7G3A"],
    questions: [
      Q_MONTHS3,
      {
        id: "bothSpouses",
        ne: "पति-पत्नी दुवै SSF योगदानकर्ता हुनुहुन्छ?",
        en: "Are both spouses SSF contributors?",
        options: [
          { value: "no", ne: "होइन — एकजना मात्र", en: "No — only one" },
          { value: "yes", ne: "हो — दुवै", en: "Yes — both" },
        ],
      },
    ],
  },
  {
    key: "sick-leave",
    icon: "clock",
    nameNe: "लामो बिरामी बिदा रकम",
    nameEn: "Extended sick-leave payment",
    who: "contributor",
    whoNe: "औपचारिक क्षेत्रका योगदानकर्ता (कर्मचारी)",
    whoEn: "Formal-sector contributors (employees)",
    qualifyingNe: "पछिल्ला ६ महिनामा कम्तीमा ३ महिना योगदान; रोजगारदाताको वार्षिक १२ दिन बिरामी बिदा सकिएपछि लागू",
    qualifyingEn: "At least 3 of the last 6 months of contributions; applies after the employer's 12 days of annual sick leave are used",
    limits: [
      { ne: "आधारभूत पारिश्रमिकको ६०% (२.६७% घटाएर) — अस्पताल भर्ना वा चिकित्सकको सिफारिसमा घरमै उपचार गराउँदा", en: "60% of basic salary (less 2.67%) — for hospital admission or home treatment on a doctor's recommendation" },
      { ne: "वार्षिक बढीमा १३ हप्तासम्म (कार्यविधि २०७५, दफा ७)", en: "Up to 13 weeks per year (Procedure 2075, section 7)" },
    ],
    where: ["sosys"],
    steps: [
      { ne: "रोजगारदाताको १२ दिन बिरामी बिदा सकिएको यकिन गर्नुहोस्", en: "Confirm the employer's 12 days of sick leave are used up" },
      { ne: "अस्पताल भर्ना/चिकित्सकको सिफारिस र बिदा अवधिको प्रमाण जुटाउनुहोस्", en: "Gather the hospital admission/doctor's recommendation and proof of the leave period" },
      { ne: "SOSYS मा औषधि उपचार योजनाअन्तर्गत बिरामी बिदा रकम दाबी गर्नुहोस्", en: "Claim the sick-leave payment under the medical scheme in SOSYS" },
      { ne: "स्वीकृतिपछि रकम बैंक खातामा", en: "After approval the money arrives in your bank account" },
    ],
    documents: [
      { ne: "अस्पताल भर्नाको प्रमाण (discharge summary) वा चिकित्सकको घरमै उपचारको सिफारिस", en: "Proof of hospital admission (discharge summary) or a doctor's recommendation for home treatment" },
      { ne: "रोजगारदाताको बिदा विवरण — १२ दिन बिरामी बिदा सकिएको", en: "Employer's leave record — 12 days of sick leave used" },
      { ne: "प्रेस्क्रिप्सन र रिपोर्ट", en: "Prescriptions and reports" },
      { ne: "दाबी फाराम (अनुसूची १/२)", en: "Claim form (Schedule 1/2)" },
      { ne: "बैंक खाता विवरण", en: "Bank account details" },
    ],
    caveats: [CONFIRM_DOCS, UNKNOWN_DEADLINE],
    relatedArticleSlug: "swasthya-bima-ki-ssf-medical",
    relatedChecklistSlug: "medical-claim",
    formUrls: form("औषधी उपचार तथा स्वास्थ्य", "Medical & health scheme claim form (Schedule 1)"),
    videoIds: ["m2oKN85hFhU"],
    questions: [
      Q_MONTHS3,
      {
        id: "leaveUsed",
        ne: "रोजगारदाताको वार्षिक १२ दिन बिरामी बिदा सकिएको छ?",
        en: "Have you used up the employer's 12 days of annual sick leave?",
        options: [
          { value: "yes", ne: "छ", en: "Yes" },
          { value: "no", ne: "छैन", en: "No" },
        ],
      },
    ],
  },
  {
    key: "accident-workplace",
    icon: "alert",
    nameNe: "रोजगारीजन्य दुर्घटना (काममा भएको)",
    nameEn: "Workplace (employment) accident",
    who: "contributor",
    whoNe: "योगदानकर्ता — रोजगारदाता, योगदानकर्ता वा परिवारले जानकारी गराउन सक्छ",
    whoEn: "The contributor — the employer, contributor or family may report it",
    qualifyingNe: "पहिलो योगदानदेखि नै लागू (पेशागत रोग: २ वर्षपछि)",
    qualifyingEn: "Covered from the first contribution (occupational disease: after 2 years)",
    limits: [
      { ne: "पूरै उपचार खर्च कोषले व्यहोर्छ", en: "The Fund covers the full treatment cost" },
      { ne: "७ दिनभित्र जानकारी नगराई सम्झौता नभएको अस्पतालमा उपचार गराए: अधिकतम रु. ७,००,०००", en: "Treated at a non-contracted hospital without notice within 7 days: max Rs. 700,000" },
      { ne: "काम गर्न नसक्ने अवधिमा आधारभूत पारिश्रमिकको ६०% मासिक (३ महिनाभन्दा लामो भए समितिको सिफारिस)", en: "60% of basic salary monthly while unable to work (beyond 3 months needs committee endorsement)" },
    ],
    where: ["hospital-desk", "sosys"],
    whereNote: { ne: "सबैभन्दा पहिले ७ दिनभित्र कोषलाई जानकारी — message/email बाट पनि हुन्छ", en: "First of all, inform the Fund within 7 days — a message/email also works" },
    steps: [
      { ne: "दुर्घटना भएको ७ दिनभित्र कोषलाई जानकारी (message/email हुन्छ)", en: "Inform the Fund within 7 days of the accident (message/email works)" },
      { ne: "SSF-आबद्ध अस्पतालमा उपचार — रोजगारीजन्य भए पूरै खर्च कोषले व्यहोर्छ", en: "Treatment at an SSF-affiliated hospital — for workplace accidents the Fund covers the full cost" },
      { ne: "रोजगारदाताको दुर्घटना प्रतिवेदन र स्वघोषणा फाराम तयार पार्ने", en: "Prepare the employer's accident report and the self-declaration form" },
      { ne: "SOSYS मा अनुसूची ४/५ फाराम भरी बिल/रिपोर्ट अपलोड गरी पेश गर्ने", en: "Fill in Schedule 4/5 in SOSYS, upload bills/reports and submit" },
      { ne: "अशक्तता भए समितिको किटानपछि मासिक निवृत्तभरण", en: "In case of disability, a monthly pension after the Committee's determination" },
    ],
    documents: docsFromChecklist("accident-disability-claim"),
    caveats: [
      { ne: "७ दिनभित्र जानकारी नगराउनु — सम्झौता नभएको अस्पतालमा रु. ७ लाखभन्दा बढी नपाइने", en: "Not informing within 7 days — no more than Rs. 700,000 is covered at a non-contracted hospital" },
      { ne: "ढिलाइको मनासिब कारण (ICU, बेहोस अवस्था आदि) भए प्रमाणसहित लेखेर पेश गर्नुहोस्", en: "If there was a reasonable cause for delay (ICU, unconsciousness, etc.), submit a written explanation with evidence" },
      { ne: "रोजगारदाताले योगदान नबुझाएको अवधिमा भएको दुर्घटनाको सुविधा रोजगारदाता स्वयंले तिर्नुपर्छ (ऐन दफा ९)", en: "For an accident during a period the employer did not deposit contributions, the employer itself owes the benefit (Act §9)" },
    ],
    relatedArticleSlug: "kyc-profile-claim-guide",
    relatedChecklistSlug: "accident-disability-claim",
    formUrls: [
      ...form("दुर्घटना तथा अशक्तता", "Accident & disability scheme claim form (Schedule 4/5)"),
      ...form("रोजगारीजन्य दुर्घटनाको स्वघोषणा", "Workplace accident self-declaration form", APPLICATION_CATEGORY),
    ],
    videoIds: ["m2oKN85hFhU"],
    questions: [
      {
        id: "reported7",
        ne: "दुर्घटनाको ७ दिनभित्र कोषलाई जानकारी गराइयो?",
        en: "Was the Fund informed within 7 days of the accident?",
        options: [
          { value: "yes", ne: "गराइयो", en: "Yes" },
          { value: "pending", ne: "अझै ७ दिन बितेको छैन", en: "Not yet — still within 7 days" },
          { value: "no", ne: "गराइएन", en: "No" },
        ],
      },
      Q_AFFILIATED,
    ],
  },
  {
    key: "accident-other",
    icon: "shield",
    nameNe: "गैर-रोजगारीजन्य दुर्घटना (काम बाहिर)",
    nameEn: "Non-work accident",
    who: "contributor",
    whoNe: "योगदानकर्ता",
    whoEn: "The contributor",
    qualifyingNe: "पहिलो योगदानदेखि लागू; योगदान चालु हुनुपर्छ (योगदान रोकिए दुर्घटना सुविधा तुरुन्तै रोकिन्छ)",
    qualifyingEn: "Covered from the first contribution; contributions must be active (accident cover stops as soon as contributions stop)",
    limits: [
      { ne: "उपचार खर्च अधिकतम रु. ७,००,०००", en: "Treatment costs up to Rs. 700,000" },
      { ne: "अन्य बीमाबाट रु. ७ लाख वा बढी पाए कोषले व्यहोर्दैन", en: "Nil if other insurance pays Rs. 700,000 or more" },
      { ne: "परिवार (पति/पत्नी, १८ मुनिका छोराछोरी) को दुर्घटना उपचार रु. १ लाखसम्म", en: "Family accident treatment (spouse/child under 18) up to Rs. 100,000" },
    ],
    where: ["hospital-desk", "sosys"],
    steps: [
      { ne: "SSF-आबद्ध अस्पतालमा उपचार गराउनुहोस् र सबै बिल/रिपोर्ट सुरक्षित राख्नुहोस्", en: "Get treated at an SSF-affiliated hospital and keep all bills/reports" },
      { ne: "प्रहरी प्रतिवेदन (लागू भए) लिनुहोस्", en: "Obtain the police report (where applicable)" },
      { ne: "SOSYS मा दुर्घटना तथा अशक्तता योजना रोजी अनुसूची ४/५ भरी पेश गर्नुहोस्", en: "Choose the accident & disability scheme in SOSYS, fill in Schedule 4/5 and submit" },
      { ne: "स्वीकृतिपछि रकम बैंक खातामा", en: "After approval the money arrives in your bank account" },
    ],
    documents: docsFromChecklist("accident-disability-claim").filter((d) => !d.ne.includes("रोजगारदाताको दुर्घटना प्रतिवेदन")),
    caveats: [
      { ne: "गैर-रोजगारीजन्य दुर्घटनामा पूरै खर्चको अपेक्षा नगर्नुहोस् — सीमा रु. ७ लाख", en: "Do not expect full costs for a non-work accident — the limit is Rs. 700,000" },
      { ne: "एउटै खर्च दुर्घटना र औषधि उपचार दुवैबाट दाबी गर्न मिल्दैन", en: "The same expense cannot be claimed under both the accident and medical schemes" },
      UNKNOWN_DEADLINE,
    ],
    relatedArticleSlug: "kyc-profile-claim-guide",
    relatedChecklistSlug: "accident-disability-claim",
    formUrls: form("दुर्घटना तथा अशक्तता", "Accident & disability scheme claim form (Schedule 4/5)"),
    videoIds: ["m2oKN85hFhU"],
    questions: [
      {
        id: "active",
        ne: "दुर्घटना हुँदा योगदान चालु (active) थियो?",
        en: "Were contributions active at the time of the accident?",
        options: [
          { value: "yes", ne: "थियो", en: "Yes" },
          { value: "no", ne: "थिएन / थाहा छैन", en: "No / not sure" },
        ],
      },
      {
        id: "otherInsurance",
        ne: "अन्य बीमाबाट रु. ७ लाख वा बढी पाउनुहुन्छ?",
        en: "Will other insurance pay Rs. 700,000 or more?",
        options: [
          { value: "no", ne: "छैन / ७ लाखभन्दा कम", en: "No / less than Rs. 700,000" },
          { value: "yes", ne: "छ — ७ लाख वा बढी", en: "Yes — Rs. 700,000 or more" },
        ],
      },
    ],
  },
  {
    key: "disability",
    icon: "user",
    nameNe: "अशक्तता निवृत्तभरण / एकमुष्ट",
    nameEn: "Disability pension / lump sum",
    who: "contributor",
    whoNe: "दुर्घटना वा पेशागत रोगबाट अशक्त योगदानकर्ता (वा हेरचाहकर्ता)",
    whoEn: "A contributor disabled by accident or occupational disease (or their caretaker)",
    qualifyingNe: "दुर्घटना: पहिलो योगदानदेखि; पेशागत रोग: २ वर्षपछि। अशक्तता % स्वास्थ्य परीक्षण समितिले किटान गर्छ",
    qualifyingEn: "Accident: from the first contribution; occupational disease: after 2 years. The disability % is determined by the Health Examination Committee",
    limits: [
      { ne: "स्थायी अशक्तता: आधारभूत पारिश्रमिकको ६०% × अशक्तता %, आजीवन, मुद्रास्फीति समायोजनसहित", en: "Permanent disability: 60% of basic salary × disability %, lifelong, inflation-adjusted" },
      { ne: "२०% वा कम अशक्तता भए एकमुष्ट भुक्तानी हुनसक्छ", en: "If disability is 20% or less, a lump sum may be paid" },
      { ne: "पूर्ण अशक्तता: आधारभूत पारिश्रमिकको ६०% आजीवन (न्यूनतम आधारभूत पारिश्रमिकको ६०% भन्दा कम नहुने); हेरचाहकर्ता रकम सम्भव", en: "Total disability: 60% of basic salary lifelong (floor 60% of minimum basic remuneration); caregiver payment possible" },
      { ne: "अस्थायी पूर्ण अशक्तता: काममा नफर्किँदासम्म ६०% मासिक", en: "Temporary total incapacity: 60% monthly until return to work" },
    ],
    where: ["office", "sosys"],
    whereNote: { ne: "अशक्तता प्रतिशत किटानका लागि स्वास्थ्य परीक्षण समितिको प्रक्रिया कोषमार्फत हुन्छ", en: "The Health Examination Committee's determination of the disability % goes through the Fund" },
    steps: [
      { ne: "दुर्घटनाको ७ दिनभित्र कोषलाई जानकारी र उपचार (दुर्घटना दाबी हेर्नुहोस्)", en: "Inform the Fund within 7 days of the accident and get treated (see the accident claim)" },
      { ne: "उपचारपछि स्वास्थ्य परीक्षण समितिबाट अशक्तता प्रतिशत किटान गराउनुहोस्", en: "After treatment, have the Health Examination Committee determine the disability %" },
      { ne: "अनुसूची ४/५ फाराम, मेडिकल रिपोर्ट र समितिको किटानसहित दाबी पेश गर्नुहोस्", en: "File the claim with Schedule 4/5, medical reports and the Committee's determination" },
      { ne: "मासिक निवृत्तभरण (वा ≤२०% भए एकमुष्ट) बैंक खातामा", en: "Monthly pension (or a lump sum if ≤20%) to your bank account" },
      { ne: "प्रत्येक ५ वर्षमा पुनरावलोकन — अन्तिम ५८ वर्षको उमेरमा", en: "Review every 5 years — the last at age 58" },
    ],
    documents: docsFromChecklist("accident-disability-claim"),
    caveats: [
      { ne: "अशक्तता % किटान नभई निवृत्तभरण सुरु हुँदैन", en: "The pension cannot start until the disability % is determined" },
      { ne: "पेशागत रोगका लागि २ वर्षको योगदान चाहिन्छ", en: "Occupational disease requires 2 years of contributions" },
      UNKNOWN_DEADLINE,
    ],
    relatedArticleSlug: "kyc-profile-claim-guide",
    relatedChecklistSlug: "accident-disability-claim",
    formUrls: form("दुर्घटना तथा अशक्तता", "Accident & disability scheme claim form (Schedule 4/5)"),
    videoIds: [],
    questions: [
      {
        id: "cause",
        ne: "अशक्तताको कारण के हो?",
        en: "What caused the disability?",
        options: [
          { value: "work-accident", ne: "रोजगारीजन्य दुर्घटना", en: "Workplace accident" },
          { value: "other-accident", ne: "गैर-रोजगारीजन्य दुर्घटना", en: "Non-work accident" },
          { value: "disease", ne: "पेशागत रोग", en: "Occupational disease" },
        ],
      },
      {
        id: "committee",
        ne: "स्वास्थ्य परीक्षण समितिले अशक्तता % किटान गरिसक्यो?",
        en: "Has the Health Examination Committee determined the disability %?",
        options: [
          { value: "yes", ne: "गरिसक्यो", en: "Yes" },
          { value: "no", ne: "अझै छैन", en: "Not yet" },
        ],
      },
    ],
  },
  {
    key: "dependent-family",
    icon: "family",
    nameNe: "आश्रित परिवार सुविधा (योगदानकर्ताको मृत्यु)",
    nameEn: "Dependent family benefit (death of a contributor)",
    who: "family",
    whoNe: "पति/पत्नी, १८ वर्षमुनिका छोराछोरी (अध्ययनरत २१), वा आश्रित बाबुआमा",
    whoEn: "Spouse, children under 18 (21 if studying), or dependent parents",
    qualifyingNe: "रोजगारीजन्य मृत्यु: पहिलो दिनदेखि; अन्य कारणको मृत्यु: कम्तीमा १२ महिना योगदान (५औँ संशोधन)",
    qualifyingEn: "Work-related death: from day one; death from other causes: at least 12 months of contributions (5th Amendment)",
    limits: [
      { ne: "पति/पत्नीलाई अन्तिम आधारभूत पारिश्रमिकको ६०% आजीवन मासिक (अर्को विवाह/वैकल्पिक रोजगारीमा रोकिन्छ)", en: "Spouse: 60% of the last basic salary monthly for life (stops on remarriage/alternative employment)" },
      { ne: "१८ वर्षमुनिका बढीमा २ सन्ततिलाई ४०% दामासाहीले (अध्ययनरत भए २१ वर्षसम्म; अपाङ्ग भए सीमा छैन)", en: "Up to 2 children under 18 share 40% (until 21 if studying; no limit if disabled)" },
      { ne: "पति/पत्नी र छोराछोरी नभए आश्रित बाबुआमालाई ६०% दामासाहीले", en: "If no spouse or children, dependent parents share 60%" },
      { ne: "अन्तिम संस्कार खर्च रु. २५,००० एकमुष्ट", en: "Funeral costs: Rs. 25,000 as a lump sum" },
    ],
    where: ["office", "sosys"],
    whereNote: { ne: "भुक्तानी nominee/हकवाला विवरणका आधारमा हुन्छ — पुरानो विवरण भए पहिले सच्याउनुपर्छ", en: "Payment follows the nominee/heir details — outdated details must be corrected first" },
    steps: [
      { ne: "मृत्यु दर्ता र नाता प्रमाणित कागजात बनाउनुहोस्", en: "Obtain the death registration and certified relationship document" },
      { ne: "रोजगारीजन्य मृत्यु भए रोजगारदाताको दुर्घटना प्रतिवेदन लिनुहोस् (७ दिनभित्र कोषलाई जानकारी)", en: "For a work-related death, get the employer's accident report (inform the Fund within 7 days)" },
      { ne: "अनुसूची ६/७ फाराम भरी कागजातसहित कोषमा पेश गर्नुहोस्", en: "Fill in Schedule 6/7 and submit it with the documents to the Fund" },
      { ne: "स्वीकृतिपछि मासिक रकम र अन्तिम संस्कार खर्च हकवालाको बैंक खातामा", en: "After approval the monthly amount and funeral costs go to the heir's bank account" },
    ],
    documents: [
      { ne: "मृत्यु दर्ता प्रमाणपत्र", en: "Death registration certificate" },
      { ne: "नाता प्रमाणित कागजात (पति/पत्नी, सन्तति वा बाबुआमा)", en: "Certified relationship document (spouse, children or parents)" },
      { ne: "हकवाला/nominee को नागरिकता र फोटो", en: "Heir/nominee's citizenship and photo" },
      { ne: "मृतकको SSN र नागरिकता", en: "The deceased's SSN and citizenship" },
      { ne: "रोजगारदाताको दुर्घटना प्रतिवेदन", en: "Employer's accident report", conditional: true, noteNe: "रोजगारीजन्य मृत्युमा", noteEn: "for a work-related death" },
      { ne: "सन्ततिको अध्ययनरत प्रमाण", en: "Proof that the child is studying", conditional: true, noteNe: "१८–२१ वर्षका लागि", noteEn: "for ages 18–21" },
      { ne: "दाबी फाराम (अनुसूची ६/७)", en: "Claim form (Schedule 6/7)" },
      { ne: "हकवालाको बैंक खाता विवरण", en: "Heir's bank account details" },
    ],
    caveats: [
      { ne: "nominee विवरण पुरानो/नभएको भए नाता प्रमाणित र हकवाला प्रमाणसहित कोषमा निवेदन दिनुपर्छ", en: "If nominee details are outdated/missing, apply to the Fund with a certified relationship document and proof of heirship" },
      { ne: "निवृत्तभरण सुरु भएको ७ वर्षभित्र मृत्यु भए: पति/पत्नीले ७ वर्षसम्म उही रकम, त्यसपछि ५०% आजीवन", en: "If a pensioner dies within 7 years of the pension starting: the spouse gets the same amount to the 7-year mark, then 50% for life" },
      CONFIRM_DOCS,
    ],
    relatedArticleSlug: "kyc-profile-claim-guide",
    relatedChecklistSlug: "nominee-update",
    formUrls: form("आश्रित परिवार", "Dependent family scheme claim form (Schedule 6/7)"),
    videoIds: ["8QyRTsZkHyg"],
    questions: [
      {
        id: "deathCause",
        ne: "मृत्यु रोजगारीजन्य दुर्घटनाबाट भएको हो?",
        en: "Was the death caused by a workplace accident?",
        options: [
          { value: "work", ne: "हो", en: "Yes" },
          { value: "other", ne: "होइन — अन्य कारण", en: "No — other cause" },
        ],
      },
      {
        id: "months12",
        ne: "मृतकको कम्तीमा १२ महिना योगदान थियो?",
        en: "Did the deceased have at least 12 months of contributions?",
        options: [
          { value: "yes", ne: "थियो", en: "Yes" },
          { value: "no", ne: "थिएन / थाहा छैन", en: "No / not sure" },
        ],
      },
    ],
  },
  {
    key: "retirement-lumpsum",
    icon: "coins",
    nameNe: "अवकाश सुविधा रकम (एकमुष्ट)",
    nameEn: "Retirement benefit (lump sum)",
    who: "contributor",
    whoNe: "रोजगारी अन्त्य भएका वा अवकाश लिएका योगदानकर्ता; ६० वर्षअघि मृत्यु भए हकवाला",
    whoEn: "Contributors whose employment ended or who retired; heirs if the contributor died before 60",
    qualifyingNe: "रोजगारी अन्त्य वा अवकाश (रोजगारदाताले १ महिनाभित्र exit जनाउनुपर्छ); KYC पूरा भएको",
    qualifyingEn: "End of employment or retirement (the employer must report the exit within 1 month); KYC complete",
    limits: [
      { ne: "अवकाश सुविधा योजनाको रकम (८.३३% + स्वेच्छिक थप + पुरानो PF/उपदानबाट हस्तान्तरित) प्रतिफलसहित एकमुष्ट", en: "The retirement-benefit scheme money (8.33% + voluntary + transferred PF/gratuity) with returns, as a lump sum" },
      { ne: "निवृत्तभरण योजनाको २०% ६० वर्षसम्म कोषमै रहन्छ — ÷१६० को पेन्सनका लागि", en: "The 20% pension-scheme money stays in the Fund until 60 — for the ÷160 pension" },
      { ne: "६० वर्षमा १८० महिना नपुगे: एकमुष्ट लिने वा ÷१६० पेन्सन रोज्ने", en: "At 60 with under 180 months: choose a lump sum or the ÷160 pension" },
      { ne: "६० वर्षअघि मृत्यु भए हकवालाले सम्पूर्ण रकम प्रतिफलसहित एकमुष्ट; विदेशी नागरिकले रोजगारी सकिएपछि पूरै फिर्ता", en: "Death before 60: heirs receive everything with returns as a lump sum; foreign nationals withdraw fully at the end of employment" },
    ],
    where: ["sosys", "office"],
    steps: [
      { ne: "रोजगारदाताले SOSYS मा तपाईंको exit जनाएको यकिन गर्नुहोस्", en: "Confirm the employer has recorded your exit in SOSYS" },
      { ne: "KYC र बैंक खाता विवरण अद्यावधिक गर्नुहोस्", en: "Update your KYC and bank account details" },
      { ne: "अवकाश भुक्तानी (Lump Sum Withdraw) फाराम भरी SOSYS/App वा कार्यालयमा पेश गर्नुहोस्", en: "Fill in the Lump Sum Withdraw form and submit via SOSYS/App or at an office" },
      { ne: "स्वीकृतिपछि रकम बैंक खातामा", en: "After approval the money arrives in your bank account" },
    ],
    documents: [
      { ne: "नागरिकता/राहदानी र SSN", en: "Citizenship/passport and SSN" },
      { ne: "रोजगारी अन्त्यको प्रमाण (रोजगारदाताको exit जानकारी/पत्र)", en: "Proof of end of employment (employer's exit record/letter)" },
      { ne: "अवकाश भुक्तानी फाराम (Lump Sum Withdraw)", en: "Lump Sum Withdraw form" },
      { ne: "बैंक खाता विवरण", en: "Bank account details" },
      { ne: "मृत्यु दर्ता र हकवाला प्रमाण", en: "Death registration and proof of heirship", conditional: true, noteNe: "हकवालाले दाबी गर्दा", noteEn: "when an heir claims" },
    ],
    caveats: [
      { ne: "«जागिर छाडेपछि ३१% सबै फिर्ता» गलत हो — एकमुष्ट पाइने अवकाश सुविधाको भाग मात्र हो", en: "'All 31% is refunded after quitting' is wrong — only the retirement-benefit part is paid as a lump sum" },
      { ne: "नयाँ SSF-सूचीकृत रोजगारदातामा गए उही SSN मा योगदान निरन्तर चल्छ — झिक्नु अनिवार्य छैन", en: "If you join a new SSF-listed employer, contributions continue on the same SSN — withdrawing is not mandatory" },
      CONFIRM_DOCS,
    ],
    relatedArticleSlug: "jagir-chadepachi-ke-huncha",
    relatedChecklistSlug: "kyc-verification",
    formUrls: [...form("अवकाश भुक्तानी", "Retirement payment form (Lump Sum Withdraw)"), ...form("रकमान्तर", "Transfer to retirement-benefit scheme form")],
    videoIds: ["Q4SrXAtj074", "R0TzLoCRdL4"],
    questions: [
      {
        id: "situation",
        ne: "तपाईंको अवस्था?",
        en: "Your situation?",
        options: [
          { value: "job-ended", ne: "जागिर छाडेँ / सकियो (६० मुनि)", en: "Left / lost my job (under 60)" },
          { value: "age60", ne: "६० वर्ष पुगेँ", en: "Turned 60" },
          { value: "foreign", ne: "विदेशी नागरिक — रोजगारी सकियो", en: "Foreign national — employment ended" },
          { value: "heir", ne: "हकवाला — योगदानकर्ताको ६० अघि मृत्यु", en: "Heir — the contributor died before 60" },
        ],
      },
      {
        id: "exit",
        ne: "रोजगारदाताले SOSYS मा exit जनाइसक्यो?",
        en: "Has the employer recorded your exit in SOSYS?",
        options: [
          { value: "yes", ne: "जनाइसक्यो", en: "Yes" },
          { value: "no", ne: "छैन / थाहा छैन", en: "No / not sure" },
        ],
      },
    ],
  },
  {
    key: "pension",
    icon: "landmark",
    nameNe: "निवृत्तभरण (मासिक पेन्सन)",
    nameEn: "Old-age pension (monthly)",
    who: "contributor",
    whoNe: "६० वर्ष पुगेका योगदानकर्ता",
    whoEn: "Contributors who have reached 60",
    qualifyingNe: "६० वर्ष उमेर पूरा + कम्तीमा १८० महिना (१५ वर्ष) योगदान (कार्यविधि २०७५, दफा २०–२२)",
    qualifyingEn: "Age 60 completed + at least 180 months (15 years) of contributions (Procedure 2075, sections 20–22)",
    limits: [
      { ne: "मासिक पेन्सन = (निवृत्तभरण खातामा जम्मा + लगानी प्रतिफल) ÷ १६०, आजीवन, मुद्रास्फीति समायोजनसहित", en: "Monthly pension = (pension deposits + investment returns) ÷ 160, for life, inflation-adjusted" },
      { ne: "१८० महिना नपुगी ६० वर्ष पुगे: एकमुष्ट वा ÷१६० पेन्सन — रोज्न पाइन्छ", en: "At 60 with under 180 months: choose a lump sum or the ÷160 pension" },
      { ne: "मासिक पेन्सनको १% तिरेर आजीवन औषधि उपचार सुविधा निरन्तर", en: "Pay 1% of the monthly pension for lifelong medical coverage" },
      { ne: "सरकारी वा अन्य पेन्सन पाइरहेकाले पनि SSF पेन्सन लिन बाधा पर्दैन (दफा २४घ)", en: "Receiving a government or other pension is no bar to the SSF pension (§24d)" },
    ],
    where: ["sosys", "office"],
    steps: [
      { ne: "६० वर्ष पुग्नुअघि SOSYS मा योगदान महिना (१८० पुगेको) र KYC जाँच्नुहोस्", en: "Before turning 60, check your contribution months (180 reached) and KYC in SOSYS" },
      { ne: "अनुसूची ८–१० फाराम भर्नुहोस् — पेन्सन वा एकमुष्ट विकल्प रोज्नुहोस् (१८० नपुगे)", en: "Fill in Schedule 8–10 — choose pension or lump sum (if under 180 months)" },
      { ne: "नागरिकता, बैंक खाता र कागजातसहित SOSYS/App वा कार्यालयमा पेश गर्नुहोस्", en: "Submit with citizenship, bank account and documents via SOSYS/App or at an office" },
      { ne: "स्वीकृतिपछि हरेक महिना पेन्सन बैंक खातामा", en: "After approval the pension arrives in your bank account every month" },
      { ne: "औषधि उपचार निरन्तरता चाहिए निवृत्तभरण-पश्चात् फाराम भर्नुहोस् (पेन्सनको १%)", en: "To continue medical coverage, fill in the post-retirement form (1% of pension)" },
    ],
    documents: [
      { ne: "नागरिकता (६० वर्ष पुगेको प्रमाण) र SSN", en: "Citizenship (proof of age 60) and SSN" },
      { ne: "निवृत्तभरण दाबी फाराम (अनुसूची ८–१०)", en: "Pension claim form (Schedule 8–10)" },
      { ne: "बैंक खाता विवरण", en: "Bank account details" },
      { ne: "हालसालैको फोटो", en: "Recent photo" },
      { ne: "रोजगारदाताको अवकाश पत्र", en: "Employer's retirement letter", conditional: true, noteNe: "रोजगारीमा रहेको भए", noteEn: "if still employed" },
    ],
    caveats: [
      { ne: "२०७८ साउन १ पछि योगदान सुरु गर्ने सबै अनिवार्य निवृत्तभरण योजनामा छन्", en: "Everyone whose contributions started on/after 2078 Shrawan 1 is in the mandatory pension scheme" },
      { ne: "६० वर्षपछि पनि काम गरे योगदान जारी राख्न सकिन्छ — नयाँ रकम अवकाश सुविधा योजनामा जम्मा हुन्छ", en: "If you work past 60, contributions continue into the retirement-benefit scheme" },
      CONFIRM_DOCS,
    ],
    relatedArticleSlug: "pension-ra-retirement-guide",
    relatedChecklistSlug: "kyc-verification",
    formUrls: [...form("अवकाश भुक्तानी", "Retirement payment form (Lump Sum Withdraw)"), ...form("निवृत्तभरण पश्चात्", "Post-retirement medical scheme form")],
    videoIds: ["8BLS0M5X6Os"],
    questions: [
      {
        id: "age60",
        ne: "तपाईंको उमेर?",
        en: "Your age?",
        prefill: "age60",
        options: [
          { value: "gte60", ne: "६० वा माथि", en: "60 or older" },
          { value: "lt60", ne: "६० मुनि", en: "Under 60" },
        ],
      },
      {
        id: "months180",
        ne: "कम्तीमा १८० महिना (१५ वर्ष) योगदान छ?",
        en: "Do you have at least 180 months (15 years) of contributions?",
        prefill: "months180",
        options: [
          { value: "yes", ne: "छ", en: "Yes" },
          { value: "no", ne: "छैन", en: "No" },
        ],
      },
    ],
  },
];

export function claimByKey(key: string): ClaimType | undefined {
  return claimTypes.find((c) => c.key === key);
}

/* ────────────────────────── eligibility verdict ────────────────────────── */

export type ClaimVerdict = "LIKELY" | "CONDITIONS" | "NOT_YET";

export interface ClaimResult {
  verdict: ClaimVerdict;
  title: Bi;
  reasons: Bi[];
}

const V = (verdict: ClaimVerdict, title: Bi, reasons: Bi[]): ClaimResult => ({ verdict, title, reasons });

/** Pure rule evaluation from verified-facts §3 — never a hard "no" unless unequivocal. */
export function evaluateClaim(key: ClaimKey, a: Record<string, string>): ClaimResult {
  const likelyMedical = (extra: Bi[] = []) =>
    V("LIKELY", { ne: "सुविधाको योग्यता देखिन्छ", en: "You appear eligible for the benefit" }, [
      { ne: "पछिल्ला ६ महिनामा ३ महिना योगदान — योग्यता अवधि पुगेको", en: "3 of the last 6 months contributed — qualifying period met" },
      ...extra,
    ]);
  const notYetMedical = V("NOT_YET", { ne: "अझै योगदान अवधि पुगेको छैन", en: "The qualifying period is not met yet" }, [
    { ne: "योग्यता: पछिल्ला ६ महिनामा कम्तीमा ३ महिना नियमित योगदान (कार्यविधि दफा ४)", en: "Eligibility: at least 3 regular months within the last 6 (Procedure section 4)" },
    { ne: "SOSYS मा contribution history जाँच्नुहोस् — रोजगारदाताले ढिलो दाखिला गरेको भए त्यो प्रमाण पेश गर्न सकिन्छ", en: "Check your contribution history in SOSYS — if the employer deposited late, that can be submitted as evidence" },
  ]);
  const stoppedMedical = V("CONDITIONS", { ne: "योगदान रोकिएपछिको ३ महिने अवधिभित्र भए मात्र", en: "Only if within the 3 months after contributions stopped" }, [
    { ne: "योगदान छाडेको ३ महिनासम्म मात्र उपचार सुविधा कायम रहन्छ", en: "After contributions stop, the medical benefit lasts only 3 more months" },
    { ne: "उपचार मिति र अन्तिम योगदान मिति मिलाएर हेर्नुहोस्", en: "Compare the treatment date with the last contribution date" },
  ]);
  const nonAffiliated: Bi = {
    ne: "सम्झौता नभएको अस्पताल: क्यासलेस हुँदैन — बिल तिरेर SOSYS बाट reimbursement दाबी गर्नुपर्छ; भुक्तानी दर कार्यविधि २०७६ अनुसार",
    en: "Non-contracted hospital: not cashless — pay the bill and claim reimbursement via SOSYS; payment rates follow Procedure 2076",
  };
  const familyOk: Bi = { ne: "पति/पत्नी र १८ वर्षमुनिका छोराछोरीको उपचार परिवारको वार्षिक सीमाभित्र समेटिन्छ", en: "Treatment of the spouse and children under 18 falls within the family's annual limit" };
  const otherFamily: Bi = { ne: "अन्य परिवार सदस्य (बाबुआमा, १८ वर्षमाथिका सन्तति) औषधि उपचार योजनामा समेटिँदैनन्", en: "Other family members (parents, children over 18) are not covered by the medical scheme" };

  switch (key) {
    case "medical-opd":
    case "medical-inpatient":
    case "sick-leave": {
      if (a.patient === "other") return V("CONDITIONS", { ne: "यो सदस्य औषधि उपचार योजनामा पर्दैनन्", en: "This member is not covered by the medical scheme" }, [otherFamily]);
      if (key === "sick-leave" && a.leaveUsed === "no")
        return V("CONDITIONS", { ne: "पहिले रोजगारदाताको १२ दिन बिरामी बिदा सकिनुपर्छ", en: "The employer's 12 days of sick leave must be used first" }, [
          { ne: "कोषको ६०% रकम रोजगारदाताको वार्षिक १२ दिनभन्दा लामो अवधिका लागि मात्र हो", en: "The Fund's 60% payment is only for the period beyond the employer's 12 days per year" },
        ]);
      if (a.months3 === "no") return notYetMedical;
      if (a.months3 === "stopped") return stoppedMedical;
      const extra: Bi[] = [];
      if (a.patient === "family") extra.push(familyOk);
      if (a.affiliated === "no") extra.push(nonAffiliated);
      return likelyMedical(extra);
    }
    case "maternity": {
      if (a.months3 === "no") return notYetMedical;
      if (a.months3 === "stopped") return stoppedMedical;
      const extra: Bi[] = [{ ne: "प्रति शिशु १ महिनाको न्यूनतम पारिश्रमिक + उपचार खर्च (सीमाभित्र) + ६०% प्रसूति बिदा रकम", en: "One month's minimum wage per child + treatment costs (within limits) + 60% maternity-leave payment" }];
      if (a.bothSpouses === "yes") extra.push({ ne: "दुवै योगदानकर्ता भए एकजनाले मात्र दाबी गर्नुहोस् — दुवैले गरे अस्वीकृत हुन्छ", en: "If both are contributors, only one should claim — claiming twice gets rejected" });
      return likelyMedical(extra);
    }
    case "critical-illness": {
      if (a.months24 === "no")
        return V("NOT_YET", { ne: "घातक रोगको योग्यता अवधि पुगेको देखिँदैन", en: "The critical-illness qualifying period does not appear to be met" }, [
          { ne: "योग्यता: पछिल्ला २८ महिनामा कम्तीमा २४ महिना नियमित योगदान", en: "Eligibility: at least 24 of the last 28 months of regular contributions" },
          { ne: "सामान्य औषधि उपचार (३/६ महिना) को सीमाभित्र भने दाबी गर्न सकिन्छ", en: "You can still claim within the ordinary medical limits (3 of 6 months)" },
        ]);
      const reasons: Bi[] = [{ ne: "सेवा अवधिभर रु. १० लाखसम्म; diagnosis रु. १ लाख; पुनः परीक्षण रु. २ लाख", en: "Up to Rs. 1,000,000 over the service period; diagnosis Rs. 100,000; follow-up Rs. 200,000" }];
      if (a.abroad === "abroad") {
        reasons.push({ ne: "विदेशी अस्पताल: मेडिकल बोर्डको सिफारिस अनिवार्य, सीमा रु. ७ लाख", en: "Foreign hospital: Medical Board recommendation required, limit Rs. 700,000" });
        return V("CONDITIONS", { ne: "योग्य — विदेशी उपचारका लागि मेडिकल बोर्डको सिफारिस चाहिन्छ", en: "Eligible — foreign treatment needs a Medical Board recommendation" }, reasons);
      }
      return V("LIKELY", { ne: "घातक रोग सुविधाको योग्यता देखिन्छ", en: "You appear eligible for the critical-illness benefit" }, reasons);
    }
    case "accident-workplace": {
      const base: Bi = { ne: "रोजगारीजन्य दुर्घटना — पहिलो योगदानदेखि नै लागू, पूरै उपचार खर्च कोषले व्यहोर्छ", en: "Workplace accident — covered from the first contribution; the Fund pays the full treatment cost" };
      if (a.reported7 === "pending")
        return V("LIKELY", { ne: "अहिले नै कोषलाई जानकारी गराउनुहोस् — ७ दिनभित्र", en: "Inform the Fund right now — within 7 days" }, [base, { ne: "message/email बाट पनि हुन्छ; नगराए सम्झौता नभएको अस्पतालमा रु. ७ लाख मात्र", en: "A message/email works; without it only Rs. 700,000 at a non-contracted hospital" }]);
      if (a.reported7 === "no") {
        if (a.affiliated === "yes")
          return V("CONDITIONS", { ne: "७ दिन बितिसक्यो — आबद्ध अस्पताल भएकाले दाबी अगाडि बढाउनुहोस्", en: "7 days have passed — proceed, since it was an affiliated hospital" }, [base, { ne: "ढिलाइको मनासिब कारण (ICU, बेहोस अवस्था) प्रमाणसहित लेखेर पेश गर्नुहोस्", en: "Submit a written explanation of the reasonable cause for delay (ICU, unconsciousness) with evidence" }]);
        return V("CONDITIONS", { ne: "७ दिनभित्र जानकारी नगराएको + सम्झौता नभएको अस्पताल: सीमा रु. ७ लाख", en: "No notice within 7 days + non-contracted hospital: limit Rs. 700,000" }, [
          { ne: "कोषले अधिकतम रु. ७,००,००० मात्र व्यहोर्छ — बाँकीको पुनरावलोकन माग्न सकिन्छ", en: "The Fund covers at most Rs. 700,000 — you can request a review of the rest" },
          { ne: "ढिलाइको मनासिब कारण प्रमाणसहित लेखेर पेश गर्नुहोस्", en: "Submit a written explanation of the reasonable cause for the delay with evidence" },
        ]);
      }
      return V("LIKELY", { ne: "रोजगारीजन्य दुर्घटना — पहिलो दिनदेखि नै सुविधा", en: "Workplace accident — covered from day one" }, [
        base,
        ...(a.affiliated === "no" ? [{ ne: "७ दिनभित्र जानकारी गराएकाले सम्झौता नभएको अस्पतालमा पनि सीमा लाग्दैन", en: "Since the Fund was informed within 7 days, the cap does not apply even at a non-contracted hospital" }] : []),
      ]);
    }
    case "accident-other": {
      if (a.active === "no")
        return V("NOT_YET", { ne: "योगदान चालु नभए दुर्घटना सुविधा पाइँदैन", en: "Accident cover requires active contributions" }, [
          { ne: "योगदान रोकिए दुर्घटना सुविधा तुरुन्तै रोकिन्छ (उपचार सुविधा ३ महिना कायम रहन्छ)", en: "Accident cover stops as soon as contributions stop (medical cover lasts 3 more months)" },
          { ne: "SOSYS मा contribution history जाँच्नुहोस्", en: "Check your contribution history in SOSYS" },
        ]);
      if (a.otherInsurance === "yes")
        return V("NOT_YET", { ne: "अन्य बीमाबाट ७ लाख वा बढी पाए कोषले व्यहोर्दैन", en: "If other insurance pays Rs. 700,000 or more, the Fund does not pay" }, [
          { ne: "गैर-रोजगारीजन्य दुर्घटनाको सीमा रु. ७ लाख हो — अन्य बीमाले त्यति पुर्‍याए कोषको दायित्व रहँदैन", en: "The non-work accident limit is Rs. 700,000 — if other insurance reaches that, the Fund has no liability" },
        ]);
      return V("CONDITIONS", { ne: "गैर-रोजगारीजन्य दुर्घटना — सीमासहित सुविधा", en: "Non-work accident — benefit with limits" }, [
        { ne: "उपचार खर्च रु. ७ लाखसम्म मात्र", en: "Treatment costs only up to Rs. 700,000" },
        { ne: "परिवार सदस्यको दुर्घटना उपचार रु. १ लाखसम्म", en: "Family member's accident treatment up to Rs. 100,000" },
      ]);
    }
    case "disability": {
      const reasons: Bi[] = [{ ne: "निवृत्तभरण = आधारभूत पारिश्रमिकको ६०% × अशक्तता %, आजीवन; ≤२०% भए एकमुष्ट हुनसक्छ", en: "Pension = 60% of basic salary × disability %, lifelong; ≤20% may be a lump sum" }];
      if (a.cause === "disease") reasons.push({ ne: "पेशागत रोगका लागि २ वर्षको योगदान चाहिन्छ", en: "Occupational disease requires 2 years of contributions" });
      if (a.cause === "other-accident") reasons.push({ ne: "योगदान चालु हुनुपर्छ; उपचार खर्चको सीमा रु. ७ लाख", en: "Contributions must be active; treatment cost limit Rs. 700,000" });
      if (a.committee === "no")
        return V("CONDITIONS", { ne: "पहिले स्वास्थ्य परीक्षण समितिबाट अशक्तता % किटान गराउनुहोस्", en: "First have the Health Examination Committee determine the disability %" }, [
          ...reasons,
          { ne: "किटान नभई निवृत्तभरण सुरु हुँदैन — कोषमार्फत समितिको प्रक्रिया अगाडि बढाउनुहोस्", en: "The pension cannot start without the determination — start the Committee process through the Fund" },
        ]);
      return V("LIKELY", { ne: "अशक्तता सुविधाको योग्यता देखिन्छ", en: "You appear eligible for the disability benefit" }, [...reasons, { ne: "प्रत्येक ५ वर्षमा पुनरावलोकन — अन्तिम ५८ वर्षमा", en: "Reviewed every 5 years — the last at 58" }]);
    }
    case "dependent-family": {
      const pays: Bi[] = [
        { ne: "पति/पत्नीलाई तलबको ६०% आजीवन; २ सन्ततिसम्म ४०%; अन्तिम संस्कार रु. २५,०००", en: "Spouse 60% of salary for life; up to 2 children 40%; funeral Rs. 25,000" },
      ];
      if (a.deathCause === "work") return V("LIKELY", { ne: "रोजगारीजन्य मृत्यु — पहिलो दिनदेखि सुविधा लागू", en: "Work-related death — the benefit applies from day one" }, pays);
      if (a.months12 === "yes") return V("LIKELY", { ne: "१२ महिना योगदान पुगेको — सुविधाको योग्यता देखिन्छ", en: "12 months of contributions reached — you appear eligible" }, [{ ne: "अन्य कारणको मृत्युमा १२ महिना नियमित योगदान चाहिन्छ (५औँ संशोधन)", en: "Deaths from other causes require 12 months of regular contributions (5th Amendment)" }, ...pays]);
      return V("CONDITIONS", { ne: "उपलब्ध जानकारीका आधारमा योग्यता पुष्टि गर्न सकिएन", en: "Eligibility could not be confirmed from the available information" }, [
        { ne: "गैर-रोजगारीजन्य मृत्युमा १२ महिना नियमित योगदान आवश्यक — contribution history हेरेर मात्र यकिन हुन्छ", en: "Non-work deaths require 12 months of regular contributions — only the contribution history can confirm" },
        { ne: "६० वर्षअघि मृत्यु भए हकवालाले निवृत्तभरण खाताको रकम प्रतिफलसहित एकमुष्ट पाउँछ", en: "If the death was before 60, heirs receive the pension-account money with returns as a lump sum" },
      ]);
    }
    case "retirement-lumpsum": {
      const exitNote: Bi[] = a.exit === "no" ? [{ ne: "रोजगारदाताले १ महिनाभित्र exit जनाउनुपर्छ — नजनाएको भए रोजगारदातासँग बुझ्नुहोस्", en: "The employer must record the exit within 1 month — if not done, follow up with the employer" }] : [];
      if (a.situation === "age60")
        return V("CONDITIONS", { ne: "६० वर्षमा दुई भाग: अवकाश सुविधा एकमुष्ट + निवृत्तभरण (वा १८० नपुगे विकल्प)", en: "At 60 two parts: retirement benefit as a lump sum + pension (or a choice if under 180 months)" }, [
          { ne: "अवकाश सुविधा योजनाको रकम एकमुष्ट; निवृत्तभरण योजना ÷१६० — १८० महिना नपुगे एकमुष्ट वा पेन्सन रोज्न पाइन्छ", en: "Retirement-benefit money as a lump sum; pension scheme ÷160 — under 180 months you may choose a lump sum or pension" },
          ...exitNote,
        ]);
      if (a.situation === "foreign")
        return V("LIKELY", { ne: "विदेशी नागरिक — रोजगारी सकिएपछि पूरै रकम फिर्ता", en: "Foreign national — full withdrawal at the end of employment" }, [{ ne: "वृद्ध अवस्थाको रकम एकमुष्ट फिर्ता लैजान पाइन्छ (दफा २४क)", en: "The old-age money can be withdrawn as a lump sum (§24a)" }, ...exitNote]);
      if (a.situation === "heir")
        return V("LIKELY", { ne: "हकवाला — सम्पूर्ण रकम प्रतिफलसहित एकमुष्ट", en: "Heir — the full amount with returns as a lump sum" }, [{ ne: "६० वर्षअघि मृत्यु भए हकवालाले सम्पूर्ण रकम प्रतिफलसहित पाउँछ; आश्रित परिवार सुविधा पनि हेर्नुहोस्", en: "If the contributor died before 60, heirs receive everything with returns; also see the dependent family benefit" }]);
      return V("LIKELY", { ne: "अवकाश सुविधा योजनाको रकम एकमुष्ट लिन मिल्छ", en: "You can take the retirement-benefit money as a lump sum" }, [
        { ne: "८.३३% + स्वेच्छिक थप + हस्तान्तरित रकम प्रतिफलसहित; २०% निवृत्तभरण भाग ६० वर्षसम्म कोषमै", en: "8.33% + voluntary + transferred money with returns; the 20% pension part stays until 60" },
        ...exitNote,
      ]);
    }
    case "pension": {
      if (a.age60 === "gte60" && a.months180 === "yes")
        return V("LIKELY", { ne: "आजीवन मासिक pension को योग्यता देखिन्छ", en: "You appear eligible for a lifelong monthly pension" }, [
          { ne: "६० वर्ष पूरा + १८० महिना योगदान (कार्यविधि २०७५, दफा २१)", en: "Age 60 completed + 180 months of contributions (Procedure 2075, section 21)" },
          { ne: "रकम = (जम्मा + प्रतिफल) ÷ १६०", en: "Amount = (deposits + returns) ÷ 160" },
        ]);
      if (a.age60 === "gte60")
        return V("CONDITIONS", { ne: "६० वर्ष पुग्नुभयो तर १८० महिना पुगेको छैन — दुई विकल्प", en: "You're 60 but haven't reached 180 months — two options" }, [
          { ne: "एकमुष्ट रकम (प्रतिफलसहित) लिने, वा", en: "Take the lump sum (with returns), or" },
          { ne: "सोही रकम ÷ १६० को आजीवन मासिक pension रोज्ने", en: "Choose a lifelong monthly pension of that amount ÷ 160" },
        ]);
      return V("NOT_YET", { ne: "६० वर्षपछि pension — अहिलेदेखि योजना बनाउनुहोस्", en: "Pension after 60 — start planning now" }, [
        { ne: "योग्यता: ६० वर्ष + १८० महिना योगदान", en: "Eligibility: age 60 + 180 months of contributions" },
        { ne: "६० अघि जागिर छाडे अवकाश सुविधा भाग मात्र एकमुष्ट; २०% पेन्सन भाग ६० सम्म कोषमै रहन्छ", en: "If you leave work before 60 only the retirement-benefit part is paid; the 20% pension part stays until 60" },
      ]);
    }
  }
}

/* ────────────────────── rejection diagnostics (article) ────────────────────── */

export interface RejectionReason {
  reason: Bi;
  fix: Bi;
}

/** The 10 rejection reasons from the claim-reject-samadhan guide (single source). */
export function rejectionReasons(): RejectionReason[] {
  const article = articleBySlug("claim-reject-samadhan");
  const neTable = article?.sections[0]?.blocks.find((b) => b.type === "table");
  const enTable = article?.en?.sections[0]?.blocks.find((b) => b.type === "table");
  if (!neTable || neTable.type !== "table") return [];
  return neTable.rows.map((row, i) => {
    const en = enTable && enTable.type === "table" ? enTable.rows[i] : undefined;
    return {
      reason: { ne: row[0], en: en?.[0] ?? row[0] },
      fix: { ne: row[1], en: en?.[1] ?? row[1] },
    };
  });
}

export const APPEAL_NOTE: Bi = {
  ne: "कोषको निर्णयमा चित्त नबुझे निर्णय भएको ३५ दिनभित्र श्रम अदालतमा पुनरावेदन गर्न सकिन्छ (ऐन दफा ५२)। पुनः पेश गर्न भने कुनै रोक छैन — पहिले कागजात मिलाएर पुनः पेश गर्नुहोस्।",
  en: "If you disagree with the Fund's decision, you can appeal to the Labour Court within 35 days of the decision (Act §52). There is no restriction on resubmitting — fix the documents and resubmit first.",
};
