// pages/EventsPage.ts

import { Page, Locator } from "@playwright/test";
import BasePage from "./BasePage";

export default class EventsPage extends BasePage {
  readonly eventsMenuItem: Locator;
  readonly createEventBtn: Locator;
  readonly archivedEventsBtn: Locator;

  // Important Note banner — confirmed text from page-2026-06-09T18-15-51-443Z.yml
  readonly fraudSettingsBanner: Locator;
  readonly braintreeFraudSettingsLink: Locator;
  readonly captchaThresholdLink: Locator;

  // Filters — confirmed labels/options
  readonly eventNameInput: Locator;
  readonly createdByInput: Locator;
  readonly sortByDropdown: Locator;
  readonly typeDropdown: Locator;
  readonly statusDropdown: Locator;

  // Create Event form
  // TODO(selector): Create Event wizard fields not captured in reviewed snapshots
  // (button observed but wizard never opened during recording). Confirm in DevTools:
  // Event Name input, Date pickers, Location, Description, Save/Next buttons.
  readonly eventNameFormInput: Locator;
  readonly saveEventBtn: Locator;

  constructor(page: Page) {
    super(page);

    this.eventsMenuItem = page.locator(
      "#side-menu li a:has(span:text-is('Events'))",
    );
    this.createEventBtn = page.locator("button:has-text('Create Event')");
    this.archivedEventsBtn = page.locator(
      "button:has-text('Archived Events')",
    );

    this.fraudSettingsBanner = page.locator(
      "generic:has-text('Important Note')",
    );
    this.braintreeFraudSettingsLink = page.locator(
      "a:has-text('Braintree Fraud Settings')",
    );
    this.captchaThresholdLink = page.locator(
      "a:has-text('LiveImpact CAPTCHA Threshold Limit')",
    );

    this.eventNameInput = page.locator("textbox[placeholder='Event Name']");
    this.createdByInput = page.locator("textbox[placeholder='Created By']");
    // Confirmed option values: "Sort By", "Event Name", "Created By", "Created Date"
    this.sortByDropdown = page.locator("combobox").filter({
      has: page.locator("option:text-is('Sort By')"),
    });
    // Confirmed option values: "Select Type", "Events", "RSVP",
    // "Non Ticketing (deprecated)", "Participant Fundraiser (deprecated)"
    this.typeDropdown = page.locator("combobox").filter({
      has: page.locator("option:text-is('Select Type')"),
    });
    // Confirmed option values: "Active", "Inactive", "Active and Inactive"
    this.statusDropdown = page.locator("combobox").filter({
      has: page.locator("option:text-is('Active')"),
    });

    this.eventNameFormInput = page.locator(
      "textbox[name='eventName'], textbox[placeholder='Event Name']",
    );
    this.saveEventBtn = page.locator(
      "button:has-text('Save'), button:has-text('Create')",
    );
  }

  async navigate() {
    await this.click(this.eventsMenuItem);
  }

  async filterByName(name: string) {
    await this.fill(this.eventNameInput, name);
  }

  async filterByType(type: string) {
    await this.selectByValue(this.typeDropdown, type);
  }

  async filterByStatus(status: string) {
    await this.selectByValue(this.statusDropdown, status);
  }

  async openCreateEventWizard() {
    await this.click(this.createEventBtn);
  }

  async showArchivedEvents() {
    await this.click(this.archivedEventsBtn);
  }
}
