import type { ContentBlock } from "@/content/types";

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className="leading-relaxed text-gray-800">
                {block.text}
              </p>
            );
          case "list":
            return (
              <ul key={i} className="list-inside list-disc space-y-1.5 text-gray-800">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case "steps":
            return (
              <ol key={i} className="list-inside list-decimal space-y-1.5 text-gray-800">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={i} className="overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-primary-50">
                      {block.headers.map((h, j) => (
                        <th
                          key={j}
                          className="border border-primary-100 px-3 py-2 text-left font-semibold text-primary-900"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j} className="even:bg-gray-50">
                        {row.map((cell, k) => (
                          <td
                            key={k}
                            className="border border-primary-100 px-3 py-2 text-gray-800"
                          >
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
              <p
                key={i}
                className="rounded-lg border-l-4 border-action-500 bg-action-50 px-4 py-3 text-sm text-gray-800"
              >
                💡 {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
