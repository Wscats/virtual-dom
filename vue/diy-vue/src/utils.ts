/** Check if a value is a plain object. */
export const isObject = (obj: unknown): obj is Record<string, unknown> =>
  Object.prototype.toString.call(obj) === '[object Object]';

/** Iterate over object keys with a callback. */
export const foreach = (obj: Record<string, unknown> = {}, fn?: (key: string) => void): void => {
  Object.keys(obj).forEach(key => fn && fn(key));
};
