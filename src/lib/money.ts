/** Shared money formatter — Nepali lakh/crore grouping, locale-aware label. */
export function formatNpr(n: number, isEn: boolean): string {
  const rs = isEn ? "Rs." : "रु.";
  const crore = isEn ? "crore" : "करोड";
  const lakh = isEn ? "lakh" : "लाख";
  const abs = Math.abs(n);
  if (abs >= 10_000_000) return `${rs} ${(n / 10_000_000).toFixed(2)} ${crore}`;
  if (abs >= 100_000) return `${rs} ${(n / 100_000).toFixed(1)} ${lakh}`;
  return `${rs} ${Math.round(n).toLocaleString("en-IN")}`;
}
