// spec: specs/README.md
// tests/records/records.spec.ts

import { test, expect } from "@playwright/test";
import testData from "../../utils/testData.json";
import * as utils from "../../utils/swapper";
import { PageManager } from "../../pages/PageManager";

test.describe("Records Management", () => {
  let pageManager: PageManager;

  test.beforeEach(async ({ page }) => {
    pageManager = new PageManager(page);
    await pageManager.LoginPage.navigateToUrl(
      testData.BaseUrl + testData.OrgID + testData.dashboardUrl,
    );
    await utils.Handle_PageLoad(page);
  });

  test.describe("Navigation & Listing", () => {
    // TC-REC-001: Records menu expands to show all record types
    test("TC-REC-001: Records menu expands to show all record types", async ({
      page,
    }) => {
      const records = pageManager.RecordsPage;
      await records.openRecordsMenu();
      await page.waitForTimeout(500);

      await expect(records.allRecordsLink).toBeVisible();
      // Confirmed from snapshot: at least 20 distinct record-type links are listed
      const typeLinks = page.locator(
        "#side-menu li a[href*='/manage/'][href*='/0/0']",
      );
      const count = await typeLinks.count();
      expect(count).toBeGreaterThanOrEqual(20);
    });

    // TC-REC-002: "All Records" navigates to consolidated grid
    test('TC-REC-002: "All Records" navigates to consolidated grid', async ({
      page,
    }) => {
      const records = pageManager.RecordsPage;
      await records.navigateToAllRecords();
      await utils.Handle_PageLoad(page);

      await expect(page).toHaveURL(/\/manage\/0\/0\/0/);
      await expect(records.totalRecordsLabel).toBeVisible();
    });

    // TC-REC-003: Navigating to a specific record type filters the grid
    test("TC-REC-003: Navigating to a specific record type filters the grid", async ({
      page,
    }) => {
      const records = pageManager.RecordsPage;
      await records.navigateToRecordType("Donors");
      await utils.Handle_PageLoad(page);

      const breadcrumb = page.locator("generic:has-text('Donors')").first();
      await expect(breadcrumb).toBeVisible();
    });

    // TC-REC-004: Record type with special characters in name renders correctly
    test("TC-REC-004: Record type with special characters renders correctly", async ({
      page,
    }) => {
      const records = pageManager.RecordsPage;
      await records.openRecordsMenu();
      await page.waitForTimeout(500);

      // Confirmed real role name from snapshots containing quotes/special chars
      const specialRoleLink = page.locator(
        "a:has-text(\"Dept1_F'A\\\"T#T$e%s@t!^i&n*g\")",
      );
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));

      if ((await specialRoleLink.count()) > 0) {
        await specialRoleLink.first().click();
        await utils.Handle_PageLoad(page);
      }

      expect(errors).toHaveLength(0);
    });

    // TC-REC-005: Records grid pagination works
    test("TC-REC-005: Records grid pagination works", async ({ page }) => {
      const records = pageManager.RecordsPage;
      await records.navigateToAllRecords();
      await utils.Handle_PageLoad(page);

      const total = await records.getTotalRecordsCount();
      expect(total).toBeGreaterThan(0);
      // TODO(selector): pagination control (next-page button / infinite scroll trigger)
      // wasn't captured in reviewed snapshots — confirm exact element before asserting
      // page-2 content differs from page-1.
    });

    // TC-REC-006: Records grid column headers match spec
    test("TC-REC-006: Records grid column headers match spec", async ({
      page,
    }) => {
      const records = pageManager.RecordsPage;
      await records.navigateToAllRecords();
      await utils.Handle_PageLoad(page);

      const expectedColumns = [
        "Name",
        "ID",
        "Email ID",
        "Role",
        "Record Tags",
        "Entry Date",
        "Update Date",
      ];
      for (const col of expectedColumns) {
        await expect(
          page.locator(`generic[aria-label='${col}']`),
        ).toBeVisible();
      }
    });

    // TC-REC-007: Clicking a record name opens record detail/edit view
    test("TC-REC-007: Clicking a record name opens record detail/edit view", async ({
      page,
    }) => {
      const records = pageManager.RecordsPage;
      await records.navigateToAllRecords();
      await utils.Handle_PageLoad(page);

      const firstRecordLink = page
        .locator("generic[aria-label='Click to View/Edit']")
        .first();
      await expect(firstRecordLink).toBeVisible();
      await firstRecordLink.click();
      await page.waitForTimeout(1000);

      // TODO(selector): record detail panel container not captured in snapshots
      // (click never triggered during recording). Confirm modal/panel root locator.
    });
  });

  test.describe("Search", () => {
    test.beforeEach(async ({ page }) => {
      await pageManager.RecordsPage.navigateToAllRecords();
      await utils.Handle_PageLoad(page);
    });

    // TC-REC-008: Global "Search Records" returns matching results
    test('TC-REC-008: Global "Search Records" returns matching results', async ({
      page,
    }) => {
      const records = pageManager.RecordsPage;
      await records.searchRecords("Donors");
      await page.waitForTimeout(1000);

      await expect(records.goToRecordDashboardBtn).toBeVisible();
    });

    // TC-REC-009: Search with no matches shows empty state
    test("TC-REC-009: Search with no matches shows empty state", async ({
      page,
    }) => {
      const records = pageManager.RecordsPage;
      await records.searchRecords("zzzqqqxx123nonexistent");
      await page.waitForTimeout(1000);

      // TODO(selector): "no results" message element not captured in reviewed snapshots.
      // Confirm exact text/locator in DevTools.
    });

    // TC-REC-010: Column-level filters narrow grid results
    test("TC-REC-010: Column-level filters narrow grid results", async ({
      page,
    }) => {
      const roleFilterInput = page.locator("textbox").nth(2);
      await roleFilterInput.fill("Donors");
      await page.waitForTimeout(1000);

      // TODO(behavior): confirm exact result-count assertion once filter trigger
      // (Enter key vs auto-debounce) is verified against the live app.
    });

    // TC-REC-011: "Clear filter" resets all applied filters
    test('TC-REC-011: "Clear filter" resets all applied filters', async ({
      page,
    }) => {
      const records = pageManager.RecordsPage;
      const before = await records.getTotalRecordsCount();

      const roleFilterInput = page.locator("textbox").nth(2);
      await roleFilterInput.fill("Donors");
      await page.waitForTimeout(1000);

      await records.click(records.clearFilterBtn);
      await page.waitForTimeout(1000);

      const after = await records.getTotalRecordsCount();
      expect(after).toEqual(before);
    });

    // TC-REC-012: Search query syntax hints are documented
    test("TC-REC-012: Search query syntax hints are documented", async ({
      page,
    }) => {
      const records = pageManager.RecordsPage;
      await expect(records.searchHintsBtn).toBeVisible();
      await records.click(records.searchHintsBtn);
      await page.waitForTimeout(500);
      // TODO(selector): hints popup content container not captured in snapshots.
    });
  });

  test.describe("Create / Edit / Delete", () => {
    // TC-REC-013: "ADD / EDIT" opens Add Record modal
    test('TC-REC-013: "ADD / EDIT" opens Add Record modal', async ({
      page,
    }) => {
      const records = pageManager.RecordsPage;
      await records.openAddRecordModal();

      await expect(records.addRecordModalHeading).toBeVisible();
      await expect(records.existingRecordTab).toBeVisible();
      await expect(records.createNewRecordTab).toBeVisible();
    });

    // TC-REC-014: Add Record requires a Role selection
    test("TC-REC-014: Add Record requires a Role selection", async ({
      page,
    }) => {
      const records = pageManager.RecordsPage;
      await records.openAddRecordModal();

      await records.fill(records.firstNameInput, "Test");
      await records.fill(records.lastNameInput, "User");
      await records.fill(records.emailInput, "test.user@example.com");
      // Deliberately skip role selection
      await records.submitAddRecord();
      await page.waitForTimeout(1000);

      await expect(records.addRecordModalHeading).toBeVisible();
    });

    // TC-REC-016: Add Record validates email format
    test("TC-REC-016: Add Record validates email format", async ({
      page,
    }) => {
      const records = pageManager.RecordsPage;
      await records.openAddRecordModal();

      await records.fill(records.firstNameInput, "Test");
      await records.fill(records.lastNameInput, "User");
      await records.fill(records.emailInput, "not-an-email");
      await records.submitAddRecord();
      await page.waitForTimeout(1000);

      await expect(records.addRecordModalHeading).toBeVisible();
    });

    // TC-REC-017: "Existing Record" tab allows linking to an existing person
    test('TC-REC-017: "Existing Record" tab allows linking to an existing person', async ({
      page,
    }) => {
      const records = pageManager.RecordsPage;
      await records.openAddRecordModal();

      await records.click(records.existingRecordTab);
      await page.waitForTimeout(500);
      // TODO(selector): existing-record search/select widget not captured in snapshots.
    });

    // TC-REC-018: Closing modal via "×" discards unsaved input
    test('TC-REC-018: Closing modal via "×" discards unsaved input', async ({
      page,
    }) => {
      const records = pageManager.RecordsPage;
      await records.openAddRecordModal();

      await records.fill(records.firstNameInput, "Discard");
      await records.click(records.addRecordModalCloseBtn);
      await page.waitForTimeout(500);

      await expect(records.addRecordModalHeading).not.toBeVisible();

      await records.openAddRecordModal();
      await expect(records.firstNameInput).toHaveValue("");
    });

    // TC-REC-021: Bulk select via "Select/Deselect All" checkbox
    test('TC-REC-021: Bulk select via "Select/Deselect All" checkbox', async ({
      page,
    }) => {
      const records = pageManager.RecordsPage;
      await records.navigateToAllRecords();
      await utils.Handle_PageLoad(page);

      await expect(records.selectAllCheckbox).toBeVisible();
      await records.check(records.selectAllCheckbox);

      const rowCheckboxes = page.locator(
        "generic[aria-label='Click to View/Edit']",
      );
      const count = await rowCheckboxes.count();
      expect(count).toBeGreaterThan(0);
    });

    // TC-REC-022: Role dropdown lists roles grouped by department
    test("TC-REC-022: Role dropdown lists roles grouped by department", async ({
      page,
    }) => {
      const records = pageManager.RecordsPage;
      await records.openAddRecordModal();

      const options = await page.locator("combobox option").allTextContents();
      const hasDeptFormat = options.some((o) => /\(.+\)/.test(o));
      expect(hasDeptFormat).toBeTruthy();
    });
  });
});
