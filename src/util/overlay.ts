import { getNode, hideClass, log, Query } from ".";

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
  public root: HTMLElement;
  public expandBtn: HTMLElement;
  private style: HTMLStyleElement;

  constructor(queries: Query[]) {
    log("Instantiating overlay");
    // shared classes
    const buttonClass = "toggle-button";

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
      { class: [buttonClass, hideClass].join(" "), id: "expand" },
      "+"
    );

    //  logic
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLButtonElement;

      if (target.id === collapseBtn.id) {
        expandBtn.classList.remove(hideClass);
        root.classList.add(hideClass);
      } else {
        expandBtn.classList.add(hideClass);
        root.classList.remove(hideClass);
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
      [`.${hideClass}`]: { display: "none !important" },
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
      [`#${expandBtn.id}`]: {
        position: "fixed",
        bottom: "1em",
        right: "1.5em",
        zIndex: "1000",
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

    this.root = root;
    this.expandBtn = expandBtn;
    this.style = style;
  }

  attach() {
    const documentBody = getNode("body");
    documentBody.prepend(this.root);
    documentBody.append(this.expandBtn);
    document.getElementsByTagName("head")[0].appendChild(this.style);
  }
}
