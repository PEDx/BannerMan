import Vue from 'vue';
import Router from 'vue-router';
import Editor from '../editor/index';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/editor'
    },
    {
      path: '/editor',
      name: 'editor',
      component: Editor
    }
  ]
});
