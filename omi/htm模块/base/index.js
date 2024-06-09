const CACHES = new Map();

const regular = function (statics) {
  let tmp = CACHES.get(this);
  if (!tmp) {
    tmp = new Map();
    CACHES.set(this, tmp);
  }
  tmp = evaluate(
    this,
    tmp.get(statics) || (tmp.set(statics, (tmp = build(statics))), tmp),
    arguments,
    []
  );
  return tmp.length > 1 ? tmp : tmp[0];
};

window.html = MINI ? build : regular;
