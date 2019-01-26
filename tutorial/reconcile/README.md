# render

正如我们使用`React.render()`方法一样，我们需要传递两个关键参数，例如：`React.render(<App />, document.querySelector("#root"))`
```js
let rootInstance = null;
function render(element, parentDom) {
    const prevInstance = rootInstance;
    const nextInstance = reconcile(parentDom, prevInstance, element);
    rootInstance = nextInstance;
}
```

`rootInstance`开始的时候节点帧是`null`的，赋值给`prevInstance`，就是上一个节点帧`prevInstance`也是空的，这里需要使用`reconcile(parentDom, prevInstance, element)`计算出下一个需要更新的节点上的节点帧，`parentDom`就是需要生成页面的所在节点，这里需要放入一个用**选择器**选择的节点

所以程序的第一帧是这样的
```js
// 将render中parentDom, prevInstance, element三个值分别传入
reconcile(parentDom, prevInstance, element)
// ->函数将上面三个值赋值给形参parentDom, instance, element
reconcile(parentDom, instance, element)
// ->
// 既parentDom = document.querySelector("#root")，instance = null，element = <App />
reconcile(document.querySelector("#root"), null, <App />);
```

# setState

在`setState()`里面我们也可以触发`reconcile()`函数，里面有三个参数
```js
reconcile(parentDom, this.__internalInstance, element);
// 既document.querySelector("#root") = parentDom，instance = null，element = <App />
reconcile(parentDom, this.__internalInstance, element);
```

# reconcile

> reconcile(节点，由JSX生成包含未挂载DOM信息的对象(旧)，JSX对象(新))

`render`触发渲染第一帧之后，由于`instance === null`，所以我们进入`reconcile()`逻辑里面的第一个分支
```js
if (instance === null) {
    const newInstance = instantiate(element);
    // componentWillMount
    // 判断是否存在publicInstance属性值
    newInstance.publicInstance &&
    // 判断publicInstance是否有componentWillMount属性
        newInstance.publicInstance.componentWillMount &&
    // 执行componentWillMount方法
        newInstance.publicInstance.componentWillMount();
    // 并且在根节点挂载newInstance对象的dom
    parentDom.appendChild(newInstance.dom);
    // componentDidMount
    // 挂载成功后执行componentDidMount
    newInstance.publicInstance &&
        newInstance.publicInstance.componentDidMount &&
        newInstance.publicInstance.componentDidMount();
    return newInstance;
}
```