import { expect, type Page, test } from "@playwright/test";
import { centerClick } from "./support";

const nextButton = (page: Page) => page.locator("#nextStep");
const submitButton = (page: Page) => page.locator("#submitProject");
const backButton = (page: Page) => page.locator("#prevStep");
const error = (page: Page) => page.locator("#formError");
const stepLabel = (page: Page) => page.locator("#stepLabel");
const choice = (page: Page, text: string) => page.locator(".wizardStep.active label", { hasText: text }).first();

const goNext = (page: Page) => centerClick(nextButton(page));

/** Fills steps 1–5 and stops on the final contact-details step. */
async function reachLastStep(page: Page) {
  await centerClick(choice(page, "بازطراحی"));
  await goNext(page);
  await centerClick(choice(page, "گرم و طبیعی"));
  await goNext(page);
  await page.locator('input[name="city"]').fill("تهران");
  await goNext(page);
  await centerClick(choice(page, "استاندارد"));
  await goNext(page);
  await page.locator('textarea[name="message"]').fill("آشپزخانه ۱۸ متری با جزیره.");
  await goNext(page);
  await expect(stepLabel(page)).toHaveText("مرحله 6 از 6");
}

test.beforeEach(async ({ page }) => {
  await page.goto("/contact");
});

test("wizard blocks each step until its required answer is given", async ({ page }) => {
  await expect(stepLabel(page)).toHaveText("مرحله 1 از 6");
  await expect(page.locator(".wizardStep.active")).toHaveCount(1);
  await expect(backButton(page)).toBeDisabled();
  // One primary action per step: "send" only exists on the last one.
  await expect(submitButton(page)).toHaveCount(0);

  await goNext(page);
  await expect(error(page)).toHaveText("لطفاً یک گزینه را انتخاب کنید.");
  await expect(stepLabel(page)).toHaveText("مرحله 1 از 6");

  await centerClick(choice(page, "طراحی کامل"));
  await goNext(page);
  await expect(stepLabel(page)).toHaveText("مرحله 2 از 6");
  await expect(error(page)).toBeEmpty();
  await expect(page.locator('.wizardStep.active[data-step="2"]')).toBeVisible();

  await goNext(page);
  await expect(error(page)).toHaveText("لطفاً یک گزینه را انتخاب کنید.");
});

test("answers survive moving back and the area slider updates its label", async ({ page }) => {
  await centerClick(choice(page, "مشاوره متریال"));
  await goNext(page);
  await centerClick(choice(page, "تیره و معاصر"));
  await goNext(page);

  await expect(page.locator("#areaValue")).toHaveText("35");
  await page.locator("#areaRange").fill("60");
  await expect(page.locator("#areaValue")).toHaveText("60");

  await centerClick(backButton(page));
  await centerClick(backButton(page));
  await expect(stepLabel(page)).toHaveText("مرحله 1 از 6");
  await expect(page.locator('input[name="type"][value="مشاوره متریال"]')).toBeChecked();
  await expect(page.locator("#progressBar")).toHaveAttribute("style", /width: 16\.6/);
});

test("final step validates contact details and shows success only when the server confirms", async ({ page }) => {
  let payload: Record<string, unknown> | undefined;
  await page.route("**/api/contact", (route) => {
    payload = route.request().postDataJSON() as Record<string, unknown>;
    return route.fulfill({ json: { ok: true } });
  });

  await reachLastStep(page);
  await expect(nextButton(page)).toHaveCount(0);
  await expect(submitButton(page)).toBeVisible();

  await centerClick(submitButton(page));
  await expect(error(page)).toHaveText("لطفاً فیلدهای ضروری را کامل کنید.");

  await page.locator('input[name="name"]').fill("مریم احمدی");
  await page.locator('input[name="phone"]').fill("123");
  await centerClick(submitButton(page));
  await expect(error(page)).toHaveText("لطفاً نام و شماره تماس معتبر وارد کنید.");

  await page.locator('input[name="phone"]').fill("09121234567");
  await page.locator('input[name="email"]').fill("wrong@");
  await centerClick(submitButton(page));
  await expect(error(page)).toHaveText("لطفاً یک نشانی ایمیل معتبر وارد کنید.");
  expect(payload).toBeUndefined();

  await page.locator('input[name="email"]').fill("maryam@example.com");
  await centerClick(submitButton(page));

  const panel = page.locator("#successPanel");
  await expect(panel).toBeVisible();
  await expect(panel.locator("b")).toHaveText("درخواست شما با موفقیت ثبت شد.");
  await expect(panel.getByRole("link", { name: /بازگشت به صفحه اصلی/ })).toHaveAttribute("href", "/");
  await expect(page.locator(".wizardStep.active")).toHaveCount(0);
  await expect(page.locator(".wizardActions")).toBeHidden();

  expect(payload).toMatchObject({
    source: "project-brief",
    type: "بازطراحی",
    style: "گرم و طبیعی",
    city: "تهران",
    budget: "استاندارد",
    name: "مریم احمدی",
    phone: "09121234567",
    email: "maryam@example.com",
    website: "",
  });
});

test("an undelivered brief is reported honestly and the form can be reopened", async ({ page }) => {
  // The test server has no delivery webhook, so the real API answers 503.
  await reachLastStep(page);
  await page.locator('input[name="name"]').fill("مریم احمدی");
  await page.locator('input[name="phone"]').fill("09121234567");
  await centerClick(submitButton(page));

  const panel = page.locator("#successPanel");
  await expect(panel).toBeVisible();
  await expect(panel).toHaveClass(/failure/);
  await expect(panel.locator("b")).toHaveText("درخواست شما ارسال نشد.");
  await expect(panel.getByRole("link", { name: "info@redoraoffice.ir" })).toHaveAttribute(
    "href",
    "mailto:info@redoraoffice.ir",
  );
  await expect(panel).not.toContainText("با موفقیت");

  await centerClick(panel.getByRole("button", { name: /بازگشت به فرم/ }));
  await expect(panel).toBeHidden();
  await expect(stepLabel(page)).toHaveText("مرحله 6 از 6");
  await expect(page.locator('input[name="name"]')).toHaveValue("مریم احمدی");
});

test("contact details are actionable links", async ({ page }) => {
  const contact = page.locator(".formContact");
  await expect(contact.getByRole("link", { name: "0912-691-1586" })).toHaveAttribute("href", "tel:+989126911586");
  await expect(contact.getByRole("link", { name: "info@redoraoffice.ir" })).toHaveAttribute(
    "href",
    "mailto:info@redoraoffice.ir",
  );
});

test("quick answers accordion opens and closes", async ({ page }) => {
  const item = page.locator(".contactFaq .faq article").nth(1);
  const button = item.getByRole("button");
  await expect(item.locator("p")).toBeHidden();

  await centerClick(button);
  await expect(item.locator("p")).toBeVisible();
  await expect(button).toHaveAttribute("aria-expanded", "true");

  await centerClick(button);
  await expect(item.locator("p")).toBeHidden();
});

test("floating button scrolls to the brief", async ({ page }) => {
  await page.locator("a.floatingCta").click();
  await expect(page).toHaveURL(/#projectForm$/);
  await expect(page.locator("#projectForm")).toBeInViewport();
});
