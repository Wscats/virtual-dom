#  监听者的实现


`vue`基于`Object.defineProperty()`来实现了监听者，我们用`Proxy`来实现监听者。

与`Object.defineProperty()`监听属性不同, `Proxy`可以监听(实际是代理)整个对象,因此就不需要遍历对象的属性依次监听了,但是如果对象的属性依然是个对象,那么`Proxy`也无法监听,所以我们实现了一个`observify()`(用于判断是否对象的函数，如果是对象则交给`Proxy`递归进行监听)进行递归监听即可。


- [面试官: 你为什么使用前端框架?](https://juejin.im/post/5b16c0415188257d42153bac)

```js
/**
 * [Observer description] 监听器,监听对象,触发后通知订阅
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
```

# 利用Proxy代理函数实现过滤器

这里可以劫持一个空的对象，然后往里面设置`get`,并让`get`返回一个函数
```js
class createProxy {
    constructor() {
        return new Proxy({}, {
            get(object, prop) {
                console.log('get');
                return () => {
                    console.log('test');
                }
            }
        })
    }
}
let fn = new createProxy();
fn.test = 'test'; //触发set，不过这样在这里意义不大
fn.test(); //触发get，get会返回一个函数
fn.[xxx](); //触发get，get会返回一个函数
```
我们就可以在这里放两种形式的参数，放数组和函数的参数来进入同一个函数进行相同逻辑的处理，可以实现类似`React.createElement()`方法或者过滤器的方法
```js
fn[xxx](xxx);
```

# 编译模板

这是`_getElement()`在`proxy`中属于`get`，它主要创建`DOM`的节点，并绑定属性和更新子元素
```js
_getElement(target, tagName) {
    console.log(target, tagName);
    return (attrs = {}, ...childrens) => {
        // 创建节点
        this._elem = document.createElement(tagName);
        this._attrs = attrs;
        this._childrens = childrens;
        this._bindAttrs();
        this._addChildrens();
        // 返回一个DOM节点
        return this._elem;
    };
}
```

这个`createElement()`写得比较有意思，区别于`React.createElement()`的思路，就是借助上文讲得利用`Proxy()`代理函数实现过滤器思路来实现的
```js
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
            this._bindAttrs();
            this._addChildrens();
            return this._elem;
        };
    }
}
```

`_addChildrens()`函数用于判断两种虚拟DOM类型
|字符串|函数|
|-|-|
|`createElement.div({'name': 'lemon'}, 'name')`|`createElement.div({'name': 'lemon'}, function(){return this.name})`|
|`<div name="lemon">eno</div>`|`<div name="lemon">eno</div>`|
```js
// 添加子节点
_addChildrens() {
    const {
        _childrens,
        _elem,
        _vm
    } = this;
    _childrens.forEach(children => {
        let child;
        switch (typeof children) {
            // 如果是文本创建文本节点，并调用指令更新节点信息
            // 这里没有解析{{}}，默认就把字符串当模板变量的解析了
            case 'string':
                child = document.createTextNode('');
                compileUtil.text(child, _vm, children);
                break;
            // 如果子元素是一个函数，可以拿出来执行
            case 'function':
                child = document.createTextNode('');
                compileUtil.text(child, _vm, children);
                break;
            default:
                child = children;
        }
        // 往父节点插入所有子节点
        _elem.appendChild(child);
    });
}
```
往节点更新所有的子元素，并根据自定义指令`@xxx`，`:xxx`或者内置属性，来绑定节点对应的属性和属性值，当然这里的属性值
```js
// 绑定属性
_bindAttrs() {
    const {
        _attrs,
        _elem
    } = this;
    Object.keys(_attrs).forEach(attr => {
        // 这里事件指令还没写
        if (attr.includes('@')) {
            // TODO
        } else if (attr.includes(':')) {
            this._bindDirectives(attr, _elem);
        } else {
            _elem.setAttribute(attr, _attrs[attr]);
        }
    });
}
```
如果是自定义指令，如`:bind`,`:model`,`:text`和`:html`等，这种要去配合`compileUtil`和`updater`来更新节点信息
```js
this._bindDirectives(attr, _elem);
```
如果是内置指令，只需要简单绑定属性和属性值就可以了
```js
_elem.setAttribute(attr, _attrs[attr]);
```
所以`createElement()`方法其实可以在上面基础上进行一下封装，就可以变成类似`React.createElemnet()`方法，当然这里省略了指令和JSX里面包含有函数式编程的情况
```js
// 编译模板
class Compile {
    constructor(vm) {
        this._vm = vm;
        return (type, props, ...childrens) => {
            return new Proxy({}, {
                get: this._getElement.bind(this),
            })[type](props, ...childrens);
        }
    }
    _getElement(target, tagName) {
        return (attrs = {}, ...childrens) => {
            this._elem = document.createElement(tagName);
            this._attrs = attrs;
            this._childrens = childrens;
            this._bindAttrs();
            this._addChildrens();
            return this._elem;
        };
    }
    _bindAttrs() {
        const {
            _attrs,
            _elem
        } = this;
        Object.keys(_attrs).forEach(attr => {
            _elem.setAttribute(attr, _attrs[attr]);
        });
    }
    _addChildrens() {
        const {
            _childrens,
            _elem,
            _vm
        } = this;
        _childrens.forEach(children => {
            console.log(children);
            let child;
            switch (typeof children) {
                case 'string':
                    child = document.createTextNode('');
                    child.textContent = children;
                    break;
                default:
                    child = children;
            }
            _elem.appendChild(child);
        });
    }
}

// vm为当前模板的数据
let createElement = new Compile();
let template = createElement("div", {
        name: "lemon"
    },
    "hello Wolrd",
    createElement("p", {
        skill: "ps"
    }, "Lemon"),
    createElement("p", {
        age: "18"
    }, "Eno")
);
console.log(template); //<div name="lemon">hello Wolrd<p skill="ps">Lemon</p><p age="18">Eno</p></div>
```

# 参考

- [proxy-vue](https://github.com/xiaomuzhu/proxy-vue)