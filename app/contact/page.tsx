import type { Metadata } from "next";
import { ProjectBriefWizard } from "@/components/forms/ProjectBriefWizard";
import { FloatingCta } from "@/components/layout/FloatingCta";
import { PageShell } from "@/components/layout/PageShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { Photo } from "@/components/ui/Photo";
import { contactFaqs, contactSteps } from "@/lib/content/contact";
import { site } from "@/lib/content/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "تماس و درخواست مشاوره",
  description:
    "چند سؤال کوتاه به ما کمک می‌کند قبل از اولین جلسه، تصویر دقیق‌تری از پروژه و خواسته‌های شما داشته باشیم.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PageShell pageClass="contactPage">
      <SiteHeader active="contact" />
      <main id="main-content">
        <section className="contactHero wrap">
          <div className="contactHeroCopy">
            <span className="eyebrow dark">START A PROJECT</span>
            <h1>
              ایده شما،
              <br />
              <em>شروع یک فضای ماندگار.</em>
            </h1>
            <p>
              چند سؤال کوتاه به ما کمک می‌کند قبل از اولین جلسه، تصویر دقیق‌تری از پروژه و خواسته‌های شما
              داشته باشیم.
            </p>
            <a className="btn" href="#projectForm">
              شروع فرم پروژه ←
            </a>
          </div>
          <div className="contactHeroArt">
            <div className="contactHeroImg">
              <Photo
                image="hero"
                alt="طراحی آشپزخانه Redora"
                sizes="(max-width: 900px) 100vw, 55vw"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <div className="contactFloat">
              <small>REDORA OFFICE</small>
              <strong>
                Design begins
                <br />
                with listening.
              </strong>
            </div>
            <div className="contactDot">01</div>
          </div>
        </section>

        <section className="projectStart" id="projectForm">
          <div className="wrap projectStartGrid">
            <aside className="formIntro">
              <span className="eyebrow">PROJECT BRIEF</span>
              <h2>
                پروژه‌تان را
                <br />
                برای ما تعریف کنید.
              </h2>
              <p>
                فرم در شش قدم کوتاه تکمیل می‌شود. اطلاعات شما با امنیت ثبت می‌شود و تیم Redora برای هماهنگی و
                بررسی پروژه با شما تماس می‌گیرد.
              </p>
              <div className="formContact">
                <a href={site.phoneHref}>{site.phone}</a>
                <a href={site.emailHref}>{site.email}</a>
                <span>{site.locality}</span>
              </div>
            </aside>
            <ProjectBriefWizard />
          </div>
        </section>

        <section className="contactInfo wrap">
          {contactSteps.map((step) => (
            <article key={step.number}>
              <b>{step.number}</b>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </section>

        <section className="contactFaq wrap">
          <div>
            <span className="eyebrow dark">QUICK ANSWERS</span>
            <h2>
              قبل از شروع
              <br />
              شاید این‌ها را بپرسید.
            </h2>
          </div>
          <FaqAccordion items={contactFaqs} variant="numbered" />
        </section>
      </main>
      <SiteFooter variant="contact" />
      <FloatingCta href="#projectForm" label="شروع پروژه" />
    </PageShell>
  );
}
