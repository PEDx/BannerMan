import Vue from 'vue';
import App from './app';
import router from './router';
import '@style/cssrest.css';
import '@style/element-style-reload.scss';
import VueDraggableResizable from 'vue-draggable-resizable';
import 'vue-draggable-resizable/dist/VueDraggableResizable.css';
import 'es6-promise/auto';
import '@/icons';
import SvgIcon from './components/svg-icon.vue';
import {
  Row,
  Col,
  Select,
  Checkbox,
  Option,
  InputNumber,
  ColorPicker,
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
  Cascader,
  Message,
  Notification
} from 'element-ui';
import store from '@store';

Vue.config.productionTip = false;
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
  .use(ColorPicker)
  .use(Tooltip)
  .use(Upload)
  .use(Popover)
  .use(Card)
  .use(Cascader)
  .use(Button)
  .use(Select)
  .use(SvgIcon)
  .use(Option);

Vue.component('vue-draggable-resizable', VueDraggableResizable);
Vue.component('svg-icon', SvgIcon);
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
