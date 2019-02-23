'use strict';
class Component extends HTMLElement {
    constructor(props) {
        super(props);
        this.watch = new Observer();
        this.beforeInstall && this.beforeInstall();
        this.data && this.proxyData(this.data);
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
    proxyData(data) {
        Object.keys(data).forEach((key) => {
            if (typeof data[key] === 'object') {} else {
                Object.defineProperty(this, key, {
                    set(newValue) {
                        this.beforeUpdate && this.beforeUpdate();
                        this.data[key] = newValue;
                        this.watch.emit(key, null);
                        this.afterUpdate && this.afterUpdate();
                    },
                    get() {
                        return this.data[key];
                    }
                })
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
        console.log(nodes);
        for (let node of nodes) {
            if (node.childNodes.length > 0) {
                this.compileTemplate(node);
            } else {
                switch (node.nodeType) {
                    case 1:
                        if (node.hasAttribute('@click')) {
                            let eventName = node.getAttribute('@click');
                            node.addEventListener('click', (e) => {
                                this[eventName]();
                            })
                        } else if (node.hasAttribute('v-m')) {
                            let attrVal = node.getAttribute('v-m');
                            node.value = this[attrVal];
                            this.watch.on(attrVal, () => {
                                node.value = this.data[attrVal];
                            })
                            node.addEventListener("input", () => {
                                console.log(node.value)
                                this[attrVal] = node.value;
                                return () => {
                                    this[attrVal] = node.value;
                                }
                            })
                        }
                    case 3:
                        this.compileTemplateText(node, 'textContent');
                }
            }

        }
    }
    compileTemplateText(node, type) {
        let reg = /\{\{((?:.|\r?\n)+?)\}\}/g;
        let txt = node.textContent;
        if (reg.test(txt)) {
            node.textContent = txt.replace(reg, (matched, value) => {
                this.watch.on(value, () => {
                    node.textContent = this.data[value];
                })
                return this[value];
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

customElements.define('my-father', class LikeButton extends Component {
    beforeInstall() {
        this.css =
            `
                div {
                    border: 1px solid red;
                }
            `
        this.template =
            `
                <div>
                    <like-button name="eno" skill="css"></like-button>
                </div>
            `
    }
})
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
                    <div>{{color}}
                        <input v-m="color" />
                        <p>{{color}}</p>
                    </div>
                </div>
            `
        this.data = {
            name: 'lemon',
            color: 'red',
        }
        this.methods = {
            test() {
                this.name = this.props('name');
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