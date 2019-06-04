import widgetSearchProfile from './widget-search/profile';

export default {
  'widget-search': {
    component: () => import('./widget-search/index'),
    profile: widgetSearchProfile
  }
};
