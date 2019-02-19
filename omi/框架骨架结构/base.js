! function () {
    'use strict';

    function h(nodeName, attributes) {}
    var WeElement = function (_HTMLElement) {
        function WeElement() {}
        WeElement.prototype.beforeInstall = function() {};
        WeElement.prototype.install = function() {};
        WeElement.prototype.afterInstall = function() {};
        WeElement.prototype.installed = function() {};
        WeElement.prototype.uninstall = function() {};
        WeElement.prototype.beforeUpdate = function() {};
        WeElement.prototype.afterUpdate = function() {};
        WeElement.prototype.updated = function() {};
        WeElement.prototype.beforeRender = function() {};
        WeElement.prototype.rendered = function() {};
        WeElement.prototype.receiveProps = function() {};
        WeElement.prototype.beforeObserve = function() {};
        WeElement.prototype.observed = function() {};
        return WeElement;
    }(HTMLElement);
    function define(name, ctor) {}
    function render(vnode, parent, store) {}
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


    // Component和WeElement是等价的都是可以创建组件
    var Component = WeElement;
    // defineElement和define是等价的都是可以注册组件
    var defineElement = define;
    var omi = {
        // 创建组件的父类，相当于React.Component()
        WeElement: WeElement,
        Component: Component,
        // 挂载组件的方法，相当于React.render()
        render: render,
        // 创建虚拟DOM对象，相当于createElement()
        h: h,
        createElement: h,
        // 注册组件，接受组件名和class extends WeElement {}
        define: define,
        defineElement: defineElement,
    };
    // options.root就是全局的window变量，下面是把Omi挂载到全局window上
    options.root.Omi = omi;
    options.root.omi = omi;
    options.root.Omi.version = '5.0.21';
    // 如果是在模块化中，判断module是否存在，否则在全局的this(window)里面导出Omi全局变量
    if ('undefined' != typeof module) module.exports = omi;
    else self.Omi = omi;
}();