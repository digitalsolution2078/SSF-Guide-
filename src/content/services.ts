export interface ServiceInfo {
  slug: string;
  key: string; // Lead form service key
  titleNe: string;
  titleEn: string;
  description: string;
  whoNeeds: string[];
  commonProblems: string[];
  ourRole: string[];
  limitations: string;
  checklistSlug?: string;
}

export const services: ServiceInfo[] = [
  {
    slug: "kyc-verification",
    key: "KYC_VERIFICATION",
    titleNe: "KYC Verification Assistance",
    titleEn: "KYC Verification Assistance",
    description:
      "SSF को KYC (ग्राहक पहिचान) प्रक्रिया पूरा गर्न कागजात तयारीदेखि verification सम्मको सहायता — विशेषगरी वैदेशिक रोजगारीमा हुनेका लागि।",
    whoNeeds: [
      "KYC verify नभएर सुविधा दाबी गर्न नसकेका योगदानकर्ता",
      "विदेशबाट आफैँ KYC गर्न नजान्ने/नभ्याउनेहरू",
      "कागजात अस्वीकृत भइरहेकाहरू",
    ],
    commonProblems: [
      "नागरिकता र प्रोफाइलको विवरण नमिल्नु",
      "कागजातको फोटो अस्पष्ट हुनु",
      "श्रम स्वीकृति/राहदानी विवरण अपडेट नहुनु",
    ],
    ourRole: [
      "कागजात checklist र गुणस्तर जाँच",
      "SOSYS मा KYC फाराम भर्न सहयोग",
      "अस्वीकृत भए कारण पहिचान र पुनः पेश",
    ],
    limitations:
      "अन्तिम verification SSF ले नै गर्छ — हामी प्रक्रिया सहज बनाउँछौँ, स्वीकृतिको ग्यारेन्टी गर्दैनौँ।",
    checklistSlug: "kyc-verification",
  },
  {
    slug: "registration",
    key: "REGISTRATION",
    titleNe: "SSF Registration Assistance",
    titleEn: "SSF Registration Assistance",
    description:
      "वैदेशिक रोजगारी, स्वरोजगार, कर्मचारी वा अनौपचारिक क्षेत्र — जुनसुकै category मा SSF सूचीकरण गर्न पूर्ण सहायता।",
    whoNeeds: [
      "विदेश जान लाग्दा/विदेशमै रहेर SSF जोडिन चाहनेहरू",
      "स्वरोजगार वा informal क्षेत्रका व्यक्तिहरू",
      "जागिर छाडेर आफैँ योगदान गर्न चाहनेहरू",
    ],
    commonProblems: [
      "ID/password थाहा नहुनु",
      "दुई वटा SSN बन्नु",
      "कुन योजनामा पर्ने भन्ने अन्योल",
    ],
    ourRole: [
      "सही योजना पहिचान र योगदान रकम सल्लाह",
      "Online listing फाराम भर्न सहयोग",
      "SSN/परिचयपत्र प्राप्तिसम्म follow-up",
    ],
    limitations:
      "सूचीकरण SSF ले तोकेका शर्तअनुसार हुन्छ; सरकारी शुल्क (भए) अलग तिर्नुपर्छ।",
    checklistSlug: "foreign-employment-registration",
  },
  {
    slug: "profile-correction",
    key: "PROFILE_CORRECTION",
    titleNe: "Profile Correction & Nominee Support",
    titleEn: "Profile Correction & Nominee Support",
    description:
      "नाम/जन्ममिति नमिलेको, mobile/email फेर्नुपर्ने, nominee थप्ने/फेर्ने वा duplicate SSN मिलाउने — प्रोफाइल सम्बन्धी सबै सुधार।",
    whoNeeds: [
      "विवरण गलत भएर दाबी अड्किएकाहरू",
      "विवाह/परिवार परिवर्तनपछि nominee अपडेट गर्नुपर्नेहरू",
      "Contribution नदेखिने समस्या भएकाहरू",
    ],
    commonProblems: [
      "नागरिकता र SSF प्रोफाइलको फरक विवरण",
      "पुरानो mobile नम्बरमा OTP जाने",
      "रोजगारदाताले गलत विवरण भरेको",
    ],
    ourRole: [
      "समस्याको exact कारण पहिचान",
      "प्रमाण कागजात तयारी र निवेदन",
      "सुधार नभएसम्म follow-up",
    ],
    limitations: "सुधार SSF को स्वीकृतिपछि मात्र लागू हुन्छ।",
    checklistSlug: "profile-correction",
  },
  {
    slug: "employer-registration",
    key: "EMPLOYER_REGISTRATION",
    titleNe: "Employer Registration & Onboarding",
    titleEn: "Employer Registration & Onboarding",
    description:
      "कम्पनी/फर्मको SSF सूचीकरण, कर्मचारी enrollment, मासिक contribution setup र compliance — व्यवसायका लागि पूर्ण प्याकेज।",
    whoNeeds: [
      "नयाँ सूचीकरण गर्नुपर्ने कम्पनी/पसल/फर्म",
      "कर्मचारी थप्न/हटाउन नजान्ने HR",
      "मासिक declaration मा समस्या भएका व्यवसाय",
    ],
    commonProblems: [
      "PAN/दर्ता कागजात नमिल्नु",
      "२५ दिनभित्र दाखिला छुटेर १०% ब्याज लाग्नु",
      "छाडेका कर्मचारीको विवरण अपडेट नहुनु",
    ],
    ourRole: [
      "Employer listing र १६-अङ्के नम्बर प्राप्ति",
      "कर्मचारी bulk enrollment",
      "मासिक payroll declaration प्रक्रिया setup र तालिम",
    ],
    limitations:
      "मासिक दाखिलाको जिम्मेवारी अन्ततः रोजगारदाताकै हुन्छ; हामी प्रणाली र प्रक्रिया मिलाइदिन्छौँ।",
    checklistSlug: "employer-registration",
  },
];

export const LEAD_SERVICES = [
  { key: "KYC_VERIFICATION", label: "KYC Verification" },
  { key: "REGISTRATION", label: "Registration" },
  { key: "PROFILE_CORRECTION", label: "Profile Correction" },
  { key: "NOMINEE_UPDATE", label: "Nominee Update" },
  { key: "CONTRIBUTION_PROBLEM", label: "Contribution समस्या" },
  { key: "EMPLOYER_ASSISTANCE", label: "Employer Assistance" },
  { key: "CLAIM_GUIDANCE", label: "Claim Guidance" },
  { key: "OTHER", label: "अन्य" },
] as const;

export function serviceBySlug(slug: string): ServiceInfo | undefined {
  return services.find((s) => s.slug === slug);
}
