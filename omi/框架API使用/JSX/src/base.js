const {
    WeElement,
    h,
    render,
    define
} = require('omi');
let test = ()=>{};
let vnode = <div class="abc">
    hello
    <button onClick={test}>ok</button>
    world
</div>
console.log(vnode);