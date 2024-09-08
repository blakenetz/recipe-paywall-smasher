export type Query = keyof HTMLElementTagNameMap | string;

export function log(s: string, ...args: any[]) {
  console.debug(`🍳 ${s}`, ...args);
}

export const hideClass = "rps-hide";

export function getNode<E extends Element = Element>(selector: string): E {
  const el = document.querySelector<E>(selector);

  if (el === null) {
    throw Error(`🍳 Unable to find element: ${selector}`);
  }

  return el;
}
