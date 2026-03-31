import observify from './observer';
import Compile from './compile';
import {foreach} from './utils';
import Dep from './dep';

export default class Vue {
  constructor(config) {
    this._config = config;
    this._initVM();
    this._initData(config.data);
    this._initComputed();
    this._bindVM();
    this._appendDom();
    return this._vm;
  }
  /** Deep observe the data object. */
  _initData(data) {
    this._data = observify(data());
  }
  /** Bind _vm to data via Proxy for reactive access. */
  _initVM() {
    const {_config} = this;
    this._vm = new Proxy(this, {
      get: (target, key, receiver) => {
        if (Object.keys(this).includes(key)) return this[key];
        if (Object.keys(this._data).includes(key)) return this._data[key];
        // Computed property: re-evaluate to subscribe DOM watchers
        return _config.computed[key].call(target._vm);
      },
      set: (target, key, value, receiver) => {
        if (!this[key]) {
          return Reflect.set(this._data, key, value);
        }
        return Reflect.set(target, key, value);
      },
    });
  }

  /** Initialize and cache computed properties. */
  _initComputed() {
    const {_config, _vm} = this;
    this._computed = {};
    foreach(_config.computed, key => {
      this._computed[key] = _config.computed[key].call(_vm);
    });
  }

  /** Compile template and mount to DOM. */
  _appendDom() {
    const {render, el} = this._config;
    const targetElem = document.querySelector(el);
    targetElem.innerHTML = '';
    const createElement = new Compile(this._vm);
    targetElem.appendChild(render(createElement));
  }

  /** Bind all config functions to the VM context. */
  _bindVM() {
    const {_config} = this;
    Object.keys(_config).forEach(i => {
      if (typeof _config[i] === 'function') {
        _config[i] = _config[i].bind(this._vm);
      }
    });
  }
}
