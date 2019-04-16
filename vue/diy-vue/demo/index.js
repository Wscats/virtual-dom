import Component from '../src/component';
new Component('my-header', {
  data() {
    return {
      msg: '头部',
    };
  },
  computed: {
    change() {
      return this.msg;
    },
    click() {
      return this.msg;
    },
  },
  render(createElement) {
    return createElement('div', {},
      () => this.change,
      createElement('input', {
        ':model': 'msg',
      })
    );
  },
})

new Component('my-footer', {
  data() {
    return {
      msg: '底部',
    };
  },
  render(createElement) {
    return createElement('div', {},
      () => this.msg
    );
  },
})