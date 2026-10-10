import Link from "next/link";
import { SiteNav } from "@/components/layout/SiteNav";
import { CountUp } from "@/components/motion/CountUp";
import { heroHighlights, heroStats } from "@/lib/content/home";
import { HeroSlider } from "./HeroSlider";

/** Homepage hero. Unlike the inner pages, the navigation bar lives inside it. */
export function HomeHero() {
  return (
    <header className="hero heroEditorial" id="home">
      <SiteNav active="home" />
      <div className="heroStage wrap">
        <div className="heroCopy">
          <span className="eyebrow dark">REDORA OFFICE · KITCHEN DESIGN</span>
          <h1>
            آشپزخانه‌ای که
            <br />
            <em>برای شما</em> طراحی شده
          </h1>
          <p className="heroLead">
            فضایی که فقط زیبا نیست؛ با ریتم زندگی شما هماهنگ است. از کانسپت و انتخاب متریال تا جزئیات
            نهایی اجرا.
          </p>
          <div className="actions">
            <Link className="btn" href="/projects">
              مشاهده پروژه‌ها ←
            </Link>
            <a className="heroTextLink" href="#services">
              خدمات طراحی <span>↙</span>
            </a>
          </div>
          <div className="heroMiniMeta">
            {heroHighlights.map((item) => (
              <span key={item.number}>
                <b>{item.number}</b> {item.label}
              </span>
            ))}
          </div>
        </div>
        <HeroSlider />
      </div>
      <div className="stats">
        {heroStats.map((stat) => (
          <div key={stat.label}>
            <CountUp value={stat.value} />
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
