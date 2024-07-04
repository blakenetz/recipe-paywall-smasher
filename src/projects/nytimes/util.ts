import {
  cloneNode,
  createEl,
  generateCssText,
  getNode,
  kebabize,
  removeByQuery,
  removeEmptyDiv,
} from "../../util";

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

function getRootEl() {
  return getNode("body");
}

export function appendRecipe() {
  // fetch target elements
  const documentBody = getNode("body");
  const recipe = cloneNode(".recipe");

  const insertion = createEl(
    "section",
    {
      padding: "1em",
      position: "absolute",
      top: "0",
      border: "1em solid salmon",
      background: "white",
      zIndex: "1000",
      width: "100vw",
    },
    undefined,
    { id: "insert" }
  );

  const heading = createEl("div", {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1em",
  });

  const h1 = createEl("h1", { margin: "0" }, "Recipe:");
  heading.append(h1);

  const collapseBtn = createEl("button", { display: "block" }, "-", {
    class: "toggle-button",
    id: "collapse",
  });
  heading.append(collapseBtn);

  const expandBtn = createEl(
    "button",
    {
      position: "fixed",
      bottom: "1em",
      right: "1.5em",
      display: "none",
    },
    "+",
    { class: "toggle-button", id: "expand" }
  );

  // button styles
  const style = document.createElement("style");
  const buttonCss: {
    base: Partial<CSSStyleDeclaration>;
    hover: Partial<CSSStyleDeclaration>;
  } = {
    base: {
      height: "2em",
      width: "2em",
      borderRadius: "90px",
      background: "salmon",
    },
    hover: {
      backgroundColor: "rgb(250 128 114 / 70%)",
      textDecoration: "none",
    },
  };
  const buttonCssText = `.toggle-button{ ${generateCssText(buttonCss.base)} }
	.toggle-button:hover, .toggle-button:focus{ ${generateCssText(
    buttonCss.hover
  )} }`;
  style.appendChild(document.createTextNode(buttonCssText));
  document.getElementsByTagName("head")[0].appendChild(style);

  // button logic
  function handleClick(e: MouseEvent) {
    const target = e.target as HTMLButtonElement;
    const expandBtn = getNode<HTMLButtonElement>("#expand");
    const main = getNode<HTMLElement>("#insert");

    if (target.id === "collapse") {
      expandBtn.style.display = "block";
      main.style.display = "none";
    } else {
      expandBtn.style.display = "none";
      main.style.display = "block";
    }
  }
  collapseBtn.addEventListener("click", handleClick);
  expandBtn.addEventListener("click", handleClick);
  addEventListener("beforeunload", () => {
    collapseBtn.removeEventListener("click", handleClick);
    expandBtn.removeEventListener("click", handleClick);
  });

  // DOM mutations
  documentBody.prepend(insertion);
  insertion.append(heading);
  insertion.append(recipe);
  documentBody.append(expandBtn);
}

export function removeElements() {
  console.debug(`🍳 removing nodes`);
  removeEmptyDiv();
  removableQueries.forEach(removeByQuery);
}

export function instantiateMutation() {
  const mutationCallback: MutationCallback = (mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) {
          removableQueries.forEach((query) => {
            if (node.matches(query) || node.querySelectorAll(query).length) {
              console.debug(`🍳 removing ${node.childElementCount} node`);
              try {
                node.remove();
              } catch (error) {
                console.debug(`🍳 error removing node: `, error);
              }
            }
          });
        }
      });
    });
  };

  const observer = new MutationObserver(mutationCallback);

  const mutationTarget = getRootEl();
  const config: MutationObserverInit = { subtree: true, childList: true };
  if (mutationTarget) {
    console.debug(`🍳 instantiating observer`);
    observer.observe(mutationTarget, config);
  }

  return observer;
}
