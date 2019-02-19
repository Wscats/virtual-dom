function createElement(parentEle, props, ...childEles) {
    if (typeof parentEle === 'function' && /^\s*class\s+/.test(parentEle.toString())) {
        let component = new parentEle();
        return component.render();
    }
    else if (typeof parentEle === 'function') {
        return parentEle();
    } else {
        let parentElement = document.createElement(parentEle);
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

function render(insertEle, rootEle) {
    rootEle.appendChild(insertEle);
}

React = {
    createElement
}

ReactDOM = {
    render
}