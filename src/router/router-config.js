/*
 * @Author: WangXin
 * @Date: 2022-10-14 10:52:18
 * @LastEditors: WangXin
 * @LastEditTime: 2023-03-14 20:53:26
 * @FilePath: \设备拓扑图\src\router\router-config.js
 * @Description:
 *
 * Copyright (c) 2022 by YuXing, All Rights Reserved.
 */
import router from './index';
import store from '@/store';
import { stationRouter, permission } from './index';
import NProgress, { set } from 'nprogress';
import 'nprogress/nprogress.css';
const filterRoutes = ['/login', '/404'];
import { Message, Loading } from 'element-ui';
NProgress.configure({ showSpinner: false });
let IS_LOGIN = false;
import { login, selectUserInfoByToken } from '../request/api';
const userStationRouter = [];
const userPermission = [];
//操作者 path 1
//观察者 path 2
async function autoLogin() {
  const params = {
    account: 'wangxin@asathd.com',
    // account: '10300915575@qq.com',
    // account:'qiaoxin@asathd.com',
    // account: 'sunhao@asathd.com',
    // account: 'zhangdinghui@asathd.com',
    password: 'yuxing123',
    // password: 'ds128226',
    type: '1',
  };
  IS_LOGIN = true;
  const loadingInstance = Loading.service({
    text: '',
    target: '#app',
    // background: 'rgba(250,251,252, 0.7)',
    background: 'rgba(95,95,95,0.7)',
  });
  const { data } = await login(params);
  loadingInstance.close();
  if (data) {
    store.commit('setToken', data.token);
    sessionStorage.setItem('token', data.token);
    getUserInfoByToken();
  }
}

async function getUserInfoByToken() {
  try {
    const { data } = await selectUserInfoByToken({ token: sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '' });
    if (data) {
      const route = permissionHandle(data.servicePower);
      if (route.length == 0) {
        Message.error('此账号暂无权限访问');
        sessionStorage.removeItem('token');
        setTimeout(() => {
          window.location.replace(`${window.location.origin}/cloud/vue/index.html#/login`);
        }, 100);
      } else {
        const stationList = route[0].children.filter((item) => item.pathName == '站点列表')[0].children ?? [];
        store.commit('setUserStationList', stationList);
        store.commit('setUserInfo', data.userInfo);
        asyncRoutes(route);
      }
    } else {
      goToLogin();
    }
    //根据用户权限动态设置permission//默认都有
  } catch (error) {
    goToLogin();
  }
}
// getUserInfoByToken();
router.beforeEach(async (to, from, next) => {
  const token = store.getters.token;
  NProgress.start();
  if (token) {
    if (to.path === '/login') return next({ path: '/' });
    setNavList(to.path, permission);

    // 访问路径不存在跳转404
    next();
  } else {
    // goToLogin();
    setNavList(to.path, permission);
    if (filterRoutes.indexOf(to.path) !== -1) return next();
  }
  return next();
});
router.afterEach(() => {
  NProgress.done();
});

function setNavList(path, permission) {
  if (findPathByRouter(path, permission)) {
    store.commit('setUserPosition', 'inside');
    store.commit('setNavList', permission);
  } else {
    store.commit('setUserPosition', 'outside');
    store.commit('setNavList', userStationRouter);
  }
}
function goToLogin() {
  sessionStorage.removeItem('token');
  if (process.env.NODE_ENV === 'development') {
    if (IS_LOGIN) return;
    Message.warning('登录失效，开发环境开启自动登录');
    autoLogin();
  } else {
    Message.warning('登录失效，请重新登录');
    setTimeout(() => {
      window.location.replace(`${window.location.origin}/cloud/vue/index.html#/login`);
    }, 100);
  }
}
function findRouter(path, data, isExist = false) {
  if (isExist) return true;
  if (!isExist) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].path !== path && data[i].children) {
        findRouter(path, data[i].children, false);
      }
      if (data[i].path == path) return findRouter(path, data[i].children, true);
    }
  }
}

function findPathByRouter(path, data) {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].children.length; j++) {
      if (data[i].path === path || data[i].children[j].path === path) {
        return true;
      }
    }
  }
  return false;
}
function asyncRoutes(data) {
  const userPower = data[0].children;
  userPower.forEach((item) => {
    const result = stationRouter.filter((route) => route.redirect == item.path.replace(' ', ''));
    if (result.length > 0) {
      userStationRouter.push(result[0]);
    }
  });
  if (process.env.NODE_ENV !== 'development') {
    //删除拓扑图模块
    userStationRouter[2].children.splice(4, userStationRouter[2].children.length - 1);
  }
  router.addRoutes(userStationRouter);
  router.addRoutes(permission);
}

function permissionHandle(data) {
  const result = [];
  const object = {};
  data.forEach((item) => (object[item.id] = item));
  delete object['32'];
  delete object['33'];
  data.forEach((item) => {
    if (item.parentId in object) {
      const parent = object[item.parentId];
      parent.children = parent.children || [];
      parent.children.push(item);
    } else {
      if (item.pathName == '新版站控') {
        result.push(item);
      }
    }
  });
  return result;
}
