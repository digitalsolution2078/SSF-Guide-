import { articleBySlug } from "./articles";
import { videoById } from "./videos";

/**
 * SSF School courses — ordered learning paths built ONLY from existing
 * articles (src/content/articles.ts) and videos (src/content/videos.ts).
 * `validateCourses()` is run in courses.test.ts so a renamed slug / removed
 * video fails the build instead of rendering a broken lesson.
 *
 * Quiz facts: knowledge-base/verified-facts.md §1–3 and §5.
 */

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type CourseLesson =
  | { slug: string; titleNe: string; titleEn: string; kind: "article"; articleSlug: string; minutes: number }
  | { slug: string; titleNe: string; titleEn: string; kind: "video"; videoId: string; minutes: number };

export interface QuizQuestion {
  q: string;
  qEn: string;
  options: [string, string, string, string];
  optionsEn: [string, string, string, string];
  /** index into options */
  answer: 0 | 1 | 2 | 3;
  explainNe: string;
  explainEn: string;
}

export interface Course {
  slug: string;
  titleNe: string;
  titleEn: string;
  descNe: string;
  descEn: string;
  level: CourseLevel;
  /** estimated total minutes (lessons + quiz) */
  minutes: number;
  icon: "landmark" | "card" | "building" | "plane";
  lessons: CourseLesson[];
  quiz: QuizQuestion[];
}

export const COURSES_STORAGE_KEY = "ssf-courses-v1";
export const QUIZ_PASS_PCT = 70;

const A = (slug: string, articleSlug: string, titleNe: string, titleEn: string, minutes: number): CourseLesson => ({
  slug,
  kind: "article",
  articleSlug,
  titleNe,
  titleEn,
  minutes,
});
const Vd = (slug: string, videoId: string, titleNe: string, titleEn: string, minutes: number): CourseLesson => ({
  slug,
  kind: "video",
  videoId,
  titleNe,
  titleEn,
  minutes,
});

