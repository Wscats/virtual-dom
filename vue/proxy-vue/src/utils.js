export const isObject = obj =>
  Object.prototype.toString.call(obj) === '[object Object]';

export const foreach = (obj = {}, fn) => {
  Object.keys(obj).forEach(key => fn && fn(key));
};
