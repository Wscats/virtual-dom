import Watcher from './watcher';

type WatchExpression = (() => unknown) | string;
type Attrs = Record<string, unknown>;

/** Directive parser: compiles virtual DOM elements with reactive bindings. */
export default class Compile {
  private _vm: Record<string, unknown>;
  private _elem!: HTMLElement;
  private _attrs!: Attrs;
  private _childrens!: unknown[];

  constructor(vm: Record<string, unknown>) {
    this._vm = vm;
    return ((type: string, props: Attrs, ...childrens: unknown[]) => {
      return new Proxy({} as Record<string, unknown>, {
        get: this._getElement.bind(this),
      })[type](props, ...childrens);
    }) as unknown as Compile;
  }

  _getElement(_target: unknown, tagName: string): (attrs: Attrs, ...childrens: unknown[]) => HTMLElement {
    return (attrs: Attrs = {}, ...childrens: unknown[]): HTMLElement => {
      this._elem = document.createElement(tagName);
      this._attrs = attrs;
      this._childrens = childrens;
      this._bindAttrs();
      this._addChildrens();
      return this._elem;
    };
  }

  /** Bind attributes and directives to the element. */
  private _bindAttrs(): void {
    const { _attrs, _elem } = this;
    Object.keys(_attrs).forEach(attr => {
      if (attr.includes('@')) {
        // TODO: event binding
      } else if (attr.includes(':')) {
        this._bindDirectives(attr, _elem);
      } else {
        _elem.setAttribute(attr, String(_attrs[attr]));
      }
    });
  }

  /** Append child elements (text nodes or DOM elements). */
  private _addChildrens(): void {
    const { _childrens, _elem, _vm } = this;
    _childrens.forEach(children => {
      let child: Node;
      switch (typeof children) {
        case 'string':
          child = document.createTextNode('');
          compileUtil.text(child, _vm, children);
          break;
        case 'function':
          child = document.createTextNode('');
          compileUtil.text(child, _vm, children as WatchExpression);
          break;
        default:
          child = children as Node;
      }
      _elem.appendChild(child);
    });
  }

  /** Process directive bindings (e.g. :model, :html). */
  private _bindDirectives(attr: string, _elem: HTMLElement): void {
    const { _attrs, _vm } = this;
    const exp = _attrs[attr] as WatchExpression;
    const type = attr.slice(1) as keyof typeof compileUtil;
    if (compileUtil[type]) {
      (compileUtil[type] as (node: Node, vm: Record<string, unknown>, exp: WatchExpression) => void)(_elem, _vm, exp);
    }
  }
}

/** DOM updater functions. */
const updater: Record<string, (node: Node, value: string) => void> = {
  text(node: Node, value: string = ''): void {
    node.textContent = value;
  },
  model(node: Node, value: string = ''): void {
    (node as HTMLInputElement).value = value;
  },
  html(node: Node, value: string = ''): void {
    (node as HTMLElement).innerHTML = value;
  },
};

/** Compile utilities: bind watchers to DOM nodes. */
const compileUtil = {
  bind(node: Node, vm: Record<string, unknown>, exp: WatchExpression, type: string): void {
    const update = updater[type];
    if (update) update(node, String(this.getVal(vm, exp) ?? ''));

    new Watcher(vm, exp, (value: unknown) => {
      if (update) update(node, String(value ?? ''));
    });
  },
  text(node: Node, vm: Record<string, unknown>, exp: WatchExpression): void {
    this.bind(node, vm, exp, 'text');
  },
  html(node: Node, vm: Record<string, unknown>, exp: WatchExpression): void {
    this.bind(node, vm, exp, 'html');
  },
  model(node: Node, vm: Record<string, unknown>, exp: WatchExpression): void {
    this.bind(node, vm, exp, 'model');
    node.addEventListener('input', ((e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      this.setVal(vm, exp, value);
    }) as EventListener);
  },
  getVal(vm: Record<string, unknown>, exp: WatchExpression): unknown {
    if (typeof exp === 'function') {
      return exp.call(vm);
    } else if (typeof exp === 'string') {
      return vm[exp];
    }
  },
  setVal(vm: Record<string, unknown>, exp: WatchExpression, value: unknown): void {
    if (typeof exp === 'string') {
      vm[exp] = value;
    }
  },
};