import { Page } from "@playwright/test";

// utils/Handle_PageLoad.ts

export async function Handle_PageLoad(page: Page): Promise<void> {
  const MAX_TIMEOUT = 60000; // 60 sec
  const APPEAR_TIMEOUT = 4000; // 4 sec

  // =========================
  // Promise 1 - #dashLoading
  // =========================
  const dashLoading = page.locator("#dashLoading");

  try {
    // Wait max 4 sec for loader to appear
    await dashLoading.waitFor({
      state: "visible",
      timeout: APPEAR_TIMEOUT,
    });

    // If appeared -> wait until disappears
    await dashLoading.waitFor({
      state: "hidden",
      timeout: MAX_TIMEOUT,
    });

    console.log("✅ #dashLoading disappeared");
  } catch {
    console.log("ℹ️ #dashLoading did not appear");
  }

  // =========================
  // Promise 2 - .pace-progress
  // =========================
  const paceProgress = page.locator(".pace-progress");

  try {
    // Wait max 4 sec for progress bar to appear
    await paceProgress.waitFor({
      state: "visible",
      timeout: APPEAR_TIMEOUT,
    });

    // Wait until:
    // 1. Hidden
    // OR
    // 2. data-progress = 99

    await Promise.race([
      paceProgress.waitFor({
        state: "hidden",
        timeout: MAX_TIMEOUT,
      }),

      page.waitForFunction(
        () => {
          const el = document.querySelector(".pace-progress");

          if (!el) return false;

          return el.getAttribute("data-progress") === "99";
        },
        { timeout: MAX_TIMEOUT },
      ),
    ]);

    console.log("✅ .pace-progress disappeared or reached data-progress=99");
  } catch {
    console.log("ℹ️ .pace-progress did not appear");
  }

  // =========================
  // Promise 3 - Page Loaded
  // =========================
  await page.waitForLoadState("load", {
    timeout: MAX_TIMEOUT,
  });

  await page.waitForLoadState("networkidle", {
    timeout: MAX_TIMEOUT,
  });

  console.log("✅ Page fully loaded");
}
