"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * "My SSF" profile — a few numbers the visitor enters once, kept ONLY in the
 * browser (localStorage). Every calculator, the loan eligibility check and
 * the /my-ssf snapshot read from it, so people never retype salary/age/months.
 * No account, no server round-trip, no PII beyond what the user chooses.
 */

export type ProfileRole = "employee" | "employer" | "foreign" | "selfEmployed" | "informal";
export type ProfileProvince =
  | "koshi"
  | "madhesh"
  | "bagmati"
  | "gandaki"
  | "lumbini"
  | "karnali"
  | "sudurpashchim";

export interface SsfProfile {
  role?: ProfileRole;
  /** monthly basic salary / contribution base, NPR */
  basicSalary?: number;
  age?: number;
  /** months of regular contribution so far */
  monthsContributed?: number;
  /** ISO date when the profile numbers were last saved — lets us age monthsContributed */
  savedAt?: string;
  spouseSalary?: number;
  /** Retirement Amount balance, NPR (from SOSYS / SSF app) */
  retirementBalance?: number;
  province?: ProfileProvince;
  /** ISO country code for migrant workers, e.g. "AE" */
  country?: string;
  /** pension-scheme start — contributions on/after 2078 Shrawan are mandatory pension */
  joinedBefore2078?: boolean;
}

export const PROFILE_KEY = "ssf-profile-v1";
const EVENT = "ssf-profile-change";

export function readProfile(): SsfProfile {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as SsfProfile;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writeProfile(next: SsfProfile): void {
  if (typeof window === "undefined") return;
  try {
    const clean: SsfProfile = { ...next, savedAt: new Date().toISOString() };
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(clean));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* storage unavailable (private mode) — ignore */
  }
}

export function clearProfile(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PROFILE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* ignore */
  }
}

/** monthsContributed grows by itself: +1 for every full month since it was saved. */
export function effectiveMonths(p: SsfProfile, now = new Date()): number | undefined {
  if (p.monthsContributed === undefined) return undefined;
  if (!p.savedAt) return p.monthsContributed;
  const saved = new Date(p.savedAt);
  const diff = (now.getFullYear() - saved.getFullYear()) * 12 + (now.getMonth() - saved.getMonth());
  return p.monthsContributed + Math.max(0, diff);
}

export function hasCoreNumbers(p: SsfProfile): p is SsfProfile & Required<Pick<SsfProfile, "basicSalary" | "age" | "monthsContributed">> {
  return (
    typeof p.basicSalary === "number" &&
    p.basicSalary > 0 &&
    typeof p.age === "number" &&
    p.age > 0 &&
    typeof p.monthsContributed === "number"
  );
}

/**
 * React hook — hydrates after mount (so SSR markup never depends on storage),
 * and re-renders when any other component on the page updates the profile.
 */
export function useSsfProfile() {
  const [profile, setProfile] = useState<SsfProfile>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfile(readProfile());
    setReady(true);
    const onChange = () => setProfile(readProfile());
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const update = useCallback((patch: Partial<SsfProfile>) => {
    const next = { ...readProfile(), ...patch };
    writeProfile(next);
    setProfile(next);
  }, []);

  const reset = useCallback(() => {
    clearProfile();
    setProfile({});
  }, []);

  return { profile, ready, update, reset, hasCore: hasCoreNumbers(profile) };
}
