import type { ReactNode } from "react";
import { MotionController } from "@/components/motion/MotionController";

interface PageShellProps {
  /**
   * Page-scope class(es) the reference puts on <body> (e.g. "aboutPage").
   * They are applied to a wrapper instead so the root layout can stay shared.
   */
  pageClass?: string;
  children: ReactNode;
}

/** Outermost wrapper of every page: page-scope class plus scroll-driven motion. */
export function PageShell({ pageClass, children }: PageShellProps) {
  return (
    <div className={pageClass ? `pageRoot ${pageClass}` : "pageRoot"}>
      {children}
      <MotionController />
    </div>
  );
}
