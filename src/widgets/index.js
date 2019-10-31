export default {
  'widget-search': () => import('./widget-search/index'),
  'widget-example': () => import('./widget-example/index'),
  'widget-container': () => import('./widget-container/index'),
  'widget-tabs': () => import('./widget-tabs/index'),
  'widget-button': () => import('./widget-button/index')
};
// widget 是编辑器可插拔的一个模块,有版本管理,可以由编辑器决定获取什么版本
