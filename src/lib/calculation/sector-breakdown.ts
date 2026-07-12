/**
 * Per-sector contribution breakdown — regroups the SSF allocation into the
 * three buckets people actually care about:
 *   💰 Pension fund (निवृत्तभरण)     → lifelong monthly pension (÷160)
 *   🏦 Gratuity / Retirement fund     → lump sum at exit / age 60
 *   🛡️ Insurance (बीमा)              → medical + accident + dependent family
 *
 * Percentages come from src/lib/calculation/rules.ts (verified-facts §1).
 * Informal & foreign-employment procedures define old-age as a single figure
 * (not split into pension/gratuity), so those sectors show one old-age bucket.
 * All amounts are preliminary educational estimates.
 */

export type SectorKey = "formal" | "informal" | "self-employed" | "foreign";

export interface WhoPays {
  key: string;
  labelNe: string;
  labelEn: string;
  pct: number;
  amount: number;
}

export interface SectorBucket {
  key: "pension" | "gratuity" | "oldage" | "insurance";
  labelNe: string;
  labelEn: string;
  descNe: string;
  descEn: string;
  pct: number;
  amount: number;
  group: "savings" | "insurance";
}

export interface SectorBreakdown {
  sector: SectorKey;
  base: number;
  totalPct: number;
  total: number;
  whoPays: WhoPays[];
  buckets: SectorBucket[];
  insuranceDetail: { labelNe: string; labelEn: string; pct: number; amount: number }[];
  noteNe: string;
  noteEn: string;
}

const rs = (base: number, pct: number) => Math.round((base * pct) / 100);

const INSURANCE_BUCKET = (base: number, pct: number): SectorBucket => ({
  key: "insurance",
  labelNe: "बीमा सुरक्षा",
  labelEn: "Insurance protection",
  descNe: "औषधि उपचार + दुर्घटना + आश्रित परिवार",
  descEn: "Medical + accident + dependent family",
  pct,
  amount: rs(base, pct),
  group: "insurance",
});

