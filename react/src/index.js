let user = {
  firstName: "Eno",
  lastName: "Yao"
}
// let pig = require("./base.js")

// let profile = <div>
//   <img src="https://avatars1.githubusercontent.com/u/17243165" className="profile" />
//   <h3>{[user.firstName, user.lastName].join(' ')}</h3>
//   <a href="https://github.com/Wscats">Github</a>
// </div>;

// let profile = <ul id='list'>
//   <li class='item'>Item 1</li>
//   <li class='item'>Item 2</li>
//   <li class='item'>Item 3</li>
// </ul>
// console.log(pig)
// console.log(profile)
// pig.render(profile,document.body,()=>{
//   console.log("Virtual DOM")
// })

let core = require("./diy.js")
console.log(core)

/** @jsx DiyReact.createElement */

const DiyReact = core.importFromBelow();
console.log(DiyReact)
const randomLikes = () => Math.ceil(Math.random() * 100);

const stories = [
  {name: "React", url: "https://reactjs.org/", likes: randomLikes()},
  {name: "Node", url: "https://nodejs.org/en/", likes: randomLikes()},
  {name: "Webpack", url: "https://webpack.js.org/", likes: randomLikes()}
];

const ItemRender = props => {
  const {name, url} = props;
  return (
    <a href={url}>{name}</a>
  );
};

class App extends DiyReact.Component {
  render() {
    return (
      <div>
        <h1>DiyReact Stories</h1>
        <ul>
          {this.props.stories.map(story => {
            return <Story name={story.name} url={story.url} />;
          })}
        </ul>
      </div>
    );
  }
  
  componentWillMount() {
    console.log('execute componentWillMount');

  }
  
  componentDidMount() {
    console.log('execute componentDidMount');
  }
  
  componentWillUnmount() {
    console.log('execute componentWillUnmount');
  }
}

class Story extends DiyReact.Component {
  constructor(props) {
    super(props);
    this.state = { likes: Math.ceil(Math.random() * 100) };
  }
  like() {
    this.setState({
      likes: this.state.likes + 1
    });
  }
  render() {
    const { name, url } = this.props;
    const { likes } = this.state;
    const likesElement = <span />;
    const itemRenderProps = {name, url};
    return (
      <li>
        <button onClick={e => this.like()}>{likes}<b>❤️</b></button>
        <ItemRender {...itemRenderProps} />
      </li>
    );
  }
  
  // shouldcomponentUpdate() {
  //   return true;
  // }
  
  componentWillUpdate() {
    console.log('execute componentWillUpdate');
  }
  
  componentDidUpdate() {
    console.log('execute componentDidUpdate');
  }

}

DiyReact.render(<App stories={stories} />, document.getElementById("root"));
let profile = <div>
  <img src="https://avatars1.githubusercontent.com/u/17243165" className="profile" />
  <h3>{[user.firstName, user.lastName].join(' ')}</h3>
  <a href="https://github.com/Wscats">Github</a>
</div>;
console.log("profile", profile)