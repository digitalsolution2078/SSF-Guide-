"use client";

import { useState } from "react";

export interface PushablePost {
  slug: string;
  title: string;
  excerpt: string;
}

/** Trim to a max length on a word boundary, adding an ellipsis if cut. */
function clamp(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

/**
 * Composer fields for a push notification. A blog-post dropdown auto-fills the
 * title, body and link (all still editable). The inputs keep their `name`
 * attributes so the surrounding server-action <form> receives them unchanged.
 */
export function PushComposer({ posts }: { posts: PushablePost[] }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/blog");
  const [picked, setPicked] = useState("");

  function onPick(slug: string) {
    setPicked(slug);
    if (!slug) return;
    const post = posts.find((p) => p.slug === slug);
    if (!post) return;
    setTitle(clamp(post.title, 80));
    setBody(clamp(post.excerpt, 195));
    setUrl(`/blog/${post.slug}`);
  }

  const inputCls =
    "mt-1 w-full rounded-lg border border-ink-300 px-3 py-2 focus:border-primary-400 focus:outline-none";

  return (
    <div className="space-y-3">
      {posts.length > 0 && (
        <label className="block text-sm font-semibold text-ink-800">
          Blog post छान्नुहोस् (auto-fill)
          <select
            value={picked}
            onChange={(e) => onPick(e.target.value)}
            className={inputCls}
          >
            <option value="">— आफैँ लेख्नुहोस् (manual) —</option>
            {posts.map((p) => (
              <option key={p.slug} value={p.slug}>
                {clamp(p.title, 70)}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs font-normal text-ink-400">
            Post छान्दा तल title, सन्देश र link भरिन्छ — पठाउनुअघि edit गर्न मिल्छ।
          </span>
        </label>
      )}

      <label className="block text-sm font-semibold text-ink-800">
        शीर्षक (Title)
        <input
          name="title"
          required
          maxLength={80}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="जस्तै: SSF योगदान दर अपडेट भयो"
          className={inputCls}
        />
        <span className="mt-1 block text-right text-xs font-normal text-ink-400">
          {title.length}/80
        </span>
      </label>

      <label className="block text-sm font-semibold text-ink-800">
        सन्देश (Body)
        <textarea
          name="body"
          required
          rows={3}
          maxLength={200}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="छोटो सन्देश — notification मा देखिन्छ।"
          className={inputCls}
        />
        <span className="mt-1 block text-right text-xs font-normal text-ink-400">
          {body.length}/200
        </span>
      </label>

      <label className="block text-sm font-semibold text-ink-800">
        Link (क्लिक गर्दा जाने page)
        <input
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="/blog"
          className={inputCls}
        />
      </label>
    </div>
  );
}
