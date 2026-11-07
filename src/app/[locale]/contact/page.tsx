import type { Metadata } from "next";
import { legalDocs } from "@/content/legal";
import { ssfOffices, ssfDesks, SSF_HOTLINE, SSF_CALL_CENTER, SSF_OFFICES_SYNCED_AT } from "@/content/ssf-offices";
import { LegalDocPage } from "@/components/legal-doc";
import { Icon } from "@/components/icons";
import { PageHero, SectionHead } from "@/components/ui";
import { pageSeo } from "@/lib/seo";

const doc = legalDocs["contact"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return pageSeo({
    locale,
    path: "/contact",
    title: isEn && doc.titleEn ? doc.titleEn : doc.title,
    description: isEn
      ? "Contact Digital Solution for SSF help — KYC, registration, corrections and employer onboarding. Pokhara, Nepal."
      : "SSF सहायता — KYC, registration, correction र employer onboarding का लागि Digital Solution लाई सम्पर्क गर्नुहोस्। पोखरा, नेपाल।",
  });
}

const tel = (p: string) => `tel:${p.replace(/[^\d+]/g, "")}`;

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  const kindLabel = (k: "head" | "branch" | "contact") =>
    k === "head"
      ? isEn ? "Head office" : "केन्द्रीय"
      : k === "branch"
        ? isEn ? "Branch" : "शाखा"
        : isEn ? "Contact office" : "सम्पर्क";

  const title = isEn && doc.titleEn ? doc.titleEn : doc.title;

  return (
    <div>
      <PageHero
        icon="phone"
        eyebrow={isEn ? "Help" : "सहायता"}
        title={title}
        lead={
          isEn
            ? "The Social Security Fund's own hotline, offices and topic desks come first — for official matters (registration, claims, KYC). Digital Solution's contact details follow below."
            : "पहिले सामाजिक सुरक्षा कोषकै हटलाइन, कार्यालय र विषयगत डेस्क — आधिकारिक काम (सूचीकरण, दाबी, KYC) का लागि। Digital Solution को सम्पर्क विवरण तल छ।"
        }
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: title }]}
      />

      {/* Official SSF contacts — the Fund's own, not Digital Solution's */}
      <section className="container-page py-12">
        <SectionHead
          eyebrow={isEn ? "Social Security Fund (ssf.gov.np)" : "सामाजिक सुरक्षा कोष (ssf.gov.np)"}
          title={isEn ? "Official SSF contacts" : "आधिकारिक SSF सम्पर्क"}
          lead={
            isEn
              ? "These are the Fund's official channels — not Digital Solution's. For official decisions, call the Fund directly."
              : "यी सामाजिक सुरक्षा कोषका आधिकारिक माध्यम हुन् — Digital Solution का होइनन्। आधिकारिक निर्णयका लागि कोषलाई सीधै सम्पर्क गर्नुहोस्।"
          }
        />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="card p-6">
            <p className="text-sm text-ink-500">{isEn ? "Toll-free hotline (NTC/NCELL)" : "टोल फ्री हटलाइन (NTC/NCELL)"}</p>
            <a href={tel(SSF_HOTLINE)} className="mt-1 block font-display text-5xl font-bold text-primary-700 hover:text-primary-800">
              {SSF_HOTLINE}
            </a>
          </div>
          <div className="card p-6">
            <p className="text-sm text-ink-500">{isEn ? "Call centre" : "कल सेन्टर"}</p>
            <a href={tel(SSF_CALL_CENTER)} className="mt-1 block font-display text-3xl font-bold text-ink-900 hover:text-primary-700">
              {SSF_CALL_CENTER}
            </a>
            <p className="mt-2 text-xs text-ink-400">
              <a href="https://ssf.gov.np" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-700">
                ssf.gov.np
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12">
          <SectionHead
            eyebrow={isEn ? "Offices" : "कार्यालय"}
            title={isEn ? "SSF offices" : "SSF कार्यालयहरू"}
          />
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ssfOffices.map((o) => (
              <li key={o.key} className="card card-hover p-5">
                <div className="flex items-start gap-3.5">
                  <span className="icon-tile">
                    <Icon name={o.kind === "head" ? "landmark" : "building"} size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-ink-900">{isEn ? o.nameEn : o.nameNe}</p>
                      <span className={o.kind === "head" ? "badge-primary" : "badge-neutral"}>{kindLabel(o.kind)}</span>
                    </div>
                    <p className="mt-1 flex items-start gap-1.5 text-sm text-ink-500">
                      <Icon name="mapPin" size={14} className="mt-0.5 shrink-0" />
                      {isEn ? o.addressEn : o.addressNe}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      {o.phones.map((p) => (
                        <a key={p} href={tel(p)} className="inline-flex items-center gap-1 text-ink-700 hover:text-primary-700">
                          <Icon name="phone" size={14} />
                          {p}
                        </a>
                      ))}
                      <a href={`mailto:${o.email}`} className="inline-flex items-center gap-1 text-primary-700 hover:underline">
                        <Icon name="mail" size={14} />
                        {o.email}
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12">
          <SectionHead
            eyebrow={isEn ? "Desks" : "डेस्क"}
            title={isEn ? "Topic-specific desks" : "विषयगत डेस्क"}
            lead={isEn ? "Head office desks by topic (phone / email)." : "केन्द्रीय कार्यालयका विषयअनुसारका डेस्क (फोन / इमेल)।"}
          />
          <div className="card mt-6 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-sm">
              <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">{isEn ? "Topic" : "विषय"}</th>
                  <th className="px-4 py-3 font-semibold">{isEn ? "Phone" : "फोन"}</th>
                  <th className="px-4 py-3 font-semibold">{isEn ? "Email" : "इमेल"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {ssfDesks.map((d) => (
                  <tr key={d.topicEn} className="hover:bg-ink-50/60">
                    <td className="px-4 py-3 font-medium text-ink-900">{isEn ? d.topicEn : d.topicNe}</td>
                    <td className="px-4 py-3 text-ink-700">
                      {d.phone ? (
                        <a href={tel(d.phone)} className="hover:text-primary-700">{d.phone}</a>
                      ) : (
                        <span className="text-ink-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {d.email ? (
                        <a href={`mailto:${d.email}`} className="break-all text-primary-700 hover:underline">{d.email}</a>
                      ) : (
                        <span className="text-ink-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink-400">
            {isEn ? "Source: ssf.gov.np · synced " : "स्रोत: ssf.gov.np · अद्यावधिक "}
            {SSF_OFFICES_SYNCED_AT}
          </p>
        </div>
      </section>

      {/* Digital Solution contact (legal doc) */}
      <section className="border-t border-ink-200 bg-ink-50">
        <LegalDocPage doc={doc} locale={locale} embedded eyebrow="Digital Solution" />
      </section>
    </div>
  );
}
