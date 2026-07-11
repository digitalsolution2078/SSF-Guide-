import { describe, expect, it } from "vitest";
import { parseReply } from "./gemini";

describe("parseReply salvage behaviour", () => {
  it("parses clean JSON", () => {
    const r = parseReply(
      '{"answer":"नमस्ते","confidence":"VERIFIED","needsEscalation":false}',
    );
    expect(r.answer).toBe("नमस्ते");
    expect(r.confidence).toBe("VERIFIED");
  });

  it("strips markdown fences", () => {
    const r = parseReply(
      '```json\n{"answer":"ठिक छ","confidence":"CONDITIONAL","needsEscalation":true}\n```',
    );
    expect(r.answer).toBe("ठिक छ");
    expect(r.needsEscalation).toBe(true);
  });

  it("salvages truncated JSON without leaking raw JSON to the user", () => {
    // output cut mid-string by the token cap
    const truncated =
      '{"answer": "पेन्सनको रकम ग्यारेन्टी गर्न सकिँदैन।\\n\\nसूत्र: जम्मा ÷ १६०';
    const r = parseReply(truncated);
    expect(r.answer).toContain("ग्यारेन्टी गर्न सकिँदैन");
    expect(r.answer).not.toContain('"answer"');
  });

  it("keeps confidence from truncated output when present", () => {
    const truncated =
      '{"confidence":"VERIFIED","needsEscalation":true,"answer":"KYC आवश्यक छ किनभने';
    const r = parseReply(truncated);
    expect(r.confidence).toBe("VERIFIED");
    expect(r.needsEscalation).toBe(true);
    expect(r.answer).toContain("KYC आवश्यक छ");
  });

  it("passes through plain text", () => {
    const r = parseReply("सिधा पाठ उत्तर");
    expect(r.answer).toBe("सिधा पाठ उत्तर");
    expect(r.confidence).toBe("CONDITIONAL");
  });
});
