import LoginPage from "../pages/LoginPage";
import { expect, test as setup } from "@playwright/test";
import testData from "../utils/testData.json";

setup("Login and Save Session", async ({ page }) => {
  const loginpage = new LoginPage(page);
  await loginpage.navigateToUrl(testData.BaseUrl);
  await loginpage.login(testData.userName, testData.password);
  await page.waitForTimeout(7000);

  // Save the storage state to a file after successful login
  await page.context().storageState({ path: "Project_auth/storageState.json" });
});
