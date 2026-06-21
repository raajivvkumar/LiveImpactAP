// pages/DashboardPage.ts

import { Page, Locator } from "@playwright/test";
import BasePage from "./BasePage";

export default class DashboardPage extends BasePage {
  // Widgets (titles confirmed from .playwright-mcp dashboard snapshots)
  readonly recordGraphWidget: Locator;
  readonly recordStatsWidget: Locator;
  readonly paymentGraphWidget: Locator;
  readonly paymentStatsWidget: Locator;

  // Record Stats fields
  readonly totalRecordsValue: Locator;
  readonly newRecordsLast7Days: Locator;
  readonly newRecordsCurrentMonth: Locator;
  readonly newRecordsCurrentFY: Locator;

  // Payment Stats fields
  readonly last7DaysAmount: Locator;
  readonly currentMonthAmount: Locator;
  readonly currentFYAmount: Locator;
  readonly donorRetentionFY: Locator;
  readonly newDonorCurrentMonth: Locator;
  readonly newDonorFY: Locator;

  // BETA badges / help links (generic, applies to all 4 widgets)
  readonly betaBadges: Locator;
  readonly widgetHelpLinks: Locator;
  readonly widgetOptionsIcons: Locator;

  constructor(page: Page) {
    super(page);

    this.recordGraphWidget = page.locator(
      "generic:has-text('Record Graph YoY')",
    );
    this.recordStatsWidget = page.locator(
      "generic:has-text('Record Stats')",
    );
    this.paymentGraphWidget = page.locator(
      "generic:has-text('Payment Graph YoY')",
    );
    this.paymentStatsWidget = page.locator(
      "generic:has-text('Payment Stats')",
    );

    // TODO(selector): confirm stable data-testid/id once DevTools access is available.
    // Current approach: heading following the "Total Records" label within Record Stats card.
    this.totalRecordsValue = this.recordStatsWidget
      .locator("heading")
      .first();
    this.newRecordsLast7Days = page.locator(
      "generic:has-text('New Records (Last 7 Days)')",
    );
    this.newRecordsCurrentMonth = page.locator(
      "generic:has-text('New Records (Current Month)')",
    );
    this.newRecordsCurrentFY = page.locator(
      "generic:has-text('New Records (Current FY)')",
    );

    this.last7DaysAmount = page.locator(
      "generic[aria-label='Last 7 days Amount']",
    );
    this.currentMonthAmount = page.locator(
      "generic[aria-label='Current Month Amount']",
    );
    this.currentFYAmount = page.locator(
      "generic[aria-label='Current FY Amount']",
    );
    this.donorRetentionFY = page.locator(
      "generic:has-text('Donor Retention FY')",
    );
    this.newDonorCurrentMonth = page.locator(
      "generic[aria-label='New Donor Current Month']",
    );
    this.newDonorFY = page.locator("generic[aria-label='New Donor FY']");

    this.betaBadges = page.locator("generic:has-text('BETA VERSION')");
    // TODO(selector): help icon is rendered as an icon-only <a> with href to help.liveimpact.org;
    // verify exact class/aria-label in DevTools (observed only as decorative <generic> in snapshot).
    this.widgetHelpLinks = page.locator("a[href*='help.liveimpact.org']");
    // TODO(selector): kebab/options icon — no accessible name captured in snapshot, needs aria-label
    // added in app or a stable class selector from DevTools.
    this.widgetOptionsIcons = page.locator(
      "[class*='widget'] [class*='option'], [class*='widget'] [class*='kebab']",
    );
  }

  async waitForWidgets() {
    await this.recordGraphWidget.waitFor({ state: "visible" });
    await this.recordStatsWidget.waitFor({ state: "visible" });
    await this.paymentGraphWidget.waitFor({ state: "visible" });
    await this.paymentStatsWidget.waitFor({ state: "visible" });
  }
}
