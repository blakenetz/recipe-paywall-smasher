import { init } from "@/util";

const removableQueries = [
  '[role*="dialog"]', // includes `alertdialog` as well
  "iframe",
  '[aria-live="assertive"]',
  '[class*="Modal"]',
  '[class*="modal"]',
  '[class*="InterstitialWrapper"]',
  '[class*="Paywall"]',
  '[class*="PersistentBottom"]',
];

const appRoot = "#app-root";

try {
  init(removableQueries, appRoot);
} catch (error) {
  console.debug(`🍳 failed 😢: `, error);
}
