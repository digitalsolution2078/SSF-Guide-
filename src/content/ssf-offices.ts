/**
 * Official Social Security Fund offices & contact channels.
 * Source: ssf.gov.np footer + /branch-offices (read 2026-11-07).
 * Re-check when the Fund publishes a new office notice (e.g. the Simra
 * office relocation notice, Kartik 2083).
 */

export const SSF_HOTLINE = "1116"; // toll-free, NTC/NCELL
export const SSF_CALL_CENTER = "01-5970016";
export const SSF_OFFICES_SYNCED_AT = "2026-11-07";

export interface SsfOffice {
  key: string;
  kind: "head" | "branch" | "contact";
  nameNe: string;
  nameEn: string;
  addressNe: string;
  addressEn: string;
  phones: string[];
  email: string;
  /** Province key used by the hospital directory for cross-linking */
  province: "koshi" | "madhesh" | "bagmati" | "gandaki" | "lumbini" | "karnali" | "sudurpashchim";
}

export const ssfOffices: SsfOffice[] = [
  {
    key: "kathmandu",
    kind: "head",
    nameNe: "केन्द्रीय कार्यालय",
    nameEn: "Head office",
    addressNe: "थापाथली, काठमाडौँ (पोष्ट बक्स ३३३)",
    addressEn: "Thapathali, Kathmandu (PO Box 333)",
    phones: ["01-5312066", "01-5356144", "01-5355463", "01-5355464"],
    email: "info@ssf.gov.np",
    province: "bagmati",
  },
  {
    key: "biratnagar",
    kind: "branch",
    nameNe: "शाखा कार्यालय बिराटनगर",
    nameEn: "Branch office, Biratnagar",
    addressNe: "कन्चनबारी चोक, बिराटनगर महानगरपालिका-४",
    addressEn: "Kanchanbari Chowk, Biratnagar-4",
    phones: ["021-466685"],
    email: "biratnagar@ssf.gov.np",
    province: "koshi",
  },
  {
    key: "simara",
    kind: "branch",
    nameNe: "शाखा कार्यालय सिमरा",
    nameEn: "Branch office, Simara",
    addressNe: "सिमरा मार्ग, जितपुर सिमरा उप-महानगरपालिका-२",
    addressEn: "Simara Marg, Jitpur Simara-2",
    phones: ["053-590299"],
    email: "simara@ssf.gov.np",
    province: "madhesh",
  },
  {
    key: "butwal",
    kind: "contact",
    nameNe: "सम्पर्क कार्यालय बुटवल",
    nameEn: "Contact office, Butwal",
    addressNe: "श्रम तथा रोजगार कार्यालयको भवन, बुटवल",
    addressEn: "Labour & Employment Office building, Butwal",
    phones: ["071-534816"],
    email: "butwal@ssf.gov.np",
    province: "lumbini",
  },
  {
    key: "nepalgunj",
    kind: "contact",
    nameNe: "सम्पर्क कार्यालय नेपालगञ्ज",
    nameEn: "Contact office, Nepalgunj",
    addressNe: "श्रम तथा रोजगार कार्यालयको भवन, नेपालगञ्ज",
    addressEn: "Labour & Employment Office building, Nepalgunj",
    phones: ["081-550490"],
    email: "nepalgunj@ssf.gov.np",
    province: "lumbini",
  },
  {
    key: "pokhara",
    kind: "contact",
    nameNe: "सम्पर्क कार्यालय पोखरा",
    nameEn: "Contact office, Pokhara",
    addressNe: "जनप्रिय मार्ग, माछापुच्छ्रे टोल, पोखरा-७",
    addressEn: "Janapriya Marg, Machhapuchhre Tole, Pokhara-7",
    phones: ["061-591291"],
    email: "pokhara@ssf.gov.np",
    province: "gandaki",
  },
  {
    key: "janakpur",
    kind: "contact",
    nameNe: "सम्पर्क कार्यालय जनकपुरधाम",
    nameEn: "Contact office, Janakpurdham",
    addressNe: "रामानन्द चोक, जनकपुरधाम उपमहानगरपालिका-९",
    addressEn: "Ramanand Chowk, Janakpurdham-9",
    phones: ["041-591024"],
    email: "janakpur@ssf.gov.np",
    province: "madhesh",
  },
];

/** Topic-specific desks at the head office (ssf.gov.np footer). */
export const ssfDesks: { topicNe: string; topicEn: string; phone?: string; email?: string }[] = [
  { topicNe: "सामान्य जानकारी / समस्या समाधान", topicEn: "General information / support", phone: "1116", email: "info@ssf.gov.np" },
  { topicNe: "सूचीकरण (Registration) सपोर्ट", topicEn: "Registration support", phone: "01-5360825", email: "reg@ssf.gov.np" },
  { topicNe: "KYC", topicEn: "KYC", email: "kyc@ssf.gov.np" },
  { topicNe: "मेडिकल दाबी भुक्तानी", topicEn: "Medical claim payment", phone: "01-5356315", email: "claim@ssf.gov.np" },
  { topicNe: "अवकाश दाबी / आश्रित परिवार पेन्सन", topicEn: "Retirement claim / dependent pension", phone: "01-5360851", email: "retirement@ssf.gov.np" },
  { topicNe: "योगदानकर्ता सापटी (Loan)", topicEn: "Contributor loans", phone: "01-5360837", email: "loan@ssf.gov.np" },
  { topicNe: "हिसाब मिलान (Reconciliation)", topicEn: "Account reconciliation", phone: "9851342273", email: "reconcsupport@ssf.gov.np" },
  { topicNe: "कोष संकलन", topicEn: "Collection", phone: "01-5355463", email: "collection@ssf.gov.np" },
  { topicNe: "वैदेशिक रोजगारका योगदानकर्ता (WhatsApp/Viber)", topicEn: "Migrant workers (WhatsApp/Viber)", phone: "9851351754", email: "migrantworker@ssf.gov.np" },
  { topicNe: "कर विवरण (Tax statement)", topicEn: "Tax statement", email: "tax@ssf.gov.np" },
  { topicNe: "IT सपोर्ट", topicEn: "IT support", email: "itsupport@ssf.gov.np" },
  { topicNe: "कानुनी परामर्श तथा अनुपालन", topicEn: "Legal advice & compliance", phone: "01-5312067", email: "ssfnepal@ssf.gov.np" },
];
