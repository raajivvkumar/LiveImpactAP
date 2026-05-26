import { test, expect } from "@playwright/test";
import testData from "../utils/testData.json";
import * as utils from "../utils/swapper";
import { PageManager } from "../pages/PageManager";

test.describe("Go go Activity", async () => {
  let pageManager: PageManager;

  test.beforeEach(async ({ page }) => {
    pageManager = new PageManager(page);
    await pageManager.LoginPage.navigateToUrl(
      testData.BaseUrl + testData.OrgID + testData.dashboardUrl,
    );
    await utils.Handle_PageLoad(page);
    // await page.waitForTimeout(15000);
  });

  test("Go to Activity", async ({ page }) => {
    await pageManager.BasePage.clickByText("Activities");
    await utils.Handle_PageLoad(page);
  });

  test("Go to Events", async ({ page }) => {
    await pageManager.BasePage.clickByText("Events");
    await utils.Handle_PageLoad(page);
  });
  test("Go to Forms", async ({ page }) => {
    await pageManager.BasePage.clickByText("Forms");
    await pageManager.BasePage.clickByText("Form Design");
    await utils.Handle_PageLoad(page);
  });
});
