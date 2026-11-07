import type { ContentBlock } from "@/content/types";
import { Icon } from "./icons";

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className="prose-ssf">
                {block.text}
              </p>
            );
          case "list":
            return (
              <ul key={i} className="prose-ssf list-disc space-y-2 pl-6 marker:text-primary-500">
                {block.items.map((item, j) => (
                  <li key={j} className="pl-1">
                    {item}
                  </li>
                ))}
              </ul>
            );
          case "steps":
            return (
              <ol key={i} className="prose-ssf space-y-3 [counter-reset:step]">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="relative pl-11 [counter-increment:step] before:absolute before:left-0 before:top-0.5 before:flex before:h-7 before:w-7 before:items-center before:justify-center before:rounded-full before:bg-primary-50 before:font-display before:text-sm before:font-bold before:text-primary-700 before:content-[counter(step)]"
                  >
                    {item}
                  </li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={i} className="overflow-x-auto rounded-2xl border border-ink-200">
                <table className="w-full min-w-[480px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-ink-50 text-ink-700">
                      {block.headers.map((h, j) => (
                        <th
                          key={j}
                          className="border-b border-ink-200 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j} className="border-b border-ink-100 last:border-b-0">
                        {row.map((cell, k) => (
                          <td key={k} className="px-4 py-2.5 align-top text-ink-800">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "note":
            return (
              <div
                key={i}
                className="flex gap-3 rounded-r-2xl border-l-4 border-action-500 bg-action-50 px-4 py-3.5 text-sm leading-relaxed text-ink-800"
              >
                <Icon name="info" size={18} className="mt-0.5 shrink-0 text-action-600" />
                <p>{block.text}</p>
              </div>
            );
        }
      })}
    </div>
  );
}
