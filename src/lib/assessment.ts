/**
 * SSF Need Assessment — 10 questions → "You need SSF X/10".
 * Weights reflect what SSF actually replaces: retirement income (biggest),
 * medical cover, accident/disability cover, and dependent-family protection.
 * A government employee with a state pension already has the core benefit,
 * so their need scores low; private/self-employed/foreign workers with
 * dependents and no savings score highest.
 */

export interface AssessmentQuestion {
  key: string;
  prompt: string;
  promptEn: string;
  options: Array<{
    value: string;
    label: string;
    labelEn: string;
    points: number;
    note?: string;
    noteEn?: string;
  }>;
}

export const MAX_POINTS = 12.5;

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    key: "employment",
    prompt: "तपाईंको रोजगारी अवस्था के हो?",
    promptEn: "What is your employment situation?",
    options: [
      { value: "gov", label: "सरकारी स्थायी जागिर", labelEn: "Permanent government job", points: 0, note: "सरकारी निवृत्तभरण प्रणालीले वृद्धावस्था ढाक्छ", noteEn: "The government pension system covers your old age" },
      { value: "private", label: "निजी क्षेत्रको जागिर", labelEn: "Private-sector job", points: 2, note: "SSF नै तपाईंको मुख्य सामाजिक सुरक्षा हो", noteEn: "SSF is your main social security" },
      { value: "self", label: "स्वरोजगार/व्यवसाय", labelEn: "Self-employed / business", points: 2, note: "अरू कुनै संस्थाले तपाईंको सुरक्षा गर्दैन", noteEn: "No other institution protects you" },
      { value: "foreign", label: "वैदेशिक रोजगारी", labelEn: "Foreign employment", points: 2, note: "परिवार नेपालमा, जोखिम विदेशमा — दुवैतर्फ सुरक्षा चाहिन्छ", noteEn: "Family in Nepal, risk abroad — you need protection on both sides" },
      { value: "informal", label: "अनौपचारिक क्षेत्र (ज्याला/कृषि)", labelEn: "Informal sector (wage labour / agriculture)", points: 2, note: "सरकारले ९.३७% थपिदिने हुँदा सबैभन्दा सस्तो सुरक्षा", noteEn: "With the government adding 9.37%, this is the cheapest protection available" },
      { value: "none", label: "हाल रोजगारी छैन", labelEn: "Currently not employed", points: 1 },
    ],
  },
  {
    key: "pension",
    prompt: "तपाईंले भविष्यमा कुनै निवृत्तभरण (pension) पाउनुहुन्छ?",
    promptEn: "Will you receive any pension in the future?",
    options: [
      { value: "yes", label: "पाउँछु (सरकारी/सैनिक/अन्य)", labelEn: "Yes (government/military/other)", points: 0 },
      { value: "small", label: "थोरै मात्र पाउँछु", labelEn: "Only a small one", points: 1 },
      { value: "no", label: "पाउँदिनँ", labelEn: "No", points: 2, note: "६० वर्षपछिको आम्दानीको एकमात्र भरपर्दो स्रोत SSF बन्न सक्छ", noteEn: "SSF can become your only reliable source of income after 60" },
    ],
  },
  {
    key: "savings",
    prompt: "अवकाश (retirement) का लागि छुट्टै बचत/कोष छ?",
    promptEn: "Do you have separate savings/funds for retirement?",
    options: [
      { value: "good", label: "राम्रो छ (सञ्चय कोष/नागरिक लगानी/अन्य)", labelEn: "Yes, solid (Provident Fund / Citizen Investment / other)", points: 0.25 },
      { value: "some", label: "थोरै छ", labelEn: "A little", points: 0.75 },
      { value: "none", label: "छैन", labelEn: "None", points: 1.5 },
    ],
  },
  {
    key: "insurance",
    prompt: "स्वास्थ्य बीमा छ?",
    promptEn: "Do you have health insurance?",
    options: [
      { value: "yes", label: "छ", labelEn: "Yes", points: 0.25 },
      { value: "no", label: "छैन", labelEn: "No", points: 1, note: "SSF को औषधि उपचार योजनाले वार्षिक रु. १ लाखसम्म ढाक्छ", noteEn: "SSF's medical treatment scheme covers up to Rs. 100,000 per year" },
    ],
  },
  {
    key: "children",
    prompt: "१८ वर्षमुनिका छोराछोरी छन्?",
    promptEn: "Do you have children under 18?",
    options: [
      { value: "yes", label: "छन्", labelEn: "Yes", points: 1.25, note: "तपाईंलाई केही भए शैक्षिक वृत्ति (तलबको ४०%) ले उनीहरूलाई जोगाउँछ", noteEn: "If something happens to you, the education stipend (40% of salary) protects them" },
      { value: "no", label: "छैनन्", labelEn: "No", points: 0.25 },
    ],
  },
  {
    key: "dependents",
    prompt: "तपाईंको आम्दानीमा निर्भर परिवार (पति/पत्नी, बुबाआमा) हुनुहुन्छ?",
    promptEn: "Does family (spouse, parents) depend on your income?",
    options: [
      { value: "yes", label: "हुनुहुन्छ", labelEn: "Yes", points: 1.25, note: "आश्रित परिवार योजनाले तलबको ६०% आजीवन दिन्छ", noteEn: "The dependent-family scheme provides 60% of salary for life" },
      { value: "no", label: "हुनुहुन्न", labelEn: "No", points: 0.25 },
    ],
  },
  {
    key: "age",
    prompt: "तपाईंको उमेर?",
    promptEn: "Your age?",
    options: [
      { value: "u30", label: "३० मुनि", labelEn: "Under 30", points: 1, note: "जति चाँडो सुरु, १८० महिना त्यति सजिलो पुग्छ", noteEn: "The earlier you start, the easier it is to reach 180 months" },
      { value: "30to45", label: "३०–४५", labelEn: "30–45", points: 1.25 },
      { value: "45to60", label: "४५–६०", labelEn: "45–60", points: 0.75, note: "१८० महिना पुर्‍याउन योजना बनाएर सुरु गर्नुहोस्", noteEn: "Start with a plan to reach 180 months" },
      { value: "60plus", label: "६० माथि", labelEn: "Over 60", points: 0.5 },
    ],
  },
  {
    key: "income",
    prompt: "तपाईंको आम्दानी कस्तो छ?",
    promptEn: "How is your income?",
    options: [
      { value: "stable", label: "नियमित/स्थिर", labelEn: "Regular / stable", points: 0.5 },
      { value: "variable", label: "अनियमित", labelEn: "Irregular", points: 1, note: "अनियमित आम्दानीमा जोखिम-सुरक्षा झनै महत्वपूर्ण हुन्छ", noteEn: "With irregular income, risk protection matters even more" },
    ],
  },
  {
    key: "emergency",
    prompt: "६ महिना चल्ने आकस्मिक (emergency) बचत छ?",
    promptEn: "Do you have emergency savings to last 6 months?",
    options: [
      { value: "yes", label: "छ", labelEn: "Yes", points: 0.25 },
      { value: "no", label: "छैन", labelEn: "No", points: 1, note: "दुर्घटना/बिरामीमा SSF ले नै आम्दानीको ६०% धान्छ", noteEn: "In accidents/illness, SSF sustains 60% of your income" },
    ],
  },
  {
    key: "risk",
    prompt: "तपाईंको कामको प्रकृति कत्तिको जोखिमपूर्ण छ?",
    promptEn: "How risky is the nature of your work?",
    options: [
      { value: "high", label: "उच्च जोखिम (निर्माण/यातायात/मेसिन/विदेशी श्रम)", labelEn: "High risk (construction/transport/machinery/foreign labour)", points: 1, note: "दुर्घटना योजना पहिलो दिनदेखि नै लागू हुन्छ", noteEn: "The accident scheme applies from day one" },
      { value: "normal", label: "सामान्य (अफिस/पसल)", labelEn: "Normal (office/shop)", points: 0.5 },
    ],
  },
];

