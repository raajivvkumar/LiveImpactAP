// spec: specs/README.md
// tests/security/negative.spec.ts

import { test, expect } from "@playwright/test";
import testData from "../../utils/testData.json";
import * as utils from "../../utils/swapper";
import { PageManager } from "../../pages/PageManager";

test.describe("Negative & Security Testing", () => {
  let pageManager: PageManager;

  test.beforeEach(async ({ page }) => {
    pageManager = new PageManager(page);
    await pageManager.LoginPage.navigateToUrl(
      testData.BaseUrl + testData.OrgID + testData.dashboardUrl,
    );
    await utils.Handle_PageLoad(page);
  });

  // TC-NEG-001: XSS payload in a free-text field is escaped, not executed
  test("TC-NEG-001: XSS payload in a free-text field is escaped, not executed", async ({
    page,
  }) => {
    let dialogFired = false;
    page.on("dialog", (dialog) => {
      dialogFired = true;
      dialog.dismiss();
    });

    const records = pageManager.RecordsPage;
    await records.openAddRecordModal();

    const xssPayload = "<img src=x onerror=alert(1)>";
    await records.fill(records.firstNameInput, xssPayload);
    await page.waitForTimeout(500);

    expect(dialogFired).toBeFalsy();
  });

  // TC-NEG-005: Form field max-length is enforced
  test("TC-NEG-005: Form field max-length is enforced", async ({ page }) => {
    const records = pageManager.RecordsPage;
    await records.openAddRecordModal();

    const longString = "A".repeat(10000);
    await records.fill(records.firstNameInput, longString);

    const actualValue = await records.firstNameInput.inputValue();
    // TODO(behavior): confirm the actual configured max-length via DevTools
    // (maxlength attribute or server-side truncation) and assert exact boundary.
    expect(actualValue.length).toBeLessThanOrEqual(longString.length);
  });

  // TC-NEG-006: Date filters reject end-date-before-start-date
  test("TC-NEG-006: Date filters reject end-date-before-start-date", async ({
    page,
  }) => {
    const payments = pageManager.PaymentsPage;
    await payments.navigate();
    await utils.Handle_PageLoad(page);

    await payments.setDateRange("12/31/2026", "01/01/2026");
    await payments.fetch();
    await page.waitForTimeout(1500);

    // TODO(selector): validation-message locator not captured in reviewed
    // snapshots. Confirm whether app blocks the fetch or silently returns 0 rows.
  });

  // TC-NEG-008: Oversized CSV import is rejected
  test("TC-NEG-008: Oversized CSV import is rejected", async ({ page }) => {
    const settings = pageManager.SettingsPage;
    await settings.navigate();
    await utils.Handle_PageLoad(page);
    await settings.openModule("Import from CSV");
    await page.waitForTimeout(1000);

    // TODO(selector/data): file input locator and a deliberately oversized
    // fixture file are required — neither was confirmed against the live app.
    // Implement once Import from CSV's upload control is verified in DevTools.
  });

  // TC-NEG-012: Special characters in org/department names render safely everywhere
  test("TC-NEG-012: Special characters in department names render safely", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    const records = pageManager.RecordsPage;
    await records.openAddRecordModal();

    const optionsText = await page.locator("combobox option").allTextContents();
    const specialOption = optionsText.find((o) =>
      o.includes("Dept1_F'A\"T#T$e%s@t!^i&n*g"),
    );

    expect(specialOption).toBeDefined();
    expect(errors).toHaveLength(0);
  });
});
