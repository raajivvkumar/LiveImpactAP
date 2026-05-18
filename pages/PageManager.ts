import { Page } from "@playwright/test";
import LoginPage from "./LoginPage";
import BasePage from "./BasePage";

export class PageManager {
  readonly LoginPage: LoginPage;
  readonly BasePage: BasePage;

  constructor(page: Page) {
    this.LoginPage = new LoginPage(page);
    this.BasePage = new BasePage(page);
  }
}
