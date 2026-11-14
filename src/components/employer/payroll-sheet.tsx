"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useLocale } from "next-intl";
import { calculateFormalContribution } from "@/lib/calculation/engine";
import { FORMAL_RULE_V1, MIN_BASIC_REMUNERATION } from "@/lib/calculation/rules";
import { CalculationInputError, type ContributionResult } from "@/lib/calculation/types";
import { trackEvent } from "@/lib/analytics";
import { waContext } from "@/lib/whatsapp";
import { toNeDigits } from "@/lib/nepali-date";
import { Icon } from "@/components/icons";

/**
 * Employer payroll sheet — paste or upload "name, basic salary" lines, get the
 * 11% / 20% / 31% split per employee plus column totals. Everything runs in the
 * browser; nothing is uploaded. Amounts come from the shared formal-sector
 * contribution function so the rounding matches the site's calculators.
 */

interface PayrollRow {
  id: number;
  name: string;
  basic: number;
  result: ContributionResult | null;
  /** set when the basic is below the legal minimum (no amounts computed) */
  belowMin: boolean;
}

const NE_TO_ASCII: Record<string, string> = { "०": "0", "१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9" };
const asciiDigits = (s: string) => s.replace(/[०-९]/g, (d) => NE_TO_ASCII[d] ?? d);
const isNumericToken = (t: string) => /^(रु\.?|rs\.?|npr)?\s*[\d,]+(\.\d+)?$/i.test(t.trim());
const toNumber = (t: string) => Number(t.replace(/[^\d.]/g, ""));

/** Parse one text line into { name, basic }. Returns null for blank/header rows. */
export function parsePayrollLine(line: string, fallbackName: string): { name: string; basic: number } | null {
  const clean = asciiDigits(line).trim();
  if (!clean) return null;
  const tokens = clean.split(/\t|;|,(?!\d{2,3}\b)|\s{2,}/).map((t) => t.trim()).filter(Boolean);
  if (tokens.length === 0) return null;
  const numeric = tokens.filter(isNumericToken);
  if (numeric.length === 0) return null; // header or junk
  const nameParts = tokens.filter((t) => !isNumericToken(t));
  // A lone number is a salary; otherwise the LAST numeric token is the basic salary
  // (so "Ram Shrestha, 1, 25000" still picks 25000 — index columns are ignored).
  const basic = toNumber(numeric[numeric.length - 1]);
  if (!Number.isFinite(basic) || basic <= 0) return null;
  return { name: nameParts.join(" ") || fallbackName, basic };
}

function computeRow(id: number, name: string, basic: number): PayrollRow {
  try {
    return { id, name, basic, result: calculateFormalContribution(basic, FORMAL_RULE_V1), belowMin: false };
  } catch (e) {
    const below = e instanceof CalculationInputError && e.code === "BELOW_MIN_BASE";
    return { id, name, basic, result: null, belowMin: below };
  }
}

const SAMPLE_NE = "नाम, आधारभूत तलब\nराम श्रेष्ठ, 25000\nसीता तामाङ, 18500\nहरि गुरुङ, 32000";
const SAMPLE_EN = "name, basic salary\nRam Shrestha, 25000\nSita Tamang, 18500\nHari Gurung, 32000";

