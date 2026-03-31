'use strict';

const TEXT_ELEMENT = 'TEXT_ELEMENT';

/**
 * Create a virtual DOM element.
 * @param {string|Function} type - Element type or component constructor
 * @param {Object} props - Element properties
 * @param {...*} children - Child elements
 * @returns {Object} Virtual DOM node
 */
function createElement(type, props, ...children) {
    props = Object.assign({}, props);
    props.children = [].concat(...children)
        .filter(child => child !== null && child !== false)
        .map(child => child instanceof Object ? child : createTextElement(child));
    return {
        type,
        props
    };
}

/** Create a text virtual DOM element. */
function createTextElement(value) {
    return createElement(TEXT_ELEMENT, {
        nodeValue: value
    });
}

/**
 * Update DOM element properties (attributes and event listeners).
 * @param {HTMLElement} dom - Target DOM element
 * @param {Object} prevProps - Previous properties
 * @param {Object} nextProps - Next properties
 */
function updateDomProperties(dom, prevProps, nextProps) {
    const isEvent = name => name.startsWith("on");
    const isAttribute = name => !isEvent(name) && name !== "children";

    // Remove old event listeners
    Object.keys(prevProps).filter(isEvent).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[name]);
    });

    // Remove old attributes
    Object.keys(prevProps).filter(isAttribute).forEach(name => {
        dom[name] = null;
    });

    // Set new attributes
    Object.keys(nextProps).filter(isAttribute).forEach(name => {
        dom[name] = nextProps[name];
    });

    // Add new event listeners
    Object.keys(nextProps).filter(isEvent).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[name]);
    });
}

let rootInstance = null;

/**
 * Render a virtual DOM element into a parent DOM node.
 * @param {Object} element - Virtual DOM element
 * @param {HTMLElement} parentDom - Parent DOM container
 */
function render(element, parentDom) {
    const prevInstance = rootInstance;
    const nextInstance = reconcile(parentDom, prevInstance, element);
    rootInstance = nextInstance;
}

/**
 * Reconcile a virtual DOM element with an existing instance.
 * @param {HTMLElement} parentDom - Parent DOM container
 * @param {Object|null} instance - Existing component instance
 * @param {Object} element - Virtual DOM element to reconcile
 * @returns {Object} Reconciled instance
 */
function reconcile(parentDom, instance, element) {
    if (instance === null) {
        const newInstance = instantiate(element);
        parentDom.appendChild(newInstance.dom);
        return newInstance;
    }
}

/**
 * Create a public instance of a class component.
 * @param {Object} element - Virtual DOM element
 * @param {Object} instance - Internal instance
 * @returns {Object} Public component instance
 */
function createPublicInstance(element, instance) {
    const {
        type,
        props
    } = element;
    const publicInstance = new type(props);
    publicInstance.__internalInstance = instance;
    return publicInstance;
}

/**
 * Instantiate a virtual DOM element into a real DOM tree.
 * @param {Object} element - Virtual DOM element
 * @returns {Object} Instance with dom, element, and child references
 */
function instantiate(element) {
    const {
        type,
        props = {}
    } = element;
    const isDomElement = typeof type === 'string';
    const isClassElement = !!(type.prototype && type.prototype.isReactComponent);

    if (isDomElement) {
        const isTextElement = type === TEXT_ELEMENT;
        const dom = isTextElement ? document.createTextNode('') : document.createElement(type);
        updateDomProperties(dom, [], element.props);
        const children = props.children || [];
        const childInstances = children.map(instantiate);
        const childDoms = childInstances.map(childInstance => childInstance.dom);
        childDoms.forEach(childDom => dom.appendChild(childDom));
        const instance = {
            element,
            dom,
            childInstances
        };
        return instance;
    } else if (isClassElement) {
        const instance = {};
        const publicInstance = createPublicInstance(element, instance);
        const childElement = publicInstance.render();
        const childInstance = instantiate(childElement);
        Object.assign(instance, {
            dom: childInstance.dom,
            element,
            childInstance,
            publicInstance
        });
        return instance;
    }
}

/** Base Component class for class-based components. */
class Component {
    constructor(props) {
        this.props = props;
        this.state = this.state || {};
    }

    setState(partialState) {
        this.state = Object.assign({}, this.state, partialState);
        const parentDom = this.__internalInstance.dom.parentNode;
        const element = this.__internalInstance.element;
        reconcile(parentDom, this.__internalInstance, element);
    }
}

/** Marker to identify class components during instantiation. */
Component.prototype.isReactComponent = {};

module.exports = {
    createElement,
    render,
    Component
}