const TEXT_ELEMENT = 'TEXT_ELEMENT';

function createElement(type, props, ...children) {
    props = Object.assign({}, props);
    props.children = [].concat(...children)
        // 筛选
        .filter(child => child != null && child !== false)
        // 遍历操作
        .map(child => child instanceof Object ? child : createTextElement(child));
    return {
        type,
        props
    };
}

function createTextElement(value) {
    return createElement(TEXT_ELEMENT, {
        nodeValue: value
    });
}

function updateDomProperties(dom, prevProps, nextProps) {
    const isEvent = name => name.startsWith("on");
    const isAttribute = name => !isEvent(name) && name != "children";
    console.log(isEvent,isAttribute)
    // Remove event listeners
    Object.keys(prevProps).filter(isEvent).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[name]);
    });

    // Remove attributes
    Object.keys(prevProps).filter(isAttribute).forEach(name => {
        dom[name] = null;
    });

    // Set attributes
    Object.keys(nextProps).filter(isAttribute).forEach(name => {
        dom[name] = nextProps[name];
    });

    // Add event listeners
    Object.keys(nextProps).filter(isEvent).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[name]);
    });
}

let rootInstance = null;

function render(element, parentDom) {
    const prevInstance = rootInstance;
    console.log(element, parentDom)
    const nextInstance = reconcile(parentDom, prevInstance, element);
    rootInstance = nextInstance;
}

function reconcile(parentDom, instance, element) {
    if (instance === null) {
        const newInstance = instantiate(element);
        // componentWillMount
        // newInstance.publicInstance &&
        //     newInstance.publicInstance.componentWillMount &&
        //     newInstance.publicInstance.componentWillMount();
        console.log(parentDom, newInstance)
        parentDom.appendChild(newInstance.dom);
        // componentDidMount
        // newInstance.publicInstance &&
        //     newInstance.publicInstance.componentDidMount &&
        //     newInstance.publicInstance.componentDidMount();
        return newInstance;
    }
}

function createPublicInstance(element, instance) {
    const {
        type,
        props
    } = element;
    // 把组件实例化
    const publicInstance = new type(props);
    publicInstance.__internalInstance = instance;
    return publicInstance;
}


function instantiate(element) {
    const {
        type,
        props = {}
    } = element;
    // 判断内置标签
    const isDomElement = typeof type === 'string';
    // 判断自定义标签 也就是组件  如果是组件的话那原型链会有isReactComponent
    const isClassElement = !!(type.prototype && type.prototype.isReactComponent);
    if (isDomElement) {
        console.log(element)
        // 创建dom
        const isTextElement = type === TEXT_ELEMENT;
        console.log(isTextElement);
        const dom = isTextElement ? document.createTextNode('') : document.createElement(type);
        console.log(dom)
        // // 设置dom的事件、数据属性
        updateDomProperties(dom, [], element.props);
        const children = props.children || [];
        const childInstances = children.map(instantiate);
        const childDoms = childInstances.map(childInstance => childInstance.dom);
        console.log(childInstances,childDoms)
        childDoms.forEach(childDom => dom.appendChild(childDom));
        const instance = {
            element,
            dom,
            childInstances
        };
        return instance;
    } else
    if (isClassElement) {
        const instance = {};
        const publicInstance = createPublicInstance(element, instance);
        console.log(publicInstance)
        const childElement = publicInstance.render();
        const childInstance = instantiate(childElement);
        console.log(childElement)
        Object.assign(instance, {
            dom: childInstance.dom,
            element,
            childInstance,
            publicInstance
        });
        return instance;
    }
    // else {
    //     const childElement = type(element.props);
    //     const childInstance = instantiate(childElement);
    //     const instance = {
    //         dom: childInstance.dom,
    //         element,
    //         childInstance
    //     };
    //     return instance;
    // }
}

class Component {
    constructor(props) {
        this.props = props;
        this.state = this.state || {};
    }

    setState(partialState) {
        this.state = Object.assign({}, this.state, partialState);
        // update instance
        const parentDom = this.__internalInstance.dom.parentNode;
        const element = this.__internalInstance.element;
        // reconcile(parentDom, this.__internalInstance, element);
    }
}
// 为后面instantiate提供组件判断的依据
Component.prototype.isReactComponent = {};

module.exports = {
    createElement,
    render,
    Component
}