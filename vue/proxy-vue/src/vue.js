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
  // 深度监听 data 对象
  _initData(data) {
    this._data = observify(data());
  }
  // 将_vm与data绑定，对this进行代理
  _initVM() {
    const {_config} = this;
    this._vm = new Proxy(this, {
      get: (target, key, receiver) => {
        if (Object.keys(this).includes(key)) return this[key];
        if (Object.keys(this._data).includes(key)) return this._data[key];
        // 如果是获取computed中的计算属性，那就要重新计算，获取data中数据，将dom订阅，关联了computed和dom
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

  // 初始化Computed,并缓存
  _initComputed() {
    const {_config, _vm} = this;
    this._computed = {};
    foreach(_config.computed, key => {
      this._computed[key] = _config.computed[key].call(_vm);
    });
  }

  // 重新
  _appendDom() {
    const {render, el} = this._config;
    const targetElem = document.querySelector(el);
    targetElem.innerHTML = '';
    const createElement = new Compile(this._vm);
    targetElem.appendChild(render(createElement));
  }

  // 将函数绑定到this._vm上
  _bindVM() {
    const {_config} = this;
    Object.keys(_config).forEach(i => {
      const val = _config[i];
      if (typeof _config[i] === 'function') {
        _config[i] = _config[i].bind(this._vm);
      }
    });
  }
}
