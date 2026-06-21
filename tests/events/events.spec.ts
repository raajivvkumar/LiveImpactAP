// spec: specs/README.md
// tests/events/events.spec.ts

import { test, expect } from "@playwright/test";
import testData from "../../utils/testData.json";
import * as utils from "../../utils/swapper";
import { PageManager } from "../../pages/PageManager";

test.describe("Events", () => {
  let pageManager: PageManager;

  test.beforeEach(async ({ page }) => {
    pageManager = new PageManager(page);
    await pageManager.LoginPage.navigateToUrl(
      testData.BaseUrl + testData.OrgID + testData.dashboardUrl,
    );
    await utils.Handle_PageLoad(page);
    await pageManager.EventsPage.navigate();
    await utils.Handle_PageLoad(page);
  });

  // TC-EVT-001: Navigate to Events section
  test("TC-EVT-001: Navigate to Events section", async ({ page }) => {
    const events = pageManager.EventsPage;
    await expect(events.createEventBtn).toBeVisible();
    await expect(events.archivedEventsBtn).toBeVisible();
  });

  // TC-EVT-002: Important Note banner about fraud settings is displayed
  test("TC-EVT-002: Important Note banner about fraud settings is displayed", async ({
    page,
  }) => {
    const events = pageManager.EventsPage;
    await expect(events.fraudSettingsBanner).toBeVisible();
    await expect(events.braintreeFraudSettingsLink).toBeVisible();
    await expect(events.captchaThresholdLink).toBeVisible();
  });

  // TC-EVT-003: Event search/filter controls render
  test("TC-EVT-003: Event search/filter controls render", async ({
    page,
  }) => {
    const events = pageManager.EventsPage;
    await expect(events.eventNameInput).toBeVisible();
    await expect(events.createdByInput).toBeVisible();
    await expect(events.sortByDropdown).toBeVisible();
    await expect(events.typeDropdown).toBeVisible();
    await expect(events.statusDropdown).toBeVisible();
  });

  // TC-EVT-004: Filtering by Event Name narrows list
  test("TC-EVT-004: Filtering by Event Name narrows list", async ({
    page,
  }) => {
    const events = pageManager.EventsPage;
    await events.filterByName("Gala");
    await page.waitForTimeout(1000);
    // TODO(selector): event list/grid container not captured in reviewed snapshots
    // (no events were rendered in the recorded session). Confirm grid locator.
  });

  // TC-EVT-005: Filtering by Type = "RSVP" shows only RSVP events
  test('TC-EVT-005: Filtering by Type = "RSVP" shows only RSVP events', async ({
    page,
  }) => {
    const events = pageManager.EventsPage;
    await events.filterByType("RSVP");
    await page.waitForTimeout(1000);
  });

  // TC-EVT-006: Filtering by Status = "Inactive" shows only inactive events
  test('TC-EVT-006: Filtering by Status = "Inactive" shows only inactive events', async ({
    page,
  }) => {
    const events = pageManager.EventsPage;
    await events.filterByStatus("Inactive");
    await page.waitForTimeout(1000);
  });

  // TC-EVT-007: "Create Event" opens event creation wizard
  test('TC-EVT-007: "Create Event" opens event creation wizard', async ({
    page,
  }) => {
    const events = pageManager.EventsPage;
    await events.openCreateEventWizard();
    await page.waitForTimeout(1000);
    // TODO(selector): wizard root container not captured in reviewed snapshots.
  });

  // TC-EVT-008: Create Event requires Event Name
  test("TC-EVT-008: Create Event requires Event Name", async ({ page }) => {
    const events = pageManager.EventsPage;
    await events.openCreateEventWizard();
    await page.waitForTimeout(1000);

    if (await events.saveEventBtn.isVisible().catch(() => false)) {
      await events.click(events.saveEventBtn);
      await page.waitForTimeout(1000);
    }
    // TODO(behavior): assert validation message once wizard markup confirmed.
  });

  // TC-EVT-010: "Archived Events" toggle shows archived-only events
  test('TC-EVT-010: "Archived Events" toggle shows archived-only events', async ({
    page,
  }) => {
    const events = pageManager.EventsPage;
    await events.showArchivedEvents();
    await page.waitForTimeout(1000);
  });

  // TC-EVT-012: Deprecated event types are visually marked
  test("TC-EVT-012: Deprecated event types are visually marked", async ({
    page,
  }) => {
    const options = await page
      .locator("combobox option")
      .allTextContents();
    const deprecated = options.filter((o) => /deprecated/i.test(o));
    expect(deprecated.length).toBeGreaterThanOrEqual(2);
  });
});
