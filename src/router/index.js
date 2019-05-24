import Vue from 'vue';
import Router from 'vue-router';
import Editor from '../editor/index';
import Viewport from '../viewport/index';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Editor
    },
    {
      path: '/editor/viewport',
      name: 'viewport',
      component: Viewport
    },
    {
      path: '/editor',
      name: 'editor',
      component: Editor
    }
  ]
});
