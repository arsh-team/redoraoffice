"use client";

import Link from "next/link";
import { useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { projectFilters, projects, type ProjectFilter } from "@/lib/content/projects";

/** Filterable case-study archive. Cards stay mounted and are hidden, so reveal state survives filtering. */
export function ProjectArchive() {
  const [filter, setFilter] = useState<"all" | ProjectFilter>("all");

  return (
    <div className="wrap">
      <div className="portfolioTop">
        <div>
          <span className="eyebrow dark">PROJECT ARCHIVE</span>
          <h2>پروژه‌های منتخب</h2>
        </div>
        <div className="projectFilters" role="group" aria-label="فیلتر پروژه‌ها">
          {projectFilters.map((option) => (
            <button
              key={option.key}
              type="button"
              className={option.key === filter ? "active" : undefined}
              aria-pressed={option.key === filter}
              onClick={() => setFilter(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="portfolioMasonry portfolioEditorial">
        {projects.map((project, index) => (
          <Link
            key={project.slug}
            className={`portfolioCard projectShowcase ${project.tone}`}
            href={`/projects/${project.slug}`}
            hidden={filter !== "all" && project.filter !== filter}
          >
            <div className="projectVisual">
              <Photo image={project.cover} alt={project.title} sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
            <div className="projectPanel">
              <span className="projectNo">{String(index + 1).padStart(2, "0")}</span>
              <small>{project.category}</small>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <div className="projectSpecs">
                <span>⌖ {project.location}</span>
                <span>□ {project.area} متر</span>
              </div>
              <b>
                مشاهده پروژه <i>←</i>
              </b>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
