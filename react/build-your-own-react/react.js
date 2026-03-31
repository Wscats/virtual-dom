'use strict';

/**
 * Create a DOM element from JSX-like syntax.
 * Supports class components, function components, and native elements.
 * @param {string|Function} parentEle - Tag name or component constructor/function
 * @param {Object} props - Element properties (unused in this simplified implementation)
 * @param {...*} childEles - Child elements or text content
 * @returns {HTMLElement} Created DOM element
 */
function createElement(parentEle, props, ...childEles) {
    if (typeof parentEle === 'function' && /^\s*class\s+/.test(parentEle.toString())) {
        const component = new parentEle();
        return component.render();
    }
    else if (typeof parentEle === 'function') {
        return parentEle();
    } else {
        const parentElement = document.createElement(parentEle);
        childEles.forEach(child => {
            if(typeof child === 'string') {
                parentElement.innerHTML += child;
            } else if(typeof child === 'object') {
                parentElement.appendChild(child);
            }
        });
        return parentElement;
    }
}

/** Render an element into a root DOM container. */
function render(insertEle, rootEle) {
    rootEle.appendChild(insertEle);
}

const React = {
    createElement
};

const ReactDOM = {
    render
};