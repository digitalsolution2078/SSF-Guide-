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
    en: {
      question: "Where does the 31% deposited in SSF go?",
      answerBlocks: [
        {
          type: "p",
          text: "It is split across four schemes (5th amendment): medical treatment/maternity 1.20%, accident/disability 0.80%, dependent family 0.67%, and old age 28.33% (pension 20% + retirement benefit 8.33%). The largest share goes into your own old-age savings.",
        },
      ],
    },
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
    en: {
      question: "What happens to your SSF money after you leave a job?",
      answerBlocks: [
        {
          type: "p",
          text: "The Retirement Benefit Scheme amount (8.33% + voluntary additions + transfers) is paid as a lump sum when employment ends. The Pension Scheme amount (20%) comes as a monthly pension after age 60 — those who haven't completed 180 months can choose at 60 between a lump sum or a pension. If you join a new SSF-registered job, contributions continue on the same SSN.",
        },
      ],
    },
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
    en: {
      question: "When do you receive a pension from SSF?",
      answerBlocks: [
        {
          type: "p",
          text: "After completing 60 years of age, provided you have contributed for at least 180 months (15 years). Amount: (deposits in the pension account + investment returns) ÷ 160 = a lifelong monthly pension, adjusted for inflation.",
        },
      ],
    },
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
    en: {
      question: "How can someone abroad contribute to SSF?",
      answerBlocks: [
        {
          type: "p",
          text: "You are registered when taking your labour permit; those already abroad can apply online via SOSYS or the mobile app. The contribution is at least 21.33% of the industrial minimum wage (you can choose a base up to 3×) — payable via bank or digital channels.",
        },
      ],
    },
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
    en: {
      question: "Why is KYC verification necessary?",
      answerBlocks: [
        {
          type: "p",
          text: "Under money-laundering prevention law and SSF's AML/CFT Policy 2082, benefits cannot be paid without verified identity — benefits can even be suspended until real identity is established (Regulation 2075, rule 10). Only with completed KYC do claims and payments go smoothly.",
        },
      ],
    },
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
    en: {
      question: "What to do if your contribution doesn't show up?",
      answerBlocks: [
        {
          type: "steps",
          items: [
            "Log in to SOSYS and check your contribution history",
            "Ask your employer to show the payroll details and deposit voucher",
            "If the employer hasn't deposited, file a complaint/application with SSF — the Fund recovers it with 10% interest",
            "If an accident or death occurs during an unpaid period, the employer must personally pay an amount equal to the benefits",
          ],
        },
      ],
    },
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
    en: {
      question: "Does the 31% contribution reduce a worker's salary?",
      answerBlocks: [
        {
          type: "p",
          text: "Of the 11% deducted from the worker's side, 10% was already going to the Provident Fund — the extra burden is only 1%. The employer's 20% is not taken from the salary; it is added on top. All of it ultimately comes back to the worker as benefits and savings.",
        },
      ],
    },
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
    en: {
      question: "Within how many days must the employer deposit contributions?",
      answerBlocks: [
        {
          type: "p",
          text: "Within 25 days of the end of each Nepali month (Act section 4, 2082 amendment). If late, 10% interest applies, and actions can include freezing bank accounts/assets, suspending licenses, and even withholding passports.",
        },
      ],
    },
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
    en: {
      question: "Can you get SSF treatment coverage at any hospital?",
      answerBlocks: [
        {
          type: "p",
          text: "It is easiest (cashless) at listed hospitals that have an agreement with the Fund. For workplace accidents treated at a non-contracted hospital, the Fund will not cover more than Rs. 700,000 unless it is informed within 7 days. Payment rates follow the Health Institution Selection Procedure 2076.",
        },
      ],
    },
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
    en: {
      question: "How much medical treatment coverage do you get per year?",
      answerBlocks: [
        {
          type: "list",
          items: [
            "Inpatient treatment: up to Rs. 100,000/year including family",
            "OPD/prescriptions: up to Rs. 20,000/year (within the limit)",
            "You bear 20% of every claim yourself (co-payment)",
            "With 60 months of contributions, the Fund additionally covers 50% of Rs. 100,000–1,000,000 at listed hospitals",
            "Critical illness: up to Rs. 1,000,000 over your service period",
          ],
        },
      ],
    },
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
    en: {
      question: "What maternity benefits are available?",
      answerBlocks: [
        {
          type: "list",
          items: [
            "Pregnancy tests, delivery surgery/treatment, treatment up to 6 weeks after delivery, and infant care up to 3 months (within limits)",
            "Maternity care: one month's minimum wage per child — also for miscarriage after 24 weeks or stillbirth",
            "Maternity leave payment: 60% of basic salary for the period beyond the employer's 60 days (up to 98 days total)",
            "If both spouses are contributors, only one may claim",
          ],
        },
      ],
    },
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
    en: {
      question: "What does the family receive if a contributor dies?",
      answerBlocks: [
        {
          type: "list",
          items: [
            "The spouse receives 60% of the last basic salary monthly for life (stops on remarriage or alternative employment)",
            "Up to 2 children under 18 share 40% proportionally (until 21 if still studying)",
            "If there is no spouse or children, dependent parents share 60% proportionally",
            "Funeral costs: Rs. 25,000 as a lump sum",
            "Work-related death: covered from day one; other deaths: at least 12 months of contributions required",
          ],
        },
      ],
    },
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
    en: {
      question: "How to take a loan from SSF?",
      answerBlocks: [
        {
          type: "p",
          text: "With 36 months of contributions you can take a home loan (up to Rs. 7.5 million, 20 years) or an education loan (up to Rs. 3.5 million, 15 years) — collateral required. The special loan (up to 80% of your Retirement Benefit balance) needs no collateral and can be applied for online or via the app.",
        },
      ],
    },
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
    en: {
      question: "Can someone receiving a government pension also get an SSF pension?",
      answerBlocks: [
        {
          type: "p",
          text: "Yes. Under section 24d of the procedure, a person receiving a pension from the Government of Nepal or elsewhere faces no barrier to also receiving a pension from the Fund, provided they contribute and qualify.",
        },
      ],
    },
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
    en: {
      question: "What to do if you have two SSF numbers (SSNs)?",
      answerBlocks: [
        {
          type: "p",
          text: "Your SSN must be the same for life. If two were created by mistake, inform the Fund immediately and get them merged with supporting documents — otherwise your contribution history gets split and claims run into problems.",
        },
      ],
    },
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
    en: {
      question: "Is the Fund's money safe? Does the government guarantee it?",
      answerBlocks: [
        {
          type: "p",
          text: "Under section 62 of the Act, if the Fund's money is insufficient, the Government of Nepal is responsible for continuing the schemes. The Fund's money is kept in class 'A' banks and invested within the limits of the Investment Procedure 2077.",
        },
      ],
    },
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
    en: {
      question: "Do contributors' children get scholarships?",
      answerBlocks: [
        {
          type: "p",
          text: "Yes. Talented children of contributors with at least 24 months of contributions can receive a scholarship for bachelor-level study — the actual fees or Rs. 500,000, whichever is lower (Scholarship Procedure 2079). A notice is published every year.",
        },
      ],
    },
  },
  {
    slug: "birami-bida-rakam",
    question: "लामो बिरामी हुँदा SSF बाट तलब पाइन्छ?",
    answerBlocks: [{ type: "p", text: "पाइन्छ। रोजगारदाताको वार्षिक १२ दिन बिरामी बिदाभन्दा लामो अवधि अस्पताल भर्ना वा चिकित्सकको सिफारिसमा घरमै उपचार गराउँदा आधारभूत पारिश्रमिकको ६०% रकम पाइन्छ — वार्षिक बढीमा १३ हप्तासम्म (कार्यविधि २०७५, दफा ७)।" }],
    categorySlug: "medical-maternity-accident-dependent",
    userCategories: ["employee"],
    popular: false,
    sourceKeys: ["procedure-2075-5th"],
    lastVerified: "2026-07-11",
    en: {
      question: "Do you get paid by SSF during a long illness?",
      answerBlocks: [
        {
          type: "p",
          text: "Yes. For hospital admission longer than the employer's 12 days of annual sick leave, or home treatment on a doctor's recommendation, you receive 60% of your basic salary — for up to 13 weeks per year (Procedure 2075, section 7).",
        },
      ],
    },
  },
  {
    slug: "ghatak-rog-suvidha",
    question: "घातक रोग (क्यान्सर, मृगौला) को उपचारमा कति पाइन्छ?",
    answerBlocks: [{ type: "list", items: [
      "सेवा अवधिभर जम्मा रु. १० लाखसम्म — क्यान्सर, मृगौला रोग, हृदय शल्यक्रिया, मस्तिष्कघात, पार्किन्सन्स, अल्जाइमर्स, spinal/head injury, थालासेमिया आदि",
      "योग्यता: पछिल्ला २८ महिनामा कम्तीमा २४ महिना नियमित योगदान",
      "रोग पहिचान खर्च रु. १ लाखसम्म; मेडिकल बोर्डको सिफारिसमा विदेशी अस्पताल रु. ७ लाखसम्म; डिस्चार्जपछिको पुनः परीक्षण रु. २ लाखसम्म",
    ]}],
    categorySlug: "medical-maternity-accident-dependent",
    userCategories: ["contributor", "family"],
    popular: false,
    sourceKeys: ["procedure-2075-5th"],
    lastVerified: "2026-07-11",
    en: {
      question: "How much is covered for critical illness (cancer, kidney) treatment?",
      answerBlocks: [
        {
          type: "list",
          items: [
            "Up to Rs. 1,000,000 in total over the service period — cancer, kidney disease, heart surgery, stroke, Parkinson's, Alzheimer's, spinal/head injury, thalassemia, etc.",
            "Eligibility: at least 24 months of regular contributions within the last 28",
            "Diagnosis costs up to Rs. 100,000; foreign hospital up to Rs. 700,000 on Medical Board recommendation; post-discharge follow-up tests up to Rs. 200,000",
          ],
        },
      ],
    },
  },
  {
    slug: "ashaktata-pratishat",
    question: "अशक्तता प्रतिशत कसले र कसरी तोक्छ?",
    answerBlocks: [{ type: "p", text: "स्वास्थ्य परीक्षण समितिले किटान गर्छ। निवृत्तभरण = आधारभूत पारिश्रमिकको ६०% × अशक्तता %, आजीवन र मुद्रास्फीति समायोजनसहित। २०% वा कम अशक्तता भए एकमुष्ट भुक्तानी हुनसक्छ। प्रत्येक ५ वर्षमा पुनरावलोकन हुन्छ — अन्तिम ५८ वर्षको उमेरमा।" }],
    categorySlug: "medical-maternity-accident-dependent",
    userCategories: ["contributor"],
    popular: false,
    sourceKeys: ["procedure-2075-5th"],
    lastVerified: "2026-07-11",
    en: {
      question: "Who determines the disability percentage, and how?",
      answerBlocks: [
        {
          type: "p",
          text: "The Health Examination Committee determines it. Pension = 60% of basic salary × disability %, for life and inflation-adjusted. If disability is 20% or less, a lump-sum payment may be made. It is reviewed every 5 years — the last review at age 58.",
        },
      ],
    },
  },
  {
    slug: "durghatana-7-din",
    question: "काममा दुर्घटना भयो — पहिलो काम के गर्ने?",
    answerBlocks: [{ type: "p", text: "७ दिनभित्र कोषलाई जानकारी गराउनुहोस् (रोजगारदाता, योगदानकर्ता वा परिवारले; message/email बाट पनि हुन्छ)। रोजगारीजन्य दुर्घटनाको पूरै उपचार खर्च कोषले व्यहोर्छ — तर जानकारी नगराई सम्झौता नभएको अस्पतालमा उपचार गराए रु. ७ लाखभन्दा बढी कोषले तिर्दैन।" }],
    categorySlug: "claims-problems-solutions",
    userCategories: ["employee", "employer"],
    popular: false,
    sourceKeys: ["procedure-2075-5th"],
    lastVerified: "2026-07-11",
    en: {
      question: "Had an accident at work — what's the first thing to do?",
      answerBlocks: [
        {
          type: "p",
          text: "Inform the Fund within 7 days (by the employer, contributor, or family; message/email works too). The Fund covers the full treatment cost of a workplace accident — but if treated at a non-contracted hospital without informing the Fund, it will not pay more than Rs. 700,000.",
        },
      ],
    },
  },
  {
    slug: "employer-le-suchikaran-nagare",
    question: "रोजगारदाताले सूचीकरण गरिदिएन भने कर्मचारी आफैँले गर्न सक्छ?",
    answerBlocks: [{ type: "p", text: "सक्छ। रोजगारदाताले नगराए श्रमिक आफैँले कोषमा निवेदन दिन सक्छ — कोषले जाँचबुझ गरी १५ दिनभित्र सूचीकरण गराउन रोजगारदातालाई आदेश दिन्छ (सूचीकरण कार्यविधि २०७५, दफा ५)।" }],
    categorySlug: "karmachari-ra-rojgardata",
    userCategories: ["employee"],
    popular: false,
    sourceKeys: ["listing-procedure-2075"],
    lastVerified: "2026-07-11",
    en: {
      question: "If the employer doesn't register you, can you do it yourself?",
      answerBlocks: [
        {
          type: "p",
          text: "Yes. If the employer fails to register you, the worker can apply to the Fund directly — the Fund investigates and orders the employer to complete the registration within 15 days (Listing Procedure 2075, section 5).",
        },
      ],
    },
  },
  {
    slug: "bidesh-bata-farkiepachhi",
    question: "विदेशबाट नेपाल फर्किएपछि SSF मा के गर्ने?",
    answerBlocks: [{ type: "p", text: "SSN उही रहन्छ। जागिरमा गए नयाँ रोजगारदाताले त्यही SSN मा योगदान गर्छ; व्यवसाय गरे स्वरोजगार योजनामा सर्नुहोस्; निवृत्तभरण योजनाको रकम एकमुष्ट लिने वा ÷१६० को आजीवन मासिक pension रोज्ने विकल्प पनि छ। KYC अद्यावधिक गर्न नबिर्सनुहोस्।" }],
    categorySlug: "baideshik-rojgari",
    userCategories: ["foreign"],
    popular: false,
    videoIds: ["DOaX_27N-ks"],
    sourceKeys: ["foreign-procedure-2079"],
    lastVerified: "2026-07-11",
    en: {
      question: "What to do with SSF after returning to Nepal from abroad?",
      answerBlocks: [
        {
          type: "p",
          text: "Your SSN stays the same. If you take a job, the new employer contributes to that SSN; if you start a business, switch to the self-employed scheme; you also have the option of taking your Pension Scheme amount as a lump sum or a lifelong monthly pension of ÷160. Don't forget to update your KYC.",
        },
      ],
    },
  },
  {
    slug: "60-pachhi-kaam",
    question: "६० वर्षपछि पनि काम गरिरहे योगदानको के हुन्छ?",
    answerBlocks: [{ type: "p", text: "श्रम सम्बन्ध कायम रहे योजना निरन्तर राख्न सकिन्छ — ६० वर्षपछिको नयाँ योगदान अवकाश सुविधा योजनामा जम्मा हुन्छ (दफा २४ङ)। निवृत्तभरण लिइरहेकाले मासिक pension को १% तिरेर आजीवन औषधि उपचार सुविधा पनि जारी राख्न सक्छन्।" }],
    categorySlug: "pension-ra-retirement",
    userCategories: ["contributor"],
    popular: false,
    sourceKeys: ["procedure-2075-5th"],
    lastVerified: "2026-07-11",
    en: {
      question: "What happens to contributions if you keep working after 60?",
      answerBlocks: [
        {
          type: "p",
          text: "If the employment relationship continues, the scheme can continue — new contributions after 60 go into the Retirement Benefit Scheme (section 24e). Pension recipients can also keep lifelong medical treatment coverage by paying 1% of their monthly pension.",
        },
      ],
    },
  },
  {
    slug: "bideshi-nagarik",
    question: "विदेशी नागरिक कर्मचारीको SSF रकमको के हुन्छ?",
    answerBlocks: [{ type: "p", text: "रोजगार सम्बन्ध सकिएपछि वृद्ध अवस्था योजनाको सम्पूर्ण रकम एकमुष्ट फिर्ता लैजान पाउँछन् (दफा २४क)। नेपाली नागरिकता त्यागेकालाई पनि सोही व्यवस्था लागू हुन्छ।" }],
    categorySlug: "karmachari-ra-rojgardata",
    userCategories: ["employer", "employee"],
    popular: false,
    sourceKeys: ["procedure-2075-5th"],
    lastVerified: "2026-07-11",
    en: {
      question: "What happens to a foreign national employee's SSF money?",
      answerBlocks: [
        {
          type: "p",
          text: "Once the employment relationship ends, they can take the entire old-age scheme amount back as a lump sum (section 24a). The same provision applies to those who have renounced Nepali citizenship.",
        },
      ],
    },
  },
  {
    slug: "dui-rojgardata",
    question: "एकैपटक दुई रोजगारदातामा काम गर्दा SSF कसरी मिलाउने?",
    answerBlocks: [{ type: "p", text: "एउटै SSN (PSSID) मा दुवै रोजगारदाता जोडिन सक्छन् — 'विभिन्न रोजगारदातामा PSSID थप गर्ने निवेदन' फारम भरेर। दुवैले आ-आफ्नो तलबको ३१% योगदान गर्छन्; रकम एउटै खातामा जम्मा हुन्छ। फारम हाम्रो Downloads page मा छ।" }],
    categorySlug: "kyc-profile-nominee",
    userCategories: ["employee"],
    popular: false,
    sourceKeys: ["listing-procedure-2075"],
    lastVerified: "2026-07-11",
    en: {
      question: "How to manage SSF while working for two employers at once?",
      answerBlocks: [
        {
          type: "p",
          text: "Both employers can be linked to the same SSN (PSSID) — by filling out the 'Application to add PSSID under multiple employers' form. Both contribute 31% of their respective salaries; the money accumulates in one account. The form is on our Downloads page.",
        },
      ],
    },
  },
  {
    slug: "talab-nabhaeko-mahina",
    question: "तलब नपाएको महिनाको योगदान कसले तिर्छ?",
    answerBlocks: [{ type: "p", text: "श्रमिकले पारिश्रमिक नपाउने अवस्था आए बढीमा ३ महिनासम्म निजको तर्फको योगदान रोजगारदाताले जम्मा गरिदिनुपर्छ — पछि श्रमिकको पारिश्रमिक/सुविधाबाट कट्टा गर्न सकिन्छ, तर मासिक ३३% भन्दा बढी होइन (ऐन दफा ८, नियमावली नियम ७)।" }],
    categorySlug: "yogdan-ra-badfad",
    userCategories: ["employee", "employer"],
    popular: false,
    sourceKeys: ["act-2074", "regulation-2075"],
    lastVerified: "2026-07-11",
    en: {
      question: "Who pays the contribution for a month the worker isn't paid?",
      answerBlocks: [
        {
          type: "p",
          text: "If the worker goes unpaid, the employer must deposit the worker's share of the contribution for up to 3 months — it can later be deducted from the worker's pay/benefits, but not more than 33% per month (Act section 8, Regulation rule 7).",
        },
      ],
    },
  },
  {
    slug: "swarojgar-adhar-parivartan",
    question: "स्वरोजगारले रोजेको आधार रकम पछि फेर्न मिल्छ?",
    answerBlocks: [{ type: "p", text: "मिल्छ — आधार न्यूनतम पारिश्रमिकदेखि ३ गुणासम्मको दायराभित्र रहनुपर्छ। आम्दानी बढ्दा आधार बढाए pension कोष पनि तीव्र बढ्छ; घटाउनु परे पनि योगदान नियमित राख्नुहोस्, नत्र उपचार सुविधा रोकिन्छ।" }],
    categorySlug: "karmachari-ra-rojgardata",
    userCategories: ["selfEmployed"],
    popular: false,
    relatedArticleSlug: "self-employed-guide",
    sourceKeys: ["informal-procedure-2079"],
    lastVerified: "2026-07-11",
    en: {
      question: "Can the self-employed change their chosen base amount later?",
      answerBlocks: [
        {
          type: "p",
          text: "Yes — the base must stay within the range of the minimum wage up to 3 times that. Raising the base as your income grows makes your pension fund grow faster; even if you have to lower it, keep contributing regularly, otherwise the treatment benefit stops.",
        },
      ],
    },
  },
  {
    slug: "yogdan-badhaune-swechchhik",
    question: "तोकिएभन्दा बढी रकम स्वेच्छाले जम्मा गर्न मिल्छ?",
    answerBlocks: [{ type: "p", text: "मिल्छ — कोषलाई अग्रिम जानकारी दिई थप रकम स्वेच्छाले योगदान गर्न सकिन्छ; त्यो अवकाश सुविधा योजनामा जम्मा हुन्छ र चाहे pension योजनामा सारेर मासिक pension बढाउन पनि सकिन्छ (दफा २३, २३क)।" }],
    categorySlug: "pension-ra-retirement",
    userCategories: ["contributor"],
    popular: false,
    sourceKeys: ["procedure-2075-5th"],
    lastVerified: "2026-07-11",
    en: {
      question: "Can you voluntarily deposit more than the prescribed amount?",
      answerBlocks: [
        {
          type: "p",
          text: "Yes — with advance notice to the Fund you can voluntarily contribute extra; it goes into the Retirement Benefit Scheme, and if you wish you can move it into the Pension Scheme to increase your monthly pension (sections 23, 23a).",
        },
      ],
    },
  },
];

export function faqBySlug(slug: string): FaqItem | undefined {
  return faqs.find((f) => f.slug === slug);
}

export const popularFaqs = faqs.filter((f) => f.popular);
