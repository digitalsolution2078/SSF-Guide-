/**
 * Contribution milestones — the months at which a contributor unlocks a
 * benefit. Shared by the My SSF snapshot (timeline) and the push cron
 * (milestone alerts). Sources: knowledge-base/verified-facts.md §3, loans.ts.
 */

export interface Milestone {
  months: number;
  key: string;
  titleNe: string;
  titleEn: string;
  descNe: string;
  descEn: string;
  href: string;
}

export const MILESTONES: Milestone[] = [
  {
    months: 3,
    key: "medical",
    titleNe: "औषधि-उपचार सुविधा सुरु",
    titleEn: "Medical benefit starts",
    descNe: "३ महिनाको योगदानपछि OPD रु. २०,०००/वर्ष र भर्ना रु. १ लाख/वर्ष (परिवार) — आबद्ध अस्पतालमा २०% मात्र तिरेर।",
    descEn: "After 3 months: OPD up to Rs 20,000/yr and inpatient up to Rs 1 lakh/yr (family) — pay only 20% at affiliated hospitals.",
    href: "/hospitals",
  },
  {
    months: 12,
    key: "dependent",
    titleNe: "आश्रित परिवार सुरक्षा (गैर-रोजगारीजन्य मृत्यु)",
    titleEn: "Dependent-family cover (non-work death)",
    descNe: "१२ महिनापछि रोजगारीबाहेकको कारणले मृत्यु भए पनि पति/पत्नीलाई ६०% पेन्सन र सन्तानलाई ४०% शिक्षा भत्ता।",
    descEn: "After 12 months, even a non-work death pays the spouse 60% pension and children 40% education allowance.",
    href: "/school/medical-maternity-accident-dependent",
  },
  {
    months: 18,
    key: "home-loan",
    titleNe: "घर सापटी योग्य",
    titleEn: "Home loan eligible",
    descNe: "१८ महिनापछि रु. १.५ करोडसम्म घर सापटी — ५.८५% (घर) / ६% (जग्गा), २० वर्षसम्म।",
    descEn: "After 18 months: home loan up to Rs 1.5 crore at 5.85% (house) / 6% (land), up to 20 years.",
    href: "/loans#home",
  },
  {
    months: 24,
    key: "critical",
    titleNe: "गम्भीर रोग सुविधा + सन्तति छात्रवृत्ति",
    titleEn: "Critical-illness cover + children's scholarship",
    descNe: "पछिल्ला २८ मध्ये २४ महिना योगदान भए गम्भीर रोगमा रु. १० लाखसम्म; २४ महिनापछि छोराछोरीको स्नातकका लागि रु. ५ लाखसम्म छात्रवृत्ति।",
    descEn: "With 24 of the last 28 months: critical-illness cover up to Rs 10 lakh; after 24 months, up to Rs 5 lakh scholarship for a child's bachelor's.",
    href: "/school/medical-maternity-accident-dependent",
  },
  {
    months: 36,
    key: "loans",
    titleNe: "शैक्षिक र विशेष सापटी योग्य",
    titleEn: "Education & special loans eligible",
    descNe: "३६ महिनापछि रु. ३५ लाखसम्म शैक्षिक सापटी र धितो नचाहिने विशेष सापटी (अवकाश रकमको ८०%) — App बाटै।",
    descEn: "After 36 months: education loan up to Rs 35 lakh and the collateral-free special loan (80% of retirement balance) from the app.",
    href: "/loans#special",
  },
  {
    months: 60,
    key: "topup",
    titleNe: "ठूलो उपचारमा ५०% थप सहयोग",
    titleEn: "50% top-up on large hospital bills",
    descNe: "६० महिनापछि आबद्ध अस्पतालमा रु. १–१० लाखको भर्ना खर्चको ५०% कोषले थप बेहोर्छ।",
    descEn: "After 60 months the Fund additionally pays 50% of Rs 1–10 lakh inpatient costs at affiliated hospitals.",
    href: "/school/medical-maternity-accident-dependent",
  },
  {
    months: 180,
    key: "pension",
    titleNe: "आजीवन पेन्सन योग्य",
    titleEn: "Lifelong pension eligible",
    descNe: "१८० महिना (१५ वर्ष) + ६० वर्ष उमेर पुगेपछि (जम्मा + प्रतिफल) ÷ १६० = आजीवन मासिक पेन्सन।",
    descEn: "With 180 months (15 years) and age 60: (deposits + returns) ÷ 160 = lifelong monthly pension.",
    href: "/calculators/financial-planner",
  },
];

export function reachedMilestones(months: number): Milestone[] {
  return MILESTONES.filter((m) => months >= m.months);
}

export function nextMilestone(months: number): Milestone | undefined {
  return MILESTONES.find((m) => months < m.months);
}

/** Milestones crossed between two month counts (exclusive of `from`, inclusive of `to`). */
export function crossedMilestones(from: number, to: number): Milestone[] {
  return MILESTONES.filter((m) => from < m.months && to >= m.months);
}

/** Approximate calendar date when `target` months will be reached. */
export function dateForMonths(currentMonths: number, target: number, now = new Date()): Date {
  const d = new Date(now);
  d.setMonth(d.getMonth() + Math.max(0, target - currentMonths));
  return d;
}
