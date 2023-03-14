/*
 * @Author: wangxin
 * @Date: 2022-06-22 13:56:49
 * @LastEditors: WangXin
 * @LastEditTime: 2023-02-02 14:13:17
 * @FilePath: \code\src\store\index.js
 * @Description:
 *
 * Copyright (c) 2022 by yuxing, All Rights Reserved.
 */
import Vuex from 'vuex';
import { deepCopy, swap } from '@/utils/utils';
import toast from '@/utils/toast.js';
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    token: window.sessionStorage.getItem('token'),
    userId: '',
    roleId: '',
    userInfo: {},
    navList: [],
    userStationList: [],
    userPosition: 'outside',
  },
  getters: {
    token(state) {
      return state.token;
    },
    userId(state) {
      return state.userId;
    },
  },
  mutations: {
    setNavList(state, list) {
      state.navList = list;
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    setUserPosition(state, type) {
      state.userPosition = type;
    },
    setUserStationList(state, list) {
      state.userStationList = list;
    },
    setToken(state, token) {
      state.token = token;
    },
    setNoticeInfo(state, info) {
      state.noticeInfo = info;
    },
  },
  actions: {},
});
