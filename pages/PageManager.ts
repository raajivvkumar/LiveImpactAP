import { Page } from "@playwright/test";
import LoginPage from "./LoginPage";
import BasePage from "./BasePage";
import DashboardPage from "./DashboardPage";
import RecordsPage from "./RecordsPage";
import PaymentsPage from "./PaymentsPage";
import EventsPage from "./EventsPage";
import SettingsPage from "./SettingsPage";

export class PageManager {
  readonly LoginPage: LoginPage;
  readonly BasePage: BasePage;
  readonly DashboardPage: DashboardPage;
  readonly RecordsPage: RecordsPage;
  readonly PaymentsPage: PaymentsPage;
  readonly EventsPage: EventsPage;
  readonly SettingsPage: SettingsPage;

  constructor(page: Page) {
    this.LoginPage = new LoginPage(page);
    this.BasePage = new BasePage(page);
    this.DashboardPage = new DashboardPage(page);
    this.RecordsPage = new RecordsPage(page);
    this.PaymentsPage = new PaymentsPage(page);
    this.EventsPage = new EventsPage(page);
    this.SettingsPage = new SettingsPage(page);
  }
}
