import Vue from 'vue';
import Router from 'vue-router';
import Editer from '../editer/index';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/editer'
    },
    {
      path: '/editer',
      name: 'editer',
      component: Editer
    }
  ]
});
