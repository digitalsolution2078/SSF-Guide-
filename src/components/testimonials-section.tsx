"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

interface Item {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  rating: number;
}

export function TestimonialsSection() {
  const locale = useLocale();
  const isEn = locale === "en";
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d.items) ? d.items : []))
      .catch(() => setItems([]));
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <section className="bg-primary-50/50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center text-2xl font-bold text-primary-900">
          💬 {isEn ? "What people say" : "प्रयोगकर्ताका अनुभव"}
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <figure key={t.id} className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
              <div className="text-sm text-action-500">{"★".repeat(Math.max(1, Math.min(5, t.rating)))}</div>
              <blockquote className="mt-2 text-sm leading-relaxed text-gray-700">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-3 text-sm font-semibold text-primary-900">
                {t.name}
                {t.role && <span className="font-normal text-gray-500"> · {t.role}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
