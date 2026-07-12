"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

const KEY = "ssf_install_prompt_v1";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

/** "Install the app" banner — appears only when the browser offers PWA
 *  install (Android/Chrome), dismiss-forever, never nags. */
export function InstallAppBanner() {
  const locale = useLocale();
  const isEn = locale === "en";
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY)) return;
    } catch {
      return;
    }
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!deferred) return null;

  function dismiss() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      // ignore
    }
    setDeferred(null);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-primary-200 bg-white p-3 shadow-lg">
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <span className="text-2xl">📱</span>
        <p className="flex-1 text-sm text-gray-700">
          {isEn ? (
            <>
              Put the <strong>SSF Guide app</strong> on your mobile — offline
              shortcut, faster access.
            </>
          ) : (
            <>
              <strong>SSF Guide app</strong> आफ्नो mobile मा राख्नुहोस् — offline
              shortcut, छिटो पहुँच।
            </>
          )}
        </p>
        <button
          type="button"
          onClick={async () => {
            await deferred.prompt();
            dismiss();
          }}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Install
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="px-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