export interface AssessmentResult {
  score: number; // 1..10
  headline: string;
  summary: string;
  factors: string[]; // personalized notes from chosen options
}

export function scoreAssessment(
  answers: Record<string, string>,
  locale: string = "ne",
): AssessmentResult {
  const isEn = locale === "en";
  let points = 0;
  const factors: string[] = [];
  for (const q of assessmentQuestions) {
    const chosen = q.options.find((o) => o.value === answers[q.key]);
    if (!chosen) continue;
    points += chosen.points;
    const note = isEn ? (chosen.noteEn ?? chosen.note) : chosen.note;
    if (note) factors.push(note);
  }

  const raw = Math.round((points / MAX_POINTS) * 10);
  const score = Math.min(10, Math.max(1, raw));

  let headline: string;
  let summary: string;
  if (score >= 8) {
    headline = isEn
      ? `You need SSF: ${score}/10`
      : `तपाईंलाई SSF चाहिन्छ: ${score}/10`;
    summary = isEn
      ? "In your situation SSF looks essential — nothing else currently covers your old age, treatment, accidents, and family protection. The later you start, the further away the 180-month pension eligibility gets."
      : "तपाईंको अवस्थामा SSF अत्यावश्यक देखिन्छ — वृद्धावस्था, उपचार, दुर्घटना र परिवारको सुरक्षा अहिले SSF बाहेक अरूले ढाकेको छैन। जति ढिलो सुरु गर्नुभयो, १८० महिनाको pension योग्यता त्यति टाढिन्छ।";
  } else if (score >= 5) {
    headline = isEn
      ? `SSF would be useful for you: ${score}/10`
      : `तपाईंलाई SSF उपयोगी हुन्छ: ${score}/10`;
    summary = isEn
      ? "You have some protection from elsewhere, but SSF's benefits (treatment, accident, family protection, extra pension) fill important gaps. Even government pension recipients can take an additional SSF pension (section 24d)."
      : "तपाईंको केही सुरक्षा अन्यत्रबाट छ, तर SSF का सुविधा (उपचार, दुर्घटना, परिवार सुरक्षा, थप pension) ले महत्वपूर्ण खाली ठाउँ भर्छन्। सरकारी pension पाउनेले पनि SSF pension थप लिन पाउँछ (दफा २४घ)।";
  } else {
    headline = isEn
      ? `Your SSF need: ${score}/10`
      : `तपाईंको SSF आवश्यकता: ${score}/10`;
    summary = isEn
      ? "Your old-age/risk protection appears largely covered by other sources. Still, SSF may be worth considering for family treatment coverage or extra savings — recheck especially if your job/situation changes."
      : "तपाईंको वृद्धावस्था/जोखिम सुरक्षा धेरै हदसम्म अन्य स्रोतले ढाकेको देखिन्छ। तै पनि परिवारको उपचार सुविधा वा थप बचतका लागि SSF विचार गर्न सकिन्छ — विशेषगरी रोजगारी/अवस्था फेरिए पुनः जाँच्नुहोस्।";
  }

  return { score, headline, summary, factors };
}
