import { chromium } from '@playwright/test';

const context = await chromium.launchPersistentContext(
  './chrome-user-data',
  {
    channel: 'chrome',
    headless: false,
  }
);