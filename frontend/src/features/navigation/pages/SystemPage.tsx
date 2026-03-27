import type { ReactNode } from "react";

interface SystemPageProps {
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  footer?: ReactNode;
}

export function SystemPage({
  eyebrow,
  title,
  description,
  highlights,
  footer,
}: SystemPageProps) {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-300">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
        <p className="max-w-2xl text-base text-slate-300">{description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {highlights.map((highlight) => (
          <article
            key={highlight}
            className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300"
          >
            {highlight}
          </article>
        ))}
      </div>

      {footer ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300">
          {footer}
        </div>
      ) : null}
    </section>
  );
}
