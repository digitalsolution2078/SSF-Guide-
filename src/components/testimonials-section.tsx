"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Icon } from "./icons";
import { SectionHead } from "./ui";

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
    <section className="border-t border-ink-200 bg-ink-50">
      <div className="container-page py-14">
        <SectionHead
          eyebrow={isEn ? "Testimonials" : "अनुभव"}
          title={isEn ? "What people say" : "प्रयोगकर्ताका अनुभव"}
        />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => {
            const stars = Math.max(1, Math.min(5, t.rating));
            return (
              <figure key={t.id} className="card relative p-5">
                <span aria-hidden="true" className="absolute right-5 top-2 font-display text-4xl font-bold leading-none text-primary-200">
                  &rdquo;
                </span>
                <div className="flex items-center gap-0.5 text-action-500" aria-label={`${stars}/5`}>
                  {Array.from({ length: stars }).map((_, i) => (
                    <Icon key={i} name="star" size={14} className="fill-current" />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-ink-700">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-ink-900">
                  {t.name}
                  {t.role && <span className="font-normal text-ink-500"> · {t.role}</span>}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
