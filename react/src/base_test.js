let React = require("./base.js")
console.log(React)
class App extends React.Component {
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
        console.log(1)
    }
    render(){
        return (
            <div onClick = {
                this.like.bind(this)
            }>hello world</div>
        )
    }
}
console.log(new App())
// <App /> 会转化为 React.createElement(App, null)
React.render(<App />, document.querySelector("#root"))
