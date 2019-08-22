import Vue from 'vue';
import Router from 'vue-router';
import Skeleton from './skeleton/skeleton';
import Layout from './layout/layout';
Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: 'manager'
    },
    {
      path: '/manager',
      name: 'manager',
      component: Layout,
      root: true,
      children: [
        {
          path: 'user',
          name: 'user',
          meta: { title: '用户管理', icon: 'mine' },
          component: Skeleton
          // redirect: 'noredirect',
          // children: [
          //   {
          //     path: 'skeleton',
          //     name: 'userskeleton',
          //     component: Skeleton,
          //     meta: { title: '骨架', icon: 'shielding' }
          //   }
          // ]
        },
        {
          path: 'group',
          name: 'group',
          component: Skeleton,
          meta: { title: '组管理', icon: 'group' }
        },
        {
          path: 'skeleton',
          name: 'skeleton',
          component: Skeleton,
          meta: { title: 'Gallery', icon: 'gallery' }
        }
      ]
    }
  ]
});
