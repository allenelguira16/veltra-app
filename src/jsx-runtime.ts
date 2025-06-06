import { normalizeDom } from "./util";
import { h, Fragment, hSSR } from "./render";
import { IS_SSR } from "./const";

// Transform jsx to use h
export const jsx = (type: any, { children = [], ...props }: any) => {
  if (IS_SSR) {
    return hSSR(type, props, normalizeDom(children));
  }

  return h(type, props, normalizeDom(children));
};

export const jsxs = jsx;
export { Fragment };

declare global {
  // TODO: add specific types not just any
  namespace JSX {
    type Element =
      | string
      | number
      | Function
      | Node
      | DocumentFragment
      | Element[];

    interface IntrinsicElements {
      [elemName: string]: any;
    }

    interface ElementChildrenAttribute {
      children: {};
    }
  }
}
