"use client";

import type { NavKey } from "@/lib/content/navigation";
import { SiteNav } from "./SiteNav";
import { useHeaderHidden } from "./useScrollState";

interface SiteHeaderProps {
  active: NavKey | null;
  isCurrentPage?: boolean;
}

/** Fixed header used on every page except the homepage, where the nav lives inside the hero. */
export function SiteHeader({ active, isCurrentPage }: SiteHeaderProps) {
  const hidden = useHeaderHidden();

  return (
    <header className={hidden ? "siteHeader unifiedHeader header-hidden" : "siteHeader unifiedHeader"}>
      <SiteNav active={active} isCurrentPage={isCurrentPage} />
    </header>
  );
}
