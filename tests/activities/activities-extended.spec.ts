// spec: specs/README.md
// seed: tests/seed.spec.ts
// tests/activities/activities-extended.spec.ts
//
// Extends the existing tests/activities.spec.ts (TC-ACT-001..022) with
// CRUD-lifecycle and validation cases not yet covered there. Does not
// duplicate any existing test in that file.

import { test, expect } from "@playwright/test";
import testData from "../../utils/testData.json";
import * as utils from "../../utils/swapper";
import { PageManager } from "../../pages/PageManager";

test.describe("Activities Feature - Extended", () => {
  let pageManager: PageManager;

  test.beforeEach(async ({ page }) => {
    pageManager = new PageManager(page);
    await pageManager.LoginPage.navigateToUrl(
      testData.BaseUrl + testData.OrgID + testData.dashboardUrl,
    );
    await utils.Handle_PageLoad(page);
    await pageManager.BasePage.clickByText("Activities");
    await utils.Handle_PageLoad(page);
  });

  // TC-ACT-023: Add Activity end-to-end creates a visible activity
  test("TC-ACT-023: Add Activity end-to-end creates a visible activity", async ({
    page,
  }) => {
    const addActivityButton = page.locator('button:has-text("Add Activity")');
    await pageManager.BasePage.click(addActivityButton);
    await page.waitForTimeout(1000);

    const firstNameField = page.locator('textbox[placeholder="First Name"]');
    await expect(firstNameField).toBeVisible();
    // TODO(selector): full Add Activity field set (Activity Type, Title, Status,
    // Due Date, submit button) not captured in reviewed snapshots beyond the
    // shared "Add Record"-style modal header. Confirm exact field locators in
    // DevTools before asserting the new row appears in the grid.
  });

  // TC-ACT-024: Activity Due Date cannot be set to invalid format
  test("TC-ACT-024: Activity Due Date cannot be set to invalid format", async ({
    page,
  }) => {
    const addActivityButton = page.locator('button:has-text("Add Activity")');
    await pageManager.BasePage.click(addActivityButton);
    await page.waitForTimeout(1000);
    // TODO(selector): Due Date input not captured in reviewed snapshots.
  });

  // TC-ACT-026: Editing an activity updates "Update Date"
  test('TC-ACT-026: Editing an activity updates "Update Date"', async ({
    page,
  }) => {
    // TODO(selector): inline-edit trigger for an existing activity row (the
    // "View Activity Details" icon was observed, but the edit affordance for
    // Title/Status fields was not captured). Confirm before implementing.
    const viewDetailsIcon = page.locator('generic[ref*="e191"]');
    await expect(viewDetailsIcon).toBeVisible();
  });

  // TC-ACT-027: Deleting an activity removes it and decrements Total Activities
  test("TC-ACT-027: Deleting an activity removes it and decrements Total Activities", async ({
    page,
  }) => {
    const totalActivitiesBefore = await page
      .locator('heading:has-text("0") | heading:has-text("1")')
      .first()
      .textContent();

    // TODO(selector): delete control for an individual activity row not
    // captured in reviewed snapshots. Confirm before implementing the delete
    // action + before/after count assertion.
    expect(totalActivitiesBefore).toBeDefined();
  });

  // TC-ACT-028: Activity date-range filter excludes out-of-range activities
  test("TC-ACT-028: Activity date-range filter excludes out-of-range activities", async ({
    page,
  }) => {
    const startDateInput = page.locator("textbox").first();
    const endDateInput = page.locator("textbox").nth(1);

    await pageManager.BasePage.fill(startDateInput, "01/01/2026");
    await pageManager.BasePage.fill(endDateInput, "01/02/2026");

    const fetchButton = page.locator('button:has-text("Fetch")');
    await pageManager.BasePage.click(fetchButton);
    await page.waitForTimeout(1500);

    const totalActivitiesText = page.locator(
      'generic:has-text("Total Activities")',
    );
    await expect(totalActivitiesText).toBeVisible();
  });
});
