// pages/LoginPage.ts

import { Page } from "@playwright/test";
import BasePage from "./BasePage";

export default class LoginPage extends BasePage {
  readonly username;
  readonly password;
  readonly loginBtn;

  constructor(page: Page) {
    super(page);

    this.username = page.locator("#usernameInput");
    this.password = page.locator("#passwordInput");
    this.loginBtn = page.locator("#siginInBtn");
  }

  async navigateToUrl(url: string) {
    await this.page.goto(url);
  }
  async login(user: string, pass: string) {
    await this.fill(this.username, user);
    await this.fill(this.password, pass);
    await this.page.waitForTimeout(4000);
    await this.click(this.loginBtn);
  }
}
