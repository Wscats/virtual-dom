'use strict';

/** Virtual DOM node (simplified). */
interface VNode {
  type: string;
  props: Record<string, unknown>;
  children: VNode | VNode[] | string | undefined;
}

/**
 * Create a virtual DOM element (simplified version).
 */
function createElement(type: string, props: Record<string, unknown> | null, ...childrens: unknown[]): VNode {
  return {
    type,
    props: { ...props },
    children: childrens.length <= 1 ? (childrens[0] as VNode | string | undefined) : (childrens as VNode[]),
  };
}

/**
 * Render a virtual DOM tree into a real DOM container.
 */
function render(jsxObj: VNode, container: HTMLElement, callback?: () => void): void {
  const { type, props, children } = jsxObj;
  const newElement = document.createElement(type);

  // Process attributes
  for (const attr in props) {
    if (!props.hasOwnProperty(attr)) break;
    switch (attr) {
      case 'className':
        newElement.setAttribute('class', props[attr] as string);
        break;
      case 'style': {
        const styleOBJ = props['style'] as Record<string, string>;
        for (const key in styleOBJ) {
          if (styleOBJ.hasOwnProperty(key)) {
            (newElement.style as Record<string, unknown>)[key] = styleOBJ[key];
          }
        }
        break;
      }
      case 'children':
        // Skip — handled separately via renderChildren
        break;
      default:
        newElement.setAttribute(attr, props[attr] as string);
    }
  }

  renderChildren();

  function renderChildren(): void {
    let childrenAry: unknown[] = Array.isArray(children) ? children : (children ? [children] : []);
    childrenAry.forEach(item => {
      if (typeof item === 'string') {
        newElement.appendChild(document.createTextNode(item));
      } else {
        render(item as VNode, newElement);
      }
    });
  }

  console.log(newElement);
  container.appendChild(newElement);
  callback && callback();
}