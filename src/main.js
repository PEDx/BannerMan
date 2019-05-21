import Vue from 'vue';
import './style/cssrest.css';
import App from './app';
import router from './router';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
