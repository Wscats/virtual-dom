var htm = require('htm');
var fs = require('fs');

function h(type, props, ...children) {
    return {
        type,
        props,
        children
    };
}
const html = htm.bind(h);
const jsx = html `<h1 id=hello>Hello world!</h1>`;
fs.writeFile('./jsx.json', JSON.stringify(jsx), () => {
    console.log('生成jsx对象成功')
})