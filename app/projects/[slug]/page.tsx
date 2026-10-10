import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { Photo } from "@/components/ui/Photo";
import {
  getNextProject,
  getProject,
  getProjectGallery,
  projectDetailCopy as copy,
  projects,
} from "@/lib/content/projects";
import { buildMetadata } from "@/lib/seo/metadata";
import { projectJsonLd } from "@/lib/seo/structured-data";

/** Only the projects listed in the content module exist; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return buildMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    image: project.cover,
  });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const next = getNextProject(project.slug);
  const [galleryMain, ...galleryRest] = getProjectGallery(project);
  const facts = [
    { icon: "⌂", label: "نوع پروژه", value: project.category },
    { icon: "⌖", label: "موقعیت مکانی", value: project.location },
    { icon: "▣", label: "سال اجرا", value: copy.yearPlaceholder },
    { icon: "◇", label: "متریال‌های استفاده شده", value: copy.materialsSummary },
    { icon: "↗", label: "متراژ", value: `${project.area} متر مربع` },
  ];

  return (
    <PageShell pageClass="innerPage detailPage detailPageV47">
      <SiteHeader active="projects" isCurrentPage={false} />
      <main id="main-content">
        <section className="pdHero">
          <Photo image={project.cover} alt={project.title} sizes="100vw" loading="eager" fetchPriority="high" />
          <div className="pdHeroShade" />
          <div className="wrap pdHeroContent">
            <div className="pdHeroCopy">
              <div className="pdCrumbs" role="navigation" aria-label="مسیر صفحه">
                <Link href="/">خانه</Link>
                <i aria-hidden="true">/</i>
                <Link href="/projects">پروژه‌ها</Link>
                <i aria-hidden="true">/</i>
                <span aria-current="page">{project.category}</span>
              </div>
              <span className="pdKicker">{copy.kicker}</span>
              <h1>{project.title}</h1>
              <p>{project.summary}</p>
              <div className="pdLocation">
                ⌖ <span>{project.location}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="pdFacts">
          <div className="wrap pdFactsGrid">
            {facts.map((fact) => (
              <article key={fact.label}>
                <i>{fact.icon}</i>
                <span>{fact.label}</span>
                <b>{fact.value}</b>
              </article>
            ))}
          </div>
        </section>

        <section className="pdIntro section">
          <div className="wrap pdIntroGrid">
            <div className="pdIntroCopy">
              <span className="pdSectionLabel">{copy.introLabel}</span>
              <h2>
                {project.title}؛
                <br />
                {copy.introHeadingSuffix}
              </h2>
              <p>{project.summary}</p>{" "}
              <Link href="/contact" className="btn">
                دریافت مشاوره <b>←</b>
              </Link>
            </div>
            <figure className="pdIntroImage">
              <Photo image={project.cover} alt={project.title} sizes="(max-width: 900px) 100vw, 50vw" />
            </figure>
          </div>
        </section>

        <section className="pdGallery section">
          <div className="wrap">
            <div className="pdSectionTitle">
              <span>گالری تصاویر پروژه</span>
              <i />
            </div>
            <div className="pdGalleryGrid">
              <figure className="pdGalleryMain">
                <Photo image={galleryMain} alt={project.title} sizes="(max-width: 600px) 100vw, 60vw" />
              </figure>
              {galleryRest.map((image, index) => (
                <figure key={`${image}-${index}`}>
                  <Photo image={image} alt="" sizes="(max-width: 600px) 100vw, 40vw" />
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="pdFeatures section">
          <div className="wrap pdFeaturesGrid">
            <div>
              <div className="pdSectionTitle">
                <span>ویژگی‌های پروژه</span>
                <i />
              </div>
              <div className="pdFeatureList">
                {copy.features.map((feature) => (
                  <article key={feature.title}>
                    <i>{feature.icon}</i>
                    <div>
                      <b>{feature.title}</b>
                      <p>{feature.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <figure className="pdFeatureVisual">
              <Photo image="dark" alt="جزئیات متریال" sizes="(max-width: 900px) 100vw, 45vw" />
              <figcaption>{copy.featureCaption}</figcaption>
            </figure>
          </div>
        </section>

        <section className="pdMaterials section">
          <div className="wrap">
            <div className="pdSectionTitle">
              <span>متریال‌های استفاده شده</span>
              <i />
            </div>
            <div className="pdMaterialGrid">
              {copy.materials.map((material) => (
                <article key={material.sample}>
                  <div className={`pdMaterialSample ${material.sample}`} />
                  <b>{material.name}</b>
                  <span>{material.note}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pdChallenge section">
          <div className="wrap">
            <div className="pdSectionTitle">
              <span>چالش و راهکار</span>
              <i />
            </div>
            <div className="pdChallengeGrid">
              <div className="pdCompareCards">
                <figure>
                  <span>قبل از اجرا</span>
                  <Photo image="light" alt="قبل از اجرا" sizes="(max-width: 600px) 100vw, 30vw" />
                </figure>
                <figure>
                  <span>بعد از اجرا</span>
                  <Photo image={project.cover} alt="بعد از اجرا" sizes="(max-width: 600px) 100vw, 30vw" />
                </figure>
              </div>
              <div className="pdChallengeCopy">
                {[copy.challenge, copy.solution].map((item) => (
                  <article key={item.title}>
                    <i>{item.icon}</i>
                    <div>
                      <b>{item.title}</b>
                      <p>{item.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pdNext">
          <div className="wrap pdNextGrid">
            <Link className="pdPrev" href="/projects">
              <span>← بازگشت به</span>
              <b>همه پروژه‌ها</b>
            </Link>
            <span className="pdGridIcon" aria-hidden="true">
              ⠿
            </span>
            <Link className="pdNextLink" href={`/projects/${next.slug}`}>
              <span>پروژه بعدی →</span>
              <b>{next.title}</b>
              <Photo image={next.cover} alt={next.title} sizes="200px" />
            </Link>
          </div>
        </section>

        <section className="pdCta">
          <div className="wrap">
            <span>برای پروژه بعدی خود آماده‌اید؟</span>
            <h2>ما در کنار شما هستیم</h2>
            <Link href="/contact" className="btn">
              دریافت مشاوره <b>←</b>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter variant="projectDetail" />
      <JsonLd data={projectJsonLd(project)} />
    </PageShell>
  );
}
