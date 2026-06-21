// pages/PaymentsPage.ts

import { Page, Locator } from "@playwright/test";
import BasePage from "./BasePage";

export default class PaymentsPage extends BasePage {
  readonly paymentsMenuItem: Locator;

  // Summary tiles — confirmed labels from page-2026-06-09T18-16-58-209Z.yml
  readonly totalRowsTile: Locator;
  readonly totalAmountTile: Locator;
  readonly amountPendingTile: Locator;
  readonly multiLinkGiftIcon: Locator;

  // Date range filter — confirmed structure (Start Date / End Date textboxes + Fetch button)
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly fetchBtn: Locator;
  readonly totalRowsCountLabel: Locator;
  readonly clearFilterBtn: Locator;
  readonly gridViewLabel: Locator;
  readonly searchHintsBtn: Locator;

  // Add Payment
  readonly addPaymentBtn: Locator;
  // TODO(selector): Add Payment modal fields were not captured in any reviewed snapshot
  // (button observed but modal never opened during recording). Confirm in DevTools:
  // amount input, record-link picker, payment method dropdown, payment date field, submit button.
  readonly addPaymentAmountInput: Locator;
  readonly addPaymentSubmitBtn: Locator;

  constructor(page: Page) {
    super(page);

    this.paymentsMenuItem = page.locator(
      "#side-menu li a:has(span:text-is('Payments'))",
    );

    this.totalRowsTile = page.locator("generic[aria-label='TOTAL ROWS']");
    this.totalAmountTile = page.locator(
      "generic[aria-label*='COMPLETED, CREATED, PENDING']",
    );
    this.amountPendingTile = page.locator(
      "generic[aria-label*='(PENDING) - FEE']",
    );
    this.multiLinkGiftIcon = page.locator(
      "generic[aria-label*='MULTI LINK GIFT']",
    );

    this.startDateInput = page.locator("textbox[name='Start Date']");
    this.endDateInput = page.locator("textbox[name='End Date']");
    this.fetchBtn = page.locator("button:has-text('Fetch')");
    this.totalRowsCountLabel = page.locator(
      "generic:has-text('Total Rows:')",
    );
    this.clearFilterBtn = page.locator("button:has-text('Clear Filter')");
    this.gridViewLabel = page.locator("generic:has-text('Grid View')");
    this.searchHintsBtn = page.locator("button:has-text('Search Hints')");

    this.addPaymentBtn = page.locator("button:has-text('Add Payment')");
    // TODO(selector): placeholder selectors below — verify against live modal markup.
    this.addPaymentAmountInput = page.locator(
      "textbox[placeholder='Amount']",
    );
    this.addPaymentSubmitBtn = page.locator(
      "generic:has-text('Add Payment') button[type='submit']",
    );
  }

  async navigate() {
    await this.click(this.paymentsMenuItem);
  }

  async setDateRange(startDate: string, endDate: string) {
    await this.fill(this.startDateInput, startDate);
    await this.fill(this.endDateInput, endDate);
  }

  async fetch() {
    await this.click(this.fetchBtn);
  }

  async clearFilter() {
    await this.click(this.clearFilterBtn);
  }

  async getTotalRowsCount(): Promise<number> {
    const text = await this.getText(this.totalRowsCountLabel);
    const match = text.match(/Total Rows:\s*(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async openAddPaymentModal() {
    await this.click(this.addPaymentBtn);
  }
}
