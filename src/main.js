import Vue from 'vue';
import App from './app';
import router from './router';
import './style/cssrest.css';
import './style/element-style-reload.scss';
import {
  Row,
  Col,
  Select,
  Option,
  InputNumber,
  Button,
  Upload,
  Slider,
  Input,
  Popover,
  Card,
  Message,
  Notification
} from 'element-ui';
import store from './store';

Vue.config.productionTip = false;
Vue.use(Row)
  .use(Col)
  .use(InputNumber)
  .use(Slider)
  .use(Input)
  .use(Upload)
  .use(Popover)
  .use(Card)
  .use(Button)
  .use(Select)
  .use(Option);
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.prototype.$ELEMENT = { size: 'mini' };

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
