"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "./icons";

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
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      onClick={dismiss}
    >
      <div
        className="card w-full max-w-md animate-fade-up rounded-2xl p-6 shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="icon-tile h-12 w-12 rounded-2xl">
            <Icon name="activity" size={24} />
          </span>
          <button
            type="button"
            onClick={dismiss}
            aria-label={isEn ? "Close" : "बन्द गर्नुहोस्"}
            className="-mr-2 -mt-2 flex h-9 w-9 items-center justify-center rounded-full text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
          >
            <Icon name="x" size={18} />
          </button>
        </div>
        <h2 className="mt-4 text-xl md:text-2xl">
          {isEn ? "How much do you need SSF — want to check?" : "तपाईंलाई SSF कति चाहिन्छ — जाँच्ने हो?"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          {isEn ? (
            <>
              10 simple questions (1 minute) — based on your job, savings,
              family, and risk we give a personal result:
              <strong className="text-ink-900"> &ldquo;You need SSF X/10&rdquo;</strong>. No name or
              number required.
            </>
          ) : (
            <>
              १० सजिला प्रश्न (१ मिनेट) — तपाईंको जागिर, बचत, परिवार र जोखिम हेरेर
              <strong className="text-ink-900"> &ldquo;तपाईंलाई SSF X/10 चाहिन्छ&rdquo; </strong>
              भन्ने व्यक्तिगत नतिजा दिन्छौँ। नाम/नम्बर केही मागिँदैन।
            </>
          )}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={dismiss} className="btn-ghost">
            {isEn ? "Later" : "पछि"}
          </button>
          <Link href="/assessment" onClick={dismiss} className="btn-primary">
            {isEn ? "Start the assessment" : "Assessment सुरु गर्नुहोस्"}
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
