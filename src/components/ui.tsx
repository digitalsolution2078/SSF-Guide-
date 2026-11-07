import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { Icon, type IconName } from "./icons";

/**
 * Shared page primitives so every route reads as one product:
 * PageHero (top of every inner page), SectionHead, Breadcrumbs, LinkCard, Callout.
 */

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
      {items.map((it, i) => (
        <span key={`${it.label}-${i}`} className="inline-flex items-center gap-1.5">
          {i > 0 && <Icon name="chevronRight" size={14} className="text-ink-300" />}
          {it.href ? (
            <Link href={it.href} className="hover:text-primary-700">
              {it.label}
            </Link>
          ) : (
            <span className="text-ink-700">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  icon,
  crumbs,
  tone = "default",
  children,
  width = "page",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  icon?: IconName;
  crumbs?: { label: string; href?: string }[];
  tone?: "default" | "health" | "primary";
  children?: ReactNode;
  width?: "page" | "narrow";
}) {
  const bg =
    tone === "health"
      ? "bg-gradient-to-b from-health-50 to-white"
      : tone === "primary"
        ? "bg-gradient-to-b from-primary-50 to-white"
        : "bg-gradient-to-b from-ink-50 to-white";
  const iconTone =
    tone === "health"
      ? "bg-health-100 text-health-700"
      : "bg-primary-100 text-primary-700";
  return (
    <section className={`border-b border-ink-200 ${bg}`}>
      <div className={`${width === "narrow" ? "container-narrow" : "container-page"} pb-10 pt-8 md:pb-12 md:pt-10`}>
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className={`${crumbs ? "mt-5" : ""} flex items-start gap-4`}>
          {icon && (
            <span className={`hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:flex ${iconTone}`}>
              <Icon name={icon} size={24} />
            </span>
          )}
          <div className="min-w-0">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h1 className={`${eyebrow ? "mt-2" : ""} text-3xl md:text-[2.6rem]`}>{title}</h1>
            {lead && <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-600 md:text-lg">{lead}</p>}
            {children && <div className="mt-6">{children}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  href,
  linkLabel,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  href?: string;
  linkLabel?: string;
  as?: "h2" | "h3";
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="max-w-2xl">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <Tag className={`${eyebrow ? "mt-1.5" : ""} text-2xl md:text-3xl`}>{title}</Tag>
        {lead && <p className="mt-2 text-sm text-ink-500 md:text-base">{lead}</p>}
      </div>
      {href && linkLabel && (
        <Link href={href} className="btn-ghost -mr-2 shrink-0 whitespace-nowrap">
          {linkLabel}
          <Icon name="arrowRight" size={16} />
        </Link>
      )}
    </div>
  );
}

export function LinkCard({
  href,
  title,
  description,
  icon,
  meta,
  badge,
  external,
  tone = "primary",
}: {
  href: string;
  title: string;
  description?: string;
  icon?: IconName;
  meta?: string;
  badge?: string;
  external?: boolean;
  tone?: "primary" | "health";
}) {
  const tile = tone === "health" ? "bg-health-50 text-health-700" : "bg-primary-50 text-primary-700";
  const body = (
    <>
      <div className="flex items-start gap-3.5">
        {icon && (
          <span className={`icon-tile ${tile}`}>
            <Icon name={icon} size={20} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold leading-snug text-ink-900 group-hover:text-primary-700">{title}</p>
            {badge && <span className="badge-action">{badge}</span>}
          </div>
          {description && <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-ink-500">{description}</p>}
          {meta && <p className="mt-2 text-xs text-ink-400">{meta}</p>}
        </div>
        <Icon
          name={external ? "arrowUpRight" : "chevronRight"}
          size={18}
          className="mt-1 shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-primary-600"
        />
      </div>
    </>
  );
  const cls = "card card-hover group block p-5";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {body}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {body}
    </Link>
  );
}

export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warn" | "success" | "health";
  title?: string;
  children: ReactNode;
}) {
  const map = {
    info: { cls: "border-primary-200 bg-primary-50 text-primary-900", icon: "info" as IconName },
    warn: { cls: "border-amber-200 bg-amber-50 text-amber-900", icon: "alert" as IconName },
    success: { cls: "border-emerald-200 bg-emerald-50 text-emerald-900", icon: "checkCircle" as IconName },
    health: { cls: "border-health-200 bg-health-50 text-health-900", icon: "hospital" as IconName },
  }[tone];
  return (
    <div className={`flex gap-3 rounded-2xl border p-4 text-sm leading-relaxed ${map.cls}`}>
      <Icon name={map.icon} size={18} className="mt-0.5 shrink-0" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? "mt-1" : ""}>{children}</div>
      </div>
    </div>
  );
}

export function Stat({
  value,
  label,
  hint,
  tone = "primary",
}: {
  value: string;
  label: string;
  hint?: string;
  tone?: "primary" | "health" | "neutral";
}) {
  const color =
    tone === "health" ? "text-health-700" : tone === "neutral" ? "text-ink-900" : "text-primary-700";
  return (
    <div className="card p-5">
      <p className={`font-display text-3xl font-bold tracking-tight ${color}`}>{value}</p>
      <p className="mt-1 text-sm font-medium text-ink-700">{label}</p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}
