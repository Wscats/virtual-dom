# 创建createElement()方法

这个`createElement()`写得比较有意思，区别于`React.createElement()`的思路
```js
class Compile {
    constructor(vm) {
        this._vm = vm;
        return new Proxy({}, {
            get: this._getElement.bind(this),
        }, );
    }
    _getElement(target, tagName) {
        return (attrs = {}, ...childrens) => {
            // 创建节点
            this._elem = document.createElement(tagName);
            this._attrs = attrs;
            this._childrens = childrens;
            this._bindAttrs();
            this._addChildrens();
            return this._elem;
        };
    }
}
```