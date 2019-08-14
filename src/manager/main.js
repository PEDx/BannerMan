import Vue from 'vue';
import axios from 'axios';
import App from './app';
import '../style/cssrest.css';

Vue.prototype.$http = axios;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
});
