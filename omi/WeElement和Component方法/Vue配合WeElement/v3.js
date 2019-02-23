'use strict';
class Component extends HTMLElement {
    constructor(props) {
        super(props);
        this.watch = new Observer();
        this.beforeInstall && this.beforeInstall();
        this.data = this.data && this.proxyData(this.data, () => {});
        console.log(this.data);
        this.methods && this.proxyMethods();
        const template = document.createElement('template');
        template.innerHTML = `<style>${this.css}</style>${this.template}`;
        const templateContent = template.content;
        const attachShadow = this.attachShadow({
            mode: 'open',
        });
        attachShadow.appendChild(
            templateContent.cloneNode(true),
        );
        this.compileTemplate(attachShadow);
        this.afterInstall && this.afterInstall();
    }
    proxyData(data, proxyDataCallback) {
        let _this = this;
        return new Proxy(data, {
            get(object, prop) {
                const value = object[prop];
                console.log('get', object, prop);
                // 这里可以优化一下，不应该每次都创建新的 proxy
                if (typeof value === 'object' && value !== null) {
                    return _this.proxyData(object[prop], proxyDataCallback)
                }
                return value
            },
            set(object, prop, value, ...args) {
                console.log('set', object, prop, value, ...args);
                object[prop] = value;
                _this.beforeUpdate && _this.beforeUpdate();
                _this.watch.emit(prop, null);
                // _this.watch.emit('obj.skill', null);
                _this.afterUpdate && _this.afterUpdate();
                proxyDataCallback();
                return Reflect.set(object, prop, value, ...args)
            }
        })
    }
    props(propsName) {
        return this.getAttribute(propsName);
    }
    proxyMethods() {
        Object.keys(this.methods).forEach((key) => {
            this[key] = this.methods[key];
        })
    }
    compileTemplate(attachShadow) {
        let nodes = attachShadow.childNodes;
        for (let node of nodes) {
            if (node.childNodes.length > 0) {
                this.compileTemplate(node);
            }
            switch (node.nodeType) {
                case 1:
                    if (node.hasAttribute('@click')) {
                        let eventName = node.getAttribute('@click');
                        node.addEventListener('click', (e) => {
                            this[eventName]();
                        })
                    } else if (node.hasAttribute('v-m')) {
                        let attrVal = node.getAttribute('v-m');
                        node.value = this.data[attrVal];
                        this.watch.on(attrVal, () => {
                            node.value = this.data[attrVal];
                        })
                        node.addEventListener("input", (e) => {
                            console.log(e);
                            this.data[attrVal] = node.value;
                            return () => {
                                this.data[attrVal] = node.value;
                            }
                        })
                    }
                case 3:
                    this.compileTemplateText(node, 'textContent');
            }

        }
    }
    compileTemplateText(node, type) {
        let reg = /\{\{((?:.|\r?\n)+?)\}\}/g;
        let txt = node.textContent;
        if (reg.test(txt)) {
            node.textContent = txt.replace(reg, (matched, value) => {
                let attrs = value.indexOf('.') > 0 ? value.split('.') : value
                this.watch.on(value, () => {
                    console.log(value, {
                        ...this
                    })
                    if (attrs instanceof Array) {
                        node.textContent = this.data[attrs[0]][attrs[1]]
                    } else {
                        node.textContent = this.data[value];
                    }
                })
                if (attrs instanceof Array) {
                    return this.data[attrs[0]][attrs[1]]

                } else {
                    return this.data[value];
                }
            })
        }
    }
};
Component.is = "Component";
class Observer {
    constructor() {
        this.list = {}
    }
    on(key, fn) {
        if (!this.list[key]) {
            this.list[key] = [];
        }
        this.list[key].push(fn);
    }
    emit(key, params) {
        let fns = this.list[key];
        if (!fns || fns.length === 0) {
            return false;
        }
        fns.forEach(fn => {
            fn(params);
        });
    }
}

customElements.define('like-button', class LikeButton extends Component {
    beforeInstall() {
        console.log('挂载前');
        this.css =
            `
                button {
                    color: {{color}}
                }
            `
        this.template =
            `
                <div>
                    <input v-m="name" />
                    <button @click="test">{{name}}</button>
                    <p>{{obj.skill}}</p>
                </div>
            `
        this.data = {
            name: 'lemon',
            color: 'red',
            obj: {
                skill: 'ps',
                age: 18
            }
        }
        this.methods = {
            test() {
                // this.data.name = 'eno';
                this.data.obj.skill = 'less';
                console.log({
                    ...this
                })
            },
            test2() {
                this.data.obj.age = 19;
                console.log({
                    ...this
                })
            }
        }
    }
    afterInstall() {
        console.log('挂载后')
    }
    beforeUpdate() {
        console.log('更新前')
    }
    afterUpdate() {
        console.log('更新后')
    }
});