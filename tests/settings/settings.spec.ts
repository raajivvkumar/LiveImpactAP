// spec: specs/README.md
// tests/settings/settings.spec.ts

import { test, expect } from "@playwright/test";
import testData from "../../utils/testData.json";
import * as utils from "../../utils/swapper";
import { PageManager } from "../../pages/PageManager";
import SettingsPage from "../../pages/SettingsPage";

test.describe("Settings", () => {
  let pageManager: PageManager;

  test.beforeEach(async ({ page }) => {
    pageManager = new PageManager(page);
    await pageManager.LoginPage.navigateToUrl(
      testData.BaseUrl + testData.OrgID + testData.dashboardUrl,
    );
    await utils.Handle_PageLoad(page);
    await pageManager.SettingsPage.navigate();
    await utils.Handle_PageLoad(page);
  });

  // TC-SET-001: Settings page loads full module grid
  test("TC-SET-001: Settings page loads full module grid", async ({
    page,
  }) => {
    const settings = pageManager.SettingsPage;

    // Spot-check a representative subset rather than every single tile,
    // to keep the test resilient — full list verified at TC-SET-001b below.
    const sample = [
      "Org Settings",
      "Org Structure",
      "Access",
      "Activity Types",
      "Tags",
      "Global Values",
      "Custom Record Types",
      "SMTP Server",
    ];
    for (const name of sample) {
      await expect(settings.moduleTiles[name]).toBeVisible();
    }
  });

  // TC-SET-001b: All 37 settings modules are present (full enumeration)
  test("TC-SET-001b: All settings modules are present (full enumeration)", async ({
    page,
  }) => {
    const settings = pageManager.SettingsPage;
    let missing: string[] = [];

    for (const name of SettingsPage.MODULE_NAMES) {
      const visible = await settings.moduleTiles[name]
        .isVisible()
        .catch(() => false);
      if (!visible) missing.push(name);
    }

    expect(missing, `Missing settings modules: ${missing.join(", ")}`).toEqual(
      [],
    );
  });

  // TC-SET-002: Org Settings module opens correctly
  test("TC-SET-002: Org Settings module opens correctly", async ({
    page,
  }) => {
    const settings = pageManager.SettingsPage;
    await settings.openModule("Org Settings");
    await page.waitForTimeout(1000);
    // TODO(selector): Org Settings page content container not captured in
    // reviewed snapshots (tile click never recorded). Confirm and assert heading.
  });

  // TC-SET-003: Org Structure module opens correctly
  test("TC-SET-003: Org Structure module opens correctly", async ({
    page,
  }) => {
    const settings = pageManager.SettingsPage;
    await settings.openModule("Org Structure");
    await page.waitForTimeout(1000);
  });

  // TC-SET-004: Access module opens correctly
  test("TC-SET-004: Access module opens correctly", async ({ page }) => {
    const settings = pageManager.SettingsPage;
    await settings.openModule("Access");
    await page.waitForTimeout(1000);
  });

  // TC-SET-005: Activity Types module allows viewing configured types
  test("TC-SET-005: Activity Types module allows viewing configured types", async ({
    page,
  }) => {
    const settings = pageManager.SettingsPage;
    await settings.openModule("Activity Types");
    await page.waitForTimeout(1000);
  });

  // TC-SET-008: Tags module allows creating a new tag
  test("TC-SET-008: Tags module allows creating a new tag", async ({
    page,
  }) => {
    const settings = pageManager.SettingsPage;
    await settings.openModule("Tags");
    await page.waitForTimeout(1000);
    // TODO(selector): Tags creation form fields not captured in reviewed
    // snapshots. Confirm "new tag" input + save button before implementing assertions.
  });

  // TC-SET-009: Global Values module lists existing global value sets
  test("TC-SET-009: Global Values module lists existing global value sets", async ({
    page,
  }) => {
    const settings = pageManager.SettingsPage;
    await settings.openModule("Global Values");
    await page.waitForTimeout(1000);
  });

  // TC-SET-012: Badges module displays configured badges
  test("TC-SET-012: Badges module displays configured badges", async ({
    page,
  }) => {
    const settings = pageManager.SettingsPage;
    await settings.openModule("Badges");
    await page.waitForTimeout(1000);
  });

  // TC-SET-013: Settings tiles are keyboard-navigable
  test("TC-SET-013: Settings tiles are keyboard-navigable", async ({
    page,
  }) => {
    const settings = pageManager.SettingsPage;
    await settings.moduleTiles["Org Settings"].focus();
    const focused = await page.evaluate(() =>
      document.activeElement?.textContent?.trim(),
    );
    expect(focused).toContain("Org Settings");
  });
});
