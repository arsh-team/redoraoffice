import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CountUp } from "@/components/motion/CountUp";
import { ProjectArchive } from "@/components/projects/ProjectArchive";
import { Photo } from "@/components/ui/Photo";
import type { ImageKey } from "@/lib/content/images";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "نمونه کارها",
  description:
    "مجموعه‌ای از پروژه‌های منتخب Redora؛ نتیجه ترکیب خلاقیت، تجربه و توجه به جزئیات برای خلق فضاهای ماندگار و ارزشمند.",
  path: "/projects",
  image: "dark",
});

const heroCategories = [
  { icon: "⌂", label: "RESIDENTIAL", title: "مسکونی" },
  { icon: "▦", label: "COMMERCIAL", title: "تجاری" },
  { icon: "◇", label: "INTERIOR", title: "طراحی داخلی" },
] as const;

const heroStats = [
  { value: "50+", label: "پروژه تکمیل شده" },
  { value: "10+", label: "سال تجربه" },
  { value: "100%", label: "تمرکز بر جزئیات" },
] as const;

const heroThumbs: readonly ImageKey[] = ["hero", "light", "dark"];

export default function ProjectsPage() {
  return (
    <PageShell pageClass="innerPage">
      <SiteHeader active="projects" />
      <header className="projectsHero projectsHeroV2">
        <div className="projectsHeroMedia">
          <Photo
            image="dark"
            alt="فضای داخلی پروژه Redora"
            sizes="(max-width: 900px) 100vw, 60vw"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <aside className="projectsHeroRail" aria-label="دسته‌بندی پروژه‌ها">
          {heroCategories.map((category) => (
            <div key={category.label}>
              <b>{category.icon}</b>
              <small>{category.label}</small>
              <span>{category.title}</span>
            </div>
          ))}
        </aside>
        <div className="projectsHeroCopy">
          <span className="eyebrow dark">OUR PROJECTS</span>
          <h1>
            فضاهایی فراتر از
            <br />
            <em>یک طراحی ساده</em>
          </h1>
          <p>
            مجموعه‌ای از پروژه‌های منتخب Redora؛ نتیجه ترکیب خلاقیت، تجربه و توجه به جزئیات برای خلق فضاهای
            ماندگار و ارزشمند.
          </p>
          <a className="projectsHeroCta" href="#projectArchive">
            مشاهده همه پروژه‌ها <i>←</i>
          </a>
        </div>
        <div className="projectsHeroBottom">
          <div className="projectsHeroStats">
            {heroStats.map((stat) => (
              <span key={stat.label}>
                <CountUp value={stat.value} />
                {stat.label}
              </span>
            ))}
          </div>
          <div className="projectsHeroThumbs">
            {heroThumbs.map((image) => (
              <Photo key={image} image={image} alt="" sizes="160px" />
            ))}
          </div>
        </div>
      </header>
      <main id="main-content">
        <section className="portfolioSection section" id="projectArchive">
          <ProjectArchive />
        </section>
        <section className="portfolioStatement">
          <div className="wrap">
            <span>REDORA APPROACH</span>
            <h2>
              هر پروژه از یک پلان شروع نمی‌شود؛
              <br />
              از <em>نحوه زندگی شما</em> شروع می‌شود.
            </h2>
            <Link className="btn" href="/contact">
              شروع یک پروژه جدید ←
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter variant="projects" />
    </PageShell>
  );
}
