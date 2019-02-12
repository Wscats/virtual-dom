function createElement(type, props, ...children) {
    props = Object.assign({}, props);
    props.children = [].concat(...children)
        // 筛选
        .filter(child => child != null && child !== false)
        // 遍历操作 如果是对象则筛选掉(这里会筛选JSX对象和组件对象)，留下来文本节点进行处理
        .map(child => child instanceof Object ? child : createTextElement(child));
    return {
        type,
        props
    };
}

function createTextElement(value) {
    // 把文本节点从字符串变为对象{type:'TEXT_ELEMENT',props:{nodeValue:文本值}}
    // 注意文本节点没有传children，所以children是肯定是空数组
    return createElement('TEXT_ELEMENT', {
        nodeValue: value
    });
}

module.exports = {
    createElement,
    createTextElement
}