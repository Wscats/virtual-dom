'use strict';

import { createElement, render, Component } from './base';
import type { VNode } from './base';

class App extends Component {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.props = { name: 'laoxie' };
    this.state = { name: 'laoyao', age: 18 };
  }

  like(): void {
    console.log(1);
  }

  render(): VNode {
    return createElement('div', { onClick: this.like.bind(this) }, 'hello world');
  }
}

console.log(new App({}));
// <App /> translates to createElement(App, null)
render(createElement(App as any, null), document.querySelector('#root') as HTMLElement);
