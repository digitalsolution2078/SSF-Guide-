import type { Metadata } from "next";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { pageSeo } from "@/lib/seo";
import {
  hospitals,
  HOSPITALS_SYNCED_AT,
  HOSPITALS_SOURCE_URL,
  HOSPITAL_RATE_LIST_URL,
  PROVINCES,
  PROVINCE_ORDER,
  provinceCounts,
} from "@/content/hospitals";
import { ssfOffices, SSF_HOTLINE } from "@/content/ssf-offices";
import { toNe } from "@/content/ssf-stats";
import { HospitalDirectory } from "@/components/hospital-directory";
import { Icon } from "@/components/icons";
import { Callout, PageHero, SectionHead } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return pageSeo({
    locale,
    path: "/hospitals",
    title: isEn
      ? `SSF Affiliated Hospitals — all ${hospitals.length} listed hospitals by province & district`
      : `SSF आबद्ध अस्पताल सूची — ${toNe(String(hospitals.length))} अस्पताल, प्रदेश र जिल्ला अनुसार`,
    description: isEn
      ? `Searchable list of every hospital affiliated with Nepal's Social Security Fund (${hospitals.length} hospitals, 7 provinces) with map links, plus how cashless treatment, the 20% co-payment and claim limits work.`
      : `सामाजिक सुरक्षा कोषसँग सम्झौता भएका सबै ${toNe(String(hospitals.length))} अस्पतालको खोज्न मिल्ने सूची (७ प्रदेश) — नक्सासहित। क्यासलेस उपचार, २०% सह-भुक्तानी र दाबी सीमा कसरी काम गर्छ।`,
  });
}

