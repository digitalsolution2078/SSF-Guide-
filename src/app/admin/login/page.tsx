import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  getSession,
  verifyPassword,
  verifyTotp,
  setPending2FA,
  getPending2FA,
  clearPending2FA,
  finalizeLogin,
} from "@/lib/admin-auth";

export const metadata = { title: "Admin Login", robots: { index: false } };

// Brute-force protection: max 5 failed attempts per IP per 15 minutes
const WINDOW_MS = 15 * 60_000;
const MAX_FAILS = 5;
const fails = new Map<string, number[]>();

function recordFail(ip: string): void {
  const now = Date.now();
  const recent = (fails.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  fails.set(ip, recent);
  if (fails.size > 5_000) fails.clear();
}
function isLocked(ip: string): boolean {
  const now = Date.now();
  return (fails.get(ip) ?? []).filter((t) => now - t < WINDOW_MS).length >= MAX_FAILS;
}
async function clientIp(): Promise<string> {
  return (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}

async function loginAction(formData: FormData) {
  "use server";
  const ip = await clientIp();
  if (isLocked(ip)) redirect("/admin/login?error=locked");

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const res = await verifyPassword(email, password);
  if (!res) {
    recordFail(ip);
    redirect("/admin/login?error=1");
  }
  if (res.totpEnabled) {
    await setPending2FA(res.userId);
    redirect("/admin/login?step=2");
  }
  fails.delete(ip);
  await finalizeLogin(res.userId);
  redirect("/admin");
}

async function verify2faAction(formData: FormData) {
  "use server";
  const ip = await clientIp();
  if (isLocked(ip)) redirect("/admin/login?error=locked");
  const userId = await getPending2FA();
  if (!userId) redirect("/admin/login");
  const code = String(formData.get("code") ?? "");
  const ok = await verifyTotp(userId, code);
  if (!ok) {
    recordFail(ip);
    redirect("/admin/login?step=2&error=totp");
  }
  fails.delete(ip);
  await finalizeLogin(userId);
  redirect("/admin");
}

async function cancel2faAction() {
  "use server";
  await clearPending2FA();
  redirect("/admin/login");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; step?: string }>;
}) {
  if (await getSession()) redirect("/admin");
  const { error, step } = await searchParams;
  const twoFactor = step === "2" && Boolean(await getPending2FA());

  const inputCls =
    "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">SSF Guide — Admin</h1>
        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error === "locked"
              ? "धेरै गलत प्रयास — १५ मिनेटपछि पुनः प्रयास गर्नुहोस्।"
              : error === "totp"
                ? "OTP कोड मिलेन। पुनः प्रयास गर्नुहोस्।"
                : "Email वा password मिलेन।"}
          </p>
        )}

        {twoFactor ? (
          <form action={verify2faAction}>
            <p className="mt-4 text-sm text-gray-600">
              Authenticator app को ६-अङ्कको कोड लेख्नुहोस्।
            </p>
            <label className="mt-4 block text-sm font-medium text-gray-700">
              2FA कोड
              <input
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9 ]*"
                required
                autoFocus
                className={`${inputCls} tracking-widest`}
                placeholder="123456"
              />
            </label>
            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-primary-600 py-2.5 font-semibold text-white hover:bg-primary-700"
            >
              प्रमाणित गर्नुहोस्
            </button>
            <button
              type="submit"
              formAction={cancel2faAction}
              className="mt-2 w-full rounded-lg border border-gray-300 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              रद्द गर्नुहोस्
            </button>
          </form>
        ) : (
          <form action={loginAction}>
            <label className="mt-5 block text-sm font-medium text-gray-700">
              Email
              <input name="email" type="email" required autoComplete="username" className={inputCls} />
            </label>
            <label className="mt-4 block text-sm font-medium text-gray-700">
              Password
              <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
            </label>
            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-primary-600 py-2.5 font-semibold text-white hover:bg-primary-700"
            >
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
