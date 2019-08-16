import Vue from 'vue';
import Router from 'vue-router';
import Manager from './app';
import Skeleton from './skeleton/skeleton';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/manager'
    },
    {
      path: '/manager',
      name: 'manager',
      component: Manager
    },
    {
      path: '/manager/skeleton',
      name: 'skeleton',
      component: Skeleton
    }
  ]
});
