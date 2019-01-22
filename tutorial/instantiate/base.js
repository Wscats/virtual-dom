function instantiate(element) {
    const {
        type,
        props = {}
    } = element;
    // 判断内置标签
    const isDomElement = typeof type === 'string';
    // 判断自定义标签 也就是组件  如果是组件的话那原型链会有isReactComponent
    const isClassElement = !!(type.prototype && type.prototype.isReactComponent);
    // 内置标签的分支
    if (isDomElement) {
        console.log(element)
        // 创建dom 这里判断是文本节点还是元素节点 例如元素节点会是{type:'div'} 文本节点为{type:'TEXT_ELEMENT'}
        const isTextElement = type === 'TEXT_ELEMENT';
        console.log(isTextElement);
        // 如果是文本节点将对象转为空字符串'' 如果是元素节点将对象转为<div></div>
        const dom = isTextElement ? document.createTextNode('') : document.createElement(type);
        console.log(dom)
        // 设置dom的事件、数据属性
        // updateDomProperties(dom, [], element.props);
        // 如果有子元素赋值给children，否则赋值空数组
        const children = props.children || [];
        // 遍历children所有的子元素并进行处理
        // 这一句非常关键会一层层遍历对象，div.props.children -> p.props.children -> "TEXT_ELEMENT".props.children
        // 遍历到最底层的时候再沿路往上返回 return {element,dom,childInstances} 对象回到div
        const childInstances = children.map(instantiate);
        console.log(childInstances)
        const childDoms = childInstances.map(childInstance => childInstance.dom);
        console.log(childDoms)
        childDoms.forEach(childDom => dom.appendChild(childDom));
        const instance = {
            // 每个子节点对象
            element,
            // 子节点生成尚未挂载的虚拟DOM
            dom,
            // 每个子节点下的所有子节点instance信息
            childInstances
        };
        return instance;
    } 
    // 自定义标签(组件)的分支
    else if (isClassElement) {
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
    } else {
        const childElement = type(element.props);
        const childInstance = instantiate(childElement);
        const instance = {
            dom: childInstance.dom,
            element,
            childInstance
        };
        return instance;
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

class Component {}
// 为后面instantiate提供组件判断的依据
Component.prototype.isReactComponent = {};
// 自定义组件
class App extends Component {
    constructor(e) {
        super(e), this.props = {
            name: "laoxie"
        }, this.state = {
            name: "laoyao",
            age: 18
        }
    }
    like() {
        console.log(1)
    }
    // 这句render在这里暂不起任何作用
    render() {
        return {
            type: 'div',
            props: {
                children: [{
                    type: "p",
                    props: {
                        children: [{
                            type: "TEXT_ELEMENT",
                            props: {
                                nodeValue: "hello world",
                                children: []
                            }
                        }]
                    }
                }]
            }
        }
    }
}

let element = {
    type: App,
    props: {
        children: []
    }
}

let instance = instantiate(element)
console.log(instance)