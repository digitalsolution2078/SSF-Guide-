import { Fragment } from "react";

/** Minimal rich-text renderer for admin-authored plain text.
 *  Blank line = new paragraph; lines starting with "- " group into a bullet list. */
export function RichText({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];
  let key = 0;

  const flush = () => {
    if (bullets.length) {
      blocks.push(
        <ul key={key++} className="prose-ssf list-disc space-y-2 pl-6 marker:text-primary-500">
          {bullets.map((b, i) => (
            <li key={i} className="pl-1">
              {b}
            </li>
          ))}
        </ul>,
      );
      bullets = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    if (line.startsWith("### ")) {
      flush();
      blocks.push(
        <h3 key={key++} className="mt-6 text-lg">
          {line.slice(4)}
        </h3>,
      );
    } else if (line.startsWith("## ")) {
      flush();
      blocks.push(
        <h2 key={key++} className="mt-8 text-xl md:text-2xl">
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      bullets.push(line.slice(2));
    } else {
      flush();
      blocks.push(
        <p key={key++} className="prose-ssf">
          {line}
        </p>,
      );
    }
  }
  flush();

  return <div className="space-y-4">{blocks.map((b, i) => <Fragment key={i}>{b}</Fragment>)}</div>;
}
