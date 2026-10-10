"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { logo } from "@/lib/content/images";
import { headerCta, mainNav, type NavKey } from "@/lib/content/navigation";
import { useScrolled } from "./useScrollState";

interface SiteNavProps {
  /** Section to highlight in the menu; null on pages outside the main sections (404, errors). */
  active: NavKey | null;
  /** False on child pages (e.g. a case study), where the section is highlighted but is not the current page. */
  isCurrentPage?: boolean;
}

/** Primary navigation bar plus the slide-down mobile menu. */
export function SiteNav({ active, isCurrentPage = true }: SiteNavProps) {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButton.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const links = (onNavigate?: () => void) =>
    mainNav.map((item) => {
      const isActive = item.key === active;
      return (
        <Link
          key={item.key}
          href={item.href}
          className={isActive ? "activeLink" : undefined}
          aria-current={isActive && isCurrentPage ? "page" : undefined}
          onClick={onNavigate}
        >
          {item.label}
        </Link>
      );
    });

  return (
    <>
      <nav className={scrolled ? "nav wrap scrolled" : "nav wrap"} aria-label="ناوبری اصلی">
        <Link className="brandLink" href="/" aria-label="Redora Office - صفحه اصلی">
          <Image src={logo} className="logo" alt="Redora Office" sizes="120px" loading="eager" />
        </Link>
        <div className="links">{links()}</div>
        <Link className="btn small" href={headerCta.href}>
          {headerCta.label} <b>←</b>
        </Link>
        <button
          ref={menuButton}
          className="menu"
          type="button"
          aria-label={open ? "بستن منو" : "باز کردن منو"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "×" : "☰"}
        </button>
      </nav>
      <div className={open ? "mobileNav open" : "mobileNav"} id="mobile-navigation" aria-hidden={!open}>
        {links(() => setOpen(false))}
      </div>
    </>
  );
}
