# WeElement和Component

定义一个组件类，该组件类继承于`WeElement`(相当于Component),而实际上`WeElement`又是继承了原生的`HTMLElement`
```js
// 继承
_inherits(WeElement, _HTMLElement);
```
组件内部任何地方的`this`指向的是`shadow`创建的`button`节点
```js
class LikeButton extends WeElement {
    install() {
        console.log(this)
        this.data = {
            liked: false
        }
    }
    render() {
        if (this.data.liked) {
            return 'You liked this.'
        }
        return {
            attributes: {
                key: 1,
                onClick: () => {
                    console.log({...this})
                    this.data.liked = true
                    this.update()
                }
            },
            children: ["Like"],
            key: 1,
            nodeName: "button"
        }
    }
}
// 注意名字不能LikeButton,不能有大写，可以用-符号
define('like-button', LikeButton)
```

当然如果把组件内部的`this`展开了之后会有以下属性值，`data`相当于`react`的`state`，而`props`相当于`react`的`props`
```js
console.log({...this})
{
    B: true,
    L: button,
    data: {liked: true},
    elementId: 0,
    props: {},
    store: undefined
}
```

# define

`define`自定义元素的命名限制如下

- 必须以小写字母开头
- 必须有至少一个中划线
- 允许小写字母，中划线，下划线，点号，数字
- 允许部分`Unicode`字符，所以`<h-?></h-?>`这样也是可以的.
- 不允许下面这些名称

> annotation-xml

> color-profile

> font-face

> font-face-src

> font-face-uri

> font-face-format

> font-face-name

> missing-glyph

`define()`方法有两个分支，现在先研究上面那个分支，这个分支是根据`WeElement.is = WeElement`来去判断组件是否用了`WeElement`来定义的，如果是的话就直接调用`customElements.define(name, ctor)`创建这个自定义标签，这个分支的组件因为继承于`WeElement`所以它里面除了继承原生`HTMLElement`的方法之外，还自己改写了很多新方法
```js
function define(name, ctor) {
    // 如果define的是WeElement创建的组件，既 define('like-button', LikeButton)
    if ('WeElement' === ctor.is) {
        customElements.define(name, ctor);
        if (ctor.data && !ctor.pure) ctor.updatePath = getUpdatePath(ctor.data);
    } else {
        // 如果define的内置标签
    }
}
```
而下面的分支因为这里还没研究，猜测是用原生的`HTMLElement`创建组件的情况，因为用的是原生，所以就没有`WeElement`为我们提供的方法，比如应该就没有组件的状态，JSX，生命周期这些

`define()`被调用后，如果不往页面使用组件的话就不会触发组件里面的逻辑，而当我们往页面里面放入`<like-button />`的时候，`LikeButton`类相当于就是被实例化，所以会触发里面构造函数的逻辑
```html
<like-button />
```
下面这个就是`WeElement`构造函数的逻辑
```js
function WeElement() {
    _classCallCheck(this, WeElement);
    var _this = _possibleConstructorReturn(this, _HTMLElement.call(this));
    _this.props = Object.assign(nProps(_this.constructor.props), _this.constructor.defaultProps);
    _this.elementId = id++;
    _this.data = _this.constructor.data || {};
    return _this;
}
```

# WeElement组件的产生过程

[详见_inherits方法WeElement继承HTMLElement.html]()

|步骤|涉及的方法|
|-|-|
|||