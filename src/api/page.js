import request from '../request';

export function reqGetPageById(id) {
  return request({
    url: `/api/v1/page/${id}`,
    method: 'get'
  });
}
export function reqCreatePage(data) {
  return request({
    url: `/api/articulation/queryAuditList`,
    method: 'post',
    data: data
  });
}
export function reqUpdatePage(id, data) {
  return request({
    url: `/api/v1/page/${id}`,
    method: 'put',
    data: { data }
  });
}
