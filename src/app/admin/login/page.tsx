import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession, verifyCredentials, createSession } from "@/lib/admin-auth";

export const metadata = { title: "Admin Login", robots: { index: false } };

// Brute-force protection: max 5 failed attempts per IP per 15 minutes
const WINDOW_MS = 15 * 60_000;
const MAX_FAILS = 5;
const fails = new Map<string, number[]>();

async function loginAction(formData: FormData) {
  "use server";
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const recent = (fails.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_FAILS) redirect("/admin/login?error=locked");

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const session = await verifyCredentials(email, password);
  if (!session) {
    recent.push(now);
    fails.set(ip, recent);
    if (fails.size > 5_000) fails.clear();
    redirect("/admin/login?error=1");
  }
  fails.delete(ip);
  await createSession(session);
  redirect("/admin");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getSession()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        action={loginAction}
        className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-xl font-bold text-gray-900">
          SSF Guide — Admin
        </h1>
        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error === "locked"
              ? "धेरै गलत प्रयास — १५ मिनेटपछि पुनः प्रयास गर्नुहोस्।"
              : "Email वा password मिलेन।"}
          </p>
        )}
        <label className="mt-5 block text-sm font-medium text-gray-700">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="username"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-gray-700">
          Password
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </label>
        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-primary-600 py-2.5 font-semibold text-white hover:bg-primary-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
