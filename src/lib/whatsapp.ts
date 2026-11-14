/**
 * Digital Solution WhatsApp (not the Fund's). One place for the number so
 * every button and prefilled message stays in sync.
 */
export const WHATSAPP_NUMBER = "9779748433699";
export const WHATSAPP_DISPLAY = "+977 9748433699";

/** wa.me deep link with an optional prefilled message (URL-encoded). */
export function waLink(text?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/**
 * Prefilled message carrying context from a calculator / page, e.g.
 *   waContext("घर सापटी", ["तलब: रु. ४०,०००", "योगदान: ३० महिना", "योग्य: रु. ५०.९ लाख"])
 */
export function waContext(topic: string, facts: string[], isEn = false): string {
  const lines = [
    isEn ? `Hello Digital Solution, I need help with ${topic}.` : `नमस्कार Digital Solution, मलाई ${topic} सम्बन्धी सहायता चाहियो।`,
    ...facts.map((f) => `• ${f}`),
    isEn ? "(sent from ssf.digitalsolutionnepal.com)" : "(ssf.digitalsolutionnepal.com बाट)",
  ];
  return waLink(lines.join("\n"));
}
