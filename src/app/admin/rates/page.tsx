import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { getMinBasicRemuneration, MIN_BASE_SETTING_KEY } from "@/lib/calculation/provider";
import {
  FORMAL_RULE_V1,
  INFORMAL_RULE_V1,
  SELF_EMPLOYED_RULE_V1,
  FOREIGN_EMPLOYMENT_RULE_V1,
} from "@/lib/calculation/rules";

export const metadata = { title: "Rate Manager", robots: { index: false } };
export const dynamic = "force-dynamic";

async function saveMinBaseAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const value = Number(formData.get("minBase"));
  if (!Number.isFinite(value) || value <= 0) return;
  await prisma.siteSetting.upsert({
    where: { key: MIN_BASE_SETTING_KEY },
    create: { key: MIN_BASE_SETTING_KEY, value, updatedById: session.userId },
    update: { value, updatedById: session.userId },
  });
  await prisma.auditLog
    .create({
      data: {
        actorId: session.userId,
        action: "RATE_UPDATE",
        entity: "SiteSetting",
        entityId: MIN_BASE_SETTING_KEY,
        after: { value },
      },
    })
    .catch(() => {});
  revalidatePath("/admin/rates");
}

export default async function RatesPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const current = await getMinBasicRemuneration();

  const pctRows = [
    { sector: "औपचारिक (Formal)", detail: "श्रमिक ११% + रोजगारदाता २०% = ३१%", min: `${FORMAL_RULE_V1.minBase}` },
    { sector: "अनौपचारिक (Informal)", detail: `श्रमिक ${INFORMAL_RULE_V1.workerPct}% + सरकार ${INFORMAL_RULE_V1.governmentPct}%`, min: `${INFORMAL_RULE_V1.minBase}` },
    { sector: "स्वरोजगार (Self-employed)", detail: `${SELF_EMPLOYED_RULE_V1.totalPct}% (आधार १–३× न्यूनतम)`, min: `${SELF_EMPLOYED_RULE_V1.minBase}` },
    { sector: "वैदेशिक (Foreign)", detail: `${FOREIGN_EMPLOYMENT_RULE_V1.minPct}% (३× सम्म)`, min: `${FOREIGN_EMPLOYMENT_RULE_V1.industrialMinBase}` },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">      <h1 className="mt-2 text-2xl font-medium text-ink-900">⚙️ Rate Manager</h1>
      <p className="mt-1 text-sm text-ink-500">
        न्यूनतम आधारभूत पारिश्रमिक यहाँबाट परिवर्तन गर्नुहोस् — सबै server-side
        contribution calculator (औपचारिक, अनौपचारिक, स्वरोजगार, वैदेशिक) मा
        १ मिनेटभित्र लागू हुन्छ। दर परिवर्तन नियमित हुँदैन; परिवर्तन गर्नुअघि
        आधिकारिक राजपत्र जाँच्नुहोस्।
      </p>

      <form
        action={saveMinBaseAction}
        className="mt-6 rounded-xl border border-ink-200 bg-white p-5"
      >
        <label className="block text-sm font-semibold text-ink-800">
          न्यूनतम आधारभूत पारिश्रमिक (रु./महिना)
          <input
            type="number"
            name="minBase"
            defaultValue={current}
            min={1}
            className="mt-1 block w-48 rounded-lg border border-ink-300 px-3 py-2 text-lg font-semibold"
          />
        </label>
        <p className="mt-1 text-xs text-ink-500">
          हाल: <strong>रु. {current.toLocaleString("en-IN")}</strong> · सन्दर्भ:
          आ.व. २०८२/८३ को न्यूनतम ज्याला रु. १९,५५० = आधारभूत रु. १२,१७० + भत्ता रु. ७,३८०।
        </p>
        <button
          type="submit"
          className="mt-3 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Save
        </button>
      </form>

      <div className="mt-8 overflow-x-auto rounded-xl border border-ink-200 bg-white p-5">
        <p className="mb-3 text-sm font-semibold text-ink-800">
          योगदान दर (संस्करणबद्ध — code बाट, परिवर्तन विरलै)
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-ink-500">
              <th className="pb-2">क्षेत्र</th>
              <th className="pb-2">दर</th>
              <th className="pb-2 text-right">न्यूनतम आधार</th>
            </tr>
          </thead>
          <tbody>
            {pctRows.map((r) => (
              <tr key={r.sector} className="border-b border-ink-50">
                <td className="py-2 font-medium text-ink-800">{r.sector}</td>
                <td className="py-2 text-ink-600">{r.detail}</td>
                <td className="py-2 text-right text-ink-600">रु. {current.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-ink-400">
          योगदान प्रतिशत (३१%, २०.३७% आदि) कानुनी दर हुन् र विरलै फेरिन्छन् —
          परिवर्तन आवश्यक भए chat मार्फत भन्नुहोस्, verified गरेर push गरिन्छ।
        </p>
      </div>
    </div>
  );
}
