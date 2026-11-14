"use client";

import { useActionState } from "react";
import { useLocale } from "next-intl";
import { submitLeadAction, type LeadFormState } from "@/app/actions/submit-lead";
import { trackEvent } from "@/lib/analytics";
import { Icon } from "./icons";

const initialState: LeadFormState = { status: "idle" };

const SERVICES = [
  { value: "kyc_verification", label: "KYC Verification", labelEn: "KYC Verification" },
  { value: "registration", label: "Registration", labelEn: "Registration" },
  { value: "profile_correction", label: "Profile Correction", labelEn: "Profile Correction" },
  { value: "nominee_update", label: "Nominee Update", labelEn: "Nominee Update" },
  { value: "contribution_problem", label: "Contribution समस्या", labelEn: "Contribution problem" },
  { value: "employer_assistance", label: "Employer Assistance", labelEn: "Employer Assistance" },
  { value: "claim_guidance", label: "Claim Guidance", labelEn: "Claim Guidance" },
  { value: "other", label: "अन्य", labelEn: "Other" },
];

const CATEGORIES = [
  { value: "EMPLOYEE", label: "कर्मचारी", labelEn: "Employee" },
  { value: "EMPLOYER", label: "रोजगारदाता/HR", labelEn: "Employer / HR" },
  { value: "FOREIGN_EMPLOYMENT", label: "वैदेशिक रोजगारी", labelEn: "Foreign employment" },
  { value: "SELF_EMPLOYED", label: "स्वरोजगार", labelEn: "Self-employed" },
  { value: "INFORMAL_SECTOR", label: "अनौपचारिक क्षेत्र", labelEn: "Informal sector" },
  { value: "CONTRIBUTOR_BENEFICIARY", label: "योगदानकर्ता/Beneficiary", labelEn: "Contributor / beneficiary" },
  { value: "DEPENDENT_FAMILY", label: "परिवार/आश्रित", labelEn: "Family / dependent" },
  { value: "UNSURE", label: "निश्चित छैन", labelEn: "Not sure" },
];

const labelCls = "block text-sm font-medium text-ink-700";
const inputCls = "input mt-1.5";
const selectCls = "select mt-1.5";

