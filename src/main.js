/*
 * @Author: wang_xin
 * @Date: 2022-05-16 10:55:05
 * @LastEditors: WangXin
 * @LastEditTime: 2023-02-13 11:55:03
 * @FilePath: \code\src\main.js
 * @Description:
 *
 * Copyright (c) 2022 by yuxing, All Rights Reserved.
 */
// import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './router/router-config';
import store from './store/index.js';
import * as api from './request/api.js'; // 导入api接口
import http from './request/http.js';
import { themeColor } from './theme';
import MetaInfo from 'vue-meta-info';
Vue.use(MetaInfo);
import directives from './directives';
Vue.use(directives);
// import websocket from './utils/websocket';
const theme = new themeColor();
theme.install();
Vue.prototype.$store = store;
Vue.config.productionTip = false;
Vue.prototype.http = http;
// Vue.prototype.$websocket = websocket;
import './lib/ui';
import '../src/assets/css/common.css';
import '../src/assets/css/font.css';
import '../src/assets/css/iconfont.scss';
// import 'default-passive-events';

if (process.env.NODE_ENV == 'development') {
  Vue.config.devtools = true;
} else {
  Vue.config.devtools = false;
}

Vue.prototype.$api = api;
import '@/icons';
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
