"use client";

import { useActionState } from "react";
import { useLocale } from "next-intl";
import { submitLeadAction, type LeadFormState } from "@/app/actions/submit-lead";

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

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";

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
      className="space-y-5 rounded-xl border border-primary-100 bg-white p-6 shadow-sm"
    >
      {state.status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <label className="block text-sm font-semibold text-gray-800">
        {isEn ? "Which service do you need? *" : "कुन सेवा चाहिन्छ? *"}
        <select name="serviceSlug" defaultValue={defaultService} className={inputCls}>
          {SERVICES.map((s) => (
            <option key={s.value} value={s.value}>
              {isEn ? s.labelEn : s.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-gray-800">
          {isEn ? "Full name *" : "पूरा नाम *"}
          <input name="fullName" required minLength={2} className={inputCls} />
        </label>
        <label className="block text-sm font-semibold text-gray-800">
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
        <label className="block text-sm font-semibold text-gray-800">
          {isEn ? "District *" : "जिल्ला *"}
          <input name="district" required className={inputCls} />
        </label>
        <label className="block text-sm font-semibold text-gray-800">
          {isEn ? "Your category *" : "तपाईंको category *"}
          <select name="userCategory" className={inputCls}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {isEn ? c.labelEn : c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-gray-800">
          {isEn ? "Preferred contact channel *" : "सम्पर्क माध्यम *"}
          <select name="preferredContact" className={inputCls}>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="PHONE">Phone</option>
            <option value="EMAIL">Email</option>
          </select>
        </label>
        <label className="block text-sm font-semibold text-gray-800">
          Email (optional)
          <input name="email" type="email" className={inputCls} />
        </label>
        <label className="block text-sm font-semibold text-gray-800 sm:col-span-2">
          {isEn
            ? "Which country are you in now? (optional)"
            : "हाल कुन देशमा हुनुहुन्छ? (optional)"}
          <input name="currentCountry" className={inputCls} />
        </label>
      </div>

      <label className="block text-sm font-semibold text-gray-800">
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
        <label className="block text-sm font-semibold text-gray-800">
          {isEn ? "Do you have an SSF account (SSN)?" : "SSF खाता (SSN) छ?"}
          <select name="hasSSFAccount" className={inputCls}>
            <option value="yes">{isEn ? "Yes" : "छ"}</option>
            <option value="no">{isEn ? "No" : "छैन"}</option>
            <option value="unknown">{isEn ? "Not sure" : "थाहा छैन"}</option>
          </select>
        </label>
        <label className="block text-sm font-semibold text-gray-800">
          {isEn ? "Is your KYC complete?" : "KYC complete छ?"}
          <select name="kycComplete" className={inputCls}>
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

      <div className="space-y-2 rounded-lg bg-primary-50 p-4 text-sm text-gray-700">
        <label className="flex items-start gap-2">
          <input type="checkbox" name="consent" required className="mt-1 h-4 w-4" />
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
        <label className="flex items-start gap-2">
          <input type="checkbox" name="marketing" className="mt-1 h-4 w-4" />
          <span>
            {isEn
              ? "I'd like to receive useful updates from Digital Solution. (optional)"
              : "म Digital Solution का उपयोगी updates प्राप्त गर्न चाहन्छु। (optional)"}
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-action-500 py-3 font-semibold text-white hover:bg-action-600 disabled:opacity-60"
      >
        {pending
          ? isEn
            ? "Sending…"
            : "पठाउँदै…"
          : isEn
            ? "Send request"
            : "अनुरोध पठाउनुहोस्"}
      </button>

      <p className="text-xs text-gray-500">
        ⚠️{" "}
        {isEn
          ? "Digital Solution never asks for your OTP, password, or banking PIN by phone or chat. Do not send documents through this form."
          : "Digital Solution ले फोन वा Chat मार्फत तपाईंको OTP, Password वा Banking PIN माग्दैन। कागजात यो फाराममा नपठाउनुहोस्।"}
      </p>
    </form>
  );
}
