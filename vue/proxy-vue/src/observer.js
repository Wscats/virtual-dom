import Dep from './dep';
import {isObject} from './utils';

/**
 * [Observer description] 监听器,监听对象的属性,触发后通知订阅
 * @param {[type]}   obj [description] 需要被监听的对象
 */
const Observer = obj => {
  const dep = new Dep();
  return new Proxy(obj, {
    get: function(target, key, receiver) {
      // 如果订阅者存在，直接添加订阅
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
 * 将对象转为监听对象
 * @param {*} obj 要监听的对象
 */
export default function observify(obj) {
  if (!isObject(obj)) {
    return obj;
  }

  // 深度监听
  Object.keys(obj).forEach(key => {
    obj[key] = observify(obj[key]);
  });

  return Observer(obj);
}
