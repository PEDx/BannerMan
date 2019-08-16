import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './pages/dashboard';
import Skeleton from './skeleton/skeleton';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: 'manager',
      meta: { title: '退款申请', icon: 'fp' }
    },
    {
      path: '/manager',
      name: 'manager',
      component: Dashboard,
      meta: { title: '退款申请', icon: 'fp' }
    },
    {
      path: '/manager/skeleton',
      name: 'skeleton',
      component: Skeleton,
      meta: { title: '退款申请', icon: 'fp' }
    }
  ]
});
