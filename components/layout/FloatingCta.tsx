import Link from "next/link";

interface FloatingCtaProps {
  href?: string;
  label?: string;
}

/** Pill-shaped call to action pinned to the corner of the viewport. */
export function FloatingCta({ href = "/contact", label = "مشاوره رایگان" }: FloatingCtaProps) {
  const content = (
    <>
      {label} <span>←</span>
    </>
  );

  // In-page anchors stay plain links so the browser handles the smooth scroll.
  return href.startsWith("#") ? (
    <a className="floatingCta" href={href}>
      {content}
    </a>
  ) : (
    <Link className="floatingCta" href={href}>
      {content}
    </Link>
  );
}
