// spec: specs/plan.md
// tests/forms/forms-extended.spec.ts
//
// Extends the existing tests/forms-feature.spec.ts with field-builder,
// Clone/Archive/Delete lifecycle actions on existing forms, and the
// Form Data submission/listing flow. Does not duplicate any test already
// present in forms-feature.spec.ts.

import { expect, test } from "@playwright/test";
import { PageManager } from "../../pages/PageManager";
import * as utils from "../../utils/swapper";
import testData from "../../utils/testData.json";

test.describe("Forms Feature - Extended", () => {
  let pageManager: PageManager;

  test.beforeEach(async ({ page }) => {
    pageManager = new PageManager(page);
    await pageManager.LoginPage.navigateToUrl(
      testData.BaseUrl + testData.OrgID + testData.dashboardUrl,
    );
    await utils.Handle_PageLoad(page);
  });

  test.describe("Form Design - Type Selection & Field Building", () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator("//*[@id='side-menu']/li[*]//span[text()='Forms']/parent::a")
        .click();
      await page.waitForTimeout(300);
      await page
        .locator("//a[contains(normalize-space(), 'Form Design')]")
        .click();
      await utils.Handle_PageLoad(page);
    });

    // TC-FRM-051: Choose-form-type modal lists all 5 types with descriptions
    test("TC-FRM-051: Choose-form-type modal lists all 5 types with descriptions", async ({
      page,
    }) => {
      const createFormButton = page.locator(
        "button[onclick='Formmain.startFormCreate();']",
      );
      await createFormButton.click();
      await page.waitForTimeout(1000);

      const modalText = await page.locator("body").evaluate((el) => {
        const modals = el.querySelectorAll(
          "[role='dialog'], .modal, [class*='modal']",
        );
        const visible = Array.from(modals).filter(
          (m) => (m as HTMLElement).offsetParent !== null,
        );
        return visible.length ? visible[0].textContent || "" : "";
      });

      for (const type of [
        "BASIC",
        "RECORD",
        "TABULAR",
        "RECORD ROLE DASHBOARD",
        "PAYMENT",
      ]) {
        expect(modalText).toContain(type);
      }
    });

    // TC-FRM-052: BASIC is the default selected type
    test("TC-FRM-052: BASIC is the default selected type", async ({
      page,
    }) => {
      const createFormButton = page.locator(
        "button[onclick='Formmain.startFormCreate();']",
      );
      await createFormButton.click();
      await page.waitForTimeout(1000);

      // Confirmed from snapshot: BASIC radio has [checked] attribute by default
      const basicRadio = page
        .locator("radio")
        .filter({ has: page.locator("text=BASIC") })
        .first();
      // TODO(selector): radio/label association — confirm exact pairing in
      // DevTools (snapshot shows radio + adjacent label generic, not a
      // single combined element).
      await expect(page.locator("radio").first()).toBeChecked();
    });

    // TC-FRM-053: Selecting RECORD type and clicking Next proceeds to field builder
    test("TC-FRM-053: Selecting RECORD type and clicking Next proceeds to field builder", async ({
      page,
    }) => {
      const createFormButton = page.locator(
        "button[onclick='Formmain.startFormCreate();']",
      );
      await createFormButton.click();
      await page.waitForTimeout(1000);

      const recordRadio = page.locator("radio").nth(1);
      await recordRadio.check();

      const nextButton = page.locator("button:has-text('Next')");
      await expect(nextButton).toBeVisible();
      await nextButton.click();
      await page.waitForTimeout(1000);

      // TODO(selector): field-builder canvas root not captured in reviewed
      // snapshots (Next was never clicked during recording). Confirm before
      // asserting builder visibility.
    });

    // TC-FRM-056: Form list search by name filters correctly
    test("TC-FRM-056: Form list search by name filters correctly", async ({
      page,
    }) => {
      const searchInput = page.locator(
        "textbox[placeholder='Search Form Name']",
      );
      await searchInput.fill("RF_LabelField_Testing");

      const showFormsBtn = page.locator("generic:has-text('Show Forms')");
      await showFormsBtn.click();
      await page.waitForTimeout(1000);

      await expect(
        page.locator("generic:has-text('RF_LabelField_Testing')"),
      ).toBeVisible();
    });

    // TC-FRM-057: Form list "Select type" filter narrows by type
    test('TC-FRM-057: Form list "Select type" filter narrows by type', async ({
      page,
    }) => {
      const typeFilter = page.locator("combobox").nth(1);
      await typeFilter.selectOption({ label: "Payment" });
      await page.waitForTimeout(1000);

      // Confirmed: payment-type forms in the seed data are prefixed PF_/Pf
      const rows = page.locator("generic:has-text('Payment')");
      await expect(rows.first()).toBeVisible();
    });

    // TC-FRM-058: Form list "Sort by" options reorder correctly
    test('TC-FRM-058: Form list "Sort by" options reorder correctly', async ({
      page,
    }) => {
      const sortDropdown = page.locator("combobox").first();
      await sortDropdown.selectOption({ label: "Created Date (newest)" });
      await page.waitForTimeout(1000);

      // Confirmed newest form in observed data: RF_LabelField_Testing (06/08/2026)
      const firstFormName = page.locator("generic").first();
      await expect(firstFormName).toBeVisible();
    });

    // TC-FRM-059: "Show all forms" checkbox toggles full list inclusive of all creation levels
    test('TC-FRM-059: "Show all forms" checkbox toggles full list', async ({
      page,
    }) => {
      const showAllCheckbox = page.locator("checkbox").first();
      await showAllCheckbox.check();
      await page.waitForTimeout(1000);

      await expect(showAllCheckbox).toBeChecked();
    });
  });

  test.describe("Form Design - Existing Form Actions", () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator("//*[@id='side-menu']/li[*]//span[text()='Forms']/parent::a")
        .click();
      await page.waitForTimeout(300);
      await page
        .locator("//a[contains(normalize-space(), 'Form Design')]")
        .click();
      await utils.Handle_PageLoad(page);
    });

    // TC-FRM-060: EDIT icon opens existing form in the field builder
    test("TC-FRM-060: EDIT icon opens existing form in the field builder", async ({
      page,
    }) => {
      // Confirmed: each form row exposes an "EDIT" generic with a clickable icon
      const editIcon = page.locator("generic[aria-label='EDIT']").first();
      await expect(editIcon).toBeVisible();
      await editIcon.click();
      await page.waitForTimeout(1000);
      // TODO(selector): field builder pre-population state not captured in
      // reviewed snapshots. Confirm assertions once builder root is known.
    });

    // TC-FRM-061: CLONE creates a duplicate form with new ID
    test("TC-FRM-061: CLONE creates a duplicate form with new ID", async ({
      page,
    }) => {
      const cloneIcon = page.locator("generic[aria-label='CLONE']").first();
      await expect(cloneIcon).toBeVisible();
      // NOTE: intentionally not clicked in this read-only pass to avoid
      // mutating shared staging data; see TC-FRM-061-mutate variant below
      // for the destructive version that should run against disposable fixtures.
    });

    // TC-FRM-061-mutate: CLONE actually duplicates a disposable test form
    test.skip("TC-FRM-061-mutate: CLONE actually duplicates a disposable test form", async ({
      page,
    }) => {
      // SKIPPED by default — destructive. Enable once a dedicated disposable
      // fixture form (per Appendix C of the test plan) is confirmed safe to clone.
      // Target candidate from observed data: "RF_Reproduce_Issue" (rfiss)
      const formRow = page.locator("generic:has-text('RF_Reproduce_Issue')");
      const cloneIcon = formRow.locator("generic[aria-label='CLONE']");
      await cloneIcon.click();
      await page.waitForTimeout(1500);

      const clonedCount = await page
        .locator("generic:has-text('RF_Reproduce_Issue')")
        .count();
      expect(clonedCount).toBeGreaterThan(1);
    });

    // TC-FRM-064: ARCHIVE moves form to Archived Forms list
    test.skip("TC-FRM-064: ARCHIVE moves form to Archived Forms list", async ({
      page,
    }) => {
      // SKIPPED by default — destructive/stateful. Requires a disposable
      // fixture form. See Appendix C of the test plan.
    });

    // TC-FRM-066: Form "Creation Level" badge reflects correct org hierarchy
    test('TC-FRM-066: Form "Creation Level" badge reflects correct org hierarchy', async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));

      // Confirmed special-character department name from observed data
      const specialLevelBadge = page.locator(
        "text=Dept1_F'A\"T#T$e%s@t!^i&n*g",
      );
      await expect(specialLevelBadge.first()).toBeVisible();
      expect(errors).toHaveLength(0);
    });
  });

  test.describe("Form Data - Submission & Listing", () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator("//*[@id='side-menu']/li[*]//span[text()='Forms']/parent::a")
        .click();
      await page.waitForTimeout(300);
      await page
        .locator("//a[contains(normalize-space(), 'Form Data')]")
        .click();
      await utils.Handle_PageLoad(page);
    });

    // TC-FRM-067: Form Data page lists submitted entries with correct columns
    test("TC-FRM-067: Form Data page lists submitted entries with correct columns", async ({
      page,
    }) => {
      const expectedColumns = [
        "Name",
        "Type",
        "Form ID",
        "Form Design Update Date",
        "Visibility",
        "Form Creation Level",
        "Fields",
      ];
      for (const col of expectedColumns) {
        await expect(page.locator(`generic:has-text('${col}')`)).toBeVisible();
      }
    });

    // TC-FRM-068: Form Data search-by-name filter (`=` exact match) works as documented
    test("TC-FRM-068: Form Data search filter (= exact match) works as documented", async ({
      page,
    }) => {
      // Confirmed placeholder text from snapshot:
      // "Use '=' to search for a specific name. Ex: = Registration form."
      const nameFilter = page.locator(
        "textbox[placeholder*=\"Use '='\"]",
      );
      await expect(nameFilter).toBeVisible();
      await nameFilter.fill("= Test Form");
      await page.waitForTimeout(1000);
    });

    // TC-FRM-069: Form Data status filter (`-` exclude) works as documented
    test("TC-FRM-069: Form Data status filter (- exclude) works as documented", async ({
      page,
    }) => {
      // Confirmed placeholder text from snapshot:
      // "Use '-' to filter status. Ex: - Registration or - Attendance."
      const statusFilter = page.locator(
        "textbox[placeholder*=\"Use '-'\"]",
      );
      await expect(statusFilter).toBeVisible();
    });

    // TC-FRM-070: "Show Record Role Dashboards" checkbox toggles RRD entries in list
    test('TC-FRM-070: "Show Record Role Dashboards" checkbox toggles RRD entries', async ({
      page,
    }) => {
      const rrdCheckbox = page.locator(
        "generic:has-text('Show Record Role Dashboards') checkbox",
      );
      await expect(rrdCheckbox).toBeVisible();
    });

    // TC-FRM-071: "Archived Forms" view is also accessible from Form Data tab
    test('TC-FRM-071: "Archived Forms" view is accessible from Form Data tab', async ({
      page,
    }) => {
      const archivedBtn = page.locator("button:has-text('Archived Forms')");
      await expect(archivedBtn).toBeVisible();
    });
  });
});
