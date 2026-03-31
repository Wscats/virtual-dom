'use strict';

const TEXT_ELEMENT = 'TEXT_ELEMENT';

/** Virtual DOM node. */
interface VNode {
  type: string | ComponentConstructor;
  props: VNodeProps;
}

interface VNodeProps {
  children: VNode[];
  nodeValue?: string;
  [key: string]: unknown;
}

/** Internal instance tracking DOM and virtual DOM state. */
interface Instance {
  element: VNode;
  dom: Node;
  childInstances?: Instance[];
  childInstance?: Instance;
  publicInstance?: ComponentInstance;
}

/** Component constructor type. */
interface ComponentConstructor {
  new (props: Record<string, unknown>): ComponentInstance;
  prototype: { isReactComponent?: Record<string, never> };
}

/** Public component instance. */
interface ComponentInstance {
  props: Record<string, unknown>;
  state: Record<string, unknown>;
  __internalInstance: Instance;
  render(): VNode;
  setState(partialState: Record<string, unknown>): void;
}

/**
 * Create a virtual DOM element.
 * @param type - Element type or component constructor
 * @param props - Element properties
 * @param children - Child elements
 */
function createElement(type: string | ComponentConstructor, props: Record<string, unknown> | null, ...children: unknown[]): VNode {
  const mergedProps: VNodeProps = Object.assign({}, props) as VNodeProps;
  mergedProps.children = ([] as unknown[]).concat(...children)
    .filter(child => child !== null && child !== false)
    .map(child => child instanceof Object ? child as VNode : createTextElement(child));
  return { type, props: mergedProps };
}

/** Create a text virtual DOM element. */
function createTextElement(value: unknown): VNode {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}

/**
 * Update DOM element properties (attributes and event listeners).
 * @param dom - Target DOM element
 * @param prevProps - Previous properties
 * @param nextProps - Next properties
 */
function updateDomProperties(dom: Node, prevProps: Record<string, unknown>, nextProps: Record<string, unknown>): void {
  const isEvent = (name: string): boolean => name.startsWith('on');
  const isAttribute = (name: string): boolean => !isEvent(name) && name !== 'children';

  // Remove old event listeners
  Object.keys(prevProps).filter(isEvent).forEach(name => {
    const eventType = name.toLowerCase().substring(2);
    dom.removeEventListener(eventType, prevProps[name] as EventListener);
  });

  // Remove old attributes
  Object.keys(prevProps).filter(isAttribute).forEach(name => {
    (dom as Record<string, unknown>)[name] = null;
  });

  // Set new attributes
  Object.keys(nextProps).filter(isAttribute).forEach(name => {
    (dom as Record<string, unknown>)[name] = nextProps[name];
  });

  // Add new event listeners
  Object.keys(nextProps).filter(isEvent).forEach(name => {
    const eventType = name.toLowerCase().substring(2);
    dom.addEventListener(eventType, nextProps[name] as EventListener);
  });
}

let rootInstance: Instance | null = null;

/**
 * Render a virtual DOM element into a parent DOM node.
 */
function render(element: VNode, parentDom: HTMLElement): void {
  const prevInstance = rootInstance;
  const nextInstance = reconcile(parentDom, prevInstance, element);
  rootInstance = nextInstance;
}

/**
 * Reconcile a virtual DOM element with an existing instance.
 */
function reconcile(parentDom: HTMLElement, instance: Instance | null, element: VNode): Instance {
  if (instance === null) {
    const newInstance = instantiate(element);
    parentDom.appendChild(newInstance.dom);
    return newInstance;
  }
  // Simplified: only handles initial render
  return instance;
}

/**
 * Create a public instance of a class component.
 */
function createPublicInstance(element: VNode, instance: Instance): ComponentInstance {
  const { type, props } = element;
  const publicInstance = new (type as ComponentConstructor)(props as Record<string, unknown>);
  publicInstance.__internalInstance = instance;
  return publicInstance;
}

/**
 * Instantiate a virtual DOM element into a real DOM tree.
 */
function instantiate(element: VNode): Instance {
  const { type, props = {} as VNodeProps } = element;
  const isDomElement = typeof type === 'string';
  const isClassElement = !!(typeof type === 'function' && type.prototype && type.prototype.isReactComponent);

  if (isDomElement) {
    const isTextElement = type === TEXT_ELEMENT;
    const dom = isTextElement ? document.createTextNode('') : document.createElement(type);
    updateDomProperties(dom, {} as Record<string, unknown>, element.props);
    const children = props.children || [];
    const childInstances = children.map(instantiate);
    const childDoms = childInstances.map(childInstance => childInstance.dom);
    childDoms.forEach(childDom => dom.appendChild(childDom));
    return { element, dom, childInstances };
  } else if (isClassElement) {
    const instance = {} as Instance;
    const publicInstance = createPublicInstance(element, instance);
    const childElement = publicInstance.render();
    const childInstance = instantiate(childElement);
    Object.assign(instance, { dom: childInstance.dom, element, childInstance, publicInstance });
    return instance;
  }

  // Should not reach here
  throw new Error(`Unknown element type: ${type}`);
}

/** Base Component class for class-based components. */
class Component implements Omit<ComponentInstance, '__internalInstance'> {
  public props: Record<string, unknown>;
  public state: Record<string, unknown>;
  public __internalInstance!: Instance;

  constructor(props: Record<string, unknown>) {
    this.props = props;
    this.state = this.state || {};
  }

  setState(partialState: Record<string, unknown>): void {
    this.state = Object.assign({}, this.state, partialState);
    const parentDom = this.__internalInstance.dom.parentNode as HTMLElement;
    const element = this.__internalInstance.element;
    reconcile(parentDom, this.__internalInstance, element);
  }

  render(): VNode {
    throw new Error('Component subclass must implement render()');
  }
}

/** Marker to identify class components during instantiation. */
(Component.prototype as Record<string, unknown>).isReactComponent = {};

export { createElement, render, Component, VNode, VNodeProps, Instance, ComponentInstance };