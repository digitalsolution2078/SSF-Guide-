/**
 * Web Push public config — safe to import on the client.
 * The VAPID *public* key is not secret (it ships to browsers). The matching
 * private key lives only in the server env (VAPID_PRIVATE_KEY). Override the
 * public key via NEXT_PUBLIC_VAPID_PUBLIC_KEY before build if you rotate keys.
 */
export const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "BJzaI-FsselVPD94qLJHjpcILd3y8XVL4EKhKkVH-ATXiJEuSHQ7dGEzMWe7YSNAQkszqdaWwX6krlcFAuv68HU";

/** Convert a base64url VAPID key to the Uint8Array the Push API expects. */
export function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
