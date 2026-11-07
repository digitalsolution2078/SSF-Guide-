import type { LegalDoc } from "@/content/legal";
import { Fragment } from "react";
import { PageHero } from "./ui";

/** Auto-link URLs and email addresses inside a text line. */
function linkify(text: string): React.ReactNode[] {
  const pattern = /(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)/g;
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-primary-700 underline decoration-primary-300 underline-offset-2 hover:decoration-primary-600"
        >
          {part.replace(/^https?:\/\//, "")}
        </a>
      );
    }
    if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part)) {
      return (
        <a
          key={i}
          href={`mailto:${part}`}
          className="text-primary-700 underline decoration-primary-300 underline-offset-2 hover:decoration-primary-600"
        >
          {part}
        </a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/**
 * Renders a legal/info doc (title + "## " headings + bullets + paragraphs).
 * `embedded` — when the doc sits below other page content (e.g. /contact, /about),
 * the title is rendered as an in-page h2 (with optional `eyebrow`) instead of a PageHero;
 * `hideTitle` drops it entirely when the page already shows the title in its hero.
 */
export function LegalDocPage({
  doc,
  locale,
  embedded = false,
  hideTitle = false,
  eyebrow,
}: {
  doc: LegalDoc;
  locale?: string;
  embedded?: boolean;
  hideTitle?: boolean;
  eyebrow?: string;
}) {
  const useEn = locale === "en" && Boolean(doc.bodyEn);
  const lines = (useEn && doc.bodyEn ? doc.bodyEn : doc.body).split("\n");
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];
  let key = 0;

  const flushBullets = () => {
    if (bullets.length > 0) {
      blocks.push(
        <ul key={key++} className="list-disc space-y-1.5 pl-6 marker:text-primary-500">
          {bullets.map((b, i) => (
            <li key={i} className="pl-1">{linkify(b)}</li>
          ))}
        </ul>,
      );
      bullets = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("## ")) {
      flushBullets();
      blocks.push(
        <h2 key={key++} className="mt-8 text-xl md:text-2xl">
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("- ")) {
      bullets.push(line.slice(2));
    } else {
      flushBullets();
      blocks.push(<p key={key++}>{linkify(line)}</p>);
    }
  }
  flushBullets();

  const title = useEn && doc.titleEn ? doc.titleEn : doc.title;
  const updated = useEn
    ? `Last updated: ${doc.lastUpdatedEn ?? doc.lastUpdated}`
    : `अन्तिम अद्यावधिक: ${doc.lastUpdated}`;

  if (embedded) {
    return (
      <article className="container-narrow py-12">
        {!hideTitle && (
          <>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h2 className={`${eyebrow ? "mt-1.5" : ""} text-2xl md:text-3xl`}>{title}</h2>
          </>
        )}
        <div className={`prose-ssf ${hideTitle ? "" : "mt-6"} space-y-4`}>{blocks}</div>
        <p className="mt-10 border-t border-ink-200 pt-4 text-xs text-ink-400">{updated}</p>
      </article>
    );
  }

  return (
    <div>
      <PageHero
        width="narrow"
        icon="file"
        title={title}
        crumbs={[{ label: locale === "en" ? "Home" : "गृहपृष्ठ", href: "/" }, { label: title }]}
      />
      <article className="container-narrow py-12">
        <div className="prose-ssf space-y-4">{blocks}</div>
        <p className="mt-10 border-t border-ink-200 pt-4 text-xs text-ink-400">{updated}</p>
      </article>
    </div>
  );
}
