# updateDomProperties

`updateDomProperties`接受三个参数`dom, prevProps, nextProps`

- `dom`是基于`document.createElement('xxx')`生成的虚拟DOM

- `prevProps`表示更新前的`props`属性值

- `nextProps`表示更新后的`props`属性值

这两句分别配合`filter()`方法来筛选是事件还是属性，从而进行更新
```js
const isEvent = name => name.startsWith("on");
const isAttribute = name => !isEvent(name) && name != "children";
```
在还没有上一个节点帧之前，`prevProps`为空数组
```js
updateDomProperties(dom, [], element.props);
```
并且`prevProps`是配合用来清空属性值和移除事件的
```js
dom.removeEventListener(eventType, prevProps[name]);
dom[name] = null;
```
如果有上一个节点帧，先移除旧的事件绑定和属性值再绑定新的属性值和事件
```js
updateDomProperties(instance.dom, instance.element.props, element.props);
```
`updateDomProperties`更新两种类型的属性值
|标签节点|文本节点|
|-|-|
|`document.createElement(type)`生成的节点|`createTextNode('')`生成的节点|
|更新属性值|更新文本值|