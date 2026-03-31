import Dep from './dep';
import pushQueue from './batcher';

/** Expression type: either a function or a property name string. */
type WatchExpression = (() => unknown) | string;

/** Callback invoked when the watched value changes. */
type WatchCallback = (newVal: unknown, oldVal: unknown) => void;

/** Subscriber: watches a reactive expression and triggers callback on change. */
export default class Watcher {
  private vm: Record<string, unknown>;
  private exp: WatchExpression;
  private cb: WatchCallback;
  public value: unknown;

  constructor(vm: Record<string, unknown>, exp: WatchExpression, cb: WatchCallback) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.value = this.get();
  }

  /** Evaluate the expression and collect dependencies. */
  get(): unknown {
    const exp = this.exp;
    let value: unknown;
    Dep.target = this;
    if (typeof exp === 'function') {
      value = exp.call(this.vm);
    } else if (typeof exp === 'string') {
      value = this.vm[exp];
    }
    Dep.target = null;
    return value;
  }

  /** Schedule an async update via the batcher queue. */
  update(): void {
    pushQueue(this);
  }

  /** Execute the watcher callback with old and new values. */
  run(): void {
    const val = this.get();
    this.cb.call(this.vm, val, this.value);
    this.value = val;
  }
}
