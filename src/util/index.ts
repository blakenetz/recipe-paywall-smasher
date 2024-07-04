type Query = keyof HTMLElementTagNameMap | string;

function log(s: string, ...args: any[]) {
  console.debug(`🍳 ${s}`, ...args);
}

function getNode<E extends Element>(selector: string): E {
  const el = document.querySelector<E>(selector);

  if (el === null) {
    throw Error(`🍳 Unable to find element: ${selector}`);
  }

  return el;
}

/**
 * Deep clone node and return it wrapped in a `section` element
 */
function cloneNode(selector: string) {
  const el = getNode(selector);
  const cloneEl = el.cloneNode(true);

  const returnEl = document.createElement("section");
  returnEl.append(cloneEl);

  return returnEl;
}

/**
 * an empty div is typically some sort of overlay
 */
function removeEmptyDiv() {
  log(`removing empty divs`);
  Array.from(document.querySelectorAll("div"))
    .filter((el) => !el.hasChildNodes())
    .forEach((el) => el.remove());
}

function removeByQuery(query: Query) {
  log(`removing ${query}`);
  Array.from(document.querySelectorAll(query)).forEach((el) => el.remove());
}

function removeElements(queries: Query[]) {
  log(`removing nodes`);
  removeEmptyDiv();
  queries.forEach(removeByQuery);
}

/** @see https://stackoverflow.com/a/67243723 */
function kebabize(str: string) {
  return str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? "-" : "") + $.toLowerCase()
  );
}

function generateCssText(css: Partial<CSSStyleDeclaration>) {
  return Object.keys(css)
    .map((key) => `${kebabize(key)}:${css[key as keyof typeof css]}`)
    .join(";");
}

function generateCssRule(css: Record<string, Partial<CSSStyleDeclaration>>) {
  const rules = Object.keys(css)
    .map((key) => `${key}{ ${generateCssText(css[key])} }`)
    .join("\n");

  return document.createTextNode(rules);
}

function createEl(
  tag: keyof HTMLElementTagNameMap,
  attr: { id: string } & Record<string, string>,
  content: string = ""
): HTMLElement {
  const el = document.createElement(tag);

  if (content) {
    el.textContent = content;
  }

  Object.keys(attr).forEach((name) => {
    el.setAttribute(name, name === "id" ? `rps-${attr[name]}` : attr[name]);
  });

  return el;
}

class Overlay {
  constructor(queries: Query[]) {
    log("Instantiating overlay");
    // shared classes
    const buttonClass = "toggle-button";
    const hide = "hide";

    // dom nodes
    const root = createEl("section", { id: "root" });
    const heading = createEl("div", { id: "heading" });
    const h1 = createEl("h1", { id: "h1" }, "Recipe:");
    const collapseBtn = createEl(
      "button",
      { class: buttonClass, id: "collapse" },
      "-"
    );
    const expandBtn = createEl(
      "button",
      { class: [buttonClass, hide].join(" "), id: "expand" },
      "+"
    );

    //  logic
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLButtonElement;

      if (target.id === collapseBtn.id) {
        expandBtn.classList.remove(hide);
        root.classList.add(hide);
      } else {
        expandBtn.classList.add(hide);
        root.classList.remove(hide);
      }
    }
    collapseBtn.addEventListener("click", handleClick);
    expandBtn.addEventListener("click", handleClick);
    addEventListener("beforeunload", () => {
      collapseBtn.removeEventListener("click", handleClick);
      expandBtn.removeEventListener("click", handleClick);
    });

    // styles
    const style = document.createElement("style");
    const styleRules = generateCssRule({
      [`.${hide}`]: { display: "none" },
      [`#${root.id}`]: {
        padding: "1em",
        position: "absolute",
        top: "0",
        border: "1em solid salmon",
        background: "white",
        zIndex: "1000",
        width: "100vw",
      },
      [`#${heading.id}`]: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "1em",
      },
      [`#${h1.id}`]: { margin: "0" },
      [`#${collapseBtn.id}`]: { display: "block" },
      [`#${expandBtn.id}`]: {
        position: "fixed",
        bottom: "1em",
        right: "1.5em",
        display: "none",
      },
      [`.${buttonClass}`]: {
        height: "2em",
        width: "2em",
        borderRadius: "90px",
        background: "salmon",
      },
      [`.${buttonClass}:hover, .${buttonClass}:focus`]: {
        backgroundColor: "rgb(250 128 114 / 70%)",
        textDecoration: "none",
      },
    });

    // combine nodes
    style.appendChild(styleRules);
    heading.append(h1);
    heading.append(collapseBtn);
    root.append(heading);
    queries.forEach((q) => root.append(cloneNode(q)));

    // update document
    const documentBody = getNode("body");
    documentBody.prepend(root);
    documentBody.append(expandBtn);
    document.getElementsByTagName("head")[0].appendChild(style);
  }
}

function instantiateMutation(queries: Query[], target: Query) {
  const callback: MutationCallback = (mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) {
          queries.forEach((query) => {
            if (node.matches(query) || node.querySelectorAll(query).length) {
              log(`removing ${node.childElementCount} node`);
              try {
                node.remove();
              } catch (error) {
                log(`error removing node: `, error);
              }
            }
          });
        }
      });
    });
  };

  const observer = new MutationObserver(callback);
  const mutationTarget = getNode(target);

  log(`instantiating observer`);
  observer.observe(mutationTarget, { subtree: true, childList: true });

  return observer;
}

export function init(queries: Query[], appRoot: Query) {
  // instantiate observers
  const observer = instantiateMutation(queries, appRoot);

  window.onload = function () {
    removeElements(queries);
    new Overlay([
      '[data-testid="RecipePageLedBackground"]',
      "[class^='recipe']",
      '[data-testid="RecipePagContentBackground"]',
    ]);
  };

  // clean up
  addEventListener("beforeunload", () => {
    log("disconnecting");
    observer.disconnect();
  });
}
