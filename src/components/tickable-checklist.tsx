"use client";

import { useEffect, useState } from "react";
import type { ChecklistItemContent } from "@/content/types";

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

  return (
    <div className="rounded-xl border border-primary-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">
          {done}/{items.length} तयार
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-lg border border-primary-200 px-3 py-1.5 text-sm text-primary-700 hover:bg-primary-50 print:hidden"
        >
          🖨️ Print
        </button>
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <input
              id={`item-${i}`}
              type="checkbox"
              checked={Boolean(ticked[i])}
              onChange={() => toggle(i)}
              className="mt-1 h-5 w-5 rounded border-gray-300 accent-primary-600"
            />
            <label htmlFor={`item-${i}`} className="text-gray-800">
              {item.label}
              {item.conditional && (
                <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  {item.conditionNote ?? "सशर्त"}
                </span>
              )}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
