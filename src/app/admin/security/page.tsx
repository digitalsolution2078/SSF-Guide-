import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { getSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const metadata = { title: "Admin Security (2FA)", robots: { index: false } };
export const dynamic = "force-dynamic";

async function startSetupAction() {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const sec = authenticator.generateSecret();
  await prisma.adminUser.update({
    where: { id: session.userId },
    data: { totpSecret: sec, totpEnabled: false },
  });
  revalidatePath("/admin/security");
}

async function confirmAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const code = String(formData.get("code") ?? "").replace(/\s+/g, "");
  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } });
  if (!user?.totpSecret) redirect("/admin/security?error=nosecret");
  const ok = authenticator.check(code, user.totpSecret);
  if (!ok) redirect("/admin/security?error=badcode");
  await prisma.adminUser.update({
    where: { id: session.userId },
    data: { totpEnabled: true },
  });
  await prisma.auditLog
    .create({
      data: { actorId: session.userId, action: "2FA_ENABLED", entity: "AdminUser", entityId: session.userId },
    })
    .catch(() => {});
  revalidatePath("/admin/security");
}

async function disableAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const code = String(formData.get("code") ?? "").replace(/\s+/g, "");
  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } });
  if (!user?.totpSecret || !authenticator.check(code, user.totpSecret)) {
    redirect("/admin/security?error=badcode");
  }
  await prisma.adminUser.update({
    where: { id: session.userId },
    data: { totpEnabled: false, totpSecret: null },
  });
  revalidatePath("/admin/security");
}

export default async function SecurityPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const { error } = await searchParams;
  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } });
  const enabled = Boolean(user?.totpEnabled);
  const settingUp = Boolean(user?.totpSecret) && !enabled;

  let qrDataUrl = "";
  if (settingUp && user?.totpSecret) {
    const uri = authenticator.keyuri(session.email, "SSF Guide Admin", user.totpSecret);
    qrDataUrl = await QRCode.toDataURL(uri, { margin: 1, width: 220 });
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">      <h1 className="mt-2 text-2xl font-medium text-ink-900">🔒 Two-Factor Authentication</h1>
      <p className="mt-1 text-sm text-ink-500">
        Password सँगै Google Authenticator (वा Authy) को ६-अङ्कको कोड — admin account
        अझ सुरक्षित।
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error === "badcode" ? "कोड मिलेन — पुनः प्रयास गर्नुहोस्।" : "केही मिलेन।"}
        </p>
      )}

      {enabled ? (
        <div className="mt-6 rounded-xl border border-green-300 bg-green-50 p-5">
          <p className="font-semibold text-green-800">✓ 2FA सक्रिय छ</p>
          <p className="mt-1 text-sm text-ink-600">
            बन्द गर्न Authenticator को कोड लेख्नुहोस्:
          </p>
          <form action={disableAction} className="mt-3 flex gap-2">
            <input
              name="code"
              inputMode="numeric"
              required
              placeholder="123456"
              className="w-32 rounded-lg border border-ink-300 px-3 py-2 tracking-widest"
            />
            <button className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
              Disable
            </button>
          </form>
        </div>
      ) : settingUp ? (
        <div className="mt-6 rounded-xl border border-ink-200 bg-white p-5">
          <p className="text-sm text-ink-700">
            १. Authenticator app मा यो QR scan गर्नुहोस् (वा secret हात्ले हाल्नुहोस्):
          </p>
          {qrDataUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={qrDataUrl} alt="2FA QR" className="mt-3 rounded-lg border" width={220} height={220} />
          )}
          <p className="mt-2 break-all rounded-lg bg-ink-50 px-3 py-2 font-mono text-xs text-ink-600">
            {user?.totpSecret}
          </p>
          <p className="mt-4 text-sm text-ink-700">२. app मा देखिएको ६-अङ्कको कोड लेखेर पुष्टि गर्नुहोस्:</p>
          <form action={confirmAction} className="mt-2 flex gap-2">
            <input
              name="code"
              inputMode="numeric"
              required
              placeholder="123456"
              className="w-32 rounded-lg border border-ink-300 px-3 py-2 tracking-widest"
            />
            <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
              सक्रिय गर्नुहोस्
            </button>
          </form>
        </div>
      ) : (
        <form action={startSetupAction} className="mt-6">
          <button className="rounded-lg bg-primary-600 px-4 py-2.5 font-semibold text-white hover:bg-primary-700">
            2FA सेटअप सुरु गर्नुहोस्
          </button>
        </form>
      )}
    </div>
  );
}
