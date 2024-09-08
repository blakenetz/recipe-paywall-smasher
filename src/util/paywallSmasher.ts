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
  nodesToHide: Query[];
  nodesToReset: Query[];
  overlay: Overlay;
  observer: MutationObserver;
  appRoot: HTMLElement;

  constructor(
    appRoot: Query,
    recipeNodes: Query[],
    nodesToHide: Query[],
    nodesToReset: Query[]
  ) {
    this.appRoot = getNode(appRoot);
    this.nodesToHide = [
      '[role*="dialog"]', // includes `alertdialog` as well
      "iframe",
      '[aria-live="assertive"]',
      '[class*="Modal"]',
      '[class*="modal"]',
      '[class*="InterstitialWrapper"]',
      '[class*="Paywall"]',
      '[class*="PersistentBottom"]',
      ...nodesToHide,
    ];
    this.nodesToReset = ["[class*=no-scroll]", ...nodesToReset];
    this.overlay = new Overlay(recipeNodes);
    this.observer = this.createObserver();
    this.registerEventListeners();
  }

  public registerEventListeners() {
    addEventListener("load", () => this.load());
    addEventListener("beforeunload", () => this.unload());
  }

  private createObserver() {
    const callback: MutationCallback = (mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            this.addHideClass(node);
            this.resetNode(node);
          }
        });
      });
    };

    return new MutationObserver(callback);
  }

  private load() {
    log("connecting");
    removeElements(this.nodesToHide);
    this.overlay.attach();
    this.observer.observe(this.appRoot, { subtree: true, childList: true });
  }

  private unload() {
    log("disconnecting");
    this.observer.disconnect();
  }

  private qualifyNode(node: Element, query: string) {
    return (
      node.id !== this.overlay.root.id &&
      (node.matches(query) || node.querySelectorAll(query).length)
    );
  }

  private addHideClass(node: Element) {
    this.nodesToHide.forEach((query) => {
      if (this.qualifyNode(node, query)) {
        log(`hiding ${node.childElementCount} node`);
        try {
          node.classList.add(hideClass);
        } catch (error) {
          log(`error hiding node: `, error);
        }
      }
    });
  }
  private resetNode(node: Element) {
    this.nodesToReset.forEach((query) => {
      if (this.qualifyNode(node, query)) {
        log(`resetting ${node.childElementCount} node`);
        try {
          node.classList.remove(...Array.from(node.classList));
        } catch (error) {
          log(`error resetting node: `, error);
        }
      }
    });
  }
}

export function init(
  appRoot: Query,
  recipeNodes: Query[],
  nodesToHide: Query[] = [],
  nodesToReset: Query[] = []
) {
  try {
    new PaywallSmasher(appRoot, recipeNodes, nodesToHide, nodesToReset);
  } catch (error) {
    log("Failed to initialize paywall smasher", error);
  }
}
