"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { VAPID_PUBLIC_KEY, urlBase64ToUint8Array } from "@/lib/push-config";
import { trackEvent } from "@/lib/analytics";
import { effectiveMonths, useSsfProfile } from "@/lib/profile";
import { Icon } from "./icons";
import { Callout } from "./ui";

export type AlertTopic = "milestones" | "employer_deadline" | "news";

const TOPICS: { key: AlertTopic; ne: string; en: string; hintNe: string; hintEn: string }[] = [
  {
    key: "milestones",
    ne: "मेरो milestone अलर्ट",
    en: "My milestone alerts",
    hintNe: "१८ महिना (घर सापटी), ३६ महिना (विशेष सापटी), १८० महिना (पेन्सन) पुग्दा सूचना",
    hintEn: "Notify me at 18 months (home loan), 36 (special loan), 180 (pension)",
  },
  {
    key: "employer_deadline",
    ne: "रोजगारदाता दाखिला म्याद",
    en: "Employer deposit deadline",
    hintNe: "हरेक महिनाको SSF दाखिला म्याद सकिनु ७, ३ र १ दिनअघि",
    hintEn: "7, 3 and 1 day before each month's SSF deposit deadline",
  },
  {
    key: "news",
    ne: "SSF समाचार र दर परिवर्तन",
    en: "SSF news & rate changes",
    hintNe: "ब्याजदर, नयाँ सुविधा, नयाँ अस्पताल",
    hintEn: "Interest rates, new benefits, new hospitals",
  },
];

const SAVED_KEY = "ssf-alert-topics";

/**
 * Topic-based push alerts. Subscribes the browser (Web Push) and stores the
 * chosen topics + a minimal profile snapshot (months contributed, age) on the
 * server so /api/push/cron can send personalised milestone reminders.
 */
export function AlertsOptIn({ defaultTopics = ["milestones"], compact = false }: { defaultTopics?: AlertTopic[]; compact?: boolean }) {
  const locale = useLocale();
  const isEn = locale === "en";
  const { profile } = useSsfProfile();
  const [supported, setSupported] = useState(true);
  const [topics, setTopics] = useState<AlertTopic[]>(defaultTopics);
  const [saved, setSaved] = useState<AlertTopic[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ok =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window &&
      Boolean(VAPID_PUBLIC_KEY) &&
      Notification.permission !== "denied";
    setSupported(ok);
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      if (raw) {
        const t = JSON.parse(raw) as AlertTopic[];
        setSaved(t);
        setTopics(t);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = (k: AlertTopic) =>
    setTopics((t) => (t.includes(k) ? t.filter((x) => x !== k) : [...t, k]));

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setError(isEn ? "Notifications were blocked in the browser." : "Browser मा notification अनुमति दिइएन।");
        return;
      }
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const sub =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
        }));
      const months = effectiveMonths(profile);
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: sub.toJSON(),
          locale,
          topics,
          profile: months !== undefined ? { monthsContributed: months, age: profile.age, savedAt: new Date().toISOString() } : undefined,
        }),
      });
      if (!res.ok) throw new Error("save failed");
      localStorage.setItem(SAVED_KEY, JSON.stringify(topics));
      localStorage.setItem("ssf-push-dismissed", "1"); // silence the generic opt-in banner
      setSaved(topics);
      trackEvent("push_optin", { topics: topics.join(",") });
    } catch {
      setError(isEn ? "Could not save — please try again." : "सेभ हुन सकेन — फेरि प्रयास गर्नुहोस्।");
    } finally {
      setBusy(false);
    }
  };

  if (!supported) {
    return (
      <Callout tone="info">
        {isEn
          ? "Browser alerts aren't available here (iPhone: add this site to your Home Screen first). You can still follow updates via WhatsApp."
          : "यो browser मा alert उपलब्ध छैन (iPhone: पहिले साइटलाई Home Screen मा थप्नुहोस्)। WhatsApp बाट पनि update पाउन सकिन्छ।"}
      </Callout>
    );
  }

  return (
    <div className={compact ? "" : "card p-5"}>
      <div className="flex items-center gap-2">
        <Icon name="bell" size={18} className="text-primary-600" />
        <p className="font-semibold text-ink-900">{isEn ? "Free alerts (browser)" : "निःशुल्क अलर्ट (browser)"}</p>
        {saved && (
          <span className="badge-health">
            <Icon name="check" size={12} />
            {isEn ? "On" : "चालु"}
          </span>
        )}
      </div>
      <ul className="mt-3 space-y-2">
        {TOPICS.map((t) => (
          <li key={t.key}>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink-200 bg-white p-3 hover:border-primary-300">
              <input
                type="checkbox"
                checked={topics.includes(t.key)}
                onChange={() => toggle(t.key)}
                className="mt-1 h-4 w-4 rounded border-ink-300 accent-primary-600"
              />
              <span>
                <span className="block text-sm font-semibold text-ink-900">{isEn ? t.en : t.ne}</span>
                <span className="block text-xs text-ink-500">{isEn ? t.hintEn : t.hintNe}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
      {topics.includes("milestones") && effectiveMonths(profile) === undefined && (
        <p className="mt-2 text-xs text-amber-700">
          {isEn ? "Milestone alerts need your months contributed — save it in My SSF first." : "Milestone अलर्टका लागि योगदान महिना चाहिन्छ — पहिले My SSF मा सेभ गर्नुहोस्।"}
        </p>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <button type="button" onClick={save} disabled={busy || topics.length === 0} className="btn-primary mt-4">
        <Icon name="bell" size={16} />
        {busy ? (isEn ? "Saving…" : "सेभ हुँदै…") : saved ? (isEn ? "Update alerts" : "अलर्ट अपडेट") : isEn ? "Turn on alerts" : "अलर्ट चालु गर्नुहोस्"}
      </button>
      <p className="mt-2 text-xs text-ink-400">
        {isEn
          ? "No phone number or email needed. Turn off any time from your browser's site settings."
          : "फोन नम्बर वा इमेल चाहिँदैन। Browser को site settings बाट जहिले पनि बन्द गर्न सकिन्छ।"}
      </p>
    </div>
  );
}
