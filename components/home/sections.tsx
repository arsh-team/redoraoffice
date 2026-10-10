import Link from "next/link";
import { HomeConsultForm } from "@/components/forms/HomeConsultForm";
import { BeforeAfter } from "@/components/galleries/BeforeAfter";
import { ZoomablePhoto } from "@/components/galleries/Lightbox";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import {
  benefits,
  homeArticles,
  homeFaqs,
  homeServices,
  inspiration,
  processSteps,
  testimonial,
} from "@/lib/content/home";

/** Homepage sections below the hero, in reference order. Each maps to one <section>. */

const cardHeadingLink = "text-inherit no-underline";

export function AboutIntro() {
  return (
    <section className="about wrap section" id="about">
      <div className="copy">
        <span className="eyebrow dark">ABOUT US</span>
        <h2>
          معماری برای
          <br />
          سبک زندگی شما
        </h2>
        <p>
          در Redora Office باور داریم آشپزخانه فقط یک فضای کاربردی نیست؛ قلب خانه است. طراحی ما از نیاز
          واقعی، متریال باکیفیت و جزئیات ماندگار شروع می‌شود.
        </p>
        <Link className="darkBtn" href="/about">
          درباره ما بیشتر بدانید ←
        </Link>
      </div>
      <div className="featureImg card">
        <ZoomablePhoto image="dark" sizes="(max-width: 900px) 100vw, 45vw" />
        <div className="videoBadge">
          ▶{" "}
          <span>
            نمایش ویدیو
            <br />
            <b>فضای واقعی پروژه</b>
          </span>
        </div>
      </div>
      <div className="benefits">
        {benefits.map((benefit) => (
          <article key={benefit.title}>
            <i>{benefit.icon}</i>
            <h3>{benefit.title}</h3>
            <p>{benefit.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ServicesPreview() {
  return (
    <section className="section services" id="services">
      <div className="wrap">
        <div className="sectionHead">
          <div>
            <span className="eyebrow dark">OUR SERVICES</span>
            <h2>خدمات ما</h2>
          </div>
          <p>
            مجموعه‌ای کامل از خدمات طراحی و اجرای آشپزخانه
            <br />
            با رویکردی حرفه‌ای و متفاوت.
          </p>
        </div>
        <div className="serviceGrid">
          {homeServices.map((service) => (
            <article key={service.title}>
              <ZoomablePhoto image={service.image} sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 25vw" />
              <h3>
                <Link className={cardHeadingLink} href="/services">
                  {service.title}
                </Link>
              </h3>
              <p>{service.text}</p>
              <b>←</b>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InspirationGallery() {
  return (
    <section className="inspiration section" id="inspiration">
      <div className="wrap">
        <div className="sectionHead">
          <div>
            <span className="eyebrow dark">KITCHEN INSPIRATION</span>
            <h2>گالری الهام طراحی</h2>
          </div>
          <p>چند فضای متنوع برای تست چیدمان بصری پروژه؛ از کابینت‌های روشن تا ترکیب‌های تیره و گرم.</p>
        </div>
        <div className="inspirationGrid">
          {inspiration.map((item) => (
            <figure key={item.caption} className={item.wide ? "wide" : undefined}>
              <ZoomablePhoto image={item.image} alt={item.alt} sizes="(max-width: 620px) 82vw, 50vw" />
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CompareSection() {
  return (
    <section className="compare wrap section">
      <div className="compareCopy">
        <span className="eyebrow dark">DESIGN EXPERIENCE</span>
        <h2>
          طراحی را قبل از اجرا
          <br />
          به صورت واقعی ببینید
        </h2>
        <p>
          با رندرهای سه‌بعدی، انتخاب متریال و بررسی جزئیات، قبل از شروع اجرا تصویر روشنی از نتیجه نهایی
          خواهید داشت.
        </p>
        <a className="btn" href="#contact">
          مشاهده نمونه سه‌بعدی ←
        </a>
      </div>
      <BeforeAfter
        id="beforeAfter"
        before={{ image: "light", alt: "طرح اولیه" }}
        after={{ image: "dark", alt: "طرح نهایی" }}
        sizes="(max-width: 900px) 100vw, 60vw"
      />
    </section>
  );
}

export function ProcessSteps() {
  return (
    <section className="process section">
      <div className="wrap">
        <span className="eyebrow dark">OUR PROCESS</span>
        <h2>مراحل همکاری با ما</h2>
        <div className="steps">
          {processSteps.map((step) => (
            <article key={step.number}>
              <b>{step.number}</b>
              <i>{step.icon}</i>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonial() {
  return (
    <section className="testimonial wrap">
      <div>
        <span className="eyebrow">WHAT OUR CLIENTS SAY</span>
        <h2>تجربه مشتریان ما</h2>
        <blockquote>{testimonial.quote}</blockquote>
        <strong>{testimonial.rating}</strong>
      </div>
    </section>
  );
}

export function BlogPreview() {
  return (
    <section className="blog wrap section" id="blog">
      <div className="sectionHead">
        <div>
          <span className="eyebrow dark">OUR BLOG</span>
          <h2>آخرین مقالات</h2>
        </div>
        <Link href="/blog">مشاهده همه مقالات ←</Link>
      </div>
      <div className="blogGrid">
        {homeArticles.map((article) => (
          <article key={article.title}>
            <ZoomablePhoto image={article.image} sizes="(max-width: 900px) 100vw, 33vw" />
            <h3>
              <Link className={cardHeadingLink} href="/blog">
                {article.title}
              </Link>
            </h3>
            <p>{article.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function HomeFaq() {
  return (
    <section className="faq wrap section" id="faq">
      <div className="sectionHead">
        <div>
          <span className="eyebrow dark">FAQ</span>
          <h2>سوالات پرتکرار</h2>
        </div>
        <p>پاسخ کوتاه به سوالاتی که معمولاً قبل از شروع پروژه مطرح می‌شوند.</p>
      </div>
      <FaqAccordion items={homeFaqs} variant="list" />
    </section>
  );
}

export function HomeContact() {
  return (
    <section className="contact" id="contact">
      <div className="wrap contactInner">
        <div>
          <span className="eyebrow">START A PROJECT</span>
          <h2>
            مشاوره رایگان
            <br />
            برای پروژه شما
          </h2>
          <p>برای شروع طراحی آشپزخانه رویایی خود، اطلاعات اولیه را برای ما ارسال کنید.</p>
        </div>
        <HomeConsultForm />
      </div>
    </section>
  );
}
