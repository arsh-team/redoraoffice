import { defineConfig } from "@playwright/test";

const port = Number(process.env.E2E_PORT ?? 3100);
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${port}`;

/**
 * End-to-end tests run against the production build (`npm run build` first).
 * They use the locally installed Google Chrome by default; set PW_CHANNEL=""
 * after `npx playwright install chromium` to use Playwright's bundled browser.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL,
    channel: process.env.PW_CHANNEL ?? "chrome",
    locale: "fa-IR",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 }, hasTouch: true } },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npx next start -p ${port}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        env: {
          // No delivery webhook: forms must report honestly that nothing was sent.
          CONTACT_WEBHOOK_URL: "",
          NEWSLETTER_WEBHOOK_URL: "",
          // The suite posts more forms from one address than a visitor ever would.
          FORM_RATE_LIMIT_MAX: "1000",
        },
      },
});
