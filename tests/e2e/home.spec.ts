import { expect, test } from "@playwright/test";
import { isMobile } from "./support";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("hero slider responds to arrows and thumbnails", async ({ page }) => {
  const count = page.locator(".heroCount");
  const activeSlide = page.locator(".heroSlide.active");
  await expect(count).toHaveText("01 / 03");
  await expect(activeSlide).toHaveCount(1);
  await expect(activeSlide.locator("strong")).toHaveText("Modern Warm Kitchen");

  await page.getByRole("button", { name: "اسلاید بعدی" }).click();
  await expect(count).toHaveText("02 / 03");
  await expect(activeSlide.locator("strong")).toHaveText("Dark Stone Kitchen");

  await page.getByRole("button", { name: "اسلاید قبلی" }).click();
  await page.getByRole("button", { name: "اسلاید قبلی" }).click();
  await expect(count).toHaveText("03 / 03");
  await expect(activeSlide.locator("strong")).toHaveText("Soft Minimal Kitchen");

  if (!isMobile(page)) {
    await page.getByRole("button", { name: "نمایش اسلاید 02" }).click();
    await expect(count).toHaveText("02 / 03");
    await expect(page.locator(".heroThumb.active")).toHaveCount(1);
  }
});

test("hero slider advances on its own", async ({ page }) => {
  await expect(page.locator(".heroCount")).toHaveText("01 / 03");
  await expect(page.locator(".heroCount")).toHaveText("02 / 03", { timeout: 9000 });
});

test("hero calls to action point at real destinations", async ({ page }) => {
  await expect(page.locator(".heroCopy a.btn")).toHaveAttribute("href", "/projects");
  await expect(page.locator(".heroCopy a.heroTextLink")).toHaveAttribute("href", "#services");
  await page.locator(".heroCopy a.btn").click();
  await expect(page).toHaveURL(/\/projects$/);
});

