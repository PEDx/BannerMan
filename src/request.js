import axios from 'axios';
import { Message, MessageBox } from 'element-ui';

// 创建axios实例
const service = axios.create({
  baseURL: 'http://192.168.27.234:6060/', // api 的 base_url
  timeout: 5000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;

    if (res.code !== 0) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      });
      if (res.code === 4001) {
        MessageBox.confirm('你已被登出，请重新登录.', '提示', {
          confirmButtonText: '重新登录',
          showCancelButton: false,
          closeOnPressEscape: false,
          closeOnHashChange: false,
          showClose: false,
          closeOnClickModal: false,
          type: 'warning'
        })
          .then(() => {
            location.reload();
          })
          .catch(() => {});
      }
      return Promise.reject(res || 'Error');
    } else {
      return response.data;
    }
  },
  error => {
    console.log('err' + error); // for debug
    Message({
      message: '5秒连接超时,请重试',
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
