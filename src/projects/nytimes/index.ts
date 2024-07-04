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
  "[class*=adunit]",
  "[class*=inlineoffer]",
];

const appRoot = "body";

try {
  init(removableQueries, appRoot);
} catch (error) {
  console.debug(`🍳 failed 😢: `, error);
}
