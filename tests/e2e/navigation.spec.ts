import { expect, test } from "@playwright/test";
import { isMobile } from "./support";

const sections = [
  { label: "درباره ما", path: "/about" },
  { label: "خدمات", path: "/services" },
  { label: "نمونه کارها", path: "/projects" },
  { label: "مقالات", path: "/blog" },
  { label: "تماس با ما", path: "/contact" },
  { label: "صفحه اصلی", path: "/" },
];

test("desktop navigation reaches every section and marks it active", async ({ page }) => {
  test.skip(isMobile(page), "desktop navigation only");
  await page.goto("/");
  const nav = page.locator("nav.nav .links");
  await expect(nav.getByRole("link", { name: "صفحه اصلی" })).toHaveAttribute("aria-current", "page");

  for (const section of sections) {
    await nav.getByRole("link", { name: section.label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${section.path === "/" ? "/" : section.path}$`));
    const active = page.locator("nav.nav .links a.activeLink");
    await expect(active).toHaveCount(1);
    await expect(active).toHaveText(section.label);
    await expect(active).toHaveAttribute("aria-current", "page");
  }
});

test("header call to action leads to the contact page", async ({ page }) => {
  test.skip(isMobile(page), "the header button is hidden on small screens");
  await page.goto("/about");
  await page.locator("nav.nav a.btn.small").click();
  await expect(page).toHaveURL(/\/contact$/);
});

test("child pages highlight their section without claiming to be the current page", async ({ page }) => {
  await page.goto("/projects/lavassan");
  const active = page.locator("nav.nav .links a.activeLink");
  await expect(active).toHaveText("نمونه کارها");
  await expect(active).not.toHaveAttribute("aria-current", "page");
});

test("mobile menu opens, closes with Escape and closes after navigating", async ({ page }) => {
  test.skip(!isMobile(page), "mobile menu only");
  await page.goto("/");
  const toggle = page.locator("button.menu");
  const menu = page.locator("#mobile-navigation");

  await expect(page.locator("nav.nav .links")).toBeHidden();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeHidden();

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(toggle).toHaveAccessibleName("بستن منو");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link")).toHaveCount(6);

  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
  await expect(menu).toBeHidden();

  await toggle.click();
  await menu.getByRole("link", { name: "خدمات" }).click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.locator("#mobile-navigation")).toBeHidden();
  await expect(page.locator("#mobile-navigation a.activeLink")).toHaveText("خدمات");
});

test("navigation bar condenses after scrolling and the header hides on scroll down", async ({ page }) => {
  await page.goto("/about");
  const nav = page.locator("nav.nav");
  await expect(nav).not.toHaveClass(/scrolled/);

  await page.mouse.wheel(0, 900);
  await expect(nav).toHaveClass(/scrolled/);
  await expect(page.locator("header.siteHeader")).toHaveClass(/header-hidden/);

  await page.mouse.wheel(0, -200);
  await expect(page.locator("header.siteHeader")).not.toHaveClass(/header-hidden/);
});

test("skip link moves focus target to the main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "رفتن به محتوای اصلی" });
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute("href", "#main-content");
});

test("footer quick links and floating call to action work", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("a.floatingCta")).toHaveAttribute("href", "/contact");
  await page.locator("footer").getByRole("link", { name: "نمونه‌کارها" }).click();
  await expect(page).toHaveURL(/\/projects$/);
});
