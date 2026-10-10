import Image from "next/image";
import Link from "next/link";
import { logo } from "@/lib/content/images";
import { footers, type FooterContent, type FooterVariant } from "@/lib/content/navigation";
import { site } from "@/lib/content/site";

export function SiteFooter({ variant }: { variant: FooterVariant }) {
  const content: FooterContent = footers[variant];

  return (
    <footer>
      <div className="wrap footer">
        <div>
          <Image src={logo} className="footerLogo" alt="Redora Office" sizes="140px" />
          <p>{content.tagline}</p>
        </div>
        <div>
          <h4>دسترسی سریع</h4>
          {content.links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <div>
          <h4>{content.contactTitle}</h4>
          {content.contactLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          {content.contactLink ? (
            <Link href={content.contactLink.href}>{content.contactLink.label}</Link>
          ) : null}
        </div>
      </div>
      <div className="copyRight">{site.copyright}</div>
    </footer>
  );
}
