import type { ReactNode } from "react";

interface PageShellProps {
  /**
   * Page-scope class(es) the reference puts on <body> (e.g. "aboutPage").
   * They are applied to a wrapper instead so the root layout can stay shared.
   */
  pageClass?: string;
  children: ReactNode;
}

export function PageShell({ pageClass, children }: PageShellProps) {
  return <div className={pageClass ? `pageRoot ${pageClass}` : "pageRoot"}>{children}</div>;
}
