/**
 * SSF contributor loans (योगदानकर्ता सापटी) — single source of truth for the
 * /loans hub, the eligibility calculator and the EMI presets.
 *
 * Sources (read 2026-11-07):
 * - घर सापटी सूचना, मिति २०८३/०१/१८ (ssf.gov.np/list/information-about-loan/information-on-home-loan)
 *   → योगदानकर्ता सापटी (दोस्रो संशोधन) निर्देशिका, २०८२
 * - शैक्षिक सापटी / विशेष सापटी जानकारी (2025 PDFs) → सापटी निर्देशिका २०७९ (१म संशोधन)
 * Interest rates for the education and special loans are NOT published in the
 * notices; they are set by the Board and change — the hub says so explicitly.
 */

export const LOANS_SYNCED_AT = "2026-11-07";
export const LOAN_DESK_PHONE = "01-5360837";
export const LOAN_DESK_EMAIL = "loan@ssf.gov.np";
export const LOAN_INFO_URL = "https://ssf.gov.np/list/information-about-loan";
export const LOAN_FORM_URL = "https://ssf.gov.np/images/news/16612255117987_sapati%20magh%20faram.pdf";

export const LOAN_NOTICE_PDFS = {
  home: "https://ssf.gov.np/images/news/17779550635620_Home%20Loan%20Details.pdf",
  education: "https://ssf.gov.np/images/news/17457318268940_educattion%20loan.pdf",
  special: "https://ssf.gov.np/images/news/17457317597958_special%20loan.pdf",
} as const;

export type LoanKey = "home" | "education" | "special";

export interface LoanProduct {
  key: LoanKey;
  nameNe: string;
  nameEn: string;
  taglineNe: string;
  taglineEn: string;
  /** NPR ceiling (undefined = balance-based) */
  ceiling?: number;
  ceilingLabelNe: string;
  ceilingLabelEn: string;
  /** months of regular contribution required */
  minMonths: number;
  /** years of service that must remain before retirement (age 60) */
  minYearsToRetire: number;
  maxTermYears?: number;
  collateral: boolean;
  /** published annual interest rates (% p.a.) with their purpose */
  rates: { labelNe: string; labelEn: string; pct: number }[];
  ratesNoteNe?: string;
  ratesNoteEn?: string;
  purposesNe: string[];
  purposesEn: string[];
  limitsNe: string[];
  limitsEn: string[];
  feesNe: string[];
  feesEn: string[];
  stepsNe: string[];
  stepsEn: string[];
  documentsNe: string[];
  documentsEn: string[];
  notesNe: string[];
  notesEn: string[];
  noticeUrl: string;
  noticeDateNe: string;
}

