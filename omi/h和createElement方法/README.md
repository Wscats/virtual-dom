# h方法支持两种写法

第一种
```js
const vnode = h(
    'button', {
        onClick: () => {
            this.data.liked = true
            this.update()
        },
        key: 1
    },
    'Like'
);
```

第二种，等价于第一种
```js
const vnode2 = h(
    'button', {
        onClick: () => {
            this.data.liked = true
            this.update()
        },
        key: 1,
        children: 'Like'
    },
);
```
以上会转化为以下对象
```js
const vnode = {
    attributes: {
        key: 1,
        onClick: () => {
            this.data.liked = true
            this.update()
        }
    },
    children: ["Like"],
    key: 1,
    nodeName: "button"
}
```