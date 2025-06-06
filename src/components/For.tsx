import { effect } from "../state";
import { normalizeDom } from "../util";

type ForProps<T> = {
  items: T[];
  children: (item: T, index: number) => JSX.Element;
  fallback?: JSX.Element;
};

type ForPropsReal<T> = {
  items: () => T[];
  children: [() => (item: T, index: number) => JSX.Element];
  fallback?: () => JSX.Element;
};

interface RefNode extends Text {
  mount?: (node: Node) => void;
  unmount?: (node: Node) => void;
}

export function For<T>(props: ForProps<T>) {
  const {
    items: each,
    children: [children],
    fallback: _fallback,
  } = props as unknown as ForPropsReal<T>;

  const $placeholder = document.createTextNode("") as RefNode;
  const $nodes = new Map<any, Node>();
  const $fallback = _fallback?.();
  let previousKeys: any[] = [];

  $placeholder.mount = (anchor: Node) => {
    effect(() => {
      const $parent = anchor.parentNode;
      if (!$parent) return;

      const items = each();

      // Remove old nodes that are no longer used
      for (const oldKey of previousKeys) {
        if (items.includes(oldKey)) {
          continue;
        }

        const node = $nodes.get(oldKey);

        if (node && $parent.contains(node)) {
          $parent.removeChild(node);
        }

        $nodes.delete(oldKey);
      }

      // Insert nodes in correct order
      let referenceNode: ChildNode | null = anchor.nextSibling;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        let $domNodes = $nodes.get(item);

        if (!$domNodes) {
          $domNodes = children()(item, i) as Node;
          $nodes.set(item, $domNodes);
        }

        // Insert each node in the correct order
        if ($domNodes !== referenceNode) {
          $parent.insertBefore($domNodes, referenceNode);
        }

        // Update referenceNode to follow last inserted node
        referenceNode = $domNodes?.nextSibling ?? null;
      }

      // Handle fallback
      if ($fallback instanceof HTMLElement) {
        if (!items.length && !$parent.contains($fallback)) {
          $parent.insertBefore($fallback, anchor.nextSibling);
        } else if (!!items.length && $parent.contains($fallback)) {
          $parent.removeChild($fallback);
        }
      }

      previousKeys = items;
    });
  };

  $placeholder.unmount = (anchor: Node) => {
    const parent = anchor.parentNode;
    if (!parent) return;

    for (const $node of $nodes.values()) {
      if ($node && parent.contains($node)) {
        parent.removeChild($node);
      }
    }
  };

  return $placeholder;
}
