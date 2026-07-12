import type { ContentBlock } from "./types";

/**
 * SSF news & blog — original, SEO-focused articles that keep the site fresh.
 * Nepali is primary; `en` is added progressively (fallback notice otherwise),
 * mirroring the guide/FAQ pattern. Reuses ContentBlock so ContentBlocks renders it.
 */

export interface BlogSection {
  heading: string;
  blocks: ContentBlock[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  emoji: string;
  category: string; // "समाचार" | "गाइड" | "तुलना" | "हिसाब"
  tags: string[];
  publishDate: string; // ISO
  updatedDate?: string;
  readingMinutes: number;
  sections: BlogSection[];
  relatedCalculatorHref?: string;
  relatedArticleSlug?: string;
  en?: {
    title: string;
    excerpt: string;
    sections: BlogSection[];
  };
}

export const blogPosts: BlogPost[] = [
  {
    slug: "ssf-update-2082-83",
    title: "SSF मा पछिल्ला परिवर्तन (२०८२/८३): न्यूनतम ज्याला, कर र योगदान दर",
    excerpt:
      "आर्थिक वर्ष २०८२/८३ मा न्यूनतम पारिश्रमिक रु. १९,५५० पुग्यो, आयकर स्ल्याब फेरियो र वैदेशिक योगदान करिब रु. २,५९६ मासिक भयो — SSF योगदानकर्तालाई असर पार्ने सबै अपडेट एकै ठाउँमा।",
    emoji: "📢",
    category: "समाचार",
    tags: ["समाचार", "योगदान", "कर", "न्यूनतम ज्याला"],
    publishDate: "2026-07-05",
    readingMinutes: 6,
    relatedCalculatorHref: "/calculators/contribution",
    sections: [
      {
        heading: "न्यूनतम पारिश्रमिक रु. १९,५५०",
        blocks: [
          {
            type: "p",
            text: "आर्थिक वर्ष २०८२/८३ (श्रावण १, २०८२ देखि लागू) मा नेपाल सरकारले न्यूनतम मासिक पारिश्रमिक रु. १९,५५० तोकेको छ — जसमा आधारभूत पारिश्रमिक रु. १२,१७० र महँगी भत्ता रु. ७,३८० छ।",
          },
          {
            type: "note",
            text: "SSF को योगदान आधारभूत पारिश्रमिक (रु. १२,१७०) मा लाग्छ, कुल ज्यालामा होइन — त्यसैले वैदेशिक रोजगारको न्यूनतम मासिक योगदान २१.३३% × १२,१७० ≈ रु. २,५९६ हुन्छ।",
          },
        ],
      },
      {
        heading: "आयकर स्ल्याब फेरियो (आ.व. २०८३/८४)",
        blocks: [
          {
            type: "p",
            text: "बजेट २०८३/८४ ले तलबदारका लागि ठूलो राहत ल्यायो: पहिलो १% को सीमा रु. ५ लाखबाट रु. १० लाख पुर्‍यायो, उच्च दर ३९% बाट २९% झार्‍यो, र एकल/दम्पती फरक हटाएर सबैलाई एउटै दर बनायो।",
          },
          {
            type: "table",
            headers: ["आम्दानी (वार्षिक)", "दर (२०८३/८४)"],
            rows: [
              ["रु. १० लाखसम्म", "१% (SSF भए छुट)"],
              ["रु. १०–१५ लाख", "१०%"],
              ["रु. १५–२५ लाख", "२०%"],
              ["रु. २५–४० लाख", "२७%"],
              ["रु. ४० लाखभन्दा माथि", "२९%"],
            ],
          },
          {
            type: "note",
            text: "SSF योगदानकर्तालाई पहिलो स्ल्याबको १% सामाजिक सुरक्षा कर छुट हुन्छ। यी दर आर्थिक ऐन २०८३ अधीनमा — आफ्नो कर हिसाब गर्न हाम्रो आयकर calculator प्रयोग गर्नुहोस्।",
          },
        ],
      },
      {
        heading: "योगदानकर्तालाई के अर्थ?",
        blocks: [
          {
            type: "list",
            items: [
              "औपचारिक क्षेत्रमा योगदान अझै आधारभूत तलबको ३१% (श्रमिक ११% + रोजगारदाता २०%)।",
              "अनौपचारिक क्षेत्रमा श्रमिकको ११% + सरकारको ९.३७% = २०.३७%।",
              "वैदेशिक रोजगारमा न्यूनतम मासिक करिब रु. २,५९६; ७–२४ महिना अग्रिम तिरे करिब रु. २,५०५/महिना।",
              "तलब बढे SSF योगदान र कर दुवै बढ्छ — तर SSF को अधिकांश भाग तपाईंकै बचत हो।",
            ],
          },
        ],
      },
    ],
    en: {
      title: "What Changed in SSF (FY 2082/83): Minimum Wage, Tax, and Contribution Rates",
      excerpt:
        "In FY 2082/83 the minimum wage reached Rs 19,550, the income-tax slabs changed, and the foreign-employment contribution became about Rs 2,596/month — every update that affects SSF contributors in one place.",
      sections: [
        {
          heading: "Minimum wage Rs 19,550",
          blocks: [
            {
              type: "p",
              text: "For FY 2082/83 (effective Shrawan 1, 2082), the Government of Nepal set the minimum monthly wage at Rs 19,550 — Rs 12,170 basic remuneration plus Rs 7,380 dearness allowance.",
            },
            {
              type: "note",
              text: "SSF contributions apply to the basic remuneration (Rs 12,170), not the total wage — so the minimum monthly foreign-employment contribution is 21.33% × 12,170 ≈ Rs 2,596.",
            },
          ],
        },
        {
          heading: "Income-tax slabs changed (FY 2083/84)",
          blocks: [
            {
              type: "p",
              text: "Budget 2083/84 brought big relief for the salaried: the 1% band rose from Rs 5 lakh to Rs 10 lakh, the top rate dropped from 39% to 29%, and the single/couple split was removed in favour of one unified schedule.",
            },
            {
              type: "table",
              headers: ["Income (annual)", "Rate (2083/84)"],
              rows: [
                ["Up to Rs 10 lakh", "1% (waived with SSF)"],
                ["Rs 10–15 lakh", "10%"],
                ["Rs 15–25 lakh", "20%"],
                ["Rs 25–40 lakh", "27%"],
                ["Above Rs 40 lakh", "29%"],
              ],
            },
            {
              type: "note",
              text: "SSF contributors get the 1% first-slab social security tax waived. These rates are subject to the Finance Act 2083 — use our income-tax calculator to estimate yours.",
            },
          ],
        },
        {
          heading: "What it means for contributors",
          blocks: [
            {
              type: "list",
              items: [
                "In the formal sector, the contribution is still 31% of basic salary (worker 11% + employer 20%).",
                "In the informal sector, worker 11% + government 9.37% = 20.37%.",
                "In foreign employment, the minimum is about Rs 2,596/month; paying 7–24 months in advance works out to about Rs 2,505/month.",
                "Higher salary means more SSF and more tax — but most of the SSF amount is your own savings.",
              ],
            },
          ],
        },
      ],
    },
  },

  {
    slug: "talab-anusar-ssf-kati-katinchha",
    title: "तलब अनुसार SSF मा कति कट्टिन्छ? १० तलबको पूरा तालिका",
    excerpt:
      "रु. १५,००० देखि रु. १,००,००० सम्मको तलबमा श्रमिक, रोजगारदाता र कुल SSF योगदान कति हुन्छ — एकै नजरमा तालिका र हातमा आउने रकम।",
    emoji: "📊",
    category: "हिसाब",
    tags: ["योगदान", "तलब", "हिसाब"],
    publishDate: "2026-06-20",
    readingMinutes: 5,
    relatedCalculatorHref: "/calculators/take-home",
    sections: [
      {
        heading: "तलब अनुसार मासिक योगदान (३१%)",
        blocks: [
          {
            type: "p",
            text: "औपचारिक क्षेत्रमा आधारभूत तलबको ३१% SSF मा जान्छ — श्रमिकको ११% तलबबाट कट्टा हुन्छ, रोजगारदाताले २०% तलबभन्दा माथि थप्छ।",
          },
          {
            type: "table",
            headers: ["आधारभूत तलब", "श्रमिक ११%", "रोजगारदाता २०%", "कुल ३१%"],
            rows: [
              ["१५,०००", "१,६५०", "३,०००", "४,६५०"],
              ["२०,०००", "२,२००", "४,०००", "६,२००"],
              ["३०,०००", "३,३००", "६,०००", "९,३००"],
              ["४०,०००", "४,४००", "८,०००", "१२,४००"],
              ["५०,०००", "५,५००", "१०,०००", "१५,५००"],
              ["७५,०००", "८,२५०", "१५,०००", "२३,२५०"],
              ["१,००,०००", "११,०००", "२०,०००", "३१,०००"],
            ],
          },
          {
            type: "note",
            text: "श्रमिकको ११% मध्ये १०% त पहिल्यै सञ्चय कोषमा जाने रकम हो — नयाँ भार १% मात्र। रोजगारदाताको २०% तपाईंकै खातामा थपिन्छ।",
          },
        ],
      },
      {
        heading: "यो रकम कहाँ जान्छ?",
        blocks: [
          {
            type: "list",
            items: [
              "निवृत्तभरण (पेन्सन): २०% — ६० वर्षपछि आजीवन मासिक पेन्सन",
              "अवकाश/उपदान: ८.३३% — रोजगारी अन्त्यमा एकमुष्ट",
              "बीमा (उपचार + दुर्घटना + आश्रित): २.६७% — तत्काल सुरक्षा",
            ],
          },
          {
            type: "p",
            text: "अर्थात् ३१% मध्ये २८.३३% तपाईंकै वृद्धावस्था बचत हो, केवल २.६७% मात्र बीमा शुल्क। आफ्नो तलबको वास्तविक breakdown हेर्न sector explorer प्रयोग गर्नुहोस्।",
          },
        ],
      },
    ],
  },

  {
    slug: "ssf-pension-kati-aauchha",
    title: "SSF पेन्सन कति आउँछ? वास्तविक उदाहरणसहित हिसाब",
    excerpt:
      "६० वर्षमा कति मासिक पेन्सन आउँछ? ÷१६० सूत्र, १८० महिनाको सर्त र फरक-फरक तलब/अवधिका उदाहरणसहित सरल व्याख्या।",
    emoji: "👴",
    category: "गाइड",
    tags: ["पेन्सन", "निवृत्तभरण", "हिसाब"],
    publishDate: "2026-06-05",
    readingMinutes: 6,
    relatedCalculatorHref: "/calculators/financial-planner",
    relatedArticleSlug: "pension-ra-retirement-guide",
    sections: [
      {
        heading: "पेन्सनको सूत्र",
        blocks: [
          {
            type: "p",
            text: "मासिक पेन्सन = (निवृत्तभरण खातामा जम्मा रकम + लगानी प्रतिफल) ÷ १६०। यो रकम ६० वर्ष उमेर पुगेपछि जीवनभर पाइन्छ। योग्यताका लागि कम्तीमा १८० महिना (१५ वर्ष) योगदान चाहिन्छ।",
          },
          {
            type: "table",
            headers: ["पेन्सन खातामा जम्मा (प्रतिफलसहित)", "मासिक पेन्सन (÷१६०)"],
            rows: [
              ["रु. ८ लाख", "रु. ५,०००"],
              ["रु. १६ लाख", "रु. १०,०००"],
              ["रु. ३२ लाख", "रु. २०,०००"],
              ["रु. ४८ लाख", "रु. ३०,०००"],
            ],
          },
        ],
      },
      {
        heading: "जति लामो, त्यति ठूलो",
        blocks: [
          {
            type: "p",
            text: "पेन्सन कोष compounding ले बढ्छ — जति लामो अवधि र जति ठूलो तलबमा योगदान गर्नुभयो, पेन्सन त्यति नै ठूलो। ढिलो सुरु गरे १८० महिनाको योग्यता टाढिन्छ, त्यसैले सकेसम्म चाँडो सुरु गर्नु फाइदाजनक।",
          },
          {
            type: "note",
            text: "आफ्नो तलब, उमेर र प्रतिफल दर राखेर ६० वर्षमा कति पेन्सन आउँछ हेर्न SSF Financial Planner प्रयोग गर्नुहोस् — यो प्रारम्भिक अनुमान हो, अन्तिम रकम SSF ले तोक्छ।",
          },
        ],
      },
    ],
    en: {
      title: "How Much SSF Pension Will You Get? With Real Examples",
      excerpt:
        "How much monthly pension at 60? A simple explanation of the ÷160 formula, the 180-month rule, and examples across different salaries and durations.",
      sections: [
        {
          heading: "The pension formula",
          blocks: [
            {
              type: "p",
              text: "Monthly pension = (pension-account balance + investment returns) ÷ 160. It is paid for life once you reach 60. Eligibility needs at least 180 months (15 years) of contribution.",
            },
            {
              type: "table",
              headers: ["Pension balance (with returns)", "Monthly pension (÷160)"],
              rows: [
                ["Rs 800,000", "Rs 5,000"],
                ["Rs 1,600,000", "Rs 10,000"],
                ["Rs 3,200,000", "Rs 20,000"],
                ["Rs 4,800,000", "Rs 30,000"],
              ],
            },
          ],
        },
        {
          heading: "The longer, the larger",
          blocks: [
            {
              type: "p",
              text: "The pension fund grows through compounding — the longer you contribute and the higher your salary, the bigger the pension. Starting late pushes the 180-month eligibility further away, so starting early pays off.",
            },
            {
              type: "note",
              text: "Enter your salary, age, and return rate in the SSF Financial Planner to see your pension at 60 — a preliminary estimate; the final figure is set by SSF.",
            },
          ],
        },
      ],
    },
  },

  {
    slug: "ssf-vs-sanchaya-kosh-cit",
    title: "SSF vs सञ्चय कोष / CIT: तलबदारका लागि कुन राम्रो?",
    excerpt:
      "कर्मचारी सञ्चय कोष (EPF), नागरिक लगानी कोष (CIT) र SSF — तीनवटैको उद्देश्य, सुरक्षा र फाइदा फरक। कुन अवस्थामा कुन उपयोगी, निष्पक्ष तुलना।",
    emoji: "⚖️",
    category: "तुलना",
    tags: ["तुलना", "सञ्चय कोष", "CIT", "पेन्सन"],
    publishDate: "2026-05-18",
    readingMinutes: 7,
    sections: [
      {
        heading: "तीनवटा फरक-फरक चीज",
        blocks: [
          {
            type: "list",
            items: [
              "सञ्चय कोष (EPF): मुख्यतः बचत — रोजगारी अन्त्यमा एकमुष्ट फिर्ता।",
              "CIT (नागरिक लगानी कोष): स्वेच्छिक बचत/लगानी योजना, कर छुटसहित।",
              "SSF: बचतसँगै बीमा — उपचार, दुर्घटना, आश्रित परिवार र आजीवन पेन्सनसमेत।",
            ],
          },
          {
            type: "p",
            text: "SSF को खास बल भनेको यो केवल बचत होइन — बिरामी, दुर्घटना, मृत्यु र वृद्धावस्था सबैलाई समेट्ने एकीकृत सुरक्षा हो।",
          },
        ],
      },
      {
        heading: "मुख्य फरक",
        blocks: [
          {
            type: "table",
            headers: ["विषय", "सञ्चय कोष/CIT", "SSF"],
            rows: [
              ["मुख्य उद्देश्य", "बचत/लगानी", "बचत + बीमा सुरक्षा"],
              ["उपचार/दुर्घटना", "छैन", "छ"],
              ["आजीवन पेन्सन", "सामान्यतः एकमुष्ट", "मासिक पेन्सन विकल्प"],
              ["आश्रित परिवार सुरक्षा", "सीमित", "छ (मृत्युपछि पनि)"],
              ["कर छुट", "छ", "छ (१% SST समेत छुट)"],
            ],
          },
        ],
      },
      {
        heading: "कुन रोज्ने?",
        blocks: [
          {
            type: "p",
            text: "औपचारिक रोजगारीमा हुनुहुन्छ भने SSF प्रायः अनिवार्य र सबैभन्दा व्यापक हुन्छ। थप बचत/कर योजना चाहिए CIT जोड्न सकिन्छ। SSF लाई केवल 'अर्को कट्टी' नठानी 'दायित्व-स्थानान्तरण + आजीवन सुरक्षा' का रूपमा हेर्नु उपयुक्त।",
          },
        ],
      },
    ],
  },

  {
    slug: "bidesh-jane-agadi-ssf",
    title: "विदेश जानुअघि SSF: के गर्ने, कति तिर्ने (२०८२)",
    excerpt:
      "वैदेशिक रोजगारमा जानेहरूका लागि SSF सूचीकरण, मासिक करिब रु. २,५९६ योगदान, अग्रिम भुक्तानी छुट र परिवारलाई नेपालमै मिल्ने सुविधाको पूरा जानकारी।",
    emoji: "✈️",
    category: "गाइड",
    tags: ["वैदेशिक रोजगार", "योगदान", "गाइड"],
    publishDate: "2026-05-02",
    readingMinutes: 6,
    relatedCalculatorHref: "/calculators/foreign-employment",
    relatedArticleSlug: "foreign-employment-guide",
    sections: [
      {
        heading: "सूचीकरण र योगदान",
        blocks: [
          {
            type: "steps",
            items: [
              "श्रम स्वीकृति लिँदा नै SSF सूचीकरण हुन्छ — ID/password सुरक्षित राख्नुहोस्।",
              "विदेशबाट SOSYS वा mobile app मार्फत online योगदान गर्न सकिन्छ।",
              "KYC verification पूरा गर्नुहोस् — नगरे दाबीमा समस्या आउँछ।",
              "बैंक वा डिजिटल माध्यमबाट मासिक/त्रैमासिक योगदान जम्मा गर्नुहोस्।",
            ],
          },
          {
            type: "note",
            text: "हाल न्यूनतम मासिक योगदान करिब रु. २,५९६ (औद्योगिक न्यूनतमको २१.३३%); ७–२४ महिनाको अग्रिम तिर्दा करिब रु. २,५०५/महिना पर्छ।",
          },
        ],
      },
      {
        heading: "परिवारलाई नेपालमै फाइदा",
        blocks: [
          {
            type: "list",
            items: [
              "योगदानकर्ता, पति/पत्नी र १८ वर्षसम्मका छोराछोरीलाई नेपालमा उपचार सुविधा।",
              "दुर्घटना उपचार रु. ७ लाखसम्म; आश्रित परिवार सुरक्षा।",
              "फर्किएपछि निवृत्तभरण एकमुष्ट वा ÷१६० को आजीवन पेन्सन रोज्न पाइने।",
            ],
          },
        ],
      },
    ],
  },

  {
    slug: "ssf-ma-judane-7-fayada",
    title: "SSF मा जोडिनुका ७ फाइदा जुन धेरैलाई थाहा छैन",
    excerpt:
      "पेन्सनमात्र होइन — उपचार, मातृत्व, दुर्घटना, आजीवन औषधि, सापटी र आश्रित परिवार सुरक्षा। SSF का लुकेका ७ फाइदा एकै ठाउँमा।",
    emoji: "✨",
    category: "गाइड",
    tags: ["फाइदा", "सुविधा", "गाइड"],
    publishDate: "2026-04-15",
    readingMinutes: 5,
    relatedArticleSlug: "ssf-bhaneko-ke-ho",
    sections: [
      {
        heading: "७ फाइदा",
        blocks: [
          {
            type: "list",
            items: [
              "१. आजीवन पेन्सन — ६० वर्षपछि हरेक महिना, मुद्रास्फीति समायोजनसहित।",
              "२. औषधि उपचार — OPD वार्षिक रु. २५ हजार, भर्ना रु. १ लाखसम्म (८०% कोष)।",
              "३. मातृत्व सुविधा — प्रति शिशु न्यूनतम पारिश्रमिक + ६०% प्रसूति बिदा रकम।",
              "४. दुर्घटना/अशक्तता — रु. ७ लाखसम्म उपचार + अशक्तता पेन्सन।",
              "५. आश्रित परिवार — मृत्युपछि पति/पत्नीलाई आजीवन, छोराछोरीलाई शिक्षा।",
              "६. सापटी — ३६ महिनापछि घर, शिक्षा र धितो नचाहिने विशेष सापटी।",
              "७. छात्रवृत्ति — योग्य सन्ततिलाई स्नातकसम्म रु. ५ लाखसम्म।",
            ],
          },
        ],
      },
      {
        heading: "किन महत्त्वपूर्ण?",
        blocks: [
          {
            type: "p",
            text: "धेरैले SSF लाई 'तलबबाट कट्टी' मात्र देख्छन्, तर वास्तवमा यो श्रम ऐनका PF, उपदान, उपचार र क्षतिपूर्ति सबै दायित्वलाई एउटै छातामुनि ल्याउने आजीवन सुरक्षा हो। सानो योगदान आज, ठूलो सुरक्षा भोलि।",
          },
        ],
      },
    ],
  },

  {
    slug: "aayakar-budget-2083-84-talabdar",
    title: "आयकर बजेट २०८३/८४: तलबदारलाई के फाइदा?",
    excerpt:
      "पहिलो १% को सीमा रु. १० लाख, उच्च दर २९%, एकल/दम्पती एकीकृत — नयाँ बजेटले तलबदारलाई कति राहत दियो, उदाहरणसहित।",
    emoji: "🧾",
    category: "समाचार",
    tags: ["कर", "बजेट", "समाचार"],
    publishDate: "2026-06-15",
    readingMinutes: 5,
    relatedCalculatorHref: "/calculators/income-tax",
    sections: [
      {
        heading: "मुख्य परिवर्तन",
        blocks: [
          {
            type: "list",
            items: [
              "कर नलाग्ने/१% को सीमा रु. ५ लाखबाट रु. १० लाख पुग्यो।",
              "उच्चतम दर ३९% बाट २९% मा झर्‍यो।",
              "एकल र दम्पतीको फरक हट्यो — सबैलाई एउटै दर।",
              "SSF योगदानकर्तालाई पहिलो स्ल्याबको १% सामाजिक सुरक्षा कर छुट कायमै।",
            ],
          },
        ],
      },
      {
        heading: "उदाहरण",
        blocks: [
          {
            type: "p",
            text: "मानौं वार्षिक आम्दानी रु. १० लाख छ र तपाईं SSF योगदानकर्ता हुनुहुन्छ — २०८३/८४ मा तपाईंको आयकर शून्य हुन्छ, किनभने रु. १० लाखसम्म १% मात्र लाग्थ्यो र त्यो पनि SSF ले छुट गराउँछ।",
          },
          {
            type: "note",
            text: "यी दर आर्थिक ऐन २०८३ अधीनमा। आफ्नो तलब र वर्ष राखेर ठ्याक्कै कर हिसाब गर्न आयकर calculator प्रयोग गर्नुहोस्।",
          },
        ],
      },
    ],
  },

  {
    slug: "ssf-yogdan-nabujhae-ke-huncha",
    title: "SSF योगदान नबुझाए के हुन्छ? रोजगारदाता र श्रमिकका लागि",
    excerpt:
      "रोजगारदाताले समयमा योगदान नबुझाए १०% ब्याज, खाता रोक्का र राहदानीसम्मको कारबाही। श्रमिकले के गर्न सक्छन्, पूरा जानकारी।",
    emoji: "⚠️",
    category: "गाइड",
    tags: ["योगदान", "रोजगारदाता", "समस्या"],
    publishDate: "2026-03-28",
    readingMinutes: 5,
    relatedArticleSlug: "employer-monthly-compliance",
    sections: [
      {
        heading: "रोजगारदातालाई परिणाम",
        blocks: [
          {
            type: "list",
            items: [
              "प्रत्येक महिना २५ दिनभित्र नबुझाए बाँकी रकममा १०% ब्याज।",
              "सूचीकरण/योगदान नै नगरे बैंक खाता र सम्पत्ति रोक्का, इजाजत निलम्बन, राहदानीसम्म रोक्का (ऐन दफा ९)।",
              "नबुझाएको अवधिमा कर्मचारीको दुर्घटना/मृत्यु भए सुविधा बराबरको पूरै रकम रोजगारदाता स्वयंले तिर्नुपर्ने।",
            ],
          },
        ],
      },
      {
        heading: "श्रमिकले के गर्ने?",
        blocks: [
          {
            type: "steps",
            items: [
              "SOSYS मा login गरी आफ्नो contribution history जाँच्नुहोस्।",
              "रोजगारदातालाई payslip र भौचर देखाउन भन्नुहोस्।",
              "जम्मा नगरेको देखिए प्रमाणसहित कोषमा उजुरी दिनुहोस्।",
              "रोजगारदाताले सूचीकरण नगरे श्रमिक आफैँ आवेदन दिन सक्छन्।",
            ],
          },
        ],
      },
    ],
  },

  {
    slug: "anaupacharik-kshetra-ssf-11-pratishat",
    title: "अनौपचारिक क्षेत्रका लागि SSF: ११% मा पूरा सुरक्षा",
    excerpt:
      "कृषि, घरेलु काम, ज्याला-मजदुरी गर्नेले न्यूनतम पारिश्रमिकको ११% मात्र तिरे पुग्छ — सरकारले ९.३७% थपिदिन्छ। नेपालको सबैभन्दा सस्तो सामाजिक सुरक्षा।",
    emoji: "🧑‍🌾",
    category: "गाइड",
    tags: ["अनौपचारिक", "योगदान", "गाइड"],
    publishDate: "2026-03-10",
    readingMinutes: 5,
    relatedArticleSlug: "informal-sector-guide",
    relatedCalculatorHref: "/sector/informal",
    sections: [
      {
        heading: "तपाईं ११%, सरकार ९.३७%",
        blocks: [
          {
            type: "p",
            text: "अनौपचारिक क्षेत्रका श्रमिकले न्यूनतम आधारभूत पारिश्रमिकको ११% मात्र तिरे पुग्छ; नेपाल सरकारले ९.३७% थपिदिन्छ (कुल २०.३७%)। यसले उपचार, दुर्घटना, आश्रित परिवार र वृद्धावस्था पेन्सन सबै समेट्छ।",
          },
          {
            type: "note",
            text: "सरकारले ९.३७% जम्मा नगरे वा कम गरे श्रमिक आफैँले बाँकी थपेर पनि सहभागी हुन सकिन्छ (कार्यविधि २०७९)।",
          },
        ],
      },
      {
        heading: "कसरी जोडिने?",
        blocks: [
          {
            type: "steps",
            items: [
              "नागरिकता/राष्ट्रिय परिचयपत्र र फोटो तयार पार्नुहोस्।",
              "sosys.ssf.gov.np वा नजिकको श्रम कार्यालयमार्फत आवेदन दिनुहोस्।",
              "३५ दिनभित्र ११ अङ्कको SSN सहितको परिचयपत्र पाउनुहुन्छ।",
              "बैंक/wallet बाट मासिक योगदान जम्मा गर्नुहोस्।",
            ],
          },
        ],
      },
    ],
  },

  {
    slug: "ssf-kyc-kasari-garne-2082",
    title: "SSF KYC कसरी गर्ने: Step-by-step (२०८२)",
    excerpt:
      "KYC नभई सुविधा दाबी रोकिन्छ। कुन कागजात चाहिन्छ, SOSYS मा कसरी गर्ने र सामान्य गल्ती कसरी जोगिने — पूरा गाइड।",
    emoji: "🪪",
    category: "गाइड",
    tags: ["KYC", "गाइड", "SOSYS"],
    publishDate: "2026-02-20",
    readingMinutes: 5,
    relatedArticleSlug: "kyc-profile-claim-guide",
    relatedCalculatorHref: "/services/kyc-verification",
    sections: [
      {
        heading: "चाहिने कागजात",
        blocks: [
          {
            type: "list",
            items: [
              "नागरिकता वा राहदानी (वैदेशिक रोजगारमा राहदानी + श्रम स्वीकृति)।",
              "हालसालैको स्पष्ट फोटो।",
              "बैंक खाता विवरण (भुक्तानीका लागि)।",
              "मोबाइल नम्बर, इमेल र पेशा/रोजगारी विवरण।",
            ],
          },
        ],
      },
      {
        heading: "SOSYS मा प्रक्रिया",
        blocks: [
          {
            type: "steps",
            items: [
              "SOSYS वा SSF mobile app मा login गर्नुहोस्।",
              "KYC section खोलेर विवरण भर्नुहोस् र कागजात अपलोड गर्नुहोस्।",
              "नागरिकता र प्रोफाइलको नाम/जन्ममिति मिलेको यकिन गर्नुहोस्।",
              "SSF ले verify गरेपछि KYC पूर्ण हुन्छ।",
            ],
          },
          {
            type: "note",
            text: "नाम/जन्ममिति नमिले पहिले Profile Correction गर्नुपर्छ, अनि मात्र KYC अगाडि बढ्छ। कागजातको फोटो अस्पष्ट भए अस्वीकृत हुन्छ।",
          },
        ],
      },
    ],
  },

  {
    slug: "swarojgar-freelancer-ssf",
    title: "स्वरोजगार / Freelancer ले SSF मा कति र कसरी जोड्ने?",
    excerpt:
      "पसल, व्यवसाय वा freelancing गर्नेले आफ्नो आधार आफैँ रोजेर ३१% योगदान गर्न सक्छन्। आधार कति रोज्ने, कति पेन्सन बन्छ — रणनीतिसहित।",
    emoji: "🛠️",
    category: "गाइड",
    tags: ["स्वरोजगार", "freelancer", "योगदान"],
    publishDate: "2026-01-30",
    readingMinutes: 6,
    relatedArticleSlug: "self-employed-guide",
    relatedCalculatorHref: "/sector/self-employed",
    sections: [
      {
        heading: "आधार आफैँ रोज्ने",
        blocks: [
          {
            type: "p",
            text: "स्वरोजगारमा रहेकाले न्यूनतम आधारभूत पारिश्रमिकदेखि त्यसको ३ गुणासम्मको आधार आफैँ रोजेर ३१% योगदान गर्न सक्छन्। जति ठूलो आधार, त्यति ठूलो पेन्सन कोष।",
          },
          {
            type: "table",
            headers: ["योजना", "बाँडफाँट"],
            rows: [
              ["औषधि/स्वास्थ्य/मातृत्व", "२.४%"],
              ["दुर्घटना/अशक्तता", "०.८%"],
              ["आश्रित परिवार", "१.८%"],
              ["वृद्ध अवस्था (पेन्सन न्यूनतम १६%)", "२६%"],
            ],
          },
        ],
      },
      {
        heading: "आधार कति रोज्ने? (रणनीति)",
        blocks: [
          {
            type: "list",
            items: [
              "व्यवसाय अस्थिर भए सानो आधारबाट सुरु गर्नुहोस् — पछि बढाउन मिल्छ।",
              "आम्दानी स्थिर भए ठूलो आधार (३ गुणा) रोजे ३ गुणा ठूलो पेन्सन।",
              "१८० महिना (१५ वर्ष) पुगे ६० वर्षदेखि आजीवन पेन्सन — चाँडो सुरु गर्नु फाइदा।",
              "SSN जीवनभर एउटै — जागिरबाट स्वरोजगार गए पुरानै नम्बर प्रयोग गर्नुहोस्।",
            ],
          },
        ],
      },
    ],
  },
];

export function blogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function sortedBlogPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) =>
    a.publishDate < b.publishDate ? 1 : -1,
  );
}
