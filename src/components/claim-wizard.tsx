"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  claimTypes,
  claimByKey,
  evaluateClaim,
  WHERE_LABEL,
  WHERE_HINT,
  type ClaimKey,
  type ClaimType,
  type ClaimVerdict,
} from "@/content/claims";
import { articleBySlug } from "@/content/articles";
import { videoById } from "@/content/videos";
import { toNe } from "@/content/ssf-stats";
import { trackEvent } from "@/lib/analytics";
import { waContext } from "@/lib/whatsapp";
import { effectiveMonths, useSsfProfile } from "@/lib/profile";
import { Icon } from "./icons";
import { Callout } from "./ui";
import { YouTubeEmbed } from "./youtube-embed";

/**
 * Claim Wizard — "के भयो?" → quick eligibility questions → result with
 * verdict, limits, where to go, steps, tickable document checklist (persisted
 * per claim type in localStorage), official forms, guide + videos and CTAs.
 * Rules come from src/content/claims.ts (verified-facts §3).
 */

const VERDICT_STYLE: Record<ClaimVerdict, { ne: string; en: string; tone: "success" | "warn" | "info" }> = {
  LIKELY: { ne: "सम्भावित योग्य", en: "Likely eligible", tone: "success" },
  CONDITIONS: { ne: "शर्तसहित", en: "With conditions", tone: "warn" },
  NOT_YET: { ne: "अहिले योग्यता देखिँदैन", en: "Not eligible yet", tone: "info" },
};

function storageKey(key: ClaimKey) {
  return `claim-check:${key}`;
}

