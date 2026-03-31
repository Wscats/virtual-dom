'use strict';

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

interface Instance {
  element: VNode;
  dom: Node;
  childInstances?: Instance[];
  childInstance?: Instance;
  publicInstance?: ComponentInstance;
}

interface ComponentConstructor {
  new (props: Record<string, unknown>): ComponentInstance;
  prototype: { isReactComponent?: Record<string, never> };
}

interface ComponentInstance {
  props: Record<string, unknown>;
  state: Record<string, unknown>;
  __internalInstance: Instance;
  render(): VNode;
  setState(partialState: Record<string, unknown>): void;
  componentWillMount?(): void;
  componentDidMount?(): void;
  componentWillUnmount?(): void;
  componentWillUpdate?(): void;
  componentDidUpdate?(): void;
  shouldcomponentUpdate?(): boolean;
}

/**
 * Full DIY React implementation with lifecycle hooks and reconciliation.
 */
function importFromBelow(): { render: typeof render; createElement: typeof createElement; Component: typeof Component } {
  const TEXT_ELEMENT = 'TEXT_ELEMENT';

  function updateDomProperties(dom: Node, prevProps: Record<string, unknown>, nextProps: Record<string, unknown>): void {
    const isEvent = (name: string): boolean => name.startsWith('on');
    const isAttribute = (name: string): boolean => !isEvent(name) && name !== 'children';

    Object.keys(prevProps).filter(isEvent).forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name] as EventListener);
    });

    Object.keys(prevProps).filter(isAttribute).forEach(name => {
      (dom as Record<string, unknown>)[name] = null;
    });

    Object.keys(nextProps).filter(isAttribute).forEach(name => {
      (dom as Record<string, unknown>)[name] = nextProps[name];
    });

    Object.keys(nextProps).filter(isEvent).forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name] as EventListener);
    });
  }

  let rootInstance: Instance | null = null;

  function render(element: VNode, parentDom: HTMLElement): void {
    const prevInstance = rootInstance;
    const nextInstance = reconcile(parentDom, prevInstance, element);
    rootInstance = nextInstance;
  }

  function reconcile(parentDom: HTMLElement, instance: Instance | null, element: VNode | null): Instance | null {
    if (instance === null && element) {
      const newInstance = instantiate(element);
      newInstance.publicInstance?.componentWillMount?.();
      parentDom.appendChild(newInstance.dom);
      newInstance.publicInstance?.componentDidMount?.();
      return newInstance;
    } else if (element === null && instance) {
      instance.publicInstance?.componentWillUnmount?.();
      parentDom.removeChild(instance.dom);
      return null;
    } else if (instance && element && instance.element.type !== element.type) {
      const newInstance = instantiate(element);
      newInstance.publicInstance?.componentDidMount?.();
      parentDom.replaceChild(newInstance.dom, instance.dom);
      return newInstance;
    } else if (instance && element && typeof element.type === 'string') {
      updateDomProperties(instance.dom, instance.element.props, element.props);
      instance.childInstances = reconcileChildren(instance, element);
      instance.element = element;
      return instance;
    } else if (instance && element) {
      if (instance.publicInstance?.shouldcomponentUpdate) {
        if (!instance.publicInstance.shouldcomponentUpdate()) {
          return instance;
        }
      }
      instance.publicInstance?.componentWillUpdate?.();
      instance.publicInstance!.props = element.props as Record<string, unknown>;
      const newChildElement = instance.publicInstance!.render();
      const oldChildInstance = instance.childInstance!;
      const newChildInstance = reconcile(parentDom, oldChildInstance, newChildElement);
      instance.publicInstance?.componentDidUpdate?.();
      instance.dom = newChildInstance!.dom;
      instance.childInstance = newChildInstance!;
      instance.element = element;
      return instance;
    }
    return instance;
  }

  function reconcileChildren(instance: Instance, element: VNode): Instance[] {
    const { dom, childInstances = [] } = instance;
    const newChildElements = element.props.children || [];
    const count = Math.max(childInstances.length, newChildElements.length);
    const newChildInstances: (Instance | null)[] = [];
    for (let i = 0; i < count; i++) {
      newChildInstances[i] = reconcile(dom as HTMLElement, childInstances[i] || null, newChildElements[i] || null);
    }
    return newChildInstances.filter((inst): inst is Instance => inst !== null);
  }

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
    } else {
      // Functional component
      const childElement = (type as (props: Record<string, unknown>) => VNode)(element.props as Record<string, unknown>);
      const childInstance = instantiate(childElement);
      return { dom: childInstance.dom, element, childInstance };
    }
  }

  function createTextElement(value: unknown): VNode {
    return createElement(TEXT_ELEMENT, { nodeValue: value });
  }

  function createElement(type: string | ComponentConstructor, props: Record<string, unknown> | null, ...children: unknown[]): VNode {
    const mergedProps: VNodeProps = Object.assign({}, props) as VNodeProps;
    mergedProps.children = ([] as unknown[]).concat(...children)
      .filter(child => child !== null && child !== false)
      .map(child => child instanceof Object ? child as VNode : createTextElement(child));
    return { type, props: mergedProps };
  }

  function createPublicInstance(element: VNode, instance: Instance): ComponentInstance {
    const { type, props } = element;
    const publicInstance = new (type as ComponentConstructor)(props as Record<string, unknown>);
    publicInstance.__internalInstance = instance;
    return publicInstance;
  }

  class Component {
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

  (Component.prototype as Record<string, unknown>).isReactComponent = {};

  return { render, createElement, Component };
}

export { importFromBelow };