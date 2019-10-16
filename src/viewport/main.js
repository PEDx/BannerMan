import Vue from 'vue';
import App from './app';
import componentsWrap from './components/components-wrap';
import '../style/cssrest.css';
import VTap from '../v-tap';
Vue.directive('tap', VTap);
Vue.component('components-wrap', componentsWrap);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
});