export function LeadForm({ initialService }: { initialService?: string }) {
  const locale = useLocale();
  const isEn = locale === "en";
  const [state, formAction, pending] = useActionState(
    submitLeadAction,
    initialState,
  );
  const defaultService = SERVICES.some((s) => s.value === initialService)
    ? initialService
    : "kyc_verification";

  return (
    <form
      action={formAction}
      onSubmit={(e) => trackEvent("lead_submit", { service: String(new FormData(e.currentTarget).get("serviceSlug") ?? "") })}
      className="card space-y-5 p-6"
    >
      {state.status === "error" && (
        <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
          <span>{state.message}</span>
        </p>
      )}

      <label className={labelCls}>
        {isEn ? "Which service do you need? *" : "कुन सेवा चाहिन्छ? *"}
        <select name="serviceSlug" defaultValue={defaultService} className={selectCls}>
          {SERVICES.map((s) => (
            <option key={s.value} value={s.value}>
              {isEn ? s.labelEn : s.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelCls}>
          {isEn ? "Full name *" : "पूरा नाम *"}
          <input name="fullName" required minLength={2} className={inputCls} />
        </label>
        <label className={labelCls}>
          {isEn ? "Mobile/WhatsApp number *" : "Mobile/WhatsApp नम्बर *"}
          <input
            name="mobile"
            required
            inputMode="tel"
            pattern="\+?[0-9]{7,15}"
            placeholder="98XXXXXXXX"
            className={inputCls}
          />
        </label>
        <label className={labelCls}>
          {isEn ? "District *" : "जिल्ला *"}
          <input name="district" required className={inputCls} />
        </label>
        <label className={labelCls}>
          {isEn ? "Your category *" : "तपाईंको category *"}
          <select name="userCategory" className={selectCls}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {isEn ? c.labelEn : c.label}
              </option>
            ))}
          </select>
        </label>
        <label className={labelCls}>
          {isEn ? "Preferred contact channel *" : "सम्पर्क माध्यम *"}
          <select name="preferredContact" className={selectCls}>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="PHONE">Phone</option>
            <option value="EMAIL">Email</option>
          </select>
        </label>
        <label className={labelCls}>
          Email (optional)
          <input name="email" type="email" className={inputCls} />
        </label>
        <label className={`${labelCls} sm:col-span-2`}>
          {isEn
            ? "Which country are you in now? (optional)"
            : "हाल कुन देशमा हुनुहुन्छ? (optional)"}
          <input name="currentCountry" className={inputCls} />
        </label>
      </div>

      <label className={labelCls}>
        {isEn
          ? "Short description of the problem/need *"
          : "समस्या/आवश्यकताको छोटो विवरण *"}
        <textarea
          name="issueDescription"
          required
          minLength={5}
          rows={4}
          className={inputCls}
          placeholder={
            isEn
              ? "E.g.: My documents keep getting rejected when doing KYC from abroad…"
              : "जस्तै: विदेशबाट KYC गर्न खोज्दा कागजात reject भइरहेको छ…"
          }
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelCls}>
          {isEn ? "Do you have an SSF account (SSN)?" : "SSF खाता (SSN) छ?"}
          <select name="hasSSFAccount" className={selectCls}>
            <option value="yes">{isEn ? "Yes" : "छ"}</option>
            <option value="no">{isEn ? "No" : "छैन"}</option>
            <option value="unknown">{isEn ? "Not sure" : "थाहा छैन"}</option>
          </select>
        </label>
        <label className={labelCls}>
          {isEn ? "Is your KYC complete?" : "KYC complete छ?"}
          <select name="kycComplete" className={selectCls}>
            <option value="no">{isEn ? "No" : "छैन"}</option>
            <option value="yes">{isEn ? "Yes" : "छ"}</option>
            <option value="unknown">{isEn ? "Not sure" : "थाहा छैन"}</option>
          </select>
        </label>
      </div>

      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="surface space-y-3 p-4 text-sm text-ink-700">
        <label className="flex items-start gap-2.5">
          <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-primary-600" />
          <span>
            {isEn ? (
              <>
                I agree to my information being used for this assistance request.
                I understand that Digital Solution is an{" "}
                <strong>independent assistance provider</strong>, not an official
                SSF office. *
              </>
            ) : (
              <>
                म सहायता अनुरोधका लागि आफ्नो जानकारी प्रयोग गर्न सहमत छु। मैले बुझेको
                छु कि Digital Solution <strong>स्वतन्त्र सहायता प्रदायक</strong> हो,
                आधिकारिक SSF कार्यालय होइन। *
              </>
            )}
          </span>
        </label>
        <label className="flex items-start gap-2.5">
          <input type="checkbox" name="marketing" className="mt-1 h-4 w-4 accent-primary-600" />
          <span>
            {isEn
              ? "I'd like to receive useful updates from Digital Solution. (optional)"
              : "म Digital Solution का उपयोगी updates प्राप्त गर्न चाहन्छु। (optional)"}
          </span>
        </label>
      </div>

      <button type="submit" disabled={pending} className="btn-accent btn-lg w-full">
        {pending
          ? isEn
            ? "Sending…"
            : "पठाउँदै…"
          : isEn
            ? "Send request"
            : "अनुरोध पठाउनुहोस्"}
        {!pending && <Icon name="send" size={18} />}
      </button>

      <p className="flex items-start gap-2 text-xs text-ink-500">
        <Icon name="alert" size={14} className="mt-0.5 shrink-0 text-action-600" />
        <span>
          {isEn
            ? "Digital Solution never asks for your OTP, password, or banking PIN by phone or chat. Do not send documents through this form."
            : "Digital Solution ले फोन वा Chat मार्फत तपाईंको OTP, Password वा Banking PIN माग्दैन। कागजात यो फाराममा नपठाउनुहोस्।"}
        </span>
      </p>
    </form>
  );
}
