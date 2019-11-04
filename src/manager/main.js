/* eslint-disable comma-dangle */
import Vue from 'vue';
import App from './app';
import router from './router';
import '@style/cssrest.css';
import store from '@store';
import './styles/index.scss';
import '@/icons';
import SvgIcon from '../editor/components/svg-icon.vue';
import './filter';
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
  Loading,
  Dropdown,
  DropdownItem,
  TimePicker,
  DatePicker,
  DropdownMenu,
  Table,
  TableColumn,
  Tooltip,
  Form,
  FormItem,
  Switch,
  Pagination,
  Slider,
  Scrollbar,
  Input,
  Breadcrumb,
  Popover,
  Card,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Message,
  BreadcrumbItem,
  Notification
} from 'element-ui';

Vue.use(Row)
  .use(Col)
  .use(InputNumber)
  .use(Slider)
  .use(Pagination)
  .use(Checkbox)
  .use(Input)
  .use(Dropdown)
  .use(TimePicker)
  .use(DatePicker)
  .use(DropdownItem)
  .use(Scrollbar)
  .use(Link)
  .use(DropdownMenu)
  .use(Table)
  .use(TableColumn)
  .use(Dialog)
  .use(Loading)
  .use(Form)
  .use(FormItem)
  .use(BreadcrumbItem)
  .use(Breadcrumb)
  .use(Switch)
  .use(Tooltip)
  .use(Upload)
  .use(Popover)
  .use(Card)
  .use(Button)
  .use(Menu)
  .use(Submenu)
  .use(MenuItem)
  .use(MenuItemGroup)
  .use(Select)
  .use(Option);
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
