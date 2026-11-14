import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { pageSeo, absoluteUrl } from "@/lib/seo";
import { hospitals, PROVINCES, SPECIALTIES, HOSPITALS_SYNCED_AT, HOSPITALS_SOURCE_URL, type Hospital } from "@/content/hospitals";
import { toNe } from "@/content/ssf-stats";
import { Icon, type IconName } from "@/components/icons";
import { Callout, LinkCard, PageHero, SectionHead } from "@/components/ui";
import { HospitalReportForm } from "@/components/hospital-report-form";
import { HospitalReportsSection } from "@/components/hospital-reports-section";

/** Statically generated; approved reports refresh hourly (and on admin moderation). */
export const revalidate = 3600;

const SSF_MEDICAL_DESK = "01-5356315";

export function generateStaticParams() {
  return hospitals.map((h) => ({ id: String(h.id) }));
}

function findHospital(id: string): Hospital | undefined {
  const num = Number(id);
  if (!Number.isInteger(num)) return undefined;
  return hospitals.find((h) => h.id === num);
}

function specialtyIcon(h: Hospital): IconName {
  switch (h.specialty) {
    case "eye":
      return "eye";
    case "heart":
      return "heart";
    case "children":
      return "baby";
    case "teaching":
      return "grad";
    default:
      return "hospital";
  }
}

function mapsSearchUrl(h: Hospital) {
  if (h.lat && h.lng) return `https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${h.name} ${h.address} ${h.district}`)}`;
}

function directionsUrl(h: Hospital) {
  const dest = h.lat && h.lng ? `${h.lat},${h.lng}` : encodeURIComponent(`${h.name} ${h.district}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
}

/** Up to `max` other hospitals: same district first, then the rest of the province. */
function nearbyHospitals(h: Hospital, max = 6): Hospital[] {
  const sameDistrict = hospitals.filter((x) => x.id !== h.id && x.district === h.district);
  const sameProvince = hospitals.filter((x) => x.id !== h.id && x.district !== h.district && x.province === h.province);
  return [...sameDistrict, ...sameProvince].slice(0, max);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const h = findHospital(id);
  const isEn = locale === "en";
  if (!h) return pageSeo({ locale, path: `/hospitals/${id}` });
  const prov = isEn ? PROVINCES[h.province].en : PROVINCES[h.province].ne;
  return pageSeo({
    locale,
    path: `/hospitals/${h.id}`,
    title: isEn
      ? `${h.name} — SSF affiliated hospital in ${h.district}, ${prov}`
      : `${h.name} — ${h.district}, ${prov} को SSF आबद्ध अस्पताल`,
    description: isEn
      ? `${h.name} (${h.address}, ${h.district}) has an agreement with Nepal's Social Security Fund: cashless treatment with 20% co-payment. Map, directions, SSF desk number, how to get treated and contributor experience reports.`
      : `${h.name} (${h.address}, ${h.district}) सामाजिक सुरक्षा कोषसँग सम्झौता भएको अस्पताल — २०% सह-भुक्तानीमा क्यासलेस उपचार। नक्सा, बाटो, SSF डेस्क नम्बर, उपचार लिने तरिका र योगदानकर्ताका अनुभव।`,
  });
}

