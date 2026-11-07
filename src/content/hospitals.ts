/**
 * SSF affiliated (MoU) hospitals — GENERATED FILE, do not edit by hand.
 * Regenerate with `npm run sync:hospitals`.
 *
 * Source: https://ssf.gov.np/affiliated-hospitals
 * Synced: 2026-11-07 · 123 hospitals
 */

export type ProvinceKey =
  | "koshi"
  | "madhesh"
  | "bagmati"
  | "gandaki"
  | "lumbini"
  | "karnali"
  | "sudurpashchim";

export type HospitalSpecialty =
  | "general"
  | "teaching"
  | "eye"
  | "heart"
  | "cancer"
  | "children"
  | "dental"
  | "ortho"
  | "trauma"
  | "neuro";

export interface Hospital {
  /** Fund's own record id */
  id: number;
  /** Official name as listed by the Fund (Nepali) */
  name: string;
  province: ProvinceKey;
  district: string;
  address: string;
  lat?: number;
  lng?: number;
  /** Inferred from the name — used only for filtering */
  specialty: HospitalSpecialty;
}

export const HOSPITALS_SYNCED_AT = "2026-11-07";
export const HOSPITALS_SOURCE_URL = "https://ssf.gov.np/affiliated-hospitals";
export const HOSPITAL_RATE_LIST_URL =
  "https://ssf.gov.np/images/page_content/16505202087003_Service%20price%20rate%20new.pdf";

export const PROVINCE_ORDER: ProvinceKey[] = ["koshi","madhesh","bagmati","gandaki","lumbini","karnali","sudurpashchim"];

export const PROVINCES: Record<ProvinceKey, { ne: string; en: string; short: string }> = {
  koshi: { ne: "कोशी प्रदेश", en: "Koshi", short: "कोशी" },
  madhesh: { ne: "मधेश प्रदेश", en: "Madhesh", short: "मधेश" },
  bagmati: { ne: "बागमती प्रदेश", en: "Bagmati", short: "बागमती" },
  gandaki: { ne: "गण्डकी प्रदेश", en: "Gandaki", short: "गण्डकी" },
  lumbini: { ne: "लुम्बिनी प्रदेश", en: "Lumbini", short: "लुम्बिनी" },
  karnali: { ne: "कर्णाली प्रदेश", en: "Karnali", short: "कर्णाली" },
  sudurpashchim: { ne: "सुदूरपश्चिम प्रदेश", en: "Sudurpashchim", short: "सुदूरपश्चिम" },
};

export const SPECIALTIES: Record<HospitalSpecialty, { ne: string; en: string }> = {
  general: { ne: "सामान्य / बहुविशेषज्ञ", en: "General / multi-specialty" },
  teaching: { ne: "मेडिकल कलेज / शिक्षण", en: "Medical college / teaching" },
  eye: { ne: "आँखा", en: "Eye" },
  heart: { ne: "मुटु", en: "Heart" },
  cancer: { ne: "क्यान्सर", en: "Cancer" },
  children: { ne: "बाल / महिला", en: "Children / women" },
  dental: { ne: "दन्त", en: "Dental" },
  ortho: { ne: "हाडजोर्नी", en: "Orthopaedic" },
  trauma: { ne: "ट्रमा", en: "Trauma" },
  neuro: { ne: "न्यूरो", en: "Neuro" },
};

