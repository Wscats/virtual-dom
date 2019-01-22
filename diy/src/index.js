import React from './base.js'
console.log(React)
class App extends React.Component{
    constructor(props) {
        super(props);
        this.props = {
            name: "laoxie"
        };
        this.state = {
            name: "laoyao",
            age: 18
        };
    }
    like(){
        console.log("like")
    }
    render(){
        return (
            <div onClick={this.like}>hello world</div>
        )
    }
}
React.render(<App />, document.querySelector("#root"))

// class r extends o.Component {
//     constructor(e) {
//         super(e), this.props = {
//             name: "laoxie"
//         }, this.state = {
//             name: "laoyao",
//             age: 18
//         }
//     }
//     like() {
//         console.log(1)
//     }
//     render() {
//         return o.createElement("div", {
//             onClick: this.like.bind(this)
//         }, "hello world")
//     }
// }
// console.log(new r), o.render(o.createElement(r, null), document.querySelector("#root"))