test("featured project filters fade out non-matching cards", async ({ page }) => {
  const cards = page.locator(".projectGrid article");
  const filters = page.locator(".filters");
  await expect(cards).toHaveCount(3);
  await expect(page.locator(".projectGrid article.filtered-out")).toHaveCount(0);

  await filters.getByRole("button", { name: "مدرن" }).click();
  await expect(filters.getByRole("button", { name: "مدرن" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".projectGrid article.filtered-out")).toHaveCount(2);
  await expect(page.locator(".projectGrid article:not(.filtered-out) h3")).toHaveText("پروژه لواسان");

  await filters.getByRole("button", { name: "همه" }).click();
  await expect(page.locator(".projectGrid article.filtered-out")).toHaveCount(0);
});

test("each featured project card opens its own case study", async ({ page }) => {
  const targets = await page
    .locator(".projectGrid a.cardLink")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(targets).toEqual(["/projects/lavassan", "/projects/niavaran", "/projects/farmanieh"]);

  await page.getByRole("link", { name: "مشاهده پروژه لواسان" }).click();
  await expect(page).toHaveURL(/\/projects\/lavassan$/);
});

test("gallery images open in a lightbox that closes with Escape and the close button", async ({ page }) => {
  const lightbox = page.locator(".lightbox");
  const image = page.locator(".inspirationGrid img").first();
  await expect(lightbox).toBeHidden();

  await image.scrollIntoViewIfNeeded();
  await image.click();
  await expect(lightbox).toBeVisible();
  await expect(lightbox).toHaveAttribute("aria-hidden", "false");
  await expect(lightbox.locator("img")).toHaveAttribute("alt", "آشپزخانه مدرن خاکستری");
  await expect(lightbox.getByRole("button", { name: "بستن" })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(lightbox).toBeHidden();
  await expect(image).toBeFocused();

  // Keyboard users can open it too.
  await page.keyboard.press("Enter");
  await expect(lightbox).toBeVisible();
  await lightbox.getByRole("button", { name: "بستن" }).click();
  await expect(lightbox).toBeHidden();
});

test("before/after comparison moves with the pointer and the keyboard", async ({ page }) => {
  const frame = page.locator("#beforeAfter");
  const handle = frame.getByRole("slider", { name: "مقایسه قبل و بعد" });
  await frame.scrollIntoViewIfNeeded();
  await expect(handle).toHaveAttribute("aria-valuenow", "50");

  await handle.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(handle).toHaveAttribute("aria-valuenow", "54");
  await page.keyboard.press("End");
  await expect(handle).toHaveAttribute("aria-valuenow", "100");

  const box = await frame.boundingBox();
  if (!box) throw new Error("comparison frame has no box");
  await page.mouse.click(box.x + box.width * 0.75, box.y + box.height / 2);
  await expect(handle).toHaveAttribute("aria-valuenow", "25");
  await expect(frame.locator(".beforeLayer")).toHaveAttribute("style", /width: 25%/);
});

test("FAQ answers expand and collapse", async ({ page }) => {
  const first = page.locator("#faq .faqList article").first();
  const button = first.getByRole("button");
  await button.scrollIntoViewIfNeeded();
  await expect(button).toHaveAttribute("aria-expanded", "false");

  await button.click();
  await expect(first).toHaveClass(/open/);
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect(first.locator("p")).toContainText("۲ تا ۴ هفته");

  await button.click();
  await expect(first).not.toHaveClass(/open/);
});

test("consultation form validates before sending", async ({ page }) => {
  let requests = 0;
  await page.route("**/api/contact", (route) => {
    requests++;
    return route.fulfill({ json: { ok: true } });
  });

  const form = page.locator("#consultForm");
  await form.scrollIntoViewIfNeeded();
  await form.getByRole("button", { name: /ارسال درخواست/ }).click();
  await expect(form.locator(".formStatus.error")).toHaveText("لطفاً نام و شماره تماس معتبر وارد کنید.");

  await form.getByLabel("نام و نام خانوادگی").fill("سارا محمدی");
  await form.getByLabel("شماره تماس").fill("abc");
  await form.getByRole("button", { name: /ارسال درخواست/ }).click();
  await expect(form.locator(".formStatus.error")).toBeVisible();
  expect(requests).toBe(0);

  // Persian digits are accepted.
  await form.getByLabel("شماره تماس").fill("۰۹۱۲۱۲۳۴۵۶۷");
  await form.getByLabel("نوع پروژه").selectOption("طراحی آشپزخانه");
  await form.getByRole("button", { name: /ارسال درخواست/ }).click();
  await expect(form.locator(".formStatus.ok")).toContainText("درخواست شما با موفقیت ثبت شد");
  expect(requests).toBe(1);
  await expect(form.getByLabel("نام و نام خانوادگی")).toHaveValue("");
});

test("consultation form says plainly when a request could not be delivered", async ({ page }) => {
  // The test server has no delivery webhook configured, so the real API answers 503.
  const form = page.locator("#consultForm");
  await form.scrollIntoViewIfNeeded();
  await form.getByLabel("نام و نام خانوادگی").fill("سارا محمدی");
  await form.getByLabel("شماره تماس").fill("09121234567");
  await form.getByRole("button", { name: /ارسال درخواست/ }).click();

  const status = form.locator(".formStatus.error");
  await expect(status).toContainText("پیام شما ارسال نشد");
  await expect(status.getByRole("link", { name: "0912-691-1586" })).toHaveAttribute("href", "tel:+989126911586");
  await expect(form.locator(".formStatus.ok")).toHaveCount(0);
  // What the visitor typed is kept so they can retry.
  await expect(form.getByLabel("نام و نام خانوادگی")).toHaveValue("سارا محمدی");
});

test("statistics settle on their final values", async ({ page }) => {
  await page.locator(".stats").scrollIntoViewIfNeeded();
  await expect(page.locator(".stats strong").first()).toHaveText("120+");
  await expect(page.locator(".stats strong").nth(2)).toHaveText("100%");
});