export function computeSectorBreakdown(
  sector: SectorKey,
  base: number,
): SectorBreakdown {
  const safeBase = Number.isFinite(base) && base > 0 ? base : 0;

  if (sector === "formal") {
    const insurancePct = 1.2 + 0.8 + 0.67; // 2.67
    return {
      sector,
      base: safeBase,
      totalPct: 31,
      total: rs(safeBase, 31),
      whoPays: [
        {
          key: "employee",
          labelNe: "श्रमिकको तलबबाट (कट्टी)",
          labelEn: "From the worker's salary (deducted)",
          pct: 11,
          amount: rs(safeBase, 11),
        },
        {
          key: "employer",
          labelNe: "रोजगारदाताले थप्ने",
          labelEn: "Added by the employer",
          pct: 20,
          amount: rs(safeBase, 20),
        },
      ],
      buckets: [
        {
          key: "pension",
          labelNe: "निवृत्तभरण कोष",
          labelEn: "Pension fund",
          descNe: "६० वर्षपछि आजीवन मासिक पेन्सन (÷१६०)",
          descEn: "Lifelong monthly pension after 60 (÷160)",
          pct: 20,
          amount: rs(safeBase, 20),
          group: "savings",
        },
        {
          key: "gratuity",
          labelNe: "अवकाश/उपदान कोष",
          labelEn: "Gratuity / retirement fund",
          descNe: "रोजगारी अन्त्य वा अवकाशमा एकमुष्ट",
          descEn: "Lump sum when the job ends or at retirement",
          pct: 8.33,
          amount: rs(safeBase, 8.33),
          group: "savings",
        },
        INSURANCE_BUCKET(safeBase, insurancePct),
      ],
      insuranceDetail: [
        { labelNe: "औषधि उपचार तथा मातृत्व", labelEn: "Medical & maternity", pct: 1.2, amount: rs(safeBase, 1.2) },
        { labelNe: "दुर्घटना तथा अशक्तता", labelEn: "Accident & disability", pct: 0.8, amount: rs(safeBase, 0.8) },
        { labelNe: "आश्रित परिवार", labelEn: "Dependent family", pct: 0.67, amount: rs(safeBase, 0.67) },
      ],
      noteNe: "आधारभूत पारिश्रमिकको ३१% — श्रमिकको ११% मध्ये १०% त पहिल्यै सञ्चय कोष जाने रकम, नयाँ भार १% मात्र।",
      noteEn: "31% of basic salary — of the worker's 11%, 10% already went to the Provident Fund, so the new burden is only 1%.",
    };
  }

  if (sector === "self-employed") {
    const insurancePct = 2.4 + 0.8 + 1.8; // 5.0
    return {
      sector,
      base: safeBase,
      totalPct: 31,
      total: rs(safeBase, 31),
      whoPays: [
        {
          key: "self",
          labelNe: "आफैँले तिर्ने (रोजेको आधारको)",
          labelEn: "Paid by yourself (of the chosen base)",
          pct: 31,
          amount: rs(safeBase, 31),
        },
      ],
      buckets: [
        {
          key: "pension",
          labelNe: "निवृत्तभरण कोष (न्यूनतम)",
          labelEn: "Pension fund (minimum)",
          descNe: "६० वर्षपछि आजीवन मासिक पेन्सन (÷१६०)",
          descEn: "Lifelong monthly pension after 60 (÷160)",
          pct: 16,
          amount: rs(safeBase, 16),
          group: "savings",
        },
        {
          key: "gratuity",
          labelNe: "अवकाश सुविधा कोष",
          labelEn: "Retirement benefit fund",
          descNe: "रोजगारी/योगदान अन्त्यमा एकमुष्ट",
          descEn: "Lump sum when contribution ends",
          pct: 10,
          amount: rs(safeBase, 10),
          group: "savings",
        },
        INSURANCE_BUCKET(safeBase, insurancePct),
      ],
      insuranceDetail: [
        { labelNe: "औषधि उपचार तथा मातृत्व", labelEn: "Medical & maternity", pct: 2.4, amount: rs(safeBase, 2.4) },
        { labelNe: "दुर्घटना तथा अशक्तता", labelEn: "Accident & disability", pct: 0.8, amount: rs(safeBase, 0.8) },
        { labelNe: "आश्रित परिवार", labelEn: "Dependent family", pct: 1.8, amount: rs(safeBase, 1.8) },
      ],
      noteNe: "आधार न्यूनतम पारिश्रमिकदेखि त्यसको ३ गुणासम्म आफैँ रोज्न सकिन्छ — बीमामा औपचारिकभन्दा बढी रकम छुट्याइएको छ।",
      noteEn: "You can choose a base from the minimum wage up to 3× — more is allocated to insurance than in the formal sector.",
    };
  }

  if (sector === "informal") {
    return {
      sector,
      base: safeBase,
      totalPct: 20.37,
      total: rs(safeBase, 20.37),
      whoPays: [
        {
          key: "worker",
          labelNe: "श्रमिक स्वयंले",
          labelEn: "Worker's own share",
          pct: 11,
          amount: rs(safeBase, 11),
        },
        {
          key: "government",
          labelNe: "नेपाल सरकारले थप्ने",
          labelEn: "Added by the Government of Nepal",
          pct: 9.37,
          amount: rs(safeBase, 9.37),
        },
      ],
      buckets: [
        {
          key: "oldage",
          labelNe: "वृद्ध अवस्था सुरक्षा",
          labelEn: "Old-age protection",
          descNe: "पेन्सन/अवकाश सुविधामा जम्मा",
          descEn: "Goes into pension / retirement savings",
          pct: 10,
          amount: rs(safeBase, 10),
          group: "savings",
        },
        INSURANCE_BUCKET(safeBase, 10.37),
      ],
      insuranceDetail: [],
      noteNe: "श्रमिकले न्यूनतम पारिश्रमिकको ११% मात्र तिरे पुग्छ; सरकारले ९.३७% थपिदिन्छ — नेपालको सबैभन्दा सस्तो सामाजिक सुरक्षा।",
      noteEn: "The worker pays only 11% of the minimum wage; the government adds 9.37% — Nepal's most affordable social security.",
    };
  }

  // foreign
  return {
    sector,
    base: safeBase,
    totalPct: 21.33,
    total: rs(safeBase, 21.33),
    whoPays: [
      {
        key: "self",
        labelNe: "आफैँले तिर्ने",
        labelEn: "Paid by yourself",
        pct: 21.33,
        amount: rs(safeBase, 21.33),
      },
    ],
    buckets: [
      {
        key: "oldage",
        labelNe: "वृद्ध अवस्था सुरक्षा",
        labelEn: "Old-age protection",
        descNe: "फर्किएपछि एकमुष्ट वा ÷१६० को पेन्सन",
        descEn: "Lump sum after returning, or ÷160 pension",
        pct: 13.85,
        amount: rs(safeBase, 13.85),
        group: "savings",
      },
      INSURANCE_BUCKET(safeBase, 7.48),
    ],
    insuranceDetail: [],
    noteNe: "औद्योगिक न्यूनतम पारिश्रमिकको कम्तीमा २१.३३% (३ गुणासम्म रोज्न मिल्ने)। हाल न्यूनतम मासिक करिब रु. २,५९६।",
    noteEn: "At least 21.33% of the industrial minimum wage (choosable up to 3×). Current minimum monthly is about Rs. 2,596.",
  };
}
