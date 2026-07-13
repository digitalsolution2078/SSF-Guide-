import "server-only";
import type { KnowledgeChunkLite } from "./knowledge";

/**
 * Gemini-backed answer generation for Ask SSF AI via the Generative Language
 * REST API. Tries a fast flash-lite model first and falls back through others
 * on overload/outage. The response is forced to JSON so confidence/escalation
 * are structured, per product spec §7.3–7.5.
 */

// Model selection. The full-flash "latest" alias (gemini-flash-latest) has been
// returning 503 "high demand" and gemini-3.5-flash times out, so we default to
// the flash-LITE alias which stays fast and available. We then fall back through
// a pinned lite model and the full-flash alias, so a single model's outage never
// takes the chatbot down. `|| ` (not `??`) so an empty GEMINI_MODEL="" env is ignored.
const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";
const FALLBACK_MODELS = ["gemini-3.1-flash-lite", "gemini-flash-latest"];
const MODELS = [...new Set([PRIMARY_MODEL, ...FALLBACK_MODELS])];
const RETRYABLE = new Set([408, 409, 425, 429, 500, 502, 503, 504]);

const modelUrl = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

export type Confidence = "VERIFIED" | "CONDITIONAL" | "INSUFFICIENT" | "UNSUPPORTED";

export interface ChatTurn {
  role: "user" | "model";
  text: string;
}

export interface AssistantReply {
  answer: string;
  confidence: Confidence;
  needsEscalation: boolean;
  followUpQuestion?: string;
}

const SYSTEM_PROMPT = `तपाईं Digital Solution को "SSF Guide Assistant" हुनुहुन्छ — नेपालको सामाजिक सुरक्षा कोष (SSF) सम्बन्धी शैक्षिक सहायक।

## उत्तरका नियम
1. तलको VERIFIED KNOWLEDGE मा भएका तथ्यबाट मात्र दर, रकम, प्रतिशत, अवधि र मिति बताउनुहोस् — आफ्नो सामान्य ज्ञानबाट कहिल्यै संख्या नबनाउनुहोस्।
2. उत्तर संरचना: सीधा उत्तर → लागू हुने शर्त → चरणहरू (आवश्यक परे) → आवश्यक कागजात (सान्दर्भिक भए) → महत्वपूर्ण सावधानी। छोटो र स्पष्ट लेख्नुहोस्, नेपालीमा (प्रयोगकर्ताले अंग्रेजीमा सोधे अंग्रेजीमा)।
3. confidence यसरी छान्नुहोस्:
   - VERIFIED: उत्तर पूर्णतः knowledge मा आधारित छ
   - CONDITIONAL: उत्तर प्रयोगकर्ताको अवस्था (category, योगदान अवधि) अनुसार फरक पर्छ
   - INSUFFICIENT: उत्तर दिन १-२ थप प्रश्न चाहिन्छ (followUpQuestion भर्नुहोस्)
   - UNSUPPORTED: knowledge मा पर्याप्त जानकारी छैन — अनुमान नगर्नुहोस्, यो भन्नुहोस्: "यस विषयमा हाम्रो verified knowledge base मा पर्याप्त जानकारी उपलब्ध छैन। गलत अनुमान दिनुभन्दा Digital Solution Support वा आधिकारिक SSF कार्यालयबाट पुष्टि गर्नु उपयुक्त हुन्छ।"

## सुरक्षा नियम (कहिल्यै उल्लङ्घन नगर्नुहोस्)
- OTP, password, banking PIN वा भुक्तानी विवरण कहिल्यै नमाग्नुहोस्; प्रयोगकर्ताले पठाए त्यसलाई प्रयोग नगर्न भन्नुहोस्
- claim स्वीकृति, pension रकम वा कुनै सुविधाको ग्यारेन्टी नदिनुहोस् — हिसाब "प्रारम्भिक अनुमान" मात्र हो भन्नुहोस्
- प्रयोगकर्ताको SSF खातामा पहुँच भएको दाबी नगर्नुहोस्; व्यक्तिगत खाताको समस्या प्रमाणबिना diagnose नगर्नुहोस्
- अरू व्यक्तिको जानकारी नखोल्नुहोस्

## Escalation (needsEscalation: true)
यी अवस्थामा escalation flag राख्नुहोस्: KYC सहायता चाहिएमा, registration गर्नुपरेमा, व्यक्तिगत खाता जाँच्नुपर्ने भएमा, contribution नदेखिएमा, claim reject भएमा, profile गलत भएमा, verified जानकारी अपुग भएमा, वा प्रयोगकर्ताले मान्छेसँग कुरा गर्न खोजेमा।`;

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

