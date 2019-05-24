import Vue from 'vue';
import Router from 'vue-router';
import Editer from '../editer/index';
import Viewport from '../viewport/index';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Editer
    },
    {
      path: '/editer/viewport',
      name: 'viewport',
      component: Viewport
    },
    {
      path: '/editer',
      name: 'editer',
      component: Editer
    }
  ]
});
