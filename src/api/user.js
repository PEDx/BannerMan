import request from '../request';

export function reqGetUserByName(username) {
  return request({
    url: `/api/articulation/queryAuditList`,
    method: 'get',
    params: {
      username
    }
  });
}
export function reqCreateUser(option) {
  return request({
    url: `/api/articulation/queryAuditList`,
    method: 'post',
    data: option
  });
}
export function reqUpdateUser(option) {
  return request({
    url: `/api/articulation/queryAuditList`,
    method: 'put',
    data: option
  });
}
