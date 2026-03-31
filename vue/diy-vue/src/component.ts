import Vue from './vue';

/** Web Component wrapper based on Vue instance with Shadow DOM. */
export default class VueComponent {
  constructor(componentName: string, config: VueConfig) {
    customElements.define(
      componentName,
      class extends HTMLElement {
        constructor() {
          super();
          const instance = new Vue(config) as unknown as { _template: Node };
          const template = instance._template;
          const shadow = this.attachShadow({ mode: 'open' });
          shadow.appendChild(template);
        }
      },
    );
  }
}

/** Vue configuration object. */
export interface VueConfig {
  data: () => Record<string, unknown>;
  computed: Record<string, () => unknown>;
  render: (createElement: unknown) => Node;
  el?: string;
  [key: string]: unknown;
}