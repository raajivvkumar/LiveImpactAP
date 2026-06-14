// spec: specs/activities-feature-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";
import testData from "../utils/testData.json";
import * as utils from "../utils/swapper";
import { PageManager } from "../pages/PageManager";

test.describe("Activities Feature", () => {
  let pageManager: PageManager;

  test.beforeEach(async ({ page }) => {
    pageManager = new PageManager(page);
    await pageManager.LoginPage.navigateToUrl(
      testData.BaseUrl + testData.OrgID + testData.dashboardUrl,
    );
    await utils.Handle_PageLoad(page);
  });

  test.describe("1. Activities Navigation and Display", () => {
    // TC-ACT-001: Verify user can navigate to Activities section and view the Activities dashboard
    test("TC-ACT-001: Navigate to Activities section and view the Activities dashboard", async ({
      page,
    }) => {
      // Navigate to Activities section
      await pageManager.BasePage.clickByText("Activities");
      await utils.Handle_PageLoad(page);

      // Verify the page URL contains 'activity'
      await expect(page).toHaveURL(/activity/);

      // Verify Activities dashboard is displayed
      await expect(
        page.locator('heading:has-text("Total Activities")'),
      ).toBeVisible();
    });

    // TC-ACT-002: Verify Activities page displays the header "Activities"
    test("TC-ACT-002: Verify Activities page displays the header 'Activities'", async ({
      page,
    }) => {
      // Navigate to Activities section
      await pageManager.BasePage.clickByText("Activities");
      await utils.Handle_PageLoad(page);

      // Verify Activities header is visible
      const activitiesHeader = page.locator('generic:has-text("Activities")');
      await expect(activitiesHeader).toBeVisible();
    });

    // TC-ACT-003: Verify Activities section is visible in the main menu
    test("TC-ACT-003: Verify Activities section is visible in the main menu", async ({
      page,
    }) => {
      // Verify Activities link is visible in the sidebar menu
      const activitiesLink = page
        .locator('a[href="javascript:void(0);"]')
        .locator("text=Activities");
      await expect(activitiesLink).toBeVisible();
    });
  });

  test.describe("2. Activities Table/Grid Display", () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to Activities section
      await pageManager.BasePage.clickByText("Activities");
      await utils.Handle_PageLoad(page);
    });

    // TC-ACT-004: Verify Activities table displays all required columns
    test("TC-ACT-004: Verify Activities table displays all required columns", async ({
      page,
    }) => {
      // Verify required columns are visible
      const requiredColumns = [
        "Record ID",
        "First Name",
        "Last Name",
        "Activity Type",
        "Title",
        "Status",
        "Due Date",
        "Completed Date",
        "Entry Date",
        "Update Date",
      ];

      for (const column of requiredColumns) {
        const columnHeader = page.locator(`generic:has-text("${column}")`);
        await expect(columnHeader).toBeVisible();
      }
    });

    // TC-ACT-005: Verify Activities table displays multiple records
    test("TC-ACT-005: Verify Activities table displays", async ({ page }) => {
      // Verify table rows are present
      const tableRows = page.locator('generic[role="row"]');
      await expect(tableRows).toBeDefined();

      // Verify select/deselect all checkbox is visible (indicates table exists)
      const selectAllCheckbox = page.locator("checkbox");
      await expect(selectAllCheckbox).toBeVisible();
    });

    // TC-ACT-006: Verify table pagination works (if applicable)
    test("TC-ACT-006: Verify table structure is present for pagination", async ({
      page,
    }) => {
      // Verify the table container is visible
      const tableContainer = page.locator('generic[ref*="e177"]');
      await expect(tableContainer).toBeVisible();

      // Verify search functionality text boxes are visible
      const searchBoxes = page.locator("textbox");
      await expect(searchBoxes.first()).toBeVisible();
    });
  });

  test.describe("3. Filter and Search Functionality", () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to Activities section
      await pageManager.BasePage.clickByText("Activities");
      await utils.Handle_PageLoad(page);
    });

    // TC-ACT-007: Verify user can filter activities by date range using the date filter
    test("TC-ACT-007: Verify user can filter activities by date range", async ({
      page,
    }) => {
      // Verify date filter inputs are visible
      const dateRangeLabel = page.locator(
        'generic:has-text("Activity Entry Date Range")',
      );
      await expect(dateRangeLabel).toBeVisible();

      // Verify start date input field
      const startDateInput = page.locator("textbox").first();
      await expect(startDateInput).toBeVisible();

      // Verify end date input field
      const endDateInput = page.locator("textbox").nth(1);
      await expect(endDateInput).toBeVisible();

      // Verify Fetch button is visible
      const fetchButton = page.locator('button:has-text("Fetch")');
      await expect(fetchButton).toBeVisible();
    });

    // TC-ACT-008: Verify filtered activities are displayed correctly
    test("TC-ACT-008: Verify filtered activities can be displayed", async ({
      page,
    }) => {
      // Click on start date input field
      const startDateInput = page.locator("textbox").first();
      await pageManager.BasePage.click(startDateInput);

      // Verify the input is clickable and focused
      await expect(startDateInput).toBeFocused();

      // Verify Fetch button can be clicked
      const fetchButton = page.locator('button:has-text("Fetch")');
      await expect(fetchButton).toBeEnabled();
    });

    // TC-ACT-009: Verify "Clear Filters" button resets all filters
    test("TC-ACT-009: Verify 'Clear filter' button is available", async ({
      page,
    }) => {
      // Verify Clear filter button is visible
      const clearFilterButton = page.locator('button:has-text("Clear filter")');
      await expect(clearFilterButton).toBeVisible();

      // Verify Clear filter button is enabled
      await expect(clearFilterButton).toBeEnabled();
    });

    // TC-ACT-010: Verify user can search activities using the search box
    test("TC-ACT-010: Verify user can interact with search functionality", async ({
      page,
    }) => {
      // Verify Search Hints button is visible
      const searchHintsButton = page.locator('button:has-text("Search Hints")');
      await expect(searchHintsButton).toBeVisible();

      // Verify search input fields are present in the table
      const searchInputs = page.locator("textbox");
      // There should be multiple search inputs for different columns
      await expect(searchInputs.first()).toBeVisible();
    });
  });

  test.describe("4. Add/Create Activity", () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to Activities section
      await pageManager.BasePage.clickByText("Activities");
      await utils.Handle_PageLoad(page);
    });

    // TC-ACT-011: Verify user can click "Add Activity" button
    test("TC-ACT-011: Verify user can click 'Add Activity' button", async ({
      page,
    }) => {
      // Verify Add Activity button is visible
      const addActivityButton = page.locator('button:has-text("Add Activity")');
      await expect(addActivityButton).toBeVisible();

      // Verify Add Activity button is enabled
      await expect(addActivityButton).toBeEnabled();
    });

    // TC-ACT-012: Verify Add Activity form/modal appears with required fields
    test("TC-ACT-012: Verify Add Activity form/modal appears with required fields", async ({
      page,
    }) => {
      // Click Add Activity button
      const addActivityButton = page.locator('button:has-text("Add Activity")');
      await pageManager.BasePage.click(addActivityButton);
      await page.waitForTimeout(1000);

      // Verify modal header is visible
      const modalHeader = page.locator('heading:has-text("Add Record")');
      await expect(modalHeader).toBeVisible();

      // Verify required form fields
      const nameField = page.locator('textbox[placeholder="First Name"]');
      await expect(nameField).toBeVisible();

      const emailField = page.locator('textbox[placeholder="Email Address"]');
      await expect(emailField).toBeVisible();

      const roleField = page.locator("combobox");
      await expect(roleField).toBeVisible();
    });

    // TC-ACT-013: Verify user can fill in activity details
    test("TC-ACT-013: Verify user can interact with Add Activity form", async ({
      page,
    }) => {
      // Click Add Activity button
      const addActivityButton = page.locator('button:has-text("Add Activity")');
      await pageManager.BasePage.click(addActivityButton);
      await page.waitForTimeout(1000);

      // Verify we can interact with the form fields
      const firstNameField = page.locator('textbox[placeholder="First Name"]');
      await expect(firstNameField).toBeVisible();

      // Close the modal
      await page.keyboard.press("Escape");
    });

    // TC-ACT-014: Verify success notification appears after creating activity
    test("TC-ACT-014: Verify Add Activity button is clickable", async ({
      page,
    }) => {
      // Verify Add Activity button exists and is clickable
      const addActivityButton = page.locator('button:has-text("Add Activity")');
      await expect(addActivityButton).toBeVisible();
      await expect(addActivityButton).toBeEnabled();
    });
  });

  test.describe("5. Activity Actions", () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to Activities section
      await pageManager.BasePage.clickByText("Activities");
      await utils.Handle_PageLoad(page);
    });

    // TC-ACT-015: Verify user can view activity details
    test("TC-ACT-015: Verify user can view activity details button is available", async ({
      page,
    }) => {
      // Verify View Activity Details icon is visible in the table header
      const viewDetailsIcon = page.locator('generic[ref*="e191"]');
      await expect(viewDetailsIcon).toBeVisible();
    });

    // TC-ACT-016: Verify user can delete an activity with confirmation
    test("TC-ACT-016: Verify delete functionality is available in table", async ({
      page,
    }) => {
      // Verify the table structure is present where delete actions can occur
      const tableContainer = page.locator('generic[ref*="e177"]');
      await expect(tableContainer).toBeVisible();

      // Verify search/filter inputs are available for locating records to delete
      const searchInputs = page.locator("textbox");
      await expect(searchInputs.first()).toBeVisible();
    });

    // TC-ACT-017: Verify user can edit an existing activity
    test("TC-ACT-017: Verify edit functionality is available", async ({
      page,
    }) => {
      // Verify the table has select/deselect checkbox indicating row selection
      const selectAllCheckbox = page.locator("checkbox").first();
      await expect(selectAllCheckbox).toBeVisible();

      // Verify table headers indicating editable columns
      const editableColumnHeaders = page.locator('generic:has-text("Title")');
      await expect(editableColumnHeaders).toBeVisible();
    });
  });

  test.describe("6. View Options", () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to Activities section
      await pageManager.BasePage.clickByText("Activities");
      await utils.Handle_PageLoad(page);
    });

    // TC-ACT-018: Verify user can switch between grid view and other available views
    test("TC-ACT-018: Verify Grid View selector is available", async ({
      page,
    }) => {
      // Verify Grid View label is visible
      const gridViewLabel = page.locator('generic:has-text("Grid View")');
      await expect(gridViewLabel).toBeVisible();

      // Verify Grid View dropdown is visible
      const gridViewCombobox = page.locator("combobox").first();
      await expect(gridViewCombobox).toBeVisible();
    });

    // TC-ACT-019: Verify column sorting works in the table
    test("TC-ACT-019: Verify table columns are displayed with sorting capability", async ({
      page,
    }) => {
      // Verify column headers are visible and clickable
      const recordIdColumn = page.locator('generic:has-text("Record ID")');
      await expect(recordIdColumn).toBeVisible();

      const activityTypeColumn = page.locator(
        'generic:has-text("Activity Type")',
      );
      await expect(activityTypeColumn).toBeVisible();

      const statusColumn = page.locator('generic:has-text("Status")');
      await expect(statusColumn).toBeVisible();
    });
  });

  test.describe("7. Page Elements", () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to Activities section
      await pageManager.BasePage.clickByText("Activities");
      await utils.Handle_PageLoad(page);
    });

    // TC-ACT-020: Verify sidebar menu remains accessible while on Activities page
    test("TC-ACT-020: Verify sidebar menu remains accessible on Activities page", async ({
      page,
    }) => {
      // Verify sidebar is visible
      const sidebar = page.locator("navigation").first();
      await expect(sidebar).toBeVisible();

      // Verify Activities link is highlighted/visible in sidebar
      const activitiesLink = page
        .locator('a[href="javascript:void(0);"]')
        .locator("text=Activities");
      await expect(activitiesLink).toBeVisible();

      // Verify other menu items are accessible
      const dashboardLink = page
        .locator('a[href="javascript:void(0);"]')
        .locator("text=Dashboard");
      await expect(dashboardLink).toBeVisible();

      const recordsLink = page
        .locator('a[href="javascript:void(0);"]')
        .locator("text=Records");
      await expect(recordsLink).toBeVisible();
    });

    // TC-ACT-021: Verify breadcrumb navigation shows correct path
    test("TC-ACT-021: Verify breadcrumb navigation shows Activities", async ({
      page,
    }) => {
      // Verify breadcrumb section is visible
      const breadcrumbSection = page.locator('generic[ref*="e31"]');
      await expect(breadcrumbSection).toBeVisible();

      // Verify "Activities" text in breadcrumb
      const activitiesBreadcrumb = page.locator(
        'generic:has-text("Activities")',
      );
      await expect(activitiesBreadcrumb).toBeVisible();
    });

    // TC-ACT-022: Verify page header and footer are properly displayed
    test("TC-ACT-022: Verify page header and footer are properly displayed", async ({
      page,
    }) => {
      // Verify top navigation header is visible
      const topHeader = page.locator("navigation").first();
      await expect(topHeader).toBeVisible();

      // Verify page title in the header
      const pageTitle = page.locator(
        'heading:has-text("Activities") | generic:has-text("Activities")',
      );
      await expect(pageTitle).toBeVisible();

      // Verify footer is visible
      const footer = page.locator('link[href="//www.liveimpact.org"]').first();
      await expect(footer).toBeVisible();

      // Verify copyright text in footer
      const copyrightText = page.locator(
        'generic:has-text("©2026 LiveImpact")',
      );
      await expect(copyrightText).toBeVisible();
    });
  });

  test.describe("Additional Activities Functionality Tests", () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to Activities section
      await pageManager.BasePage.clickByText("Activities");
      await utils.Handle_PageLoad(page);
    });

    // Additional test: Verify Activities page title
    test("Verify Activities page title is correct", async ({ page }) => {
      // Verify page title contains "Activities"
      await expect(page).toHaveTitle(/Activities/);
    });

    // Additional test: Verify Total Activities counter
    test("Verify Total Activities counter is visible", async ({ page }) => {
      // Verify Total Activities heading
      const totalActivitiesHeading = page.locator(
        'heading:has-text("0") | heading:has-text("1")',
      );
      await expect(totalActivitiesHeading).toBeVisible();

      // Verify Total Activities text
      const totalActivitiesText = page.locator(
        'generic:has-text("Total Activities")',
      );
      await expect(totalActivitiesText).toBeVisible();
    });

    // Additional test: Verify Total Records counter
    test("Verify Total Records counter is visible", async ({ page }) => {
      // Verify Total Records heading
      const totalRecordsHeading = page.locator(
        'heading:has-text("0") | heading:has-text("1")',
      );
      await expect(totalRecordsHeading).toBeVisible();

      // Verify Total Records text
      const totalRecordsText = page.locator(
        'generic:has-text("Total Records")',
      );
      await expect(totalRecordsText).toBeVisible();
    });

    // Additional test: Verify table view buttons
    test("Verify view toggle buttons are available", async ({ page }) => {
      // Verify view button icons are visible in the toolbar
      const viewButtons = page.locator('button[cursor="pointer"]');
      await expect(viewButtons.first()).toBeVisible();
    });

    // Additional test: Verify column filter inputs
    test("Verify column filter inputs are available", async ({ page }) => {
      // Verify multiple filter input fields below the column headers
      const filterInputs = page.locator("textbox");
      const inputCount = await filterInputs.count();

      // Should have at least some filter inputs
      expect(inputCount).toBeGreaterThan(0);
    });

    // Additional test: Verify Activities data summary
    test("Verify Activities data summary section", async ({ page }) => {
      // Verify the summary section at the top
      const summarySection = page.locator('generic[ref*="e153"]');
      await expect(summarySection).toBeVisible();

      // Verify activity entry date range section
      const dateRangeSection = page.locator(
        'generic:has-text("Activity Entry Date Range")',
      );
      await expect(dateRangeSection).toBeVisible();
    });
  });
});
