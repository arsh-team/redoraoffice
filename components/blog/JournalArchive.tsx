"use client";

import Link from "next/link";
import { useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { archiveArticles, articleCategories, type ArticleCategory } from "@/lib/content/articles";

/** Category chips, live search and the article grid. Cards are hidden, never unmounted. */
export function JournalArchive() {
  const [category, setCategory] = useState<"all" | ArticleCategory>("all");
  const [query, setQuery] = useState("");

  const needle = query.trim().toLowerCase();
  const visible = archiveArticles.map((article) => {
    const inCategory = category === "all" || article.category === category;
    const haystack = `${article.categoryLabel} ${article.title} ${article.excerpt}`.toLowerCase();
    return inCategory && (!needle || haystack.includes(needle));
  });
  const visibleCount = visible.filter(Boolean).length;

  return (
    <>
      <section className="journalTools wrap">
        <div className="journalCats" role="group" aria-label="دسته‌بندی مقالات">
          {articleCategories.map((option) => (
            <button
              key={option.key}
              type="button"
              className={option.key === category ? "active" : undefined}
              aria-pressed={option.key === category}
              onClick={() => setCategory(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <label className="journalSearch">
          <input
            id="blogSearch"
            placeholder="جستجو در مجله..."
            aria-label="جستجو در مجله"
            aria-controls="journalGrid"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <span aria-hidden="true">⌕</span>
        </label>
      </section>
      <section className="journalGrid wrap" id="journalGrid">
        {archiveArticles.map((article, index) => (
          <Link
            key={article.slug}
            className={article.layout === "default" ? "journalCard" : `journalCard ${article.layout}`}
            href={`/blog/${article.slug}`}
            hidden={!visible[index]}
          >
            <div className="jImg">
              <Photo image={article.cover} alt={article.title} sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
            <div className="jBody">
              <small>
                {article.categoryLabel} · {article.minutes} دقیقه
              </small>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <span>ادامه مطلب ←</span>
            </div>
          </Link>
        ))}
        <p className="journalEmpty" role="status" hidden={visibleCount > 0}>
          {visibleCount === 0 ? "مطلبی با این جستجو پیدا نشد. عبارت یا دسته‌بندی دیگری را امتحان کنید." : ""}
        </p>
      </section>
    </>
  );
}
