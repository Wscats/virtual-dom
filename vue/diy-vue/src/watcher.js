import Dep from './dep';
import pushQueue from './batcher';

// 订阅者
export default class Watcher {
  constructor(vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.value = this.get();
  }
  get() {
    const exp = this.exp;
    let value;
    Dep.target = this;
    if (typeof exp === 'function') {
      value = exp.call(this.vm);
    } else if (typeof exp === 'string') {
      value = this.vm[exp];
    }
    Dep.target = null;
    return value;
  }
  update() {
    pushQueue(this);
  }
  run() {
    const val = this.get();
    this.cb.call(this.vm, val, this.value);
    this.value = val;
  }
}
