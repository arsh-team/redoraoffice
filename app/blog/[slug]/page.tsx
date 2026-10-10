import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBlocks } from "@/components/blog/ArticleBlocks";
import { PageShell } from "@/components/layout/PageShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ConsultBand, consultTypes } from "@/components/sections/ConsultBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { Photo } from "@/components/ui/Photo";
import { articles, getArticle } from "@/lib/content/articles";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleJsonLd } from "@/lib/seo/structured-data";

/** Only the articles listed in the content module exist; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/blog/${article.slug}`,
    image: article.cover,
    type: "article",
    publishedTime: article.body.publishedIso,
  });
}

export default async function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const { body } = article;

  return (
    <PageShell pageClass="articlePage">
      <SiteHeader active="blog" isCurrentPage={false} />
      <main id="main-content">
        <section className="articleHero wrap">
          <div className="articleHeroCopy">
            <Link href="/blog" className="backLink">
              → بازگشت به مجله
            </Link>
            <span className="eyebrow dark">{body.eyebrow}</span>
            <h1>
              {body.heading.line}
              <br />
              <em>{body.heading.emphasis}</em>
            </h1>
            <div className="articleMeta">
              <span>{body.author}</span>
              <span>{body.readingTime}</span>
              <span>{body.published}</span>
            </div>
          </div>
          <div className="articleHeroImg">
            <Photo image={body.cover} sizes="(max-width: 900px) 100vw, 55vw" loading="eager" fetchPriority="high" />
          </div>
        </section>

        <section className="articleLayout wrap">
          <aside className="articleToc" aria-label="فهرست مطالب">
            <small>در این مقاله</small>
            {body.toc.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </aside>
          <article className="articleContent">
            <ArticleBlocks blocks={body.blocks} />
            <div className="articleEnd">
              <span>{body.tags}</span>
              <a href="#consult">پروژه خودتان را با Redora شروع کنید ←</a>
            </div>
          </article>
        </section>

        <section className="relatedArticles wrap">
          <div className="sectionHead">
            <div>
              <span className="eyebrow dark">KEEP READING</span>
              <h2>مطالب مرتبط</h2>
            </div>
            <Link href="/blog">مشاهده همه ←</Link>
          </div>
          <div className="relatedGrid">
            {body.related.map((related) => (
              <Link key={related.slug} href={`/blog/${related.slug}`}>
                <Photo image={related.image} sizes="(max-width: 900px) 100vw, 33vw" />
                <small>{related.tag}</small>
                <h3>{related.title}</h3>
              </Link>
            ))}
          </div>
        </section>

        <ConsultBand
          heading={["برای فضای شما،", "یک پاسخ اختصاصی."]}
          text="جلسه مشاوره اولیه نقطه شروع شناخت پروژه است."
          projectTypes={consultTypes.short}
        />
      </main>
      <SiteFooter variant="article" />
      <JsonLd data={articleJsonLd(article)} />
    </PageShell>
  );
}
