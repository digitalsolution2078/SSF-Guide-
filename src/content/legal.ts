/**
 * Legal & informational pages — content authored/approved by Digital Solution.
 * Body format: "## " = section heading, "- " = bullet, other lines = paragraphs.
 * Rendered by src/components/legal-doc.tsx (URLs and emails auto-linked).
 */

export interface LegalDoc {
  slug: string;
  title: string;
  lastUpdated: string;
  body: string;
}

export const legalDocs: Record<string, LegalDoc> = {
  privacy: {
    slug: "privacy",
    title: "गोपनीयता नीति",
    lastUpdated: "११ जुलाई २०२६",
    body: `## परिचय
SSF Guide Nepal (https://ssf.digitalsolutionnepal.com) Digital Solution, Nepal द्वारा सञ्चालन गरिएको स्वतन्त्र शैक्षिक तथा सेवा-सहायता platform हो।
यो सामाजिक सुरक्षा कोषको आधिकारिक website होइन र यसको सामाजिक सुरक्षा कोष वा नेपाल सरकारसँग कुनै आधिकारिक सम्बन्ध छैन। सामाजिक सुरक्षा कोषको आधिकारिक website ssf.gov.np हो।
यो गोपनीयता नीतिले हामीले कुन जानकारी सङ्कलन गर्छौँ, किन प्रयोग गर्छौँ र प्रयोगकर्ताले आफ्नो जानकारीमाथि के अधिकार राख्छन् भन्ने स्पष्ट गर्छ।
## हामीले सङ्कलन गर्ने जानकारी
१. Assistance Request Form — KYC verification, SSF registration, profile correction वा employer onboarding सम्बन्धी सहायता अनुरोध गर्दा हामीले निम्न जानकारी सङ्कलन गर्न सक्छौँ:
- पूरा नाम
- Mobile वा WhatsApp नम्बर
- जिल्ला
- प्रयोगकर्ता वर्ग
- सम्पर्कको प्राथमिक माध्यम
- Email — वैकल्पिक
- हाल रहेको देश — वैकल्पिक
- समस्या वा आवश्यकताको विवरण
- प्रयोगकर्ताले स्वीकार गरेको consent checkbox को विवरण
- Form submit भएको IP address
- Marketing updates प्राप्त गर्ने वैकल्पिक consent
Consent checkbox को विवरण र submission IP address प्रयोगकर्ताको सहमतिको प्रमाणका रूपमा सुरक्षित गरिन्छ।
Marketing updates को consent पूर्ण रूपमा वैकल्पिक हुन्छ। Marketing consent नदिँदा सहायता अनुरोधमा कुनै असर पर्दैन।
२. Ask SSF AI — Ask SSF AI मा प्रयोगकर्ताले लेखेका chat messages उत्तर तयार गर्न Google को Gemini API मार्फत process गरिन्छ।
AI Chat मा OTP, Password, Banking PIN, नागरिकता नम्बर, व्यक्तिगत document वा अन्य संवेदनशील जानकारी नलेख्नुहोस्। Chat मार्फत यस्ता विवरण उपलब्ध गराउन हामी अनुरोध गर्दैनौँ।
३. Calculators, Assessment र Checklists — यी प्रयोग गर्दा कुनै व्यक्तिगत विवरण सङ्कलन गरिँदैन।
Checklist मा लगाइएका ticks तथा एकपटक देखाइने welcome popup को अवस्था प्रयोगकर्ताकै browser को localStorage मा मात्र सुरक्षित हुन्छ। यो जानकारी Digital Solution को server मा पठाइँदैन।
## Cookies
Platform मा सीमित cookies मात्र प्रयोग हुन्छन्:
- NEXT_LOCALE: प्रयोगकर्ताको language preference सम्झन
- Login session cookie: Digital Solution का अधिकृत staff ले admin panel प्रयोग गर्दा मात्र
हामी advertising वा targeted-advertising cookies प्रयोग गर्दैनौँ।
## Embedded YouTube Videos
Platform मा रहेका YouTube videos प्रयोगकर्ताले Play क्लिक गरेपछि मात्र youtube-nocookie.com बाट load हुन्छन्। Play नगरेसम्म video को thumbnail image मात्र load हुन्छ।
Video चलाएपछि YouTube का आफ्नै privacy practices लागू हुन सक्छन्।
## हामीले कहिल्यै सङ्कलन नगर्ने जानकारी
SSF Guide Nepal ले website मार्फत निम्न जानकारी सङ्कलन गर्दैन:
- नागरिकता नम्बर
- नागरिकता वा अन्य document upload
- OTP
- Password
- Banking details
- Banking PIN
- Website मार्फत payment details वा online payment
कुनै paid assistance service को शुल्क भएमा त्यो प्रयोगकर्तासँग छुट्टै सहमतिमा प्रत्यक्ष रूपमा तय गरिन्छ। Website बाट payment process हुँदैन।
## जानकारी किन प्रयोग गरिन्छ?
सङ्कलित जानकारी निम्न उद्देश्यका लागि मात्र प्रयोग गरिन्छ:
- Assistance request बुझ्न
- प्रयोगकर्तासँग सम्पर्क गर्न
- अनुरोध गरिएको सहायता उपलब्ध गराउन
- Platform को content र service सुधार गर्न
- Consent को अभिलेख राख्न
- Marketing consent दिएका प्रयोगकर्तालाई सम्बन्धित updates पठाउन
Digital Solution ले प्रयोगकर्ताको व्यक्तिगत जानकारी बिक्री गर्दैन।
## Third-party services र data storage
Assistance request सम्बन्धी data Digital Solution को server मा सुरक्षित हुन्छ। यो server Hostinger द्वारा उपलब्ध गराइएको VPS मा hosted छ।
Ask SSF AI मा पठाइएका messages उत्तर तयार गर्न Google Gemini API द्वारा process हुन्छन्। Embedded video चलाउँदा YouTube को privacy practice लागू हुन सक्छ।
Service सञ्चालनका लागि आवश्यक सीमाभन्दा बाहिर व्यक्तिगत जानकारी third party लाई उपलब्ध गराइँदैन।
## Data retention
Assistance request र consent सम्बन्धी जानकारी अनुरोध समाधान गर्न, आवश्यक follow-up गर्न तथा consent को अभिलेख राख्न आवश्यक समयसम्म सुरक्षित राख्न सकिन्छ।
प्रयोगकर्ताले आफ्नो data deletion अनुरोध गर्न सक्छन्। कानुनी, सुरक्षा वा वैध अभिलेखसम्बन्धी कारणले सीमित जानकारी राख्न आवश्यक नभएमा deletion request प्राप्त भएपछि सम्बन्धित data हटाइनेछ।
## Data security
हामी व्यक्तिगत जानकारी सुरक्षित राख्न उपयुक्त administrative र technical सुरक्षा उपाय अपनाउँछौँ। Data access आवश्यक तथा अधिकृत Digital Solution staff मा सीमित राखिन्छ।
तर internet वा digital storage को कुनै पनि प्रणाली पूर्ण रूपमा जोखिममुक्त हुँदैन। त्यसैले पूर्ण वा शतप्रतिशत सुरक्षाको guarantee दिन सकिँदैन।
## प्रयोगकर्ताका अधिकार
प्रयोगकर्ताले आफ्नो व्यक्तिगत जानकारीबारे निम्न अनुरोध गर्न सक्छन्:
- हामीसँग रहेको जानकारी हेर्न
- गलत वा अपूर्ण जानकारी सच्याउन
- व्यक्तिगत जानकारी delete गर्न
- Marketing updates बन्द गर्न
अनुरोध गर्दा तलका माध्यमबाट सम्पर्क गर्नुहोस्:
- Email: mail@digitalsolutionnepal.com
- WhatsApp: https://whatsapp.digitalsolutionnepal.com
सुरक्षाका लागि अनुरोध गर्ने व्यक्ति सम्बन्धित data को वास्तविक धनी हो भन्ने पुष्टि गर्न थप सामान्य जानकारी माग्न सकिन्छ। OTP, Password वा Banking PIN मागिने छैन।
## बालबालिकासम्बन्धी जानकारी
यो platform विशेष रूपमा बालबालिकाबाट व्यक्तिगत जानकारी सङ्कलन गर्ने उद्देश्यले बनाइएको होइन।
१८ वर्षभन्दा कम उमेरका प्रयोगकर्ताले व्यक्तिगत सहायता आवश्यक परेमा अभिभावक वा जिम्मेवार वयस्कको सहयोगमा सम्पर्क गर्नु उपयुक्त हुन्छ। बालबालिकाको व्यक्तिगत जानकारी अनावश्यक रूपमा प्राप्त भएको थाहा भएमा हटाउन अनुरोध गर्न सकिन्छ।
## नीतिमा परिवर्तन
Platform, technology वा कानुनी आवश्यकतामा परिवर्तन हुँदा यो गोपनीयता नीति अद्यावधिक हुन सक्छ। परिवर्तन भएपछि यसै page मा नयाँ "अन्तिम अद्यावधिक" मिति राखिनेछ।
## सम्पर्क
यो गोपनीयता नीति वा आफ्नो data सम्बन्धी प्रश्नका लागि:
- Email: mail@digitalsolutionnepal.com
- WhatsApp: https://whatsapp.digitalsolutionnepal.com
- Operator: Digital Solution, Nepal
- Website: https://ssf.digitalsolutionnepal.com
## English Summary
SSF Guide Nepal collects limited information only when a user submits an assistance request. AI chat messages are processed through Google's Gemini API, while calculators, assessments, and checklists do not collect personal data. The platform does not collect documents, OTPs, passwords, banking details, or website payments, and users may request access, correction, or deletion of their data.`,
  },

  terms: {
    slug: "terms",
    title: "सेवा सर्तहरू",
    lastUpdated: "११ जुलाई २०२६",
    body: `## सर्तहरूको स्वीकार
SSF Guide Nepal प्रयोग गरेर तपाईं यी सेवा सर्तहरू स्वीकार गर्नुहुन्छ। यी सर्तहरूसँग सहमत हुनुहुन्न भने platform प्रयोग नगर्नुहोस्।
SSF Guide Nepal Digital Solution, Nepal द्वारा सञ्चालन हुन्छ।
## स्वतन्त्र platform
SSF Guide Nepal सामाजिक सुरक्षा कोषसम्बन्धी स्वतन्त्र educational तथा service-assistance platform हो। यो:
- सामाजिक सुरक्षा कोषको आधिकारिक website होइन;
- नेपाल सरकारको website होइन;
- सामाजिक सुरक्षा कोष वा कुनै सरकारी निकायसँग आबद्ध छैन; र
- सरकारी निर्णय, approval वा claim process नियन्त्रण गर्दैन।
आधिकारिक जानकारी र सेवाका लागि सामाजिक सुरक्षा कोषको website प्रयोग गर्नुहोस्।
## उपलब्ध सेवाहरू
Platform ले निम्न सुविधा उपलब्ध गराउन सक्छ:
- SSF सम्बन्धी educational guides
- FAQs र checklists
- Official documents मा आधारित जानकारी
- Contribution calculators
- SSF Assessment
- Ask SSF AI
- YouTube educational videos
- KYC verification सहायता
- SSF registration सहायता
- Profile correction सहायता
- Employer onboarding सहायता
Platform का feature वा content आवश्यकता अनुसार सुधार, परिवर्तन वा बन्द गर्न सकिन्छ।
## Educational information मात्र
Guides, calculators, assessment र Ask SSF AI बाट प्राप्त जानकारी सामान्य educational तथा informational उद्देश्यका लागि हो।
Calculator वा assessment को result प्रारम्भिक estimate मात्र हो। यसलाई SSF को अन्तिम calculation, eligibility decision, pension amount, claim approval वा कानुनी निर्णय मान्न मिल्दैन।
अन्तिम निर्णय सामाजिक सुरक्षा कोषले आफ्नो प्रचलित ऐन, नियम, कार्यविधि र अभिलेखका आधारमा गर्छ।
## AI Assistant
Ask SSF AI ले उपलब्ध content र user question का आधारमा उत्तर तयार गर्छ। AI बाट आएको उत्तर अपूर्ण, पुरानो वा गलत हुन सक्छ।
महत्त्वपूर्ण निर्णय लिनुअघि official SSF source वा सम्बन्धित विशेषज्ञबाट पुष्टि गर्नुहोस्। Chat मा OTP, Password, document, नागरिकता नम्बर वा Banking details नदिनुहोस्।
## प्रयोगकर्ताको जिम्मेवारी
Platform प्रयोग गर्दा तपाईंले:
- Assistance request मा सही र आवश्यक जानकारी दिनुपर्नेछ;
- अरू व्यक्तिको विवरण अनुमति बिना प्रयोग गर्नुहुँदैन;
- झुटो, भ्रामक वा गैरकानुनी request पठाउनुहुँदैन;
- Platform को security वा operation मा असर पार्ने प्रयास गर्नुहुँदैन;
- Automated abuse, spam वा unauthorized access गर्नुहुँदैन; र
- Platform लाई कानुनविपरीत उद्देश्यका लागि प्रयोग गर्नुहुँदैन।
## Paid assistance service
Digital Solution ले KYC verification, registration, profile correction वा employer onboarding सम्बन्धी paid assistance उपलब्ध गराउन सक्छ। कुनै शुल्क लाग्ने भए:
- सेवा शुल्क commitment गर्नुअघि स्पष्ट रूपमा जानकारी गराइनेछ;
- प्रयोगकर्ताको सहमतिपछि मात्र paid assistance अगाडि बढाइनेछ;
- सरकारी शुल्क, contribution, penalty वा अन्य official charge छुट्टै हुनेछ; र
- Website मार्फत payment सङ्कलन गरिँदैन।
Digital Solution ले SSF approval, KYC approval, claim approval, pension amount, registration outcome वा काम सम्पन्न हुने निश्चित समयको guarantee गर्दैन।
Digital Solution को भूमिका प्रक्रिया बुझाउन, उपलब्ध विवरणका आधारमा सहयोग गर्न र आवश्यक guidance दिनमा सीमित हुन्छ। अन्तिम निर्णय सम्बन्धित official authority ले गर्छ।
## सरकारी शुल्क
Digital Solution को service fee र सरकारी शुल्क फरक विषय हुन्। SSF वा अन्य सरकारी निकायलाई बुझाउनुपर्ने रकम सम्बन्धित निकायको नियमअनुसार लाग्छ।
सरकारी दर वा प्रक्रिया परिवर्तन हुन सक्छ। Payment गर्नुअघि official source बाट हालको रकम पुष्टि गर्नु प्रयोगकर्ताको जिम्मेवारी हो।
## बौद्धिक सम्पत्ति
SSF Guide Nepal मा प्रकाशित मूल लेख, व्याख्या, design, branding, checklist तथा अन्य content मा लागू हुने अधिकार Digital Solution सँग सुरक्षित रहन्छ।
अनुमति बिना content को व्यावसायिक पुनःप्रकाशन, बिक्री वा Digital Solution को content भनी भ्रम सिर्जना गर्ने प्रयोग गर्न पाइँदैन। उचित source credit सहित सीमित शैक्षिक sharing गर्न सकिन्छ।
कुनै software वा code component मा स्पष्ट रूपमा MIT License उल्लेख गरिएको अवस्थामा त्यही component मा MIT License लागू हुन्छ। MIT License उल्लेख नभएको content वा branding स्वतः MIT-licensed मानिने छैन।
## बाह्य links र services
Platform मा official SSF sources, YouTube वा अन्य external websites का links हुन सक्छन्। ती website को content, availability, security वा privacy practice Digital Solution को नियन्त्रणमा हुँदैन।
External website प्रयोग गर्दा सम्बन्धित website का terms र privacy policy लागू हुन्छन्।
## Guarantee नदिइने विषय
Digital Solution ले निम्न परिणामको guarantee गर्दैन:
- कुनै SSF registration वा KYC approval
- Profile correction को स्वीकृति
- Claim approval
- Pension वा benefit amount
- Contribution calculation को अन्तिम रकम
- सरकारी processing timeline
- Platform सधैँ error-free वा uninterrupted हुने अवस्था
## दायित्वको सीमा
कानुनले अनुमति दिएको सीमासम्म, platform को educational information, preliminary estimates, AI answers, external links वा official rules मा आएको परिवर्तनका कारण भएको प्रत्यक्ष वा अप्रत्यक्ष हानिका लागि Digital Solution उत्तरदायी हुने छैन।
यस व्यवस्थाले लागू कानुनअन्तर्गत हटाउन नमिल्ने अधिकार वा दायित्व हटाउँदैन।
## पहुँच रोक्ने अधिकार
Misuse, security threat, unlawful activity, spam वा यी सर्तहरूको गम्भीर उल्लङ्घन भएमा Digital Solution ले सम्बन्धित प्रयोगकर्ताको access रोक्न वा request अस्वीकार गर्न सक्छ।
## सेवा सर्तमा परिवर्तन
यी सर्तहरू platform वा कानुनी आवश्यकताअनुसार अद्यावधिक हुन सक्छन्। नयाँ version यसै page मा "अन्तिम अद्यावधिक" मितिसहित प्रकाशित हुनेछ।
## लागू कानुन
यी सेवा सर्तहरू नेपालको प्रचलित कानुनअनुसार लागू र व्याख्या हुनेछन्।
## सम्पर्क
- Email: mail@digitalsolutionnepal.com
- WhatsApp: https://whatsapp.digitalsolutionnepal.com
- Operator: Digital Solution, Nepal
- Website: https://ssf.digitalsolutionnepal.com
## English Summary
SSF Guide Nepal is an independent educational and assistance platform and is not affiliated with Nepal's Social Security Fund or the Government of Nepal. Calculators, assessments, and AI answers provide preliminary information only, while all final decisions remain with the relevant official authority. Any assistance fee is communicated before commitment, government charges remain separate, and no SSF outcome or timeline is guaranteed.`,
  },

  disclaimer: {
    slug: "disclaimer",
    title: "अस्वीकरण",
    lastUpdated: "११ जुलाई २०२६",
    body: `## स्वतन्त्र platform सम्बन्धी सूचना
SSF Guide Nepal Digital Solution द्वारा सञ्चालन गरिएको स्वतन्त्र educational तथा service-assistance platform हो। यो सामाजिक सुरक्षा कोष वा नेपाल सरकारको आधिकारिक website होइन र कुनै सरकारी निकायसँग आबद्ध छैन।
## जानकारीको आधार
Platform मा उपलब्ध जानकारी आधिकारिक SSF documents तथा प्रकाशित स्रोतका आधारमा बुझ्न सजिलो भाषामा तयार गरिएको हो।
तर ऐन, नियम, कार्यविधि, contribution rate, eligibility र process संशोधनबाट परिवर्तन हुन सक्छन्। कुनै फरक वा विवाद भएमा सामाजिक सुरक्षा कोषले प्रकाशित गरेको हालको आधिकारिक जानकारी नै मान्य हुनेछ।
## AI, calculators र assessment
Ask SSF AI ले कहिलेकाहीँ गलत, अपूर्ण वा पुरानो उत्तर दिन सक्छ। महत्त्वपूर्ण विषयमा AI को उत्तर मात्र आधार नबनाउनुहोस्।
Calculators र SSF Assessment ले preliminary educational estimate मात्र दिन्छन्। तिनले अन्तिम eligibility, contribution, pension, claim approval वा benefit amount निर्धारण गर्दैनन्।
## Professional advice होइन
Platform मा उपलब्ध content लाई व्यक्तिगत financial, legal, tax वा professional advice मान्नुहुँदैन। विशेष निर्णय गर्नुअघि official SSF source वा योग्य विशेषज्ञसँग पुष्टि गर्नुहोस्।
## कुनै outcome guarantee हुँदैन
Digital Solution ले SSF registration, KYC verification, profile correction, claim approval, pension amount वा processing timeline को guarantee गर्दैन। अन्तिम निर्णय सामाजिक सुरक्षा कोषले आफ्नै नियम र अभिलेखका आधारमा गर्छ।
## आधिकारिक स्रोतहरू
- सामाजिक सुरक्षा कोषको आधिकारिक website: https://ssf.gov.np
- सामाजिक सुरक्षा कोषका ऐन तथा नियम
- SSF Call Center: 1116
## English Summary
SSF Guide Nepal is an independent platform and is not an official SSF or Government of Nepal website. Its content is based on official materials, but rules and rates may change, and official SSF sources remain authoritative. AI answers and calculator results may contain errors and must not be treated as final legal or financial advice.`,
  },

  about: {
    slug: "about",
    title: "हाम्रोबारे",
    lastUpdated: "११ जुलाई २०२६",
    body: `## SSF बुझ्न अब जटिल हुनुपर्दैन
SSF Guide Nepal को उद्देश्य सामाजिक सुरक्षा कोषसम्बन्धी जानकारी प्रत्येक नेपालीले सरल रूपमा बुझ्न सक्ने बनाउनु हो।
श्रमिक, रोजगारदाता, स्वरोजगार व्यक्ति वा विदेशमा रहेका नेपालीका लागि SSF का नियम, contribution, KYC, registration, claim र benefits बुझ्न कहिलेकाहीँ जटिल हुन्छ। Official documents महत्त्वपूर्ण भए पनि तिनमा प्रयोग भएका technical र कानुनी शब्द सबैका लागि सहज नहुन सक्छन्।
त्यसैले हामी official documents मा आधारित जानकारीलाई सरल भाषा, step-by-step guides, FAQs, checklists, calculators, assessment र educational videos मार्फत प्रस्तुत गर्छौँ।
SSF Guide Nepal, Digital Solution का संस्थापक Rabin Paudel को पहलमा निर्माण गरिएको हो। Digital Solution ले digital literacy, सरकारी digital services र practical technology education सम्बन्धी content तयार गर्दै आएको छ। हाम्रो YouTube channel मा SSF सम्बन्धी process, update र practical guidance समेटिएका educational videos पनि उपलब्ध छन्।
## हाम्रो प्रतिबद्धता
- सरल जानकारी: जटिल विषयलाई सर्वसाधारणले बुझ्ने भाषामा प्रस्तुत गर्ने।
- स्रोतसहितको उत्तर: सम्भव भएसम्म official documents र authoritative sources मा आधारित जानकारी दिने।
- Personalized guidance: KYC, registration, profile correction र employer onboarding मा आवश्यकता अनुसार सहायता गर्ने।
हामी सामाजिक सुरक्षा कोषको आधिकारिक website होइनौँ र कुनै सरकारी निकायसँग आबद्ध छैनौँ। अन्तिम निर्णय तथा approval सामाजिक सुरक्षा कोषले गर्छ। हाम्रो भूमिका तपाईंलाई सही प्रक्रिया बुझ्न, तयारी गर्न र अगाडि बढ्न सहयोग गर्नु हो।
## English Summary
SSF Guide Nepal was created by Digital Solution, founded by Rabin Paudel, to make Nepal's Social Security Fund easier to understand. It supports workers, employers, self-employed individuals, and Nepalis abroad through clear guides, verified sources, videos, and personalized assistance. The platform is independent and does not represent the Social Security Fund or the Government of Nepal.`,
  },

  contact: {
    slug: "contact",
    title: "सम्पर्क",
    lastUpdated: "११ जुलाई २०२६",
    body: `## हामीलाई सम्पर्क गर्नुहोस्
SSF registration, KYC verification, profile correction, employer onboarding वा platform मा उपलब्ध जानकारीसम्बन्धी सहयोगका लागि Digital Solution लाई सम्पर्क गर्न सक्नुहुन्छ।
- WhatsApp: https://whatsapp.digitalsolutionnepal.com
- Email: mail@digitalsolutionnepal.com
- Website: https://ssf.digitalsolutionnepal.com
## Response time
हामी working days मा सामान्यतया २४ घण्टाभित्र response दिने प्रयास गर्छौँ। Complex case वा थप verification आवश्यक पर्ने अनुरोधमा केही बढी समय लाग्न सक्छ।
## सुरक्षा सूचना
Digital Solution ले फोन वा Chat मार्फत तपाईंको OTP, Password वा Banking PIN माग्दैन।
कुनै पनि व्यक्तिलाई OTP, Password, Banking PIN वा संवेदनशील financial information नदिनुहोस्।
SSF को आधिकारिक निर्णय, approval वा सरकारी सेवाका लागि https://ssf.gov.np प्रयोग गर्नुहोस्।
## English Summary
Users may contact Digital Solution by WhatsApp or email for SSF-related guidance and assistance. We aim to respond within 24 hours on working days. Digital Solution never asks for OTPs, passwords, or banking PINs through phone calls or chat.`,
  },

  "report-correction": {
    slug: "report-correction",
    title: "जानकारी सच्याउने अनुरोध",
    lastUpdated: "११ जुलाई २०२६",
    body: `## गलत वा पुरानो जानकारी भेट्नुभयो?
SSF सम्बन्धी ऐन, नियम, दर, प्रक्रिया र online system समयअनुसार परिवर्तन हुन सक्छन्। SSF Guide Nepal मा कुनै जानकारी गलत, अपूर्ण वा पुरानो देखिएमा हामीलाई जानकारी गराउन सक्नुहुन्छ।
## अनुरोध कसरी पठाउने?
Correction request पठाउँदा सम्भव भएसम्म निम्न विवरण समावेश गर्नुहोस्:
- गलत वा पुरानो जानकारी रहेको page को link
- सच्याउनुपर्ने वाक्य वा विवरण
- किन गलत वा पुरानो भएको हो भन्ने छोटो जानकारी
- उपलब्ध भएमा official notice, document वा source को link
- सम्पर्कका लागि नाम र Email वा WhatsApp नम्बर
अनुरोध पठाउने माध्यम:
- Email: mail@digitalsolutionnepal.com
- WhatsApp: +9779705433699
## अनुरोध प्राप्त भएपछि के हुन्छ?
Correction request प्राप्त भएपछि हामी:
- सम्बन्धित content review गर्छौँ।
- उपलब्ध official SSF sources, notices, ऐन, नियम वा कार्यविधिसँग तुलना गर्छौँ।
- आवश्यक भएमा जानकारी सुधार वा स्पष्ट गर्छौँ।
- Updated content मा नयाँ verification वा update date राख्छौँ।
सबै सुझाव स्वतः स्वीकार हुँदैनन्। Correction official वा विश्वसनीय source बाट पुष्टि भएपछि मात्र प्रकाशित गरिन्छ।
## Response time
हामी working days मा सामान्यतया २४ घण्टाभित्र अनुरोध प्राप्त भएको जानकारी दिने प्रयास गर्छौँ। Review र correction को समय विषयको जटिलता तथा official verification को उपलब्धतामा निर्भर हुन्छ।
## English Summary
Users can report outdated or incorrect information by email or WhatsApp with the relevant page and supporting official source. Digital Solution reviews each request against authoritative SSF materials before making a correction. Verified updates receive a revised verification or update date, and receipt is generally acknowledged within 24 hours on working days.`,
  },
};
