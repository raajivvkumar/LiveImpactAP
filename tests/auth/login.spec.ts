// spec: specs/README.md
// tests/auth/login.spec.ts

import { test, expect } from "@playwright/test";
import LoginPage from "../../pages/LoginPage";
import testData from "../../utils/testData.json";

// These tests intentionally do NOT use the "tests" project's saved storageState,
// since they exercise the unauthenticated login flow itself.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Authentication", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToUrl(testData.BaseUrl);
  });

  // TC-AUTH-001: Successful login with valid credentials
  test("TC-AUTH-001: Successful login with valid credentials", async ({
    page,
  }) => {
    await loginPage.login(testData.userName, testData.password);
    await page.waitForTimeout(4000);

    await expect(page).toHaveURL(/admindash\/admin/);
    await expect(
      page.locator("generic:has-text('Record Stats')"),
    ).toBeVisible();
  });

  // TC-AUTH-002: Login fails with invalid password
  test("TC-AUTH-002: Login fails with invalid password", async ({ page }) => {
    await loginPage.login(testData.userName, "WrongPassword123$");
    await page.waitForTimeout(2000);

    await expect(page).not.toHaveURL(/admindash\/admin/);
    // TODO(selector): exact error-message locator not captured in reviewed snapshots
    // (login form interior wasn't recorded). Confirm element in DevTools, e.g.:
    // page.locator("[class*='error'], [class*='alert']")
    await expect(
      page.locator("text=/invalid|incorrect|failed/i"),
    ).toBeVisible({ timeout: 5000 });
  });

  // TC-AUTH-003: Login fails with invalid/unregistered username
  test("TC-AUTH-003: Login fails with invalid/unregistered username", async ({
    page,
  }) => {
    await loginPage.login("nonexistent_user@example.com", "AnyPass123$");
    await page.waitForTimeout(2000);

    await expect(page).not.toHaveURL(/admindash\/admin/);
  });

  // TC-AUTH-004: Login blocked with empty username
  test("TC-AUTH-004: Login blocked with empty username", async ({ page }) => {
    await loginPage.fill(loginPage.password, testData.password);
    await loginPage.click(loginPage.loginBtn);
    await page.waitForTimeout(1500);

    await expect(page).not.toHaveURL(/admindash\/admin/);
  });

  // TC-AUTH-005: Login blocked with empty password
  test("TC-AUTH-005: Login blocked with empty password", async ({ page }) => {
    await loginPage.fill(loginPage.username, testData.userName);
    await loginPage.click(loginPage.loginBtn);
    await page.waitForTimeout(1500);

    await expect(page).not.toHaveURL(/admindash\/admin/);
  });

  // TC-AUTH-006: Password field masks input
  test("TC-AUTH-006: Password field masks input", async ({ page }) => {
    await expect(loginPage.password).toHaveAttribute("type", "password");
  });

  // TC-AUTH-007: Session persists across page reload
  test("TC-AUTH-007: Session persists across page reload", async ({
    page,
  }) => {
    await loginPage.login(testData.userName, testData.password);
    await page.waitForTimeout(4000);
    await expect(page).toHaveURL(/admindash\/admin/);

    await page.reload();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/admindash\/admin/);
    await expect(
      page.locator("generic:has-text('Record Stats')"),
    ).toBeVisible();
  });

  // TC-AUTH-008: Direct deep-link without session redirects to login
  test("TC-AUTH-008: Direct deep-link without session redirects to login", async ({
    page,
  }) => {
    await page.goto(
      testData.BaseUrl + testData.OrgID + testData.dashboardUrl,
    );
    await page.waitForLoadState("networkidle");

    // Should not land on the authenticated dashboard widgets without a session
    await expect(
      page.locator("generic:has-text('Record Stats')"),
    ).not.toBeVisible({ timeout: 5000 });
  });

  // TC-AUTH-010: XSS/SQLi-style payload in login fields is rejected safely
  test("TC-AUTH-010: Script injection payload in username is not executed", async ({
    page,
  }) => {
    let dialogFired = false;
    page.on("dialog", (dialog) => {
      dialogFired = true;
      dialog.dismiss();
    });

    await loginPage.login("<script>alert(1)</script>", "irrelevant");
    await page.waitForTimeout(2000);

    expect(dialogFired).toBeFalsy();
    await expect(page).not.toHaveURL(/admindash\/admin/);
  });

  // TC-AUTH-011: Multiple rapid failed logins (rate limiting)
  test("TC-AUTH-011: Repeated failed logins are rate limited or otherwise handled", async ({
    page,
  }) => {
    for (let i = 0; i < 5; i++) {
      await loginPage.fill(loginPage.username, testData.userName);
      await loginPage.fill(loginPage.password, `WrongPass${i}`);
      await loginPage.click(loginPage.loginBtn);
      await page.waitForTimeout(1000);
    }

    // TODO(behavior): assert the *actual* configured protection once confirmed —
    // e.g. CAPTCHA element, account-lock message, or a documented absence of rate limiting.
    await expect(page).not.toHaveURL(/admindash\/admin/);
  });
});