export default async function HospitalDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const h = findHospital(id);
  if (!h) notFound();
  const isEn = locale === "en";
  const n = (v: number | string) => (isEn ? String(v) : toNe(String(v)));
  const prov = isEn ? PROVINCES[h.province].en : PROVINCES[h.province].ne;
  const hasGeo = Boolean(h.lat && h.lng);
  const nearby = nearbyHospitals(h);
  const pageUrl = absoluteUrl(locale, `/hospitals/${h.id}`);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Hospital",
      name: h.name,
      url: pageUrl,
      address: {
        "@type": "PostalAddress",
        streetAddress: h.address,
        addressLocality: h.district,
        addressRegion: PROVINCES[h.province].en,
        addressCountry: "NP",
      },
      ...(hasGeo ? { geo: { "@type": "GeoCoordinates", latitude: h.lat, longitude: h.lng } } : {}),
      ...(hasGeo ? { hasMap: mapsSearchUrl(h) } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: isEn ? "Home" : "गृहपृष्ठ", item: absoluteUrl(locale, "/") },
        { "@type": "ListItem", position: 2, name: isEn ? "Hospitals" : "अस्पताल", item: absoluteUrl(locale, "/hospitals") },
        { "@type": "ListItem", position: 3, name: h.name, item: pageUrl },
      ],
    },
  ];

  const steps = isEn
    ? [
        { icon: "clock" as const, t: "Be eligible", d: "3 months of contributions in the last 6 (new members: after the first 3 months). Cover continues 3 months after you stop." },
        { icon: "card" as const, t: "Carry your SSN / KYC", d: "Take your Social Security Number (11 digits) or the SSF app card. Treatment is registered against your SSN at this hospital's SSF desk." },
        { icon: "hospital" as const, t: "Treat here, cashless", d: "The Fund pays 80%; you pay 20% at the counter. OPD up to Rs 20,000/yr, inpatient up to Rs 1,00,000/yr (family)." },
        { icon: "alert" as const, t: "Accidents: report within 7 days", d: "For workplace accidents, inform the Fund within 7 days (message/email is fine). Non-listed hospital without notice → max Rs 7 lakh." },
      ]
    : [
        { icon: "clock" as const, t: "योग्य हुनुहोस्", d: "पछिल्ला ६ महिनामा ३ महिनाको योगदान (नयाँ सदस्य: पहिलो ३ महिनापछि)। योगदान रोकिएपछि पनि ३ महिनासम्म सुविधा रहन्छ।" },
        { icon: "card" as const, t: "SSN / KYC साथमा लैजानुहोस्", d: "११ अङ्कको सामाजिक सुरक्षा नम्बर वा SSF एपको कार्ड लैजानुहोस्। यस अस्पतालको SSF डेस्कमा तपाईंको SSN मा उपचार दर्ता हुन्छ।" },
        { icon: "hospital" as const, t: "यहाँ क्यासलेस उपचार", d: "कोषले ८०% तिर्छ, तपाईंले काउन्टरमा २०%। OPD वर्षमा रु. २०,००० सम्म, भर्ना (परिवार) रु. १,००,००० सम्म।" },
        { icon: "alert" as const, t: "दुर्घटना: ७ दिनभित्र खबर", d: "रोजगारीजन्य दुर्घटना भए ७ दिनभित्र कोषलाई जानकारी दिनुहोस् (message/email पनि हुन्छ)। खबर नगरी असूचीकृत अस्पतालमा उपचार गरे बढीमा रु. ७ लाख।" },
      ];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        tone="health"
        icon={specialtyIcon(h)}
        eyebrow={isEn ? `SSF affiliated hospital · synced ${HOSPITALS_SYNCED_AT}` : `SSF आबद्ध अस्पताल · अद्यावधिक ${toNe(HOSPITALS_SYNCED_AT)}`}
        title={h.name}
        lead={
          isEn
            ? `Treatment here is cashless for eligible SSF contributors — you pay 20% at the counter, the Fund pays the rest. Register at the hospital's SSF desk with your SSN.`
            : `योग्य SSF योगदानकर्ताका लागि यहाँ उपचार क्यासलेस छ — काउन्टरमा २०% तिर्नुहोस्, बाँकी कोषले तिर्छ। अस्पतालको SSF डेस्कमा आफ्नो SSN सहित दर्ता गर्नुहोस्।`
        }
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: isEn ? "Hospitals" : "अस्पताल", href: "/hospitals" },
          { label: h.name },
        ]}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="badge-neutral">
            <Icon name="mapPin" size={12} />
            {h.address}
          </span>
          <span className="badge-neutral">{h.district}</span>
          <Link href={`/hospitals?province=${h.province}`} className="badge-neutral hover:text-primary-700">
            {prov}
          </Link>
          <span className="badge-health">{isEn ? SPECIALTIES[h.specialty].en : SPECIALTIES[h.specialty].ne}</span>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <a href={mapsSearchUrl(h)} target="_blank" rel="noopener noreferrer" className="btn-health">
            <Icon name="mapPin" size={16} />
            {isEn ? "Open in Maps" : "नक्सामा हेर्नुहोस्"}
          </a>
          <a href={directionsUrl(h)} target="_blank" rel="noopener noreferrer" className="btn-outline">
            <Icon name="compass" size={16} />
            {isEn ? "Directions" : "बाटो देखाउनुहोस्"}
          </a>
          <a href={`tel:${SSF_MEDICAL_DESK.replace(/-/g, "")}`} className="btn-outline">
            <Icon name="phone" size={16} />
            {isEn ? `Call SSF desk ${SSF_MEDICAL_DESK}` : `SSF डेस्क ${toNe(SSF_MEDICAL_DESK)}`}
          </a>
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(`${h.name} ${h.district} phone`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <Icon name="search" size={16} />
            {isEn ? "Contact (Google search)" : "सम्पर्क (Google खोज)"}
            <Icon name="arrowUpRight" size={14} />
          </a>
        </div>
      </PageHero>

      {/* Map + at-a-glance */}
      <section className="container-page py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            {hasGeo ? (
              <iframe
                src={`https://www.google.com/maps?q=${h.lat},${h.lng}&z=15&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full rounded-2xl border border-ink-200 md:h-80"
                title={isEn ? `Map of ${h.name}` : `${h.name} को नक्सा`}
              />
            ) : (
              <div className="surface flex h-64 flex-col items-center justify-center p-6 text-center md:h-80">
                <Icon name="mapPin" size={28} className="text-ink-300" />
                <p className="mt-3 font-semibold text-ink-800">
                  {isEn ? "Coordinates not published by the Fund" : "कोषले यस अस्पतालको coordinates प्रकाशित गरेको छैन"}
                </p>
                <p className="mt-1 max-w-sm text-sm text-ink-500">
                  {isEn
                    ? `Use "Open in Maps" above — it searches Google Maps for "${h.name}, ${h.district}".`
                    : `माथिको "नक्सामा हेर्नुहोस्" प्रयोग गर्नुहोस् — यसले Google Maps मा "${h.name}, ${h.district}" खोज्छ।`}
                </p>
              </div>
            )}
            <p className="mt-3 text-xs text-ink-400">
              {isEn ? "Listing source: " : "सूचीको स्रोत: "}
              <a href={HOSPITALS_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-700">
                ssf.gov.np/affiliated-hospitals
              </a>
              {" · "}
              {isEn
                ? "The Fund adds and removes hospitals — confirm at the SSF desk before admission."
                : "कोषले अस्पताल थप्ने/हटाउने गर्छ — भर्ना हुनुअघि SSF डेस्कमा पुष्टि गर्नुहोस्।"}
            </p>
          </div>

          <dl className="card grid grid-cols-1 gap-y-4 p-5 text-sm">
            <div>
              <dt className="text-ink-500">{isEn ? "Address" : "ठेगाना"}</dt>
              <dd className="mt-0.5 font-semibold text-ink-900">
                {h.address}, {h.district}
              </dd>
            </div>
            <div>
              <dt className="text-ink-500">{isEn ? "Province" : "प्रदेश"}</dt>
              <dd className="mt-0.5 font-semibold text-ink-900">{prov}</dd>
            </div>
            <div>
              <dt className="text-ink-500">{isEn ? "Type" : "प्रकार"}</dt>
              <dd className="mt-0.5 font-semibold text-ink-900">{isEn ? SPECIALTIES[h.specialty].en : SPECIALTIES[h.specialty].ne}</dd>
            </div>
            <div>
              <dt className="text-ink-500">{isEn ? "Your share at the counter" : "काउन्टरमा तपाईंको हिस्सा"}</dt>
              <dd className="mt-0.5 font-semibold text-health-700">{n("20")}%</dd>
            </div>
            <div>
              <dt className="text-ink-500">{isEn ? "Annual limits" : "वार्षिक सीमा"}</dt>
              <dd className="mt-0.5 font-semibold text-ink-900">
                {isEn ? "OPD Rs 20,000 · Inpatient Rs 1,00,000" : "OPD रु. २०,००० · भर्ना रु. १,००,०००"}
              </dd>
            </div>
            <div>
              <dt className="text-ink-500">{isEn ? "SSF medical claim desk" : "SSF मेडिकल दाबी डेस्क"}</dt>
              <dd className="mt-0.5 font-semibold text-ink-900">
                <a href={`tel:${SSF_MEDICAL_DESK.replace(/-/g, "")}`} className="hover:text-primary-700">
                  {isEn ? SSF_MEDICAL_DESK : toNe(SSF_MEDICAL_DESK)}
                </a>{" "}
                · <a href="mailto:claim@ssf.gov.np" className="hover:text-primary-700">claim@ssf.gov.np</a>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* How to get treatment */}
      <section className="border-y border-ink-200 bg-ink-50">
        <div className="container-page py-14">
          <SectionHead
            eyebrow={isEn ? "How it works" : "कसरी काम गर्छ"}
            title={isEn ? "How to get treated with SSF" : "SSF मा उपचार लिने तरिका"}
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
            <Callout tone="warn" title={isEn ? "If the SSF desk refuses cashless treatment" : "SSF डेस्कले क्यासलेस गर्न मानेन भने"}>
              {isEn
                ? "Pay, but keep every bill, prescription and discharge paper. You can claim the Fund's 80% share later through SOSYS (contributor login → medical claim) or at any SSF office. If the desk says you are not eligible, check your contribution months in SOSYS first, then call the toll-free helpline 1116."
                : "तिर्नुहोस्, तर हरेक बिल, प्रेस्क्रिप्शन र डिस्चार्ज कागज सुरक्षित राख्नुहोस्। कोषको ८०% हिस्सा पछि SOSYS (योगदानकर्ता लगइन → मेडिकल दाबी) वा कुनै पनि SSF कार्यालयबाट दाबी गर्न सकिन्छ। डेस्कले \"योग्य छैन\" भन्यो भने पहिले SOSYS मा आफ्नो योगदान महिना जाँच्नुहोस्, त्यसपछि टोल फ्री हटलाइन १११६ मा फोन गर्नुहोस्।"}
            </Callout>
          </div>
        </div>
      </section>

      {/* Experience reports */}
      <section className="container-page py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHead
              eyebrow={isEn ? "From contributors" : "योगदानकर्ताका अनुभव"}
              title={isEn ? "Wait times & cashless experience" : "पर्खाइ समय र क्यासलेस अनुभव"}
              lead={
                isEn
                  ? "Anonymous reports from people treated here with SSF. Moderated before publishing; not a medical quality rating."
                  : "यहाँ SSF बाट उपचार गरेकाहरूका गुमनाम report। प्रकाशनअघि moderate गरिन्छ; यो चिकित्सा गुणस्तरको rating होइन।"
              }
            />
            <div className="mt-6">
              <Suspense fallback={<div className="card h-32 animate-pulse bg-ink-50" />}>
                <HospitalReportsSection hospitalId={h.id} isEn={isEn} />
              </Suspense>
            </div>
          </div>
          <div>
            <SectionHead
              eyebrow={isEn ? "60 seconds" : "६० सेकेन्ड"}
              title={isEn ? "Share your experience" : "आफ्नो अनुभव बाँड्नुहोस्"}
              as="h3"
            />
            <div className="mt-6">
              <HospitalReportForm hospitalId={h.id} />
            </div>
          </div>
        </div>
      </section>

      {/* Nearby */}
      {nearby.length > 0 && (
        <section className="border-t border-ink-200 bg-ink-50">
          <div className="container-page py-14">
            <SectionHead
              eyebrow={prov}
              title={isEn ? "Other SSF hospitals nearby" : "नजिकका अन्य SSF अस्पताल"}
              lead={isEn ? `Same district first, then the rest of ${prov}.` : `पहिले ${h.district} जिल्लाका, त्यसपछि ${prov}का।`}
              href={`/hospitals?province=${h.province}`}
              linkLabel={isEn ? `All in ${PROVINCES[h.province].en}` : `${PROVINCES[h.province].short}का सबै`}
            />
            <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {nearby.map((x) => (
                <LinkCard
                  key={x.id}
                  href={`/hospitals/${x.id}`}
                  title={x.name}
                  description={`${x.address} · ${x.district}`}
                  icon={specialtyIcon(x)}
                  tone="health"
                  badge={x.specialty !== "general" ? (isEn ? SPECIALTIES[x.specialty].en : SPECIALTIES[x.specialty].ne) : undefined}
                  meta={x.district === h.district ? (isEn ? "Same district" : "उही जिल्ला") : prov}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
