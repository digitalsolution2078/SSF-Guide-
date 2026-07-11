import type { Metadata } from "next";
import { searchContent } from "@/lib/search";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

const TYPE_ICONS: Record<string, string> = {
  article: "📖",
  faq: "❓",
  checklist: "📋",
  video: "📺",
  calculator: "🧮",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q ? searchContent(q) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900">🔍 खोज्नुहोस्</h1>

      <form action="" method="get" className="mt-6 flex gap-3">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="SSF सम्बन्धी प्रश्न वा Keyword लेख्नुहोस्…"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-6 py-2.5 font-semibold text-white hover:bg-primary-700"
        >
          खोज्नुहोस्
        </button>
      </form>

      {q && results.length > 0 && (
        <ul className="mt-8 space-y-3">
          {results.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="block rounded-xl border border-primary-100 bg-white p-4 shadow-sm hover:border-primary-400"
              >
                <p className="font-semibold text-primary-900">
                  {TYPE_ICONS[r.type]} {r.title}
                </p>
                {r.snippet && (
                  <p className="mt-1 text-sm text-gray-600">{r.snippet}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {q && results.length === 0 && (
        <div className="mt-8 rounded-xl bg-primary-50 p-6 text-center">
          <p className="text-gray-700">
            तपाईंको प्रश्नको स्पष्ट उत्तर भेटिएन। SSF AI लाई सोध्नुहोस् वा Digital
            Solution बाट सहायता लिनुहोस्।
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/ask"
              className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
            >
              SSF AI लाई सोध्नुहोस्
            </Link>
            <Link
              href="/request"
              className="rounded-lg bg-action-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-action-600"
            >
              सहायता लिनुहोस्
            </Link>
          </div>
        </div>
      )}

      {!q && (
        <p className="mt-8 text-sm text-gray-500">
          लोकप्रिय खोज: <SearchChip q="KYC" /> <SearchChip q="pension" />{" "}
          <SearchChip q="विदेश" /> <SearchChip q="31%" />{" "}
          <SearchChip q="जागिर छाडेँ" />
        </p>
      )}
    </div>
  );
}

function SearchChip({ q }: { q: string }) {
  return (
    <Link
      href={`/search?q=${encodeURIComponent(q)}`}
      className="mr-1 inline-block rounded-full border border-primary-200 px-3 py-1 text-xs text-primary-700 hover:bg-primary-50"
    >
      {q}
    </Link>
  );
}
