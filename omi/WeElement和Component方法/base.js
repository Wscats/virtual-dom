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
var id = 0;
var WeElement = function (_HTMLElement) {
    function WeElement() {
        console.log(this)
        _classCallCheck(this, WeElement);
        var _this = _possibleConstructorReturn(this, _HTMLElement.call(this));
        _this.props = Object.assign(nProps(_this.constructor.props), _this.constructor.defaultProps);
        _this.elementId = id++;
        _this.data = _this.constructor.data || {};
        return _this;
    }
    // 继承HTMLElement，HTMLElement是customElements.define组件需要继承的对象
    _inherits(WeElement, _HTMLElement);
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
    return WeElement;
}(HTMLElement);
WeElement.is = 'WeElement';
function define(name, ctor) {
    if ('WeElement' === ctor.is) {
        customElements.define(name, ctor);
        if (ctor.data && !ctor.pure) ctor.updatePath = getUpdatePath(ctor.data);
    } else {

    }
}
class LikeButton extends WeElement {
    install() {
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
