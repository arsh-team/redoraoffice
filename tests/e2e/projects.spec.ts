import { expect, test } from "@playwright/test";
import { projects } from "../../lib/content/projects";

test("archive lists every project and filters by category", async ({ page }) => {
  await page.goto("/projects");
  const cards = page.locator(".portfolioCard");
  const filters = page.locator(".projectFilters");
  await expect(cards).toHaveCount(projects.length);
  await expect(page.locator(".portfolioCard:visible")).toHaveCount(projects.length);

  for (const [label, filter] of [
    ["مدرن", "modern"],
    ["مینیمال", "minimal"],
    ["کلاسیک معاصر", "classic"],
  ] as const) {
    await filters.getByRole("button", { name: label, exact: true }).click();
    await expect(filters.locator("button.active")).toHaveText(label);
    const expected = projects.filter((project) => project.filter === filter).map((project) => project.title);
    await expect(page.locator(".portfolioCard:visible h3")).toHaveText(expected);
  }

  await filters.getByRole("button", { name: "همه" }).click();
  await expect(page.locator(".portfolioCard:visible")).toHaveCount(projects.length);
});

test("hero call to action jumps to the archive", async ({ page }) => {
  await page.goto("/projects");
  await page.locator("a.projectsHeroCta").click();
  await expect(page).toHaveURL(/#projectArchive$/);
  await expect(page.locator("#projectArchive")).toBeInViewport();
});

test("a project card opens its case study with the right facts", async ({ page }) => {
  await page.goto("/projects");
  const project = projects[2];
  await page.locator(`.portfolioCard[href="/projects/${project.slug}"]`).click();
  await expect(page).toHaveURL(new RegExp(`/projects/${project.slug}$`));

  await expect(page.locator("h1")).toHaveText(project.title);
  await expect(page).toHaveTitle(`${project.title} | REDORA Office`);
  const facts = page.locator(".pdFactsGrid article b");
  await expect(facts).toHaveText([
    project.category,
    project.location,
    "—",
    "سنگ طبیعی، چوب",
    `${project.area} متر مربع`,
  ]);
  await expect(page.locator(".pdGalleryGrid figure")).toHaveCount(4);
});

test("case studies link to each other in a loop and back to the archive", async ({ page }) => {
  await page.goto(`/projects/${projects[0].slug}`);

  for (let step = 1; step <= projects.length; step++) {
    const next = projects[step % projects.length];
    const link = page.locator("a.pdNextLink");
    await expect(link.locator("b")).toHaveText(next.title);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`/projects/${next.slug}$`));
    await expect(page.locator("h1")).toHaveText(next.title);
  }

  await page.locator("a.pdPrev").click();
  await expect(page).toHaveURL(/\/projects$/);
});

test("breadcrumbs and consultation buttons on a case study work", async ({ page }) => {
  await page.goto("/projects/kordan");
  const crumbs = page.getByRole("navigation", { name: "مسیر صفحه" });
  await expect(crumbs.getByRole("link", { name: "خانه" })).toHaveAttribute("href", "/");
  await expect(crumbs.getByRole("link", { name: "پروژه‌ها" })).toHaveAttribute("href", "/projects");

  await page.locator(".pdCta a.btn").click();
  await expect(page).toHaveURL(/\/contact$/);
});
