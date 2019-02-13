function updateDomProperties(dom, prevProps, nextProps) {
    // 定义事件过滤器筛选函数，以on为特征去监听
    // startsWith方法判断是否on字符串作为开头
    const isEvent = name => name.startsWith("on");
    // 定义属性值筛选函数，筛选掉事件属性值和children属性值
    const isAttribute = name => !isEvent(name) && name != "children";
    // 卸载事件绑定
    Object.keys(prevProps).filter(isEvent).forEach(name => {
        // 将字符串转化成小写，然后剪裁掉前面两个字母
        // 比如: onClick  -->  Click
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[name]);
    });

    // 清除属性值
    Object.keys(prevProps).filter(isAttribute).forEach(name => {
        dom[name] = null;
    });

    // 设置属性值
    Object.keys(nextProps).filter(isAttribute).forEach(name => {
        dom[name] = nextProps[name];
    });

    // 绑定事件
    Object.keys(nextProps).filter(isEvent).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[name]);
    });
    
}

module.exports = {
    updateDomProperties
}