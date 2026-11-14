"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { submitHospitalReportAction, type HospitalReportState } from "@/app/actions/hospital-report";
import { trackEvent } from "@/lib/analytics";
import { toNe } from "@/content/ssf-stats";
import { Callout } from "./ui";
import { Icon } from "./icons";

const initialState: HospitalReportState = { status: "idle" };

const WAIT_BUCKETS = [
  { value: "", ne: "थाहा छैन / सम्झना छैन", en: "Not sure" },
  { value: "15", ne: "१५ मिनेटभित्र", en: "Under 15 minutes" },
  { value: "30", ne: "१५–३० मिनेट", en: "15–30 minutes" },
  { value: "60", ne: "३०–६० मिनेट", en: "30–60 minutes" },
  { value: "120", ne: "१–२ घण्टा", en: "1–2 hours" },
  { value: "240", ne: "२–४ घण्टा", en: "2–4 hours" },
  { value: "480", ne: "४ घण्टाभन्दा बढी", en: "More than 4 hours" },
];

const CASHLESS = [
  { value: "yes", ne: "हो — २०% मात्र तिरेँ", en: "Yes — paid only 20%" },
  { value: "no", ne: "होइन — पूरै तिर्नुपर्‍यो", en: "No — had to pay in full" },
  { value: "unknown", ne: "थाहा छैन", en: "Not sure" },
];

const RATING_LABELS_NE = ["", "धेरै खराब", "खराब", "ठीकै", "राम्रो", "उत्कृष्ट"];
const RATING_LABELS_EN = ["", "Very poor", "Poor", "Okay", "Good", "Excellent"];

export function HospitalReportForm({ hospitalId }: { hospitalId: number }) {
  const locale = useLocale();
  const isEn = locale === "en";
  const [state, formAction, pending] = useActionState(submitHospitalReportAction, initialState);
  const [cashless, setCashless] = useState("unknown");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const tracked = useRef(false);

  useEffect(() => {
    if (state.status === "ok" && !tracked.current) {
      tracked.current = true;
      trackEvent("hospital_report", { hospitalId });
    }
  }, [state.status, hospitalId]);

  if (state.status === "ok") {
    return (
      <Callout tone="success" title={isEn ? "Thank you" : "धन्यवाद"}>
        {state.message ??
          (isEn ? "Your report will appear after moderation." : "moderation पछि तपाईंको report यहाँ देखिन्छ।")}
      </Callout>
    );
  }

  const shown = hover || rating;
  const n = (s: string) => (isEn ? s : toNe(s));

  return (
    <form action={formAction} className="card space-y-5 p-5 md:p-6">
      <input type="hidden" name="hospitalId" value={hospitalId} />
      <input type="hidden" name="locale" value={locale} />

      {state.status === "error" && (
        <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
          <span>{state.message}</span>
        </p>
      )}

      {/* Rating */}
      <fieldset>
        <legend className="text-sm font-medium text-ink-700">
          {isEn ? "Overall experience *" : "समग्र अनुभव *"}
        </legend>
        <div className="mt-2 flex items-center gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              type="button"
              aria-label={isEn ? `${v} star` : `${toNe(String(v))} तारा`}
              aria-pressed={rating === v}
              onMouseEnter={() => setHover(v)}
              onFocus={() => setHover(v)}
              onBlur={() => setHover(0)}
              onClick={() => setRating(v)}
              className="rounded-md p-1 transition hover:scale-110"
            >
              <Icon
                name="star"
                size={28}
                className={v <= shown ? "text-amber-400" : "text-ink-300"}
                fill={v <= shown ? "currentColor" : "none"}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-ink-500">
            {shown ? (isEn ? RATING_LABELS_EN[shown] : RATING_LABELS_NE[shown]) : isEn ? "Tap a star" : "तारा छान्नुहोस्"}
          </span>
        </div>
        <input type="hidden" name="rating" value={rating || ""} />
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Wait time */}
        <label className="block text-sm font-medium text-ink-700">
          {isEn ? "How long did you wait at the SSF desk?" : "SSF डेस्कमा कति समय पर्खनुपर्‍यो?"}
          <select name="waitMinutes" defaultValue="" className="select mt-1.5">
            {WAIT_BUCKETS.map((b) => (
              <option key={b.value} value={b.value}>
                {isEn ? b.en : b.ne}
              </option>
            ))}
          </select>
        </label>

        {/* Cashless */}
        <fieldset>
          <legend className="text-sm font-medium text-ink-700">
            {isEn ? "Was treatment cashless?" : "उपचार क्यासलेस भयो?"}
          </legend>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {CASHLESS.map((c) => (
              <label key={c.value} className={`chip cursor-pointer ${cashless === c.value ? "chip-active" : ""}`}>
                <input
                  type="radio"
                  name="cashless"
                  value={c.value}
                  checked={cashless === c.value}
                  onChange={() => setCashless(c.value)}
                  className="sr-only"
                />
                {isEn ? c.en : c.ne}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Comment */}
      <label className="block text-sm font-medium text-ink-700">
        {isEn ? "Anything others should know? (optional)" : "अरूले जान्नुपर्ने केही छ? (optional)"}
        <textarea
          name="comment"
          rows={3}
          maxLength={400}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="input mt-1.5"
          placeholder={
            isEn
              ? "E.g. SSF desk is on the ground floor, bring a photocopy of your SSN card…"
              : "जस्तै: SSF डेस्क भुइँतलामा छ, SSN कार्डको photocopy लैजानुहोस्…"
          }
        />
        <span className="mt-1 block text-right text-xs text-ink-400">
          {n(String(comment.length))}/{n("400")}
        </span>
      </label>

      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-ink-500">
          {isEn
            ? "Anonymous — no name or phone is collected. Reports are moderated before publishing."
            : "गुमनाम — नाम वा फोन लिइँदैन। प्रकाशनअघि report moderate गरिन्छ।"}
        </p>
        <button type="submit" disabled={pending || rating === 0} className="btn-primary">
          {pending ? (isEn ? "Sending…" : "पठाउँदै…") : isEn ? "Share experience" : "अनुभव पठाउनुहोस्"}
          {!pending && <Icon name="send" size={16} />}
        </button>
      </div>
    </form>
  );
}
