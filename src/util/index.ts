export function getNode<E extends Element>(selector: string): E {
  const el = document.querySelector<E>(selector);

  if (el === null) {
    throw Error(`🍳 Unable to find element: ${selector}`);
  }

  return el;
}

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
export function removeEmptyDiv() {
  console.debug(`🍳 removing empty divs`);
  Array.from(document.querySelectorAll("div"))
    .filter((el) => !el.hasChildNodes())
    .forEach((el) => el.remove());
}

export function removeByQuery(string: keyof HTMLElementTagNameMap | string) {
  console.debug(`🍳 removing ${string}`);
  Array.from(document.querySelectorAll(string)).forEach((el) => el.remove());
}

/** @see https://stackoverflow.com/a/67243723 */
export function kebabize(str: string) {
  return str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? "-" : "") + $.toLowerCase()
  );
}

export function generateCssText(css: Partial<CSSStyleDeclaration>) {
  return Object.keys(css)
    .map((key) => `${kebabize(key)}:${css[key as keyof typeof css]}`)
    .join(";");
}

export function createEl(
  tag: keyof HTMLElementTagNameMap,
  css: Partial<CSSStyleDeclaration>,
  content: string = "",
  attr: Record<string, string> = {}
): HTMLElement {
  const el = document.createElement(tag);
  el.style.cssText = generateCssText(css);

  if (content) {
    el.textContent = content;
  }

  if (attr) {
    Object.keys(attr).forEach((name) =>
      el.setAttribute(name, attr[name as keyof typeof attr])
    );
  }

  return el;
}
