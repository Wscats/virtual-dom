function createElement(type, props, ...childrens) {
    return {
        // 父标签类型，比如dev，ul等
        type: type,
        // 属性值
        props: {
            ...props,
        },
        // 子节点，比如li，字符串等
        children: childrens.length <= 1 ? childrens[0] : childrens
    };
}

// => DOM的动态创建
function render(jsxObj, container, callback) {
    let {
        type,
        props,
        children
    } = jsxObj;
    let newElement = document.createElement(type);
    //=>属性和子元素的处理
    for (let attr in props) {
        if (!props.hasOwnProperty(attr)) break;
        switch (attr) {
            case 'className':
                newElement.setAttribute('class', props[attr]);
                break;
            case 'style':
                let styleOBJ = props['style'];
                for (let key in styleOBJ) {
                    if (styleOBJ.hasOwnProperty(key)) {
                        newElement['style'][key] = styleOBJ[key];
                    }
                }
                break;
                // =>CHILDREN
            case 'children':
                // 如果children放在props里面的话，这句才会有意义
                // renderChildren()
            default:
                newElement.setAttribute(attr, props[attr]);
        }
    }
    renderChildren()

    function renderChildren() {
        let childrenAry = children;
        childrenAry = childrenAry instanceof Array ? childrenAry : (childrenAry ? [childrenAry] : []);
        childrenAry.forEach(item => {
            // 如果子节点直接是字符串，进入这个分支
            if (typeof item === 'string') {
                // =>字符串:文本节点，直接增加到元素中
                newElement.appendChild(document.createTextNode(item));
            } else {
                // 如果是标签节点比如<span><img />这些都进入这个分支
                // =>字符串:新的JSX元素，递归调用RENDER，只不过此时的容器是当前新创建的newElement
                render(item, newElement);
            }
        });
    }
    console.log(newElement);
    container.appendChild(newElement);
    callback && callback();
}