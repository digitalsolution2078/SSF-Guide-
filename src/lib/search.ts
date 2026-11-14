import { articles } from "@/content/articles";
import { faqs } from "@/content/faqs";
import { checklists } from "@/content/checklists";
import { videos } from "@/content/videos";
import { hospitals, PROVINCES } from "@/content/hospitals";

export interface SearchResult {
  type: "article" | "faq" | "checklist" | "video" | "calculator" | "hospital";
  title: string;
  snippet: string;
  href: string;
}

/** Nepali/English keyword → content mapping for common intents (spec §6) */
const KEYWORD_HINTS: Array<{ pattern: RegExp; hrefs: string[] }> = [
  { pattern: /पैसा\s*फिर्ता|refund|फिर्ता/i, hrefs: ["/school/pension-ra-retirement/jagir-chadepachi-ke-huncha"] },
  { pattern: /kyc|केवाइसी/i, hrefs: ["/school/kyc-profile-nominee/kyc-profile-claim-guide", "/checklists/kyc-verification"] },
  { pattern: /31|३१|percent|प्रतिशत/i, hrefs: ["/school/yogdan-ra-badfad/31-pratishat-kaha-jancha", "/calculators/allocation"] },
  { pattern: /विदेश|बिदेश|foreign|abroad|migrant|खाडी|दुबई|कतार|मलेसिया|कोरिया/i, hrefs: ["/foreign", "/school/baideshik-rojgari/foreign-employment-guide", "/calculators/foreign-employment"] },
  { pattern: /रोजगारदाता|employer|payroll|hr\b|कम्पनी|दाखिला|deposit/i, hrefs: ["/employer"] },
  { pattern: /दाबी|दावी|claim|reject|अस्वीकृत|उपचार खर्च|फिर्ता/i, hrefs: ["/claims"] },
  { pattern: /course|कोर्स|सिक्न|certificate|प्रमाणपत्र|quiz/i, hrefs: ["/school/courses"] },
  { pattern: /my ssf|मेरो ssf|snapshot|milestone/i, hrefs: ["/my-ssf"] },
  { pattern: /pension|पेन्सन|निवृत्तभरण/i, hrefs: ["/school/pension-ra-retirement/pension-ra-retirement-guide"] },
  { pattern: /देखिएन|missing|नदेखिए/i, hrefs: ["/faq/contribution-nadekhiema"] },
  { pattern: /जागिर|छाडे|leaving|quit/i, hrefs: ["/school/pension-ra-retirement/jagir-chadepachi-ke-huncha", "/calculators/job-leaving"] },
  { pattern: /सापटी|loan|ऋण|कर्जा|emi/i, hrefs: ["/loans", "/faq/sapati-kasari-line", "/calculators/loan"] },
  { pattern: /अस्पताल|hospital|उपचार|treatment|medical|मेडिकल/i, hrefs: ["/hospitals"] },
];

const loansHubEntry: SearchResult = {
  type: "calculator",
  title: "SSF सापटी (Loans) — घर, शैक्षिक, विशेष",
  snippet: "रु. १.५ करोडसम्म घर सापटी ५.८५–६%, शैक्षिक रु. ३५ लाख, विशेष सापटी धितो बिना — योग्यता र EMI क्याल्कुलेटर।",
  href: "/loans",
};

const hubEntries: SearchResult[] = [
  { type: "calculator", title: "My SSF — मेरो योगदान, पेन्सन, सापटी र milestone", snippet: "तीन अङ्क राख्नुहोस्; सबै क्याल्कुलेटर र सापटी जाँच आफैँ भरिन्छ।", href: "/my-ssf" },
  { type: "calculator", title: "वैदेशिक रोजगार hub (Migrant worker hub)", snippet: "विदेशबाट कसरी तिर्ने, कति तिर्ने, परिवारको उपचार, फर्किएपछिका नियम।", href: "/foreign" },
  { type: "calculator", title: "रोजगारदाता toolkit (Employer toolkit)", snippet: "Payroll sheet (३१%), दाखिला म्याद क्यालेन्डर, नयाँ कर्मचारी सूचीकरण।", href: "/employer" },
  { type: "calculator", title: "दाबी (Claim) wizard", snippet: "कुन दाबी, कहाँ, कुन कागजात — र अस्वीकृत भए के गर्ने।", href: "/claims" },
  { type: "article", title: "SSF School कोर्स — quiz र प्रमाणपत्रसहित", snippet: "क्रमैसँग सिक्नुहोस्: परिचय, योगदान, पेन्सन, उपचार, KYC।", href: "/school/courses" },
];

