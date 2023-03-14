/*
 * @Author: wangxin
 * @Date: 2022-06-22 14:14:13
 * @LastEditors: WangXin
 * @LastEditTime: 2023-01-11 14:34:03
 * @FilePath: \code\src\lib\ui\index.js
 * @Description:
 *
 * Copyright (c) 2022 by yuxing, All Rights Reserved.
 */
// import Vue from 'vue';
import './element.js';
// import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
// Vue.use(VueVirtualScroller);
import { VXETable, Column, Icon, Table } from 'vxe-table';
VXETable.setup();
Vue.use(Icon).use(Column).use(Table);
import '@/assets/css/element-theme/index.css';
