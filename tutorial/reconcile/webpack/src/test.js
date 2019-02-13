let {
    updateDomProperties
} = require('./updateDomProperties.js');
function reconcile(parentDom, instance, element) {
    if (instance === null) {
        const newInstance = instantiate(element);
        console.log('newInstance',newInstance)
        // componentWillMount
        newInstance.publicInstance &&
            newInstance.publicInstance.componentWillMount &&
            newInstance.publicInstance.componentWillMount();
        parentDom.appendChild(newInstance.dom);
        // componentDidMount
        newInstance.publicInstance &&
            newInstance.publicInstance.componentDidMount &&
            newInstance.publicInstance.componentDidMount();
        return newInstance;
    } else if (element === null) {
        // componentWillUnmount
        instance.publicInstance &&
            instance.publicInstance.componentWillUnmount &&
            instance.publicInstance.componentWillUnmount();
        parentDom.removeChild(instance.dom);
        return null;
    } else if (instance.element.type !== element.type) {
        const newInstance = instantiate(element);
        // componentDidMount
        newInstance.publicInstance &&
            newInstance.publicInstance.componentDidMount &&
            newInstance.publicInstance.componentDidMount();
        parentDom.replaceChild(newInstance.dom, instance.dom);
        return newInstance;
    } else if (typeof element.type === 'string') {
        // 更新属性值
        // instance.element.props是旧的props
        // element.props是新的props
        updateDomProperties(instance.dom, instance.element.props, element.props);
        instance.childInstances = reconcileChildren(instance, element);
        instance.element = element;
        return instance;
    } else {
        if (instance.publicInstance &&
            instance.publicInstance.shouldcomponentUpdate) {
            if (!instance.publicInstance.shouldcomponentUpdate()) {
                return;
            }
        }
        // componentWillUpdate
        instance.publicInstance &&
            instance.publicInstance.componentWillUpdate &&
            instance.publicInstance.componentWillUpdate();
        // 更新props
        instance.publicInstance.props = element.props;
        // 只有组件才会触发componentWillUpdate生命周期，触发render方法，重新获取组件JSX对象
        const newChildElement = instance.publicInstance.render();
        // 获取组件旧JSX生成的未挂载虚拟DOM对象信息，存放在childInstance里面
        const oldChildInstance = instance.childInstance;
        // 不断触发reconcile对比前后的对象，然后进行reconcile
        const newChildInstance = reconcile(parentDom, oldChildInstance, newChildElement);
        // componentDidUpdate
        instance.publicInstance &&
            instance.publicInstance.componentDidUpdate &&
            instance.publicInstance.componentDidUpdate();
        instance.dom = newChildInstance.dom;
        instance.childInstance = newChildInstance;
        instance.element = element;
        return instance;
    }
}

function reconcileChildren(instance, element) {
    const {
        dom,
        childInstances
    } = instance;
    const newChildElements = element.props.children || [];
    // max() 方法可返回两个指定的数中带有较大的值的那个数
    // 对比两个虚拟DOM的深度，取最深的进行遍历
    const count = Math.max(childInstances.length, newChildElements.length);
    const newChildInstances = [];
    for (let i = 0; i < count; i++) {
        newChildInstances[i] = reconcile(dom, childInstances[i], newChildElements[i]);
    }
    return newChildInstances.filter(instance => instance !== null);
}
let rootInstance = null;

function render(element, parentDom) {
    const prevInstance = rootInstance;
    const nextInstance = reconcile(parentDom, prevInstance, element);
    rootInstance = nextInstance;
}


// 测试代码
class Component {
    constructor(props) {
        this.props = props;
        this.state = this.state || {};
    }
    setState(partialState) {
        // 获取变动的state对象，并与旧state合并
        this.state = Object.assign({}, this.state, partialState);
        // update instance
        const parentDom = this.__internalInstance.dom.parentNode;
        const element = this.__internalInstance.element;
        // this.__internalInstance保存着组件新旧的信息
        // 新的组件信息存在instance.publicInstance里面
        // 旧的组件信息存在instance.childInstance里面
        reconcile(parentDom, this.__internalInstance, element);
    }
}
// 为后面instantiate提供组件判断的依据
Component.prototype.isReactComponent = {};

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            num: 0.1314
        }
    }
    like() {
        console.log(1)
    }
    // 这句render在这里暂不起任何作用
    render() {
        return (createElement("p", null, this.state.num))
    }
    componentWillMount() {
        console.log('componentWillMount')
        setTimeout(() => {
            console.log('触发了setState')
            this.setState({
                num: Math.random()
            })
        }, 1000)
    }
    componentWillUpdate() {
        console.log('componentWillUpdate')
    }
}

let {
    createElement,
    createTextElement
} = require("./createElement.js")

let {
    instantiate
} = require("./instantiate.js")

// 这里如果直接放<App />组件在根组件的话才可以执行生命周期
// 因为reconcile还没进行优化
// <div><App /></div>如果是这种结构的话，App组件的生命周期不会触发
render(createElement(App, null), document.querySelector("#root"))