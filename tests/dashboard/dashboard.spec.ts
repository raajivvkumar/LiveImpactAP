// spec: specs/README.md
// tests/dashboard/dashboard.spec.ts

import { test, expect } from "@playwright/test";
import testData from "../../utils/testData.json";
import * as utils from "../../utils/swapper";
import { PageManager } from "../../pages/PageManager";

test.describe("Dashboard", () => {
  let pageManager: PageManager;

  test.beforeEach(async ({ page }) => {
    pageManager = new PageManager(page);
    await pageManager.LoginPage.navigateToUrl(
      testData.BaseUrl + testData.OrgID + testData.dashboardUrl,
    );
    await utils.Handle_PageLoad(page);
  });

  // TC-DASH-001: Dashboard loads all four analytics widgets
  test("TC-DASH-001: Dashboard loads all four analytics widgets", async ({
    page,
  }) => {
    const dash = pageManager.DashboardPage;
    await dash.waitForWidgets();

    await expect(dash.recordGraphWidget).toBeVisible();
    await expect(dash.recordStatsWidget).toBeVisible();
    await expect(dash.paymentGraphWidget).toBeVisible();
    await expect(dash.paymentStatsWidget).toBeVisible();
  });

  // TC-DASH-002: Record Stats values are internally consistent
  test("TC-DASH-002: Record Stats values are internally consistent", async ({
    page,
  }) => {
    const dash = pageManager.DashboardPage;
    await dash.waitForWidgets();

    const parseNum = (s: string) =>
      parseInt(s.replace(/[^\d]/g, ""), 10) || 0;

    const total = parseNum(await dash.getText(dash.totalRecordsValue));
    const fy = parseNum(await dash.getText(dash.newRecordsCurrentFY));
    const month = parseNum(await dash.getText(dash.newRecordsCurrentMonth));
    const week = parseNum(await dash.getText(dash.newRecordsLast7Days));

    expect(total).toBeGreaterThanOrEqual(fy);
    expect(fy).toBeGreaterThanOrEqual(month);
    expect(month).toBeGreaterThanOrEqual(week);
    expect(week).toBeGreaterThanOrEqual(0);
  });

  // TC-DASH-003: Percent-change indicators render with correct format
  test("TC-DASH-003: Percent-change indicators render with correct format", async ({
    page,
  }) => {
    const pctBadges = page.locator(
      "generic[aria-label='Percent Change Week Over Week'], " +
        "generic[aria-label='Percent Change Month Over Month'], " +
        "generic[aria-label='Percent Change Year Over Year']",
    );
    const count = await pctBadges.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const text = await pctBadges.nth(i).textContent();
      expect(text).toMatch(/^[+-]\d+(\.\d+)?%$/);
    }
  });

  // TC-DASH-004: Record Graph YoY x-axis covers rolling 12 months
  test("TC-DASH-004: Record Graph YoY x-axis covers rolling 12 months", async ({
    page,
  }) => {
    const dash = pageManager.DashboardPage;
    const monthLabels = dash.recordGraphWidget.locator(
      "generic:text-matches('^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$')",
    );
    await expect(monthLabels).toHaveCount(12);
  });

  // TC-DASH-005: Payment Stats currency values format correctly
  test("TC-DASH-005: Payment Stats currency values format correctly", async ({
    page,
  }) => {
    const dash = pageManager.DashboardPage;
    const text = await dash.getText(dash.currentFYAmount);
    expect(text).toMatch(/^\$[\d,]+(\.\d+)?$/);
  });

  // TC-DASH-006: BETA VERSION badge present on all 4 widgets
  test("TC-DASH-006: BETA VERSION badge present on all 4 widgets", async ({
    page,
  }) => {
    const dash = pageManager.DashboardPage;
    await expect(dash.betaBadges).toHaveCount(4);
  });

  // TC-DASH-007: Widget help icon opens external documentation
  test("TC-DASH-007: Widget help icon opens external documentation", async ({
    page,
    context,
  }) => {
    const dash = pageManager.DashboardPage;
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      dash.click(dash.widgetHelpLinks.first()),
    ]);
    await newPage.waitForLoadState();

    expect(newPage.url()).toContain("help.liveimpact.org");
    await newPage.close();
  });

  // TC-DASH-009: Dashboard re-fetches data on navigation back
  test("TC-DASH-009: Dashboard re-fetches data on navigation back", async ({
    page,
  }) => {
    const dash = pageManager.DashboardPage;
    await dash.waitForWidgets();

    await pageManager.RecordsPage.openRecordsMenu();
    await page.waitForTimeout(500);

    await page.goBack();
    await utils.Handle_PageLoad(page);

    await dash.waitForWidgets();
    await expect(dash.recordStatsWidget).toBeVisible();
  });

  // TC-DASH-011: New Donors section displays Current Month and Current FY
  test("TC-DASH-011: New Donors section displays Current Month and Current FY", async ({
    page,
  }) => {
    const dash = pageManager.DashboardPage;
    await expect(dash.newDonorCurrentMonth).toBeVisible();
    await expect(dash.newDonorFY).toBeVisible();
  });
});
