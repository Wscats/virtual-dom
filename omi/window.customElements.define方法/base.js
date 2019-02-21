const str =
    `
    <style>
        header {
            height: 50px;
            line-height: 50px;
            width: 100%;
            text-align: center;
            color: white;
            background-color: red;
        }
    </style>
    <header><slot name="my-title">头部</slot></header>
    `
class Xheader extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement('template');
        
        template.innerHTML = str;
        const templateContent = template.content;
        console.log(this.getAttribute('name'))
        // 创建一颗可见的DOM树，这棵树会附着到某个DOM元素上
        // 这棵树的根节点称之为shadow root，只有通过shadow root 才可以访问内部的shadow dom，并且外部的css样式也不会影响到shadow dom上
        // 相当于创建了一个独立的作用域
        // console.log(this)
        // templateContent.onclick = function(){
        //     console.log(1)
        // }
        const shadow = this.attachShadow({
            mode: 'open'// 'open' 表示该shadow dom可以通过js 的函数进行访问
        })
        shadow.appendChild(
            templateContent.cloneNode(true)// 操作shadow dom
        );
        console.log(shadow.childNodes)
    }
}
// 允许自定义元素及其行为，然后可以在您的用户界面中按照需要使用它们
const myHeader = customElements.define('my-header', Xheader);
console.log(myHeader); //undefined