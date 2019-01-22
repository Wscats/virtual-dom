# createElement

1. `createElement`如何渲染自定义标签(组件)，并生成`JSX对象`
```js
createElement(App, null)
```
生成的格式为，注意`props`和`children`在这里一般为空，`type`的内容为继承`Component`类的`App`类组件
```js
{
    type: class App, 
    props: {
        children: []
    }
}
```

2. `createElement`如何渲染内置标签，并生成JSX对象

```js
this.like = () => {
    console.log(1)
}
createElement("div", {
    onClick: this.like
}, ["hello world", createElement("div", {
    onClick: this.like
}, "hello world")])
```
注意如果是渲染文本节点的话，类型都是`type: TEXT_ELEMENT`,并且附带`nodeValue: 文本值`
```js
{
    type: "div",
    props: {
        onClick: ƒ, 
        children: [
            {
                type: "TEXT_ELEMENT", 
                props: {
                    nodeValue: "hello world",
                    children: []
                }
            }
            {
                type: "div", 
                props: {
                    onClick: ƒ, 
                    children: [
                        {
                            type: "TEXT_ELEMENT", 
                            props: {
                                {
                                    nodeValue: "hello world", 
                                    children: []
                                }
                            }
                        }
                    ]
                }
            }
        }]
    }
}
```
3. `createElement`在组件和自带标签中混合使用

```js
this.like = () => {
    console.log(1)
}
createElement("div", {
    onClick: this.like
}, [createElement(App, null)])
```

```js
{
    type: div, 
    props: {
        onClick: ƒ, 
        children: [
            {
                type: class App, 
                props: {
                    children: []
                }
            }
        ]
    }
}
```