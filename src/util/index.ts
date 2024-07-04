function log(s: string, ...args: string[]) {
  console.debug(`🍳 ${s}`, ...args);
}

export function getNode<E extends Element>(selector: string): E {
  const el = document.querySelector<E>(selector);

  if (el === null) {
    throw Error(`🍳 Unable to find element: ${selector}`);
  }

  return el;
}

/**
 * Deep clone node and return it wrapped in a `section` element
 */
export function cloneNode(selector: string) {
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
  log(`🍳 removing empty divs`);
  Array.from(document.querySelectorAll("div"))
    .filter((el) => !el.hasChildNodes())
    .forEach((el) => el.remove());
}

function removeByQuery(string: keyof HTMLElementTagNameMap | string) {
  log(`🍳 removing ${string}`);
  Array.from(document.querySelectorAll(string)).forEach((el) => el.remove());
}

export function removeElements(
  queries: (keyof HTMLElementTagNameMap | string)[]
) {
  console.debug(`🍳 removing nodes`);
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

export class Overlay {
  root: HTMLElement;
  expandBtn: HTMLElement;

  constructor() {
    // dom nodes
    const root = createEl("section", { id: "root" });
    const heading = createEl("div", { id: "heading" });
    const h1 = createEl("h1", { id: "h1" }, "Recipe:");
    const buttonClass = "toggle-button";
    const collapseBtn = createEl(
      "button",
      { class: buttonClass, id: "collapse" },
      "-"
    );
    const expandBtn = createEl(
      "button",
      { class: buttonClass, id: "expand" },
      "+"
    );

    // styles
    const style = document.createElement("style");
    const styleRules = generateCssRule({
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

    heading.append(h1);
    heading.append(collapseBtn);
    root.append(heading);

    style.appendChild(styleRules);
    document.getElementsByTagName("head")[0].appendChild(style);

    // button logic
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLButtonElement;

      if (target.id === collapseBtn.id) {
        expandBtn.style.display = "block";
        root.style.display = "none";
      } else {
        expandBtn.style.display = "none";
        root.style.display = "block";
      }
    }
    collapseBtn.addEventListener("click", handleClick);
    expandBtn.addEventListener("click", handleClick);
    addEventListener("beforeunload", () => {
      collapseBtn.removeEventListener("click", handleClick);
      expandBtn.removeEventListener("click", handleClick);
    });

    const documentBody = getNode("body");
    documentBody.append(expandBtn);

    this.root = root;
    this.expandBtn = expandBtn;
  }
}
