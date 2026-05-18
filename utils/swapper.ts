import { Page } from "@playwright/test";

export const handle_waitLoading = async (page: Page) => {
  await Promise.all([
    // Wait until HTML DOM is fully loaded
    page.waitForLoadState("domcontentloaded"),

    // Wait until loader disappears
    page.waitForSelector("#dashLoading", {
      state: "hidden",
      timeout: 60000,
    }),

    // Wait until pace-progress reaches 99
    page.waitForFunction(
      () => {
        const element = document.querySelector(".pace-progress");

        return element && element.getAttribute("data-progress") === "99";
      },
      {
        timeout: 60000,
      },
    ),
  ]);
};
