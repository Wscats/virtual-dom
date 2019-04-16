import Vue from './vue';
// 基于Vue实例对影子DOM的封装
export default class {
    constructor(componentName, config) {
        customElements.define(componentName, class extends HTMLElement {
            constructor() {
                super();
                let template = new Vue(config)._template;
                var shadow = this.attachShadow({
                    mode: 'open'
                });
                shadow.appendChild(template); // 操作shadow dom;
            }
        })
    }
}