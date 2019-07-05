import Vue from 'vue';
import App from './app';
import componentWrap from './component-wrap';
import '../style/cssrest.css';

Vue.component('component-wrap', componentWrap);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
});
