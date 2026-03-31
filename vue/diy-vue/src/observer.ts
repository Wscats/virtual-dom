import Dep from './dep';
import { isObject } from './utils';

type ReactiveObject = Record<string, unknown>;

/**
 * Observer: watches object properties via Proxy, notifies subscribers on change.
 * @param obj - Object to observe
 * @returns Proxied reactive object
 */
const Observer = (obj: ReactiveObject): ReactiveObject => {
  const dep = new Dep();
  return new Proxy(obj, {
    get(target: ReactiveObject, key: string | symbol, receiver: unknown): unknown {
      if (Dep.target) {
        dep.addSub(key, Dep.target);
      }
      return Reflect.get(target, key, receiver);
    },
    set(target: ReactiveObject, key: string | symbol, value: unknown, receiver: unknown): boolean {
      if (Reflect.get(receiver as object, key) === value) {
        return true;
      }
      const res = Reflect.set(target, key, observify(value), receiver);
      dep.notify(key);
      return res;
    },
  });
};

/**
 * Convert an object into a deeply reactive (observed) object.
 * @param obj - Object to make reactive
 * @returns Reactive proxy or original value for primitives
 */
export default function observify(obj: unknown): unknown {
  if (!isObject(obj)) {
    return obj;
  }

  const record = obj as ReactiveObject;
  Object.keys(record).forEach(key => {
    record[key] = observify(record[key]);
  });

  return Observer(record);
}