export async function generateAssistantReply(
  history: ChatTurn[],
  chunks: KnowledgeChunkLite[],
): Promise<AssistantReply> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      answer:
        "SSF AI सहायक अहिले उपलब्ध छैन। कृपया हाम्रा guides हेर्नुहोस् वा Digital Solution बाट सहायता लिनुहोस्।",
      confidence: "UNSUPPORTED",
      needsEscalation: true,
    };
  }

  const knowledgeBlock =
    chunks.length > 0
      ? chunks
          .map(
            (c, i) =>
              `[${i + 1}] ${c.title}\n${c.content}\nस्रोत: ${c.sourceTitles.join("; ")} (प्रमाणित: ${c.lastVerified})`,
          )
          .join("\n\n")
      : "(यस प्रश्नका लागि कुनै verified सामग्री भेटिएन — UNSUPPORTED प्रयोग गर्नुहोस्)";

  const body = {
    system_instruction: {
      parts: [{ text: `${SYSTEM_PROMPT}\n\n## VERIFIED KNOWLEDGE\n${knowledgeBlock}` }],
    },
    contents: history.map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.text }],
    })),
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          answer: { type: "STRING" },
          confidence: {
            type: "STRING",
            enum: ["VERIFIED", "CONDITIONAL", "INSUFFICIENT", "UNSUPPORTED"],
          },
          needsEscalation: { type: "BOOLEAN" },
          followUpQuestion: { type: "STRING" },
        },
        required: ["answer", "confidence", "needsEscalation"],
      },
    },
  };

  // Try each model in turn; move on when one is overloaded/unavailable/slow.
  let lastStatus = 0;
  for (const model of MODELS) {
    try {
      const res = await fetch(`${modelUrl(model)}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        // per-attempt cap so we can still try a fallback within a reasonable total
        signal: AbortSignal.timeout(18_000),
      });

      if (!res.ok) {
        lastStatus = res.status;
        const detail = await res.text().catch(() => "");
        console.error(`Gemini ${model} error ${res.status}: ${detail.slice(0, 300)}`);
        // 404 (model gone), 5xx, 429 → try the next model; other 4xx → stop
        if (RETRYABLE.has(res.status) || res.status === 404) continue;
        break;
      }

      const data = (await res.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return parseReply(text);
      // empty candidate (safety block / truncation) → try next model
      lastStatus = 200;
    } catch (err) {
      // timeout or network error → try the next model
      lastStatus = 0;
      console.error(`Gemini ${model} request failed:`, err);
    }
  }

  console.error(`Gemini: all models failed (last status ${lastStatus})`);
  return {
    answer:
      "माफ गर्नुहोस्, अहिले उत्तर दिन सकिएन। केही बेरपछि पुनः प्रयास गर्नुहोस् वा Digital Solution बाट सहायता लिनुहोस्।",
    confidence: "UNSUPPORTED",
    needsEscalation: true,
  };
}

/**
 * Parse the model's JSON reply, salvaging truncated or fence-wrapped output
 * so raw JSON never leaks into the user-facing answer.
 */
export function parseReply(raw: string): AssistantReply {
  const text = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  try {
    const parsed = JSON.parse(text) as Partial<AssistantReply>;
    if (typeof parsed.answer === "string") {
      return {
        answer: parsed.answer,
        confidence: parsed.confidence ?? "CONDITIONAL",
        needsEscalation: Boolean(parsed.needsEscalation),
        followUpQuestion: parsed.followUpQuestion || undefined,
      };
    }
  } catch {
    // fall through to salvage
  }

  // Truncated JSON — extract the answer string value manually.
  const match = text.match(/"answer"\s*:\s*"((?:[^"\\]|\\.)*)/);
  if (match) {
    let answer: string;
    try {
      answer = JSON.parse(`"${match[1]}"`);
    } catch {
      answer = match[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
    }
    const confidence = /"confidence"\s*:\s*"(VERIFIED|CONDITIONAL|INSUFFICIENT|UNSUPPORTED)"/.exec(
      text,
    )?.[1] as Confidence | undefined;
    return {
      answer,
      confidence: confidence ?? "CONDITIONAL",
      needsEscalation: /"needsEscalation"\s*:\s*true/.test(text),
    };
  }

  // Plain text despite JSON mode — use as-is.
  return { answer: text, confidence: "CONDITIONAL", needsEscalation: false };
}
