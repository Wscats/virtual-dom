/**
 * [subs description] 订阅器,储存订阅者
 * @type {Map}
 */
export default class Dep {
  constructor() {
    // 我们用 hash 储存订阅者
    this.subs = new Map();
  }
  // 添加订阅者
  addSub(key, sub) {
    // 取出键为 key 的订阅者
    const currentSub = this.subs.get(key);
    if (currentSub) {
      currentSub.add(sub);
    } else {
      // 用 Set 数据结构储存,保证唯一值
      this.subs.set(key, new Set([sub]));
    }
  }
  // 通知
  notify(key) {
    if (this.subs.get(key)) {
      this.subs.get(key).forEach(sub => {
        sub.update();
      });
    }
  }
}
