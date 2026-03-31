import observify from './observer';
import Compile from './compile';
import { foreach } from './utils';
import Dep from './dep';

/** Vue configuration object. */
export interface VueConfig {
  data: () => Record<string, unknown>;
  computed: Record<string, () => unknown>;
  render: (createElement: unknown) => Node;
  el: string;
  [key: string]: unknown;
}

/** Proxy-based Vue implementation with DOM mounting. */
export default class Vue {
  public _config: VueConfig;
  public _data!: Record<string, unknown>;
  public _vm!: Record<string, unknown>;
  public _computed!: Record<string, unknown>;

  constructor(config: VueConfig) {
    this._config = config;
    this._initVM();
    this._initData(config.data);
    this._initComputed();
    this._bindVM();
    this._appendDom();
    return this._vm as unknown as Vue;
  }

  /** Deep observe the data object. */
  private _initData(data: () => Record<string, unknown>): void {
    this._data = observify(data()) as Record<string, unknown>;
  }

  /** Bind _vm to data via Proxy for reactive access. */
  private _initVM(): void {
    const { _config } = this;
    this._vm = new Proxy(this as unknown as Record<string, unknown>, {
      get: (target: Record<string, unknown>, key: string | symbol): unknown => {
        const keyStr = String(key);
        if (Object.keys(this).includes(keyStr)) return (this as Record<string, unknown>)[keyStr];
        if (this._data && Object.keys(this._data).includes(keyStr)) return this._data[keyStr];
        if (_config.computed && _config.computed[keyStr]) {
          return _config.computed[keyStr].call(target);
        }
        return undefined;
      },
      set: (_target: Record<string, unknown>, key: string | symbol, value: unknown): boolean => {
        const keyStr = String(key);
        if (!(this as Record<string, unknown>)[keyStr]) {
          return Reflect.set(this._data, key, value);
        }
        return Reflect.set(this, key, value);
      },
    });
  }

  /** Initialize and cache computed properties. */
  private _initComputed(): void {
    const { _config, _vm } = this;
    this._computed = {};
    if (_config.computed) {
      foreach(_config.computed as unknown as Record<string, unknown>, (key: string) => {
        this._computed[key] = _config.computed[key].call(_vm);
      });
    }
  }

  /** Compile template and mount to DOM (proxy-vue mounts to el selector). */
  private _appendDom(): void {
    const { render, el } = this._config;
    const targetElem = document.querySelector(el);
    if (!targetElem) {
      throw new Error(`Cannot find element: ${el}`);
    }
    targetElem.innerHTML = '';
    const createElement = new Compile(this._vm);
    targetElem.appendChild(render(createElement) as Node);
  }

  /** Bind all config functions to the VM context. */
  private _bindVM(): void {
    const { _config } = this;
    const configRecord = _config as unknown as Record<string, unknown>;
    Object.keys(configRecord).forEach(i => {
      if (typeof configRecord[i] === 'function') {
        configRecord[i] = (configRecord[i] as Function).bind(this._vm);
      }
    });
  }
}
