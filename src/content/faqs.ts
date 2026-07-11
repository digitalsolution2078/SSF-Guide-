import type { FaqItem } from "./types";

const LAST_VERIFIED = "2026-07-11";

export const faqs: FaqItem[] = [
  {
    slug: "31-percent-kaha-jancha",
    question: "SSF मा जम्मा हुने ३१% रकम कहाँ जान्छ?",
    answerBlocks: [
      {
        type: "p",
        text: "चार योजनामा बाँडिन्छ (५औँ संशोधन): औषधि उपचार/मातृत्व १.२०%, दुर्घटना/अशक्तता ०.८०%, आश्रित परिवार ०.६७%, वृद्ध अवस्था २८.३३% (निवृत्तभरण २०% + अवकाश सुविधा ८.३३%)। सबैभन्दा ठूलो भाग तपाईंकै वृद्धावस्था बचतमा जान्छ।",
      },
    ],
    categorySlug: "yogdan-ra-badfad",
    userCategories: ["employee", "contributor"],
    popular: true,
    relatedArticleSlug: "31-pratishat-kaha-jancha",
    sourceKeys: ["procedure-2075-5th"],
    lastVerified: LAST_VERIFIED,
  },
  {
    slug: "jagir-chadepachi-paisa",
    question: "जागिर छाडेपछि SSF को पैसा के हुन्छ?",
    answerBlocks: [
      {
        type: "p",
        text: "अवकाश सुविधा योजनाको रकम (८.३३% + स्वेच्छिक थप + हस्तान्तरित) रोजगारी अन्त्यमा एकमुष्ट पाइन्छ। निवृत्तभरण योजनाको रकम (२०%) ६० वर्षपछि मासिक पेन्सनका रूपमा आउँछ — १८० महिना नपुगेकाले ६० वर्षमा एकमुष्ट वा पेन्सन रोज्न पाउँछन्। नयाँ SSF-सूचीकृत जागिरमा गए उही SSN मा योगदान निरन्तर चल्छ।",
      },
    ],
    categorySlug: "pension-ra-retirement",
    userCategories: ["employee", "contributor"],
    popular: true,
    relatedArticleSlug: "jagir-chadepachi-ke-huncha",
    videoIds: ["Q4SrXAtj074"],
    sourceKeys: ["procedure-2075-5th"],
    lastVerified: LAST_VERIFIED,
  },
  {
    slug: "pension-kahile-paincha",
    question: "SSF बाट Pension कहिले पाइन्छ?",
    answerBlocks: [
      {
        type: "p",
        text: "६० वर्ष उमेर पूरा भएपछि, कम्तीमा १८० महिना (१५ वर्ष) योगदान गरेको भए। रकम: (निवृत्तभरण खातामा जम्मा + लगानी प्रतिफल) ÷ १६० = आजीवन मासिक पेन्सन, मुद्रास्फीति समायोजनसहित।",
      },
    ],
    categorySlug: "pension-ra-retirement",
    userCategories: ["employee", "contributor"],
    popular: true,
    relatedArticleSlug: "pension-ra-retirement-guide",
    sourceKeys: ["procedure-2075-5th"],
    lastVerified: LAST_VERIFIED,
  },
  {
    slug: "bidesh-bata-yogdan",
    question: "विदेशमा हुनेले SSF मा कसरी योगदान गर्ने?",
    answerBlocks: [
      {
        type: "p",
        text: "श्रम स्वीकृति लिँदा नै सूचीकरण हुन्छ; विदेशमा भइसकेकाले SOSYS/mobile app बाट online निवेदन दिन सक्छन्। योगदान औद्योगिक न्यूनतम पारिश्रमिकको कम्तीमा २१.३३% (३ गुणासम्म रोज्न मिल्ने) — बैंक वा डिजिटल माध्यमबाट जम्मा गर्न सकिन्छ।",
      },
    ],
    categorySlug: "baideshik-rojgari",
    userCategories: ["foreign"],
    popular: true,
    relatedArticleSlug: "foreign-employment-guide",
    videoIds: ["uEKO8zmFEHg"],
    sourceKeys: ["foreign-procedure-2079"],
    lastVerified: LAST_VERIFIED,
  },
  {
    slug: "kyc-kina-avashyak",
    question: "KYC Verification किन आवश्यक हुन्छ?",
    answerBlocks: [
      {
        type: "p",
        text: "सम्पत्ति शुद्धीकरण निवारण कानुन र SSF को AML/CFT नीति, २०८२ बमोजिम पहिचान प्रमाणित नगरी सुविधा भुक्तानी हुँदैन — वास्तविक पहिचान नभएसम्म सुविधा निलम्बनसमेत हुन सक्छ (नियमावली २०७५, नियम १०)। KYC पूरा गरे मात्र दाबी र भुक्तानी सहज हुन्छ।",
      },
    ],
    categorySlug: "kyc-profile-nominee",
    userCategories: ["contributor", "foreign"],
    popular: true,
    relatedArticleSlug: "kyc-profile-claim-guide",
    videoIds: ["EZS--UrRV04"],
    sourceKeys: ["aml-policy-2082"],
    lastVerified: LAST_VERIFIED,
  },
  {
    slug: "contribution-nadekhiema",
    question: "Contribution नदेखिएमा के गर्ने?",
    answerBlocks: [
      {
        type: "steps",
        items: [
          "SOSYS मा login गरी योगदान विवरण (contribution history) जाँच्नुहोस्",
          "रोजगारदातालाई payroll विवरण र भौचर देखाउन भन्नुहोस्",
          "रोजगारदाताले जम्मा नगरेको देखिए SSF मा उजुरी/निवेदन दिनुहोस् — कोषले १०% ब्याजसहित असुल गर्छ",
          "योगदान नबुझाएको अवधिमा दुर्घटना/मृत्यु भए सुविधा बराबरको रकम रोजगारदाता स्वयंले दिनुपर्छ",
        ],
      },
    ],
    categorySlug: "claims-problems-solutions",
    userCategories: ["employee", "contributor"],
    popular: true,
    sourceKeys: ["act-2074"],
    lastVerified: LAST_VERIFIED,
  },
  {
    slug: "talab-ghatcha-ki",
    question: "३१% योगdान गर्दा श्रमिकको तलब घट्छ?",
    answerBlocks: [
      {
        type: "p",
        text: "श्रमिकको तर्फबाट कट्टा हुने ११% मध्ये १०% त पहिल्यैदेखि सञ्चय कोषमा जाने रकम हो — थप भार १% मात्र। रोजगारदाताको २०% तलबबाट होइन, माथि थपिन्छ। सबै रकम अन्ततः श्रमिककै सुविधा र बचतमा फर्किन्छ।",
      },
    ],
    categorySlug: "yogdan-ra-badfad",
    userCategories: ["employee"],
    popular: false,
    relatedArticleSlug: "yogdan-kasari-calculate-huncha",
    sourceKeys: ["procedure-2075-5th", "labour-act-2074"],
    lastVerified: LAST_VERIFIED,
  },
  {
    slug: "kati-dinbhitra-dakhila",
    question: "रोजगारदाताले योगदान कति दिनभित्र दाखिला गर्नुपर्छ?",
    answerBlocks: [
      {
        type: "p",
        text: "प्रत्येक नेपाली महिना समाप्त भएको २५ दिनभित्र (ऐन दफा ४, २०८२ संशोधन)। ढिलो भए १०% ब्याज लाग्छ र बैंक खाता/सम्पत्ति रोक्का, इजाजत निलम्बन, राहदानी रोक्कासम्मको कारबाही हुन सक्छ।",
      },
    ],
    categorySlug: "karmachari-ra-rojgardata",
    userCategories: ["employer"],
    popular: false,
    sourceKeys: ["act-2074"],
    lastVerified: LAST_VERIFIED,
  },
  {
    slug: "upachar-kaha-garne",
    question: "SSF बाट उपचार जहाँ गरे पनि पाइन्छ?",
    answerBlocks: [
      {
        type: "p",
        text: "कोषसँग सम्झौता भएका सूचीकृत अस्पतालमा सहज (क्यासलेस) हुन्छ। रोजगारीजन्य दुर्घटनामा सम्झौता नभएको अस्पतालमा उपचार गराउँदा ७ दिनभित्र कोषलाई जानकारी नगराए रु. ७ लाखभन्दा बढी कोषले व्यहोर्दैन। भुक्तानी दर स्वास्थ्य संस्था छनौट कार्यविधि, २०७६ अनुसार हुन्छ।",
      },
    ],
    categorySlug: "medical-maternity-accident-dependent",
    userCategories: ["contributor", "employee"],
    popular: false,
    videoIds: ["m2oKN85hFhU", "9LzsyY_4DsM"],
    sourceKeys: ["hospital-payment-2076", "procedure-2075-5th"],
    lastVerified: LAST_VERIFIED,
  },
  {
    slug: "upachar-sima-kati",
    question: "औषधि उपचारमा वार्षिक कति रकमसम्म पाइन्छ?",
    answerBlocks: [
      {
        type: "list",
        items: [
          "भर्ना भई उपचार: परिवारसमेत वार्षिक रु. १ लाखसम्म",
          "OPD/प्रेस्क्रिप्सन: वार्षिक रु. २० हजारसम्म (सीमाभित्रै)",
          "प्रत्येक दाबीको २०% आफैँले व्यहोर्नुपर्छ (सह-भुक्तानी)",
          "६० महिना योगदान गरेकालाई सूचीकृत अस्पतालमा रु. १–१० लाखको ५०% कोषले थप व्यहोर्छ",
          "घातक रोग: सेवा अवधिभर रु. १० लाखसम्म",
        ],
      },
    ],
    categorySlug: "medical-maternity-accident-dependent",
    userCategories: ["contributor", "employee", "family"],
    popular: false,
    sourceKeys: ["procedure-2075-5th"],
    lastVerified: LAST_VERIFIED,
  },
  {
    slug: "sutkeri-suvidha",
    question: "मातृत्व (सुत्केरी) सुविधा के-के पाइन्छ?",
    answerBlocks: [
      {
        type: "list",
        items: [
          "गर्भ परीक्षण, प्रसूति शल्यक्रिया/उपचार, सुत्केरीपछि ६ हप्तासम्मको उपचार र ३ महिनासम्मको शिशु उपचार (सीमाभित्र)",
          "प्रसूति स्याहार: प्रति शिशु एक महिनाको न्यूनतम पारिश्रमिक बराबर — २४ हप्तापछिको गर्भपतन/मृत शिशु जन्ममा पनि",
          "प्रसूति बिदा रकम: रोजगारदाताको ६० दिनबाहेकको अवधिमा आधारभूत पारिश्रमिकको ६०% (जम्मा ९८ दिनसम्म)",
          "पति-पत्नी दुवै योगदानकर्ता भए एकजनाले मात्र दाबी गर्न पाइन्छ",
        ],
      },
    ],
    categorySlug: "medical-maternity-accident-dependent",
    userCategories: ["employee", "family"],
    popular: false,
    videoIds: ["S_Ch2yO7G3A"],
    sourceKeys: ["procedure-2075-5th"],
    lastVerified: LAST_VERIFIED,
  },
  {
    slug: "mrityu-bhaema-pariwar",
    question: "योगदानकर्ताको मृत्यु भए परिवारले के पाउँछ?",
    answerBlocks: [
      {
        type: "list",
        items: [
          "पति/पत्नीलाई अन्तिम आधारभूत पारिश्रमिकको ६०% आजीवन मासिक (अर्को विवाह/वैकल्पिक रोजगारीमा रोकिन्छ)",
          "१८ वर्षमुनिका बढीमा २ सन्ततिलाई ४०% रकम दामासाहीले (अध्ययनरत भए २१ वर्षसम्म)",
          "पति/पत्नी र छोराछोरी नभए आश्रित बाबुआमालाई ६०% दामासाहीले",
          "अन्तिम संस्कार खर्च रु. २५,००० एकमुष्ट",
          "रोजगारीजन्य मृत्यु: पहिलो दिनदेखि; अन्य मृत्यु: कम्तीमा १२ महिना योगदान चाहिन्छ",
        ],
      },
    ],
    categorySlug: "medical-maternity-accident-dependent",
    userCategories: ["family", "contributor"],
    popular: false,
    sourceKeys: ["procedure-2075-5th"],
    lastVerified: LAST_VERIFIED,
  },
  {
    slug: "sapati-kasari-line",
    question: "SSF बाट सापटी (Loan) कसरी लिने?",
    answerBlocks: [
      {
        type: "p",
        text: "३६ महिना योगदान गरेकाले घर सापटी (रु. ७५ लाखसम्म, २० वर्ष) वा शैक्षिक सापटी (रु. ३५ लाखसम्म, १५ वर्ष) लिन सक्छन् — धितो चाहिन्छ। विशेष सापटी (अवकाश सुविधा रकमको ८०% सम्म) मा धितो चाहिँदैन र online/app बाटै आवेदन गर्न सकिन्छ।",
      },
    ],
    categorySlug: "pension-ra-retirement",
    userCategories: ["contributor"],
    popular: false,
    videoIds: ["KZ44YSrPkjY", "Ym8rVCfLfH0", "FTzJA0o_gnU"],
    sourceKeys: ["loan-directive-2079"],
    lastVerified: LAST_VERIFIED,
  },
  {
    slug: "sarkari-pension-ra-ssf",
    question: "सरकारी पेन्सन पाउनेले SSF निवृत्तभरण पनि पाउन सक्छ?",
    answerBlocks: [
      {
        type: "p",
        text: "सक्छ। कार्यविधिको दफा २४घ अनुसार नेपाल सरकार वा अन्यत्रबाट निवृत्तभरण पाइरहेको व्यक्तिले कोषमा योगदान गरी योग्य भएमा कोषबाट पनि निवृत्तभरण लिन बाधा पर्दैन।",
      },
    ],
    categorySlug: "pension-ra-retirement",
    userCategories: ["contributor"],
    popular: false,
    videoIds: ["8BLS0M5X6Os"],
    sourceKeys: ["procedure-2075-5th"],
    lastVerified: LAST_VERIFIED,
  },
  {
    slug: "dui-ssn-bhaema",
    question: "दुई वटा SSF नम्बर (SSN) भए के गर्ने?",
    answerBlocks: [
      {
        type: "p",
        text: "SSN जीवनभर एउटै हुनुपर्छ। गल्तीले दुई वटा बनेको भए तुरुन्तै कोषमा जानकारी दिई प्रमाण कागजातसहित एकीकरण (merge) गराउनुहोस् — नत्र योगदान विवरण बाँडिएर दाबीमा समस्या आउँछ।",
      },
    ],
    categorySlug: "kyc-profile-nominee",
    userCategories: ["contributor", "foreign"],
    popular: false,
    videoIds: ["nwdYoVHTEKA"],
    sourceKeys: ["listing-procedure-2075"],
    lastVerified: LAST_VERIFIED,
  },
  {
    slug: "sarkar-guarantee",
    question: "कोषको रकम सुरक्षित छ? सरकारले ग्यारेन्टी लिन्छ?",
    answerBlocks: [
      {
        type: "p",
        text: "ऐनको दफा ६२ अनुसार कोषको रकम अपर्याप्त भए योजनालाई निरन्तरता दिने दायित्व नेपाल सरकारको हुन्छ। कोषको रकम 'क' वर्गका बैंकमा राखिन्छ र लगानी कार्यविधि, २०७७ का सीमाभित्र रहेर लगानी हुन्छ।",
      },
    ],
    categorySlug: "ssf-parichaya",
    userCategories: ["employee", "contributor"],
    popular: false,
    sourceKeys: ["act-2074", "investment-procedure-2077"],
    lastVerified: LAST_VERIFIED,
  },
  {
    slug: "chhatrabritti",
    question: "योगदानकर्ताका छोराछोरीले छात्रवृत्ति पाउँछन्?",
    answerBlocks: [
      {
        type: "p",
        text: "पाउँछन्। कम्तीमा २४ महिना योगदान गरेका योगदानकर्ताका जेहेनदार सन्ततिले स्नातक तह अध्ययनका लागि वास्तविक शुल्क वा रु. ५ लाखमध्ये जुन कम हुन्छ, सो रकम छात्रवृत्ति पाउन सक्छन् (छात्रवृत्ति कार्यविधि, २०७९)। प्रत्येक वर्ष सूचना प्रकाशित हुन्छ।",
      },
    ],
    categorySlug: "medical-maternity-accident-dependent",
    userCategories: ["contributor", "family"],
    popular: false,
    sourceKeys: ["scholarship-2079"],
    lastVerified: LAST_VERIFIED,
  },
];

export function faqBySlug(slug: string): FaqItem | undefined {
  return faqs.find((f) => f.slug === slug);
}

export const popularFaqs = faqs.filter((f) => f.popular);
