function _inherits(subClass, superClass) {
    if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: !1,
            writable: !0,
            configurable: !0
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _possibleConstructorReturn(self, call) {
    if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return call && ("object" == typeof call || "function" == typeof call) ? call : self;
}
// 重写原生的HTMLElement方法，并继承新的constructor类
!function() {
    if (void 0 !== window.Reflect && void 0 !== window.customElements && !window.customElements.hasOwnProperty('polyfillWrapFlushCallback')) {
        var BuiltInHTMLElement = HTMLElement;
        window.HTMLElement = function() {
            return Reflect.construct(BuiltInHTMLElement, [], this.constructor);
        };
        HTMLElement.prototype = BuiltInHTMLElement.prototype;
        HTMLElement.prototype.constructor = HTMLElement;
        Object.setPrototypeOf(HTMLElement, BuiltInHTMLElement);
    }
}();
function nProps(props) {
    // 如果没有props或者是数组的话，都返回空对象
    if (!props || isArray(props)) return {};
    var result = {};
    Object.keys(props).forEach(function(key) {
        result[key] = props[key].value;
    });
    return result;
}
function isArray(obj) {
    return '[object Array]' === Object.prototype.toString.call(obj);
}
var diffLevel = 0;
function diff(dom, vnode, context, mountAll, parent, componentRoot) {
    var ret;
    if (!diffLevel++) {
        isSvgMode = null != parent && void 0 !== parent.ownerSVGElement;
        hydrating = null != dom && !('__omiattr_' in dom);
    }
    if (isArray(vnode)) {
        ret = [];
        var parentNode = null;
        if (isArray(dom)) {
            var domLength = dom.length;
            var vnodeLength = vnode.length;
            var maxLength = domLength >= vnodeLength ? domLength : vnodeLength;
            parentNode = dom[0].parentNode;
            for (var i = 0; i < maxLength; i++) {
                var ele = idiff(dom[i], vnode[i], context, mountAll, componentRoot);
                ret.push(ele);
                if (i > domLength - 1) parentNode.appendChild(ele);
            }
        } else vnode.forEach(function(item) {
            var ele = idiff(dom, item, context, mountAll, componentRoot);
            ret.push(ele);
            parent && parent.appendChild(ele);
        });
    } else {
        if (isArray(dom)) ret = idiff(dom[0], vnode, context, mountAll, componentRoot); else ret = idiff(dom, vnode, context, mountAll, componentRoot);
        if (parent && ret.parentNode !== parent) parent.appendChild(ret);
    }
    if (!--diffLevel) hydrating = !1;
    return ret;
}
function idiff(dom, vnode, context, mountAll, componentRoot) {
    if (dom && vnode && dom.props) dom.props.children = vnode.children;
    var out = dom, prevSvgMode = isSvgMode;
    if (null == vnode || 'boolean' == typeof vnode) vnode = '';
    if ('string' == typeof vnode || 'number' == typeof vnode) {
        if (dom && void 0 !== dom.splitText && dom.parentNode && (!dom._component || componentRoot)) {
            if (dom.nodeValue != vnode) dom.nodeValue = vnode;
        } else {
            out = document.createTextNode(vnode);
            if (dom) {
                if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
                recollectNodeTree(dom, !0);
            }
        }
        out.__omiattr_ = !0;
        return out;
    }
    var vnodeName = vnode.nodeName;
    isSvgMode = 'svg' === vnodeName ? !0 : 'foreignObject' === vnodeName ? !1 : isSvgMode;
    vnodeName = String(vnodeName);
    if (!dom || !isNamedNode(dom, vnodeName)) {
        out = createNode(vnodeName, isSvgMode);
        if (dom) {
            while (dom.firstChild) out.appendChild(dom.firstChild);
            if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
            recollectNodeTree(dom, !0);
        }
    }
    var fc = out.firstChild, props = out.__omiattr_, vchildren = vnode.children;
    if (null == props) {
        props = out.__omiattr_ = {};
        for (var a = out.attributes, i = a.length; i--; ) props[a[i].name] = a[i].value;
    }
    if (!hydrating && vchildren && 1 === vchildren.length && 'string' == typeof vchildren[0] && null != fc && void 0 !== fc.splitText && null == fc.nextSibling) {
        if (fc.nodeValue != vchildren[0]) fc.nodeValue = vchildren[0];
    } else if (vchildren && vchildren.length || null != fc) if ('WeElement' != out.constructor.is || !out.constructor.noSlot) innerDiffNode(out, vchildren, context, mountAll, hydrating || null != props.dangerouslySetInnerHTML);
    diffAttributes(out, vnode.attributes, props, vnode.children);
    if (out.props) out.props.children = vnode.children;
    isSvgMode = prevSvgMode;
    return out;
}
function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
    var j, c, f, vchild, child, originalChildren = dom.childNodes, children = [], keyed = {}, keyedLen = 0, min = 0, len = originalChildren.length, childrenLen = 0, vlen = vchildren ? vchildren.length : 0;
    if (0 !== len) for (var i = 0; i < len; i++) {
        var _child = originalChildren[i], props = _child.__omiattr_, key = vlen && props ? _child._component ? _child._component.__k : props.key : null;
        if (null != key) {
            keyedLen++;
            keyed[key] = _child;
        } else if (props || (void 0 !== _child.splitText ? isHydrating ? _child.nodeValue.trim() : !0 : isHydrating)) children[childrenLen++] = _child;
    }
    if (0 !== vlen) for (var i = 0; i < vlen; i++) {
        vchild = vchildren[i];
        child = null;
        var key = vchild.key;
        if (null != key) {
            if (keyedLen && void 0 !== keyed[key]) {
                child = keyed[key];
                keyed[key] = void 0;
                keyedLen--;
            }
        } else if (!child && min < childrenLen) for (j = min; j < childrenLen; j++) if (void 0 !== children[j] && isSameNodeType(c = children[j], vchild, isHydrating)) {
            child = c;
            children[j] = void 0;
            if (j === childrenLen - 1) childrenLen--;
            if (j === min) min++;
            break;
        }
        child = idiff(child, vchild, context, mountAll);
        f = originalChildren[i];
        if (child && child !== dom && child !== f) if (null == f) dom.appendChild(child); else if (child === f.nextSibling) removeNode(f); else dom.insertBefore(child, f);
    }
    if (keyedLen) for (var i in keyed) if (void 0 !== keyed[i]) recollectNodeTree(keyed[i], !1);
    while (min <= childrenLen) if (void 0 !== (child = children[childrenLen--])) recollectNodeTree(child, !1);
}
function diffAttributes(dom, attrs, old, children) {
    var name;
    var update = !1;
    var isWeElement = dom.update;
    var oldClone;
    if (dom.receiveProps) oldClone = Object.assign({}, old);
    for (name in old) if ((!attrs || null == attrs[name]) && null != old[name]) {
        setAccessor(dom, name, old[name], old[name] = void 0, isSvgMode);
        if (isWeElement) {
            delete dom.props[name];
            update = !0;
        }
    }
    for (name in attrs) if (isWeElement && 'object' == typeof attrs[name]) {
        if ('style' === name) setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
        if (dom.receiveProps) try {
            old[name] = JSON.parse(JSON.stringify(attrs[name]));
        } catch (e) {
            console.warn('When using receiveProps, you cannot pass prop of cyclic dependencies down.');
        }
        dom.props[npn(name)] = attrs[name];
        update = !0;
    } else if (!('children' === name || 'innerHTML' === name || name in old && attrs[name] === ('value' === name || 'checked' === name ? dom[name] : old[name]))) {
        setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
        if (isWeElement) {
            dom.props[npn(name)] = attrs[name];
            update = !0;
        }
    }
    if (isWeElement && dom.parentNode) if (update || children.length > 0) {
        dom.receiveProps(dom.props, dom.data, oldClone);
        dom.update();
    }
}
function recollectNodeTree(node, unmountOnly) {
    if (null != node.__omiattr_ && node.__omiattr_.ref) node.__omiattr_.ref(null);
    if (!1 === unmountOnly || null == node.__omiattr_) removeNode(node);
    removeChildren(node);
}
function removeChildren(node) {
    node = node.lastChild;
    while (node) {
        var next = node.previousSibling;
        recollectNodeTree(node, !0);
        node = next;
    }
}
function setAccessor(node, name, old, value, isSvg) {
    if ('className' === name) name = 'class';
    if ('key' === name) ; else if ('ref' === name) {
        applyRef(old, null);
        applyRef(value, node);
    } else if ('class' === name && !isSvg) node.className = value || ''; else if ('style' === name) {
        if (!value || 'string' == typeof value || 'string' == typeof old) node.style.cssText = value || '';
        if (value && 'object' == typeof value) {
            if ('string' != typeof old) for (var i in old) if (!(i in value)) node.style[i] = '';
            for (var i in value) node.style[i] = 'number' == typeof value[i] && !1 === IS_NON_DIMENSIONAL.test(i) ? value[i] + 'px' : value[i];
        }
    } else if ('dangerouslySetInnerHTML' === name) {
        if (value) node.innerHTML = value.__html || '';
    } else if ('o' == name[0] && 'n' == name[1]) {
        var useCapture = name !== (name = name.replace(/Capture$/, ''));
        name = name.toLowerCase().substring(2);
        if (value) {
            if (!old) {
                node.addEventListener(name, eventProxy, useCapture);
                if ('tap' == name) {
                    node.addEventListener('touchstart', touchStart, useCapture);
                    node.addEventListener('touchend', touchEnd, useCapture);
                }
            }
        } else {
            node.removeEventListener(name, eventProxy, useCapture);
            if ('tap' == name) {
                node.removeEventListener('touchstart', touchStart, useCapture);
                node.removeEventListener('touchend', touchEnd, useCapture);
            }
        }
        (node.__l || (node.__l = {}))[name] = value;
    } else if ('list' !== name && 'type' !== name && !isSvg && name in node) {
        try {
            node[name] = null == value ? '' : value;
        } catch (e) {}
        if ((null == value || !1 === value) && 'spellcheck' != name) node.removeAttribute(name);
    } else {
        var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ''));
        if (null == value || !1 === value) if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase()); else node.removeAttribute(name); else if ('function' != typeof value) if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value); else node.setAttribute(name, value);
    }
}
function eventProxy(e) {
    return this.__l[e.type](
        // options.event && options.event(e) || 
    e);
}
function createNode(nodeName, isSvg) {
    var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
    node.__n = nodeName;
    return node;
}
var id = 0;
var WeElement = function (_HTMLElement) {
    // 这里的this本来是指向window的
    // 但是在class之后define('like-button', LikeButton)，this的指向就发生了改变，指向新的HTMLElement
    console.log(this)
    function WeElement() {
        // 判断实例的类型
        _classCallCheck(this, WeElement);
        // 由于_HTMLElement即HTMLElement是被自己再封装的函数
        // 用于校验this的方法
        var _this = _possibleConstructorReturn(this, _HTMLElement.call(this));
        console.log(_this);
        // 此时_this指向like-button组件实例化的对象
        _this.props = Object.assign(nProps(_this.constructor.props), _this.constructor.defaultProps);
        _this.elementId = id++;
        _this.data = _this.constructor.data || {};
        return _this;
    }
    // 继承HTMLElement，HTMLElement是customElements.define组件需要继承的对象
    // WeElement继承_HTMLElement的原生方法
    _inherits(WeElement, _HTMLElement);
    // 下面是组件的生命周期
    // 注意这里别用箭头函数，不然this的指向会出问题
    WeElement.prototype.connectedCallback = function () {
        if (!this.constructor.pure) {
            var p = this.parentNode;
            while (p && !this.store) {
                this.store = p.store;
                p = p.parentNode || p.host;
            }
            if (this.store) this.store.instances.push(this);
        }
        this.beforeInstall();
        !this.B && this.install();
        this.afterInstall();
        var shadowRoot;
        if (!this.shadowRoot) shadowRoot = this.attachShadow({
            mode: 'open'
        });
        else {
            shadowRoot = this.shadowRoot;
            var fc;
            while (fc = shadowRoot.firstChild) shadowRoot.removeChild(fc);
        }
        this.css && shadowRoot.appendChild(cssToDom('function' == typeof this.css ? this.css() : this.css));
        !this.B && this.beforeRender();
        // options.afterInstall && options.afterInstall(this);
        if (this.constructor.observe) {
            this.beforeObserve();
            proxyUpdate(this);
            this.observed();
        }
        this.L = diff(null, this.render(this.props, this.data, this.store), {}, !1, null, !1);
        this.rendered();
        if (isArray(this.L)) this.L.forEach(function (item) {
            shadowRoot.appendChild(item);
        });
        else shadowRoot.appendChild(this.L);
        !this.B && this.installed();
        this.B = !0;
    };
    WeElement.prototype.disconnectedCallback = function () {
        this.uninstall();
        this.B = !1;
        if (this.store)
            for (var i = 0, len = this.store.instances.length; i < len; i++)
                if (this.store.instances[i] === this) {
                    this.store.instances.splice(i, 1);
                    break;
                }
    };
    WeElement.prototype.update = function () {
        this.J = !0;
        this.beforeUpdate();
        this.beforeRender();
        this.L = diff(this.L, this.render(this.props, this.data, this.store), null, null, this.shadowRoot);
        this.J = !1;
        this.afterUpdate();
        this.updated();
    };
    WeElement.prototype.fire = function (name, data) {
        this.dispatchEvent(new CustomEvent(name.toLowerCase(), {
            detail: data
        }));
    };
    WeElement.prototype.beforeInstall = function () {};
    WeElement.prototype.install = function () {};
    WeElement.prototype.afterInstall = function () {};
    WeElement.prototype.installed = function () {};
    WeElement.prototype.uninstall = function () {};
    WeElement.prototype.beforeUpdate = function () {};
    WeElement.prototype.afterUpdate = function () {};
    WeElement.prototype.updated = function () {};
    WeElement.prototype.beforeRender = function () {};
    WeElement.prototype.rendered = function () {};
    WeElement.prototype.receiveProps = function () {};
    WeElement.prototype.beforeObserve = function () {};
    WeElement.prototype.observed = function () {};
    console.log(this)
    return WeElement;
}(HTMLElement);
// 为后面define方法区分框架的自定义组件还是原生的自定义组件
WeElement.is = 'WeElement';
function define(name, ctor) {
    // 如果define的是WeElement创建的组件，既 define('like-button', LikeButton)
    if ('WeElement' === ctor.is) {
        customElements.define(name, ctor);
        if (ctor.data && !ctor.pure) ctor.updatePath = getUpdatePath(ctor.data);
    } else {
        // 如果define的内置标签

    }
}

// WeElement的this都指向该组件的节点
// 因为WeElement继承了HTMLElement，里面的原型链又封装了很多方法比如this.update,this.disconnectedCallback等
class LikeButton extends WeElement {
    install() {
        console.log(this)
        this.data = {
            liked: false
        }
    }
    render() {
        if (this.data.liked) {
            return 'You liked this.'
        }
        return {
            attributes: {
                key: 1,
                onClick: () => {
                    console.log({...this})
                    this.data.liked = true
                    this.update()
                }
            },
            children: ["Like"],
            key: 1,
            nodeName: "button"
        }
    }
}
// 注意名字不能LikeButton,不能有大写，可以用-符号
define('like-button', LikeButton)
