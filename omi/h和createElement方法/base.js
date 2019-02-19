function VNode() {}
var stack = [];
var EMPTY_CHILDREN = [];
function h(nodeName, attributes) {
    var lastSimple, child, simple, i, children = EMPTY_CHILDREN;
    // 把h的参数遍历放进stack数组
    // 只放长度大于2的参数 stack = ['like']
    for (i = arguments.length; i-- > 2;) stack.push(arguments[i]);
    // 判断attributes是否有children属性值，如果有则放进stack数组里面
    // 这句就是让h方法支持两种vnode的写法
    if (attributes && null != attributes.children) {
        // 如果stack数组是已经有一值的话，也就是只有['like']，否则把它放进数组里面
        // 并那删掉attributes对象children属性值
        if (!stack.length) stack.push(attributes.children);
        delete attributes.children;
    }
    while (stack.length)
        // pop() 方法用于删除并返回数组的最后一个元素
        if ((child = stack.pop()) && void 0 !== child.pop)
            for (i = child.length; i--;) stack.push(child[i]);
        else {
            // 判断 child = 'like'是否布尔值
            if ('boolean' == typeof child) child = null;
            // 判断nodeName是否函数
            if (simple = 'function' != typeof nodeName)
                if (null == child) child = '';
                else if ('number' == typeof child) child = String(child);
            else if ('string' != typeof child) simple = !1;
            if (simple && lastSimple) children[children.length - 1] += child;
            else if (children === EMPTY_CHILDREN) children = [child];
            else children.push(child);
            lastSimple = simple;
        }
    var p = new VNode();
    p.nodeName = nodeName;
    p.children = children;
    p.attributes = null == attributes ? void 0 : attributes;
    p.key = null == attributes ? void 0 : attributes.key;
    // if (void 0 !== options.vnode) options.vnode(p);
    return p;
}
// 第一种写法，和第二种写法一样，只是第二种写法把like文本写到attributes里面的children里面而已
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

// 第二种写法
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

console.log(vnode);
console.log(vnode2);