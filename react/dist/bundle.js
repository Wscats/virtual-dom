! function (e) {
    var t = {};

    function n(o) {
        if (t[o]) return t[o].exports;
        var r = t[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return e[o].call(r.exports, r, r.exports, n), r.l = !0, r.exports
    }
    n.m = e, n.c = t, n.d = function (e, t, o) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: o
        })
    }, n.r = function (e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, n.t = function (e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var o = Object.create(null);
        if (n.r(o), Object.defineProperty(o, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var r in e) n.d(o, r, function (t) {
                return e[t]
            }.bind(null, r));
        return o
    }, n.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 0)
}([function (e, t, n) {
    let o = n(1);
    console.log(o);
    class r extends o.Component {
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
        render() {
            return o.createElement("div", {
                onClick: this.like.bind(this)
            }, "hello world")
        }
    }
    console.log(new r), o.render(o.createElement(r, null), document.querySelector("#root"))
}, function (e, t) {
    const n = "TEXT_ELEMENT";

    function o(e, t, ...r) {
        return (t = Object.assign({}, t)).children = [].concat(...r).filter(e => null != e && !1 !== e).map(e => e instanceof Object ? e : function (e) {
            return o(n, {
                nodeValue: e
            })
        }(e)), {
            type: e,
            props: t
        }
    }
    let r = null;

    function c(e) {
        const {
            type: t,
            props: o = {}
        } = e, r = "string" == typeof t, s = !(!t.prototype || !t.prototype.isReactComponent);
        if (r) {
            console.log(e);
            const r = t === n;
            console.log(r);
            const s = r ? document.createTextNode("") : document.createElement(t);
            console.log(s),
                function (e, t, n) {
                    const o = e => e.startsWith("on"),
                        r = e => !o(e) && "children" != e;
                    console.log(o, r), Object.keys(t).filter(o).forEach(n => {
                        const o = n.toLowerCase().substring(2);
                        e.removeEventListener(o, t[n])
                    }), Object.keys(t).filter(r).forEach(t => {
                        e[t] = null
                    }), Object.keys(n).filter(r).forEach(t => {
                        e[t] = n[t]
                    }), Object.keys(n).filter(o).forEach(t => {
                        const o = t.toLowerCase().substring(2);
                        e.addEventListener(o, n[t])
                    })
                }(s, [], e.props);
            const l = (o.children || []).map(c),
                i = l.map(e => e.dom);
            return console.log(l, i), i.forEach(e => s.appendChild(e)), {
                element: e,
                dom: s,
                childInstances: l
            }
        }
        if (s) {
            const t = {},
                n = function (e, t) {
                    const {
                        type: n,
                        props: o
                    } = e, r = new n(o);
                    return r.__internalInstance = t, r
                }(e, t);
            console.log(n);
            const o = n.render(),
                r = c(o);
            return console.log(o), Object.assign(t, {
                dom: r.dom,
                element: e,
                childInstance: r,
                publicInstance: n
            }), t
        }
    }
    class s {
        constructor(e) {
            this.props = e, this.state = this.state || {}
        }
        setState(e) {
            this.state = Object.assign({}, this.state, e);
            this.__internalInstance.dom.parentNode, this.__internalInstance.element
        }
    }
    s.prototype.isReactComponent = {}, e.exports = {
        createElement: o,
        render: function (e, t) {
            const n = r;
            console.log(e, t);
            const o = function (e, t, n) {
                if (null === t) {
                    const t = c(n);
                    return console.log(e, t), e.appendChild(t.dom), t
                }
            }(t, n, e);
            r = o
        },
        Component: s
    }
}]);