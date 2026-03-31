import Watcher from './watcher';

/** Directive parser: compiles virtual DOM elements with reactive bindings. */
export default class Compile {
  constructor(vm) {
    this._vm = vm;
    return new Proxy(
      {},
      {
        get: this._getElement.bind(this),
      },
    );
  }

  _getElement(target, tagName) {
    return (attrs = {}, ...childrens) => {
      // Create DOM element
      this._elem = document.createElement(tagName);
      this._attrs = attrs;
      this._childrens = childrens;
      this._bindAttrs();
      this._addChildrens();

      return this._elem;
    };
  }

  /** Bind attributes and directives to the element. */
  _bindAttrs() {
    const {_attrs, _elem} = this;
    Object.keys(_attrs).forEach(attr => {
      if (attr.includes('@')) {
        // TODO
      } else if (attr.includes(':')) {
        this._bindDirectives(attr, _elem);
      } else {
        _elem.setAttribute(attr, _attrs[attr]);
      }
    });
  }

  /** Append child elements (text nodes or DOM elements). */
  _addChildrens() {
    const {_childrens, _elem, _vm} = this;
    _childrens.forEach(children => {
      let child;
      switch (typeof children) {
        case 'string':
          child = document.createTextNode('');
          compileUtil.text(child, _vm, children);
          break;
        case 'function':
          child = document.createTextNode('');
          compileUtil.text(child, _vm, children);
          break;
        default:
          child = children;
      }
      _elem.appendChild(child);
    });
  }

  /** Process directive bindings (e.g. :model, :html). */
  _bindDirectives(attr, _elem) {
    const {_attrs, _vm} = this;
    const exp = _attrs[attr];
    const type = attr.slice(1);

    compileUtil[type](_elem, _vm, exp);
  }
}

/** Compile utilities: bind watchers to DOM nodes. */
const compileUtil = {  bind(node, vm, exp, type) {
    const update = updater[type];
    update && update(node, this.getVal(vm, exp));

    new Watcher(vm, exp, value => {
      update && update(node, value);
    });
  },
  text(node, vm, exp) {
    this.bind(node, vm, exp, 'text');
  },
  html(node, vm, exp) {
    this.bind(node, vm, exp, 'html');
  },
  model(node, vm, exp) {
    this.bind(node, vm, exp, 'model');
    node.addEventListener('input', e => {
      const value = e.target.value;
      this.setVal(vm, exp, value);
    });
  },
  getVal(vm, exp) {
    if (typeof exp === 'function') {
      return exp.call(vm);
    } else if (typeof exp === 'string') {
      return vm[exp];
    }
  },
  setVal(vm, exp, value) {
    vm[exp] = value;
  },
};

const updater = {
  text(node, value = '') {
    node.textContent = value;
  },
  model(node, value = '') {
    node.value = value;
  },
  html(node, value = '') {
    node.innerHTML = value;
  },
};
