import Vue from 'vue';
import App from './app';
import router from './router';
import './style/cssrest.css';
import './style/element-variables.scss';
import './style/element-reload.scss';
import { Row, Col, Select, Option, Button } from 'element-ui';

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
  render: h => h(App)
});
