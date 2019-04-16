// 创建异步更新队列
let queue = new Set()

// 用Promise模拟nextTick
function nextTick(cb) {
    Promise.resolve().then(cb)
}

// 执行刷新队列
function flushQueue(args) {
    queue.forEach(watcher => {
            watcher.run()
        })
    // 清空
    queue = new Set()
}

// 添加到队列
export default function pushQueue(watcher) {
    queue.add(watcher)
    // 下一个循环调用
    nextTick(flushQueue)
}
