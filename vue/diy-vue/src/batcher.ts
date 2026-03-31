import type Watcher from './watcher';

/** Async update queue for batching watcher updates. */
let queue: Set<Watcher> = new Set();

/** Schedule a callback on the next microtask (simulates Vue's nextTick). */
function nextTick(cb: () => void): void {
  Promise.resolve().then(cb);
}

/** Flush the queue: run all pending watchers. */
function flushQueue(): void {
  queue.forEach(watcher => {
    watcher.run();
  });
  queue = new Set();
}

/** Add a watcher to the async update queue. */
export default function pushQueue(watcher: Watcher): void {
  queue.add(watcher);
  nextTick(flushQueue);
}
