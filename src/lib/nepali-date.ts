import NepaliDate from "nepali-date-converter";

/**
 * Bikram Sambat helpers built on nepali-date-converter (covers 2000–2090 BS).
 * Used for the SSF deposit-deadline calendar (Act §4: within 25 days of the
 * end of each Nepali month) and for showing BS dates in the UI.
 *
 * Month index is 0-based (0 = Baishakh … 11 = Chaitra), like the library.
 */

export const BS_MONTHS_NE = ["वैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कात्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"];
export const BS_MONTHS_EN = ["Baishakh", "Jestha", "Asar", "Shrawan", "Bhadra", "Asoj", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"];

const NE_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
export const toNeDigits = (s: string | number) => String(s).replace(/[0-9]/g, (d) => NE_DIGITS[Number(d)]);

export interface BsDate {
  year: number;
  /** 0-based */
  month: number;
  day: number;
}

export function toBS(date: Date = new Date()): BsDate {
  const n = new NepaliDate(date);
  return { year: n.getYear(), month: n.getMonth(), day: n.getDate() };
}

export function fromBS(year: number, month: number, day: number): Date {
  return new NepaliDate(year, month, day).toJsDate();
}

export function formatBS(d: BsDate, isEn: boolean): string {
  return isEn
    ? `${BS_MONTHS_EN[d.month]} ${d.day}, ${d.year}`
    : `${d.year ? toNeDigits(d.year) : ""} ${BS_MONTHS_NE[d.month]} ${toNeDigits(d.day)}`.trim();
}

export function formatAD(date: Date, isEn: boolean): string {
  return date.toLocaleDateString(isEn ? "en-GB" : "ne-NP", { year: "numeric", month: "short", day: "numeric" });
}

/** Last Gregorian day of a BS month (year, 0-based month). */
export function bsMonthEnd(year: number, month: number): Date {
  const nextY = month === 11 ? year + 1 : year;
  const nextM = month === 11 ? 0 : month + 1;
  const firstOfNext = fromBS(nextY, nextM, 1);
  return new Date(firstOfNext.getTime() - 86_400_000);
}

export const DEPOSIT_GRACE_DAYS = 25;

export interface DepositDeadline {
  bs: BsDate;
  /** contribution month label */
  monthEnd: Date;
  /** last day to deposit without the 10% late interest */
  deadline: Date;
  daysLeft: number;
  status: "open" | "due-soon" | "overdue";
}

/**
 * Deposit deadlines for the previous, current and next `count-2` BS months.
 * "due-soon" = within 7 days; "overdue" = past (only shown for the previous month).
 */
export function depositDeadlines(count = 6, now = new Date()): DepositDeadline[] {
  const today = toBS(now);
  const out: DepositDeadline[] = [];
  let y = today.year;
  let m = today.month - 1; // start with the previous month (its deadline may still be open)
  if (m < 0) {
    m = 11;
    y -= 1;
  }
  for (let i = 0; i < count; i++) {
    const monthEnd = bsMonthEnd(y, m);
    const deadline = new Date(monthEnd.getTime() + DEPOSIT_GRACE_DAYS * 86_400_000);
    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / 86_400_000);
    out.push({
      bs: { year: y, month: m, day: 1 },
      monthEnd,
      deadline,
      daysLeft,
      status: daysLeft < 0 ? "overdue" : daysLeft <= 7 ? "due-soon" : "open",
    });
    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
  }
  return out;
}

/** The next deadline that is still open (for reminders). */
export function nextDepositDeadline(now = new Date()): DepositDeadline {
  const list = depositDeadlines(3, now);
  return list.find((d) => d.daysLeft >= 0) ?? list[list.length - 1];
}
