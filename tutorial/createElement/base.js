class Component {}
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
        return createElement("div", {
            onClick: this.like
        }, ["hello world", createElement("div", {
            onClick: this.like
        }, "hello world")])
    }
}
// 1.自定义标签，组件
let jsxObj1 = createElement(App, null)

// 2.自带标签
this.like = () => {
    console.log(1)
}
let jsxObj2 = createElement("div", {
    onClick: this.like
}, ["hello world", createElement("div", {
    onClick: this.like
}, "hello world")])

// 3.组件和自带标签混合使用
this.like = () => {
    console.log(1)
}
let jsxObj3 = createElement("div", {
    onClick: this.like
}, [createElement(App, null)])

function createElement(type, props, ...children) {
    props = Object.assign({}, props);
    props.children = [].concat(...children)
        // 筛选
        .filter(child => child != null && child !== false)
        // 遍历操作 如果是对象则筛选掉(这里会筛选JSX对象和组件对象)，留下来文本节点进行处理
        .map(child => child instanceof Object ? child : createTextElement(child));
    return {
        type,
        props
    };
}

function createTextElement(value) {
    // 把文本节点从字符串变为对象{type:'TEXT_ELEMENT',props:{nodeValue:文本值}}
    // 注意文本节点没有传children，所以children是肯定是空数组
    return createElement('TEXT_ELEMENT', {
        nodeValue: value
    });
}
console.log("1.自定义标签，组件")
console.log(jsxObj1)
console.log("2.自带标签")
console.log(jsxObj2)
console.log("3.组件和自带标签混合使用")
console.log(jsxObj3)