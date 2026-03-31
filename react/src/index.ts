'use strict';

import { importFromBelow } from './diy';

const user = {
  firstName: 'Eno',
  lastName: 'Yao',
};

const DiyReact = importFromBelow();

const randomLikes = (): number => Math.ceil(Math.random() * 100);

interface StoryData {
  name: string;
  url: string;
  likes: number;
}

const stories: StoryData[] = [
  { name: 'React', url: 'https://reactjs.org/', likes: randomLikes() },
  { name: 'Node', url: 'https://nodejs.org/en/', likes: randomLikes() },
  { name: 'Webpack', url: 'https://webpack.js.org/', likes: randomLikes() },
];

class App extends DiyReact.Component {
  render() {
    return DiyReact.createElement(
      'div', null,
      DiyReact.createElement('h1', null, 'DiyReact Stories'),
      DiyReact.createElement(
        'ul', null,
        ...(this.props as { stories: StoryData[] }).stories.map((story: StoryData) =>
          DiyReact.createElement(Story as any, { name: story.name, url: story.url }),
        ),
      ),
    );
  }

  componentWillMount(): void {
    console.log('execute componentWillMount');
  }

  componentDidMount(): void {
    console.log('execute componentDidMount');
  }

  componentWillUnmount(): void {
    console.log('execute componentWillUnmount');
  }
}

class Story extends DiyReact.Component {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = { likes: Math.ceil(Math.random() * 100) };
  }

  like(): void {
    this.setState({ likes: (this.state.likes as number) + 1 });
  }

  render() {
    const { name, url } = this.props as { name: string; url: string };
    const { likes } = this.state;
    return DiyReact.createElement(
      'li', null,
      DiyReact.createElement('button', { onClick: () => this.like() }, String(likes), DiyReact.createElement('b', null, '❤️')),
      DiyReact.createElement('a', { href: url }, name),
    );
  }

  componentWillUpdate(): void {
    console.log('execute componentWillUpdate');
  }

  componentDidUpdate(): void {
    console.log('execute componentDidUpdate');
  }
}

DiyReact.render(
  DiyReact.createElement(App as any, { stories }),
  document.getElementById('root') as HTMLElement,
);

const profile = DiyReact.createElement(
  'div', null,
  DiyReact.createElement('img', { src: 'https://avatars1.githubusercontent.com/u/17243165', className: 'profile' }),
  DiyReact.createElement('h3', null, [user.firstName, user.lastName].join(' ')),
  DiyReact.createElement('a', { href: 'https://github.com/Wscats' }, 'Github'),
);
console.log('profile', profile);