"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import {
  BS_MONTHS_EN,
  BS_MONTHS_NE,
  DEPOSIT_GRACE_DAYS,
  depositDeadlines,
  formatAD,
  nextDepositDeadline,
  toNeDigits,
  type DepositDeadline,
} from "@/lib/nepali-date";
import { trackEvent } from "@/lib/analytics";
import { Icon } from "@/components/icons";

/**
 * Deposit-deadline calendar for employers: Act §4 — contributions for a Nepali
 * month are due within 25 days of that month's end; §9 — 10% interest when late.
 * Computed on the client after mount so the "days left" badge is always fresh
 * and never mismatches the server render.
 */

function monthLabel(d: DepositDeadline, isEn: boolean): string {
  return isEn ? `${BS_MONTHS_EN[d.bs.month]} ${d.bs.year}` : `${BS_MONTHS_NE[d.bs.month]} ${toNeDigits(d.bs.year)}`;
}

function icsDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function icsStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcs(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildDeadlineIcs(d: DepositDeadline, isEn: boolean): string {
  const month = monthLabel(d, isEn);
  const summary = isEn ? `SSF deposit deadline — ${month}` : `SSF योगदान दाखिला म्याद — ${month}`;
  const description = isEn
    ? `Last day to deposit the ${month} SSF contribution (31% of basic) without the 10% late interest. Within ${DEPOSIT_GRACE_DAYS} days of the end of the Nepali month — Act §4; interest §9. ssf.digitalsolutionnepal.com/employer`
    : `${month} को SSF योगदान (आधारभूतको ३१%) १०% ढिलो ब्याज बिना दाखिला गर्ने अन्तिम दिन। नेपाली महिना सकिएको ${toNeDigits(DEPOSIT_GRACE_DAYS)} दिनभित्र — ऐन दफा ४; ब्याज दफा ९। ssf.digitalsolutionnepal.com/employer`;
  const start = icsDate(d.deadline);
  const end = icsDate(new Date(d.deadline.getTime() + 86_400_000));
  const uid = `ssf-deposit-${d.bs.year}-${d.bs.month + 1}@ssf.digitalsolutionnepal.com`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SSF Guide Nepal//Deposit deadline//NE",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${escapeIcs(summary)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P3D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs(isEn ? "SSF deposit due in 3 days" : "SSF दाखिला म्याद ३ दिनमा")}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function DeadlineCalendar({ count = 6 }: { count?: number }) {
  const locale = useLocale();
  const isEn = locale === "en";
  const n = (v: string | number) => (isEn ? String(v) : toNeDigits(v));
  const [list, setList] = useState<DepositDeadline[] | null>(null);
  const [next, setNext] = useState<DepositDeadline | null>(null);

  useEffect(() => {
    const now = new Date();
    setList(depositDeadlines(count, now));
    setNext(nextDepositDeadline(now));
  }, [count]);

  function addToCalendar() {
    if (!next) return;
    const blob = new Blob([buildDeadlineIcs(next, isEn)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ssf-deposit-${next.bs.year}-${String(next.bs.month + 1).padStart(2, "0")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    trackEvent("cta_click", { cta: "deadline_ics", location: "employer_hub" });
  }

  const badge = (d: DepositDeadline) => {
    if (d.status === "overdue") {
      return <span className="badge bg-red-50 text-red-700">{isEn ? `Overdue ${Math.abs(d.daysLeft)} d` : `म्याद नाघ्यो · ${n(Math.abs(d.daysLeft))} दिन`}</span>;
    }
    if (d.status === "due-soon") {
      return <span className="badge bg-amber-50 text-amber-800">{isEn ? `${d.daysLeft} days left` : `${n(d.daysLeft)} दिन बाँकी`}</span>;
    }
    return <span className="badge-neutral">{isEn ? `${d.daysLeft} days left` : `${n(d.daysLeft)} दिन बाँकी`}</span>;
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list
          ? list.map((d) => {
              const isNext = next && d.bs.year === next.bs.year && d.bs.month === next.bs.month;
              return (
                <div key={`${d.bs.year}-${d.bs.month}`} className={`card p-4 ${isNext ? "border-primary-300 ring-2 ring-primary-100" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-display text-lg font-bold text-ink-900">{monthLabel(d, isEn)}</p>
                    {badge(d)}
                  </div>
                  <dl className="mt-3 space-y-1.5 text-sm">
                    <div className="flex justify-between gap-2">
                      <dt className="text-ink-500">{isEn ? "Month ends" : "महिना सकिने"}</dt>
                      <dd className="text-ink-800">{formatAD(d.monthEnd, isEn)}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-ink-500">{isEn ? "Deposit by" : "दाखिला म्याद"}</dt>
                      <dd className="font-semibold text-ink-900">{formatAD(d.deadline, isEn)}</dd>
                    </div>
                  </dl>
                  {isNext && <p className="mt-2 text-xs font-semibold text-primary-700">{isEn ? "Next deadline" : "आगामी म्याद"}</p>}
                </div>
              );
            })
          : Array.from({ length: count }).map((_, i) => <div key={i} className="card h-32 animate-pulse bg-ink-50" />)}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-start gap-2 text-sm text-ink-600">
          <Icon name="info" size={16} className="mt-0.5 shrink-0 text-primary-600" />
          {isEn
            ? `Within ${DEPOSIT_GRACE_DAYS} days of the end of the Nepali month; 10% interest if late (Act §4 / §9). Dates are Gregorian equivalents — confirm against the Fund's notice if the deadline falls on a public holiday.`
            : `महिना सकिएको ${n(DEPOSIT_GRACE_DAYS)} दिनभित्र; ढिलो भए १०% ब्याज (ऐन दफा ४/९)। मिति ई.सं. मा देखाइएको छ — म्याद सार्वजनिक बिदामा परे कोषको सूचना हेर्नुहोस्।`}
        </p>
        <button type="button" onClick={addToCalendar} disabled={!next} className="btn-primary">
          <Icon name="bell" size={16} />
          {isEn ? "Add this deadline to my calendar" : "यो म्याद क्यालेन्डरमा राख्नुहोस्"}
        </button>
      </div>
    </div>
  );
}
