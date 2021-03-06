import Vue from 'vue';
import Router from 'vue-router';
import Editor from './layout/index';
import Skeleton from './skeleton/skeleton.vue';

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
    },
    {
      path: '/editor/skeleton',
      name: 'skeleton',
      component: Skeleton
    }
  ]
});
