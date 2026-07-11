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
  options: Array<{ value: string; label: string; points: number; note?: string }>;
}

export const MAX_POINTS = 12.5;

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    key: "employment",
    prompt: "तपाईंको रोजगारी अवस्था के हो?",
    options: [
      { value: "gov", label: "सरकारी स्थायी जागिर", points: 0, note: "सरकारी निवृत्तभरण प्रणालीले वृद्धावस्था ढाक्छ" },
      { value: "private", label: "निजी क्षेत्रको जागिर", points: 2, note: "SSF नै तपाईंको मुख्य सामाजिक सुरक्षा हो" },
      { value: "self", label: "स्वरोजगार/व्यवसाय", points: 2, note: "अरू कुनै संस्थाले तपाईंको सुरक्षा गर्दैन" },
      { value: "foreign", label: "वैदेशिक रोजगारी", points: 2, note: "परिवार नेपालमा, जोखिम विदेशमा — दुवैतर्फ सुरक्षा चाहिन्छ" },
      { value: "informal", label: "अनौपचारिक क्षेत्र (ज्याला/कृषि)", points: 2, note: "सरकारले ९.३७% थपिदिने हुँदा सबैभन्दा सस्तो सुरक्षा" },
      { value: "none", label: "हाल रोजगारी छैन", points: 1 },
    ],
  },
  {
    key: "pension",
    prompt: "तपाईंले भविष्यमा कुनै निवृत्तभरण (pension) पाउनुहुन्छ?",
    options: [
      { value: "yes", label: "पाउँछु (सरकारी/सैनिक/अन्य)", points: 0 },
      { value: "small", label: "थोरै मात्र पाउँछु", points: 1 },
      { value: "no", label: "पाउँदिनँ", points: 2, note: "६० वर्षपछिको आम्दानीको एकमात्र भरपर्दो स्रोत SSF बन्न सक्छ" },
    ],
  },
  {
    key: "savings",
    prompt: "अवकाश (retirement) का लागि छुट्टै बचत/कोष छ?",
    options: [
      { value: "good", label: "राम्रो छ (सञ्चय कोष/नागरिक लगानी/अन्य)", points: 0.25 },
      { value: "some", label: "थोरै छ", points: 0.75 },
      { value: "none", label: "छैन", points: 1.5 },
    ],
  },
  {
    key: "insurance",
    prompt: "स्वास्थ्य बीमा छ?",
    options: [
      { value: "yes", label: "छ", points: 0.25 },
      { value: "no", label: "छैन", points: 1, note: "SSF को औषधि उपचार योजनाले वार्षिक रु. १ लाखसम्म ढाक्छ" },
    ],
  },
  {
    key: "children",
    prompt: "१८ वर्षमुनिका छोराछोरी छन्?",
    options: [
      { value: "yes", label: "छन्", points: 1.25, note: "तपाईंलाई केही भए शैक्षिक वृत्ति (तलबको ४०%) ले उनीहरूलाई जोगाउँछ" },
      { value: "no", label: "छैनन्", points: 0.25 },
    ],
  },
  {
    key: "dependents",
    prompt: "तपाईंको आम्दानीमा निर्भर परिवार (पति/पत्नी, बुबाआमा) हुनुहुन्छ?",
    options: [
      { value: "yes", label: "हुनुहुन्छ", points: 1.25, note: "आश्रित परिवार योजनाले तलबको ६०% आजीवन दिन्छ" },
      { value: "no", label: "हुनुहुन्न", points: 0.25 },
    ],
  },
  {
    key: "age",
    prompt: "तपाईंको उमेर?",
    options: [
      { value: "u30", label: "३० मुनि", points: 1, note: "जति चाँडो सुरु, १८० महिना त्यति सजिलो पुग्छ" },
      { value: "30to45", label: "३०–४५", points: 1.25 },
      { value: "45to60", label: "४५–६०", points: 0.75, note: "१८० महिना पुर्‍याउन योजना बनाएर सुरु गर्नुहोस्" },
      { value: "60plus", label: "६० माथि", points: 0.5 },
    ],
  },
  {
    key: "income",
    prompt: "तपाईंको आम्दानी कस्तो छ?",
    options: [
      { value: "stable", label: "नियमित/स्थिर", points: 0.5 },
      { value: "variable", label: "अनियमित", points: 1, note: "अनियमित आम्दानीमा जोखिम-सुरक्षा झनै महत्वपूर्ण हुन्छ" },
    ],
  },
  {
    key: "emergency",
    prompt: "६ महिना चल्ने आकस्मिक (emergency) बचत छ?",
    options: [
      { value: "yes", label: "छ", points: 0.25 },
      { value: "no", label: "छैन", points: 1, note: "दुर्घटना/बिरामीमा SSF ले नै आम्दानीको ६०% धान्छ" },
    ],
  },
  {
    key: "risk",
    prompt: "तपाईंको कामको प्रकृति कत्तिको जोखिमपूर्ण छ?",
    options: [
      { value: "high", label: "उच्च जोखिम (निर्माण/यातायात/मेसिन/विदेशी श्रम)", points: 1, note: "दुर्घटना योजना पहिलो दिनदेखि नै लागू हुन्छ" },
      { value: "normal", label: "सामान्य (अफिस/पसल)", points: 0.5 },
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
): AssessmentResult {
  let points = 0;
  const factors: string[] = [];
  for (const q of assessmentQuestions) {
    const chosen = q.options.find((o) => o.value === answers[q.key]);
    if (!chosen) continue;
    points += chosen.points;
    if (chosen.note) factors.push(chosen.note);
  }

  const raw = Math.round((points / MAX_POINTS) * 10);
  const score = Math.min(10, Math.max(1, raw));

  let headline: string;
  let summary: string;
  if (score >= 8) {
    headline = `तपाईंलाई SSF चाहिन्छ: ${score}/10`;
    summary =
      "तपाईंको अवस्थामा SSF अत्यावश्यक देखिन्छ — वृद्धावस्था, उपचार, दुर्घटना र परिवारको सुरक्षा अहिले SSF बाहेक अरूले ढाकेको छैन। जति ढिलो सुरु गर्नुभयो, १८० महिनाको pension योग्यता त्यति टाढिन्छ।";
  } else if (score >= 5) {
    headline = `तपाईंलाई SSF उपयोगी हुन्छ: ${score}/10`;
    summary =
      "तपाईंको केही सुरक्षा अन्यत्रबाट छ, तर SSF का सुविधा (उपचार, दुर्घटना, परिवार सुरक्षा, थप pension) ले महत्वपूर्ण खाली ठाउँ भर्छन्। सरकारी pension पाउनेले पनि SSF pension थप लिन पाउँछ (दफा २४घ)।";
  } else {
    headline = `तपाईंको SSF आवश्यकता: ${score}/10`;
    summary =
      "तपाईंको वृद्धावस्था/जोखिम सुरक्षा धेरै हदसम्म अन्य स्रोतले ढाकेको देखिन्छ। तै पनि परिवारको उपचार सुविधा वा थप बचतका लागि SSF विचार गर्न सकिन्छ — विशेषगरी रोजगारी/अवस्था फेरिए पुनः जाँच्नुहोस्।";
  }

  return { score, headline, summary, factors };
}
