"use client";

import { useEffect, useState } from "react";
import { VAPID_PUBLIC_KEY, urlBase64ToUint8Array } from "@/lib/push-config";

export function AdminLeadAlerts() {
  const [status, setStatus] = useState<"idle" | "on" | "busy" | "unsupported" | "error">("idle");

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !VAPID_PUBLIC_KEY
    ) {
      setStatus("unsupported");
      return;
    }
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  const enable = async () => {
    setStatus("busy");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("error");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      const sub =
        existing ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
        }));
      const res = await fetch("/api/push/admin-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });
      setStatus(res.ok ? "on" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "unsupported") return null;

  return (
    <div className="mt-4 rounded-xl border border-primary-100 bg-primary-50 p-4 text-sm">
      {status === "on" ? (
        <p className="font-medium text-green-700">
          ✓ यो device मा नयाँ-lead alert सक्रिय भयो।
        </p>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-gray-700">
            📬 नयाँ lead आउँदा यो device मा तुरुन्तै notification पाउनुहोस्।
          </span>
          <button
            type="button"
            onClick={enable}
            disabled={status === "busy"}
            className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
          >
            {status === "busy" ? "…" : "सक्रिय गर्नुहोस्"}
          </button>
        </div>
      )}
      {status === "error" && (
        <p className="mt-1 text-xs text-red-600">सक्रिय गर्न सकिएन — permission अस्वीकृत भयो कि?</p>
      )}
    </div>
  );
}
