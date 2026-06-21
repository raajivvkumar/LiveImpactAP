// pages/RecordsPage.ts

import { Page, Locator, expect } from "@playwright/test";
import BasePage from "./BasePage";

export default class RecordsPage extends BasePage {
  // Sidebar — confirmed pattern from snapshots: <a href="javascript:void(0);"> wrapping icon+text
  readonly recordsMenuItem: Locator;
  readonly allRecordsLink: Locator;

  // Header search (confirmed: placeholder "Search Records", from every authenticated snapshot)
  readonly searchRecordsInput: Locator;
  readonly goToRecordDashboardBtn: Locator;
  readonly addEditButton: Locator;

  // Add Record modal (confirmed structure from
  // page-2026-06-09T18-22-51-303Z.yml "Add Record" dialog)
  readonly addRecordModalHeading: Locator;
  readonly addRecordModalCloseBtn: Locator;
  readonly existingRecordTab: Locator;
  readonly createNewRecordTab: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly roleSelect: Locator;
  readonly addRecordSubmitBtn: Locator;

  // Grid
  readonly totalRecordsLabel: Locator;
  readonly clearFilterBtn: Locator;
  readonly searchHintsBtn: Locator;
  readonly selectAllCheckbox: Locator;
  readonly gridRows: Locator;

  constructor(page: Page) {
    super(page);

    this.recordsMenuItem = page.locator(
      "#side-menu li a:has(span:text-is('Records'))",
    );
    // Confirmed real URL pattern from snapshot: /manage/0/0/0
    this.allRecordsLink = page.locator(
      "a[href*='/manage/0/0/0']:has-text('All Records')",
    );

    this.searchRecordsInput = page.locator(
      "textbox[placeholder='Search Records']",
    );
    this.goToRecordDashboardBtn = page.locator(
      "generic:has-text('GO TO RECORD DASHBOARD')",
    );
    this.addEditButton = page.locator("button:has-text('ADD / EDIT')");

    this.addRecordModalHeading = page.locator("heading:has-text('Add Record')");
    this.addRecordModalCloseBtn = page.locator(
      "generic:has-text('Add Record') button:has-text('×')",
    );
    this.existingRecordTab = page.locator("heading:has-text('Existing Record')");
    this.createNewRecordTab = page.locator(
      "generic:has-text('Create New Record')",
    );
    this.firstNameInput = page.locator("textbox[placeholder='First Name']");
    this.lastNameInput = page.locator("textbox[placeholder='Last Name']");
    this.emailInput = page.locator("textbox[placeholder='Email Address']");
    // TODO(selector): role <select> has no name/id captured in snapshot (rendered generic combobox);
    // confirm actual <select name="..."> in DevTools — likely something like "roleId".
    this.roleSelect = page.locator("combobox").filter({
      hasText: "Select Role",
    });
    this.addRecordSubmitBtn = page.locator("button:has-text('Add Record')");

    this.totalRecordsLabel = page.locator("generic:has-text('Total Records:')");
    this.clearFilterBtn = page.locator("button:has-text('Clear filter')");
    this.searchHintsBtn = page.locator("button:has-text('Search Hints')");
    this.selectAllCheckbox = page
      .locator("generic[aria-label='Select/Deselect All']")
      .locator("checkbox");
    // TODO(selector): grid rows rendered as nested <generic> without a row role in snapshot;
    // confirm actual row container class (likely a data-grid library) in DevTools for robust counting.
    this.gridRows = page.locator("[class*='grid-row'], [role='row']");
  }

  async openRecordsMenu() {
    await this.click(this.recordsMenuItem);
  }

  async navigateToAllRecords() {
    await this.openRecordsMenu();
    await this.click(this.allRecordsLink);
  }

  async navigateToRecordType(typeName: string) {
    await this.openRecordsMenu();
    const typeLink = this.page.locator(
      `a:has-text('${typeName}')`,
    ).first();
    await this.click(typeLink);
  }

  async openAddRecordModal() {
    await this.click(this.addEditButton);
    await this.addRecordModalHeading.waitFor({ state: "visible" });
  }

  async fillNewRecord(opts: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }) {
    await this.fill(this.firstNameInput, opts.firstName);
    await this.fill(this.lastNameInput, opts.lastName);
    await this.fill(this.emailInput, opts.email);
    await this.selectByValue(this.roleSelect, opts.role);
  }

  async submitAddRecord() {
    await this.click(this.addRecordSubmitBtn);
  }

  async getTotalRecordsCount(): Promise<number> {
    const text = await this.getText(this.totalRecordsLabel);
    const match = text.match(/Total Records:\s*([\d,]+)/);
    return match ? parseInt(match[1].replace(/,/g, ""), 10) : 0;
  }

  async searchRecords(query: string) {
    await this.fill(this.searchRecordsInput, query);
    await this.press(this.searchRecordsInput, "Enter");
  }
}
