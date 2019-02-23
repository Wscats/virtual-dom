  /**
   * [Observer description] 监听器,监听对象,触发后通知订阅
   * @param {[type]}   obj [description] 需要被监听的对象
   */
  const Observer = obj => {
      const dep = new Dep();
      return new Proxy(obj, {
          get: function (target, key, receiver) {
              console.log('get');
              // 如果订阅者存在，直接添加订阅
              if (Dep.target) {
                  dep.addSub(key, Dep.target);
              }
              return Reflect.get(target, key, receiver);
          },
          set: function (target, key, value, receiver) {
              console.log('set');
              // 如果对象值没有变,那么不触发下面的操作直接返回    
              if (Reflect.get(receiver, key) === value) {
                  return;
              }
              const res = Reflect.set(target, key, observify(value), receiver);
              // 当值被触发更改的时候,触发 Dep 的通知方法
              dep.notify(key);
              return res;
          },
      });
  };

  /**
   * 将对象转为监听对象
   * @param {*} obj 要监听的对象
   */
  function observify(obj) {
      if (!isObject(obj)) {
          return obj;
      }

      // 深度监听
      Object.keys(obj).forEach(key => {
          obj[key] = observify(obj[key]);
      });

      return Observer(obj);
  }

  const isObject = obj =>
      Object.prototype.toString.call(obj) === '[object Object]';

  const foreach = (obj = {}, fn) => {
      Object.keys(obj).forEach(key => fn && fn(key));
  };

  /**
   * [subs description] 订阅器,储存订阅者
   * @type {Map}
   */
  class Dep {
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
  class Vue {
      constructor(config) {
          this._config = config;
          this._initVM();
          this._initData(config.data);
          this._initComputed();
          this._bindVM();
          this._appendDom();
          return this._vm;
      }
      _initData(data) {
          this._data = observify(data());
      }
      // 将_vm与data绑定，对this进行代理
      _initVM() {
          const {
              _config
          } = this;
          this._vm = new Proxy(this, {
              get: (target, key, receiver) => {
                  if (Object.keys(this).includes(key)) return this[key];
                  if (Object.keys(this._data).includes(key)) return this._data[key];
                  // 如果是获取computed中的计算属性，那就要重新计算，获取data中数据，将dom订阅，关联了computed和dom
                  return _config.computed[key].call(target._vm);
              },
              set: (target, key, value, receiver) => {
                  if (!this[key]) {
                      return Reflect.set(this._data, key, value);
                  }
                  return Reflect.set(target, key, value);
              },
          });
      }
      // 初始化Computed,并缓存
      _initComputed() {
          const {
              _config,
              _vm
          } = this;
          this._computed = {};
          foreach(_config.computed, key => {
              // call执行了
              this._computed[key] = _config.computed[key].call(_vm);
          });
      }
      // 将函数绑定到this._vm上
      _bindVM() {
          const {
              _config
          } = this;
          Object.keys(_config).forEach(i => {
              const val = _config[i];
              if (typeof _config[i] === 'function') {
                  _config[i] = _config[i].bind(this._vm);
              }
          });
      }
      // 重新
      _appendDom() {
          const {
              render,
              el
          } = this._config;
          const targetElem = document.querySelector(el);
          targetElem.innerHTML = '';
          const createElement = new Compile(this._vm);
          //   targetElem.appendChild(render(createElement));
      }

  }
  class Compile {
      constructor(vm) {
          this._vm = vm;
          return new Proxy({}, {
              get: this._getElement.bind(this),
          }, );
      }
      _getElement(target, tagName) {
        return (attrs = {}, ...childrens) => {
          // 创建节点
          this._elem = document.createElement(tagName);
          this._attrs = attrs;
          this._childrens = childrens;
        //   this._bindAttrs();
        //   this._addChildrens();
          return this._elem;
        };
      }
  }

  let vm = new Vue({
      el: 'body',
      data() {
          return {
              msg: '大家好',
              people: {
                  skill: ['ps', 'js', 'css'],
                  name: 'eno'
              }
          };
      },
      computed: {
          change() {
              return this.msg;
          },
          click() {
              return this.msg;
          },
      },
      render(createElement) {
          return createElement.div({},
              () => this.change,
              createElement.input({
                  ':model': 'msg',
              }),
          );
      },
  })
  console.log(vm);