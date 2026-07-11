import type { ArticleContent } from "./types";

const LAST_VERIFIED = "2026-07-11";

/** 8 cornerstone guides — product spec §5.3, figures from knowledge-base/verified-facts.md */
export const articles: ArticleContent[] = [
  // 1 ──────────────────────────────────────────────────────────────
  {
    slug: "ssf-bhaneko-ke-ho",
    categorySlug: "ssf-parichaya",
    title: "Social Security Fund (SSF) भनेको के हो?",
    shortAnswer:
      "सामाजिक सुरक्षा कोष (SSF) योगदानमा आधारित सामाजिक सुरक्षा ऐन, २०७४ बमोजिम स्थापित स्वशासित संस्था हो। श्रमिक र रोजगारदाताले मासिक योगदान गरेपछि औषधि उपचार, दुर्घटना, आश्रित परिवार र वृद्ध अवस्थाका चार योजनाबाट सुविधा पाइन्छ — मूल सिद्धान्त: योगदान नगरी सुविधा पाइँदैन।",
    isCornerstone: true,
    readingMinutes: 6,
    userCategories: ["employee", "employer", "contributor"],
    sections: [
      {
        kind: "MAIN",
        heading: "SSF को परिचय",
        blocks: [
          {
            type: "p",
            text: "सामाजिक सुरक्षा कोष (Social Security Fund) श्रम, रोजगार तथा सामाजिक सुरक्षा मन्त्रालय अन्तर्गत रहेको स्वशासित संस्था हो, जसको केन्द्रीय कार्यालय बबरमहल, काठमाडौंमा छ। योगदानमा आधारित सामाजिक सुरक्षा योजनाको औपचारिक शुभारम्भ २०७५ मंसिर ११ मा भयो र योजना कार्यान्वयन २०७६ साउन १ बाट सुरु भयो।",
          },
          {
            type: "p",
            text: "ऐनको दफा ३ ले स्पष्ट भन्छ — योगदान नगरी सामाजिक सुरक्षा प्राप्त हुँदैन। श्रमिक र रोजगारदाताले नियमित योगदान गरेपछि मात्र सुविधा सुरु हुन्छ।",
          },
        ],
      },
      {
        kind: "MAIN",
        heading: "चार मुख्य सुरक्षा योजना",
        blocks: [
          {
            type: "table",
            headers: ["योजना", "मुख्य सुविधा", "योग्यता अवधि"],
            rows: [
              [
                "औषधि उपचार, स्वास्थ्य तथा मातृत्व सुरक्षा",
                "उपचार खर्च, प्रसूति सेवा, बिरामी बिदा, घातक रोग उपचार",
                "पछिल्लो ६ महिनामा ३ महिना योगदान",
              ],
              [
                "दुर्घटना तथा अशक्तता सुरक्षा",
                "दुर्घटना उपचार, अशक्तता निवृत्तभरण",
                "योगदान सुरु भएदेखि नै (व्यवसायजन्य रोग: २ वर्ष)",
              ],
              [
                "आश्रित परिवार सुरक्षा",
                "पति/पत्नी निवृत्तभरण, सन्तति शैक्षिक वृत्ति, अन्तिम संस्कार खर्च",
                "रोजगारीजन्य मृत्यु: सुरुदेखि; अन्य मृत्यु: १२ महिना योगदान",
              ],
              [
                "वृद्ध अवस्था सुरक्षा",
                "आजीवन मासिक निवृत्तभरण र एकमुष्ट अवकाश सुविधा",
                "निवृत्तभरण: ६० वर्ष + १८० महिना योगदान",
              ],
            ],
          },
        ],
      },
      {
        kind: "MAIN",
        heading: "SSF किन आवश्यक छ?",
        blocks: [
          {
            type: "list",
            items: [
              "जीवनचक्रका जोखिम (रोग, दुर्घटना, अशक्तता, मृत्यु, वृद्धावस्था) को व्यवस्थापन",
              "रोजगारदाताका लागि सञ्चय कोष, उपदान, उपचार र क्षतिपूर्तिको दायित्व एकद्वार प्रणालीबाट",
              "अनौपचारिक क्षेत्र, स्वरोजगार र वैदेशिक रोजगारीसम्म सामाजिक संरक्षण विस्तार",
              "जागिर फेरिए पनि SSN (सामाजिक सुरक्षा नम्बर) जीवनभर उही रहन्छ",
            ],
          },
          {
            type: "note",
            text: "ऐनको दफा ६२: कोषको रकम अपर्याप्त भएमा योजनालाई निरन्तरता दिने दायित्व नेपाल सरकारको हुन्छ — योगदानकर्ताका लागि सबैभन्दा ठूलो सुरक्षा-प्रत्याभूति।",
          },
        ],
      },
    ],
    videoIds: ["fC2asy6ZVtM", "YlUKDSqCxT0"],
    relatedCalculatorHref: "/calculators/contribution",
    sourceKeys: ["act-2074", "procedure-2075-5th", "study-material-2083"],
    lastVerified: LAST_VERIFIED,
    en: {
      title: "What is the Social Security Fund (SSF)?",
      shortAnswer:
        "The Social Security Fund (SSF) is an autonomous body established under Nepal's Contribution Based Social Security Act, 2074. Once workers and employers make monthly contributions, contributors receive protection through four schemes — medical treatment, accident, dependent family, and old age. The core principle: no contribution, no benefit.",
      sections: [
        {
          kind: "MAIN",
          heading: "Introduction to SSF",
          blocks: [
            {
              type: "p",
              text: "The Social Security Fund is an autonomous institution under Nepal's Ministry of Labour, Employment and Social Security, headquartered in Babarmahal, Kathmandu. The contribution-based social security scheme was formally launched on 27 November 2018 (Mangsir 11, 2075), with implementation from Shrawan 1, 2076.",
            },
            {
              type: "p",
              text: "Section 3 of the Act is explicit — no one receives social security without contributing. Benefits begin only after regular contributions by the worker and employer.",
            },
          ],
        },
        {
          kind: "MAIN",
          heading: "The four protection schemes",
          blocks: [
            {
              type: "table",
              headers: ["Scheme", "Main benefits", "Qualifying period"],
              rows: [
                ["Medical treatment, health & maternity", "Treatment costs, maternity care, sick-leave pay, critical illness cover", "3 months of contributions within the last 6"],
                ["Accident & disability", "Accident treatment, disability pension", "From the first contribution (occupational disease: 2 years)"],
                ["Dependent family", "Spouse pension, children's education allowance, funeral costs", "Work death: from day 1; other death: 12 months"],
                ["Old age protection", "Lifelong monthly pension + lump-sum retirement benefit", "Pension: age 60 + 180 months of contributions"],
              ],
            },
          ],
        },
        {
          kind: "MAIN",
          heading: "Why does SSF matter?",
          blocks: [
            {
              type: "list",
              items: [
                "Manages life-cycle risks: illness, accident, disability, death, old age",
                "Replaces the employer's provident fund, gratuity, treatment and compensation obligations through one system",
                "Extends protection to informal-sector workers, the self-employed, and Nepalis in foreign employment",
                "Your SSN (Social Security Number) stays the same for life, across every job",
              ],
            },
            {
              type: "note",
              text: "Act §62: if the Fund's resources are ever insufficient, the Government of Nepal is legally obliged to keep the schemes running — the strongest guarantee a contributor can have.",
            },
          ],
        },
      ],
    },
  },

  // 2 ──────────────────────────────────────────────────────────────
  {
    slug: "kasle-yogdan-garnu-parcha",
    categorySlug: "karmachari-ra-rojgardata",
    title: "SSF मा कसले योगदान गर्नुपर्छ? सूचीकरण कसरी हुन्छ?",
    shortAnswer:
      "औपचारिक क्षेत्रका सबै रोजगारदाता र तिनका श्रमिकका लागि SSF सूचीकरण अनिवार्य छ — नयाँ कर्मचारी ३ महिनाभित्र सूचीकरण गराइसक्नुपर्छ। अनौपचारिक क्षेत्र, स्वरोजगार र वैदेशिक रोजगारीमा हुनेहरू स्वेच्छाले आबद्ध हुन सक्छन्।",
    isCornerstone: true,
    readingMinutes: 7,
    userCategories: ["employee", "employer", "selfEmployed", "informal"],
    sections: [
      {
        kind: "ELIGIBILITY",
        heading: "कसका लागि अनिवार्य, कसका लागि स्वैच्छिक?",
        blocks: [
          {
            type: "table",
            headers: ["समूह", "आबद्धता", "योगदान दर"],
            rows: [
              ["औपचारिक क्षेत्रका रोजगारदाता र श्रमिक", "अनिवार्य", "आधारभूत पारिश्रमिकको ३१%"],
              ["अनौपचारिक क्षेत्रका श्रमिक", "स्वैच्छिक", "न्यूनतम पारिश्रमिकको २०.३७% (सरकारले ९.३७% थपिदिने)"],
              ["स्वरोजगारमा रहेका व्यक्ति", "स्वैच्छिक", "रोजेको आधार (१–३ गुणा न्यूनतम) को ३१%"],
              ["वैदेशिक रोजगारीमा जाने/रहेका", "श्रम स्वीकृतिसँगै सूचीकरण", "औद्योगिक न्यूनतमको कम्तीमा २१.३३%"],
            ],
          },
        ],
      },
      {
        kind: "STEPS",
        heading: "रोजगारदाता सूचीकरणका चरण",
        blocks: [
          {
            type: "steps",
            items: [
              "sosys.ssf.gov.np मा गएर Employer Registration रोज्नुहोस्",
              "संस्थाको विवरण भर्नुहोस् र कागजात अपलोड गर्नुहोस् (तलको सूची)",
              "SSF ले जाँच गरेपछि १६ अङ्कको सूचीकरण नम्बर र login प्राप्त हुन्छ",
              "Login गरेर प्रत्येक कर्मचारीको सूचीकरण (Contributor Registration) गर्नुहोस्",
            ],
          },
        ],
      },
      {
        kind: "DOCUMENTS",
        heading: "आवश्यक कागजात",
        blocks: [
          {
            type: "list",
            items: [
              "रोजगारदाता: फर्म/कम्पनी दर्ता प्रमाणपत्र, PAN/VAT प्रमाणपत्र, सूचीकरण सम्बन्धी संस्थाको निर्णय",
              "श्रमिक: नागरिकता/राष्ट्रिय परिचयपत्र/राहदानी, इच्छाएको व्यक्तिको फोटोसहितको परिचयपत्र, उपस्थित हुन नसके वारेसनामा",
            ],
          },
          {
            type: "note",
            text: "कोषले निवेदन प्राप्त भएको ३५ दिनभित्र सूचीकरण गरी ११ अङ्कको SSN सहितको परिचयपत्र दिनुपर्छ (सूचीकरण कार्यविधि २०७५, दफा ४–५)।",
          },
        ],
      },
      {
        kind: "MISTAKES",
        heading: "सामान्य गल्ती र सजाय",
        blocks: [
          {
            type: "list",
            items: [
              "नयाँ कर्मचारीको ३ महिनाभित्र सूचीकरण नगराउनु — रोजगारदाताले नगराए श्रमिक आफैँले निवेदन दिन सक्छ",
              "मासिक योगदान २५ दिनभित्र दाखिला नगर्नु — १०% ब्याजसहित असुल हुन्छ",
              "योगदान नबुझाएको अवधिमा श्रमिकको दुर्घटना/मृत्यु भए सुविधा बराबरको रकम रोजगारदाता स्वयंले दिनुपर्छ",
              "बैंक खाता/सम्पत्ति रोक्का, इजाजत निलम्बन र राहदानी रोक्कासम्मको कारबाही हुन सक्छ (ऐन दफा ९)",
            ],
          },
        ],
      },
    ],
    videoIds: ["-FXLNa0S_UI", "k11wqBUUUyE", "YMKqKA2oVW0", "O3LL87Q1m6A", "6AzCq5tev7k"],
    relatedServiceHref: "/services/registration",
    sourceKeys: ["act-2074", "listing-procedure-2075", "informal-procedure-2079"],
    lastVerified: LAST_VERIFIED,
    en: {
      title: "Who must contribute to SSF? How does registration work?",
      shortAnswer:
        "SSF registration is mandatory for all formal-sector employers and their workers — new employees must be registered within 3 months. Workers in the informal sector, the self-employed, and those in foreign employment can join voluntarily.",
      sections: [
        {
          kind: "ELIGIBILITY",
          heading: "For whom is it mandatory, for whom voluntary?",
          blocks: [
            {
              type: "table",
              headers: ["Group", "Enrollment", "Contribution rate"],
              rows: [
                ["Formal-sector employers and workers", "Mandatory", "31% of basic salary"],
                ["Informal-sector workers", "Voluntary", "20.37% of minimum wage (government adds 9.37%)"],
                ["Self-employed persons", "Voluntary", "31% of a chosen base (1–3× minimum wage)"],
                ["Going to / in foreign employment", "Registered along with labour permit", "At least 21.33% of the industrial minimum wage"],
              ],
            },
          ],
        },
        {
          kind: "STEPS",
          heading: "Employer registration steps",
          blocks: [
            {
              type: "steps",
              items: [
                "Go to sosys.ssf.gov.np and choose Employer Registration",
                "Fill in the organization's details and upload the documents (list below)",
                "After SSF verifies, you receive a 16-digit registration number and login",
                "Log in and register each employee (Contributor Registration)",
              ],
            },
          ],
        },
        {
          kind: "DOCUMENTS",
          heading: "Required documents",
          blocks: [
            {
              type: "list",
              items: [
                "Employer: firm/company registration certificate, PAN/VAT certificate, the organization's decision on registration",
                "Worker: citizenship / national ID / passport, photo ID of the nominee, power of attorney if unable to appear in person",
              ],
            },
            {
              type: "note",
              text: "The Fund must complete registration within 35 days of receiving the application and issue an ID card with an 11-digit SSN (Listing Procedure 2075, sections 4–5).",
            },
          ],
        },
        {
          kind: "MISTAKES",
          heading: "Common mistakes and penalties",
          blocks: [
            {
              type: "list",
              items: [
                "Not registering a new employee within 3 months — if the employer fails to do it, the worker can apply themselves",
                "Not depositing the monthly contribution within 25 days — it is recovered with 10% interest",
                "If a worker has an accident or dies during a period when contributions were not deposited, the employer must personally pay an amount equal to the benefits",
                "Actions can go as far as freezing bank accounts/assets, suspending licenses, and withholding passports (Act, section 9)",
              ],
            },
          ],
        },
      ],
    },
  },

  // 3 ──────────────────────────────────────────────────────────────
  {
    slug: "yogdan-kasari-calculate-huncha",
    categorySlug: "yogdan-ra-badfad",
    title: "कर्मचारी र Employer को योगदान कसरी Calculate हुन्छ?",
    shortAnswer:
      "आधारभूत पारिश्रमिकको ३१% SSF मा जम्मा हुन्छ — श्रमिकको तलबबाट ११% कट्टा हुन्छ (सञ्चय कोष १०% + सामाजिक सुरक्षा कर १%) र रोजगारदाताले २०% थप्छ (सञ्चय कोष १०% + उपदान ८.३३% + अन्य १.६७%)। भत्ता, बोनस र ओभरटाइममा योगदान लाग्दैन।",
    isCornerstone: true,
    readingMinutes: 5,
    userCategories: ["employee", "employer"],
    sections: [
      {
        kind: "MAIN",
        heading: "३१% कसरी बन्छ?",
        blocks: [
          {
            type: "table",
            headers: ["स्रोत", "दर", "विवरण"],
            rows: [
              ["श्रमिकको तर्फबाट (कट्टी)", "११%", "सञ्चय कोष १०% + सामाजिक सुरक्षा कर १%"],
              ["रोजगारदाताको तर्फबाट (थप)", "२०%", "सञ्चय कोष १०% + उपदान ८.३३% + अन्य १.६७%"],
              ["जम्मा", "३१%", "आधारभूत पारिश्रमिकको"],
            ],
          },
          {
            type: "note",
            text: "श्रमिकको ११% मध्ये १०% त पहिल्यैदेखि सञ्चय कोषमा जाने रकम हो — नयाँ भार १% मात्र हो। रोजगारदाताको २०% तलबबाट कट्टा हुँदैन।",
          },
        ],
      },
      {
        kind: "EXAMPLE",
        heading: "उदाहरण: आधारभूत तलब रु. ३०,०००",
        blocks: [
          {
            type: "table",
            headers: ["विवरण", "हिसाब", "रकम (रु.)"],
            rows: [
              ["श्रमिकको योगदान (११%)", "३०,००० × ०.११", "३,३००"],
              ["रोजगारदाताको योगदान (२०%)", "३०,००० × ०.२०", "६,०००"],
              ["कुल मासिक योगदान", "३०,००० × ०.३१", "९,३००"],
              ["वार्षिक जम्मा", "९,३०० × १२", "१,११,६००"],
            ],
          },
          {
            type: "p",
            text: "श्रमिकको हातमा आउने तलब रु. ३,३०० ले घट्छ; रु. ६,००० रोजगारदाताले तलबभन्दा माथि थप्छ। सबै रकम अन्ततः श्रमिककै सुविधा र बचतमा फर्किन्छ।",
          },
        ],
      },
      {
        kind: "CAUTION",
        heading: "दाखिला अवधि र ढिलाइको जरिवाना",
        blocks: [
          {
            type: "list",
            items: [
              "प्रत्येक नेपाली महिना सकिएको २५ दिनभित्र योगदान दाखिला गर्नुपर्छ (ऐन दफा ४, २०८२ संशोधन)",
              "ढिलो भए बाँकी रकममा १०% ब्याज लाग्छ",
              "आधारभूत पारिश्रमिक सरकारले तोकेको न्यूनतम पारिश्रमिकभन्दा कम हुन सक्दैन",
            ],
          },
        ],
      },
    ],
    videoIds: ["iZ4EnkNIzaI", "uS66xR9bQ-g"],
    relatedCalculatorHref: "/calculators/contribution",
    sourceKeys: ["procedure-2075-5th", "labour-act-2074", "act-2074"],
    lastVerified: LAST_VERIFIED,
    en: {
      title: "How are employee and employer contributions calculated?",
      shortAnswer:
        "31% of the basic salary is deposited into SSF — 11% is deducted from the worker's salary (Provident Fund 10% + Social Security Tax 1%) and the employer adds 20% (Provident Fund 10% + Gratuity 8.33% + other 1.67%). Allowances, bonuses, and overtime are not subject to contribution.",
      sections: [
        {
          kind: "MAIN",
          heading: "How does the 31% add up?",
          blocks: [
            {
              type: "table",
              headers: ["Source", "Rate", "Breakdown"],
              rows: [
                ["From the worker (deducted)", "11%", "Provident Fund 10% + Social Security Tax 1%"],
                ["From the employer (added)", "20%", "Provident Fund 10% + Gratuity 8.33% + other 1.67%"],
                ["Total", "31%", "of the basic salary"],
              ],
            },
            {
              type: "note",
              text: "Of the worker's 11%, 10% was already going to the Provident Fund before SSF — the only new burden is 1%. The employer's 20% is not deducted from the salary.",
            },
          ],
        },
        {
          kind: "EXAMPLE",
          heading: "Example: basic salary Rs. 30,000",
          blocks: [
            {
              type: "table",
              headers: ["Item", "Calculation", "Amount (Rs.)"],
              rows: [
                ["Worker's contribution (11%)", "30,000 × 0.11", "3,300"],
                ["Employer's contribution (20%)", "30,000 × 0.20", "6,000"],
                ["Total monthly contribution", "30,000 × 0.31", "9,300"],
                ["Annual total", "9,300 × 12", "111,600"],
              ],
            },
            {
              type: "p",
              text: "The worker's take-home salary decreases by Rs. 3,300; the Rs. 6,000 is added by the employer on top of the salary. All of it ultimately comes back to the worker as benefits and savings.",
            },
          ],
        },
        {
          kind: "CAUTION",
          heading: "Deposit deadline and late penalty",
          blocks: [
            {
              type: "list",
              items: [
                "Contributions must be deposited within 25 days of the end of each Nepali month (Act section 4, 2082 amendment)",
                "If late, 10% interest applies on the outstanding amount",
                "The basic salary cannot be lower than the government-set minimum wage",
              ],
            },
          ],
        },
      ],
    },
  },

  // 4 ──────────────────────────────────────────────────────────────
  {
    slug: "31-pratishat-kaha-jancha",
    categorySlug: "yogdan-ra-badfad",
    title: "SSF को 31% रकम कहाँ जान्छ?",
    shortAnswer:
      "जम्मा भएको ३१% चार योजनामा बाँडिन्छ (५औँ संशोधन, लागू २०८२ वैशाख १): औषधि उपचार/मातृत्व १.२०%, दुर्घटना/अशक्तता ०.८०%, आश्रित परिवार ०.६७%, र सबैभन्दा ठूलो हिस्सा २८.३३% तपाईंकै वृद्ध अवस्था खातामा (निवृत्तभरण २०% + अवकाश सुविधा ८.३३%)।",
    isCornerstone: true,
    readingMinutes: 5,
    userCategories: ["employee", "contributor"],
    sections: [
      {
        kind: "MAIN",
        heading: "बाँडफाँट (५औँ संशोधनपछिको दर)",
        blocks: [
          {
            type: "table",
            headers: ["योजना", "दर", "रु. ३०,००० तलबमा"],
            rows: [
              ["औषधि उपचार, स्वास्थ्य तथा मातृत्व सुरक्षा", "१.२०%", "३६०"],
              ["दुर्घटना तथा अशक्तता सुरक्षा", "०.८०%", "२४०"],
              ["आश्रित परिवार सुरक्षा", "०.६७%", "२०१"],
              ["वृद्ध अवस्था सुरक्षा", "२८.३३%", "८,४९९"],
              ["जम्मा", "३१%", "९,३००"],
            ],
          },
        ],
      },
      {
        kind: "MAIN",
        heading: "वृद्ध अवस्थाको २८.३३% भित्र के-के छ?",
        blocks: [
          {
            type: "table",
            headers: ["भाग", "दर", "कहिले पाइन्छ"],
            rows: [
              ["निवृत्तभरण योजना", "२०%", "६० वर्षपछि आजीवन मासिक पेन्सन"],
              ["अवकाश सुविधा योजना", "८.३३%", "अवकाश वा रोजगारी अन्त्यमा एकमुष्ट"],
            ],
          },
          {
            type: "note",
            text: "महत्वपूर्ण भिन्नता: निवृत्तभरण (२०%) को रकम ६० वर्षअघि झिक्न पाइँदैन; अवकाश सुविधा (८.३३%) रोजगारी अन्त्य हुँदा एकमुष्ट पाइन्छ। जागिर छाड्दा 'सबै पैसा फिर्ता' हुँदैन — यही भिन्नताले धेरैलाई अलमल्याउँछ।",
          },
        ],
      },
      {
        kind: "EXAMPLE",
        heading: "बुझ्ने तरिका",
        blocks: [
          {
            type: "p",
            text: "सानो हिस्सा (२.६७%) ले बीमा-जस्ता सुरक्षा किन्छ — उपचार, दुर्घटना र परिवारको जोखिम। बाँकी ठूलो हिस्सा (२८.३३%) तपाईंकै नाममा बचत भएर लगानी प्रतिफलसहित बढ्दै जान्छ र वृद्धावस्थाको आम्दानी बन्छ।",
          },
        ],
      },
    ],
    videoIds: ["8QyRTsZkHyg", "dtObVLVO0Bs"],
    relatedCalculatorHref: "/calculators/allocation",
    sourceKeys: ["procedure-2075-5th"],
    lastVerified: LAST_VERIFIED,
    en: {
      title: "Where does the 31% deposited in SSF go?",
      shortAnswer:
        "The 31% splits across four schemes (5th Amendment, effective Baisakh 1, 2082): medical & maternity 1.20%, accident & disability 0.80%, dependent family 0.67%, and the largest share — 28.33% — goes into your own old-age account (pension 20% + retirement benefit 8.33%).",
      sections: [
        {
          kind: "MAIN",
          heading: "The allocation (post-5th-Amendment rates)",
          blocks: [
            {
              type: "table",
              headers: ["Scheme", "Rate", "On a Rs 30,000 salary"],
              rows: [
                ["Medical treatment, health & maternity", "1.20%", "360"],
                ["Accident & disability", "0.80%", "240"],
                ["Dependent family", "0.67%", "201"],
                ["Old age protection", "28.33%", "8,499"],
                ["Total", "31%", "9,300"],
              ],
            },
          ],
        },
        {
          kind: "MAIN",
          heading: "Inside the 28.33% old-age share",
          blocks: [
            {
              type: "table",
              headers: ["Part", "Rate", "When you receive it"],
              rows: [
                ["Pension scheme", "20%", "Lifelong monthly pension after age 60"],
                ["Retirement benefit scheme", "8.33%", "Lump sum at retirement or end of employment"],
              ],
            },
            {
              type: "note",
              text: "Key distinction: the pension portion (20%) cannot be withdrawn before 60; the retirement portion (8.33%) is paid out when employment ends. Leaving a job does NOT refund everything — this is the single most misunderstood rule.",
            },
          ],
        },
        {
          kind: "EXAMPLE",
          heading: "How to think about it",
          blocks: [
            {
              type: "p",
              text: "A small slice (2.67%) buys insurance-style protection — treatment, accident, and family risk. The big slice (28.33%) is your own savings, growing with investment returns to become your old-age income.",
            },
          ],
        },
      ],
    },
  },

  // 5 ──────────────────────────────────────────────────────────────
  {
    slug: "pension-ra-retirement-guide",
    categorySlug: "pension-ra-retirement",
    title: "SSF Pension र Retirement Benefit को पूर्ण Guide",
    shortAnswer:
      "६० वर्ष उमेर पुगेको र कम्तीमा १८० महिना (१५ वर्ष) योगदान गरेको योगदानकर्ताले आजीवन मासिक निवृत्तभरण पाउँछ — सूत्र: (निवृत्तभरण खातामा जम्मा रकम + लगानी प्रतिफल) ÷ १६०। अवकाश सुविधा योजनाको रकम (८.३३%) भने रोजगारी अन्त्य वा अवकाशमा एकमुष्ट पाइन्छ।",
    isCornerstone: true,
    readingMinutes: 8,
    userCategories: ["employee", "contributor", "family"],
    sections: [
      {
        kind: "MAIN",
        heading: "निवृत्तभरणको सूत्र र योग्यता",
        blocks: [
          {
            type: "p",
            text: "निवृत्तभरण योजनामा जम्मा रकम र कोषको लगानीबाट प्राप्त प्रतिफलको कुल योगलाई १६० ले भाग गर्दा आउने रकम प्रत्येक महिना जीवनभर पाइन्छ (कार्यविधि २०७५, दफा २०–२२)। मुद्रास्फीति समायोजन पनि हुन्छ।",
          },
          {
            type: "list",
            items: [
              "योग्यता: ६० वर्ष उमेर पूरा + कम्तीमा १८० महिना योगदान",
              "२०७८ साउन १ पछि योगदान सुरु गर्ने सबै अनिवार्य रूपमा निवृत्तभरण योजनामा हुन्छन्",
              "१८० महिना नपुगी ६० वर्ष पुगे: एकमुष्ट लिने वा सोही रकम ÷ १६० को मासिक पेन्सन — रोज्न पाइन्छ",
              "६० वर्षअघि मृत्यु भए हकवालाले सम्पूर्ण रकम प्रतिफलसहित एकमुष्ट पाउँछ",
            ],
          },
        ],
      },
      {
        kind: "EXAMPLE",
        heading: "उदाहरण",
        blocks: [
          {
            type: "p",
            text: "मानौं ६० वर्ष पुग्दा तपाईंको निवृत्तभरण खातामा प्रतिफलसहित रु. १६ लाख जम्मा भयो: १६,००,००० ÷ १६० = रु. १०,००० प्रति महिना, जीवनभर। जति लामो अवधि र जति ठूलो रकममा योगदान गर्नुभयो, पेन्सन त्यति नै बढी।",
          },
        ],
      },
      {
        kind: "MAIN",
        heading: "पेन्सन सुरु भएपछि मृत्यु भए परिवारले के पाउँछ?",
        blocks: [
          {
            type: "list",
            items: [
              "पेन्सन सुरु भएको ७ वर्ष नपुग्दै मृत्यु भए: पति/पत्नीले ७ वर्षसम्म उही रकम, त्यसपछि ५०% आजीवन",
              "पति/पत्नी नभए: १८ वर्षमुनिका आश्रित छोराछोरीले ५०% रकम दामासाहीले",
              "सरकारी वा अन्य पेन्सन पाइरहेकाले पनि SSF पेन्सन लिन बाधा पर्दैन (दफा २४घ)",
            ],
          },
        ],
      },
      {
        kind: "MAIN",
        heading: "सापटी (Loan) सुविधा",
        blocks: [
          {
            type: "table",
            headers: ["सापटी", "योग्यता", "अधिकतम सीमा"],
            rows: [
              ["घर सापटी", "३६ महिना योगदान", "रु. ७५ लाख (धितो/तलब सीमाभित्र), २० वर्षसम्म"],
              ["शैक्षिक सापटी", "३६ महिना योगदान", "रु. ३५ लाख वा वास्तविक खर्च, १५ वर्षसम्म"],
              ["विशेष सापटी", "३६ महिना योगदान + अवकाशमा २ वर्ष बाँकी", "अवकाश सुविधा रकमको ८०% (धितो नचाहिने)"],
            ],
          },
        ],
      },
      {
        kind: "CAUTION",
        heading: "ध्यान दिनुपर्ने",
        blocks: [
          {
            type: "list",
            items: [
              "न्यूनतम पारिश्रमिकको ५ गुणाभन्दा बढी रकममा योगदान गरे बढी भाग अवकाश सुविधामा जान्छ (दफा २३क)",
              "६० वर्षपछि पनि काम गरे योगदान जारी राख्न सकिन्छ — नयाँ रकम अवकाश सुविधा योजनामा जम्मा हुन्छ",
              "विदेशी नागरिकले रोजगार सम्बन्ध सकिएपछि वृद्ध अवस्थाको रकम एकमुष्ट फिर्ता लैजान पाउँछन्",
            ],
          },
        ],
      },
    ],
    videoIds: ["8BLS0M5X6Os", "KZ44YSrPkjY", "Ym8rVCfLfH0", "FTzJA0o_gnU"],
    relatedCalculatorHref: "/calculators/job-leaving",
    sourceKeys: ["procedure-2075-5th", "loan-directive-2079"],
    lastVerified: LAST_VERIFIED,
    en: {
      title: "Complete Guide to SSF Pension and Retirement Benefits",
      shortAnswer:
        "A contributor who reaches 60 years of age and has contributed for at least 180 months (15 years) receives a lifelong monthly pension — formula: (total amount in the pension account + investment returns) ÷ 160. The Retirement Benefit Scheme amount (8.33%) is paid as a lump sum when employment ends or at retirement.",
      sections: [
        {
          kind: "MAIN",
          heading: "Pension formula and eligibility",
          blocks: [
            {
              type: "p",
              text: "The total of the amount deposited in the Pension Scheme plus the returns earned from the Fund's investments is divided by 160 — that amount is paid every month for life (Operational Procedure 2075, sections 20–22). It is also adjusted for inflation.",
            },
            {
              type: "list",
              items: [
                "Eligibility: 60 years of age completed + at least 180 months of contribution",
                "Everyone who started contributing after Shrawan 1, 2078 is mandatorily enrolled in the Pension Scheme",
                "If you reach 60 without completing 180 months: you can choose either a lump sum or a monthly pension of that amount ÷ 160",
                "If the contributor dies before 60, the legal heir receives the entire amount with returns as a lump sum",
              ],
            },
          ],
        },
        {
          kind: "EXAMPLE",
          heading: "Example",
          blocks: [
            {
              type: "p",
              text: "Suppose that by age 60 your pension account has accumulated Rs. 1,600,000 including returns: 1,600,000 ÷ 160 = Rs. 10,000 per month, for life. The longer you contribute and the larger the amount, the higher your pension.",
            },
          ],
        },
        {
          kind: "MAIN",
          heading: "What does the family receive if the pensioner dies?",
          blocks: [
            {
              type: "list",
              items: [
                "If death occurs within 7 years of the pension starting: the spouse receives the same amount until the 7 years complete, then 50% for life",
                "If there is no spouse: dependent children under 18 share 50% of the amount proportionally",
                "Receiving a government or other pension does not block you from also receiving the SSF pension (section 24d)",
              ],
            },
          ],
        },
        {
          kind: "MAIN",
          heading: "Loan facilities",
          blocks: [
            {
              type: "table",
              headers: ["Loan", "Eligibility", "Maximum limit"],
              rows: [
                ["Home loan", "36 months of contribution", "Rs. 7.5 million (within collateral/salary limits), up to 20 years"],
                ["Education loan", "36 months of contribution", "Rs. 3.5 million or actual cost, up to 15 years"],
                ["Special loan", "36 months of contribution + within 2 years of retirement", "80% of the Retirement Benefit amount (no collateral needed)"],
              ],
            },
          ],
        },
        {
          kind: "CAUTION",
          heading: "Points to note",
          blocks: [
            {
              type: "list",
              items: [
                "If you contribute on an amount more than 5 times the minimum wage, the excess portion goes to the Retirement Benefit Scheme (section 23a)",
                "If you keep working after 60, you can continue contributing — the new amount is deposited into the Retirement Benefit Scheme",
                "Foreign nationals can withdraw their old-age amount as a lump sum once the employment relationship ends",
              ],
            },
          ],
        },
      ],
    },
  },

  // 6 ──────────────────────────────────────────────────────────────
  {
    slug: "jagir-chadepachi-ke-huncha",
    categorySlug: "pension-ra-retirement",
    title: "जागिर छाडेपछि SSF Contribution के हुन्छ?",
    shortAnswer:
      "अवकाश सुविधा योजनाको रकम (८.३३% + स्वेच्छिक थप + हस्तान्तरित रकम) रोजगारी अन्त्यमा एकमुष्ट पाइन्छ। निवृत्तभरण योजनाको रकम (२०%) भने ६० वर्षपछि मासिक पेन्सनका रूपमा आउँछ। नयाँ SSF-सूचीकृत रोजगारदातामा गए उही SSN मा योगदान निरन्तर चल्छ।",
    isCornerstone: true,
    readingMinutes: 6,
    userCategories: ["employee", "contributor"],
    sections: [
      {
        kind: "MAIN",
        heading: "तपाईंको रकमका दुई भाग — फरक नियम",
        blocks: [
          {
            type: "table",
            headers: ["भाग", "रकम", "जागिर छाड्दा के हुन्छ"],
            rows: [
              [
                "अवकाश सुविधा योजना",
                "८.३३% + स्वेच्छिक थप + पुरानो PF/उपदानबाट हस्तान्तरित",
                "रोजगारी अन्त्य वा अवकाशमा एकमुष्ट झिक्न पाइन्छ",
              ],
              [
                "निवृत्तभरण योजना",
                "२०%",
                "६० वर्षसम्म कोषमै रहन्छ; त्यसपछि ÷१६० सूत्रले आजीवन मासिक पेन्सन",
              ],
            ],
          },
        ],
      },
      {
        kind: "MAIN",
        heading: "नयाँ जागिर वा आफ्नै योगदान",
        blocks: [
          {
            type: "list",
            items: [
              "नयाँ SSF-सूचीकृत रोजगारदातामा गए: SSN उही रहन्छ, नयाँ रोजगारदाताले त्यही नम्बरमा योगदान गर्छ — केही गुम्दैन",
              "जागिर नभएको अवधिमा: स्वरोजगार वा अनौपचारिक क्षेत्रको योजनामार्फत आफैँले योगदान जारी राख्न सकिन्छ",
              "योगदान रोकिए: औषधि उपचार सुविधा ३ महिनासम्म मात्र कायम रहन्छ; दुर्घटना सुविधा तुरुन्तै रोकिन्छ",
              "रोजगारी सकिएको जानकारी रोजगारदाताले १ महिनाभित्र कोषलाई दिनुपर्छ",
            ],
          },
        ],
      },
      {
        kind: "MISTAKES",
        heading: "सामान्य भ्रम",
        blocks: [
          {
            type: "list",
            items: [
              "«जागिर छाडेपछि ३१% सबै फिर्ता पाइन्छ» — गलत: एकमुष्ट पाइने अवकाश सुविधाको भाग मात्र हो",
              "«योगदान रोकिए जम्मा रकम डुब्छ» — गलत: रकम तपाईंकै खातामा प्रतिफलसहित सुरक्षित रहन्छ",
              "«विदेश गए SSF सकियो» — गलत: वैदेशिक रोजगार योजनामार्फत निरन्तरता दिन सकिन्छ",
            ],
          },
        ],
      },
    ],
    videoIds: ["Q4SrXAtj074", "R0TzLoCRdL4"],
    relatedCalculatorHref: "/calculators/job-leaving",
    sourceKeys: ["procedure-2075-5th", "study-material-2083"],
    lastVerified: LAST_VERIFIED,
  },

  // 7 ──────────────────────────────────────────────────────────────
  {
    slug: "foreign-employment-guide",
    categorySlug: "baideshik-rojgari",
    title: "Foreign Employment SSF को पूर्ण Guide",
    shortAnswer:
      "वैदेशिक रोजगारीमा जाने श्रमिक श्रम स्वीकृति लिँदा नै SSF मा सूचीकृत हुन्छन्; विदेशमा भइसकेकाले online निवेदन दिन सक्छन्। योगदान: औद्योगिक न्यूनतम पारिश्रमिकको कम्तीमा २१.३३% (३ गुणासम्म) — ७.४८% सुरक्षा योजनामा, १३.८५% वृद्ध अवस्थामा। परिवारले नेपालमै उपचार सुविधा पाउँछ।",
    isCornerstone: true,
    readingMinutes: 8,
    userCategories: ["foreign", "family"],
    sections: [
      {
        kind: "MAIN",
        heading: "योगदान दर र बाँडफाँट",
        blocks: [
          {
            type: "table",
            headers: ["विवरण", "दर"],
            rows: [
              ["न्यूनतम योगदान", "औद्योगिक न्यूनतम आधारभूत पारिश्रमिकको २१.३३%"],
              ["अधिकतम आधार", "न्यूनतमको ३ गुणासम्म रोज्न सकिने"],
              ["औषधि उपचार + दुर्घटना + आश्रित परिवार", "७.४८%"],
              ["वृद्ध अवस्था सुरक्षा", "१३.८५%"],
            ],
          },
        ],
      },
      {
        kind: "ELIGIBILITY",
        heading: "योग्यता अवधि र सुविधा",
        blocks: [
          {
            type: "list",
            items: [
              "औषधि उपचार र दुर्घटना/अशक्तता: पछिल्ला ६ महिनामा कम्तीमा ३ महिना योगदान",
              "आश्रित परिवारका मुख्य सुविधा: पछिल्ला १२ महिनामा कम्तीमा ९ महिना योगदान",
              "अन्तिम संस्कार खर्च (रु. २५,०००): पछिल्ला ६ महिनामा कम्तीमा १ महिना",
              "नेपालमा उपचार: योगदानकर्ता, पति/पत्नी र १८ वर्षसम्मका छोराछोरीलाई OPD वार्षिक रु. २५ हजार + भर्ना उपचार रु. १ लाखसम्म (२०% सह-भुक्तानी)",
              "दुर्घटना उपचार: रु. ७ लाखसम्म",
              "फर्किएपछि: निवृत्तभरण रकम एकमुष्ट लिने वा ÷१६० को आजीवन मासिक पेन्सन — विकल्प रोज्न पाइन्छ",
            ],
          },
          {
            type: "note",
            text: "यो वैदेशिक रोजगार कल्याणकारी कोषभन्दा फरक हो — SSF योगदानमा आधारित बचत तथा सुरक्षा योजना हो जसले स्वदेश फर्किएपछिको वृद्धावस्थासमेत सुरक्षित गर्छ।",
          },
        ],
      },
      {
        kind: "STEPS",
        heading: "विदेशबाट जोडिने/योगदान गर्ने तरिका",
        blocks: [
          {
            type: "steps",
            items: [
              "श्रम स्वीकृति लिँदा सूचीकरण भएको छ/छैन जाँच्नुहोस् (ID/password नभए रिकभरीका लागि तलको भिडियो हेर्नुहोस्)",
              "sosys.ssf.gov.np वा SSF mobile app मा login गर्नुहोस्",
              "KYC verification पूरा गर्नुहोस् — नगरे सुविधा दाबीमा समस्या आउँछ",
              "बैंक/डिजिटल माध्यमबाट मासिक वा त्रैमासिक योगदान जम्मा गर्नुहोस्",
              "नेपाल फर्किएपछि रोजगारी/स्वरोजगार अनुसार योजना निरन्तरता मिलाउनुहोस्",
            ],
          },
        ],
      },
      {
        kind: "CAUTION",
        heading: "ध्यान दिनुहोस्",
        blocks: [
          {
            type: "list",
            items: [
              "KYC नगरी रकम दाबी गर्न सकिँदैन — कागजात अपडेट राख्नुहोस्",
              "नियमित योगदान रोकिए उपचार/दुर्घटना सुविधा पनि रोकिन्छ",
              "दुई वटा SSN बन्न गएको भए तुरुन्तै कोषमा जानकारी दिई एकीकरण गराउनुहोस्",
            ],
          },
        ],
      },
    ],
    videoIds: [
      "VrEIuKx4c90",
      "uEKO8zmFEHg",
      "HhwTzMdAqiU",
      "DOaX_27N-ks",
      "S8qI9Eyd5QE",
      "Z9mhGiTYnrE",
      "kY1280ax2-4",
      "xr2v0S1makA",
    ],
    relatedCalculatorHref: "/calculators/foreign-employment",
    relatedServiceHref: "/services/registration",
    sourceKeys: ["foreign-procedure-2079", "study-material-2083"],
    lastVerified: LAST_VERIFIED,
    en: {
      title: "The Complete Guide to SSF for Foreign Employment",
      shortAnswer:
        "Nepali workers going abroad are enrolled in SSF when taking their labour permit; those already abroad can apply online. Contribution: at least 21.33% of the industrial minimum basic remuneration (up to 3×) — 7.48% funds the protection schemes and 13.85% your old-age savings. Your family in Nepal gets medical coverage while you work abroad.",
      sections: [
        {
          kind: "MAIN",
          heading: "Contribution rate and allocation",
          blocks: [
            {
              type: "table",
              headers: ["Item", "Rate"],
              rows: [
                ["Minimum contribution", "21.33% of the industrial minimum basic remuneration"],
                ["Maximum base", "You may choose up to 3× the minimum"],
                ["Medical + accident + dependent family", "7.48%"],
                ["Old age protection", "13.85%"],
              ],
            },
          ],
        },
        {
          kind: "ELIGIBILITY",
          heading: "Qualifying periods and benefits",
          blocks: [
            {
              type: "list",
              items: [
                "Medical treatment and accident/disability: at least 3 months of contributions within the last 6",
                "Main dependent-family benefits: at least 9 months within the last 12",
                "Funeral costs (Rs 25,000): at least 1 month within the last 6",
                "Treatment in Nepal for you, your spouse, and children up to 18: OPD up to Rs 25,000/year + inpatient up to Rs 100,000/year (20% co-payment)",
                "Accident treatment: up to Rs 700,000",
                "After returning: choose a lump sum of your pension savings, or divide by 160 for a lifelong monthly pension",
              ],
            },
            {
              type: "note",
              text: "This is different from the Foreign Employment Welfare Fund — SSF is a contribution-based savings and protection scheme that also secures your old age after you return home.",
            },
          ],
        },
        {
          kind: "STEPS",
          heading: "How to join and pay from abroad",
          blocks: [
            {
              type: "steps",
              items: [
                "Check whether you were enrolled when taking your labour permit (see the ID/password recovery video below if you don't have credentials)",
                "Log in at sosys.ssf.gov.np or the SSF mobile app",
                "Complete KYC verification — claims cannot be processed without it",
                "Deposit contributions monthly or quarterly via bank or digital channels",
                "After returning to Nepal, continue under the employee or self-employed scheme",
              ],
            },
          ],
        },
        {
          kind: "CAUTION",
          heading: "Watch out for",
          blocks: [
            {
              type: "list",
              items: [
                "No KYC = no claim payouts — keep your documents updated",
                "If contributions stop, treatment and accident coverage stop too",
                "If you accidentally have two SSNs, notify the Fund immediately to merge them",
              ],
            },
          ],
        },
      ],
    },
  },

  // 8 ──────────────────────────────────────────────────────────────
  {
    slug: "kyc-profile-claim-guide",
    categorySlug: "kyc-profile-nominee",
    title: "SSF KYC, Profile Correction र Claim Guide",
    shortAnswer:
      "KYC (ग्राहक पहिचान) SSF को AML/CFT नीति, २०८२ बमोजिम अनिवार्य छ — KYC नभई सुविधा दाबी र भुक्तानीमा समस्या आउँछ। प्रोफाइलको नाम/जन्ममिति/मोबाइल गलत भए सच्याउन सकिन्छ, र सबै दाबी SOSYS मार्फत online गर्न सकिन्छ।",
    isCornerstone: true,
    readingMinutes: 7,
    userCategories: ["contributor", "foreign", "employee", "family"],
    sections: [
      {
        kind: "MAIN",
        heading: "KYC किन अनिवार्य छ?",
        blocks: [
          {
            type: "p",
            text: "सम्पत्ति शुद्धीकरण निवारण ऐन, २०६४ र SSF को AML/CFT नीति/कार्यविधि, २०८२ बमोजिम कोषले प्रत्येक योगदानकर्ता र रोजगारदाताको पहिचान (KYC) प्रमाणित गर्नुपर्छ। नियमावली २०७५ (नियम १०) अनुसार वास्तविक पहिचान नभएसम्म सुविधा निलम्बनसमेत हुन सक्छ।",
          },
        ],
      },
      {
        kind: "DOCUMENTS",
        heading: "KYC का लागि सामान्यतया चाहिने कागजात/विवरण",
        blocks: [
          {
            type: "list",
            items: [
              "नागरिकता प्रमाणपत्र वा राहदानी (वैदेशिक रोजगारीमा हुनेका लागि राहदानी + श्रम स्वीकृति)",
              "हालसालैको फोटो",
              "बैंक खाता विवरण (भुक्तानीका लागि)",
              "सम्पर्क विवरण — मोबाइल नम्बर र इमेल",
              "पेशा/रोजगारी विवरण",
            ],
          },
          {
            type: "note",
            text: "अन्तिम सूची SSF ले तोकेबमोजिम हुन्छ — दाबी अस्वीकृत हुने प्रमुख कारण अधूरो/अमिल्दो कागजात नै हो।",
          },
        ],
      },
      {
        kind: "STEPS",
        heading: "Profile Correction (नाम/विवरण सच्याउने)",
        blocks: [
          {
            type: "steps",
            items: [
              "SOSYS मा login गरेर आफ्नो प्रोफाइल विवरण जाँच्नुहोस्",
              "गलत विवरण (नाम, जन्ममिति, मोबाइल, नागरिकता विवरण) पहिचान गर्नुहोस्",
              "प्रमाण कागजातसहित सच्याउने अनुरोध पेश गर्नुहोस्",
              "दुई वटा SSN भएको अवस्थामा कोषमा निवेदन दिई एकीकरण गराउनुहोस्",
              "इच्छाएको व्यक्ति (nominee) को विवरण अद्यावधिक राख्नुहोस् — मृत्यु भएमा भुक्तानी यही विवरणका आधारमा हुन्छ",
            ],
          },
        ],
      },
      {
        kind: "STEPS",
        heading: "सुविधा दाबी (Claim) को सामान्य प्रक्रिया",
        blocks: [
          {
            type: "steps",
            items: [
              "SOSYS मा login गरी Claim रोज्नुहोस् र सम्बन्धित योजना छान्नुहोस्",
              "कार्यविधिको अनुसूचीबमोजिमको फाराम भर्नुहोस् (औषधि उपचार: अनुसूची १/२, मातृत्व: ३, दुर्घटना: ४/५, आश्रित परिवार: ६/७, निवृत्तभरण: ८–१०)",
              "बिल, प्रेस्क्रिप्सन, discharge summary जस्ता प्रमाण अपलोड गर्नुहोस्",
              "SSF ले जाँचेर स्वीकृत गरेपछि रकम सीधै बैंक खातामा आउँछ",
              "अस्वीकृत भए कारण हेरेर कागजात मिलाई पुनः पेश गर्नुहोस्; चित्त नबुझे ३५ दिनभित्र श्रम अदालतमा पुनरावेदन गर्न सकिन्छ",
            ],
          },
          {
            type: "note",
            text: "रोजगारीजन्य दुर्घटना ७ दिनभित्र कोषलाई जानकारी गराउनुपर्छ (message/email हुन्छ) — नगराए सम्झौता नभएको अस्पतालको रु. ७ लाखभन्दा बढी खर्च कोषले व्यहोर्दैन।",
          },
        ],
      },
    ],
    videoIds: ["63a1Syl6RHU", "K1Z9ynkXqbw", "EZS--UrRV04", "nwdYoVHTEKA", "m2oKN85hFhU", "S_Ch2yO7G3A"],
    relatedServiceHref: "/services/kyc-verification",
    sourceKeys: ["aml-policy-2082", "regulation-2075", "procedure-2075-5th"],
    lastVerified: LAST_VERIFIED,
  },
  // 9 ──────────────────────────────────────────────────────────────
  {
    slug: "informal-sector-guide",
    categorySlug: "karmachari-ra-rojgardata",
    title: "अनौपचारिक क्षेत्रका श्रमिकका लागि SSF — पूर्ण Guide",
    shortAnswer:
      "कृषि, घरेलु काम, ज्याला-मजदुरी जस्ता अनौपचारिक क्षेत्रका श्रमिकले न्यूनतम आधारभूत पारिश्रमिकको ११% मात्र तिरे पुग्छ — नेपाल सरकारले ९.३७% थपिदिन्छ (कुल २०.३७%)। यो नेपालको सबैभन्दा सस्तो सामाजिक सुरक्षा हो: उपचार, दुर्घटना, परिवार सुरक्षा र वृद्धावस्था pension सबै समेटिन्छ।",
    isCornerstone: true,
    readingMinutes: 6,
    userCategories: ["informal"],
    sections: [
      {
        kind: "MAIN",
        heading: "योगदान: तपाईं ११%, सरकार ९.३७%",
        blocks: [
          {
            type: "table",
            headers: ["विवरण", "दर"],
            rows: [
              ["श्रमिक स्वयंको योगदान (न्यूनतम पारिश्रमिकको)", "११%"],
              ["नेपाल सरकारबाट थप", "९.३७%"],
              ["कुल योगदान", "२०.३७%"],
              ["→ उपचार + दुर्घटना + आश्रित परिवार", "१०.३७%"],
              ["→ वृद्ध अवस्था सुरक्षा", "१०%"],
            ],
          },
          {
            type: "note",
            text: "सरकार (संघ, प्रदेश वा स्थानीय तह) ले ९.३७% जम्मा नगरिदिए वा कम गरिदिए, श्रमिक आफैँले बाँकी रकम थपेर पनि सहभागी हुन सकिन्छ (कार्यविधि २०७९, दफा ५)।",
          },
        ],
      },
      {
        kind: "ELIGIBILITY",
        heading: "के-के सुविधा पाइन्छ?",
        blocks: [
          {
            type: "list",
            items: [
              "औषधि उपचार: भर्ना भई उपचारमा वार्षिक रु. १ लाखसम्म; OPD वार्षिक रु. २५ हजारसम्म (२०% सह-भुक्तानी)",
              "मातृत्व: प्रति शिशु १ महिनाको न्यूनतम पारिश्रमिक; महिला योगदानकर्तालाई ९८ दिन बराबरको ६०% प्रसूति सुविधा",
              "दुर्घटना: अस्पताल उपचार रु. ७ लाखसम्म; स्थायी अशक्तता भए आजीवन मासिक निवृत्तभरण",
              "आश्रित परिवार: पति/पत्नीलाई न्यूनतम पारिश्रमिकको ४०% आजीवन; २ सन्ततिसम्म शैक्षिक वृत्ति; अन्तिम संस्कार खर्च",
              "वृद्ध अवस्था: औपचारिक क्षेत्रकै जस्तै — (जम्मा + प्रतिफल) ÷ १६० को आजीवन मासिक pension",
            ],
          },
          {
            type: "p",
            text: "योग्यता: उपचार/मातृत्व/दुर्घटनाका लागि पछिल्ला ६ महिनामा कम्तीमा ३ महिना योगदान; अन्तिम संस्कार खर्चका लागि पछिल्ला ६ महिनामा १ महिना मात्र भए पुग्छ।",
          },
        ],
      },
      {
        kind: "STEPS",
        heading: "कसरी सूचीकरण गर्ने?",
        blocks: [
          {
            type: "steps",
            items: [
              "नागरिकता/राष्ट्रिय परिचयपत्र र फोटो तयार पार्नुहोस्",
              "sosys.ssf.gov.np वा नजिकको श्रम कार्यालयमार्फत निवेदन दिनुहोस्",
              "३५ दिनभित्र ११ अङ्कको SSN सहितको परिचयपत्र पाउनुहुन्छ",
              "बैंक/wallet बाट मासिक योगदान जम्मा गर्नुहोस्",
            ],
          },
        ],
      },
    ],
    videoIds: ["O3LL87Q1m6A", "-FXLNa0S_UI"],
    relatedCalculatorHref: "/calculators/contribution",
    relatedServiceHref: "/services/registration",
    sourceKeys: ["informal-procedure-2079", "listing-procedure-2075"],
    lastVerified: "2026-07-11",
  },

  // 10 ─────────────────────────────────────────────────────────────
  {
    slug: "self-employed-guide",
    categorySlug: "karmachari-ra-rojgardata",
    title: "स्वरोजगार (पसल, व्यवसाय, freelancer) का लागि SSF Guide",
    shortAnswer:
      "आफ्नै पसल, व्यवसाय वा freelancing गर्नेले न्यूनतम पारिश्रमिकदेखि त्यसको ३ गुणासम्मको आधार आफैँ रोजेर ३१% योगदान गर्न सक्छन् — जति ठूलो आधार, त्यति ठूलो pension। कुनै रोजगारदाता नभएकाका लागि SSF नै एकमात्र संगठित सामाजिक सुरक्षा हो।",
    isCornerstone: true,
    readingMinutes: 6,
    userCategories: ["selfEmployed"],
    sections: [
      {
        kind: "MAIN",
        heading: "योगदान र बाँडफाँट",
        blocks: [
          {
            type: "p",
            text: "आधार रकम आफैँ रोज्नुहोस् — न्यूनतम आधारभूत पारिश्रमिक बराबरदेखि बढीमा त्यसको ३ गुणासम्म। रोजेको आधारको ३१% मासिक योगदान गर्नुपर्छ (कार्यविधि २०७९, दफा ५ख)।",
          },
          {
            type: "table",
            headers: ["योजना", "बाँडफाँट"],
            rows: [
              ["औषधि उपचार, स्वास्थ्य तथा मातृत्व", "२.४%"],
              ["दुर्घटना तथा अशक्तता", "०.८०%"],
              ["आश्रित परिवार", "१.८०%"],
              ["वृद्ध अवस्था (कम्तीमा १६% pension योजनामा)", "२६%"],
            ],
          },
          {
            type: "note",
            text: "औपचारिक क्षेत्रभन्दा उपचार (२.४% vs १.२०%) र परिवार सुरक्षा (१.८०% vs ०.६७%) मा बढी रकम छुट्याइएको छ — किनभने स्वरोजगारसँग अरू कुनै रोजगारदाता-सुरक्षा हुँदैन।",
          },
        ],
      },
      {
        kind: "EXAMPLE",
        heading: "आधार कति रोज्ने? (रणनीति)",
        blocks: [
          {
            type: "list",
            items: [
              "सानो आधार = कम मासिक भार, तर सानो pension — व्यवसाय अस्थिर भए यताबाट सुरु गर्नुहोस्",
              "ठूलो आधार (३ गुणा) = ३ गुणा ठूलो pension कोष — आम्दानी स्थिर भए यो रोज्नुहोस्",
              "आधार पछि बढाउन/घटाउन सकिन्छ — Financial Planner मा दुवै scenario तुलना गर्नुहोस्",
              "१८० महिना (१५ वर्ष) पुगे ६० वर्षदेखि आजीवन pension — ढिलो सुरु गरे यो योग्यता टाढिन्छ",
            ],
          },
        ],
      },
      {
        kind: "MISTAKES",
        heading: "सामान्य गल्ती",
        blocks: [
          {
            type: "list",
            items: [
              "योगदान अनियमित गर्नु — उपचार सुविधा 'पछिल्ला ६ महिनामा ३ महिना' नियमित भए मात्र पाइन्छ",
              "व्यवसाय दर्ता र SSF listing एउटै हो भन्ठान्नु — SSF मा छुट्टै सूचीकरण चाहिन्छ",
              "जागिरबाट स्वरोजगारमा जाँदा पुरानै SSN प्रयोग नगर्नु — SSN जीवनभर एउटै हो, नयाँ बनाउनु हुँदैन",
            ],
          },
        ],
      },
    ],
    videoIds: ["6AzCq5tev7k", "R0TzLoCRdL4"],
    relatedCalculatorHref: "/calculators/financial-planner",
    relatedServiceHref: "/services/registration",
    sourceKeys: ["informal-procedure-2079"],
    lastVerified: "2026-07-11",
  },

  // 11 ─────────────────────────────────────────────────────────────
  {
    slug: "sapati-loan-guide",
    categorySlug: "pension-ra-retirement",
    title: "SSF सापटी (Loan) को पूर्ण Guide — घर, शिक्षा र विशेष सापटी",
    shortAnswer:
      "३६ महिना (३ वर्ष) योगदान पुगेका योगदानकर्ताले SSF बाटै सापटी लिन सक्छन्: घर सापटी रु. ७५ लाखसम्म (२० वर्ष), शैक्षिक सापटी रु. ३५ लाखसम्म (१५ वर्ष), र धितो नचाहिने विशेष सापटी — अवकाश कोषमा जम्मा रकमको ८०% सम्म, online आवेदन गरेर २४ घण्टाभित्रै पाउन सकिने।",
    isCornerstone: false,
    readingMinutes: 7,
    userCategories: ["contributor", "employee"],
    sections: [
      {
        kind: "MAIN",
        heading: "चार प्रकारका सापटी",
        blocks: [
          {
            type: "table",
            headers: ["सापटी", "योग्यता", "अधिकतम", "अवधि"],
            rows: [
              ["घर सापटी", "३६ महिना योगदान", "रु. ७५ लाख (धितो/तलब सीमाभित्र)", "२० वर्षसम्म"],
              ["शैक्षिक सापटी", "३६ महिना योगदान", "रु. ३५ लाख वा वास्तविक खर्च", "१५ वर्षसम्म"],
              ["सामाजिक कार्य सापटी", "अन्य कोषको loan swap", "धितोले खामेसम्म", "swap शर्तअनुसार"],
              ["विशेष सापटी", "३६ महिना + अवकाशमा २ वर्ष बाँकी", "अवकाश कोषको ८०%", "तलब कट्टी/एकमुष्ट"],
            ],
          },
        ],
      },
      {
        kind: "MAIN",
        heading: "घर सापटीका नियम",
        blocks: [
          {
            type: "list",
            items: [
              "प्रयोजन: घडेरी खरिद, घर निर्माण/खरिद, तला थप, ममर्त",
              "सीमा: धितो मूल्याङ्कन, १५ वर्षको तलब वा ६० वर्ष पुग्न बाँकी अवधिको तलबमध्ये जुन कम",
              "निर्माणमा कम्तीमा २ किस्तामा भुक्तानी (पहिलो किस्ता बढीमा २५%)",
              "पति-पत्नी दुवै योगदानकर्ता भए एउटै धितोबाट दुवैले अलग-अलग सीमामा लिन सकिने",
              "चुक्ता गरेपछि पुनः लिन सकिने; घर सापटीको ब्याज नतिरे शैक्षिक सापटी नपाइने (र उल्टो)",
            ],
          },
        ],
      },
      {
        kind: "STEPS",
        heading: "विशेष सापटी — सबैभन्दा छिटो र सजिलो",
        blocks: [
          {
            type: "steps",
            items: [
              "SSF mobile app वा SOSYS मा login गर्नुहोस्",
              "Loan section मा विशेष सापटी (Special Loan) रोज्नुहोस् — धितो चाहिँदैन, नागरिकता र परिचयपत्र भए पुग्छ",
              "अवकाश सुविधा योजनामा जम्मा रकमको ८०% सम्म माग्नुहोस्",
              "स्वीकृतिपछि रकम सीधै बैंक खातामा आउँछ — प्रयोगकर्ताहरूको अनुभवमा २४ घण्टाभित्रै",
            ],
          },
          {
            type: "note",
            text: "ब्याजदर सञ्चालक समितिले तोक्छ र समय-समयमा फेरिन्छ; असार मसान्तभित्र ब्याज नबुझाए साँवामा पुँजीकृत हुन्छ। विशेष सापटीबाहेक सबै सापटीको कुल योग १५ वर्षको तलबभन्दा बढी हुन सक्दैन।",
          },
        ],
      },
    ],
    videoIds: ["KZ44YSrPkjY", "Ym8rVCfLfH0", "FTzJA0o_gnU"],
    relatedServiceHref: "/request",
    sourceKeys: ["loan-directive-2079", "investment-procedure-2077"],
    lastVerified: "2026-07-11",
  },

  // 12 ─────────────────────────────────────────────────────────────
  {
    slug: "employer-monthly-compliance",
    categorySlug: "karmachari-ra-rojgardata",
    title: "रोजगारदाताको मासिक SSF Compliance Guide (HR का लागि)",
    shortAnswer:
      "सूचीकृत रोजगारदाताले हरेक नेपाली महिना सकिएको २५ दिनभित्र payroll declaration गरी ३१% योगदान दाखिला गर्नुपर्छ। ढिलो भए १०% ब्याज, र नबुझाए खाता रोक्का, इजाजत निलम्बन र राहदानी रोक्कासम्मको कारबाही हुनसक्छ — यो guide ले HR को मासिक routine पूरै समेट्छ।",
    isCornerstone: false,
    readingMinutes: 7,
    userCategories: ["employer"],
    sections: [
      {
        kind: "STEPS",
        heading: "मासिक routine (हरेक महिना)",
        blocks: [
          {
            type: "steps",
            items: [
              "महिना सकिएपछि SOSYS मा login गरी contribution declaration खोल्नुहोस्",
              "सबै कर्मचारीको आधारभूत पारिश्रमिक रुजु गर्नुहोस् — न्यूनतम पारिश्रमिकभन्दा कम हुनु हुँदैन",
              "नयाँ कर्मचारी थप्नुहोस् (नियुक्तिको ३ महिनाभित्र सूचीकरण अनिवार्य)",
              "छाडेका कर्मचारीको exit जनाउनुहोस् (१ महिनाभित्र कोषलाई जानकारी दिनुपर्छ)",
              "जम्मा ३१% रकम बैंकबाट दाखिला गर्नुहोस् — महिना सकिएको २५ दिनभित्र",
              "भौचर/रसिद HR record मा राख्नुहोस्",
            ],
          },
        ],
      },
      {
        kind: "CAUTION",
        heading: "ढिलाइ र छुटको मूल्य",
        blocks: [
          {
            type: "table",
            headers: ["अवस्था", "परिणाम"],
            rows: [
              ["२५ दिनभित्र दाखिला नगरे", "बाँकी रकममा १०% ब्याज"],
              ["सूचीकरण/योगदान नै नगरे", "बैंक खाता/सम्पत्ति रोक्का, छुट-सहुलियत र इजाजत निलम्बन, राहदानी रोक्कासम्म (ऐन दफा ९)"],
              ["नबुझाएको अवधिमा कर्मचारीको दुर्घटना/मृत्यु भए", "सुविधा बराबरको पूरै रकम रोजगारदाता स्वयंले तिर्नुपर्ने"],
              ["झुटा विवरणले सुविधा लिए/दिलाए", "बिगो बमोजिम जरिवाना; रु. १ लाखसम्म जरिवाना वा १ वर्ष कैद वा दुवै (दफा ४७)"],
            ],
          },
        ],
      },
      {
        kind: "MAIN",
        heading: "कर्मचारीले पाउने फाइदा — HR ले बुझाउनुपर्ने कुरा",
        blocks: [
          {
            type: "list",
            items: [
              "कर्मचारीको वास्तविक नयाँ भार १% मात्र हो (१०% त पहिल्यै सञ्चय कोष जान्थ्यो)",
              "श्रम ऐनका PF (दफा ५२), उपदान (दफा ५३), उपचार र दुर्घटना क्षतिपूर्ति सबै दायित्व SSF ले प्रतिस्थापन गर्छ — रोजगारदाताका लागि 'दायित्व-स्थानान्तरण संयन्त्र'",
              "पुरानो सञ्चय कोष/उपदान रकम कर्मचारीले चाहे SSF मा हस्तान्तरण गर्न सकिन्छ (श्रम नियमावली परिच्छेद ५)",
              "रोजगारीजन्य दुर्घटना भए ७ दिनभित्र कोषलाई खबर गर्नुहोस् — नत्र सम्झौता नभएको अस्पतालको रु. ७ लाखभन्दा बढी कोषले तिर्दैन",
            ],
          },
        ],
      },
    ],
    videoIds: ["k11wqBUUUyE", "OBJE-_uTRBg", "iZ4EnkNIzaI", "uS66xR9bQ-g"],
    relatedCalculatorHref: "/calculators/contribution",
    relatedServiceHref: "/services/employer-registration",
    sourceKeys: ["act-2074", "labour-act-2074", "listing-procedure-2075"],
    lastVerified: "2026-07-11",
  },
  // 13 ─────────────────────────────────────────────────────────────
  {
    slug: "claim-reject-samadhan",
    categorySlug: "claims-problems-solutions",
    title: "SSF Claim Reject भयो? १० प्रमुख कारण र समाधान",
    shortAnswer:
      "SSF दाबी अस्वीकृत हुने अधिकांश कारण सच्याउन मिल्ने हुन्छन् — अधूरो कागजात, योग्यता अवधि नपुग्नु, KYC नहुनु वा विवरण नमिल्नु। कारण पहिचान गरी कागजात मिलाएर पुनः पेश गर्न सकिन्छ; चित्त नबुझे ३५ दिनभित्र श्रम अदालतमा पुनरावेदन गर्ने बाटो पनि छ।",
    isCornerstone: true,
    readingMinutes: 8,
    userCategories: ["contributor", "employee", "family", "foreign"],
    sections: [
      {
        kind: "MAIN",
        heading: "१० प्रमुख कारण र तिनका समाधान",
        blocks: [
          {
            type: "table",
            headers: ["कारण", "समाधान"],
            rows: [
              ["सक्कल बिल/रसिद नभएको वा अस्पष्ट", "अस्पतालबाट प्रतिलिपि प्रमाणित गराएर पुनः पेश गर्नुहोस्; अबदेखि सबै सक्कल सुरक्षित राख्नुहोस्"],
              ["योग्यता अवधि नपुगेको (उपचार: पछिल्ला ६ महिनामा ३ महिना)", "contribution history जाँच्नुहोस् — रोजगारदाताले दाखिला ढिलो गरेको भए त्यो प्रमाण पेश गर्नुहोस्"],
              ["KYC verify नभएको", "पहिले KYC पूरा गर्नुहोस्, अनि दाबी पुनः पेश गर्नुहोस्"],
              ["नाम/जन्ममिति नागरिकतासँग नमिलेको", "Profile correction गराएर मात्र दाबी अगाडि बढ्छ"],
              ["दुर्घटनाको ७ दिनभित्र सूचना नदिएको", "ढिलाइको मनासिब कारण (ICU, बेहोस अवस्था आदि) प्रमाणसहित लेखेर पेश गर्नुहोस्"],
              ["सम्झौता नभएको अस्पतालमा उपचार", "रोजगारीजन्य दुर्घटनामा रु. ७ लाखसम्म मात्र पाइन्छ — बाँकीको पुनरावलोकन माग्न सकिन्छ"],
              ["वार्षिक सीमा (भर्ना १ लाख / OPD २० हजार) कटिसकेको", "आगामी वर्षको सीमामा दाबी मिल्ने खर्च छुट्याउनुहोस्; ६० महिने योगदानको ५०% थप सुविधा जाँच्नुहोस्"],
              ["दुर्घटना र औषधि उपचार दुवैबाट एउटै खर्च दाबी", "एउटै खर्च एक योजनाबाट मात्र पाइन्छ — सही योजना रोजेर पुनः पेश गर्नुहोस्"],
              ["nominee विवरण पुरानो/नभएको (मृत्यु दाबीमा)", "नाता प्रमाणित र हकवाला प्रमाणसहित कोषमा निवेदन दिनुहोस्"],
              ["फाराम गलत (अनुसूची नमिलेको)", "औषधि उपचार: अनुसूची १/२, मातृत्व: ३, दुर्घटना: ४/५, आश्रित: ६/७, निवृत्तभरण: ८–१० — सही फाराम Downloads page मा छ"],
            ],
          },
        ],
      },
      {
        kind: "STEPS",
        heading: "Reject भएपछिको ४-चरण प्रक्रिया",
        blocks: [
          {
            type: "steps",
            items: [
              "SOSYS मा rejection को exact कारण पढ्नुहोस् (धेरैजसो कागजातकै कमी हुन्छ)",
              "माथिको तालिकाबाट आफ्नो कारण भेट्टाएर कागजात/विवरण मिलाउनुहोस्",
              "दाबी पुनः पेश गर्नुहोस् — पुनः पेश गर्न रोक छैन",
              "चित्त नबुझे कोषको निर्णय भएको ३५ दिनभित्र श्रम अदालतमा पुनरावेदन गर्नुहोस् (ऐन दफा ५२)",
            ],
          },
          {
            type: "note",
            text: "झुटा विवरणले दाबी गर्नु कसूर हो — बिगो बमोजिम जरिवाना वा कैदसम्म हुनसक्छ (ऐन दफा ४७)। सधैँ सत्य विवरण मात्र पेश गर्नुहोस्।",
          },
        ],
      },
      {
        kind: "DOCUMENTS",
        heading: "पुनः पेश गर्दा तयार राख्ने",
        blocks: [
          {
            type: "list",
            items: [
              "Rejection notice/screenshot",
              "सक्कल बिल, प्रेस्क्रिप्सन, discharge summary",
              "Contribution history को प्रमाण",
              "सही अनुसूची फाराम (हाम्रो Downloads page बाट)",
              "KYC/profile सच्याइएको प्रमाण (लागू भए)",
            ],
          },
        ],
      },
    ],
    videoIds: ["m2oKN85hFhU", "S_Ch2yO7G3A", "EZS--UrRV04"],
    relatedServiceHref: "/services/kyc-verification",
    sourceKeys: ["procedure-2075-5th", "act-2074", "hospital-payment-2076"],
    lastVerified: "2026-07-11",
  },
];

export function articleBySlug(slug: string): ArticleContent | undefined {
  return articles.find((a) => a.slug === slug);
}

export function articlesByCategory(categorySlug: string): ArticleContent[] {
  return articles.filter((a) => a.categorySlug === categorySlug);
}