export function ClaimWizard({ initialType }: { initialType?: string }) {
  const locale = useLocale();
  const isEn = locale === "en";
  const T = (b: { ne: string; en: string }) => (isEn ? b.en : b.ne);
  const n = (s: string | number) => (isEn ? String(s) : toNe(String(s)));
  const { profile, ready } = useSsfProfile();

  const [typeKey, setTypeKey] = useState<ClaimKey | undefined>(() =>
    initialType && claimByKey(initialType) ? (initialType as ClaimKey) : undefined,
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [ticked, setTicked] = useState<Record<number, boolean>>({});

  const claim = typeKey ? claimByKey(typeKey) : undefined;
  const step = !claim ? 1 : showResult ? 3 : 2;

  useEffect(() => {
    trackEvent("claim_wizard", { type: typeKey ?? "none", step });
  }, [typeKey, step]);

  // Prefill from "My SSF" profile (months contributed / age) once per claim type.
  useEffect(() => {
    if (!claim || !ready) return;
    const months = effectiveMonths(profile);
    const pre: Record<string, string> = {};
    for (const q of claim.questions) {
      if (q.prefill === "months3" && months !== undefined && months >= 3) pre[q.id] = "yes";
      if (q.prefill === "months180" && months !== undefined) pre[q.id] = months >= 180 ? "yes" : "no";
      if (q.prefill === "age60" && profile.age) pre[q.id] = profile.age >= 60 ? "gte60" : "lt60";
    }
    if (Object.keys(pre).length) setAnswers((a) => ({ ...pre, ...a }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claim?.key, ready]);

  // Load persisted document ticks for this claim type.
  useEffect(() => {
    if (!claim) return;
    try {
      const saved = localStorage.getItem(storageKey(claim.key));
      setTicked(saved ? JSON.parse(saved) : {});
    } catch {
      setTicked({});
    }
  }, [claim]);

  function pick(key: ClaimKey) {
    setTypeKey(key);
    setAnswers({});
    setShowResult(false);
  }

  function reset() {
    setTypeKey(undefined);
    setAnswers({});
    setShowResult(false);
  }

  function toggleDoc(i: number) {
    if (!claim) return;
    const next = { ...ticked, [i]: !ticked[i] };
    setTicked(next);
    try {
      localStorage.setItem(storageKey(claim.key), JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  const ready2 = claim ? claim.questions.every((q) => answers[q.id]) : false;
  const result = useMemo(() => (claim && showResult ? evaluateClaim(claim.key, answers) : null), [claim, showResult, answers]);
  const profileMonths = effectiveMonths(profile);

  const optionBtn = (active: boolean) =>
    `card card-hover p-3.5 text-left text-sm text-ink-800 ${active ? "border-primary-600 bg-primary-50 font-semibold text-primary-900" : ""}`;

  /* ───────────── progress header ───────────── */
  const header = (
    <div className="flex items-center justify-between gap-4 print:hidden">
      <ol className="flex items-center gap-2 text-xs font-semibold" aria-label="steps">
        {[1, 2, 3].map((s) => (
          <li key={s} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full font-display ${
                s < step ? "bg-primary-600 text-white" : s === step ? "bg-primary-100 text-primary-700 ring-2 ring-primary-600" : "bg-ink-100 text-ink-400"
              }`}
            >
              {s < step ? <Icon name="check" size={12} /> : n(s)}
            </span>
            <span className={`hidden sm:inline ${s === step ? "text-ink-900" : "text-ink-400"}`}>
              {s === 1 ? (isEn ? "What happened?" : "के भयो?") : s === 2 ? (isEn ? "Quick check" : "छिटो जाँच") : isEn ? "Your plan" : "तपाईंको योजना"}
            </span>
            {s < 3 && <Icon name="chevronRight" size={12} className="text-ink-300" />}
          </li>
        ))}
      </ol>
      {claim && (
        <button type="button" onClick={reset} className="btn-ghost btn-sm -mr-2">
          <Icon name="refresh" size={14} />
          {isEn ? "Start over" : "फेरि सुरु"}
        </button>
      )}
    </div>
  );

  /* ───────────── step 1: pick a claim ───────────── */
  if (!claim) {
    return (
      <div className="card p-5 md:p-6">
        {header}
        <p className="mt-5 font-display text-xl font-semibold text-ink-900">{isEn ? "What happened?" : "के भयो?"}</p>
        <p className="mt-1 text-sm text-ink-500">
          {isEn ? "Pick the situation — we'll check eligibility and build your claim plan." : "अवस्था रोज्नुहोस् — हामी योग्यता जाँचेर तपाईंको दाबी योजना बनाइदिन्छौँ।"}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {claimTypes.map((c) => (
            <button key={c.key} type="button" onClick={() => pick(c.key)} className="card card-hover group flex items-center gap-3.5 p-4 text-left">
              <span className="icon-tile">
                <Icon name={c.icon} size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold leading-snug text-ink-900 group-hover:text-primary-700">{isEn ? c.nameEn : c.nameNe}</span>
                <span className="mt-0.5 block text-xs text-ink-500">
                  {c.who === "family" ? (isEn ? "Claimed by family" : "परिवारले दाबी गर्ने") : c.who === "both" ? (isEn ? "Contributor or family" : "योगदानकर्ता वा परिवार") : isEn ? "Claimed by contributor" : "योगदानकर्ताले दाबी गर्ने"}
                </span>
              </span>
              <Icon name="chevronRight" size={16} className="shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-primary-600" />
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-ink-400">
          {isEn ? "Loans are not claims — see " : "सापटी दाबी होइन — हेर्नुहोस् "}
          <Link href="/loans" className="underline hover:text-primary-700">
            {isEn ? "SSF loans" : "SSF सापटी"}
          </Link>
          .
        </p>
      </div>
    );
  }

  /* ───────────── step 2: questions ───────────── */
  if (!result) {
    return (
      <div className="card p-5 md:p-6">
        {header}
        <div className="mt-5 flex items-center gap-3">
          <span className="icon-tile">
            <Icon name={claim.icon} size={20} />
          </span>
          <div>
            <p className="font-display text-xl font-semibold text-ink-900">{isEn ? claim.nameEn : claim.nameNe}</p>
            <p className="text-xs text-ink-500">{isEn ? claim.qualifyingEn : claim.qualifyingNe}</p>
          </div>
        </div>
        {ready && profileMonths !== undefined && claim.questions.some((q) => q.prefill) && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-500">
            <Icon name="user" size={12} />
            {isEn ? `Prefilled from My SSF: ${profileMonths} months contributed` : `My SSF बाट भरिएको: ${n(profileMonths)} महिना योगदान`}
            {profile.age ? (isEn ? `, age ${profile.age}` : `, उमेर ${n(profile.age)}`) : ""}
          </p>
        )}
        {claim.questions.map((q) => (
          <div key={q.id}>
            <p className="mt-6 font-semibold text-ink-900">{T(q)}</p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {q.options.map((o) => (
                <button key={o.value} type="button" onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.value }))} className={optionBtn(answers[q.id] === o.value)}>
                  {T(o)}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button type="button" disabled={!ready2} onClick={() => setShowResult(true)} className="btn-primary btn-lg mt-7 w-full">
          {isEn ? "See my claim plan" : "मेरो दाबी योजना हेर्नुहोस्"}
          <Icon name="arrowRight" size={18} />
        </button>
      </div>
    );
  }

  /* ───────────── step 3: result ───────────── */
  return <ClaimResultView claim={claim} result={result} ticked={ticked} onToggle={toggleDoc} onBack={() => setShowResult(false)} header={header} isEn={isEn} />;
}

function ClaimResultView({
  claim,
  result,
  ticked,
  onToggle,
  onBack,
  header,
  isEn,
}: {
  claim: ClaimType;
  result: ReturnType<typeof evaluateClaim>;
  ticked: Record<number, boolean>;
  onToggle: (i: number) => void;
  onBack: () => void;
  header: ReactNode;
  isEn: boolean;
}) {
  const T = (b: { ne: string; en: string }) => (isEn ? b.en : b.ne);
  const n = (s: string | number) => (isEn ? String(s) : toNe(String(s)));
  const style = VERDICT_STYLE[result.verdict];
  const name = isEn ? claim.nameEn : claim.nameNe;
  const article = articleBySlug(claim.relatedArticleSlug);
  const videos = claim.videoIds.map((id) => videoById(id)).filter((v): v is NonNullable<typeof v> => Boolean(v));
  const done = claim.documents.filter((_, i) => ticked[i]).length;
  const pct = claim.documents.length ? (done / claim.documents.length) * 100 : 0;

  const waHref = waContext(
    isEn ? `${claim.nameEn} claim` : `${claim.nameNe} दाबी`,
    [
      isEn ? `Result: ${style.en}` : `नतिजा: ${style.ne}`,
      isEn ? `Where: ${claim.where.map((w) => WHERE_LABEL[w].en).join(" / ")}` : `कहाँ: ${claim.where.map((w) => WHERE_LABEL[w].ne).join(" / ")}`,
      isEn ? `Documents ready: ${done}/${claim.documents.length}` : `कागजात तयार: ${toNe(String(done))}/${toNe(String(claim.documents.length))}`,
    ],
    isEn,
  );

  return (
    <div className="card p-5 md:p-6 print:border-0 print:p-0">
      {header}

      {/* print-only title */}
      <div className="hidden print:block">
        <p className="text-xs uppercase tracking-wide text-ink-500">SSF Guide Nepal · Digital Solution — {isEn ? "Claim plan" : "दाबी योजना"}</p>
        <h2 className="mt-1 text-2xl">{name}</h2>
      </div>

      <div className="mt-5 print:hidden">
        <Callout tone={style.tone} title={isEn ? style.en : style.ne}>
          <span className="font-display text-lg font-semibold">{T(result.title)}</span>
          <ul className="mt-2 space-y-1.5">
            {result.reasons.map((r) => (
              <li key={r.ne} className="flex gap-2">
                <Icon name="check" size={14} className="mt-1 shrink-0" />
                <span>{T(r)}</span>
              </li>
            ))}
          </ul>
        </Callout>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* What you get */}
        <section>
          <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <Icon name="coins" size={16} className="text-primary-600" />
            {isEn ? "What you get" : "के पाइन्छ"}
          </p>
          <ul className="mt-3 space-y-2">
            {claim.limits.map((l) => (
              <li key={l.ne} className="flex gap-2 text-sm text-ink-700">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                {T(l)}
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-ink-900">
            <Icon name="users" size={16} className="text-primary-600" />
            {isEn ? "Who can claim" : "कसले दाबी गर्ने"}
          </p>
          <p className="mt-1.5 text-sm text-ink-700">{isEn ? claim.whoEn : claim.whoNe}</p>
          <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-ink-900">
            <Icon name="shield" size={16} className="text-primary-600" />
            {isEn ? "Qualifying period" : "योग्यता अवधि"}
          </p>
          <p className="mt-1.5 text-sm text-ink-700">{isEn ? claim.qualifyingEn : claim.qualifyingNe}</p>
        </section>

        {/* Where to go */}
        <section>
          <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <Icon name="mapPin" size={16} className="text-primary-600" />
            {isEn ? "Exactly where to go" : "ठ्याक्कै कहाँ जाने"}
          </p>
          <ol className="mt-3 space-y-2">
            {claim.where.map((w, i) => (
              <li key={w} className={`rounded-xl border p-3 text-sm ${i === 0 ? "border-primary-300 bg-primary-50" : "border-ink-200 bg-white"}`}>
                <p className="font-semibold text-ink-900">
                  {i === 0 && <span className="badge-primary mr-2">{isEn ? "First" : "पहिलो"}</span>}
                  {T(WHERE_LABEL[w])}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-600">{T(WHERE_HINT[w])}</p>
              </li>
            ))}
          </ol>
          {claim.whereNote && (
            <p className="mt-2 flex gap-2 text-xs text-ink-600">
              <Icon name="info" size={14} className="mt-0.5 shrink-0 text-primary-500" />
              {T(claim.whereNote)}
            </p>
          )}
          {claim.where.includes("hospital-desk") && (
            <Link href="/hospitals" className="btn-outline btn-sm mt-3 print:hidden">
              <Icon name="hospital" size={14} />
              {isEn ? "Find an affiliated hospital" : "आबद्ध अस्पताल खोज्नुहोस्"}
            </Link>
          )}
        </section>
      </div>

      {/* Steps */}
      <section className="mt-8">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
          <Icon name="list" size={16} className="text-primary-600" />
          {isEn ? "Step by step" : "चरणबद्ध प्रक्रिया"}
        </p>
        <ol className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
          {claim.steps.map((s, i) => (
            <li key={s.ne} className="flex gap-3 rounded-xl border border-ink-200 bg-white p-3 text-sm text-ink-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 font-display text-xs font-bold text-primary-700">{n(i + 1)}</span>
              {T(s)}
            </li>
          ))}
        </ol>
      </section>

      {/* Caveats */}
      <section className="mt-6">
        <Callout tone="warn" title={isEn ? "Deadlines & traps" : "म्याद र सावधानी"}>
          <ul className="space-y-1.5">
            {claim.caveats.map((c) => (
              <li key={c.ne} className="flex gap-2">
                <Icon name="alert" size={14} className="mt-1 shrink-0" />
                <span>{T(c)}</span>
              </li>
            ))}
          </ul>
        </Callout>
      </section>

      {/* Document checklist */}
      <section className="mt-8 rounded-2xl border border-ink-200 p-4 md:p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
              <Icon name="file" size={16} className="text-primary-600" />
              {isEn ? "Document checklist" : "कागजात checklist"}
              <span className="badge-neutral">
                {n(done)}/{n(claim.documents.length)} {isEn ? "ready" : "तयार"}
              </span>
            </p>
            <div className="mt-2 h-1.5 w-full max-w-xs rounded-full bg-ink-100 print:hidden">
              <div className="h-1.5 rounded-full bg-primary-600 transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <button type="button" onClick={() => window.print()} className="btn-outline btn-sm shrink-0 print:hidden">
            <Icon name="file" size={14} />
            {isEn ? "Print checklist" : "Checklist print"}
          </button>
        </div>
        <ul className="mt-4 divide-y divide-ink-100">
          {claim.documents.map((d, i) => (
            <li key={d.ne} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
              <input
                id={`doc-${claim.key}-${i}`}
                type="checkbox"
                checked={Boolean(ticked[i])}
                onChange={() => onToggle(i)}
                className="mt-0.5 h-5 w-5 shrink-0 rounded border-ink-300 accent-primary-600"
              />
              <label htmlFor={`doc-${claim.key}-${i}`} className={`cursor-pointer text-sm leading-relaxed ${ticked[i] ? "text-ink-400 line-through print:text-ink-800 print:no-underline" : "text-ink-800"}`}>
                {T(d)}
                {d.conditional && <span className="mt-0.5 block text-xs text-ink-500">{(isEn ? d.noteEn : d.noteNe) ?? (isEn ? "conditional" : "सशर्त")}</span>}
              </label>
            </li>
          ))}
        </ul>
        {claim.relatedChecklistSlug && (
          <Link href={`/checklists/${claim.relatedChecklistSlug}`} className="btn-ghost btn-sm -ml-2 mt-3 print:hidden">
            {isEn ? "Full checklist page" : "पूरा checklist पृष्ठ"}
            <Icon name="arrowRight" size={14} />
          </Link>
        )}
      </section>

      {/* Official forms */}
      {claim.formUrls.length > 0 && (
        <section className="mt-6">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <Icon name="download" size={16} className="text-primary-600" />
            {isEn ? "Official forms (ssf.gov.np)" : "आधिकारिक फारम (ssf.gov.np)"}
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
            {claim.formUrls.map((f) => (
              <li key={f.url}>
                <a href={f.url} target="_blank" rel="noopener noreferrer" className="card card-hover group flex items-center gap-3 p-3">
                  <span className="icon-tile h-9 w-9">
                    <Icon name="file" size={16} />
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium text-ink-900 group-hover:text-primary-700">{isEn ? f.titleEn : f.title}</span>
                  <Icon name="arrowUpRight" size={16} className="shrink-0 text-ink-300" />
                </a>
                <span className="hidden break-all text-[10px] text-ink-500 print:block">{f.url}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Guide + videos */}
      <section className="mt-6 print:hidden">
        {article && (
          <Link href={`/school/${article.categorySlug}/${article.slug}`} className="card card-hover group flex items-center gap-3.5 p-4">
            <span className="icon-tile">
              <Icon name="book" size={20} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-ink-500">{isEn ? "Related guide" : "सम्बन्धित guide"}</span>
              <span className="block text-sm font-semibold text-ink-900 group-hover:text-primary-700">{isEn && article.en ? article.en.title : article.title}</span>
            </span>
            <Icon name="arrowRight" size={16} className="text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-primary-600" />
          </Link>
        )}
        {videos.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {videos.map((v) => (
              <YouTubeEmbed key={v.youtubeId} id={v.youtubeId} title={v.title} />
            ))}
          </div>
        )}
      </section>

      {/* CTAs */}
      <div className="mt-8 flex flex-wrap gap-2 print:hidden">
        <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("cta_click", { cta: "whatsapp", location: "claim_wizard" })} className="btn-accent">
          <Icon name="chat" size={16} />
          {isEn ? "Ask on WhatsApp" : "WhatsApp मा सोध्नुहोस्"}
        </a>
        <Link href="/request" onClick={() => trackEvent("cta_click", { cta: "request", location: "claim_wizard" })} className="btn-primary">
          <Icon name="send" size={16} />
          {isEn ? "Request claim assistance" : "दाबी सहायता अनुरोध"}
        </Link>
        <button type="button" onClick={onBack} className="btn-ghost">
          <Icon name="refresh" size={14} />
          {isEn ? "Change answers" : "उत्तर बदल्नुहोस्"}
        </button>
      </div>

      <p className="mt-5 flex gap-2 text-xs text-ink-500">
        <Icon name="alert" size={14} className="mt-0.5 shrink-0" />
        <span>
          {isEn
            ? "Preliminary educational check — final eligibility and amounts follow SSF's rules and your actual records. Digital Solution is an independent service, not the Fund. (Source: Scheme Operation Procedure 2075, 5th amendment)"
            : "प्रारम्भिक शैक्षिक जाँच — अन्तिम योग्यता र रकम SSF को नियम र तपाईंको वास्तविक अभिलेखअनुसार हुन्छ। Digital Solution स्वतन्त्र सेवा हो, कोष होइन। (स्रोत: योजना सञ्चालन कार्यविधि २०७५, ५औँ संशोधन)"}
        </span>
      </p>
    </div>
  );
}
