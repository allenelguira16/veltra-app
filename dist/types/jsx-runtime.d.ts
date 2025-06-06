export { F as Fragment } from './render-DmTlmpbK.js';

declare const jsx: (type: any, { children, ...props }: any) => any;
declare const jsxs: (type: any, { children, ...props }: any) => any;

declare global {
    namespace JSX {
        type Element = string | number | Function | Node | DocumentFragment | Element[];
        interface IntrinsicElements {
            [elemName: string]: any;
        }
        interface ElementChildrenAttribute {
            children: {};
        }
    }
}

export { jsx, jsxs };
