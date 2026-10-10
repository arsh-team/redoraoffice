import { expect, test } from "@playwright/test";
import { archiveArticles, articles, featuredArticle } from "../../lib/content/articles";
import { isMobile } from "./support";

test.describe("journal archive", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog");
  });

  test("shows the featured article and every archive card", async ({ page }) => {
    const featured = page.locator("a.magFeatured");
    await expect(featured).toHaveAttribute("href", `/blog/${featuredArticle.slug}`);
    await expect(featured.locator("h2")).toHaveText(featuredArticle.title);
    await expect(page.locator(".journalCard")).toHaveCount(archiveArticles.length);
    await expect(page.locator(".journalCard h3")).toHaveText(archiveArticles.map((article) => article.title));
  });

  test("category chips filter the grid", async ({ page }) => {
    const chips = page.locator(".journalCats");
    await chips.getByRole("button", { name: "متریال", exact: true }).click();
    const expected = archiveArticles.filter((article) => article.category === "material");
    await expect(page.locator(".journalCard:visible h3")).toHaveText(expected.map((article) => article.title));
    await expect(chips.locator("button.active")).toHaveText("متریال");

    await chips.getByRole("button", { name: "همه" }).click();
    await expect(page.locator(".journalCard:visible")).toHaveCount(archiveArticles.length);
  });

  test("search narrows the grid and shows an empty state when nothing matches", async ({ page }) => {
    const search = page.getByLabel("جستجو در مجله");
    await search.fill("جزیره");
    const expected = archiveArticles.filter((article) =>
      `${article.categoryLabel} ${article.title} ${article.excerpt}`.includes("جزیره"),
    );
    expect(expected.length).toBeGreaterThan(0);
    await expect(page.locator(".journalCard:visible h3")).toHaveText(expected.map((article) => article.title));
    await expect(page.locator(".journalEmpty")).toBeHidden();

    await search.fill("zzzz-no-such-article");
    await expect(page.locator(".journalCard:visible")).toHaveCount(0);
    await expect(page.locator(".journalEmpty")).toBeVisible();
    await expect(page.locator(".journalEmpty")).toContainText("پیدا نشد");

    // Search and category combine.
    await search.fill("چوب");
    await page.locator(".journalCats").getByRole("button", { name: "راهنما" }).click();
    await expect(page.locator(".journalCard:visible")).toHaveCount(0);
    await search.fill("");
    await expect(page.locator(".journalCard:visible")).toHaveCount(1);
  });

  test("a card opens its article", async ({ page }) => {
    const article = archiveArticles[1];
    await page.locator(`.journalCard[href="/blog/${article.slug}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/blog/${article.slug}$`));
    await expect(page).toHaveTitle(`${article.title} | REDORA Office`);
  });

  test("newsletter form validates the address and reports the real outcome", async ({ page }) => {
    const section = page.locator(".journalNewsletter");
    await section.scrollIntoViewIfNeeded();
    const email = section.getByLabel("ایمیل شما");
    const submit = section.getByRole("button", { name: /عضویت در خبرنامه/ });

    await email.fill("not-an-email");
    await submit.click();
    await expect(section.locator(".formStatus.error")).toHaveText("لطفاً یک نشانی ایمیل معتبر وارد کنید.");

    // No newsletter webhook is configured on the test server.
    await email.fill("reader@example.com");
    await submit.click();
    await expect(section.locator(".formStatus.error")).toContainText("ارسال نشد");

    await page.route("**/api/newsletter", (route) => route.fulfill({ json: { ok: true } }));
    await submit.click();
    await expect(section.locator(".formStatus.ok")).toHaveText("عضویت شما در خبرنامه ثبت شد.");
    await expect(email).toHaveValue("");
  });
});

test.describe("article page", () => {
  test("has a working table of contents, metadata and related links", async ({ page }) => {
    const article = articles[0];
    await page.goto(`/blog/${article.slug}`);

    await expect(page.locator("h1")).toContainText(article.body.heading.line);
    await expect(page.locator(".articleMeta span")).toHaveText([
      article.body.author,
      article.body.readingTime,
      article.body.published,
    ]);

    // Every contents entry points at a heading that exists.
    const toc = page.locator("aside.articleToc");
    await expect(toc.locator("a")).toHaveCount(article.body.toc.length);
    for (const item of article.body.toc) {
      await expect(page.locator(`.articleContent h2#${item.id}`)).toHaveCount(1);
    }
    // The sidebar is part of the wide layout only, as on the reference.
    if (!isMobile(page)) {
      const last = article.body.toc[article.body.toc.length - 1];
      await toc.getByRole("link", { name: last.label }).click();
      await expect(page).toHaveURL(new RegExp(`#${last.id}$`));
      await expect(page.locator(`#${last.id}`)).toBeInViewport();
    }

    const related = page.locator(".relatedGrid a");
    await expect(related).toHaveCount(3);
    const targets = await related.evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    expect(targets).toEqual(article.body.related.map((item) => `/blog/${item.slug}`));

    await related.first().click();
    await expect(page).toHaveURL(new RegExp(`/blog/${article.body.related[0].slug}$`));
  });

  test("back link returns to the journal and the closing form is present", async ({ page }) => {
    await page.goto("/blog/natural-wood");
    await expect(page.locator("#consult form")).toBeVisible();
    await page.locator("a.backLink").click();
    await expect(page).toHaveURL(/\/blog$/);
  });
});

test("compact consultation form requires a valid phone number", async ({ page }) => {
  await page.goto("/about");
  const form = page.locator("#consult form");
  await form.scrollIntoViewIfNeeded();
  await page.route("**/api/contact", (route) => route.fulfill({ json: { ok: true } }));

  await form.getByLabel("نام و نام خانوادگی").fill("علی رضایی");
  await form.getByLabel("شماره تماس").fill("12");
  await form.getByLabel("نوع پروژه").selectOption("بازطراحی");
  await form.getByRole("button", { name: /ارسال درخواست/ }).click();
  await expect(form.locator(".formStatus.error")).toHaveText("لطفاً نام و شماره تماس معتبر وارد کنید.");

  await form.getByLabel("شماره تماس").fill("0912-345-6789");
  await form.getByRole("button", { name: /ارسال درخواست/ }).click();
  await expect(form.locator(".formStatus.ok")).toContainText("درخواست شما با موفقیت ثبت شد");
});
