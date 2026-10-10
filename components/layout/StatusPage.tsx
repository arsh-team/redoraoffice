import type { ReactNode } from "react";
import { PageShell } from "./PageShell";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

interface StatusPageProps {
  eyebrow: string;
  title: string;
  description: string;
  /** Buttons or links offered to the visitor. */
  children: ReactNode;
}

/**
 * Full-page message used for "not found" and unexpected errors.
 * The reference has no such pages (its 404 is an empty response), so this one
 * is composed from the site's own header, footer, eyebrow and button styles.
 */
export function StatusPage({ eyebrow, title, description, children }: StatusPageProps) {
  return (
    <PageShell pageClass="innerPage">
      <SiteHeader active={null} />
      <main id="main-content">
        <section className="wrap flex min-h-[72vh] flex-col items-start justify-center pt-40 pb-24">
          <span className="eyebrow dark">{eyebrow}</span>
          <h1 className="m-0 mb-4 text-[clamp(34px,6vw,64px)] leading-[1.3] font-extrabold text-redora-ink">
            {title}
          </h1>
          <p className="m-0 max-w-xl text-base leading-loose text-redora-muted">{description}</p>
          <div className="actions">{children}</div>
        </section>
      </main>
      <SiteFooter variant="contact" />
    </PageShell>
  );
}
