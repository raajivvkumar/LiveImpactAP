import { chromium, test as setup } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import testData from "../utils/testData.json";

setup("Login and Save Session", async () => {
  const context = await chromium.launchPersistentContext("./chrome-user-data", {
    channel: "chrome",
    headless: false,
    args: [
      "--disable-notifications",
      "--disable-save-password-bubble",
      "--disable-features=AutofillServerCommunication",
    ],
  });

  try {
    const page = context.pages()[0] || (await context.newPage());

    const loginpage = new LoginPage(page);

    await loginpage.navigateToUrl(testData.BaseUrl);
    await loginpage.login(testData.userName, testData.password);

    await page.waitForTimeout(7000);

    await context.storageState({
      path: "Project_auth/storageState.json",
    });
  } finally {
    await context.close();
  }
});
