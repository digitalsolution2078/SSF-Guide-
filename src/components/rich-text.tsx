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
        <ul key={key++} className="ml-1 list-inside list-disc space-y-1 text-gray-800">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
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
    if (line.startsWith("- ") || line.startsWith("• ")) {
      bullets.push(line.slice(2));
    } else {
      flush();
      blocks.push(
        <p key={key++} className="leading-relaxed text-gray-800">
          {line}
        </p>,
      );
    }
  }
  flush();

  return <div className="space-y-3">{blocks.map((b, i) => <Fragment key={i}>{b}</Fragment>)}</div>;
}
