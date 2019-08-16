import Vue from 'vue';
import App from './app';
import router from './router';
import '@style/cssrest.css';
import '@style/element-style-reload.scss';

import {
  Row,
  Col,
  Select,
  Checkbox,
  Option,
  InputNumber,
  Button,
  Link,
  Upload,
  Dialog,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Tooltip,
  Form,
  FormItem,
  Switch,
  Slider,
  Input,
  Popover,
  Card,
  Message,
  Notification
} from 'element-ui';

Vue.use(Row)
  .use(Col)
  .use(InputNumber)
  .use(Slider)
  .use(Checkbox)
  .use(Input)
  .use(Dropdown)
  .use(DropdownItem)
  .use(Link)
  .use(DropdownMenu)
  .use(Dialog)
  .use(Form)
  .use(FormItem)
  .use(Switch)
  .use(Tooltip)
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
  render: h => h(App)
});
