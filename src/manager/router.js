import Vue from 'vue';
import Router from 'vue-router';
import Skeleton from './skeleton/skeleton';
import Layout from './layout/layout';
import DateFlow from './pages/dateFlow';
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
          path: 'page',
          name: 'page',
          component: Skeleton,
          meta: { title: '页面', icon: 'tools' }
        },

        {
          path: 'dateline',
          name: 'dateline',
          component: DateFlow,
          meta: { title: 'Date Flow', icon: 'calendar' }
        },

        {
          path: 'user',
          name: 'user',
          meta: { title: '用户管理', icon: 'people' },
          component: Skeleton
        },
        {
          path: 'group',
          name: 'group',
          component: Skeleton,
          meta: { title: '团队管理', icon: 'group' }
        },
        {
          path: 'widget',
          name: 'widget',
          component: Skeleton,
          meta: { title: '组件管理', icon: 'swatch' }
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
// redirect: 'noredirect',
// children: [
//   {
//     path: 'skeleton',
//     name: 'userskeleton',
//     component: Skeleton,
//     meta: { title: '骨架', icon: 'shielding' }
//   }
// ]