export function PayrollSheet() {
  const locale = useLocale();
  const isEn = locale === "en";
  const n = (v: string | number) => (isEn ? String(v) : toNeDigits(v));
  const npr = (v: number) => `${isEn ? "Rs" : "रु."} ${n(v.toLocaleString("en-IN"))}`;

  const [text, setText] = useState("");
  const [rows, setRows] = useState<PayrollRow[]>([]);
  const [quickName, setQuickName] = useState("");
  const [quickBasic, setQuickBasic] = useState("");
  const nextId = useRef(1);
  const fileRef = useRef<HTMLInputElement>(null);

  const totals = useMemo(() => {
    const valid = rows.filter((r) => r.result);
    return {
      employees: rows.length,
      valid: valid.length,
      flagged: rows.length - valid.length,
      basic: valid.reduce((a, r) => a + r.basic, 0),
      employee: valid.reduce((a, r) => a + (r.result?.employee.total ?? 0), 0),
      employer: valid.reduce((a, r) => a + (r.result?.employer.total ?? 0), 0),
      total: valid.reduce((a, r) => a + (r.result?.total ?? 0), 0),
    };
  }, [rows]);

  useEffect(() => {
    if (rows.length === 0) return;
    const t = window.setTimeout(() => trackEvent("calculator_result", { tool: "payroll", employees: rows.length }), 600);
    return () => window.clearTimeout(t);
  }, [rows.length]);

  function parseText(src: string) {
    const parsed: PayrollRow[] = [];
    for (const line of src.split(/\r?\n/)) {
      const fallback = `${isEn ? "Employee" : "कर्मचारी"} ${n(parsed.length + 1)}`;
      const p = parsePayrollLine(line, fallback);
      if (p) parsed.push(computeRow(nextId.current++, p.name, p.basic));
    }
    setRows(parsed);
  }

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const s = typeof reader.result === "string" ? reader.result : "";
      setText(s);
      parseText(s);
    };
    reader.readAsText(f);
  }

  function quickAdd() {
    const basic = toNumber(asciiDigits(quickBasic));
    if (!Number.isFinite(basic) || basic <= 0) return;
    const name = quickName.trim() || `${isEn ? "Employee" : "कर्मचारी"} ${n(rows.length + 1)}`;
    setRows((r) => [...r, computeRow(nextId.current++, name, basic)]);
    setQuickName("");
    setQuickBasic("");
  }

  function remove(id: number) {
    setRows((r) => r.filter((x) => x.id !== id));
  }

  function downloadCsv() {
    const header = "name,basic,employee_11,employer_20,total_31";
    const lines = rows.map((r) =>
      [
        `"${r.name.replace(/"/g, '""')}"`,
        r.basic,
        r.result ? r.result.employee.total : "",
        r.result ? r.result.employer.total : "",
        r.result ? r.result.total : "",
      ].join(","),
    );
    lines.push(`"TOTAL",${totals.basic},${totals.employee},${totals.employer},${totals.total}`);
    const blob = new Blob(["﻿" + [header, ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ssf-payroll-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    trackEvent("cta_click", { cta: "payroll_csv", location: "employer_hub" });
  }

  const waHref = waContext(
    isEn ? "monthly SSF payroll deposit" : "मासिक SSF payroll दाखिला",
    [
      isEn ? `Employees: ${totals.employees}` : `कर्मचारी: ${n(totals.employees)}`,
      isEn ? `Total basic: Rs ${totals.basic.toLocaleString("en-IN")}` : `जम्मा आधारभूत: रु. ${n(totals.basic.toLocaleString("en-IN"))}`,
      isEn ? `Employee 11%: Rs ${totals.employee.toLocaleString("en-IN")}` : `कर्मचारी ११%: रु. ${n(totals.employee.toLocaleString("en-IN"))}`,
      isEn ? `Employer 20%: Rs ${totals.employer.toLocaleString("en-IN")}` : `रोजगारदाता २०%: रु. ${n(totals.employer.toLocaleString("en-IN"))}`,
      isEn ? `Total 31%: Rs ${totals.total.toLocaleString("en-IN")}` : `जम्मा ३१%: रु. ${n(totals.total.toLocaleString("en-IN"))}`,
    ],
    isEn,
  );

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="card p-5 md:p-6 print:hidden">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <label htmlFor="payroll-text" className="mb-1 block text-sm font-medium text-ink-700">
              {isEn ? "Paste employees — one per line: name, basic salary" : "कर्मचारी paste गर्नुहोस् — प्रति लाइन: नाम, आधारभूत तलब"}
            </label>
            <textarea
              id="payroll-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={7}
              placeholder={isEn ? SAMPLE_EN : SAMPLE_NE}
              className="input min-h-[10rem] font-mono text-sm"
              spellCheck={false}
            />
            <p className="mt-1 text-xs text-ink-500">
              {isEn
                ? "Commas, tabs or semicolons; a header row is skipped; Devanagari digits and Rs/रु. prefixes are fine; a line with just a number works too."
                : "अल्पविराम, tab वा semicolon चल्छ; header लाइन छोडिन्छ; देवनागरी अङ्क र रु. पनि चल्छ; नाम बिना अङ्क मात्र भए पनि हुन्छ।"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => parseText(text)} className="btn-primary" disabled={!text.trim()}>
                <Icon name="calculator" size={16} />
                {isEn ? "Calculate" : "हिसाब गर्नुहोस्"}
              </button>
              <button type="button" onClick={() => fileRef.current?.click()} className="btn-outline">
                <Icon name="file" size={16} />
                {isEn ? "Upload CSV" : "CSV upload"}
              </button>
              <input ref={fileRef} type="file" accept=".csv,.txt,text/csv,text/plain" onChange={onFile} className="hidden" />
              <button
                type="button"
                onClick={() => {
                  const s = isEn ? SAMPLE_EN : SAMPLE_NE;
                  setText(s);
                  parseText(s);
                }}
                className="btn-ghost"
              >
                {isEn ? "Try sample" : "नमुना हेर्नुहोस्"}
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4">
            <p className="text-sm font-semibold text-ink-900">{isEn ? "Quick add one employee" : "एक कर्मचारी छिटो थप्नुहोस्"}</p>
            <div className="mt-3 space-y-2">
              <input
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                placeholder={isEn ? "Name (optional)" : "नाम (वैकल्पिक)"}
                className="input"
                aria-label={isEn ? "Employee name" : "कर्मचारीको नाम"}
              />
              <input
                value={quickBasic}
                onChange={(e) => setQuickBasic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && quickAdd()}
                inputMode="numeric"
                placeholder={isEn ? "Basic salary (Rs)" : "आधारभूत तलब (रु.)"}
                className="input"
                aria-label={isEn ? "Basic salary" : "आधारभूत तलब"}
              />
              <button type="button" onClick={quickAdd} className="btn-outline w-full" disabled={!quickBasic.trim()}>
                <Icon name="check" size={16} />
                {isEn ? "Add row" : "थप्नुहोस्"}
              </button>
            </div>
            <p className="mt-3 text-xs text-ink-500">
              {isEn
                ? `Contribution is on BASIC remuneration only, minimum Rs ${MIN_BASIC_REMUNERATION.toLocaleString("en-IN")}/month (FY 2082/83).`
                : `योगदान आधारभूत पारिश्रमिकमा मात्र, न्यूनतम रु. ${n(MIN_BASIC_REMUNERATION.toLocaleString("en-IN"))}/महिना (आ.व. २०८२/८३)।`}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      {rows.length > 0 && (
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-200 bg-ink-50 px-5 py-3">
            <p className="text-sm font-semibold text-ink-900">
              {isEn ? `${totals.employees} employees` : `${n(totals.employees)} कर्मचारी`}
              {totals.flagged > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
                  <Icon name="alert" size={12} />
                  {isEn ? `${totals.flagged} below minimum` : `${n(totals.flagged)} न्यूनतमभन्दा कम`}
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-2 print:hidden">
              <button type="button" onClick={downloadCsv} className="btn-outline btn-sm">
                <Icon name="download" size={14} />
                {isEn ? "Download CSV" : "CSV डाउनलोड"}
              </button>
              <button type="button" onClick={() => window.print()} className="btn-outline btn-sm">
                <Icon name="file" size={14} />
                Print
              </button>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("cta_click", { cta: "whatsapp", location: "employer_payroll" })}
                className="btn-accent btn-sm"
              >
                <Icon name="chat" size={14} />
                {isEn ? "Send on WhatsApp" : "WhatsApp मा पठाउनुहोस्"}
              </a>
              <button type="button" onClick={() => setRows([])} className="btn-ghost btn-sm">
                <Icon name="x" size={14} />
                {isEn ? "Clear" : "खाली गर्नुहोस्"}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-ink-600">
                  <th className="px-4 py-2.5">#</th>
                  <th className="px-4 py-2.5">{isEn ? "Name" : "नाम"}</th>
                  <th className="px-4 py-2.5 text-right">{isEn ? "Basic" : "आधारभूत"}</th>
                  <th className="px-4 py-2.5 text-right">{isEn ? `Employee ${FORMAL_RULE_V1.employeePct}%` : `कर्मचारी ${n(FORMAL_RULE_V1.employeePct)}%`}</th>
                  <th className="px-4 py-2.5 text-right">{isEn ? `Employer ${FORMAL_RULE_V1.employerPct}%` : `रोजगारदाता ${n(FORMAL_RULE_V1.employerPct)}%`}</th>
                  <th className="px-4 py-2.5 text-right">{isEn ? "Total 31%" : "जम्मा ३१%"}</th>
                  <th className="px-2 py-2.5 print:hidden" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id} className={`border-t border-ink-100 ${r.belowMin ? "bg-amber-50/60" : ""}`}>
                    <td className="px-4 py-2.5 text-ink-400">{n(i + 1)}</td>
                    <td className="px-4 py-2.5 font-medium text-ink-900">
                      {r.name}
                      {r.belowMin && (
                        <span className="mt-0.5 flex items-center gap-1 text-xs font-normal text-amber-800">
                          <Icon name="alert" size={12} />
                          {isEn
                            ? `Below the minimum basic (Rs ${MIN_BASIC_REMUNERATION.toLocaleString("en-IN")}) — fix the salary; not counted in totals`
                            : `न्यूनतम आधारभूत (रु. ${n(MIN_BASIC_REMUNERATION.toLocaleString("en-IN"))}) भन्दा कम — तलब सच्याउनुहोस्; जम्मामा गनिएको छैन`}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right text-ink-700">{npr(r.basic)}</td>
                    <td className="px-4 py-2.5 text-right text-ink-700">{r.result ? npr(r.result.employee.total) : "—"}</td>
                    <td className="px-4 py-2.5 text-right text-ink-700">{r.result ? npr(r.result.employer.total) : "—"}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-ink-900">{r.result ? npr(r.result.total) : "—"}</td>
                    <td className="px-2 py-2.5 text-right print:hidden">
                      <button type="button" onClick={() => remove(r.id)} className="rounded-md p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700" aria-label={isEn ? "Remove row" : "हटाउनुहोस्"}>
                        <Icon name="x" size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-ink-200 bg-primary-50/50 font-semibold text-ink-900">
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3">{isEn ? `Total (${totals.valid} valid)` : `जम्मा (${n(totals.valid)} मान्य)`}</td>
                  <td className="px-4 py-3 text-right">{npr(totals.basic)}</td>
                  <td className="px-4 py-3 text-right">{npr(totals.employee)}</td>
                  <td className="px-4 py-3 text-right">{npr(totals.employer)}</td>
                  <td className="px-4 py-3 text-right font-display text-lg text-primary-700">{npr(totals.total)}</td>
                  <td className="print:hidden" />
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="border-t border-ink-100 px-5 py-3 text-xs text-ink-500">
            {isEn
              ? `Employee ${FORMAL_RULE_V1.employeePct}% = PF ${FORMAL_RULE_V1.employeeSplit.pf}% + social security tax ${FORMAL_RULE_V1.employeeSplit.sst}% (deducted from pay). Employer ${FORMAL_RULE_V1.employerPct}% = PF ${FORMAL_RULE_V1.employerSplit.pf}% + gratuity ${FORMAL_RULE_V1.employerSplit.gratuity}% + other ${FORMAL_RULE_V1.employerSplit.other}% (added by you). Scheme Operation Procedure 2075 §25 (5th Amendment). Preliminary figures — the Fund's SOSYS declaration is authoritative. Names stay in your browser; the WhatsApp message carries totals only.`
              : `कर्मचारी ${n(FORMAL_RULE_V1.employeePct)}% = सञ्चय कोष ${n(FORMAL_RULE_V1.employeeSplit.pf)}% + सामाजिक सुरक्षा कर ${n(FORMAL_RULE_V1.employeeSplit.sst)}% (तलबबाट कट्टा)। रोजगारदाता ${n(FORMAL_RULE_V1.employerPct)}% = सञ्चय कोष ${n(FORMAL_RULE_V1.employerSplit.pf)}% + उपदान ${n(FORMAL_RULE_V1.employerSplit.gratuity)}% + अन्य ${n(FORMAL_RULE_V1.employerSplit.other)}% (तपाईंले थप्ने)। योजना सञ्चालन कार्यविधि २०७५ दफा २५ (५औँ संशोधन)। प्रारम्भिक हिसाब — कोषको SOSYS declaration नै आधिकारिक। नाम तपाईंको ब्राउजरमै रहन्छ; WhatsApp सन्देशमा जम्मा रकम मात्र जान्छ।`}
          </p>
        </div>
      )}
    </div>
  );
}
