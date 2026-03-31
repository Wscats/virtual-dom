import Dep from './dep';
import {isObject} from './utils';

/**
 * Observer: watches object properties via Proxy, notifies subscribers on change.
 * @param {Object} obj - Object to observe
 * @returns {Proxy} Proxied reactive object
 */
const Observer = obj => {
  const dep = new Dep();
  return new Proxy(obj, {
    get: function(target, key, receiver) {
      // Subscribe current watcher if one is being evaluated
      if (Dep.target) {
        dep.addSub(key, Dep.target);
      }
      return Reflect.get(target, key, receiver);
    },
    set: function(target, key, value, receiver) {
      if (Reflect.get(receiver, key) === value) {
        return;
      }
      const res = Reflect.set(target, key, observify(value), receiver);
      dep.notify(key);
      return res;
    },
  });
};

/**
 * Convert an object into a deeply reactive (observed) object.
 * @param {*} obj - Object to make reactive
 * @returns {Proxy|*} Reactive proxy or original value for primitives
 */
export default function observify(obj) {
  if (!isObject(obj)) {
    return obj;
  }

  // Deep observe nested objects
  Object.keys(obj).forEach(key => {
    obj[key] = observify(obj[key]);
  });

  return Observer(obj);
}
