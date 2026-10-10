import { expect, test } from "@playwright/test";
import { allRoutes, mainRoutes } from "./support";

const SITE = "https://redoraoffice.ir";
const validLead = { source: "home", name: "سارا محمدی", phone: "09121234567" };

test.describe("form API", () => {
  test("rejects invalid leads", async ({ request }) => {
    for (const body of [
      {},
      { source: "home", name: "س", phone: "09121234567" },
      { source: "home", name: "سارا محمدی", phone: "abc" },
      { source: "elsewhere", name: "سارا محمدی", phone: "09121234567" },
      { ...validLead, email: "not-an-email" },
      { ...validLead, message: "x".repeat(3001) },
    ]) {
      const response = await request.post("/api/contact", { data: body });
      expect(response.status(), JSON.stringify(body).slice(0, 80)).toBe(422);
      expect(await response.json()).toMatchObject({ ok: false, code: "validation" });
    }

    const malformed = await request.post("/api/contact", {
      headers: { "content-type": "application/json" },
      data: "{not json",
    });
    expect(malformed.status()).toBe(422);
  });

  test("never reports success when no delivery endpoint is configured", async ({ request }) => {
    const response = await request.post("/api/contact", { data: validLead });
    expect(response.status()).toBe(503);
    expect(await response.json()).toEqual({ ok: false, code: "not_configured" });

    const newsletter = await request.post("/api/newsletter", { data: { email: "reader@example.com" } });
    expect(newsletter.status()).toBe(503);
  });

  test("silently drops submissions that fill the honeypot", async ({ request }) => {
    const response = await request.post("/api/contact", { data: { ...validLead, website: "http://spam.example" } });
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  test("validates newsletter addresses and only accepts POST", async ({ request }) => {
    const invalid = await request.post("/api/newsletter", { data: { email: "nope" } });
    expect(invalid.status()).toBe(422);
    expect((await request.get("/api/contact")).status()).toBe(405);
  });
});

test.describe("SEO", () => {
  test("every page has unique, complete metadata", async ({ page }) => {
    test.slow();
    const titles = new Set<string>();

    for (const route of allRoutes) {
      await page.goto(route);
      const title = await page.title();
      expect(title, route).toMatch(/Redora Office|REDORA Office/);
      expect(titles.has(title), `duplicate title on ${route}`).toBe(false);
      titles.add(title);

      const canonical = route === "/" ? SITE : `${SITE}${route}`;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", canonical);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "fa_IR");
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https:\/\/redoraoffice\.ir\/images\/kitchen-/);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description?.length ?? 0, `description on ${route}`).toBeGreaterThan(30);
    }
  });

  test("main pages have distinct descriptions", async ({ page }) => {
    const descriptions = new Set<string>();
    for (const route of mainRoutes) {
      await page.goto(route);
      descriptions.add((await page.locator('meta[name="description"]').getAttribute("content")) ?? "");
    }
    expect(descriptions.size).toBe(mainRoutes.length);
  });

  test("structured data is valid JSON-LD of the expected types", async ({ page }) => {
    const types = async (route: string) => {
      await page.goto(route);
      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      return blocks.map((block) => {
        const data = JSON.parse(block) as Record<string, unknown>;
        expect(data["@context"]).toBe("https://schema.org");
        return data;
      });
    };

    const home = await types("/");
    expect(home.map((data) => data["@type"])).toEqual(["Organization"]);
    expect(home[0]).toMatchObject({ telephone: "0912-691-1586", email: "info@redoraoffice.ir" });

    const project = await types("/projects/lavassan");
    expect(project.map((data) => data["@type"]).sort()).toEqual(["CreativeWork", "Organization"]);

    const article = await types("/blog/kitchen-decisions");
    expect(article.map((data) => data["@type"]).sort()).toEqual(["Article", "Organization"]);
    // No ratings, reviews or awards are claimed anywhere.
    for (const data of [...home, ...project, ...article]) {
      expect(JSON.stringify(data)).not.toMatch(/aggregateRating|"review"|award/i);
    }
  });

  test("robots.txt and sitemap.xml describe the whole site", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /admin");
    expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`);

    const sitemap = await (await request.get("/sitemap.xml")).text();
    const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
    expect(locations.sort()).toEqual(allRoutes.map((route) => (route === "/" ? SITE : `${SITE}${route}`)).sort());
  });

  test("responses carry the baseline security headers", async ({ request }) => {
    const headers = (await request.get("/")).headers();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-powered-by"]).toBeUndefined();
  });
});