const hospitalIndexEntry: SearchResult = {
  type: "hospital",
  title: "SSF आबद्ध अस्पताल सूची (Affiliated hospitals)",
  snippet: `${hospitals.length} अस्पताल — प्रदेश/जिल्ला अनुसार खोज्नुहोस्, नक्सासहित।`,
  href: "/hospitals",
};

const calculatorEntries: SearchResult[] = [
  {
    type: "calculator",
    title: "Employee–Employer Contribution Calculator",
    snippet: "श्रमिक ११% + रोजगारदाता २०% = ३१% — मासिक/वार्षिक योगदान हिसाब।",
    href: "/calculators/contribution",
  },
  {
    type: "calculator",
    title: "31% Contribution Breakdown",
    snippet: "जम्मा रकम चार योजनामा कसरी बाँडिन्छ।",
    href: "/calculators/allocation",
  },
  {
    type: "calculator",
    title: "Foreign Employment Contribution Calculator",
    snippet: "वैदेशिक रोजगारीको न्यूनतम २१.३३% योगदान।",
    href: "/calculators/foreign-employment",
  },
  {
    type: "calculator",
    title: "Job Leaving Scenario Guide",
    snippet: "जागिर छाडेपछि रकमको के हुन्छ — निर्देशित जानकारी।",
    href: "/calculators/job-leaving",
  },
];

function matches(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export function searchContent(query: string): SearchResult[] {
  const q = query.trim();
  if (q.length < 2) return [];

  const results: SearchResult[] = [];
  const seen = new Set<string>();
  const push = (r: SearchResult) => {
    if (!seen.has(r.href)) {
      seen.add(r.href);
      results.push(r);
    }
  };

  // keyword-intent hints first
  for (const hint of KEYWORD_HINTS) {
    if (hint.pattern.test(q)) {
      for (const href of hint.hrefs) {
        const all: SearchResult[] = [
          ...articles.map((a) => ({
            type: "article" as const,
            title: a.title,
            snippet: a.shortAnswer.slice(0, 140),
            href: `/school/${a.categorySlug}/${a.slug}`,
          })),
          ...checklists.map((c) => ({
            type: "checklist" as const,
            title: c.processName,
            snippet: c.applicableUser,
            href: `/checklists/${c.slug}`,
          })),
          ...faqs.map((f) => ({
            type: "faq" as const,
            title: f.question,
            snippet: "",
            href: `/faq/${f.slug}`,
          })),
          ...calculatorEntries,
          hospitalIndexEntry,
          loansHubEntry,
          ...hubEntries,
        ];
        const found = all.find((r) => r.href === href);
        if (found) push(found);
      }
    }
  }

  // full-text over titles + bodies
  for (const a of articles) {
    const body =
      a.title +
      " " +
      a.shortAnswer +
      " " +
      a.sections.map((s) => s.heading).join(" ");
    if (matches(body, q)) {
      push({
        type: "article",
        title: a.title,
        snippet: a.shortAnswer.slice(0, 140),
        href: `/school/${a.categorySlug}/${a.slug}`,
      });
    }
  }
  for (const f of faqs) {
    const body =
      f.question +
      " " +
      f.answerBlocks
        .map((b) => ("text" in b ? b.text : "items" in b ? b.items.join(" ") : ""))
        .join(" ");
    if (matches(body, q)) {
      push({ type: "faq", title: f.question, snippet: "", href: `/faq/${f.slug}` });
    }
  }
  for (const c of checklists) {
    if (matches(c.processName + " " + c.applicableUser, q)) {
      push({
        type: "checklist",
        title: c.processName,
        snippet: c.applicableUser,
        href: `/checklists/${c.slug}`,
      });
    }
  }
  for (const calc of calculatorEntries) {
    if (matches(calc.title + " " + calc.snippet, q)) push(calc);
  }
  // individual hospitals — name / district / province match
  for (const h of hospitals) {
    if (matches(`${h.name} ${h.district} ${h.address} ${PROVINCES[h.province].ne} ${PROVINCES[h.province].en}`, q)) {
      push({
        type: "hospital",
        title: h.name,
        snippet: `${h.address ? h.address + " · " : ""}${h.district}, ${PROVINCES[h.province].ne}`,
        href: `/hospitals?q=${encodeURIComponent(h.name)}`,
      });
    }
  }
  for (const v of videos) {
    if (v.kind !== "opinion" && matches(v.title + " " + v.description, q)) {
      push({
        type: "video",
        title: v.title,
        snippet: v.description,
        href: `/school/${v.categorySlug}`,
      });
    }
  }

  return results.slice(0, 20);
}
