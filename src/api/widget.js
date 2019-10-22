import request from '../request';

export function reqGetUserByName() {
  return request({
    url: `http://npm.bannerman.club/-/verdaccio/packages`,
    method: 'get'
  });
}
