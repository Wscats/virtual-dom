# 架构

这里主要分析`omi`里面暴露的这四个主要的办法，括号里面跟括号外的是等价的，就是简写和复杂点的写法

- WeElement(Component)
- render
- h(createElement)
- define(defineElement)

# 全局挂载

这里会暴露出`self`，如果在浏览器里面`self`等价于`window`
```js
var options = {
    store: null,
    root: function () {
        // nodejs里面有global全局变量，判断是否是node环境
        // 此时self===window
        if ('object' != typeof global || !global || global.Math !== Math || global.Array !== Array) return self || window || global || function () {
            return this;
        }();
        else return global;
    }()
};
```
判断是否在模块化环境中，如果不是则放心地在`window`里面挂载`omi`
```js
// options.root就是全局的window变量，下面是把Omi挂载到全局window上
options.root.Omi = omi;
options.root.omi = omi;
options.root.Omi.version = '5.0.21';
// 如果是在模块化中，判断module是否存在，否则在全局的this(window)里面导出Omi全局变量
if ('undefined' != typeof module) module.exports = omi;
else self.Omi = omi;
```