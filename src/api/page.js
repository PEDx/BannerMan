/* eslint-disable comma-dangle */
import request from '../request';

export function reqGetPageById(id) {
  return request({
    url: `/api/v1/page/${id}`,
    method: 'get',
  });
}
export function reqCreatePage(data) {
  return request({
    url: `/api/articulation/queryAuditList`,
    method: 'post',
    data: data,
  });
}
export function reqUpdatePage(id, data) {
  return request({
    url: `/api/v1/page/${id}`,
    method: 'put',
    data: { data },
  });
}
// 获取最新组件版本信息
export function reqGetWidgetList() {
  return request({
    url: `/api/v1/widgetList`,
    method: 'get',
  });
}
// 构建页面
export function reqBuildPage(id) {
  return request({
    url: `/api/v1/build/${id}`,
    method: 'get',
  });
}
// 获取页面挂件当前版本
export function reqPageWidgetsVersion(id) {
  return request({
    url: `/api/v1/pageWidgetsVersion/${id}`,
    method: 'get',
  });
}
// 升级页面挂件版本
export function reqUpdateWidgetVersion(data) {
  return request({
    url: `/api/v1/updateWidgetVersion`,
    method: 'post',
    data,
  });
}
