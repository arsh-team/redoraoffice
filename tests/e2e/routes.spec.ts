import { expect, test } from "@playwright/test";
import { allRoutes, scrollThrough, trackProblems } from "./support";

for (const route of allRoutes) {
  test(`${route} renders without errors, broken images or overflow`, async ({ page }) => {
    const problems = trackProblems(page);

    const response = await page.goto(route);
    expect(response?.status()).toBe(200);

    await expect(page.locator("html")).toHaveAttribute("lang", "fa");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main#main-content")).toBeVisible();
    await expect(page.locator("footer .copyRight")).toContainText("Redora Office");

    await scrollThrough(page);

    const brokenImages = await page.evaluate(() =>
      [...document.images]
        .filter((image) => image.getAttribute("src") && image.complete && image.naturalWidth === 0)
        .map((image) => image.currentSrc),
    );
    expect(brokenImages).toEqual([]);

    const missingAlt = await page.evaluate(
      () => [...document.images].filter((image) => !image.hasAttribute("alt")).length,
    );
    expect(missingAlt).toBe(0);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, "page must not scroll horizontally").toBeLessThanOrEqual(0);

    // Scroll reveals: every section must become fully visible once it is on screen.
    const sections = page.locator("main > section");
    const count = await sections.count();
    expect(count).toBeGreaterThan(0);
    for (let index = 0; index < count; index++) {
      const section = sections.nth(index);
      await section.evaluate((element) => element.scrollIntoView({ block: "start", behavior: "instant" }));
      await expect(section, `section ${index + 1} of ${route}`).toHaveCSS("opacity", "1");
    }

    expect(problems).toEqual([]);
  });
}

test("every internal link and in-page anchor resolves", async ({ page, request }) => {
  test.slow();
  const links = new Set<string>();

  for (const route of allRoutes) {
    await page.goto(route);
    const { hrefs, brokenAnchors } = await page.evaluate(() => {
      const anchors = [...document.querySelectorAll<HTMLAnchorElement>("a[href]")];
      return {
        hrefs: anchors.map((anchor) => anchor.getAttribute("href") ?? ""),
        brokenAnchors: anchors
          .map((anchor) => anchor.getAttribute("href") ?? "")
          .filter((href) => href.startsWith("#") && (href === "#" || !document.getElementById(href.slice(1)))),
      };
    });
    expect(brokenAnchors, `in-page anchors on ${route}`).toEqual([]);
    for (const href of hrefs) {
      if (href.startsWith("/")) links.add(href.split("#")[0]);
      else expect(href, `unexpected link target on ${route}`).toMatch(/^(#|tel:|mailto:)/);
    }
  }

  expect(links.size).toBeGreaterThanOrEqual(allRoutes.length);
  for (const link of links) {
    const response = await request.get(link);
    expect(response.status(), `GET ${link}`).toBe(200);
  }
});

test("unknown URLs get the not-found page with a 404 status", async ({ page }) => {
  for (const route of ["/does-not-exist", "/projects/unknown-project", "/blog/unknown-article"]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(404);
    await expect(page.locator("h1")).toHaveText("این صفحه پیدا نشد.");
    await expect(page.getByRole("link", { name: /بازگشت به صفحه اصلی/ })).toHaveAttribute("href", "/");
  }
});
