function reconcile(parentDom, instance, element) {
    if (instance === null) {
        const newInstance = instantiate(element);
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
        instance.publicInstance.props = element.props;
        const newChildElement = instance.publicInstance.render();
        const oldChildInstance = instance.childInstance;
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
let rootInstance = null;

function render(element, parentDom) {
    const prevInstance = rootInstance;
    const nextInstance = reconcile(parentDom, prevInstance, element);
    rootInstance = nextInstance;
}


// 测试代码
class Component {
    constructor() {
        this.state = this.state || {};
    }
    setState(partialState) {
        // 获取变动的state对象，并与旧state合并
        this.state = Object.assign({}, this.state, partialState);
        // update instance
        const parentDom = this.__internalInstance.dom.parentNode;
        const element = this.__internalInstance.element;
        reconcile(parentDom, this.__internalInstance, element);
    }
}
class App extends Component {
    like() {
        console.log(1)
    }
    // 这句render在这里暂不起任何作用
    render() {
        return {}
    }
    componentWillMount() {
        console.log('componentWillMount')
        setInterval(()=>{
            this.setState({
                
            })
        },1000)
    }
}

// 模拟的DOM
let dom = document.createElement('div');
dom.innerHTML = 'hello wolrd';
// 这个是伪instantiate，输出是一个固定的未挂载虚拟DOM结构
let obj = {
    childInstance: {
        element: {},
        dom: 'div',
        childInstances: []
    },
    dom,
    element: {
        // 未实例化
        type: App,
        props: {
            name: "appCp",
            children: [],
            age: 19
        }
    },
    // 实例化后
    publicInstance: new App,
}

function instantiate(element) {
    return {
        ...obj,
        __internalInstance: obj
    }
}
// 由于已经模拟了instantiate方法的返回值，所以这里第一个参数就不传组件了，传了null进行模拟
render(null, document.querySelector("#root"))