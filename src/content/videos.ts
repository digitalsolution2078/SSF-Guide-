import type { VideoItem } from "./types";

/**
 * SSF video catalog — Digital Solution / Rabin Paudel YouTube channel.
 * Playlist: https://www.youtube.com/playlist?list=PLsNKWhiGFxqli9KXP2SjNK-ieC3nD6GNq
 *
 * `kind: "opinion"` (commentary/critique) videos stay in the catalog for
 * completeness but are NOT embedded on educational pages — the platform
 * stays neutral-educational per the trust rules in the product spec.
 */
export const SSF_PLAYLIST_URL =
  "https://www.youtube.com/playlist?list=PLsNKWhiGFxqli9KXP2SjNK-ieC3nD6GNq";

export const videos: VideoItem[] = [
  {
    youtubeId: "63a1Syl6RHU",
    title:
      "वैदेशिक रोजगारीमा हुनेले सामाजिक सुरक्षा कोषको KYC कसरी भर्ने? SSF KYC Verification Process",
    description:
      "Foreign Employment मा भएकाले SSF को KYC मोबाइलबाट कसरी भर्ने भन्ने बारे।",
    categorySlug: "kyc-profile-nominee",
    userCategories: ["foreign"],
    kind: "howto",
  },
  {
    youtubeId: "-FXLNa0S_UI",
    title: "SSF मा कसरी आबद्ध हुने? How to Join SSF Nepal | Full Step-by-Step Process",
    description: "SSF मा join गर्ने online listing को पूरा walkthrough।",
    categorySlug: "karmachari-ra-rojgardata",
    userCategories: ["employee", "selfEmployed", "informal"],
    kind: "howto",
  },
  {
    youtubeId: "VrEIuKx4c90",
    title:
      "विदेशमा हुने सामाजिक सुरक्षा कोष – 5 Most Common Questions About SSF Nepal for Foreign Employment",
    description:
      "विदेश जाने/गएका नेपाली कामदारका लागि SSF सम्बन्धी ५ सामान्य प्रश्नको उत्तर।",
    categorySlug: "baideshik-rojgari",
    userCategories: ["foreign"],
    kind: "explainer",
  },
  {
    youtubeId: "uEKO8zmFEHg",
    title:
      "How Foreign Employment Contributors Can Deposit to (Social Security Fund) SSF Nepal",
    description:
      "विदेशी रोजगारीका योगदानकर्ताले SSF मा रकम deposit गर्ने step-by-step प्रक्रिया।",
    categorySlug: "baideshik-rojgari",
    userCategories: ["foreign"],
    kind: "howto",
  },
  {
    youtubeId: "fC2asy6ZVtM",
    title:
      "सामाजिक सुरक्षा कोष । Social Security Fund Nepal | SSF Scheme | Process | Rabin Paudel",
    description: "SSF र सरकारले लागू गरेको SSF scheme बारे विस्तृत जानकारी।",
    categorySlug: "ssf-parichaya",
    userCategories: ["employee", "employer", "contributor"],
    kind: "explainer",
  },
  {
    youtubeId: "TYZoZyEACiE",
    title:
      "स्वास्थ्य बीमा कि सामाजिक सुरक्षा कोष | Comparison Between Social Security Fund & Health Insurance",
    description: "SSF र Health Insurance को तुलना — दुबैको health benefits बारे।",
    categorySlug: "medical-maternity-accident-dependent",
    userCategories: ["employee", "contributor"],
    kind: "explainer",
  },
  {
    youtubeId: "OBJE-_uTRBg",
    title:
      "सामाजिक सुरक्षा कोष Social Security Fund | SSF NEPAL | Registration | Collection | Deposit | Claim",
    description:
      "Business owner/employee का लागि registration, collection, deposit, claim सम्पूर्ण।",
    categorySlug: "karmachari-ra-rojgardata",
    userCategories: ["employer", "employee"],
    kind: "explainer",
  },
  {
    youtubeId: "iZ4EnkNIzaI",
    title:
      "How to Deposit Money in Social Security Fund (SSF) Nepal | Step-by-Step Screen Guide",
    description: "Real screen-based walkthrough गरेर SSF मा पैसा deposit गर्ने तरिका।",
    categorySlug: "yogdan-ra-badfad",
    userCategories: ["employer", "selfEmployed", "foreign"],
    kind: "howto",
  },
  {
    youtubeId: "8QyRTsZkHyg",
    title:
      "सामाजिक सुरक्षा कोष Social Security Fund added Benefits for Formal Sector's Contributor's Family",
    description: "Formal sector योगदानकर्ताको परिवारका लागि थपिएका SSF सुविधाहरू।",
    categorySlug: "medical-maternity-accident-dependent",
    userCategories: ["employee", "family"],
    kind: "news",
  },
  {
    youtubeId: "k11wqBUUUyE",
    title:
      "How to Register Company / Firm in Social Security Fund (SSF) — Full Online Form Fillup Guide",
    description:
      "Company, Firm, Shop वा Business लाई SSF मा online employer registration गर्ने तरिका।",
    categorySlug: "karmachari-ra-rojgardata",
    userCategories: ["employer"],
    kind: "howto",
  },
  {
    youtubeId: "6AzCq5tev7k",
    title:
      "स्व रोजगार क्षेत्रमा सामाजिक सुरक्षा कोष Social Security Fund on Self Employment Sector",
    description: "Self-employment मा हुनेका लागि SSF ले ल्याएको scheme बारे।",
    categorySlug: "karmachari-ra-rojgardata",
    userCategories: ["selfEmployed"],
    kind: "explainer",
  },
  {
    youtubeId: "KZ44YSrPkjY",
    title:
      "How to Apply for SSF Loan Online | सामाजिक सुरक्षा कोषबाट ऋण कसरी लिने? (Special Sapati)",
    description: "SSF बाट घरमै बसेर online ऋण/सापटी लिने प्रक्रिया।",
    categorySlug: "pension-ra-retirement",
    userCategories: ["contributor"],
    kind: "howto",
  },
  {
    youtubeId: "m2oKN85hFhU",
    title:
      "Social Security Fund Medical Claim From Hospital Process सामाजिक सुरक्षा कोषबाट उपचार कसरी गर्ने",
    description: "अस्पतालबाट SSF को medical claim गर्ने प्रक्रिया।",
    categorySlug: "claims-problems-solutions",
    userCategories: ["employee", "contributor", "family"],
    kind: "howto",
  },
  {
    youtubeId: "S_Ch2yO7G3A",
    title:
      "How to Claim Maternity Allowance from Social Security Fund Nepal? Online Process Explained",
    description:
      "घरमै बसेर मोबाइलबाट सुत्केरी खर्च (maternity allowance) claim गर्ने तरिका।",
    categorySlug: "claims-problems-solutions",
    userCategories: ["employee", "contributor", "family"],
    kind: "howto",
  },
  {
    youtubeId: "K1Z9ynkXqbw",
    title:
      "Documents and Information Required to Update KYC for Social Security Fund (SSF Nepal)",
    description:
      "Foreign Employment वालाहरूलाई SSF KYC verification का लागि आवश्यक कागजात।",
    categorySlug: "kyc-profile-nominee",
    userCategories: ["foreign"],
    kind: "howto",
  },
  {
    youtubeId: "Ym8rVCfLfH0",
    title:
      "SSF Loan Tutorial — 24 Hours मा पैसा बैंकमा | My Real Experience (Step-by-Step Guide)",
    description:
      "SSF mobile app बाट loan/सापटी लिएको real experience, 24-घण्टे deposit proof सहित।",
    categorySlug: "pension-ra-retirement",
    userCategories: ["contributor"],
    kind: "howto",
  },
  {
    youtubeId: "qPcBi8lsPz4",
    title: "7 Dark Reality of Social Security Fund सामाजिक सुरक्षा कोषका कमजोरीहरु SSF NEPAL",
    description: "SSF का ७ कमजोरी/नकारात्मक पक्षहरू।",
    categorySlug: "ssf-parichaya",
    userCategories: ["employee"],
    kind: "opinion",
  },
  {
    youtubeId: "O3LL87Q1m6A",
    title:
      "अनौपचारीक क्षेत्रमा सामाजिक सुरक्षा कोष Social Security Fund SSF on Informal Sector",
    description: "Informal sector मा SSF कसरी लागू हुन्छ भन्ने बारे।",
    categorySlug: "karmachari-ra-rojgardata",
    userCategories: ["informal"],
    kind: "explainer",
  },
  {
    youtubeId: "YMKqKA2oVW0",
    title:
      "औपचारीक क्षेत्रमा सामाजिक सुरक्षा कोष Social Security Fund SSF NEPAL on Formal Sector",
    description: "Formal sector मा SSF को व्यवस्था बारे।",
    categorySlug: "karmachari-ra-rojgardata",
    userCategories: ["employee", "employer"],
    kind: "explainer",
  },
  {
    youtubeId: "9LzsyY_4DsM",
    title:
      "SSF Members Can Get Private Hospital Treatment at Government Rate | SSF Nepal Explained",
    description: "SSF सदस्यले private hospital मा सरकारी दरमा उपचार पाउने सुविधा।",
    categorySlug: "medical-maternity-accident-dependent",
    userCategories: ["contributor", "employee"],
    kind: "explainer",
  },
  {
    youtubeId: "05Y4ceL4LPQ",
    title: "Social Security Fund is biased with Foreign Worker",
    description: "SSF ले वैदेशिक रोजगारीमा हुनेलाई कसरी अन्याय गरेको भन्ने बारे।",
    categorySlug: "baideshik-rojgari",
    userCategories: ["foreign"],
    kind: "opinion",
  },
  {
    youtubeId: "N-1oNa9XKbM",
    title:
      "विदेशमा हुनेलाई सामाजिक सुरक्षा कोषले गरेको अन्याय Social Security Fund SSF on Foreign Employment",
    description: "विदेशमा हुनेप्रति SSF को अन्याय बारे।",
    categorySlug: "baideshik-rojgari",
    userCategories: ["foreign"],
    kind: "opinion",
  },
  {
    youtubeId: "FTzJA0o_gnU",
    title:
      "SSF Home Loan Nepal: सामाजिक सुरक्षा कोषबाट १.५ करोडसम्म कर्जा कसरी पाइन्छ?",
    description: "SSF contributors लाई home loan सम्बन्धी महत्वपूर्ण update।",
    categorySlug: "pension-ra-retirement",
    userCategories: ["contributor"],
    kind: "explainer",
  },
  {
    youtubeId: "YlUKDSqCxT0",
    title:
      "Everything About Social Security Fund (SSF NEPAL) 2024 | Benefits | Contribution",
    description: "SSF Nepal को benefits, contribution लगायत सम्पूर्ण जानकारी।",
    categorySlug: "ssf-parichaya",
    userCategories: ["employee", "contributor"],
    kind: "explainer",
  },
  {
    youtubeId: "Q4SrXAtj074",
    title:
      "What happens to SSF after leaving a job? Can you continue contributing on your own or not?",
    description:
      "जागिर छाडेपछि SSF को के हुन्छ, आफैले योगदान गर्न मिल्छ कि मिल्दैन।",
    categorySlug: "pension-ra-retirement",
    userCategories: ["employee", "contributor"],
    kind: "explainer",
  },
  {
    youtubeId: "AcBN_GOU7aA",
    title: "7 Dark Sides of Social Security Fund सामाजिक सुरक्षा कोष का वेफाईदा",
    description: "SSF का ७ बेफाइदा (Shorts)।",
    categorySlug: "ssf-parichaya",
    userCategories: ["employee"],
    kind: "opinion",
  },
  {
    youtubeId: "dtObVLVO0Bs",
    title: "If You're Enrolled in the Social Security Fund, You Can Also Get This Benefit!",
    description: "SSF सदस्यले पाउने थप सुविधाहरू जुन धेरैलाई थाहा छैन।",
    categorySlug: "medical-maternity-accident-dependent",
    userCategories: ["contributor"],
    kind: "explainer",
  },
  {
    youtubeId: "nVPyJTZwiNM",
    title: "सामाजिक सुरक्षा कोषबाट पोखरामा आँखाको उपचार गर्ने अस्पताल",
    description: "SSF बाट पोखरामा आँखाको उपचार गर्न मिल्ने अस्पताल।",
    categorySlug: "medical-maternity-accident-dependent",
    userCategories: ["contributor"],
    kind: "news",
  },
  {
    youtubeId: "Z1kEfgSgsK0",
    title: "बाटो बिराउदै सामाजिक सुरक्षा कोष Social Security Fund (SSF NEPAL) on Wrong Track",
    description: "SSF ले गर्न लागेको कामबारे समीक्षा।",
    categorySlug: "ssf-parichaya",
    userCategories: ["contributor"],
    kind: "opinion",
  },
  {
    youtubeId: "EZS--UrRV04",
    title: "SSF KYC नगर्दा के असर पर्छ? | Regular Contribution किन जरुरी छ?",
    description: "SSF KYC नगर्दाको असर र नियमित योगदानको महत्व।",
    categorySlug: "kyc-profile-nominee",
    userCategories: ["contributor", "foreign"],
    kind: "explainer",
  },
  {
    youtubeId: "HhwTzMdAqiU",
    title:
      "वैदेशिक रोजगारीमा हुनेको लागि सामाजिक सुरक्षा कोष Social Security Fund on Foreign Employment",
    description: "वैदेशिक रोजगारीमा हुनेका लागि SSF सम्बन्धी जानकारी।",
    categorySlug: "baideshik-rojgari",
    userCategories: ["foreign"],
    kind: "explainer",
  },
  {
    youtubeId: "PLyzDgY4PHw",
    title: "Gen Z Protest पछि SSF ले के सिक्नुपर्छ? | Transparency र Digital Reform को माग",
    description: "SSF मा transparency र digital reform को आवश्यकता बारे।",
    categorySlug: "ssf-parichaya",
    userCategories: ["contributor"],
    kind: "opinion",
  },
  {
    youtubeId: "Z9mhGiTYnrE",
    title:
      "वैदेशिक रोजगारीमा हुनेलाई सुविधा बढ्यो – SSF Nepal Increased the Benefit for Employee",
    description: "वैदेशिक रोजगारीमा हुनेका लागि SSF ले बढाएको सुविधा।",
    categorySlug: "baideshik-rojgari",
    userCategories: ["foreign"],
    kind: "news",
  },
  {
    youtubeId: "8BLS0M5X6Os",
    title:
      "सामाजिक सुरक्षा कोषबाट पेन्सन पाएको व्यक्तिले सरकारले दिने वृद्ध भत्ता पाउछ कि नाई?",
    description: "SSF पेन्सन पाउनेले सरकारी वृद्ध भत्ता पाउँछ कि पाउँदैन।",
    categorySlug: "pension-ra-retirement",
    userCategories: ["contributor", "family"],
    kind: "explainer",
  },
  {
    youtubeId: "6uyBCUVYNXs",
    title: "107 Hospitals Registered in SSF – But Karnali Has None | Full Analysis",
    description: "SSF मा दर्ता १०७ अस्पताल, तर कर्णालीमा एउटै नभएको विश्लेषण।",
    categorySlug: "medical-maternity-accident-dependent",
    userCategories: ["contributor"],
    kind: "news",
  },
  {
    youtubeId: "nwdYoVHTEKA",
    title: "2 वटा सामाजिक सुरक्षा कोष नम्बर भए के हुन्छ?",
    description: "दुई वटा SSF नम्बर भएमा के हुन्छ भन्ने बारे।",
    categorySlug: "kyc-profile-nominee",
    userCategories: ["contributor"],
    kind: "explainer",
  },
  {
    youtubeId: "kY1280ax2-4",
    title:
      "How Nepalis Abroad Can Strengthen Nepal's Economy through Social Security Fund",
    description:
      "विदेशमा रहेका नेपालीले SSF मार्फत नेपालको अर्थतन्त्रलाई कसरी बलियो बनाउन सक्छन्।",
    categorySlug: "baideshik-rojgari",
    userCategories: ["foreign"],
    kind: "explainer",
  },
  {
    youtubeId: "DOaX_27N-ks",
    title:
      "विदेशबाट नेपाल फर्किएपछि SSF मा के गर्ने? | Foreign Employment SSF Contributor Return Process",
    description: "विदेशबाट फर्किएपछि SSF मा गर्नुपर्ने प्रक्रिया।",
    categorySlug: "baideshik-rojgari",
    userCategories: ["foreign"],
    kind: "howto",
  },
  {
    youtubeId: "S8qI9Eyd5QE",
    title:
      "श्रम स्विकृती लिएर विदेश त आए, सामाजिक सुरक्षा कोषको आईडि पासवर्ड केहि पनि थाहा छैन, अब के गर्ने?",
    description: "SSF ID/password थाहा नभएकाले के गर्ने भन्ने बारे।",
    categorySlug: "baideshik-rojgari",
    userCategories: ["foreign"],
    kind: "howto",
  },
  {
    youtubeId: "R0TzLoCRdL4",
    title: "जागिर छाडेपछि पनि हजुरले निरन्तर सामाजिक सुरक्षा कोषमा योगदान गर्न सक्नुहुन्छ",
    description: "जागिर छाडेपछि पनि SSF मा निरन्तर योगदान गर्न सकिने बारे।",
    categorySlug: "pension-ra-retirement",
    userCategories: ["employee", "contributor"],
    kind: "explainer",
  },
  {
    youtubeId: "xr2v0S1makA",
    title: "वैदेशिक रोजगारीमा हुनेको लागि सामाजिक सुरक्षा कोषको यो सुविधा राम्रो हुन सक्छ",
    description: "वैदेशिक रोजगारीमा हुनेका लागि SSF को उपयोगी सुविधा।",
    categorySlug: "baideshik-rojgari",
    userCategories: ["foreign"],
    kind: "explainer",
  },
  {
    youtubeId: "uS66xR9bQ-g",
    title:
      "सरकारले न्युनतम तलब बढाएसगैं सामाजिक सुरक्षा कोष योगदान रकम बढेर श्रम गर्दा लाग्ने खर्च पनि बढेको",
    description: "न्यूनतम तलब बढेसँगै SSF योगदान रकम र लागत बढेको बारे।",
    categorySlug: "yogdan-ra-badfad",
    userCategories: ["employer", "employee"],
    kind: "news",
  },
];

export function videoById(id: string): VideoItem | undefined {
  return videos.find((v) => v.youtubeId === id);
}

export function videosByCategory(categorySlug: string): VideoItem[] {
  return videos.filter(
    (v) => v.categorySlug === categorySlug && v.kind !== "opinion",
  );
}
