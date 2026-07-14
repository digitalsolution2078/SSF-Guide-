import "server-only";
import webpush from "web-push";
import { VAPID_PUBLIC_KEY } from "./push-config";

/**
 * Server-side Web Push. Requires VAPID_PRIVATE_KEY in the environment (the
 * public key is bundled via push-config). Inert until the private key is set.
 */
const PRIVATE = process.env.VAPID_PRIVATE_KEY;
const SUBJECT = process.env.VAPID_SUBJECT || "mailto:mail@digitalsolutionnepal.com";

let configured = false;
if (VAPID_PUBLIC_KEY && PRIVATE) {
  try {
    webpush.setVapidDetails(SUBJECT, VAPID_PUBLIC_KEY, PRIVATE);
    configured = true;
  } catch {
    configured = false;
  }
}

export function pushConfigured(): boolean {
  return configured;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

export interface PushTarget {
  endpoint: string;
  p256dh: string;
  auth: string;
}

/** Send to one subscription. Returns "gone" if the subscription is expired. */
export async function sendPush(
  target: PushTarget,
  payload: PushPayload,
): Promise<"ok" | "gone" | "error"> {
  try {
    await webpush.sendNotification(
      { endpoint: target.endpoint, keys: { p256dh: target.p256dh, auth: target.auth } },
      JSON.stringify(payload),
    );
    return "ok";
  } catch (err) {
    const code = (err as { statusCode?: number }).statusCode;
    if (code === 404 || code === 410) return "gone";
    return "error";
  }
}

export { webpush };
