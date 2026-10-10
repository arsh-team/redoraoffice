import type { Metadata } from "next";
import Link from "next/link";
import { FloatingCta } from "@/components/layout/FloatingCta";
import { PageShell } from "@/components/layout/PageShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ConsultBand, consultTypes } from "@/components/sections/ConsultBand";
import { Photo } from "@/components/ui/Photo";
import { aboutNumbers, designValues, journey, storyPills } from "@/lib/content/about";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "درباره ما",
  description:
    "Redora Office جایی است که معماری، عملکرد و جزئیات در کنار هم قرار می‌گیرند تا قلب خانه، شخصیت مخصوص خودش را پیدا کند.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PageShell pageClass="aboutPage">
      <SiteHeader active="about" />
      <main id="main-content">
        <section className="aboutHero wrap">
          <div className="aboutHeroCopy">
            <span className="eyebrow dark">ABOUT REDORA</span>
            <h1>
              ما فقط آشپزخانه
              <br />
              طراحی نمی‌کنیم؛
              <br />
              <em>سبک زندگی را شکل می‌دهیم.</em>
            </h1>
            <p>
              Redora Office جایی است که معماری، عملکرد و جزئیات در کنار هم قرار می‌گیرند تا قلب خانه،
              شخصیت مخصوص خودش را پیدا کند.
            </p>
            <a className="btn" href="#story">
              داستان Redora ←
            </a>
          </div>
          <div className="aboutHeroArt">
            <div className="aboutMainImg">
              <Photo image="hero" sizes="(max-width: 900px) 100vw, 50vw" loading="eager" fetchPriority="high" />
            </div>
            <div className="aboutSmallImg">
              <Photo image="light" sizes="(max-width: 900px) 50vw, 20vw" />
            </div>
            <div className="aboutSeal">
              <b>8+</b>
              <span>
                سال تجربه
                <br />
                در طراحی
              </span>
            </div>
          </div>
        </section>

        <section className="storyBand" id="story">
          <div className="wrap storyGrid">
            <div className="storyImage">
              <Photo image="dark" sizes="(max-width: 900px) 100vw, 45vw" />
              <span>FORM × FUNCTION</span>
              <div className="storyIndex">01</div>
            </div>
            <div className="storyCopy">
              <span className="eyebrow">OUR STORY</span>
              <h2>
                از یک سؤال ساده شروع می‌کنیم:
                <br />
                <em>شما چطور زندگی می‌کنید؟</em>
              </h2>
              <p>
                برای ما طراحی از فرم شروع نمی‌شود؛ از شناخت آدم‌ها، عادت‌ها، نور خانه و ریتم روزمره آغاز
                می‌شود. بعد از آن، متریال و جزئیات به زبان فضا تبدیل می‌شوند.
              </p>
              <div className="storyPills">
                {storyPills.map((pill) => (
                  <span key={pill}>{pill}</span>
                ))}
              </div>
              <blockquote>«یک آشپزخانه خوب باید قبل از آنکه دیده شود، درست زندگی شود.»</blockquote>
            </div>
          </div>
          <div className="wrap numbersOrganic">
            {aboutNumbers.map((item) => (
              <article key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="philosophy wrap">
          <div className="sectionHead">
            <div>
              <span className="eyebrow dark">DESIGN VALUES</span>
              <h2>
                چیزی که طراحی Redora
                <br />
                را متفاوت می‌کند.
              </h2>
            </div>
            <p>هر تصمیم باید هم زیبا باشد، هم دلیل داشته باشد.</p>
          </div>
          <div className="valueBackdrop" aria-hidden="true">
            <span>REDORA</span>
          </div>
          <div className="valueFlow">
            {designValues.map((value) => (
              <article key={value.number}>
                <b>{value.number}</b>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="timelineOrganic">
          <div className="wrap">
            <span className="eyebrow">REDORA JOURNEY</span>
            <h2>مسیر ما، مرحله به مرحله</h2>
            <div className="journeyIntro">
              <p>
                هر مرحله، یک لایه به تجربه Redora اضافه کرده؛ از تمرکز تخصصی تا یک سیستم یکپارچه طراحی و
                اجرا.
              </p>
              <span>2018 — TODAY</span>
            </div>
            <div className="timelineLine">
              {journey.map((step) => (
                <article key={step.number}>
                  <i>{step.number}</i>
                  <b>{step.title}</b>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="manifesto wrap">
          <div className="manifestoVisual">
            <Photo image="light" sizes="(max-width: 900px) 100vw, 50vw" />
            <div className="manifestoCard">
              <small>REDORA MANIFESTO</small>
              <strong>
                کمتر،
                <br />
                اما دقیق‌تر.
              </strong>
            </div>
          </div>
          <div className="manifestoCopy">
            <span className="eyebrow dark">OUR APPROACH</span>
            <h2>
              فضایی که بعد از چند سال
              <br />
              هنوز درست به نظر برسد.
            </h2>
            <p>
              به جای دنبال کردن ترندهای کوتاه‌مدت، روی تناسب، نور، کیفیت متریال و جزئیات ماندگار تمرکز
              می‌کنیم. نتیجه باید هم امروز جذاب باشد و هم فردا قابل زندگی.
            </p>
            <Link className="darkBtn" href="/projects">
              دیدن پروژه‌ها ←
            </Link>
          </div>
        </section>

        <ConsultBand
          heading={["داستان فضای شما", "از یک گفتگو شروع می‌شود."]}
          text="برای جلسه مشاوره اولیه، اطلاعات پروژه را برای ما بفرستید."
          projectTypes={consultTypes.full}
        />
      </main>
      <SiteFooter variant="about" />
      <FloatingCta />
    </PageShell>
  );
}
