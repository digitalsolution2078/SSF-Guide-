"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { VAPID_PUBLIC_KEY, urlBase64ToUint8Array } from "@/lib/push-config";

const DISMISS_KEY = "ssf-push-dismissed";

export function PushOptIn() {
  const locale = useLocale();
  const isEn = locale === "en";
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !("Notification" in window) ||
      !VAPID_PUBLIC_KEY
    )
      return;
    if (Notification.permission === "denied") return;
    if (localStorage.getItem(DISMISS_KEY)) return;

    // Register the SW early so pushes can be received once subscribed.
    navigator.serviceWorker.register("/sw.js").catch(() => {});

    (async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
        const existing = await reg.pushManager.getSubscription();
        if (existing) return; // already subscribed
        const t = setTimeout(() => setShow(true), 8000); // gentle delay
        return () => clearTimeout(t);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const subscribe = async () => {
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setShow(false);
        localStorage.setItem(DISMISS_KEY, "1");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON(), locale }),
      });
      setShow(false);
    } catch {
      setShow(false);
    } finally {
      setBusy(false);
    }
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-md rounded-2xl border border-primary-200 bg-white p-4 shadow-xl sm:left-auto sm:right-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🔔</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-primary-900">
            {isEn ? "Get SSF updates" : "SSF अपडेट पाउनुहोस्"}
          </p>
          <p className="mt-0.5 text-xs text-gray-600">
            {isEn
              ? "New guides, rate changes, and deadlines — right on your device."
              : "नयाँ guide, दर परिवर्तन र म्याद — सीधै तपाईंको device मा।"}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={subscribe}
              disabled={busy}
              className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {busy ? "…" : isEn ? "Enable" : "सक्रिय गर्नुहोस्"}
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
            >
              {isEn ? "Not now" : "अहिले होइन"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
