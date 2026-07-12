import type { LegalDoc } from "@/content/legal";
import { Fragment } from "react";

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
          className="break-all text-primary-700 underline"
        >
          {part.replace(/^https?:\/\//, "")}
        </a>
      );
    }
    if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part)) {
      return (
        <a key={i} href={`mailto:${part}`} className="text-primary-700 underline">
          {part}
        </a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function LegalDocPage({ doc, locale }: { doc: LegalDoc; locale?: string }) {
  const useEn = locale === "en" && Boolean(doc.bodyEn);
  const lines = (useEn && doc.bodyEn ? doc.bodyEn : doc.body).split("\n");
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];
  let key = 0;

  const flushBullets = () => {
    if (bullets.length > 0) {
      blocks.push(
        <ul key={key++} className="list-inside list-disc space-y-1.5 text-gray-700">
          {bullets.map((b, i) => (
            <li key={i}>{linkify(b)}</li>
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
        <h2 key={key++} className="mt-8 text-xl font-bold text-primary-900">
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("- ")) {
      bullets.push(line.slice(2));
    } else {
      flushBullets();
      blocks.push(
        <p key={key++} className="leading-relaxed text-gray-700">
          {linkify(line)}
        </p>,
      );
    }
  }
  flushBullets();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        {useEn && doc.titleEn ? doc.titleEn : doc.title}
      </h1>
      <p className="mt-2 text-sm text-gray-400">
        {useEn
          ? `Last updated: ${doc.lastUpdatedEn ?? doc.lastUpdated}`
          : `अन्तिम अद्यावधिक: ${doc.lastUpdated}`}
      </p>
      <div className="mt-4 space-y-4">{blocks}</div>
    </article>
  );
}