export default async function HospitalsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  const counts = provinceCounts();
  const n = (v: number) => (isEn ? String(v) : toNe(String(v)));

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isEn ? "SSF affiliated hospitals in Nepal" : "SSF आबद्ध अस्पतालहरू",
    numberOfItems: hospitals.length,
    itemListElement: hospitals.slice(0, 50).map((h, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Hospital",
        name: h.name,
        address: { "@type": "PostalAddress", addressLocality: h.district, streetAddress: h.address, addressCountry: "NP" },
        ...(h.lat && h.lng ? { geo: { "@type": "GeoCoordinates", latitude: h.lat, longitude: h.lng } } : {}),
      },
    })),
  };

  const steps = isEn
    ? [
        { icon: "clock" as const, t: "Be eligible", d: "3 months of contributions in the last 6 (new members: after the first 3 months). Cover continues 3 months after you stop." },
        { icon: "card" as const, t: "Carry your SSN / KYC", d: "Take your Social Security Number (11 digits) or the SSF app card. Treatment is registered against your SSN at the hospital's SSF desk." },
        { icon: "hospital" as const, t: "Treat at an affiliated hospital", d: "Cashless at listed hospitals. The Fund pays 80%; you pay 20% at the counter. OPD up to Rs 20,000/yr, inpatient up to Rs 1,00,000/yr (family)." },
        { icon: "alert" as const, t: "Accidents: report within 7 days", d: "For workplace accidents, inform the Fund within 7 days (message/email is fine). Non-listed hospital without notice → max Rs 7 lakh." },
      ]
    : [
        { icon: "clock" as const, t: "योग्य हुनुहोस्", d: "पछिल्ला ६ महिनामा ३ महिनाको योगदान (नयाँ सदस्य: पहिलो ३ महिनापछि)। योगदान रोकिएपछि पनि ३ महिनासम्म सुविधा रहन्छ।" },
        { icon: "card" as const, t: "SSN / KYC साथमा लैजानुहोस्", d: "११ अङ्कको सामाजिक सुरक्षा नम्बर वा SSF एपको कार्ड लैजानुहोस्। अस्पतालको SSF डेस्कमा तपाईंको SSN मा उपचार दर्ता हुन्छ।" },
        { icon: "hospital" as const, t: "आबद्ध अस्पतालमा उपचार", d: "सूचीकृत अस्पतालमा क्यासलेस। कोषले ८०% तिर्छ, तपाईंले काउन्टरमा २०%। OPD वर्षमा रु. २०,००० सम्म, भर्ना (परिवार) रु. १,००,००० सम्म।" },
        { icon: "alert" as const, t: "दुर्घटना: ७ दिनभित्र खबर", d: "रोजगारीजन्य दुर्घटना भए ७ दिनभित्र कोषलाई जानकारी दिनुहोस् (message/email पनि हुन्छ)। खबर नगरी असूचीकृत अस्पतालमा उपचार गरे बढीमा रु. ७ लाख।" },
      ];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <PageHero
        tone="health"
        icon="hospital"
        eyebrow={isEn ? "Directory · updated " + HOSPITALS_SYNCED_AT : "सूची · अद्यावधिक " + toNe(HOSPITALS_SYNCED_AT)}
        title={isEn ? "SSF affiliated hospitals" : "SSF आबद्ध अस्पतालहरू"}
        lead={
          isEn
            ? `All ${hospitals.length} hospitals that have an agreement (MoU) with the Social Security Fund — search by name, district or province, open in Maps, or sort by distance from you.`
            : `सामाजिक सुरक्षा कोषसँग सम्झौता (MoU) भएका सबै ${n(hospitals.length)} अस्पताल — नाम, जिल्ला वा प्रदेशबाट खोज्नुहोस्, नक्सामा खोल्नुहोस् वा आफ्नो नजिकका अनुसार हेर्नुहोस्।`
        }
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: isEn ? "Hospitals" : "अस्पताल" }]}
      >
        <div className="flex flex-wrap gap-2">
          {PROVINCE_ORDER.map((p) => (
            <Link key={p} href={`/hospitals?province=${p}`} className="chip">
              {isEn ? PROVINCES[p].en : PROVINCES[p].short}
              <span className="rounded-full bg-health-100 px-1.5 text-xs font-bold text-health-700">{n(counts[p])}</span>
            </Link>
          ))}
        </div>
      </PageHero>

      <section className="container-page py-10">
        <Suspense fallback={<div className="card h-40 animate-pulse bg-ink-50" />}>
          <HospitalDirectory locale={locale} />
        </Suspense>
        <p className="mt-6 text-xs text-ink-400">
          {isEn ? "Source: " : "स्रोत: "}
          <a href={HOSPITALS_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-700">
            ssf.gov.np/affiliated-hospitals
          </a>{" "}
          · {isEn ? "synced" : "अद्यावधिक"} {isEn ? HOSPITALS_SYNCED_AT : toNe(HOSPITALS_SYNCED_AT)}.{" "}
          {isEn
            ? "The Fund adds and removes hospitals; confirm at the hospital's SSF desk before admission."
            : "कोषले अस्पताल थप्ने/हटाउने गर्छ — भर्ना हुनुअघि अस्पतालको SSF डेस्कमा पुष्टि गर्नुहोस्।"}
        </p>
      </section>

      {/* How treatment works */}
      <section className="border-t border-ink-200 bg-ink-50">
        <div className="container-page py-14">
          <SectionHead
            eyebrow={isEn ? "How it works" : "कसरी काम गर्छ"}
            title={isEn ? "Getting treatment with SSF — 4 things to know" : "SSF बाट उपचार — जान्नैपर्ने ४ कुरा"}
            href="/school/medical-maternity-accident-dependent"
            linkLabel={isEn ? "Full medical guide" : "पूरा मेडिकल guide"}
          />
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.t} className="card p-5">
                <div className="flex items-center justify-between">
                  <span className="icon-tile bg-health-50 text-health-700">
                    <Icon name={s.icon} size={20} />
                  </span>
                  <span className="font-display text-2xl font-bold text-ink-200">{n(i + 1)}</span>
                </div>
                <p className="mt-4 font-semibold text-ink-900">{s.t}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Callout tone="health" title={isEn ? "Karnali has only 1 affiliated hospital" : "कर्णालीमा एउटा मात्र आबद्ध अस्पताल"}>
              {isEn
                ? "Contributors in Karnali and Sudurpashchim often need to travel to Nepalgunj, Dhangadhi or Butwal. For emergencies, any hospital can treat you — but keep bills and notify the Fund within 7 days to claim."
                : "कर्णाली र सुदूरपश्चिमका योगदानकर्ताले प्रायः नेपालगञ्ज, धनगढी वा बुटवल जानुपर्ने हुन्छ। आपतकालमा जुनसुकै अस्पतालमा उपचार गर्न सकिन्छ — तर बिल सुरक्षित राख्नुहोस् र दाबीका लागि ७ दिनभित्र कोषलाई जानकारी दिनुहोस्।"}
            </Callout>
          </div>
        </div>
      </section>

      {/* Official links + offices */}
      <section className="container-page py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionHead
              eyebrow={isEn ? "Official" : "आधिकारिक"}
              title={isEn ? "Rate list & official pages" : "उपचार दर सूची र आधिकारिक पृष्ठ"}
            />
            <ul className="mt-6 space-y-3">
              {[
                { href: HOSPITAL_RATE_LIST_URL, t: isEn ? "Treatment rate list (PDF)" : "स्वास्थ्य उपचार दर सूची (PDF)", d: isEn ? "Official service price rates hospitals bill the Fund at." : "अस्पतालले कोषलाई बिल गर्ने आधिकारिक सेवा दर।" },
                { href: HOSPITALS_SOURCE_URL, t: isEn ? "Fund's hospital map" : "कोषको अस्पताल नक्सा", d: isEn ? "The live source of this list." : "यो सूचीको प्रत्यक्ष स्रोत।" },
                { href: "https://sosys.ssf.gov.np/Modules/REGISTRATION/ContributorLogin.aspx", t: isEn ? "Contributor login (SOSYS)" : "योगदानकर्ता लगइन (SOSYS)", d: isEn ? "Check your contribution months before treatment." : "उपचारअघि आफ्नो योगदान महिना जाँच्नुहोस्।" },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="card card-hover group flex items-center gap-4 p-4">
                    <span className="icon-tile">
                      <Icon name="external" size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-ink-900 group-hover:text-primary-700">{l.t}</span>
                      <span className="block text-sm text-ink-500">{l.d}</span>
                    </span>
                    <Icon name="arrowUpRight" size={18} className="text-ink-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHead
              eyebrow={isEn ? "Need the Fund?" : "कोषलाई सम्पर्क"}
              title={isEn ? "SSF offices & helpline" : "SSF कार्यालय र हटलाइन"}
            />
            <div className="card mt-6 p-5">
              <p className="text-sm text-ink-500">{isEn ? "Toll-free helpline (NTC/NCELL)" : "टोल फ्री हटलाइन (NTC/NCELL)"}</p>
              <a href={`tel:${SSF_HOTLINE}`} className="mt-1 block font-display text-4xl font-bold text-primary-700">
                {SSF_HOTLINE}
              </a>
              <p className="mt-1 text-xs text-ink-400">
                {isEn ? "Medical claim desk: 01-5356315 · claim@ssf.gov.np" : "मेडिकल दाबी डेस्क: ०१-५३५६३१५ · claim@ssf.gov.np"}
              </p>
            </div>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {ssfOffices.map((o) => (
                <li key={o.key} className="rounded-xl border border-ink-200 bg-white px-3.5 py-3 text-sm">
                  <p className="font-semibold text-ink-900">{isEn ? o.nameEn : o.nameNe}</p>
                  <p className="text-ink-500">{isEn ? o.addressEn : o.addressNe}</p>
                  <p className="mt-1 text-xs text-ink-500">
                    <a href={`tel:${o.phones[0].replace(/-/g, "")}`} className="hover:text-primary-700">{o.phones[0]}</a>
                  </p>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn-ghost mt-3 -ml-2">
              {isEn ? "All SSF desks & emails" : "सबै SSF डेस्क र इमेल"}
              <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
