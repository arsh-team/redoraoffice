"use client";

import Link from "next/link";
import { useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { homeProjectFilters, homeProjects, type HomeProjectFilter } from "@/lib/content/home";

/** Dark "selected work" band with category chips that fade non-matching cards out in place. */
export function FeaturedProjects() {
  const [filter, setFilter] = useState<HomeProjectFilter>("همه");

  return (
    <section className="projects section" id="projects">
      <div className="wrap">
        <div className="sectionHead light">
          <div>
            <span className="eyebrow">OUR PROJECTS</span>
            <h2>نمونه‌کارهای منتخب</h2>
          </div>
          <div className="filters" role="group" aria-label="فیلتر نمونه‌کارها">
            {homeProjectFilters.map((option) => (
              <button
                key={option}
                type="button"
                className={option === filter ? "active" : undefined}
                aria-pressed={option === filter}
                onClick={() => setFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="projectGrid">
          {homeProjects.map((project) => {
            const filteredOut = filter !== "همه" && project.category !== filter;
            const className = [project.big ? "big" : "", filteredOut ? "filtered-out" : ""]
              .filter(Boolean)
              .join(" ");
            return (
              <article key={project.slug} className={className || undefined} aria-hidden={filteredOut}>
                <Photo image={project.image} sizes="(max-width: 900px) 100vw, 40vw" />
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.caption}</p>
                  <Link
                    className="cardLink"
                    href={`/projects/${project.slug}`}
                    aria-label={`مشاهده ${project.title}`}
                    tabIndex={filteredOut ? -1 : undefined}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
