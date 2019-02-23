import Vue from '../src/vue';

const vm = new Vue({
  el: 'body',
  data() {
    return {
      msg: '大家好',
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
    return createElement.div(
      {},
      () => this.change,
      createElement.input({
        ':model': 'msg',
      }),
    );
  },
});
