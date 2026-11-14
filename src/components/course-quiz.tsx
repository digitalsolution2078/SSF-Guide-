"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { courseBySlug, QUIZ_PASS_PCT } from "@/content/courses";
import { toNe } from "@/content/ssf-stats";
import { trackEvent } from "@/lib/analytics";
import { waContext } from "@/lib/whatsapp";
import { formatBS, toBS } from "@/lib/nepali-date";
import { VAPID_PUBLIC_KEY, urlBase64ToUint8Array } from "@/lib/push-config";
import { useCourseProgress } from "@/lib/course-progress";
import { Icon } from "./icons";
import { Callout } from "./ui";

/**
 * One-question-at-a-time quiz with immediate feedback; ≥70% unlocks a
 * printable educational certificate (name input, BS date), then the capture
 * block: push opt-in hint, WhatsApp CTA and /request link.
 */
export function CourseQuiz({ courseSlug }: { courseSlug: string }) {
  const locale = useLocale();
  const isEn = locale === "en";
  const n = (s: string | number) => (isEn ? String(s) : toNe(String(s)));
  const course = courseBySlug(courseSlug);
  const { all, recordQuiz } = useCourseProgress();

  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [name, setName] = useState("");
  const [bsDate, setBsDate] = useState("");

  useEffect(() => {
    try {
      setBsDate(formatBS(toBS(new Date()), isEn));
    } catch {
      setBsDate("");
    }
  }, [isEn]);

  if (!course) return null;
  const total = course.quiz.length;
  const q = course.quiz[i];
  const scorePct = Math.round((correct / total) * 100);
  const passed = scorePct >= QUIZ_PASS_PCT;
  const p = all[course.slug];

  function answer(idx: number) {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === q.answer) setCorrect((c) => c + 1);
  }

  function nextQ() {
    if (i + 1 < total) {
      setI(i + 1);
      setPicked(null);
      return;
    }
    const finalCorrect = correct; // state already includes this question
    const pct = Math.round((finalCorrect / total) * 100);
    const ok = pct >= QUIZ_PASS_PCT;
    recordQuiz(course!.slug, pct, ok);
    trackEvent("course_complete", { course: course!.slug, score: pct, passed: ok });
    setFinished(true);
  }

  function restart() {
    setI(0);
    setPicked(null);
    setCorrect(0);
    setFinished(false);
  }

  /* ─────────── quiz in progress ─────────── */
  if (!finished) {
    return (
      <div className="card p-5 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5" aria-hidden>
            {course.quiz.map((_, k) => (
              <span key={k} className={`h-2 rounded-full transition-all ${k < i ? "w-5 bg-primary-600" : k === i ? "w-5 bg-primary-300" : "w-2 bg-ink-200"}`} />
            ))}
          </div>
          <span className="badge-neutral">
            {n(i + 1)}/{n(total)}
          </span>
        </div>
        <p className="mt-5 font-display text-xl font-semibold leading-snug text-ink-900">{isEn ? q.qEn : q.q}</p>
        <div className="mt-4 grid grid-cols-1 gap-2">
          {(isEn ? q.optionsEn : q.options).map((opt, idx) => {
            const isAnswer = idx === q.answer;
            const isPicked = picked === idx;
            let cls = "card card-hover p-3.5 text-left text-sm text-ink-800";
            if (picked !== null) {
              if (isAnswer) cls = "card border-emerald-500 bg-emerald-50 p-3.5 text-left text-sm font-semibold text-emerald-900";
              else if (isPicked) cls = "card border-red-300 bg-red-50 p-3.5 text-left text-sm text-red-900";
              else cls = "card p-3.5 text-left text-sm text-ink-400";
            }
            return (
              <button key={idx} type="button" disabled={picked !== null} onClick={() => answer(idx)} className={`${cls} flex items-center gap-3 disabled:cursor-default`}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ink-100 font-display text-xs font-bold text-ink-700">{String.fromCharCode(65 + idx)}</span>
                <span className="flex-1">{opt}</span>
                {picked !== null && isAnswer && <Icon name="checkCircle" size={18} className="text-emerald-600" />}
                {picked !== null && isPicked && !isAnswer && <Icon name="x" size={18} className="text-red-500" />}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className="mt-4">
            <Callout tone={picked === q.answer ? "success" : "warn"} title={picked === q.answer ? (isEn ? "Correct!" : "सही!") : isEn ? "Not quite" : "मिलेन"}>
              {isEn ? q.explainEn : q.explainNe}
            </Callout>
            <button type="button" onClick={nextQ} className="btn-primary mt-4 w-full">
              {i + 1 < total ? (isEn ? "Next question" : "अर्को प्रश्न") : isEn ? "See my score" : "मेरो नतिजा"}
              <Icon name="arrowRight" size={16} />
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ─────────── result ─────────── */
  const courseTitle = isEn ? course.titleEn : course.titleNe;
  const waHref = waContext("SSF School certificate", [isEn ? `Course: ${course.titleEn}` : `कोर्स: ${course.titleNe}`, isEn ? `Score: ${scorePct}%` : `नतिजा: ${toNe(String(scorePct))}%`], isEn);

  return (
    <div className="space-y-5">
      <div className="card p-5 md:p-6 print:hidden">
        <Callout tone={passed ? "success" : "warn"} title={passed ? (isEn ? "Passed!" : "पास!") : isEn ? "Not passed yet" : "अझै पास भएन"}>
          <span className="font-display text-lg font-semibold">
            {isEn ? `${correct} of ${total} correct — ${scorePct}%` : `${n(total)} मध्ये ${n(correct)} सही — ${n(scorePct)}%`}
          </span>
          <p className="mt-1">
            {passed
              ? isEn
                ? "You've earned your educational certificate — enter your name below and print it."
                : "तपाईंले शैक्षिक प्रमाणपत्र कमाउनुभयो — तल नाम लेखेर print गर्नुहोस्।"
              : isEn
                ? `Pass mark is ${QUIZ_PASS_PCT}%. Review the lessons and try again — there is no limit on attempts.`
                : `पास अङ्क ${n(QUIZ_PASS_PCT)}% हो। पाठ फेरि हेरेर पुनः प्रयास गर्नुहोस् — प्रयासको सीमा छैन।`}
          </p>
        </Callout>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={restart} className="btn-outline">
            <Icon name="refresh" size={16} />
            {isEn ? "Retake quiz" : "फेरि quiz"}
          </button>
          <Link href={`/school/courses/${course.slug}`} className="btn-ghost">
            <Icon name="list" size={16} />
            {isEn ? "Back to lessons" : "पाठहरूमा फर्कनुहोस्"}
          </Link>
        </div>
      </div>

      {passed && (
        <>
          {/* certificate */}
          <div className="card p-5 md:p-6 print:border-0 print:p-0">
            <div className="flex flex-wrap items-end justify-between gap-3 print:hidden">
              <label className="block min-w-0 flex-1">
                <span className="text-sm font-semibold text-ink-900">{isEn ? "Your name (as it should appear)" : "तपाईंको नाम (प्रमाणपत्रमा देखिने)"}</span>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder={isEn ? "e.g. Sita Sharma" : "जस्तै: सीता शर्मा"} className="input mt-1.5" maxLength={60} />
              </label>
              <button type="button" onClick={() => window.print()} disabled={!name.trim()} className="btn-primary">
                <Icon name="file" size={16} />
                {isEn ? "Print certificate" : "प्रमाणपत्र print"}
              </button>
            </div>

            <div className="mt-5 rounded-3xl border-4 border-double border-primary-300 bg-gradient-to-b from-primary-50 to-white p-6 text-center md:p-10 print:mt-0 print:break-inside-avoid">
              <p className="eyebrow justify-center">SSF School · SSF Guide Nepal</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-primary-800 md:text-4xl">{isEn ? "Certificate of Completion" : "पूर्णता प्रमाणपत्र"}</h2>
              <p className="mt-6 text-sm text-ink-500">{isEn ? "This certifies that" : "यो प्रमाणित गरिन्छ कि"}</p>
              <p className="mt-2 font-display text-2xl font-semibold text-ink-900 md:text-3xl">{name.trim() || (isEn ? "________________" : "________________")}</p>
              <p className="mt-4 text-sm text-ink-500">{isEn ? "has completed the course" : "ले यो कोर्स पूरा गर्नुभयो"}</p>
              <p className="mt-2 font-display text-xl font-semibold text-primary-700 md:text-2xl">{courseTitle}</p>
              <p className="mt-4 text-sm text-ink-700">
                {isEn ? `Quiz score ${scorePct}% · ${course.lessons.length} lessons` : `Quiz नतिजा ${n(scorePct)}% · ${n(course.lessons.length)} पाठ`}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-primary-200 pt-5 text-left text-xs text-ink-500">
                <div>
                  <p className="font-semibold text-ink-800">{isEn ? "Date (B.S.)" : "मिति (वि.सं.)"}</p>
                  <p>{bsDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-ink-800">SSF Guide Nepal · Digital Solution</p>
                  <p>ssf.digitalsolutionnepal.com</p>
                </div>
              </div>
              <p className="mt-5 text-[11px] leading-relaxed text-ink-400">
                {isEn ? "Educational certificate — not an official SSF certificate." : "शैक्षिक प्रमाणपत्र — आधिकारिक SSF प्रमाणपत्र होइन।"}
              </p>
            </div>
          </div>

          {/* capture */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 print:hidden">
            <PushHint isEn={isEn} />
            <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("cta_click", { cta: "whatsapp", location: "course_certificate" })} className="card card-hover group flex flex-col p-5">
              <span className="icon-tile bg-action-50 text-action-600">
                <Icon name="chat" size={20} />
              </span>
              <p className="mt-3 font-semibold text-ink-900 group-hover:text-primary-700">{isEn ? "Share on WhatsApp" : "WhatsApp मा साझा"}</p>
              <p className="mt-1 text-sm text-ink-500">{isEn ? "Send your result to Digital Solution and ask a follow-up question." : "आफ्नो नतिजा Digital Solution लाई पठाउनुहोस् र प्रश्न सोध्नुहोस्।"}</p>
            </a>
            <Link href="/request" onClick={() => trackEvent("cta_click", { cta: "request", location: "course_certificate" })} className="card card-hover group flex flex-col p-5">
              <span className="icon-tile">
                <Icon name="send" size={20} />
              </span>
              <p className="mt-3 font-semibold text-ink-900 group-hover:text-primary-700">{isEn ? "Need help applying it?" : "व्यवहारमा सहयोग चाहियो?"}</p>
              <p className="mt-1 text-sm text-ink-500">{isEn ? "Registration, KYC, claims — request assistance from Digital Solution." : "सूचीकरण, KYC, दाबी — Digital Solution बाट सहायता अनुरोध गर्नुहोस्।"}</p>
            </Link>
          </div>
        </>
      )}

      {!passed && p?.completedAt && (
        <p className="text-xs text-ink-500 print:hidden">{isEn ? `Your best score so far: ${p.quizScore}% — your earlier certificate still stands.` : `तपाईंको अहिलेसम्मको उत्कृष्ट नतिजा: ${n(p.quizScore ?? 0)}% — पहिलेको प्रमाणपत्र कायम रहन्छ।`}</p>
      )}
    </div>
  );
}

/** Inline push opt-in hint — same subscribe flow as PushOptIn, without the floating card. */
function PushHint({ isEn }: { isEn: boolean }) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "unsupported">("idle");

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window) || !VAPID_PUBLIC_KEY) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "granted") setState("done");
  }, []);

  async function subscribe() {
    setState("busy");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState("idle");
        return;
      }
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource });
      await fetch("/api/push/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subscription: sub.toJSON(), locale: isEn ? "en" : "ne" }) });
      trackEvent("push_optin", { topics: "courses" });
      setState("done");
    } catch {
      setState("idle");
    }
  }

  if (state === "unsupported") return null;
  return (
    <div className="card flex flex-col p-5">
      <span className="icon-tile">
        <Icon name="bell" size={20} />
      </span>
      <p className="mt-3 font-semibold text-ink-900">{isEn ? "Get new courses & rate changes" : "नयाँ कोर्स र दर परिवर्तन पाउनुहोस्"}</p>
      <p className="mt-1 text-sm text-ink-500">{isEn ? "A push notification when SSF rules or this school change." : "SSF नियम वा यो school बदलिँदा push notification।"}</p>
      <button type="button" onClick={subscribe} disabled={state !== "idle"} className="btn-outline btn-sm mt-3 self-start">
        {state === "done" ? (isEn ? "Enabled" : "सक्रिय") : state === "busy" ? "…" : isEn ? "Enable notifications" : "Notification सक्रिय"}
      </button>
    </div>
  );
}
