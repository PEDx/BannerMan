import Vue from 'vue';
import App from './app';
import router from './router';
import './style/cssrest.css';
import './style/element-style-reload.scss';
import { Row, Col, Select, Option, Button } from 'element-ui';
import store from './store';

Vue.config.productionTip = false;
Vue.use(Row)
  .use(Col)
  .use(Option)
  .use(Button)
  .use(Select);
Vue.prototype.$ELEMENT = { size: 'mini' };
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
