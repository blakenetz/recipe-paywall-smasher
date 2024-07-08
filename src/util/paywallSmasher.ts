import { Overlay, getNode, hideClass, log, Query } from ".";

function removeElements(queries: Query[]) {
  log(`hiding nodes`);
  removeEmptyDiv();
  queries.forEach(removeByQuery);
}

/**
 * an empty div is typically some sort of overlay
 */
function removeEmptyDiv() {
  log("hiding empty divs");
  Array.from(document.querySelectorAll("div"))
    .filter((el) => !el.hasChildNodes())
    .forEach((el) => el.classList.add(hideClass));
}

function removeByQuery(query: Query) {
  log(`hiding ${query}`);
  Array.from(document.querySelectorAll(query)).forEach((el) =>
    el.classList.add(hideClass)
  );
}

class PaywallSmasher {
  removableQueries: Query[];
  overlay: Overlay;
  observer: MutationObserver;
  appRoot: HTMLElement;

  constructor(
    appRoot: Query,
    recipeQueries: Query[],
    removableQueries: Query[] = []
  ) {
    this.appRoot = getNode(appRoot);
    this.removableQueries = [
      '[role*="dialog"]', // includes `alertdialog` as well
      "iframe",
      '[aria-live="assertive"]',
      '[class*="Modal"]',
      '[class*="modal"]',
      '[class*="InterstitialWrapper"]',
      '[class*="Paywall"]',
      '[class*="PersistentBottom"]',
      ...removableQueries,
    ];
    this.overlay = new Overlay(recipeQueries);
    this.observer = this.createObserver();
    this.registerEventListeners();
  }

  public registerEventListeners() {
    addEventListener("load", this.load);
    addEventListener("beforeunload", this.unload);
  }

  public createObserver() {
    const callback: MutationCallback = (mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            this.removableQueries.forEach((query) => {
              if (
                node.id !== this.overlay.root.id &&
                (node.matches(query) || node.querySelectorAll(query).length)
              ) {
                log(`hiding ${node.childElementCount} node`);
                try {
                  node.classList.add(hideClass);
                } catch (error) {
                  log(`error hiding node: `, error);
                }
              }
            });
          }
        });
      });
    };

    return new MutationObserver(callback);
  }

  private load() {
    log("connecting");
    removeElements(this.removableQueries);
    this.overlay.attach();
    this.observer.observe(this.appRoot, { subtree: true, childList: true });
  }

  private unload() {
    log("disconnecting");
    this.observer.disconnect();
  }
}

export function init(
  appRoot: Query,
  recipeQueries: Query[],
  removableQueries: Query[] = []
) {
  try {
    new PaywallSmasher(appRoot, recipeQueries, removableQueries);
  } catch (error) {
    log("Failed to initialize paywall smasher", error);
  }
}