export const courses: Course[] = [
  {
    slug: "ssf-basics",
    titleNe: "SSF Basics — परिचय, योगदान र ३१%",
    titleEn: "SSF Basics — introduction, contributions and the 31%",
    descNe: "SSF के हो, कसले जोडिनुपर्छ, ३१% कसरी बन्छ र कहाँ जान्छ — शून्यबाट सुरु गर्नेका लागि।",
    descEn: "What SSF is, who must join, how the 31% adds up and where it goes — for absolute beginners.",
    level: "beginner",
    minutes: 60,
    icon: "landmark",
    lessons: [
      A("what-is-ssf", "ssf-bhaneko-ke-ho", "SSF भनेको के हो?", "What is SSF?", 6),
      Vd("ssf-overview-video", "fC2asy6ZVtM", "भिडियो: SSF scheme र प्रक्रिया", "Video: the SSF scheme and process", 12),
      A("who-must-contribute", "kasle-yogdan-garnu-parcha", "कसले योगदान गर्नुपर्छ? सूचीकरण कसरी?", "Who must contribute? How does registration work?", 7),
      Vd("how-to-join-video", "-FXLNa0S_UI", "भिडियो: SSF मा कसरी आबद्ध हुने", "Video: how to join SSF", 10),
      A("how-contribution-is-calculated", "yogdan-kasari-calculate-huncha", "योगदान कसरी calculate हुन्छ? (११% + २०%)", "How is the contribution calculated? (11% + 20%)", 5),
      A("where-31-percent-goes", "31-pratishat-kaha-jancha", "३१% रकम कहाँ जान्छ?", "Where does the 31% go?", 5),
      Vd("everything-about-ssf-video", "YlUKDSqCxT0", "भिडियो: SSF का सबै benefits", "Video: everything about SSF benefits", 12),
    ],
    quiz: [
      {
        q: "औपचारिक क्षेत्रमा आधारभूत तलबको कुल कति प्रतिशत SSF मा जम्मा हुन्छ?",
        qEn: "In the formal sector, what total percentage of basic salary goes into SSF?",
        options: ["२०%", "२१.३३%", "३१%", "११%"],
        optionsEn: ["20%", "21.33%", "31%", "11%"],
        answer: 2,
        explainNe: "कर्मचारी ११% + रोजगारदाता २०% = आधारभूत पारिश्रमिकको ३१% (कार्यविधि २०७५, दफा २५)।",
        explainEn: "Employee 11% + employer 20% = 31% of basic salary (Procedure 2075, §25).",
      },
      {
        q: "कर्मचारीको तलबबाट कति कट्टा हुन्छ, र रोजगारदाताले कति थप्छ?",
        qEn: "How much is deducted from the employee, and how much does the employer add?",
        options: ["१०% / २१%", "११% / २०%", "१५% / १६%", "२०% / ११%"],
        optionsEn: ["10% / 21%", "11% / 20%", "15% / 16%", "20% / 11%"],
        answer: 1,
        explainNe: "कर्मचारी ११% (सञ्चय कोष १०% + सामाजिक सुरक्षा कर १%); रोजगारदाता २०% (सञ्चय कोष १०% + उपदान ८.३३% + अन्य १.६७%)।",
        explainEn: "Employee 11% (PF 10% + social security tax 1%); employer 20% (PF 10% + gratuity 8.33% + other 1.67%).",
      },
      {
        q: "कर्मचारीको 'वास्तविक नयाँ भार' कति हो?",
        qEn: "What is the employee's real new burden?",
        options: ["११%", "१०%", "१%", "३१%"],
        optionsEn: ["11%", "10%", "1%", "31%"],
        answer: 2,
        explainNe: "११% मध्ये १०% पहिल्यै सञ्चय कोषमा जान्थ्यो — नयाँ भार १% मात्र। रोजगारदाताको २०% तलबमाथि थपिन्छ, कटिँदैन।",
        explainEn: "Of the 11%, 10% was already going to provident fund — the net new burden is 1%. The employer's 20% is added on top, not deducted.",
      },
      {
        q: "३१% मध्ये वृद्ध अवस्था (pension + retirement) योजनामा कति जान्छ?",
        qEn: "Of the 31%, how much goes to the old-age (pension + retirement) scheme?",
        options: ["२०%", "२८.३३%", "१.२०%", "८.३३%"],
        optionsEn: ["20%", "28.33%", "1.20%", "8.33%"],
        answer: 1,
        explainNe: "औषधि उपचार/मातृत्व १.२०% + दुर्घटना/अशक्तता ०.८०% + आश्रित परिवार ०.६७% + वृद्ध अवस्था २८.३३% (pension २०% + retirement ८.३३%)।",
        explainEn: "Medical/maternity 1.20% + accident/disability 0.80% + dependent family 0.67% + old age 28.33% (pension 20% + retirement 8.33%).",
      },
      {
        q: "रोजगारदाताले मासिक योगदान कति दिनभित्र दाखिला गर्नुपर्छ?",
        qEn: "Within how many days must the employer deposit the monthly contribution?",
        options: ["७ दिन", "१५ दिन", "२५ दिन", "३५ दिन"],
        optionsEn: ["7 days", "15 days", "25 days", "35 days"],
        answer: 2,
        explainNe: "नेपाली महिना सकिएको २५ दिनभित्र (ऐन दफा ४) — ढिलो भए १०% ब्याज।",
        explainEn: "Within 25 days of the end of the Nepali month (Act §4) — 10% interest if late.",
      },
      {
        q: "नयाँ कर्मचारीलाई कति समयभित्र SSF मा सूचीकरण गराउनुपर्छ?",
        qEn: "Within what period must a new employee be listed in SSF?",
        options: ["७ दिन", "१ महिना", "३ महिना", "१ वर्ष"],
        optionsEn: ["7 days", "1 month", "3 months", "1 year"],
        answer: 2,
        explainNe: "रोजगार सम्बन्ध सुरु भएको ३ महिनाभित्र (ऐन दफा २०)।",
        explainEn: "Within 3 months of the employment relationship starting (Act §20).",
      },
      {
        q: "Social Security Number (SSN) कति अङ्कको हुन्छ?",
        qEn: "How many digits does the Social Security Number (SSN) have?",
        options: ["७", "९", "११", "१६"],
        optionsEn: ["7", "9", "11", "16"],
        answer: 2,
        explainNe: "११ अङ्क (४ अङ्कको वि.सं. वर्ष + ७ अङ्कको योगदानकर्ता कोड); रोजगारदाताको सूचीकरण नम्बर १६ अङ्कको हुन्छ।",
        explainEn: "11 digits (4-digit BS year + 7-digit contributor code); the employer's listing number has 16 digits.",
      },
    ],
  },
  {
    slug: "contributor-pro",
    titleNe: "Contributor Pro — pension, उपचार, KYC र दाबी",
    titleEn: "Contributor Pro — pension, medical, KYC and claims",
    descNe: "आफ्नो पैसा, pension सूत्र, उपचार सीमा, KYC र दाबी अस्वीकृत भए के गर्ने — योगदानकर्ताका लागि पूरा कोर्स।",
    descEn: "Your money, the pension formula, treatment limits, KYC and what to do when a claim is rejected — the full course for contributors.",
    level: "intermediate",
    minutes: 80,
    icon: "card",
    lessons: [
      A("pension-and-retirement", "pension-ra-retirement-guide", "Pension र Retirement Benefit — ÷१६० सूत्र", "Pension and retirement benefit — the ÷160 formula", 8),
      A("after-leaving-job", "jagir-chadepachi-ke-huncha", "जागिर छाडेपछि योगदानको के हुन्छ?", "What happens to your contribution after leaving a job?", 6),
      Vd("leaving-job-video", "Q4SrXAtj074", "भिडियो: जागिर छाडेपछि SSF", "Video: SSF after leaving a job", 10),
      A("medical-benefit", "swasthya-bima-ki-ssf-medical", "Medical benefit — OPD, IPD र २०% सह-भुक्तानी", "Medical benefit — OPD, IPD and the 20% co-payment", 12),
      A("kyc-and-claims", "kyc-profile-claim-guide", "KYC, Profile Correction र दाबी प्रक्रिया", "KYC, profile correction and the claim process", 7),
      Vd("kyc-importance-video", "EZS--UrRV04", "भिडियो: KYC नगर्दा के असर पर्छ?", "Video: what happens if you skip KYC?", 8),
      Vd("medical-claim-video", "m2oKN85hFhU", "भिडियो: अस्पतालबाट medical claim", "Video: medical claim from the hospital", 10),
      A("claim-rejected", "claim-reject-samadhan", "दाबी अस्वीकृत भयो? १० कारण र समाधान", "Claim rejected? 10 reasons and fixes", 8),
      A("loans", "sapati-loan-guide", "सापटी — घर, शिक्षा र विशेष", "Loans — home, education and special", 7),
    ],
    quiz: [
      {
        q: "SSF को मासिक pension कसरी निकालिन्छ?",
        qEn: "How is the monthly SSF pension calculated?",
        options: ["जम्मा रकम ÷ १२०", "(जम्मा + प्रतिफल) ÷ १६०", "अन्तिम तलबको ६०%", "जम्मा रकम ÷ १८०"],
        optionsEn: ["Deposits ÷ 120", "(Deposits + returns) ÷ 160", "60% of last salary", "Deposits ÷ 180"],
        answer: 1,
        explainNe: "निवृत्तभरण खातामा जम्मा रकम + लगानी प्रतिफल ÷ १६० = आजीवन मासिक pension (कार्यविधि दफा २०–२२)।",
        explainEn: "Pension deposits + investment returns ÷ 160 = lifelong monthly pension (Procedure §20–22).",
      },
      {
        q: "Pension पाउन के-के पुग्नुपर्छ?",
        qEn: "What is needed to qualify for the pension?",
        options: ["५८ वर्ष + १२० महिना", "६० वर्ष + १८० महिना", "६० वर्ष + ३६ महिना", "६५ वर्ष + २४० महिना"],
        optionsEn: ["Age 58 + 120 months", "Age 60 + 180 months", "Age 60 + 36 months", "Age 65 + 240 months"],
        answer: 1,
        explainNe: "६० वर्ष उमेर पूरा + कम्तीमा १८० महिना (१५ वर्ष) योगदान। १८० नपुगे एकमुष्ट वा ÷१६० pension रोज्न पाइन्छ।",
        explainEn: "Age 60 + at least 180 months (15 years) of contributions. Under 180 months you may choose a lump sum or the ÷160 pension.",
      },
      {
        q: "औषधि उपचार सुविधाका लागि योग्यता अवधि कति हो?",
        qEn: "What is the qualifying period for the medical benefit?",
        options: ["पछिल्ला ६ महिनामा ३ महिना", "पछिल्ला १२ महिनामा १२ महिना", "पछिल्ला २८ महिनामा २४ महिना", "पहिलो योगदानदेखि"],
        optionsEn: ["3 of the last 6 months", "12 of the last 12 months", "24 of the last 28 months", "From the first contribution"],
        answer: 0,
        explainNe: "पछिल्ला ६ महिनामा कम्तीमा ३ महिना नियमित योगदान; २४/२८ महिना घातक रोगका लागि हो; पहिलो योगदानदेखि दुर्घटना सुविधा लागू हुन्छ।",
        explainEn: "At least 3 of the last 6 months; 24 of 28 is for critical illness; accident cover starts from the first contribution.",
      },
      {
        q: "औषधि उपचारको वार्षिक सीमा र सह-भुक्तानी कति?",
        qEn: "What are the annual medical limits and the co-payment?",
        options: ["OPD २० हजार, भर्ना १ लाख, २०% सह-भुक्तानी", "OPD १ लाख, भर्ना २० हजार, १०%", "OPD ५० हजार, भर्ना ५ लाख, ०%", "OPD १० हजार, भर्ना ७ लाख, २०%"],
        optionsEn: ["OPD Rs 20k, inpatient Rs 1 lakh, 20% co-pay", "OPD Rs 1 lakh, inpatient Rs 20k, 10%", "OPD Rs 50k, inpatient Rs 5 lakh, 0%", "OPD Rs 10k, inpatient Rs 7 lakh, 20%"],
        answer: 0,
        explainNe: "OPD वार्षिक रु. २०,००० (अनौपचारिक/वैदेशिक २५,०००), भर्ना रु. १,००,००० (परिवारसमेत), हरेक दाबीको २०% आफैँले।",
        explainEn: "OPD Rs 20,000/year (informal/foreign 25,000), inpatient Rs 100,000 (family total), 20% of every claim is yours.",
      },
      {
        q: "रोजगारीजन्य दुर्घटना कति दिनभित्र कोषलाई जानकारी गराउनुपर्छ?",
        qEn: "Within how many days must a workplace accident be reported to the Fund?",
        options: ["३ दिन", "७ दिन", "१५ दिन", "३५ दिन"],
        optionsEn: ["3 days", "7 days", "15 days", "35 days"],
        answer: 1,
        explainNe: "७ दिनभित्र — नगराए सम्झौता नभएको अस्पतालमा रु. ७ लाखभन्दा बढी कोषले व्यहोर्दैन।",
        explainEn: "Within 7 days — otherwise the Fund pays at most Rs 700,000 at a non-contracted hospital.",
      },
      {
        q: "कोषको निर्णयमा चित्त नबुझे कति दिनभित्र कहाँ पुनरावेदन गर्ने?",
        qEn: "If you disagree with the Fund's decision, where and within how long can you appeal?",
        options: ["७ दिनभित्र सर्वोच्च अदालत", "३५ दिनभित्र श्रम अदालत", "९० दिनभित्र जिल्ला अदालत", "पुनरावेदन मिल्दैन"],
        optionsEn: ["Supreme Court within 7 days", "Labour Court within 35 days", "District Court within 90 days", "No appeal possible"],
        answer: 1,
        explainNe: "ऐन दफा ५२: निर्णय भएको ३५ दिनभित्र श्रम अदालतमा। पुनः पेश गर्न भने रोक छैन।",
        explainEn: "Act §52: Labour Court within 35 days of the decision. Resubmitting is always allowed.",
      },
      {
        q: "घर सापटी र शैक्षिक/विशेष सापटीका लागि कति महिना योगदान चाहिन्छ?",
        qEn: "How many months of contribution are needed for the home loan vs the education/special loans?",
        options: ["१८ / ३६ महिना", "३६ / १८ महिना", "१२ / २४ महिना", "६० / ६० महिना"],
        optionsEn: ["18 / 36 months", "36 / 18 months", "12 / 24 months", "60 / 60 months"],
        answer: 0,
        explainNe: "घर सापटी १८ महिना (निर्देशिका २रो संशोधन २०८२), रु. १.५ करोडसम्म; शैक्षिक र विशेष सापटी ३६ महिना।",
        explainEn: "Home loan 18 months (Directive 2nd amendment 2082), up to Rs 1.5 crore; education and special loans 36 months.",
      },
      {
        q: "जागिर छाडेपछि एकमुष्ट झिक्न मिल्ने रकम कुन हो?",
        qEn: "Which money can be withdrawn as a lump sum after leaving a job?",
        options: ["३१% सबै", "अवकाश सुविधा योजनाको रकम (८.३३% + थप)", "निवृत्तभरण योजनाको २०%", "केही पनि मिल्दैन"],
        optionsEn: ["All 31%", "Retirement-benefit scheme money (8.33% + extras)", "The 20% pension scheme money", "Nothing"],
        answer: 1,
        explainNe: "अवकाश सुविधा योजना (८.३३% + स्वेच्छिक + हस्तान्तरित) एकमुष्ट; २०% pension भाग ६० वर्षसम्म कोषमै रहन्छ।",
        explainEn: "The retirement-benefit scheme (8.33% + voluntary + transfers) is paid out; the 20% pension part stays in the Fund until 60.",
      },
    ],
  },
  {
    slug: "employer-essentials",
    titleNe: "Employer Essentials — सूचीकरण र मासिक compliance",
    titleEn: "Employer Essentials — registration and monthly compliance",
    descNe: "कम्पनी/फर्मको सूचीकरण, कर्मचारी थप्ने, ३१% गणना, २५-दिने म्याद र ढिलाइको मूल्य — HR र व्यवसायीका लागि।",
    descEn: "Registering the company, adding employees, calculating the 31%, the 25-day deadline and the cost of delay — for HR and business owners.",
    level: "intermediate",
    minutes: 65,
    icon: "building",
    lessons: [
      A("who-must-register", "kasle-yogdan-garnu-parcha", "कसले सूचीकरण गर्नुपर्छ?", "Who must register?", 7),
      Vd("employer-registration-video", "k11wqBUUUyE", "भिडियो: कम्पनी/फर्म SSF मा online दर्ता", "Video: registering a company/firm online", 12),
      A("monthly-compliance", "employer-monthly-compliance", "मासिक compliance routine (HR का लागि)", "The monthly compliance routine (for HR)", 7),
      A("calculate-contribution", "yogdan-kasari-calculate-huncha", "३१% कसरी calculate गर्ने", "How to calculate the 31%", 5),
      Vd("deposit-screen-guide-video", "iZ4EnkNIzaI", "भिडियो: SSF मा रकम deposit गर्ने screen guide", "Video: screen guide to depositing in SSF", 10),
      Vd("registration-to-claim-video", "OBJE-_uTRBg", "भिडियो: registration → collection → deposit → claim", "Video: registration → collection → deposit → claim", 12),
      Vd("formal-sector-video", "YMKqKA2oVW0", "भिडियो: औपचारिक क्षेत्रमा SSF", "Video: SSF in the formal sector", 8),
    ],
    quiz: [
      {
        q: "मासिक योगदान दाखिलाको म्याद कति हो?",
        qEn: "What is the deadline for the monthly deposit?",
        options: ["महिना सकिएको ७ दिनभित्र", "महिना सकिएको २५ दिनभित्र", "अर्को महिनाको अन्त्यसम्म", "त्रैमासिक"],
        optionsEn: ["Within 7 days of month end", "Within 25 days of month end", "By the end of the next month", "Quarterly"],
        answer: 1,
        explainNe: "नेपाली महिना सकिएको २५ दिनभित्र (ऐन दफा ४, २०८२ संशोधन)।",
        explainEn: "Within 25 days of the end of the Nepali month (Act §4, 2082 amendment).",
      },
      {
        q: "ढिलो दाखिला गरे कति ब्याज लाग्छ?",
        qEn: "What interest applies to a late deposit?",
        options: ["५%", "१०%", "१५%", "२०%"],
        optionsEn: ["5%", "10%", "15%", "20%"],
        answer: 1,
        explainNe: "बाँकी रकममा १०% ब्याज (ऐन दफा ९); नबुझाउनेलाई खाता/सम्पत्ति रोक्का, इजाजत निलम्बन, राहदानी रोक्कासम्म।",
        explainEn: "10% interest on the outstanding amount (Act §9); defaulters face account/property freezes, licence suspension and passport holds.",
      },
      {
        q: "रोजगारदाताको योगदान २०% मा उपदान (gratuity) को भाग कति?",
        qEn: "Within the employer's 20%, how much is the gratuity component?",
        options: ["१०%", "८.३३%", "१.६७%", "११%"],
        optionsEn: ["10%", "8.33%", "1.67%", "11%"],
        answer: 1,
        explainNe: "रोजगारदाता २०% = सञ्चय कोष १०% + उपदान ८.३३% + अन्य १.६७%।",
        explainEn: "Employer 20% = PF 10% + gratuity 8.33% + other 1.67%.",
      },
      {
        q: "रोजगारदाताको सूचीकरण नम्बर कति अङ्कको?",
        qEn: "How many digits is the employer's listing number?",
        options: ["७", "११", "१६", "२०"],
        optionsEn: ["7", "11", "16", "20"],
        answer: 2,
        explainNe: "१६ अङ्क (१ प्रदेश + ५ स्थानीय तह + उद्योग कोड + ७ रोजगारदाता कोड); कर्मचारीको SSN ११ अङ्क।",
        explainEn: "16 digits (1 province + 5 local level + industry code + 7 employer code); the worker's SSN is 11 digits.",
      },
      {
        q: "रोजगारदाताले योगदान नबुझाएको अवधिमा कर्मचारीको दुर्घटना/मृत्यु भए के हुन्छ?",
        qEn: "If a worker has an accident or dies while the employer has not deposited contributions, what happens?",
        options: ["कोषले सधैँ तिर्छ", "रोजगारदाता स्वयंले सुविधा बराबर रकम तिर्नुपर्छ", "कर्मचारीले केही पाउँदैन", "सरकारले तिर्छ"],
        optionsEn: ["The Fund always pays", "The employer itself must pay the equivalent benefit", "The worker gets nothing", "The government pays"],
        answer: 1,
        explainNe: "ऐन दफा ९: नबुझाएको अवधिको दुर्घटना/मृत्यु सुविधा बराबरको रकम रोजगारदाता स्वयंले तिर्नुपर्छ।",
        explainEn: "Act §9: the employer personally owes the accident/death benefit for the default period.",
      },
      {
        q: "कर्मचारीले जागिर छाडेको जानकारी रोजगारदाताले कति समयभित्र कोषलाई दिनुपर्छ?",
        qEn: "Within what time must the employer inform the Fund that an employee has left?",
        options: ["७ दिन", "१ महिना", "३ महिना", "आवश्यक छैन"],
        optionsEn: ["7 days", "1 month", "3 months", "Not required"],
        answer: 1,
        explainNe: "रोजगारी सकिएको जानकारी १ महिनाभित्र; नयाँ कर्मचारी ३ महिनाभित्र सूचीकरण।",
        explainEn: "Exit must be reported within 1 month; new employees listed within 3 months.",
      },
      {
        q: "कर्मचारीलाई काममा दुर्घटना भए HR ले पहिलो काम के गर्ने?",
        qEn: "If an employee has a workplace accident, what should HR do first?",
        options: ["३५ दिनभित्र अदालत जाने", "७ दिनभित्र कोषलाई जानकारी गराउने", "अर्को महिनाको declaration मा लेख्ने", "केही गर्नु पर्दैन"],
        optionsEn: ["Go to court within 35 days", "Inform the Fund within 7 days", "Note it in next month's declaration", "Nothing"],
        answer: 1,
        explainNe: "७ दिनभित्र कोषलाई खबर (message/email हुन्छ) — नत्र सम्झौता नभएको अस्पतालको रु. ७ लाखभन्दा बढी कोषले तिर्दैन।",
        explainEn: "Inform the Fund within 7 days (message/email works) — otherwise the Fund pays at most Rs 700,000 at a non-contracted hospital.",
      },
    ],
  },
  {
    slug: "migrant-worker",
    titleNe: "Migrant Worker — वैदेशिक रोजगारी र परिवारको उपचार",
    titleEn: "Migrant Worker — foreign employment and family medical cover",
    descNe: "श्रम स्वीकृतिसँगै सूचीकरण, २१.३३% योगदान, विदेशबाट deposit, KYC र नेपालमा परिवारको उपचार — विदेशमा हुने नेपालीका लागि।",
    descEn: "Registration with the labour permit, the 21.33% contribution, depositing from abroad, KYC and family treatment in Nepal — for Nepalis working abroad.",
    level: "beginner",
    minutes: 70,
    icon: "plane",
    lessons: [
      A("foreign-employment-guide", "foreign-employment-guide", "Foreign Employment SSF को पूर्ण Guide", "The complete guide to SSF for foreign employment", 8),
      Vd("ssf-for-migrants-video", "HhwTzMdAqiU", "भिडियो: वैदेशिक रोजगारीमा हुनेका लागि SSF", "Video: SSF for those in foreign employment", 10),
      Vd("deposit-from-abroad-video", "uEKO8zmFEHg", "भिडियो: विदेशबाट SSF मा रकम deposit", "Video: depositing to SSF from abroad", 8),
      Vd("kyc-mobile-video", "63a1Syl6RHU", "भिडियो: मोबाइलबाट KYC कसरी भर्ने", "Video: filling in KYC from your phone", 8),
      Vd("kyc-documents-video", "K1Z9ynkXqbw", "भिडियो: KYC का लागि चाहिने कागजात", "Video: documents needed for KYC", 6),
      A("kyc-and-claims", "kyc-profile-claim-guide", "KYC, Profile र परिवारको दाबी प्रक्रिया", "KYC, profile and the family claim process", 7),
      Vd("lost-id-password-video", "S8qI9Eyd5QE", "भिडियो: ID/password थाहा छैन — के गर्ने?", "Video: don't know your ID/password — what to do", 8),
      Vd("return-process-video", "DOaX_27N-ks", "भिडियो: नेपाल फर्किएपछि SSF मा के गर्ने", "Video: what to do in SSF after returning to Nepal", 8),
    ],
    quiz: [
      {
        q: "वैदेशिक रोजगारीमा हुनेको न्यूनतम मासिक योगदान दर कति?",
        qEn: "What is the minimum monthly contribution rate for foreign-employment contributors?",
        options: ["११%", "२०.३७%", "२१.३३%", "३१%"],
        optionsEn: ["11%", "20.37%", "21.33%", "31%"],
        answer: 2,
        explainNe: "औद्योगिक न्यूनतम आधारभूत पारिश्रमिकको कम्तीमा २१.३३% (३ गुणासम्म रोज्न सकिने); २०.३७% अनौपचारिक क्षेत्रको हो।",
        explainEn: "At least 21.33% of the industrial minimum basic remuneration (up to 3× can be chosen); 20.37% is the informal-sector rate.",
      },
      {
        q: "२१.३३% मध्ये वृद्ध अवस्था योजनामा कति जान्छ?",
        qEn: "Of the 21.33%, how much goes to the old-age scheme?",
        options: ["७.४८%", "१३.८५%", "२०%", "१०%"],
        optionsEn: ["7.48%", "13.85%", "20%", "10%"],
        answer: 1,
        explainNe: "७.४८% औषधि उपचार + दुर्घटना + आश्रित परिवारमा, १३.८५% वृद्ध अवस्थामा।",
        explainEn: "7.48% to medical + accident + dependent family, 13.85% to old age.",
      },
      {
        q: "वैदेशिक रोजगारीमा जानेको SSF सूचीकरण कहिले हुन्छ?",
        qEn: "When does SSF registration happen for someone going abroad for work?",
        options: ["विदेश पुगेपछि मात्र", "श्रम स्वीकृति लिँदा नै", "फर्किएपछि", "६० वर्षमा"],
        optionsEn: ["Only after arriving abroad", "When taking the labour permit", "After returning", "At 60"],
        answer: 1,
        explainNe: "श्रम स्वीकृति लिँदा नै सूचीकरण हुन्छ; विदेशमा भइसकेकाले online निवेदन दिन सक्छन्।",
        explainEn: "Registration happens with the labour permit; those already abroad can apply online.",
      },
      {
        q: "वैदेशिक रोजगारी योगदानकर्ताको परिवारले नेपालमा उपचारमा कति पाउँछ?",
        qEn: "How much treatment cover does a migrant contributor's family get in Nepal?",
        options: ["OPD रु. २५ हजार + भर्ना रु. १ लाख (२०% सह-भुक्तानी)", "OPD रु. १ लाख + भर्ना रु. ७ लाख", "केही पाउँदैन", "असीमित"],
        optionsEn: ["OPD Rs 25k + inpatient Rs 1 lakh (20% co-pay)", "OPD Rs 1 lakh + inpatient Rs 7 lakh", "Nothing", "Unlimited"],
        answer: 0,
        explainNe: "योगदानकर्ता, पति/पत्नी र १८ वर्षसम्मका छोराछोरीलाई OPD वार्षिक रु. २५ हजार + भर्ना उपचार रु. १ लाखसम्म, २०% सह-भुक्तानी।",
        explainEn: "Contributor, spouse and children up to 18: OPD Rs 25,000/year + inpatient up to Rs 100,000, with a 20% co-payment.",
      },
      {
        q: "KYC नगरे के हुन्छ?",
        qEn: "What happens if you don't complete KYC?",
        options: ["केही फरक पर्दैन", "सुविधा दाबी र भुक्तानीमा समस्या आउँछ", "योगदान बढ्छ", "SSN रद्द हुन्छ"],
        optionsEn: ["Nothing changes", "Claims and payments run into problems", "Your contribution increases", "Your SSN is cancelled"],
        answer: 1,
        explainNe: "AML/CFT नीति २०८२ बमोजिम KYC अनिवार्य — KYC नभई रकम दाबी गर्न सकिँदैन।",
        explainEn: "KYC is mandatory under the AML/CFT policy 2082 — without it you cannot claim benefits.",
      },
      {
        q: "विदेशमा हुनेका लागि उपचार र दुर्घटना सुविधाको योग्यता अवधि?",
        qEn: "For migrant contributors, what is the qualifying period for medical and accident benefits?",
        options: ["पछिल्ला ६ महिनामा ३ महिना", "१२ महिना", "२४ महिना", "१८० महिना"],
        optionsEn: ["3 of the last 6 months", "12 months", "24 months", "180 months"],
        answer: 0,
        explainNe: "औषधि उपचार र दुर्घटना/अशक्तता: पछिल्ला ६ महिनामा कम्तीमा ३ महिना योगदान (वैदेशिक रोजगार कार्यविधि २०७९)।",
        explainEn: "Medical and accident/disability: at least 3 of the last 6 months (Foreign Employment Procedure 2079).",
      },
      {
        q: "नेपाल फर्किएपछि निवृत्तभरण रकमको के विकल्प छ?",
        qEn: "After returning to Nepal, what are the options for the pension money?",
        options: ["फिर्ता पाइँदैन", "एकमुष्ट लिने वा ÷१६० को आजीवन मासिक pension रोज्ने", "सरकारलाई जान्छ", "३१% फिर्ता"],
        optionsEn: ["Not refundable", "Take a lump sum or choose the ÷160 lifelong monthly pension", "Goes to the government", "31% refunded"],
        answer: 1,
        explainNe: "फर्किएपछि निवृत्तभरण रकम एकमुष्ट लिने वा ÷१६० को आजीवन मासिक pension — विकल्प रोज्न पाइन्छ।",
        explainEn: "After returning you may take the pension money as a lump sum or choose the ÷160 lifelong monthly pension.",
      },
    ],
  },
];

