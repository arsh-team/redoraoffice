import type { Metadata } from "next";
import { FloatingCta } from "@/components/layout/FloatingCta";
import { PageShell } from "@/components/layout/PageShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ConsultBand, consultTypes } from "@/components/sections/ConsultBand";
import { MaterialLab } from "@/components/services/MaterialLab";
import { Photo } from "@/components/ui/Photo";
import {
  deliverables,
  serviceFaqs,
  serviceHighlights,
  serviceProcess,
  services,
} from "@/lib/content/services";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "خدمات طراحی و اجرا",
  description:
    "هر آشپزخانه در Redora یک پروژه معماری مستقل است؛ از شناخت سبک زندگی تا طراحی، انتخاب متریال و اجرای دقیق.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <PageShell pageClass="servicesPage">
      <SiteHeader active="services" />
      <main id="main-content">
        <section className="svcHero wrap">
          <div className="svcHeroCopy">
            <span className="eyebrow dark">REDORA SERVICES</span>
            <h1>
              از یک ایده،
              <br />
              <em>تا فضایی برای زندگی.</em>
            </h1>
            <p>
              هر آشپزخانه در Redora یک پروژه معماری مستقل است؛ از شناخت سبک زندگی تا طراحی، انتخاب متریال و
              اجرای دقیق.
            </p>
            <div className="actions">
              <a className="btn" href="#svc-list">
                مشاهده خدمات ←
              </a>
              <a className="ghostBtn" href="#consult">
                مشاوره پروژه
              </a>
            </div>
            <div className="svcMini">
              {serviceHighlights.flatMap((item) => [
                <b key={`${item.number}-number`}>{item.number}</b>,
                <span key={`${item.number}-label`}>{item.label}</span>,
              ])}
            </div>
          </div>
          <div className="svcHeroVisual">
            <Photo image="hero" sizes="(max-width: 900px) 100vw, 55vw" loading="eager" fetchPriority="high" />
            <div className="floatingNote">
              <small>DESIGN PHILOSOPHY</small>
              <strong>
                فرم، عملکرد
                <br />و جزئیات
              </strong>
            </div>
          </div>
        </section>

        <section className="svcIntro wrap">
          <div>
            <span className="eyebrow dark">WHAT WE DO</span>
            <h2>
              خدماتی که به جای «کابینت»،
              <br />
              یک تجربه کامل می‌سازند.
            </h2>
          </div>
          <p>
            تمرکز ما فقط روی ظاهر نیست. مسیر حرکت، نور، ارگونومی، متریال، جزئیات اجرایی و شخصیت فضا همزمان
            طراحی می‌شوند تا نتیجه یکپارچه باشد.
          </p>
        </section>

        <section className="svcCards serviceShowcase wrap" id="svc-list">
          {services.map((service) => (
            <article key={service.number} className={`serviceTile ${service.tone} ${service.shape}`}>
              <div className="serviceMedia">
                <Photo image={service.image} alt={service.title} sizes="(max-width: 900px) 100vw, 50vw" />
              </div>
              <div className="serviceInfo">
                <span className="serviceNo">{service.number}</span>
                <small>{service.label}</small>
                <div className="serviceIcon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <a href="#consult">
                  مشاهده جزئیات <b>←</b>
                </a>
              </div>
            </article>
          ))}
        </section>

        <section className="materialLab">
          <MaterialLab />
        </section>

        <section className="deliver wrap">
          <div className="sectionHead">
            <div>
              <span className="eyebrow dark">DELIVERABLES</span>
              <h2>در پایان چه چیزی دریافت می‌کنید؟</h2>
            </div>
            <p>خروجی‌هایی شفاف برای اینکه پروژه از طراحی تا اجرا بدون ابهام پیش برود.</p>
          </div>
          <div className="deliverGrid">
            {deliverables.map((item) => (
              <article key={item.number}>
                <b>{item.number}</b>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="processOrganic wrap">
          <div className="processPhoto">
            <Photo image="light" sizes="(max-width: 900px) 100vw, 45vw" />
          </div>
          <div className="processCopy">
            <span className="eyebrow dark">OUR PROCESS</span>
            <h2>
              یک مسیر روشن،
              <br />
              از اولین گفتگو تا تحویل.
            </h2>
            <ol>
              {serviceProcess.map((step) => (
                <li key={step.number}>
                  <b>{step.number}</b>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="svcFaq wrap">
          <div>
            <span className="eyebrow dark">FAQ</span>
            <h2>قبل از شروع پروژه</h2>
            <p>چند سؤال پرتکرار درباره خدمات Redora.</p>
          </div>
          <div className="faqList">
            {serviceFaqs.map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <ConsultBand
          heading={["آشپزخانه بعدی", "می‌تواند مال شما باشد."]}
          text="برای یک جلسه مشاوره اولیه، اطلاعات پروژه را برای ما بفرستید."
          projectTypes={consultTypes.full}
        />
      </main>
      <SiteFooter variant="services" />
      <FloatingCta />
    </PageShell>
  );
}
