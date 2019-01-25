# instantiate

`element`是父组件`App`的经过`createElement()`转化的`JSX`对象
```js
let element = {
    type: App,
    props: {
        children: []
    }
}

let instance = instantiate(element)
// instance是生成还没挂载到根节点的虚拟DOM结构
```
`instantiate()`方法里面有两个主要的分支`isClassElement`和`isDomElement`，而`isDomElement`里面也会有两个分支

- isDomElement (typeof type === 'string')
    - isDomElement (type !== 'TEXT_ELEMENT')
    - isTextElement (type === 'TEXT_ELEMENT')
- isClassElement (type.prototype.isReactComponent存在)

|`isClassElement`|`isDomElement`或者`isTextElement`|
|-|-|
|自定义标签|内置标签或者文本|
|`<App />`|`<div>`或者`hello world`|
|`type`为`App`对象|`type`为`'div'`或者`'TEXT_ELEMENT'`字符串|

生成虚拟DOM关键的一句就是这一句
```js
// 如果是文本节点将对象转为空字符串'' 如果是元素节点将对象转为<div></div>
const dom = isTextElement ? document.createTextNode('') : document.createElement(type);
```
然后利用`updateDomProperties()`往虚拟DOM挂载事件和添加属性值，这个方法后面再详细讨论
```js
updateDomProperties(dom, [], element.props);
```
把所有`children`子节点取出来然后遍历继续进行`instantiate()`生成虚拟DOM对象
```js
const children = props.children || [];
const childInstances = children.map(instantiate);
```

`isClassElement`分支中的`createPublicInstance`负责实例化组件，并继承类似于`<App name='wscats' />`组件的`name`属性值，实例化执行组件的`render()`方法返回`JSX`对象
```js
const publicInstance = createPublicInstance(element, instance);
publicInstance.__internalInstance = instance;
const childElement = publicInstance.render();
```

只有组件类有`publicInstance`属性值，里面存放着组件实例化后的类，这里面存放着该组件一些关键的信息，比如`state`，`props`还有组件内部定义的方法和该组件生命周期，而这里面的`childInstances`是对应前面虚拟DOM对象中的`children`，而里面的`dom`是已经生成了还没挂载的虚拟DOM，这里还挂载了一个`__internalInstance`，它方便我们获取`dom`和`element`等关键信息，方便我们在后面`setState()`中触发`reconcile()`更新虚拟DOM

注意下面结构中组件的`childInstances`就是一个对象，而非数组

而`element`就是保存每个节点对应的虚拟DOM对象,也就是`createElement()`生成的对象

- 1. 组件实例化前的对象树
```js
{
    type: App,
    props: {
        name: 'appCp',
        children: []
    }
}
```
- 2. 组件实例化后的对象树 (进入`isClassElement`分支，经过`createPublicInstance()`和`publicInstance.render()`后)
```js
{
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
```
- 3. 组件实例化后并且经过解析后存着真实而未挂载的DOM对象树 (进入`isClassElement`分支，经过`createPublicInstance()`和`publicInstance.render()`后，并经过`instantiate()`后)
```js
{
    element: {
        props: {name: "appCp", children: Array(0), age: 19},
        type: class App
    }, 
    dom: div, 
    childInstance: {
        element: {
            props: {children: Array(1)},
            type: "div"
        }, 
        dom: div, 
        childInstances: [{
            element: {
                props: {children: Array(1)},
                type: "p"
            }, 
            dom: p, 
            childInstances: [{
                element: {
                    props: {nodeValue: "hello world", children: Array(0)}
                    type: "TEXT_ELEMENT"
                }, 
                dom: text, 
                childInstances: Array(0)
            }]
        }]
    }, 
    publicInstance: (new App) -> {
        props: {name: "appCp", children: Array(0), age: 19},
        state: {name: "laoyao", age: 18},
        __internalInstance: {dom: div, element: {…}, childInstance: {…}, publicInstance: App}
        __proto__: Component -> {
            constructor: class App
            like: ƒ like()
            render: ƒ render()
        }
    }
}
```
最后将生成的虚拟DOM对象树赋值给`childInstance`，并取出`childInstance.dom`的`dom`节点，`dom`里面存着整个组件渲染而成的所有未挂载节点，并组装成一个新的`instance`对象暴露出去