export const hospitals: Hospital[] = [
  { id: 14, name: "ओखलढुंगा सामुदायिक अस्पताल ( मिसन हस्पिटल )", province: "koshi", district: "ओखलढुंगा", address: "ओखलढुंगा", lat: 27.33097, lng: 86.49975, specialty: "general" },
  { id: 7, name: "मनमोहन मेमोरियल पुर्वाञ्चल क्षेत्रिय सामुदायिक अस्पताल", province: "koshi", district: "झापा", address: "बिर्तामोड - ०५", lat: 26.64393, lng: 87.99694, specialty: "general" },
  { id: 8, name: "बि एण्ड सी मेडिकल कलेज एण्ड टिचिङ हस्पिटल प्रा. लि.", province: "koshi", district: "झापा", address: "बिर्तामोड", lat: 26.64538, lng: 87.9977, specialty: "teaching" },
  { id: 53, name: "लाईफ लाईन अस्पताल", province: "koshi", district: "झापा", address: "दमक", lat: 26.66723, lng: 87.69571, specialty: "general" },
  { id: 71, name: "आम्दा मेची अस्पताल", province: "koshi", district: "झापा", address: "धुलाबारी", lat: 26.66723, lng: 88.09456, specialty: "general" },
  { id: 72, name: "आम्दा अस्पताल, दमक", province: "koshi", district: "झापा", address: "दमक", lat: 26.67509, lng: 87.68748, specialty: "general" },
  { id: 99, name: "ओम साई पाथिभरा अस्पताल प्रा.लि.", province: "koshi", district: "झापा", address: "भद्रपुर,झापा", specialty: "general" },
  { id: 107, name: "मेची दृष्टि आँखा अस्पताल", province: "koshi", district: "झापा", address: "झापा", specialty: "eye" },
  { id: 108, name: "मेची नेत्रालय एण्ड अप्थाल्मिक रिसर्च सेन्टर", province: "koshi", district: "झापा", address: "झापा", specialty: "eye" },
  { id: 109, name: "विर्तामोड आँखा अस्पताल", province: "koshi", district: "झापा", address: "विर्तामोड", specialty: "eye" },
  { id: 110, name: "विर्ताज्योति आँखा अस्पताल", province: "koshi", district: "झापा", address: "झापा", specialty: "eye" },
  { id: 125, name: "पूर्ण टुङ्ग विरता सिटी हस्पिटल एण्ड रिसर्च सेन्टर", province: "koshi", district: "झापा", address: "विर्तामोड- १", specialty: "general" },
  { id: 10, name: "हाम्रो अस्पताल प्रा. लि.", province: "koshi", district: "मोरङ", address: "बिराटनगर ०४", lat: 26.47834, lng: 87.27522, specialty: "general" },
  { id: 11, name: "बिराट मेडिकल कलेज एण्ड टिचिङ हस्पिटल", province: "koshi", district: "मोरङ", address: "टंकिसिनुवारी, बिराटनगर", lat: 26.52355, lng: 87.27903, specialty: "teaching" },
  { id: 12, name: "नोवेल मेडिकल कलेज टिचिङ हस्पिटल प्रा.लि.", province: "koshi", district: "मोरङ", address: "बिराटनगर ०४", lat: 26.48967, lng: 87.27023, specialty: "teaching" },
  { id: 13, name: "मोरङ्ग सहकारी अस्पताल", province: "koshi", district: "मोरङ", address: "सोमबारे हाट, बिराटनगर", lat: 26.45271, lng: 87.27896, specialty: "general" },
  { id: 49, name: "रामलाल गोल्छा आँखा अस्पताल", province: "koshi", district: "मोरङ", address: "बिराटनगर", lat: 26.46352, lng: 87.2845, specialty: "eye" },
  { id: 60, name: "न्यूरो कार्डियो एण्ड मल्टिस्पेसियलिटि हस्पिटल", province: "koshi", district: "मोरङ", address: "शंखधर साख्वाः मार्ग, विराटनगर", lat: 26.45316, lng: 87.28183, specialty: "heart" },
  { id: 61, name: "अरनिको हस्पिटल प्रा.लि.", province: "koshi", district: "मोरङ", address: "उर्लाबारी- ५", lat: 26.6645, lng: 87.62918, specialty: "general" },
  { id: 66, name: "बिराट आखा अस्पताल", province: "koshi", district: "मोरङ", address: "बिराटनगर", lat: 26.43738, lng: 87.27953, specialty: "eye" },
  { id: 98, name: "लाइफ गार्ड अस्पताल", province: "koshi", district: "मोरङ", address: "वरगाछि, विराटनगर", specialty: "general" },
  { id: 124, name: "जीवन विकास सामुदायिक अस्पताल", province: "koshi", district: "मोरङ", address: "कटहरी, २ मोरङ, हल्दिवारी", specialty: "general" },
  { id: 9, name: "पशुपती मोडेल हस्पिटल प्रा.लि.", province: "koshi", district: "सुनसरी", address: "इटहरी ०९", lat: 26.65945, lng: 87.27534, specialty: "general" },
  { id: 69, name: "इटहरी ग्लोवल आइ हस्पिटल प्रा.लि.", province: "koshi", district: "सुनसरी", address: "इटहरी", lat: 26.66399, lng: 87.27398, specialty: "eye" },
  { id: 81, name: "दुहवी सिटी हस्पिटल प्रा.लि.", province: "koshi", district: "सुनसरी", address: "दुहवी-३", specialty: "general" },
  { id: 88, name: "इनरुवा अस्पताल, इनरुवा", province: "koshi", district: "सुनसरी", address: "इनरुवा", lat: 26.6006, lng: 87.15084, specialty: "general" },
  { id: 100, name: "चतरा अस्पताल", province: "koshi", district: "सुनसरी", address: "चतरा", specialty: "general" },
  { id: 101, name: "सान्भि सिटि अस्पताल", province: "koshi", district: "सुनसरी", address: "इटहरी", specialty: "general" },
  { id: 128, name: "वेदान्त हस्पिटल", province: "koshi", district: "सुनसरी", address: "इटहरी", lat: 26.66249, lng: 87.2786, specialty: "general" },
  { id: 21, name: "जानकी हेल्थ केयर", province: "madhesh", district: "धनुषा", address: "जनकपुर", lat: 26.7326, lng: 85.92038, specialty: "general" },
  { id: 89, name: "लालगढ मोडल अस्पताल", province: "madhesh", district: "धनुषा", address: "लालगढ", specialty: "general" },
  { id: 93, name: "कृष्ण मेडिकल एण्ड टेक्निकल रिसर्च सेन्टर प्रा.लि.", province: "madhesh", district: "धनुषा", address: "ब्रम्हपुरी-९, जनकपुरधाम", lat: 26.74333, lng: 85.92505, specialty: "general" },
  { id: 15, name: "नेशनल मेडिकल कलेज प्रा.लि.", province: "madhesh", district: "पर्सा", address: "बिरगञ्ज १०", lat: 27.01151, lng: 84.89611, specialty: "teaching" },
  { id: 16, name: "बिरगञ्ज हेल्थ केयर अस्पताल", province: "madhesh", district: "पर्सा", address: "बिरगञ्ज ०३", lat: 27.04482, lng: 84.89871, specialty: "general" },
  { id: 17, name: "गण्डक अस्पताल", province: "madhesh", district: "पर्सा", address: "बिरगंज", lat: 27.0473, lng: 84.90167, specialty: "general" },
  { id: 18, name: "स्पर्स अस्पताल प्रा.लि.", province: "madhesh", district: "पर्सा", address: "बिरगंज", lat: 27.04141, lng: 84.89759, specialty: "general" },
  { id: 19, name: "किरण आँखा अस्पताल", province: "madhesh", district: "पर्सा", address: "बिरगंज", lat: 27.01295, lng: 84.88586, specialty: "eye" },
  { id: 52, name: "प्रभु अस्पताल", province: "madhesh", district: "पर्सा", address: "पानी ट्यांकी, बिरगंज", lat: 27.01379, lng: 84.88399, specialty: "general" },
  { id: 65, name: "बिरगंज दृष्टि आँखा अस्पताल", province: "madhesh", district: "पर्सा", address: "बिरगंज", lat: 27.0319, lng: 84.88877, specialty: "eye" },
  { id: 84, name: "सूर्य हस्पिटल प्रा.लि. वीरगञ्ज, पर्सा", province: "madhesh", district: "पर्सा", address: "वीरगञ्ज", lat: 27.00444, lng: 84.87268, specialty: "general" },
  { id: 96, name: "आशाराम हस्पिटल प्रा.लि.", province: "madhesh", district: "पर्सा", address: "बिरगञ्ज ०८", lat: 27.01591, lng: 84.88624, specialty: "general" },
  { id: 103, name: "नारायणी बयोधा अस्पताल", province: "madhesh", district: "पर्सा", address: "वीरगंज", specialty: "general" },
  { id: 104, name: "भवानी अस्पताल", province: "madhesh", district: "पर्सा", address: "वीरगंज", specialty: "general" },
  { id: 116, name: "साउथ सिटि हिमाल हस्पिटल प्रा.लि.", province: "madhesh", district: "पर्सा", address: "बिरगञ्ज", specialty: "general" },
  { id: 33, name: "एल. एस. न्यूरो एण्ड जनरल हस्पिटल", province: "madhesh", district: "बारा", address: "परवानीपुर-५", lat: 27.03119, lng: 84.90403, specialty: "neuro" },
  { id: 95, name: "एभरग्रीन तराई सिमरा हस्पिटल प्रा.लि.", province: "madhesh", district: "बारा", address: "जितपुर सिमरा २", lat: 27.16531, lng: 84.97238, specialty: "general" },
  { id: 23, name: "शुभ स्वस्तिक अस्पताल", province: "madhesh", district: "महोत्तरी", address: "बर्दिबास", lat: 26.98982, lng: 85.88886, specialty: "general" },
  { id: 94, name: "चन्द्रपुर हस्पिटल प्रा.लि.", province: "madhesh", district: "रौतहट", address: "चन्द्रपुर ४", lat: 27.11593, lng: 85.35802, specialty: "general" },
  { id: 22, name: "छिन्नमस्ता अस्पताल", province: "madhesh", district: "सप्तरी", address: "राजविराज", lat: 26.5333, lng: 86.75, specialty: "general" },
  { id: 20, name: "नमुना सामुदायिक अस्पताल", province: "madhesh", district: "सर्लाही", address: "हरिवन", lat: 27.08961, lng: 85.55301, specialty: "general" },
  { id: 119, name: "फुलकुमारी महतो मेमोरिला अस्पताल", province: "madhesh", district: "सिराहा", address: "सिराहा ११, मधेश प्रदेश", specialty: "general" },
  { id: 24, name: "बीर अस्पताल", province: "bagmati", district: "काठमाडौं", address: "काठमाण्डौ", lat: 27.70484, lng: 85.31365, specialty: "general" },
  { id: 25, name: "त्रि.बि. शिक्षण अस्पताल", province: "bagmati", district: "काठमाडौं", address: "महाराजगंज", lat: 27.73601, lng: 85.33029, specialty: "teaching" },
  { id: 26, name: "मनमोहन मेमोरियल मेडिकल कलेज तथा शिक्षण अस्पताल", province: "bagmati", district: "काठमाडौं", address: "स्वयंभु", lat: 27.71342, lng: 85.28147, specialty: "teaching" },
  { id: 28, name: "काठमाण्डौ मेडिकल कलेज (KMC)", province: "bagmati", district: "काठमाडौं", address: "सिनामंगल", lat: 27.696, lng: 85.3535, specialty: "teaching" },
  { id: 29, name: "ने.अ.सं. नेपाल अर्थोपेडिक अस्पताल", province: "bagmati", district: "काठमाडौं", address: "जोरपाटी", lat: 27.72018, lng: 85.38119, specialty: "ortho" },
  { id: 30, name: "तिलगंगा आँखा अस्पताल", province: "bagmati", district: "काठमाडौं", address: "तिलगंगा", lat: 27.70562, lng: 85.34826, specialty: "eye" },
  { id: 31, name: "दृष्टि आई केयर", province: "bagmati", district: "काठमाडौं", address: "कलंकी", lat: 27.6987, lng: 85.28111, specialty: "eye" },
  { id: 32, name: "एभरेष्ट अस्पताल प्रा. लि.", province: "bagmati", district: "काठमाडौं", address: "नयाँ बानेश्वर", lat: 27.68855, lng: 85.333, specialty: "general" },
  { id: 34, name: "शंकरापुर अस्पताल प्रा.लि.", province: "bagmati", district: "काठमाडौं", address: "गोकर्णेश्वर ०६", lat: 27.72153, lng: 85.37847, specialty: "general" },
  { id: 47, name: "पिपुल्स डेन्टल कलेज एण्ड हस्पिटल ( General Treatment only)", province: "bagmati", district: "काठमाडौं", address: "नयाँबजार सोह्रखुट्टे", lat: 27.72434, lng: 85.30386, specialty: "dental" },
  { id: 50, name: "फ्रन्टलाइन हस्पिटल", province: "bagmati", district: "काठमाडौं", address: "बत्तीसपुतली, पुरानो बानेश्वर", lat: 27.70251, lng: 85.33845, specialty: "general" },
  { id: 56, name: "सहिद गंगालाल राष्ट्रिय मुटु केन्द्र", province: "bagmati", district: "काठमाडौं", address: "बाँसबारी", lat: 27.74544, lng: 85.34153, specialty: "heart" },
  { id: 59, name: "राष्ट्रिय ट्रमा सेण्टर", province: "bagmati", district: "काठमाडौं", address: "महांकाल, काठमाडौँ", lat: 27.70425, lng: 85.3108, specialty: "trauma" },
  { id: 68, name: "नेपाल मेडिकल कलेज प्रा.लि.", province: "bagmati", district: "काठमाडौं", address: "जोरपाटी, अत्तरखेल", lat: 27.73335, lng: 85.38075, specialty: "teaching" },
  { id: 78, name: "ओम हस्पिटल एण्ड रिसर्च सेन्टर प्रा.लि.", province: "bagmati", district: "काठमाडौं", address: "चावहिल", lat: 27.72142, lng: 85.3448, specialty: "general" },
  { id: 79, name: "मनमोहन कार्डियोथोरासिक भास्कुलर एण्ड ट्रान्सप्लाण्ट सेण्टर", province: "bagmati", district: "काठमाडौं", address: "महाराजगंज", lat: 27.73589, lng: 85.32879, specialty: "heart" },
  { id: 91, name: "जनमैत्री अस्पताल, बालाजु (सिल्भर लाइन अस्पताल)", province: "bagmati", district: "काठमाडौं", address: "बालाजु", lat: 27.72831, lng: 85.30372, specialty: "general" },
  { id: 113, name: "भेनस हस्पिटल प्रा.लि", province: "bagmati", district: "काठमाडौं", address: "मध्य बानेश्वर", lat: 27.69722, lng: 85.33508, specialty: "general" },
  { id: 114, name: "कान्ति बाल अस्पताल", province: "bagmati", district: "काठमाडौं", address: "महाराजगंज", lat: 27.73468, lng: 85.3259, specialty: "children" },
  { id: 123, name: "काठमाण्डौ इन्टिच्यूट अफ चाइल्ड हेल्थ ( KIOCH)", province: "bagmati", district: "काठमाडौं", address: "हेपाली हाइट , वुढानिलकण्ठ", specialty: "children" },
  { id: 36, name: "शीर मेमोरियल अस्पताल", province: "bagmati", district: "काभ्रेपलाञ्चोक", address: "बनेपा", lat: 27.6332, lng: 85.5276, specialty: "general" },
  { id: 58, name: "धुलिखेल अस्पताल", province: "bagmati", district: "काभ्रेपलाञ्चोक", address: "धुलिखेल", lat: 27.61677, lng: 85.54538, specialty: "general" },
  { id: 27, name: "नेशनल सिटी हस्पिटल लि.", province: "bagmati", district: "चितवन", address: "भरतपुर १०", lat: 27.68129, lng: 84.34864, specialty: "general" },
  { id: 37, name: "कलेज अफ मेडिकल साइन्सेस (COMS)(पुरानो मेडिकल कलेज)", province: "bagmati", district: "चितवन", address: "भरतपुर १०", lat: 27.68375, lng: 84.43588, specialty: "teaching" },
  { id: 38, name: "चितवन मेडिकल कलेज टिचिङ हस्पिटल", province: "bagmati", district: "चितवन", address: "भरतपुर १०", lat: 27.65361, lng: 84.43447, specialty: "teaching" },
  { id: 55, name: "मनकामना अस्पताल", province: "bagmati", district: "चितवन", address: "भरतपुर-१०", lat: 27.67847, lng: 84.42903, specialty: "general" },
  { id: 86, name: "चितवन आँखा अस्पताल", province: "bagmati", district: "चितवन", address: "भरतपुर १०", lat: 27.67809, lng: 84.43156, specialty: "eye" },
  { id: 92, name: "भरतपुर सेन्ट्रल हस्पिटल", province: "bagmati", district: "चितवन", address: "भरतपुर १०", lat: 27.6783, lng: 84.4309, specialty: "general" },
  { id: 97, name: "भरतपुर अस्पताल", province: "bagmati", district: "चितवन", address: "भरतपुर", lat: 27.68188, lng: 84.43399, specialty: "general" },
  { id: 105, name: "नारायणी सामुदायिक अस्पताल", province: "bagmati", district: "चितवन", address: "भरतपुर", specialty: "general" },
  { id: 106, name: "मौलाकालिका अस्पताल", province: "bagmati", district: "चितवन", address: "भरतपुर", specialty: "general" },
  { id: 112, name: "भरोसा हस्पिटल,चितवन प्रा.लि.", province: "bagmati", district: "चितवन", address: "भरतपुर-१०", lat: 27.67957, lng: 84.432, specialty: "general" },
  { id: 48, name: "काठमाडौँ क्यान्सर सेन्टर", province: "bagmati", district: "भक्तपुर", address: "नालारोड, ताथली", lat: 27.66941, lng: 85.46331, specialty: "cancer" },
  { id: 85, name: "सिद्धि स्मृति महिला तथा बाल अस्पताल", province: "bagmati", district: "भक्तपुर", address: "भक्तपुर", lat: 27.69551, lng: 85.3246, specialty: "children" },
  { id: 87, name: "भक्तपुर इन्टरनेसनल हस्पिटल", province: "bagmati", district: "भक्तपुर", address: "कौशलटार", lat: 27.67462, lng: 85.36642, specialty: "general" },
  { id: 130, name: "बीपी आइ फाउन्डेसन", province: "bagmati", district: "भक्तपुर", address: "मध्यपुर थिमि नगरपालिका १, लोकन्थली", lat: 27.67113, lng: 85.35363, specialty: "eye" },
  { id: 39, name: "मकवानपुर सहकारी अस्पताल", province: "bagmati", district: "मकवानपुर", address: "हेटौडा १, भिन्तुनापथ", specialty: "general" },
  { id: 40, name: "चुरेहिल अस्पताल प्रा.लि.", province: "bagmati", district: "मकवानपुर", address: "हेटौडा ११, थानाभर्याङ", lat: 27.43131, lng: 85.01074, specialty: "general" },
  { id: 83, name: "सन्चो अस्पताल प्रा. लि", province: "bagmati", district: "मकवानपुर", address: "हेटौडा १, भिन्तुनापथ", specialty: "general" },
  { id: 35, name: "पाटन स्वास्थ्य विज्ञान प्रतिष्ठान (पाटन अस्पताल)", province: "bagmati", district: "ललितपुर", address: "ललितपुर", lat: 27.71154, lng: 85.2896, specialty: "teaching" },
  { id: 67, name: "मेघा अस्पताल प्रा.लि.", province: "bagmati", district: "ललितपुर", address: "धोबिघाट", lat: 27.67702, lng: 85.30051, specialty: "general" },
  { id: 76, name: "किस्ट मेडिकल कलेज एण्ड टिचिङ्ग अस्पताल", province: "bagmati", district: "ललितपुर", address: "इमाडोल", lat: 27.66294, lng: 85.3351, specialty: "teaching" },
  { id: 115, name: "इटहरी ग्लोवल आइ हस्पिटल ललितपुर", province: "bagmati", district: "ललितपुर", address: "तिखेदेवल, ललितपुर", lat: 27.66095, lng: 85.31699, specialty: "eye" },
  { id: 41, name: "चरक मेमोरियल अस्पताल", province: "gandaki", district: "कास्की", address: "पोखरा म.न.पा. ०८", lat: 28.20472, lng: 83.98224, specialty: "general" },
  { id: 42, name: "ग्यालेक्सी अस्पताल", province: "gandaki", district: "कास्की", address: "पोखरा", lat: 28.20532, lng: 83.99733, specialty: "general" },
  { id: 62, name: "मणिपाल टिचिङ्ग अस्पताल", province: "gandaki", district: "कास्की", address: "पोखरा", lat: 28.24162, lng: 83.98503, specialty: "teaching" },
  { id: 64, name: "दृष्टि आँखा अस्पताल प्रा.लि.", province: "gandaki", district: "कास्की", address: "पोखरा", lat: 28.21896, lng: 83.98815, specialty: "eye" },
  { id: 70, name: "फेवा सिटि अस्पताल", province: "gandaki", district: "कास्की", address: "पोखरा", lat: 28.20681, lng: 83.98165, specialty: "general" },
  { id: 74, name: "गण्डकी मेडिकल कल‍ेज एण्ड टिचिङ्ग हस्पिटल", province: "gandaki", district: "कास्की", address: "पोखरा", lat: 28.21117, lng: 83.98712, specialty: "teaching" },
  { id: 77, name: "मेडिप्लस अस्पताल", province: "gandaki", district: "कास्की", address: "पोखरा -११, रानिपौवा", lat: 28.2229, lng: 83.9923, specialty: "general" },
  { id: 102, name: "एक्स सर्भिसमेन आविश्कार अस्पताल,", province: "gandaki", district: "कास्की", address: "पोखरा", specialty: "general" },
  { id: 117, name: "पद्माश्री अस्पताल पोखरा", province: "gandaki", district: "कास्की", address: "पोखरा-९, कास्की", specialty: "general" },
  { id: 127, name: "आई एन एफ नेपाल, हरियोखर्क अस्पताल", province: "gandaki", district: "कास्की", address: "पोखरा–१५, कास्की", specialty: "general" },
  { id: 126, name: "रत्नहरि अस्पताल", province: "gandaki", district: "तनहुँ", address: "दमौली", specialty: "general" },
  { id: 51, name: "देवचुली अस्पताल", province: "gandaki", district: "नवलपुर", address: "दलदले", lat: 27.65322, lng: 84.21016, specialty: "general" },
  { id: 80, name: "नवलपुर अस्पताल प्रा.ली.", province: "gandaki", district: "नवलपुर", address: "कावासोती-८", specialty: "general" },
  { id: 57, name: "मितेरी अस्पताल", province: "lumbini", district: "दाङ", address: "घोराही", lat: 28.03603, lng: 82.49196, specialty: "general" },
  { id: 111, name: "राप्ति स्वास्थ्य विज्ञान प्रतिष्ठान", province: "lumbini", district: "दाङ", address: "घोराहि, दाङ", specialty: "teaching" },
  { id: 43, name: "लर्डबुद्ध एजुकेशनल एकडेमी लि.(नेपालगंज मेडिकल कलेज)", province: "lumbini", district: "बाँके", address: "कोहलपुर-११", lat: 28.1984, lng: 81.67781, specialty: "teaching" },
  { id: 44, name: "संजिवनी कलेज अफ मेडिकल साइन्सेज", province: "lumbini", district: "बाँके", address: "नेपालगन्ज", lat: 28.05977, lng: 81.61745, specialty: "teaching" },
  { id: 45, name: "युनिभसर्ल कलेज अफ मेडिकल साइन्स (UCMS)", province: "lumbini", district: "रुपन्देही", address: "भैरहवा", lat: 27.48904, lng: 83.44839, specialty: "teaching" },
  { id: 46, name: "गौतमबुद्ध मुटु अस्पताल", province: "lumbini", district: "रुपन्देही", address: "रामनगर, वुटवल", lat: 27.68539, lng: 83.47691, specialty: "heart" },
  { id: 54, name: "सिद्धार्थनगर सिटी हस्पिटल", province: "lumbini", district: "रुपन्देही", address: "एयरपोर्ट रोड, भैरहवा", lat: 27.5138, lng: 83.4346, specialty: "general" },
  { id: 73, name: "सिद्धार्थ बाल तथा महिला (आम्दा) अस्पताल", province: "lumbini", district: "रुपन्देही", address: "बुटवल", lat: 27.68975, lng: 83.47732, specialty: "children" },
  { id: 75, name: "क्रिमसन अस्पताल", province: "lumbini", district: "रुपन्देही", address: "तिलोत्तमा-५, मणिग्राम", lat: 27.6338, lng: 83.47093, specialty: "general" },
  { id: 118, name: "एडमन्ड सिटी हस्पिटल प्रा.लि", province: "lumbini", district: "रुपन्देही", address: "बुटवल उपमहानगरपालिका–१३, रुपन्देही", specialty: "general" },
  { id: 129, name: "देवदह मेडिकल कलेज एण्ड रिसर्च इन्स्टिच्युट प्रा.लि.", province: "lumbini", district: "रुपन्देही", address: "देवदह-९, रुपन्देही, लुम्बिनी प्रदेश", lat: 27.64744, lng: 83.5389, specialty: "teaching" },
  { id: 122, name: "प्रदेश अस्पताल", province: "karnali", district: "सुर्खेत", address: "वीरेन्द्रनगर", specialty: "general" },
  { id: 82, name: "लाल रत्न अस्पताल प्रा.लि.", province: "sudurpashchim", district: "कैलाली", address: "लम्कीचुहा", lat: 28.62746, lng: 81.15339, specialty: "general" },
  { id: 90, name: "नवजीवन हस्पिटल प्रा.लि.", province: "sudurpashchim", district: "कैलाली", address: "धनगढी", lat: 28.7072, lng: 80.57618, specialty: "general" },
  { id: 120, name: "कैलाली अस्पताल प्रा. लि", province: "sudurpashchim", district: "कैलाली", address: "धनगढी, पशुपति टोल", specialty: "general" },
  { id: 121, name: "निसर्ग अस्पताल प्रा. लि.", province: "sudurpashchim", district: "कैलाली", address: "धनगढी ५ हंसपुर", specialty: "general" },
];

export function hospitalsByProvince(p: ProvinceKey): Hospital[] {
  return hospitals.filter((h) => h.province === p);
}

export function provinceCounts(): Record<ProvinceKey, number> {
  const out = Object.fromEntries(PROVINCE_ORDER.map((p) => [p, 0])) as Record<ProvinceKey, number>;
  for (const h of hospitals) out[h.province]++;
  return out;
}

export function districtsOf(p?: ProvinceKey): string[] {
  const set = new Set<string>();
  for (const h of hospitals) if (!p || h.province === p) set.add(h.district);
  return [...set].sort((a, b) => a.localeCompare(b, "ne"));
}
