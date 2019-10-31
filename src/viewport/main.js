import Vue from 'vue';
import App from './app';
import componentsWrap from './components/components-wrap';
import '../style/cssrest.css';
import VTap from '../v-tap';
Vue.directive('tap', VTap);
Vue.component('components-wrap', componentsWrap);

// 暴露 Vue 对象给动态获取的 Widgets
window.Vue = Vue;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
});
