/**
 * Scannable "Highlights" for each guide — shown in larger text near the top of
 * the article for readers who don't want to read the whole thing. Kept in a
 * separate file so the articles themselves stay untouched. Keyed by article slug.
 */
export interface ArticleHighlights {
  ne: string[];
  en: string[];
}

export const articleHighlights: Record<string, ArticleHighlights> = {
  "ssf-bhaneko-ke-ho": {
    ne: [
      "SSF सरकारद्वारा सञ्चालित योगदानमा आधारित सामाजिक सुरक्षा हो — बचत होइन, सुरक्षा।",
      "चार योजना: औषधि/मातृत्व, दुर्घटना/अशक्तता, आश्रित परिवार र वृद्ध अवस्था (पेन्सन)।",
      "औपचारिक क्षेत्रमा आधारभूत तलबको ३१% योगदान (श्रमिक ११% + रोजगारदाता २०%)।",
      "SSN जीवनभर एउटै — जागिर वा देश फेरे पनि उही खातामा जारी रहन्छ।",
    ],
    en: [
      "SSF is a government-run, contribution-based social security — protection, not just savings.",
      "Four schemes: medical/maternity, accident/disability, dependent family, and old age (pension).",
      "In the formal sector, 31% of basic salary (worker 11% + employer 20%).",
      "Your SSN is the same for life — it continues even if you change jobs or countries.",
    ],
  },
  "kasle-yogdan-garnu-parcha": {
    ne: [
      "औपचारिक क्षेत्रका सबै रोजगारदाता र श्रमिकलाई अनिवार्य; नयाँ कर्मचारी ३ महिनाभित्र सूचीकरण।",
      "अनौपचारिक, स्वरोजगार र वैदेशिक रोजगार — स्वेच्छाले सहभागी हुन सकिने।",
      "रोजगारदाताले सूचीकरण नगरे श्रमिक आफैँ आवेदन दिन सक्छन्।",
      "मासिक योगदान २५ दिनभित्र नबुझाए १०% ब्याज।",
    ],
    en: [
      "Mandatory for all formal-sector employers and workers; new staff registered within 3 months.",
      "Informal, self-employed, and foreign employment can join voluntarily.",
      "If the employer doesn't register you, you can apply yourself.",
      "10% interest if the monthly contribution isn't deposited within 25 days.",
    ],
  },
  "yogdan-kasari-calculate-huncha": {
    ne: [
      "३१% = श्रमिक ११% (सञ्चय कोष १०% + सामाजिक सुरक्षा कर १%) + रोजगारदाता २०%।",
      "श्रमिकको वास्तविक नयाँ भार १% मात्र — १०% त पहिल्यै PF मा जान्थ्यो।",
      "भत्ता, बोनस र ओभरटाइममा योगदान लाग्दैन — आधारभूत तलबमा मात्र।",
      "उदाहरण: रु. ३०,००० तलब → रु. ९,३०० मासिक योगदान।",
    ],
    en: [
      "31% = worker 11% (PF 10% + social security tax 1%) + employer 20%.",
      "The worker's real new burden is only 1% — 10% already went to the PF.",
      "No contribution on allowances, bonus, or overtime — only basic salary.",
      "Example: Rs. 30,000 salary → Rs. 9,300 monthly contribution.",
    ],
  },
  "31-pratishat-kaha-jancha": {
    ne: [
      "३१% चार योजनामा बाँडिन्छ; सबैभन्दा ठूलो भाग (२८.३३%) तपाईंकै वृद्धावस्था बचतमा।",
      "वृद्ध अवस्था = पेन्सन २०% + अवकाश सुविधा ८.३३%।",
      "बीमा (उपचार + दुर्घटना + आश्रित) जम्मा २.६७% मात्र — सस्तो सुरक्षा।",
      "अर्थात् अधिकांश रकम खर्च होइन, तपाईंकै भविष्यको बचत हो।",
    ],
    en: [
      "The 31% splits across four schemes; the largest part (28.33%) is your own old-age savings.",
      "Old age = pension 20% + retirement benefit 8.33%.",
      "Insurance (medical + accident + dependent) is only 2.67% total — cheap protection.",
      "So most of it isn't an expense — it's your own future savings.",
    ],
  },
  "pension-ra-retirement-guide": {
    ne: [
      "योग्यता: ६० वर्ष उमेर + कम्तीमा १८० महिना (१५ वर्ष) योगदान।",
      "मासिक पेन्सन = (पेन्सन कोष जम्मा + प्रतिफल) ÷ १६०, आजीवन।",
      "अवकाश सुविधा (८.३३%) रोजगारी अन्त्यमा एकमुष्ट पाइन्छ।",
      "पेन्सनरको मृत्यु भए पति/पत्नीलाई निरन्तरता।",
    ],
    en: [
      "Eligibility: 60 years of age + at least 180 months (15 years) of contribution.",
      "Monthly pension = (pension-fund balance + returns) ÷ 160, for life.",
      "The retirement benefit (8.33%) is paid as a lump sum when the job ends.",
      "If the pensioner dies, the spouse continues to receive it.",
    ],
  },
  "jagir-chadepachi-ke-huncha": {
    ne: [
      "अवकाश सुविधा रकम एकमुष्ट झिक्न मिल्छ; पेन्सन रकम ६० वर्षपछि मासिक आउँछ।",
      "नयाँ SSF रोजगारदातामा गए उही SSN मा निरन्तर — केही गुम्दैन।",
      "योगदान रोकिए उपचार सुविधा ३ महिनासम्म मात्र कायम।",
      "“जागिर छाडे ३१% सबै फिर्ता” — गलत भ्रम।",
    ],
    en: [
      "The retirement benefit can be withdrawn as a lump sum; the pension comes monthly after 60.",
      "Join a new SSF employer and it continues on the same SSN — nothing is lost.",
      "If contributions stop, medical coverage lasts only 3 months.",
      "“Leaving the job returns all 31%” — a wrong myth.",
    ],
  },
  "foreign-employment-guide": {
    ne: [
      "श्रम स्वीकृतिसँगै सूचीकरण; विदेशबाट online योगदान गर्न सकिन्छ।",
      "कम्तीमा २१.३३% (३ गुणासम्म); हाल न्यूनतम करिब रु. २,५९६/महिना।",
      "परिवारले नेपालमै उपचार सुविधा पाउँछ।",
      "फर्किएपछि एकमुष्ट वा ÷१६० को आजीवन पेन्सन रोज्न पाइन्छ।",
    ],
    en: [
      "Registered with the labour permit; you can contribute online from abroad.",
      "At least 21.33% (up to 3×); current minimum about Rs. 2,596/month.",
      "The family gets treatment coverage back in Nepal.",
      "After returning, choose a lump sum or a lifelong ÷160 pension.",
    ],
  },
  "kyc-profile-claim-guide": {
    ne: [
      "KYC नभई सुविधा दाबी र भुक्तानी रोकिन्छ — अनिवार्य।",
      "नाम/जन्ममिति नमिले पहिले Profile Correction गर्नुपर्छ।",
      "सबै दाबी SOSYS मार्फत online; सही अनुसूची फाराम चाहिन्छ।",
      "रोजगारीजन्य दुर्घटना ७ दिनभित्र कोषलाई जानकारी।",
    ],
    en: [
      "Without KYC, claims and payments are blocked — it's mandatory.",
      "If name/date of birth don't match, do a profile correction first.",
      "All claims are filed online via SOSYS; you need the correct schedule form.",
      "Report a workplace accident to the Fund within 7 days.",
    ],
  },
  "informal-sector-guide": {
    ne: [
      "श्रमिकले ११% मात्र तिरे पुग्छ; सरकारले ९.३७% थप्छ (कुल २०.३७%)।",
      "उपचार, दुर्घटना, परिवार सुरक्षा र वृद्धावस्था पेन्सन सबै समेटिन्छ।",
      "नेपालको सबैभन्दा सस्तो संगठित सामाजिक सुरक्षा।",
      "नागरिकता/परिचयपत्र र फोटोले सजिलै सूचीकरण।",
    ],
    en: [
      "The worker pays only 11%; the government adds 9.37% (total 20.37%).",
      "Covers treatment, accidents, family protection, and an old-age pension.",
      "Nepal's most affordable organized social security.",
      "Easy registration with citizenship/ID and a photo.",
    ],
  },
  "self-employed-guide": {
    ne: [
      "आधार न्यूनतम पारिश्रमिकदेखि ३ गुणासम्म आफैँ रोज्ने; ३१% योगदान।",
      "जति ठूलो आधार, त्यति ठूलो पेन्सन कोष।",
      "बीमामा औपचारिकभन्दा बढी रकम (उपचार २.४%, परिवार १.८%)।",
      "SSN जीवनभर एउटै — जागिरबाट स्वरोजगार गए पुरानै प्रयोग गर्ने।",
    ],
    en: [
      "Choose your base from the minimum wage up to 3×; contribute 31%.",
      "The bigger the base, the bigger the pension fund.",
      "More is allocated to insurance than the formal sector (medical 2.4%, family 1.8%).",
      "Your SSN is the same for life — reuse it when moving from a job to self-employment.",
    ],
  },
  "sapati-loan-guide": {
    ne: [
      "३६ महिना (३ वर्ष) योगदानपछि सापटी योग्य।",
      "घर सापटी रु. ७५ लाख (२० वर्ष), शैक्षिक रु. ३५ लाख (१५ वर्ष)।",
      "विशेष सापटी: अवकाश कोषको ८०%, धितो नचाहिने, प्रायः २४ घण्टामा।",
      "ब्याज समितिले तोक्छ; असार मसान्तमा नतिरे साँवामा पुँजीकृत।",
    ],
    en: [
      "Eligible for a loan after 36 months (3 years) of contribution.",
      "Home loan Rs. 7.5M (20 years), education Rs. 3.5M (15 years).",
      "Special loan: 80% of the retirement fund, no collateral, often within 24 hours.",
      "The Board sets the interest; unpaid by end of Asar, it's capitalized into principal.",
    ],
  },
  "employer-monthly-compliance": {
    ne: [
      "हरेक महिना २५ दिनभित्र payroll declaration + ३१% दाखिला।",
      "ढिलो भए १०% ब्याज; नबुझाए खाता रोक्कादेखि राहदानीसम्म कारबाही।",
      "नयाँ कर्मचारी ३ महिनाभित्र, छाडेको १ महिनाभित्र जनाउने।",
      "SSF ले PF, उपदान र उपचार दायित्व प्रतिस्थापन गर्छ।",
    ],
    en: [
      "Every month: payroll declaration + 31% deposit within 25 days.",
      "Late → 10% interest; non-payment → actions from frozen accounts to passports.",
      "Register new staff within 3 months; report exits within 1 month.",
      "SSF replaces PF, gratuity, and treatment obligations.",
    ],
  },
  "claim-reject-samadhan": {
    ne: [
      "अधिकांश reject सच्याउन मिल्ने — अधूरो कागजात/योग्यता/KYC मुख्य कारण।",
      "कारण पहिचान → कागजात मिलाउने → पुनः पेश (पुनः पेशमा रोक छैन)।",
      "चित्त नबुझे कोषको निर्णयको ३५ दिनभित्र श्रम अदालतमा पुनरावेदन।",
      "सक्कल बिल र प्रमाण सधैँ सुरक्षित राख्नुहोस्।",
    ],
    en: [
      "Most rejections are fixable — incomplete documents/eligibility/KYC are the main causes.",
      "Find the reason → fix documents → resubmit (no limit on resubmitting).",
      "If unsatisfied, appeal to the Labour Court within 35 days of the decision.",
      "Always keep original bills and evidence safe.",
    ],
  },
  "swasthya-bima-ki-ssf-medical": {
    ne: [
      "सरकारी बीमा = परिवार-केन्द्रित र सस्तो; SSF = Contributor-केन्द्रित र व्यापक।",
      "SSF ले उपचारसँगै पेन्सन, दुर्घटना, अशक्तता र परिवार सुरक्षा दिन्छ।",
      "SSF Medical: OPD रु. २५ हजार, IPD रु. १ लाख — ८०% कोष, २०% तपाईं।",
      "धेरैका लागि दुवै सँगै राख्नु सबैभन्दा व्यावहारिक (Layered Protection)।",
    ],
    en: [
      "Government insurance = family-centric and cheap; SSF = contributor-centric and broad.",
      "SSF gives pension, accident, disability, and family protection alongside treatment.",
      "SSF Medical: OPD Rs. 25k, IPD Rs. 100k — 80% Fund, 20% you.",
      "For many, keeping both together is the most practical (layered protection).",
    ],
  },
};
