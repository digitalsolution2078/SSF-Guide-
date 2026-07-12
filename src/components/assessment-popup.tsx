"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

const KEY = "ssf_assessment_prompt_v1";

/** One-time gentle invite to the SSF Assessment — never nags again after
 *  any choice (per design rules: no aggressive popups). */
export function AssessmentPopup() {
  const locale = useLocale();
  const isEn = locale === "en";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) {
        const t = setTimeout(() => setOpen(true), 1800);
        return () => clearTimeout(t);
      }
    } catch {
      // storage unavailable — never show
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      // ignore
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      onClick={dismiss}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-3xl">📊</p>
        <h2 className="mt-2 text-xl font-bold text-primary-900">
          {isEn ? "How much do you need SSF — want to check?" : "तपाईंलाई SSF कति चाहिन्छ — जाँच्ने हो?"}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {isEn ? (
            <>
              10 simple questions (1 minute) — based on your job, savings,
              family, and risk we give a personal result:
              <strong> &ldquo;You need SSF X/10&rdquo;</strong>. No name or
              number required.
            </>
          ) : (
            <>
              १० सजिला प्रश्न (१ मिनेट) — तपाईंको जागिर, बचत, परिवार र जोखिम हेरेर
              <strong> &ldquo;तपाईंलाई SSF X/10 चाहिन्छ&rdquo; </strong>
              भन्ने व्यक्तिगत नतिजा दिन्छौँ। नाम/नम्बर केही मागिँदैन।
            </>
          )}
        </p>
        <div className="mt-5 flex gap-3">
          <Link
            href="/assessment"
            onClick={dismiss}
            className="flex-1 rounded-xl bg-action-500 py-3 text-center font-semibold text-white hover:bg-action-600"
          >
            {isEn ? "Start the assessment" : "Assessment सुरु गर्नुहोस्"}
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50"
          >
            {isEn ? "Later" : "पछि"}
          </button>
        </div>
      </div>
    </div>
  );
}
