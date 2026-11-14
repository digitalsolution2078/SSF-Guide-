"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSsfProfile } from "@/lib/profile";
import { waContext, WHATSAPP_DISPLAY } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { Icon } from "@/components/icons";
import { countryByCode } from "./country-panel";

/**
 * Digital Solution CTA for migrant workers — the WhatsApp message carries the
 * selected country (from the browser profile) so the agent has context.
 */
export function ForeignCta() {
  const locale = useLocale();
  const isEn = locale === "en";
  const { profile } = useSsfProfile();
  const country = countryByCode(profile.country);

  const facts = [
    country ? (isEn ? `Country: ${country.nameEn}` : `देश: ${country.nameNe}`) : isEn ? "Country: not selected" : "देश: छानिएको छैन",
    isEn ? "Topic: registration / KYC / payment from abroad" : "विषय: सूचीकरण / KYC / विदेशबाट भुक्तानी",
  ];
  const href = waContext(isEn ? "SSF for foreign employment" : "वैदेशिक रोजगार SSF", facts, isEn);

  return (
    <div className="rounded-2xl border border-primary-200 bg-primary-50 p-5 md:p-6">
      <p className="eyebrow">Digital Solution</p>
      <h3 className="mt-1.5 text-xl">{isEn ? "Need a hand from abroad?" : "विदेशबाटै सहायता चाहियो?"}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">
        {isEn
          ? "Registration, ID/password recovery, KYC and payment setup — an independent service by Digital Solution, not the Fund. Message on WhatsApp from any country."
          : "सूचीकरण, ID/password रिकभरी, KYC र भुक्तानी सेटअप — Digital Solution को स्वतन्त्र सेवा, कोष होइन। जुनसुकै देशबाट WhatsApp मा लेख्नुहोस्।"}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("cta_click", { cta: "whatsapp", location: "foreign_hub", country: country?.code })}
          className="btn-accent"
        >
          <Icon name="chat" size={16} />
          WhatsApp {WHATSAPP_DISPLAY}
        </a>
        <Link href="/request?service=registration" className="btn-outline" onClick={() => trackEvent("cta_click", { cta: "request", location: "foreign_hub" })}>
          <Icon name="send" size={16} />
          {isEn ? "Request assistance" : "सहायता अनुरोध"}
        </Link>
      </div>
    </div>
  );
}
