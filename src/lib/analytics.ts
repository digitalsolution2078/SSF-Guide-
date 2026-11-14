/**
 * Product analytics events — one helper so every calculator / CTA reports the
 * same way. Sends to GA4 (gtag) when loaded, and to Plausible when enabled.
 * Safe to call on the server or when analytics are disabled (no-op).
 *
 * Event vocabulary (keep it small and stable):
 *   calculator_result  { tool, ...numbers }
 *   cta_click          { cta: "whatsapp" | "request" | "ask_ai" | "maps" | ..., location }
 *   lead_submit        { service }
 *   push_optin         { topics }
 *   profile_saved      { role }
 *   course_progress    { course, lesson } / course_complete { course, score }
 *   hospital_report    { hospitalId }
 */
export type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, opts?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

export function trackEvent(name: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  // strip undefined values; GA4 rejects nested/undefined params silently anyway
  const clean: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) if (v !== undefined) clean[k] = v;
  try {
    window.gtag?.("event", name, clean);
  } catch {
    /* ignore */
  }
  try {
    window.plausible?.(name, { props: clean });
  } catch {
    /* ignore */
  }
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", name, clean);
  }
}

/** Round money for analytics so we never ship exact salaries. */
export function bucketNpr(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "0";
  if (n < 20_000) return "<20k";
  if (n < 40_000) return "20-40k";
  if (n < 75_000) return "40-75k";
  if (n < 150_000) return "75-150k";
  return "150k+";
}
