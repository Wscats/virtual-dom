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