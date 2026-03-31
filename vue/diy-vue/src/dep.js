/**
 * Dependency collector: stores subscribers (watchers) per reactive key.
 */
export default class Dep {
  constructor() {
    // Use Map to store subscribers per key
    this.subs = new Map();
  }

  /** Add a subscriber (watcher) for the given key. */
  addSub(key, sub) {
    const currentSub = this.subs.get(key);
    if (currentSub) {
      currentSub.add(sub);
    } else {
      // Use Set to ensure unique subscribers
      this.subs.set(key, new Set([sub]));
    }
  }

  /** Notify all subscribers of the given key. */
  notify(key) {
    if (this.subs.get(key)) {
      this.subs.get(key).forEach(sub => {
        sub.update();
      });
    }
  }
}
