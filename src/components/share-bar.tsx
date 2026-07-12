"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

function Icon({ path, viewBox = "0 0 24 24" }: { path: string; viewBox?: string }) {
  return (
    <svg
      viewBox={viewBox}
      className="h-4 w-4 fill-current"
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} />
    </svg>
  );
}

const FB =
  "M22 12a10 10 0 1 0-11.6 9.9v-7H8v-2.9h2.4V9.8c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5v1.8H16l-.4 2.9h-2.2v7A10 10 0 0 0 22 12z";
const WA =
  "M.06 24l1.7-6.2A11.9 11.9 0 1 1 12 24a11.9 11.9 0 0 1-5.7-1.5L.06 24zM6.6 20l.4.2a9.9 9.9 0 0 0 5 1.4 9.9 9.9 0 1 0-9.9-9.9c0 1.9.5 3.6 1.5 5.1l.2.4-1 3.7 3.8-.9zM17.5 14c-.1-.2-.5-.3-1-.6s-1.4-.7-1.6-.8-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.4.1-.6l.4-.4.3-.5v-.4l-.8-1.8c-.2-.5-.4-.4-.5-.5H7.3a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.2 5.3 5.3 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4 15 15 0 0 0 1.5.6c.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.1s.2-1 .1-1.1z";
const X_ =
  "M18.9 2H22l-7 8 8.3 12h-6.5l-5-7.4L6 22H2.9l7.5-8.6L2 2h6.6l4.6 6.8L18.9 2zm-1.1 18h1.7L7.3 3.8H5.5L17.8 20z";

export function ShareBar() {
  const locale = useLocale();
  const isEn = locale === "en";
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== "undefined" && typeof navigator.share === "function",
    );
  }, []);

  const currentUrl = () =>
    typeof window !== "undefined" ? window.location.href : "";
  const currentTitle = () =>
    typeof document !== "undefined" ? document.title : "SSF Guide Nepal";

  const openShare = (build: (u: string, t: string) => string) => {
    const url = encodeURIComponent(currentUrl());
    const title = encodeURIComponent(currentTitle());
    window.open(build(url, title), "_blank", "noopener,noreferrer,width=640,height=560");
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: currentTitle(), url: currentUrl() });
    } catch {
      /* user cancelled */
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const btn =
    "inline-flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm transition hover:scale-105";

  return (
    <div className="border-t border-gray-100 bg-white">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-3 px-4 py-6">
        <span className="text-sm font-semibold text-gray-600">
          {isEn ? "Share this page:" : "यो पेज share गर्नुहोस्:"}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openShare((u) => `https://wa.me/?text=${u}`)}
            aria-label="Share on WhatsApp"
            title="WhatsApp"
            className={`${btn} bg-[#25D366]`}
          >
            <Icon path={WA} />
          </button>
          <button
            type="button"
            onClick={() =>
              openShare((u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`)
            }
            aria-label="Share on Facebook"
            title="Facebook"
            className={`${btn} bg-[#1877F2]`}
          >
            <Icon path={FB} />
          </button>
          <button
            type="button"
            onClick={() =>
              openShare((u, t) => `https://twitter.com/intent/tweet?url=${u}&text=${t}`)
            }
            aria-label="Share on X"
            title="X (Twitter)"
            className={`${btn} bg-black`}
          >
            <Icon path={X_} />
          </button>
          {canNativeShare && (
            <button
              type="button"
              onClick={nativeShare}
              aria-label={isEn ? "More share options" : "थप share विकल्प"}
              title={isEn ? "More" : "थप"}
              className={`${btn} bg-primary-600`}
            >
              <Icon path="M18 16.1a3 3 0 0 0-2 .8l-7-4a3 3 0 0 0 0-1.7l7-4a3 3 0 1 0-1-2.2l-7 4a3 3 0 1 0 0 5.5l7 4a3 3 0 1 0 3-2.4z" />
            </button>
          )}
          <button
            type="button"
            onClick={copyLink}
            aria-label={isEn ? "Copy link" : "Link copy गर्नुहोस्"}
            title={isEn ? "Copy link" : "Link copy"}
            className={`${btn} ${copied ? "bg-green-600" : "bg-gray-500"}`}
          >
            {copied ? (
              <Icon path="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
            ) : (
              <Icon path="M3.9 12a3.1 3.1 0 0 1 3.1-3.1h4V7h-4a5 5 0 0 0 0 10h4v-1.9h-4A3.1 3.1 0 0 1 3.9 12zM8 13h8v-2H8v2zm5-6v1.9h4a3.1 3.1 0 1 1 0 6.2h-4V17h4a5 5 0 0 0 0-10h-4z" />
            )}
          </button>
        </div>
        {copied && (
          <span className="text-xs font-medium text-green-600">
            {isEn ? "Link copied!" : "Link copy भयो!"}
          </span>
        )}
      </div>
    </div>
  );
}
