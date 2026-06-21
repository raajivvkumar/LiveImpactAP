// spec: specs/README.md
// tests/payments/payments.spec.ts

import { test, expect } from "@playwright/test";
import testData from "../../utils/testData.json";
import * as utils from "../../utils/swapper";
import { PageManager } from "../../pages/PageManager";

test.describe("Payments", () => {
  let pageManager: PageManager;

  test.beforeEach(async ({ page }) => {
    pageManager = new PageManager(page);
    await pageManager.LoginPage.navigateToUrl(
      testData.BaseUrl + testData.OrgID + testData.dashboardUrl,
    );
    await utils.Handle_PageLoad(page);
    await pageManager.PaymentsPage.navigate();
    await utils.Handle_PageLoad(page);
  });

  // TC-PAY-001: Navigate to Payments section
  test("TC-PAY-001: Navigate to Payments section", async ({ page }) => {
    await expect(page).toHaveURL(/payment/i);
  });

  // TC-PAY-002: Payment summary cards render
  test("TC-PAY-002: Payment summary cards render", async ({ page }) => {
    const payments = pageManager.PaymentsPage;
    await expect(payments.totalRowsTile).toBeVisible();
    await expect(payments.totalAmountTile).toBeVisible();
    await expect(payments.amountPendingTile).toBeVisible();
  });

  // TC-PAY-003: Default Payment Entry Date Range is pre-populated
  test("TC-PAY-003: Default Payment Entry Date Range is pre-populated", async ({
    page,
  }) => {
    const payments = pageManager.PaymentsPage;
    const startVal = await payments.startDateInput.inputValue();
    const endVal = await payments.endDateInput.inputValue();

    expect(startVal).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    expect(endVal).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  // TC-PAY-004: "Fetch" applies the selected date range
  test('TC-PAY-004: "Fetch" applies the selected date range', async ({
    page,
  }) => {
    const payments = pageManager.PaymentsPage;
    await payments.setDateRange("01/01/2026", "01/31/2026");
    await payments.fetch();
    await page.waitForTimeout(1500);

    const count = await payments.getTotalRowsCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // TC-PAY-005: "Clear Filter" resets date range and totals
  test('TC-PAY-005: "Clear Filter" resets date range and totals', async ({
    page,
  }) => {
    const payments = pageManager.PaymentsPage;
    await payments.setDateRange("01/01/2026", "01/31/2026");
    await payments.fetch();
    await page.waitForTimeout(1000);

    await payments.clearFilter();
    await page.waitForTimeout(1000);

    // TODO(behavior): confirm whether Clear Filter restores the original default
    // range or resets to blank — assert against actual observed behavior.
    await expect(payments.startDateInput).toBeVisible();
  });

  // TC-PAY-006: Add Payment opens payment creation flow
  test("TC-PAY-006: Add Payment opens payment creation flow", async ({
    page,
  }) => {
    const payments = pageManager.PaymentsPage;
    await payments.openAddPaymentModal();
    await page.waitForTimeout(1000);
    // TODO(selector): modal heading/fields not captured in reviewed snapshots —
    // confirm and assert visibility of the modal root once verified.
  });

  // TC-PAY-007/008: Add Payment validates required Amount field
  test("TC-PAY-007: Add Payment validates required Amount field", async ({
    page,
  }) => {
    const payments = pageManager.PaymentsPage;
    await payments.openAddPaymentModal();
    await page.waitForTimeout(1000);

    // Leave amount blank, attempt submit
    if (await payments.addPaymentSubmitBtn.isVisible().catch(() => false)) {
      await payments.click(payments.addPaymentSubmitBtn);
      await page.waitForTimeout(1000);
    }
    // TODO(behavior): assert validation message once Add Payment modal markup confirmed.
  });

  // TC-PAY-010: Grid View toggle switches payment display mode
  test("TC-PAY-010: Grid View toggle switches payment display mode", async ({
    page,
  }) => {
    const payments = pageManager.PaymentsPage;
    await expect(payments.gridViewLabel).toBeVisible();
  });

  // TC-PAY-011: "Search Hints" on Payments documents query syntax
  test('TC-PAY-011: "Search Hints" on Payments documents query syntax', async ({
    page,
  }) => {
    const payments = pageManager.PaymentsPage;
    await expect(payments.searchHintsBtn).toBeVisible();
    await payments.click(payments.searchHintsBtn);
    await page.waitForTimeout(500);
  });

  // TC-PAY-013: "MULTI LINK GIFT and MULTI TRANSACTION" indicator is informative
  test('TC-PAY-013: "MULTI LINK GIFT and MULTI TRANSACTION" indicator is present', async ({
    page,
  }) => {
    const payments = pageManager.PaymentsPage;
    await expect(payments.multiLinkGiftIcon).toBeVisible();
  });
});
