import { test as setup } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import testData from "../utils/testData.json";
import * as utils from "../utils/swapper";

setup("Login and Save Session", async ({ page }) => {
  const loginpage = new LoginPage(page);

  await loginpage.navigateToUrl(testData.BaseUrl);
  await loginpage.login(testData.userName, testData.password);
  await page.waitForTimeout(7000);
  //   await utils.Handle_PageLoad(page);

  // Save the storage state to a file after successful login
  await page.context().storageState({ path: "Project_auth/storageState.json" });
});
