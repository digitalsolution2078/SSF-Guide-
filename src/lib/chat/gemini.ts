import "server-only";
import type { KnowledgeChunkLite } from "./knowledge";

/**
 * Gemini-backed answer generation for Ask SSF AI.
 * Model: gemini-2.5-flash via the Generative Language REST API.
 * The response is forced to JSON so confidence/escalation are structured,
 * per product spec §7.3–7.5.
 */

// gemini-flash-latest is Google's stable alias for the newest Flash model —
// named models get retired for new API keys, the alias does not.
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-latest";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

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

  const res = await fetch(`${API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    // Gemini can be slow on long contexts; cap the wait
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error(`Gemini API error ${res.status}: ${detail.slice(0, 500)}`);
    return {
      answer:
        "माफ गर्नुहोस्, अहिले उत्तर दिन सकिएन। केही बेरपछि पुनः प्रयास गर्नुहोस् वा Digital Solution बाट सहायता लिनुहोस्।",
      confidence: "UNSUPPORTED",
      needsEscalation: true,
    };
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    return {
      answer:
        "माफ गर्नुहोस्, अहिले उत्तर दिन सकिएन। कृपया प्रश्न फरक तरिकाले सोध्नुहोस्।",
      confidence: "UNSUPPORTED",
      needsEscalation: false,
    };
  }

  return parseReply(text);
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
