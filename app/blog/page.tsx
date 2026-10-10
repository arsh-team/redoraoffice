import type { Metadata } from "next";
import Link from "next/link";
import { JournalArchive } from "@/components/blog/JournalArchive";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { FloatingCta } from "@/components/layout/FloatingCta";
import { PageShell } from "@/components/layout/PageShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ConsultBand, consultTypes } from "@/components/sections/ConsultBand";
import { Photo } from "@/components/ui/Photo";
import { featuredArticle } from "@/lib/content/articles";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "مجله طراحی",
  description:
    "از انتخاب متریال و نور تا جزئیاتی که یک آشپزخانه را ماندگار می‌کنند؛ یادداشت‌هایی از نگاه Redora.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <PageShell pageClass="blogPage">
      <SiteHeader active="blog" />
      <main id="main-content">
        <section className="magHero wrap">
          <div className="magTitle">
            <span className="eyebrow dark">REDORA JOURNAL</span>
            <h1>
              مجله‌ای برای
              <br />
              <em>زندگی بهتر در فضا.</em>
            </h1>
            <p>
              از انتخاب متریال و نور تا جزئیاتی که یک آشپزخانه را ماندگار می‌کنند؛ یادداشت‌هایی از نگاه
              Redora.
            </p>
          </div>
          <Link className="magFeatured" href={`/blog/${featuredArticle.slug}`}>
            <div className="magFeaturedImg">
              <Photo
                image={featuredArticle.cover}
                alt={featuredArticle.title}
                sizes="(max-width: 900px) 100vw, 60vw"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <div className="magFeaturedCard">
              <span>FEATURED · {featuredArticle.categoryLabel}</span>
              <h2>{featuredArticle.title}</h2>
              <p>{featuredArticle.excerpt}</p>
              <b>مطالعه مقاله ←</b>
            </div>
          </Link>
        </section>

        <JournalArchive />

        <section className="journalNewsletter">
          <div className="wrap">
            <div>
              <span className="eyebrow">REDORA LETTER</span>
              <h2>
                ایده‌های خوب را
                <br />
                برای بعد نگه دارید.
              </h2>
            </div>
            <NewsletterForm />
          </div>
        </section>

        <ConsultBand
          heading={["از خواندن ایده‌ها", "به ساختن فضای خودتان."]}
          text="برای جلسه مشاوره اولیه، اطلاعات پروژه را برای ما بفرستید."
          projectTypes={consultTypes.short}
        />
      </main>
      <SiteFooter variant="blog" />
      <FloatingCta />
    </PageShell>
  );
}
