import Vue from 'vue';
import Router from 'vue-router';
import Editor from '../editor/index';
import Dashboard from '../pages/dashboard';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/editor',
      name: 'editor',
      component: Editor
    }
  ]
});
