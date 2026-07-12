/**
 * Official SSF downloads — direct links to PDFs on ssf.gov.np.
 * Files are NOT rehosted: linking to the official source keeps them
 * authoritative and avoids copyright/staleness issues.
 */

export interface DownloadItem {
  title: string;
  date?: string; // as published on ssf.gov.np
  url: string;
}

export interface DownloadCategory {
  slug: string;
  title: string;
  icon: string;
  description: string;
  titleEn: string;
  descriptionEn: string;
  items: DownloadItem[];
}

const B = "https://ssf.gov.np/images/news/";

export const downloadCategories: DownloadCategory[] = [
  {
    slug: "acts",
    title: "ऐन, नियम तथा कार्यविधि",
    icon: "📜",
    description: "SSF का आधिकारिक ऐन, नियमावली, कार्यविधि र निर्देशिका — यही प्लेटफर्मका guides यिनैमा आधारित छन्।",
    titleEn: "Acts, Rules & Procedures",
    descriptionEn: "SSF's official acts, regulations, procedures, and directives — the guides on this platform are based on these.",
    items: [
      { title: "योगदानमा आधारित सामाजिक सुरक्षा ऐन, २०७४", date: "2017-08-13", url: `${B}17655918798529_%E0%A4%AF%E0%A5%8B%E0%A4%97%E0%A4%A6%E0%A4%BE%E0%A4%A8%E0%A4%AE%E0%A4%BE%20%E0%A4%86%E0%A4%A7%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%A4%20%E0%A4%B8%E0%A4%BE%E0%A4%AE%E0%A4%BE%E0%A4%9C%E0%A4%BF%E0%A4%95%20%E0%A4%B8%E0%A5%81%E0%A4%B0%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AA.pdf` },
      { title: "योगदानमा आधारित सामाजिक सुरक्षा नियमावली, २०७५", date: "2018-11-19", url: `${B}16186730208783_contribution-based-ssf-rule-2075.pdf` },
      { title: "सामाजिक सुरक्षा योजना संचालन कार्यविधि (पाँचौ संशोधन सहित), २०७५", date: "2024-12-25", url: `${B}17406520344566_Social%20Security%20Operation%20Procedure%202075%20with%205th%20ammendment.pdf` },
      { title: "रोजगारदाता र श्रमिकको सूचीकरण सम्बन्धि कार्यविधि, २०७५", date: "2018-04-30", url: `${B}16186712884523_employer-and-employees-registration-procedure-2075.pdf` },
      { title: "अनौपचारिक र स्वरोजगार क्षेत्र योजना संचालन कार्यविधि (पहिलो संशोधन सहित), २०७९", date: "2024-02-29", url: `${B}17169880149914_Informal%20and%20Self%20Employed%20Procedure%20with%20First%20Amendment.pdf` },
      { title: "वैदेशिक क्षेत्र योजना संचालन कार्यविधि (पहिलो संशोधन सहित), २०७९", date: "2024-02-29", url: `${B}17169877576236_Foreign%20Employment%20Procedure%20with%20First%20Amendment.pdf` },
      { title: "योगदानकर्ता सापटी निर्देशिका (पहिलो संशोधन सहित), २०७९", date: "2024-11-17", url: `${B}17350404756141_%E0%A4%AF%E0%A5%8B%E0%A4%97%E0%A4%A6%E0%A4%BE%E0%A4%A8%E0%A4%95%E0%A4%B0%E0%A5%8D%E0%A4%A4%E0%A4%BE%20%E0%A4%B8%E0%A4%BE%E0%A4%AA%E0%A4%9F%E0%A5%80%20%E0%A4%A8%E0%A4%BF%E0%A4%B0%E0%A5%8D%E0%A4%A6%E0%A5%87%E0%A4%B6%E0%A4%BF%E0%A4%95%E0%A4%BE%2C%20%E0%A4%AA%E0%A4%B9%E0%A4%BF%E0%A4%B2%E0%A5%8B%20%E0%A4%B8%E0%A4%82%E0%A4%B6%E0%A5%8B%E0%A4%A7%E0%A4%A8.pdf` },
      { title: "सामाजिक सुरक्षा कोष लगानी कार्यविधि (पहिलो संशोधन सहित), २०७७", date: "2026-02-01", url: `${B}17699245567667_%E0%A4%B8%E0%A4%BE%E0%A4%AE%E0%A4%BE%E0%A4%9C%E0%A4%BF%E0%A4%95%20%E0%A4%B8%E0%A5%81%E0%A4%B0%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE%20%E0%A4%95%E0%A5%8B%E0%A4%B7%20%E0%A4%B2%E0%A4%97%E0%A4%BE%E0%A4%A8%E0%A5%80%20%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%AF%E0%A4%B5%E0%A4%BF%E0%A4%A7%E0%A4%BF%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AD%20%E0%A4%B8%E0%A4%82%E0%A4%B6%E0%A5%8B%E0%A4%A7%E0%A4%A8%20%E0%A4%B8%E0%A4%B9%E0%A4%BF%E0%A4%A4.pdf` },
      { title: "सामाजिक सुरक्षा कोष लगानी कार्यविधि, २०७७ (मूल)", date: "2020-07-28", url: `${B}16186709745517_ssf-investment-procedure-2077.pdf` },
      { title: "कोषको रकम (वाणिज्य बैंकहरुमा) लगानी गर्ने कार्यविधि, २०७५", date: "2019-01-02", url: `${B}16186713966344_funding-procedure-of-investing-funds-2075.pdf` },
      { title: "स्वास्थ्य संस्था छनौट तथा योजनाको रकम भुक्तानी सम्बन्धी कार्यविधि, २०७६", date: "2020-01-03", url: `${B}16186710995222_health-institute-selection-procedure-2076.pdf` },
      { title: "योगदानकर्ता सन्तति छात्रवृत्ति संचालन कार्यविधि, २०७९", date: "2022-09-21", url: `${B}16740192234387_scholarship-operation-procedure-2079.pdf` },
      { title: "सम्पत्ति शुद्धीकरण तथा आतङ्ककारी कार्यमा वित्तीय लगानी निवारण नीति, २०८२", date: "2026-01-25", url: `${B}17693332895156_final%20AML%20CFT%20policy%201.pdf` },
      { title: "सम्पत्ति शुद्धीकरण तथा आतङ्ककारी कार्यमा वित्तीय लगानी निवारण कार्यविधि, २०८२", date: "2026-01-25", url: `${B}17693336875574_final%20AML%20CFT%20procedure%20%281%29_compressed.pdf` },
      { title: "श्रम ऐन, २०७४", date: "2019-03-03", url: `${B}16430171669623_labor-act-2074.pdf` },
      { title: "श्रम नियमावली, २०७५", date: "2018-06-22", url: `${B}16430174964960_labor-regulation-2075.pdf` },
      { title: "आर्थिक प्रशासन विनियमावली, २०७६", date: "2019-07-23", url: `${B}16186711949391_financial-administration-regulation-2076.pdf` },
      { title: "कर्मचारी प्रशासन विनियमावली (पहिलो संशोधन सहित), २०७५", date: "2019-03-14", url: `${B}16917378846904_Employee_bylaws_2075_first_ammendment.pdf` },
      { title: "कार्यकारी निर्देशकको छनौट सम्बन्धी विनियमावली, २०७६", date: "2023-07-31", url: `${B}16908088129944_ed%20rule.pdf` },
    ],
  },
  {
    slug: "claim-forms",
    title: "दाबी फारमहरू",
    icon: "📝",
    description: "सुविधा दाबी गर्दा चाहिने आधिकारिक फारमहरू — print गरेर वा SOSYS मा प्रयोग गर्नुहोस्।",
    titleEn: "Claim Forms",
    descriptionEn: "Official forms needed to claim benefits — print them or use them in SOSYS.",
    items: [
      { title: "औषधी उपचार तथा स्वास्थ्य सुरक्षा योजनाको सुविधा दाबी फाराम", date: "2022-02-01", url: `${B}16436486764865_1%20%E0%A4%94%E0%A4%B7%E0%A4%A7%E0%A5%80%20%E0%A4%89%E0%A4%AA%E0%A4%9A%E0%A4%BE%E0%A4%B0%20%E0%A4%A4%E0%A4%A5%E0%A4%BE%20%E0%A4%B8%E0%A5%8D%E0%A4%B5%E0%A4%BE%E0%A4%B8%E0%A5%8D%E0%A4%A5%E0%A5%8D%E0%A4%AF%20%E0%A4%B8%E0%A5%81%E0%A4%B0%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE%20%E0%A4%AF%E0%A5%8B%E0%A4%9C%E0%A4%A8%E0%A4%BE%E0%A4%95%E0%A5%8B%20%E0%A4%B8%E0%A5%81%E0%A4%B5%E0%A4%BF%E0%A4%A7%E0%A4%BE%20%E0%A4%A6%E0%A4%BE%E0%A4%B5%E0%A5%80%20%E0%A4%AB%E0%A4%BE%E0%A4%B0%E0%A4%BE%E0%A4%AE.pdf` },
      { title: "मातृत्व सुरक्षा योजनाको सुविधा दाबी फारम", date: "2022-01-31", url: `${B}16436485675557_3%20%E0%A4%AE%E0%A4%BE%E0%A4%A4%E0%A5%83%E0%A4%A4%E0%A5%8D%E0%A4%B5%20%E0%A4%B8%E0%A5%81%E0%A4%B0%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE%20%E0%A4%AF%E0%A5%8B%E0%A4%9C%E0%A4%A8%E0%A4%BE%E0%A4%95%E0%A5%8B%20%E0%A4%B8%E0%A5%81%E0%A4%B5%E0%A4%BF%E0%A4%A7%E0%A4%BE%20%E0%A4%A6%E0%A4%BE%E0%A4%B5%E0%A5%80%20%E0%A4%AB%E0%A4%BE%E0%A4%B0%E0%A4%BE%E0%A4%AE.pdf` },
      { title: "दुर्घटना तथा अशक्तता सुरक्षा योजनाको सुविधा दाबी फारम", date: "2022-01-31", url: `${B}16436485216345_4%20%E0%A4%A6%E0%A5%81%E0%A4%B0%E0%A5%8D%E0%A4%98%E0%A4%9F%E0%A4%A8%E0%A4%BE%20%E0%A4%A4%E0%A4%A5%E0%A4%BE%20%E0%A4%85%E0%A4%B6%E0%A4%95%E0%A5%8D%E0%A4%A4%E0%A4%A4%E0%A4%BE%20%E0%A4%B8%E0%A5%81%E0%A4%B0%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE%20%E0%A4%AF%E0%A5%8B%E0%A4%9C%E0%A4%A8%E0%A4%BE%E0%A4%95%E0%A5%8B%20%E0%A4%B8%E0%A5%81%E0%A4%B5%E0%A4%BF%E0%A4%A7%E0%A4%BE%20%E0%A4%A6%E0%A4%BE%E0%A4%B5%E0%A5%80%20%E0%A4%AB%E0%A4%BE%E0%A4%B0%E0%A4%AE%20%281%29.pdf` },
      { title: "आश्रित परिवार सुरक्षा योजनाको दाबी फाराम", date: "2022-01-31", url: `${B}16478439667546_Dependent%20Family%20Form%20.pdf` },
      { title: "अस्पतालले कोष समक्ष पेश गर्ने दाबी फारम", date: "2022-01-31", url: `${B}16436486238839_2.%20%E0%A4%85%E0%A4%B8%E0%A5%8D%E0%A4%AA%E0%A4%A4%E0%A4%BE%E0%A4%B2%E0%A4%B2%E0%A5%87%20%E0%A4%95%E0%A5%8B%E0%A4%B7%20%E0%A4%B8%E0%A4%AE%E0%A4%95%E0%A5%8D%E0%A4%B7%20%E0%A4%AA%E0%A5%87%E0%A4%B6%20%E0%A4%97%E0%A4%B0%E0%A5%8D%E0%A4%A8%E0%A5%87%20%E0%A4%A6%E0%A4%BE%E0%A4%B5%E0%A5%80%20%E0%A4%AB%E0%A4%BE%E0%A4%B0%E0%A4%AE.pdf` },
      { title: "अवकाश भुक्तानी फारम (Lump Sum Withdraw)", date: "2022-01-31", url: `${B}16436478989396_9%20lum_sum_withdraw_form.pdf` },
      { title: "अवकाश सुविधा योजनामा रकमान्तर गर्ने फारम", date: "2022-01-31", url: `${B}16436478227874_10%20fund_transfer_form.pdf` },
      { title: "अवकाश सुविधा योजनामा रकम जम्मा गर्ने फारम", date: "2022-01-31", url: `${B}16436484108598_6%20gratuity_account_deposit_form.pdf` },
      { title: "स्वेच्छिक अतिरिक्त रकम जम्मा गर्ने फारम", date: "2022-01-31", url: `${B}16436481854482_8%20extra_contribution_form.pdf` },
      { title: "औषधि उपचार योजना फारम (निवृत्तभरण पश्चात्)", date: "2022-01-31", url: `${B}16436482415100_7%20contribution_after_retirement_form.pdf` },
    ],
  },
  {
    slug: "application-forms",
    title: "निवेदन फारमहरू",
    icon: "📄",
    description: "सापटी, दुर्घटना घोषणा, PSSID लगायतका निवेदन फारमहरू।",
    titleEn: "Application Forms",
    descriptionEn: "Application forms for loans, accident declarations, PSSID, and more.",
    items: [
      { title: "सापटी माग फारम", date: "2022-08-23", url: `${B}16612255117987_sapati%20magh%20faram.pdf` },
      { title: "रोजगारीजन्य दुर्घटनाको स्वघोषणा फारम", date: "2022-11-14", url: `${B}16684141894890_Accident%20self%20declaration%20form.pdf` },
      { title: "विभिन्न रोजगारदातामा PSSID थप गर्ने निवेदन", date: "2022-09-02", url: `${B}16659795449724_Add_PSSID_to_multiple_employer_form%20.pdf` },
      { title: "योगदान रकम अवकाश योजनामा हस्तान्तरण गर्ने निवेदन", date: "2022-01-31", url: `${B}16436493834366_Transfer%20to%20gratuity%20application%20form.pdf` },
      { title: "स्वास्थ्य संस्था सूचीकरण गर्ने निवेदन फारम", date: "2022-01-31", url: `${B}16436492136742_hospital%20listing%20form.pdf` },
      { title: "सेवा प्रदायक स्वास्थ्य संस्था Live Credentials फारम", date: "2022-08-28", url: `${B}17482532608453_HSP%20LIve%20Form%20-%20Annex%202.pdf` },
      { title: "मूल्याङ्कनकर्ताको रूपमा सूचीकृत हुने निवेदन", date: "2022-07-19", url: `${B}17264811684326_Valuator%20Form%20new.pdf` },
      { title: "दक्ष/विज्ञको सूचीमा नाम समावेश गर्ने निवेदन फारम", date: "2022-01-31", url: `${B}16436490548647_Roster%20Form.pdf` },
      { title: "इन्टर्न आवेदन फारम", date: "2026-01-29", url: `${B}17696627024889_Intern%20form%20%E0%A4%B8%E0%A4%BE%E0%A4%AE%E0%A4%BE%E0%A4%9C%E0%A4%BF%E0%A4%95%20%E0%A4%B8%E0%A5%81%E0%A4%B0%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE%20%E0%A4%95%E0%A5%8B%E0%A4%B7.pdf` },
    ],
  },
  {
    slug: "hospital",
    title: "अस्पताल र उपचार दर",
    icon: "🏥",
    description: "SSF-सूचीकृत अस्पताल र उपचार सेवाको आधिकारिक दर सूची।",
    titleEn: "Hospitals & Treatment Rates",
    descriptionEn: "SSF-listed hospitals and the official rate list for treatment services.",
    items: [
      { title: "स्वास्थ्य उपचार दर (Rate) सूची", url: "https://ssf.gov.np/images/page_content/16505202087003_Service%20price%20rate%20new.pdf" },
      { title: "SSF-सूचीकृत अस्पतालहरूको सूची (आधिकारिक page)", url: "https://ssf.gov.np/pages/hospital-rate-list" },
    ],
  },
];
