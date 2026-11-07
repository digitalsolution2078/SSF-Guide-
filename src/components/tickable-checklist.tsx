"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import type { ChecklistItemContent } from "@/content/types";
import { Icon } from "./icons";

/**
 * Client-side tickable checklist — state lives in localStorage only,
 * no account needed (product spec §10.2). Print button included.
 */
export function TickableChecklist({
  slug,
  items,
}: {
  slug: string;
  items: ChecklistItemContent[];
}) {
  const locale = useLocale();
  const isEn = locale === "en";
  const storageKey = `checklist:${slug}`;
  const [ticked, setTicked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setTicked(JSON.parse(saved));
    } catch {
      // localStorage unavailable — ticks just won't persist
    }
  }, [storageKey]);

  function toggle(i: number) {
    const next = { ...ticked, [i]: !ticked[i] };
    setTicked(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  const done = items.filter((_, i) => ticked[i]).length;
  const pct = items.length ? (done / items.length) * 100 : 0;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink-900">
            {done}/{items.length} {isEn ? "ready" : "तयार"}
          </p>
          <div className="mt-2 h-1.5 w-full max-w-xs rounded-full bg-ink-100">
            <div className="h-1.5 rounded-full bg-primary-600 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="btn-outline btn-sm shrink-0 print:hidden"
        >
          <Icon name="file" size={14} />
          Print
        </button>
      </div>
      <ul className="mt-4 divide-y divide-ink-100">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <input
              id={`item-${i}`}
              type="checkbox"
              checked={Boolean(ticked[i])}
              onChange={() => toggle(i)}
              className="mt-0.5 h-5 w-5 shrink-0 rounded border-ink-300 text-primary-600 accent-primary-600"
            />
            <label htmlFor={`item-${i}`} className={`cursor-pointer text-sm leading-relaxed ${ticked[i] ? "text-ink-400 line-through" : "text-ink-800"}`}>
              {item.label}
              {item.conditional && (
                <span className="mt-0.5 block text-xs text-ink-500">
                  {item.conditionNote ?? (isEn ? "conditional" : "सशर्त")}
                </span>
              )}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
