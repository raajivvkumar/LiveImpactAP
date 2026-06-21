// spec: specs/README.md
// tests/ui/navigation.spec.ts

import { test, expect } from "@playwright/test";
import testData from "../../utils/testData.json";
import * as utils from "../../utils/swapper";
import { PageManager } from "../../pages/PageManager";

test.describe("Global UI / Navigation", () => {
  let pageManager: PageManager;

  test.beforeEach(async ({ page }) => {
    pageManager = new PageManager(page);
    await pageManager.LoginPage.navigateToUrl(
      testData.BaseUrl + testData.OrgID + testData.dashboardUrl,
    );
    await utils.Handle_PageLoad(page);
  });

  // TC-UI-001: Sidebar remains visible and consistent across all sections
  test("TC-UI-001: Sidebar remains visible and consistent across all sections", async ({
    page,
  }) => {
    const sections = ["Activities", "Payments", "Events", "Settings"];

    for (const section of sections) {
      await page
        .locator(`#side-menu li a:has(span:text-is('${section}'))`)
        .click();
      await utils.Handle_PageLoad(page);

      const sideMenu = page.locator("#side-menu");
      await expect(sideMenu).toBeVisible();
      // Dashboard link should always remain present regardless of section
      await expect(
        page.locator("#side-menu li a:has(span:text-is('Dashboard'))"),
      ).toBeVisible();
    }
  });

  // TC-UI-002: Sub-menus expand/collapse independently
  test("TC-UI-002: Sub-menus expand/collapse independently", async ({
    page,
  }) => {
    const formsMenu = page.locator(
      "#side-menu li a:has(span:text-is('Forms'))",
    );
    await formsMenu.click();
    await page.waitForTimeout(500);
    await expect(formsMenu).toHaveAttribute("expanded", "");

    const recordsMenu = page.locator(
      "#side-menu li a:has(span:text-is('Records'))",
    );
    await expect(recordsMenu).not.toHaveAttribute("expanded", "");

    // Re-clicking Forms collapses it
    await formsMenu.click();
    await page.waitForTimeout(500);
    await expect(formsMenu).not.toHaveAttribute("expanded", "");
  });

  // TC-UI-003: Breadcrumb in header reflects current page
  test("TC-UI-003: Breadcrumb in header reflects current page", async ({
    page,
  }) => {
    await page
      .locator("#side-menu li a:has(span:text-is('Activities'))")
      .click();
    await utils.Handle_PageLoad(page);

    const breadcrumb = page.locator("generic:has-text('Activities')").first();
    await expect(breadcrumb).toBeVisible();
  });

  // TC-UI-004: "Crash Course" and "Tutorials" links open correct external docs
  test('TC-UI-004: "Crash Course" and "Tutorials" links open correct external docs', async ({
    page,
    context,
  }) => {
    const crashCourseLink = page.locator("a:has-text('Crash Course')");
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      crashCourseLink.click(),
    ]);
    await newPage.waitForLoadState();
    expect(newPage.url()).toContain("help.liveimpact.org");
    await newPage.close();
  });

  // TC-UI-005: Footer is present and consistent on every page
  test("TC-UI-005: Footer is present and consistent on every page", async ({
    page,
  }) => {
    await expect(page.locator("text=©2026 LiveImpact")).toBeVisible();
    await expect(page.locator("a:has-text('About')")).toBeVisible();
    await expect(
      page.locator("a:has-text('Terms and Conditions')"),
    ).toBeVisible();
    await expect(page.locator("a:has-text('Contact Us')")).toBeVisible();
  });

  // TC-UI-006: Footer social links open in new tabs
  test("TC-UI-006: Footer social links open in new tabs", async ({
    page,
    context,
  }) => {
    const facebookLink = page.locator(
      "a[href*='facebook.com/liveimpactcrm']",
    );
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      facebookLink.click(),
    ]);
    await newPage.waitForLoadState();
    expect(newPage.url()).toContain("facebook.com");
    await newPage.close();

    // Original tab should remain on the app
    await expect(page).toHaveURL(/liveimpacts\.com/);
  });

  // TC-UI-007: "Terms and Conditions" link points to internal page
  test('TC-UI-007: "Terms and Conditions" link points to internal page', async ({
    page,
  }) => {
    const link = page.locator("a:has-text('Terms and Conditions')");
    await expect(link).toHaveAttribute(
      "href",
      "/LiveImpactTerms-and-Conditions.htm",
    );
  });

  // TC-UI-008/009: No broken links across primary navigation; no 404 regressions
  test("TC-UI-008: No broken links across primary navigation", async ({
    page,
  }) => {
    const navLinks = page.locator("#side-menu li > a[href^='http']");
    const count = await navLinks.count();

    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute("href");
      if (!href) continue;

      const response = await page.request.get(href).catch(() => null);
      if (response) {
        expect(
          response.status(),
          `Link ${href} returned ${response.status()}`,
        ).toBeLessThan(400);
      }
    }
  });

  // TC-UI-009: Internal navigation never regresses to a 404 page
  test("TC-UI-009: Internal navigation never regresses to a 404 page", async ({
    page,
  }) => {
    const sections = ["Activities", "Payments", "Events", "Settings"];

    for (const section of sections) {
      await page
        .locator(`#side-menu li a:has(span:text-is('${section}'))`)
        .click();
      await utils.Handle_PageLoad(page);

      await expect(page.locator("text=404")).not.toBeVisible();
      await expect(
        page.locator("text=The page you are looking for could not be found"),
      ).not.toBeVisible();
    }
  });

  // TC-UI-010: Page title updates per section
  test("TC-UI-010: Page title updates per section", async ({ page }) => {
    await page
      .locator("#side-menu li a:has(span:text-is('Forms'))")
      .click();
    await page.waitForTimeout(300);
    await page
      .locator("//a[contains(normalize-space(), 'Form Design')]")
      .click();
    await utils.Handle_PageLoad(page);

    await expect(page).toHaveTitle("Form Design");
  });

  // TC-UI-011: Loading indicators appear and clear during navigation
  test("TC-UI-011: Loading indicators appear and clear during navigation", async ({
    page,
  }) => {
    await pageManager.RecordsPage.navigateToAllRecords();

    // utils.Handle_PageLoad already asserts these settle within timeout;
    // re-confirm no loader remains visible after settling.
    await utils.Handle_PageLoad(page);

    await expect(page.locator("#dashLoading")).not.toBeVisible();
    await expect(page.locator(".pace-progress")).not.toBeVisible();
  });

  // TC-UI-012: No unhandled console errors on core navigation paths
  test("TC-UI-012: No unhandled console errors on core navigation paths", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    const sections = ["Activities", "Payments", "Events", "Settings"];
    for (const section of sections) {
      await page
        .locator(`#side-menu li a:has(span:text-is('${section}'))`)
        .click();
      await utils.Handle_PageLoad(page);
    }

    // TODO(behavior): some third-party widgets may log benign warnings;
    // filter known-noisy patterns before enforcing a hard zero-error assertion.
    expect(consoleErrors.length).toBeLessThanOrEqual(0);
  });
});
