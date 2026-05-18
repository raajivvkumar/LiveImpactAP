// pages/BasePage.ts

import { Page, Locator, expect } from "@playwright/test";

export default class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate URL
  async navigate(url: string) {
    await this.page.goto(url);
  }

  // Click Element
  async click(locator: Locator) {
    await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  //Click on Link
  async clickByText(text: string) {
    const locator = this.page.getByRole("link", { name: text });
    await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  // Fill Input
  async fill(locator: Locator, value: string) {
    await locator.waitFor({ state: "visible" });
    await locator.fill(value);
  }

  // Get Text
  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: "visible" });
    return (await locator.textContent()) || "";
  }

  // Press Keyboard Key
  async press(locator: Locator, key: string) {
    await locator.press(key);
  }

  // Hover Element
  async hover(locator: Locator) {
    await locator.hover();
  }

  // Check Checkbox
  async check(locator: Locator) {
    await locator.check();
  }

  // Uncheck Checkbox
  async uncheck(locator: Locator) {
    await locator.uncheck();
  }

  // Select Dropdown Value
  async selectByValue(locator: Locator, value: string) {
    await locator.selectOption(value);
  }

  // Wait for Element
  async waitForVisible(locator: Locator) {
    await locator.waitFor({ state: "visible" });
  }

  // Verify Text
  async verifyText(locator: Locator, expectedText: string) {
    await expect(locator).toHaveText(expectedText);
  }

  // Verify Element Visible
  async verifyVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  // Scroll Into View
  async scrollIntoView(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  // Double Click
  async doubleClick(locator: Locator) {
    await locator.dblclick();
  }

  // Right Click
  async rightClick(locator: Locator) {
    await locator.click({ button: "right" });
  }

  // Upload File
  async uploadFile(locator: Locator, filePath: string) {
    await locator.setInputFiles(filePath);
  }

  // Static Wait (avoid if possible)
  async wait(milliseconds: number) {
    await this.page.waitForTimeout(milliseconds);
  }
}
