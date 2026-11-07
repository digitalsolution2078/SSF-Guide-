"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Icon } from "./icons";

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
    <div className="fixed inset-x-3 bottom-20 z-40 mx-auto max-w-3xl animate-fade-up md:bottom-6">
      <div className="card flex items-center gap-3 p-3 shadow-pop sm:p-4">
        <span className="icon-tile">
          <Icon name="download" size={20} />
        </span>
        <p className="flex-1 text-sm text-ink-700">
          {isEn ? (
            <>
              Put the <strong className="text-ink-900">SSF Guide app</strong> on your mobile — offline
              shortcut, faster access.
            </>
          ) : (
            <>
              <strong className="text-ink-900">SSF Guide app</strong> आफ्नो mobile मा राख्नुहोस् — offline
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
          className="btn-primary btn-sm"
        >
          Install
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="btn-ghost btn-sm -mr-1 px-2 text-ink-400 hover:text-ink-700"
        >
          <Icon name="x" size={16} />
        </button>
      </div>
    </div>
  );
}