export function courseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

/** Href of a lesson: article page, or the course page anchored at the video lesson. */
export function lessonHref(course: Course, lesson: CourseLesson): string {
  if (lesson.kind === "article") {
    const a = articleBySlug(lesson.articleSlug);
    return a ? `/school/${a.categorySlug}/${a.slug}` : `/school/courses/${course.slug}`;
  }
  return `/school/courses/${course.slug}#lesson-${lesson.slug}`;
}

export interface ArticleLessonRef {
  course: Course;
  lesson: CourseLesson;
  /** 0-based position in the course */
  index: number;
}

/** Every course lesson that points at this article (an article may sit in several courses). */
export function lessonsForArticle(articleSlug: string): ArticleLessonRef[] {
  const out: ArticleLessonRef[] = [];
  for (const course of courses) {
    course.lessons.forEach((lesson, index) => {
      if (lesson.kind === "article" && lesson.articleSlug === articleSlug) out.push({ course, lesson, index });
    });
  }
  return out;
}

/**
 * Build-time guard: every lesson must resolve to an existing article/video,
 * lesson slugs must be unique per course, lesson counts stay within 6–10,
 * and every quiz has 6–8 well-formed questions. Returns a list of problems.
 */
export function validateCourses(list: Course[] = courses): string[] {
  const problems: string[] = [];
  const seenCourse = new Set<string>();
  for (const c of list) {
    if (seenCourse.has(c.slug)) problems.push(`duplicate course slug "${c.slug}"`);
    seenCourse.add(c.slug);
    if (c.lessons.length < 6 || c.lessons.length > 10) problems.push(`${c.slug}: ${c.lessons.length} lessons (expected 6–10)`);
    if (c.quiz.length < 6 || c.quiz.length > 8) problems.push(`${c.slug}: ${c.quiz.length} quiz questions (expected 6–8)`);
    const seenLesson = new Set<string>();
    for (const l of c.lessons) {
      if (seenLesson.has(l.slug)) problems.push(`${c.slug}: duplicate lesson slug "${l.slug}"`);
      seenLesson.add(l.slug);
      if (l.kind === "article" && !articleBySlug(l.articleSlug)) problems.push(`${c.slug}/${l.slug}: unknown article "${l.articleSlug}"`);
      if (l.kind === "video") {
        const v = videoById(l.videoId);
        if (!v) problems.push(`${c.slug}/${l.slug}: unknown video "${l.videoId}"`);
        else if (v.kind === "opinion") problems.push(`${c.slug}/${l.slug}: opinion video "${l.videoId}" must not be a lesson`);
      }
      if (!(l.minutes > 0)) problems.push(`${c.slug}/${l.slug}: minutes must be positive`);
    }
    c.quiz.forEach((q, i) => {
      if (q.options.length !== 4 || q.optionsEn.length !== 4) problems.push(`${c.slug} quiz #${i + 1}: needs exactly 4 options`);
      if (q.answer < 0 || q.answer > 3) problems.push(`${c.slug} quiz #${i + 1}: answer index out of range`);
      if (new Set(q.options).size !== 4) problems.push(`${c.slug} quiz #${i + 1}: duplicate options`);
    });
  }
  return problems;
}
