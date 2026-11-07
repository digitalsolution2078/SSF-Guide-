import type { Metadata } from "next";
import { searchContent } from "@/lib/search";
import { Icon, type IconName } from "@/components/icons";
import { PageHero } from "@/components/ui";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

const TYPE_ICONS: Record<string, IconName> = {
  article: "book",
  faq: "help",
  checklist: "list",
  video: "eye",
  calculator: "calculator",
  hospital: "hospital",
};

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  const { q = "" } = await searchParams;
  const results = q ? searchContent(q) : [];

  return (
    <div>
      <PageHero
        icon="search"
        title={isEn ? "Search" : "खोज्नुहोस्"}
        width="narrow"
      >
        <form action="" method="get" className="flex gap-2">
          <label className="relative flex-1">
            <span className="sr-only">{isEn ? "Search" : "खोज्नुहोस्"}</span>
            <Icon name="search" size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder={
                isEn
                  ? "Type an SSF question or keyword…"
                  : "SSF सम्बन्धी प्रश्न वा Keyword लेख्नुहोस्…"
              }
              className="input py-3 pl-12 text-base"
            />
          </label>
          <button type="submit" className="btn-primary shrink-0">
            {isEn ? "Search" : "खोज्नुहोस्"}
          </button>
        </form>
      </PageHero>

      <div className="container-narrow py-10 md:py-12">
        {q && results.length > 0 && (
          <>
            <ul className="space-y-3">
              {results.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="card card-hover group flex items-start gap-3.5 p-4">
                    <span className="icon-tile">
                      <Icon name={TYPE_ICONS[r.type] ?? "book"} size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold leading-snug text-ink-900 group-hover:text-primary-700">{r.title}</span>
                      {r.snippet && (
                        <span className="mt-1 block text-sm leading-relaxed text-ink-500">{r.snippet}</span>
                      )}
                    </span>
                    <Icon
                      name="chevronRight"
                      size={18}
                      className="mt-1 shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-primary-600"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {q && results.length === 0 && (
          <div className="surface p-6 text-center md:p-8">
            <span className="icon-tile mx-auto">
              <Icon name="search" size={20} />
            </span>
            <p className="mt-4 text-ink-700">
              {isEn
                ? "We couldn't find a clear answer to your question. Ask the SSF AI or get help from Digital Solution."
                : "तपाईंको प्रश्नको स्पष्ट उत्तर भेटिएन। SSF AI लाई सोध्नुहोस् वा Digital Solution बाट सहायता लिनुहोस्।"}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Link href="/ask" className="btn-primary">
                {isEn ? "Ask the SSF AI" : "SSF AI लाई सोध्नुहोस्"}
              </Link>
              <Link href="/request" className="btn-accent">
                {isEn ? "Get help" : "सहायता लिनुहोस्"}
              </Link>
            </div>
          </div>
        )}

        {!q && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-ink-500">
            <span className="mr-1">{isEn ? "Popular searches:" : "लोकप्रिय खोज:"}</span>
            <SearchChip q="KYC" />
            <SearchChip q="pension" />
            <SearchChip q={isEn ? "foreign" : "विदेश"} />
            <SearchChip q="31%" />
            <SearchChip q={isEn ? "left my job" : "जागिर छाडेँ"} />
          </div>
        )}
      </div>
    </div>
  );
}

function SearchChip({ q }: { q: string }) {
  return (
    <Link href={`/search?q=${encodeURIComponent(q)}`} className="chip">
      {q}
    </Link>
  );
}
