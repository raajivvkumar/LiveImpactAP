// pages/SettingsPage.ts

import { Page, Locator } from "@playwright/test";
import BasePage from "./BasePage";

export default class SettingsPage extends BasePage {
  readonly settingsMenuItem: Locator;

  // Module tiles — confirmed full list of 35 labels from
  // page-2026-06-09T18-17-29-578Z.yml. Each tile is a clickable <generic> wrapping
  // an <img> + label <generic>; no individual id/data-testid was captured.
  // TODO(selector): confirm each tile's stable selector (likely onclick handler similar
  // to Form Design's `Formmain.startFormCreate()` pattern, e.g. `Settings.open('orgSettings')`).
  readonly moduleTiles: Record<string, Locator>;

  static readonly MODULE_NAMES = [
    "Org Settings",
    "Org Structure",
    "Access",
    "Dashboard Creator",
    "Relationship",
    "Activity Types",
    "Google Authenticator",
    "Payment Details",
    "Embed Paypal",
    "Record Grid View",
    "Payment Grid View",
    "Process Settings",
    "Data Quality",
    "Import from CSV",
    "Tags",
    "Global Values",
    "Create Stat",
    "Global Values Criteria",
    "Badges",
    "SMTP Server",
    "Global Record Fields",
    "Custom Payment Fields",
    "Mailing List",
    "User Dashboard",
    "Profile Plus",
    "Custom Record Types",
    "Global Mail Merge Tags",
    "Reports Mail Merge Tags",
    "Dashboard Widgets",
    "Quickbooks",
    "Contact Portal",
    "Point Of Sale",
    "Esign",
    "Download Connect",
    "External Email Integration",
    "Dashboard Metrics",
    "Text Messaging",
    "PayPal Standalone",
  ] as const;

  constructor(page: Page) {
    super(page);

    this.settingsMenuItem = page.locator(
      "#side-menu li a:has(span:text-is('Settings'))",
    );

    this.moduleTiles = {};
    for (const name of SettingsPage.MODULE_NAMES) {
      this.moduleTiles[name] = page.locator(
        `generic:has-text('${name}')`,
      ).first();
    }
  }

  async navigate() {
    await this.click(this.settingsMenuItem);
  }

  async openModule(name: string) {
    const tile = this.moduleTiles[name];
    if (!tile) {
      throw new Error(`Unknown settings module: ${name}`);
    }
    await this.click(tile);
  }
}
