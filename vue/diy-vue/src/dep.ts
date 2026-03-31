import type Watcher from './watcher';

/**
 * Dependency collector: stores subscribers (watchers) per reactive key.
 */
export default class Dep {
  /** Currently evaluating watcher (set during dependency collection). */
  static target: Watcher | null = null;

  private subs: Map<string | symbol, Set<Watcher>>;

  constructor() {
    this.subs = new Map();
  }

  /** Add a subscriber (watcher) for the given key. */
  addSub(key: string | symbol, sub: Watcher): void {
    const currentSub = this.subs.get(key);
    if (currentSub) {
      currentSub.add(sub);
    } else {
      this.subs.set(key, new Set([sub]));
    }
  }

  /** Notify all subscribers of the given key. */
  notify(key: string | symbol): void {
    const subs = this.subs.get(key);
    if (subs) {
      subs.forEach(sub => {
        sub.update();
      });
    }
  }
}
