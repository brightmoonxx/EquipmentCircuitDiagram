/*
 * @Author: WangXin
 * @Date: 2023-01-13 15:42:11
 * @LastEditors: WangXin
 * @LastEditTime: 2023-02-03 09:35:45
 * @FilePath: \code\src\request\http.js
 * @Description:
 *
 * Copyright (c) 2023 by YuXing, All Rights Reserved.
 */
/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios';
import QS from 'qs';
import { Message, Loading, MessageBox } from 'element-ui';
import router from '../router';
import store from '../store/index';
// 环境的切换

// 请求超时时间
axios.defaults.timeout = 30000; //30s请求时间

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
//请求拦截
// axios.interceptors.request.use((request) => {
//   return request;
// });

axios.interceptors.response.use(
  (response) => {
    const codeOK = 200;
    if (response.status === codeOK) {
      let url = response.request.responseURL.split('?')[0] || '';
      if ([codeOK, 0].includes(response.data.code) || (url.endsWith('.json') && !response.data.code)) {
        return response.data;
      }
      // 登录失效
      if (response.data.code === 555) {
        if (process.env.NODE_ENV === 'production') window.location.replace('/cloud/vue/index.html#/login');
      }
      return Promise.reject(response.data);
    }
    return Promise.reject(response);
  },
  (error) => {
    return Promise.reject(error);
  },
);

const http = function ({ url, method = 'POST', isParams = false, data = {}, isOpen = false, loading = true, loadingText, showMsg = true, loadingPos = null, isCheck = false }) {
  let config = {
    url,
    [`${method === 'GET' || isParams ? 'params' : 'data'}`]: data,
    method,
    headers: {
      token: ((store || '').getters || '').token || '',
    },
  };
  return new Promise((resolve, reject) => {
    if (isCheck) {
      MessageBox.prompt('请输入密码校验', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        inputType: 'password',
      })
        .then(({ value }) => {
          config.headers.protocolEditVerify = value;
          resolve(createRequest(config, loading, showMsg, loadingText, loadingPos));
        })
        .catch((err) => {
          Message.error(err);
        });
    } else {
      resolve(createRequest(config, loading, showMsg, loadingText, loadingPos));
    }
  });
};
function createRequest(config, loading, showMsg = true, loadingText, loadingPos) {
  let loadingInstance;
  if (loading) {
    loadingInstance = Loading.service({
      text: loadingText || '',
      target: loadingPos || '#app',
      spinner: 'yx-loading',
      // background: 'rgba(250,251,252, 0.7)',
      background: '#EBF0F6',
    });

    let targetDom = document.querySelector(loadingPos || '#app');
    if (targetDom && targetDom.className.indexOf('el-loading-parent--relative') < 0) {
      targetDom.className = targetDom.className + ' el-loading-parent--relative';
    }
  }
  return new Promise((resolve, reject) => {
    axios(config)
      .then(
        (response) => {
          loadingInstance && loadingInstance.close();
          resolve(response);
        },
        (response) => {
          loadingInstance && loadingInstance.close();
          if (showMsg && (typeof response.msg === 'string' || typeof response.resultMsg === 'string' || typeof response.message === 'string')) {
            (response.resultMsg || response.message || response.msg) && Message.error(response.resultMsg || response.message || response.msg);
          }
          resolve(response);
        },
      )
      .catch((error) => {
        console.log(error);
        loadingInstance && loadingInstance.close();
        showMsg && (error.msg || error.message) && Message.error(error.msg || error.message);
      });
  });
}
/*
 文件上传
 */
export function uploadFile({ url, file, loading = true, loadingText, loadingPos = null }) {
  let loadingInstance;
  if (loading) {
    loadingInstance = Loading.service({
      text: loadingText || '',
      target: loadingPos || '#app',
      // background: 'rgba(250,251,252, 0.7)',
      background: 'rgba(95,95,95,0.2)',
    });

    let targetDom = document.querySelector(loadingPos || '#app');
    if (targetDom && targetDom.className.indexOf('el-loading-parent--relative') < 0) {
      targetDom.className = targetDom.className + ' el-loading-parent--relative';
    }
  }
  const formdata = new FormData();
  const data = {
    file: file,
  };
  for (let i in data) {
    formdata.append(i, data[i]);
  }
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: url,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: formdata,
    })
      .then((res) => {
        loadingInstance && loadingInstance.close();
        resolve(res.data);
      })
      .catch((err) => {
        loadingInstance && loadingInstance.close();
        Message.error(err.resultMsg);
      });
  });
}
export default http;