export const loanProducts: LoanProduct[] = [
  {
    key: "home",
    nameNe: "घर सापटी",
    nameEn: "Home loan",
    taglineNe: "जग्गा, घर निर्माण/खरिद, तला थप, अपार्टमेन्ट — रु. १.५ करोडसम्म, २० वर्षसम्म",
    taglineEn: "Land, build/buy a house, add a floor, apartment — up to Rs 1.5 crore, up to 20 years",
    ceiling: 15_000_000,
    ceilingLabelNe: "रु. १.५ करोड",
    ceilingLabelEn: "Rs 1.5 crore",
    minMonths: 18,
    minYearsToRetire: 2,
    maxTermYears: 20,
    collateral: true,
    rates: [
      { labelNe: "जग्गा खरिद", labelEn: "Land purchase", pct: 6 },
      { labelNe: "घर खरिद / निर्माण", labelEn: "House purchase / construction", pct: 5.85 },
    ],
    purposesNe: ["जग्गा खरिद", "घर निर्माण", "नयाँ घर खरिद", "घरमा तला थप्ने वा मर्मत", "संयुक्त आवास (Apartment/Unit) खरिद"],
    purposesEn: ["Buying land", "Building a house", "Buying a new house", "Adding a floor or repairs", "Buying an apartment / unit"],
    limitsNe: [
      "अधिकतम रु. १,५०,००,००० (एक करोड पचास लाख)",
      "१५ वर्षको तलब बराबर रकम",
      "६० वर्ष उमेर पुग्न बाँकी कार्य अवधिको तलब",
      "मासिक किस्ता तपाईंको तलब + दम्पतीको तलब + अन्य करकट्टी भएको आम्दानीको ६०% भन्दा बढी नहुने",
      "धितो मूल्याङ्कन र ऋण तिर्न सक्ने क्षमता (repayment capacity) का आधारमा अन्तिम सीमा",
    ],
    limitsEn: [
      "Maximum Rs 1,50,00,000 (1.5 crore)",
      "15 years' salary",
      "Salary for the service period remaining until age 60",
      "Monthly instalment capped at 60% of your salary + spouse's salary + other taxed income",
      "Final limit depends on collateral valuation and repayment capacity",
    ],
    feesNe: [
      "व्यवस्थापन शुल्क: कुल कर्जा सीमाको ०.१५%",
      "मूल्याङ्कन शुल्क: रु. ५,००० (VAT बाहेक)",
      "थप सापटी प्रवाह: प्रत्येक पटक रु. १,५०० (VAT बाहेक)",
      "काठमाडौँ उपत्यका / कोषको कार्यालय भएको जिल्लाबाहिर मूल्याङ्कन: थप रु. १,००० (VAT बाहेक)",
    ],
    feesEn: [
      "Management fee: 0.15% of the sanctioned limit",
      "Valuation fee: Rs 5,000 (+VAT)",
      "Each additional disbursement: Rs 1,500 (+VAT)",
      "Valuation outside Kathmandu valley / districts with an SSF office: +Rs 1,000 (+VAT)",
    ],
    stepsNe: [
      "SOSYS मा login गरी KYC अद्यावधिक छ र १८ महिना नियमित योगदान पुगेको छ भनी जाँच्नुहोस्",
      "सापटी माग फारम (अनुसूची १) भरेर रोजगारदाताबाट सिफारिस गराउनुहोस्",
      "धितो राख्ने घरजग्गाका कागजात (लालपुर्जा, नापी नक्सा, चारकिल्ला, सम्पत्ति कर रसिद) तयार गर्नुहोस्",
      "नजिकको SSF कार्यालयमा निवेदन र कागजात बुझाउनुहोस् — कोषले मूल्याङ्कन गर्छ",
      "स्वीकृतिपछि ६ महिनाभित्र पहिलो किस्ता र २ वर्षभित्र पूरै रकम उपयोग गर्नुहोस् (नत्र स्वतः रद्द)",
    ],
    stepsEn: [
      "Log in to SOSYS and check that KYC is updated and you have 18 months of regular contributions",
      "Fill the loan demand form (Annex 1) and get it recommended by your employer",
      "Prepare the collateral papers (lalpurja, survey map, char-killa letter, property-tax receipt)",
      "Submit the application and documents at the nearest SSF office — the Fund values the collateral",
      "After approval, draw the first instalment within 6 months and the full amount within 2 years (else it lapses)",
    ],
    documentsNe: [
      "नागरिकता र कोषको परिचयपत्रको प्रतिलिपि",
      "रोजगारदाताबाट सिफारिस भएको सापटी माग फारम (अनुसूची १)",
      "एकाघर परिवारका सदस्यको नागरिकता प्रतिलिपि; विवाह दर्ता (लागू भए)",
      "वडाबाट चारकिल्ला प्रमाणित पत्र र पारिवारिक विवरण प्रमाणपत्र",
      "तलब विवरण र अवकाश मिति खुलेको पत्र",
      "लालपुर्जा र स्वामित्वका कागजात; नापी नक्सा र ट्रेस पेपर",
      "पछिल्लो १ वर्षको बैंक स्टेटमेन्ट",
      "चालु आ.व.को सम्पत्ति कर तिरेको रसिद",
      "घर निर्माण स्वीकृति पत्र, घरको नक्सा, निर्माण सम्पन्न प्रमाणपत्र (लागू भए)",
      "खरिदको हकमा बैना सम्झौता पत्र",
    ],
    documentsEn: [
      "Copies of citizenship and SSF ID",
      "Loan demand form (Annex 1) recommended by the employer",
      "Citizenship copies of joint-family members; marriage certificate (if applicable)",
      "Char-killa (boundary) letter and family-details certificate from the ward",
      "Salary statement and letter showing retirement date",
      "Lalpurja / ownership documents; survey map and trace paper",
      "Last 12 months' bank statement",
      "Current fiscal year property-tax receipt",
      "Building permit, house map, completion certificate (if applicable)",
      "Sale (baina) agreement for purchases",
    ],
    notesNe: [
      "धितो: आफ्नो वा एकाघर परिवारको नाममा रहेको घरजग्गा",
      "न्यूनतम जग्गा: नगरपालिकाभित्र २.५ आना / ५ धुर; गाउँपालिकाभित्र ४ आना / ७.५ धुर",
      "कालो सूची (blacklist) मा परेको हुनु हुँदैन",
      "पति-पत्नी दुवै योगदानकर्ता भए एउटै धितोबाट दुवैले आ-आफ्नो सीमामा लिन सकिने",
    ],
    notesEn: [
      "Collateral: house/land in your own or a joint-family member's name",
      "Minimum land: 2.5 aana / 5 dhur in municipalities; 4 aana / 7.5 dhur in rural municipalities",
      "Must not be blacklisted",
      "If both spouses are contributors, both can borrow against the same collateral within their own limits",
    ],
    noticeUrl: LOAN_NOTICE_PDFS.home,
    noticeDateNe: "२०८३/०१/१८",
  },
  {
    key: "education",
    nameNe: "शैक्षिक सापटी",
    nameEn: "Education loan",
    taglineNe: "आफू, पति/पत्नी वा छोराछोरीको उच्च शिक्षा (स्वदेश/विदेश) — रु. ३५ लाखसम्म, १५ वर्षसम्म",
    taglineEn: "Higher education for you, spouse or children (Nepal/abroad) — up to Rs 35 lakh, up to 15 years",
    ceiling: 3_500_000,
    ceilingLabelNe: "रु. ३५ लाख",
    ceilingLabelEn: "Rs 35 lakh",
    minMonths: 36,
    minYearsToRetire: 2,
    maxTermYears: 15,
    collateral: true,
    rates: [],
    ratesNoteNe: "ब्याजदर सूचनामा उल्लेख छैन — सञ्चालक समितिले तोक्छ; आवेदनअघि ०१-५३६०८३७ मा पुष्टि गर्नुहोस्।",
    ratesNoteEn: "The rate is not published in the notice — the Board sets it; confirm on 01-5360837 before applying.",
    purposesNe: ["योगदानकर्ता स्वयं", "पति/पत्नी", "छोरा/छोरी — स्वदेश वा विदेशको शैक्षिक संस्थामा उच्च शिक्षा"],
    purposesEn: ["The contributor", "Spouse", "Children — higher education at an institution in Nepal or abroad"],
    limitsNe: [
      "अधिकतम रु. ३५ लाख",
      "१५ वर्षको तलब बराबर रकम",
      "६० वर्ष उमेर पुग्न बाँकी कार्य अवधिको तलब",
      "सम्बन्धित शिक्षण संस्थामा लाग्ने वास्तविक खर्च — यीमध्ये जुन कम",
    ],
    limitsEn: ["Maximum Rs 35 lakh", "15 years' salary", "Salary for the service period remaining until age 60", "Actual cost at the institution — whichever is lowest"],
    feesNe: ["व्यवस्थापन शुल्क: कुल कर्जा सीमाको ०.१५%", "मूल्याङ्कन शुल्क: रु. ३,००० (VAT बाहेक)"],
    feesEn: ["Management fee: 0.15% of the sanctioned limit", "Valuation fee: Rs 3,000 (+VAT)"],
    stepsNe: [
      "३६ महिना नियमित योगदान र KYC अद्यावधिक छ भनी जाँच्नुहोस्",
      "कलेज/विश्वविद्यालयबाट offer letter र कुल खर्च विवरण पत्र लिनुहोस् (विदेश: पासपोर्ट, भिसा, शिक्षा मन्त्रालयको NOC)",
      "सापटी माग फारम (अनुसूची १) रोजगारदाताबाट सिफारिस गराउनुहोस्",
      "धितोका कागजात (४ मिटर बाटोले छोएको घरजग्गा) सहित SSF कार्यालयमा बुझाउनुहोस्",
      "स्वीकृतिपछि ६ महिनाभित्र पहिलो किस्ता, २ वर्षभित्र पूरै रकम उपयोग",
    ],
    stepsEn: [
      "Check you have 36 months of regular contributions and updated KYC",
      "Get the offer letter and total-cost letter from the college/university (abroad: passport, visa, Ministry of Education NOC)",
      "Have the loan demand form (Annex 1) recommended by your employer",
      "Submit with collateral papers (land touched by a ≥4 m road) at an SSF office",
      "After approval, draw the first instalment within 6 months and the full amount within 2 years",
    ],
    documentsNe: [
      "नागरिकता र कोषको परिचयपत्र; रोजगारदाताबाट सिफारिस सापटी माग फारम",
      "एकाघर सदस्यको नागरिकता; विवाह दर्ता (विवाहितको हकमा); पारिवारिक विवरणको सक्कल पत्र",
      "मासिक/वार्षिक तलब र अवकाश मिति खुलेको सक्कल पत्र",
      "लालपुर्जा, स्वामित्वको लिखत, नापी नक्सा र ट्रेस पेपर, चारकिल्ला पत्र, सम्पत्ति कर रसिद",
      "पछिल्लो १ वर्षको बैंक स्टेटमेन्ट; घर धितो भए निर्माण सम्पन्न प्रमाणपत्र",
      "क्याम्पस/कलेज/विश्वविद्यालयको offer letter र कोर्सको सम्पूर्ण खर्च विवरण पत्र",
      "SEE र +2 को मार्कसिट तथा चारित्रिक प्रमाणपत्र",
      "विदेश: पासपोर्ट, भिसा र शिक्षा मन्त्रालयको No Objection Letter (NOC)",
    ],
    documentsEn: [
      "Citizenship and SSF ID; employer-recommended loan demand form",
      "Family members' citizenship; marriage certificate (if married); original family-details letter",
      "Original letter showing monthly/annual salary and retirement date",
      "Lalpurja, ownership deed, survey map & trace paper, char-killa letter, property-tax receipt",
      "Last 12 months' bank statement; completion certificate if a house is pledged",
      "Offer letter and full course-cost letter from the campus/college/university",
      "SEE and +2 mark sheets and character certificates",
      "Abroad: passport, visa and the Ministry of Education's No Objection Letter (NOC)",
    ],
    notesNe: ["धितो राख्ने जग्गा कम्तीमा ४ मिटर बाटोले छोएको हुनुपर्ने", "घर सापटीको ब्याज बाँकी भए शैक्षिक सापटी नपाइने (र उल्टो)"],
    notesEn: ["Pledged land must be touched by a road at least 4 m wide", "Unpaid interest on a home loan blocks the education loan (and vice versa)"],
    noticeUrl: LOAN_NOTICE_PDFS.education,
    noticeDateNe: "२०८२ वैशाख",
  },
  {
    key: "special",
    nameNe: "विशेष सापटी",
    nameEn: "Special loan",
    taglineNe: "धितो नचाहिने — अवकाश सुविधा (Retirement Amount) मा जम्मा रकमको ८०% सम्म, SSF App बाटै",
    taglineEn: "No collateral — up to 80% of your Retirement Amount balance, straight from the SSF app",
    ceilingLabelNe: "अवकाश रकमको ८०%",
    ceilingLabelEn: "80% of retirement balance",
    minMonths: 36,
    minYearsToRetire: 2,
    collateral: false,
    rates: [],
    ratesNoteNe: "ब्याजदर कोषले तोक्छ (सूचनामा उल्लेख छैन)। ब्याज हरेक वर्ष असार मसान्तभित्र तिरिसक्नुपर्छ।",
    ratesNoteEn: "The Fund sets the rate (not published in the notice). Interest must be paid by the end of Asar each year.",
    purposesNe: ["जुनसुकै व्यक्तिगत आवश्यकता — प्रयोजन खुलाउनु नपर्ने"],
    purposesEn: ["Any personal need — no purpose declaration required"],
    limitsNe: [
      "अवकाश सुविधा योजना (Retirement Amount) मा जम्मा कुल रकमको ८०% सम्म",
      "२०७८ असार मसान्तसम्म योगदान गर्नेले Pension Amount को ९८% सम्म Retirement Amount मा सारेर सापटी लिन सक्ने",
    ],
    limitsEn: [
      "Up to 80% of the total balance in your Retirement Benefit scheme",
      "Those contributing since before end-Asar 2078 may transfer up to 98% of their Pension Amount to the Retirement Amount to borrow against",
    ],
    feesNe: ["धितो, मूल्याङ्कन वा सिफारिस चाहिँदैन"],
    feesEn: ["No collateral, valuation or recommendation needed"],
    stepsNe: [
      "SSF App (Android/iOS) install गरी SSN र password ले login गर्नुहोस् — KYC updated हुनुपर्छ",
      "Loan Request option रोजी रकम (८०% सम्म) र अवधि छान्नुहोस्",
      "स्वीकृतिपछि रकम सीधै बैंक खातामा — प्रयोगकर्ताको अनुभवमा २४ घण्टाभित्रै",
      "साँवा-ब्याज App को Loan Repay बाट eSewa, ConnectIPS वा Khalti मार्फत तिर्नुहोस्; जुनसुकै बेला पूरै तिर्न मिल्छ",
      "सबै तिरेको भोलिपल्टै फेरि लिन मिल्छ",
    ],
    stepsEn: [
      "Install the SSF App and log in with your SSN and password — KYC must be updated",
      "Choose Loan Request, pick the amount (up to 80%) and the term",
      "After approval the money lands in your bank account — in users' experience within 24 hours",
      "Repay principal and interest via Loan Repay in the app through eSewa, ConnectIPS or Khalti; prepay any time",
      "You can borrow again the day after repaying in full",
    ],
    documentsNe: ["नागरिकता र SSF परिचयपत्र (KYC पहिल्यै अद्यावधिक भएको हुनुपर्छ)"],
    documentsEn: ["Citizenship and SSF ID (KYC must already be updated)"],
    notesNe: ["ब्याज असार मसान्तभित्र नतिरे साँवामा पुँजीकृत हुन्छ", "सापटी बाँकी रहँदा अवकाश सुविधाको रकम त्यही अनुपातमा रोकिन्छ"],
    notesEn: ["Interest unpaid by end-Asar is capitalised into the principal", "While the loan is outstanding, the equivalent retirement balance is held"],
    noticeUrl: LOAN_NOTICE_PDFS.special,
    noticeDateNe: "२०८२ वैशाख",
  },
];

export function loanByKey(key: string): LoanProduct | undefined {
  return loanProducts.find((l) => l.key === key);
}

/** Other contributor benefits that behave like credit / support (reference). */
export const otherLoanFacilities = [
  {
    nameNe: "सामाजिक कार्य सापटी (loan swap)",
    nameEn: "Social-work loan (swap)",
    descNe: "अन्य कोष/संस्थाबाट लिएको घर/शैक्षिक कर्जा SSF मा सार्ने — धितोले खामेसम्म, swap शर्तअनुसार।",
    descEn: "Move an existing home/education loan from another fund to SSF — as far as the collateral covers, per swap terms.",
  },
  {
    nameNe: "सन्तति छात्रवृत्ति",
    nameEn: "Children's scholarship",
    descNe: "२४ महिना योगदान गरेका योगदानकर्ताका छोराछोरीको स्नातक अध्ययनका लागि वास्तविक शुल्क वा रु. ५ लाखसम्म (सापटी होइन — फिर्ता गर्नु पर्दैन)।",
    descEn: "For contributors with 24 months of contributions: actual fees or up to Rs 5 lakh for a child's bachelor's study (a grant, not a loan).",
  },
] as const;
