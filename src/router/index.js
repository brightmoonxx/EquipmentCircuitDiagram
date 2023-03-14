/*
 * @Author: wang_xin
 * @Date: 2022-04-28 17:37:09
 * @LastEditors: WangXin
 * @LastEditTime: 2023-03-14 16:34:33
 * @FilePath: \code\station-control-center-view\src\router\index.js
 * @Description:
 *
 * Copyright (c) 2022 by yuxing, All Rights Reserved.
 */
// import Vue from 'vue'
// import VueRouter from 'vue-router'
if (!window.VueRouter) Vue.use(Router);
const Home = () => import('@/views/Home/Home.vue');
const EquipmentManagement = () => import('@/views/EquipmentManagement/EquipmentManagement.vue');
const noPermission = [
  {
    path: '/',
    name: 'Home',
    component: EquipmentManagement,
    meta: { title: '首页' },
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登录' },
    component: () => import('@/views/Login/Login.vue'),
  },
  {
    path: '/404',
    name: '404',
    meta: { title: '404' },
    component: () => import('@/views/404/404.vue'),
  },
  {
    path: '/testProtocol',
    meta: { title: '协议测试' },
    name: 'TestProtocol',
    component: () => import('@/views/TestProtocol/TestProtocol.vue'),
  },
];
export const stationRouter = [
  {
    path: '/station',
    name: 'station',
    meta: { title: '站点列表' },
    redirect: '/station-list',
    component: Home,
    children: [
      {
        path: '/station-list',
        name: 'station-list',
        meta: { title: '站点列表' },
        component: () => import('@/views/StationManagement/StationList.vue'),
      },
    ],
  },
  {
    path: '/macro',
    name: 'Macro',
    meta: { title: '任务宏参数管理' },
    component: Home,
    redirect: '/macro-admin',
    children: [
      {
        path: '/macro-admin',
        name: 'macro-admin',
        meta: { title: '任务宏参数管理' },
        component: () => import('@/views/ParameterManagement/MacroParameterAdmin.vue'),
      },
    ],
  },
  {
    path: '/data',
    name: 'Data',
    meta: { title: '数据管理' },
    component: Home,
    redirect: '/station-controller',
    children: [
      {
        path: '/station-controller',
        name: 'StationController',
        meta: { title: '站点管理' },
        component: () => import('@/views/StationController/StationController.vue'),
      },
      {
        path: '/protocol-management',
        name: 'ProtocolManagement',
        meta: { title: '协议管理' },
        component: { render: (e) => e('router-view') },
        children: [
          {
            path: '',
            name: 'ProtocolManagement',
            meta: { title: '协议管理' },
            component: () => import('@/views/ProtocolManagement/ProtocolManagement.vue'),
          },
          {
            path: 'format',
            name: 'Format',
            meta: { title: '协议格式管理' },
            component: () => import('@/views/ProtocolManagement/Format.vue'),
          },
        ],
      },
      {
        path: '/testProtocol',
        name: 'TestProtocol',
        meta: { title: '协议测试' },
        component: () => import('@/views/TestProtocol/TestProtocol.vue'),
      },
      {
        path: '/data-log',
        name: 'Datalog',
        meta: { title: '数据日志' },
        component: () => import('@/views/Datalog/Datalog.vue'),
      },
      {
        path: '/topologyManagement',
        name: 'Topology',
        meta: { title: '拓扑图管理' },
        component: () => import('@/views/TopologyManagement/TopologyManagement.vue'),
      },
      {
        path: '/topologyTest',
        name: 'TopologyTest',
        meta: { title: '拓扑图测试' },
        component: () => import('@/views/TopologyManagement/TopologyTest.vue'),
      },
    ],
  },
];

export const permission = [
  {
    path: '/plan',
    name: 'plan',
    meta: { title: '计划管理' },
    redirect: '/station-plan',
    component: () => import('@/views/Home/Home.vue'),
    children: [
      {
        path: '/station-plan',
        name: 'StationPlan',
        meta: { title: '站点计划' },
        component: () => import('@/views/PlanManagement/StationPlan.vue'),
      },
      // {
      //   path: '/optional-plan',
      //   name: 'OptionalPlan',
      //   meta: { title: '自选计划' },
      //   component: () => import('@/views/PlanManagement/OptionalPlan.vue'),
      // },
    ],
  },
  {
    path: '/equipment',
    name: 'equipment',
    meta: { title: '设备管理' },
    component: () => import('@/views/Home/Home.vue'),
    redirect: '/equipment-admin',
    children: [
      {
        path: '/equipment-admin',
        name: 'equipment',
        meta: { title: '设备管理' },
        component: () => import('@/views/EquipmentManagement/EquipmentManagement.vue'),
      },
    ],
  },
  {
    path: '/acu',
    name: 'ACU',
    meta: { title: 'ACU操作' },
    component: () => import('@/views/Home/Home.vue'),
    redirect: '/acu',
    children: [
      {
        path: '/acu',
        name: 'ACU',
        meta: { title: 'ACU' },
        component: () => import('@/views/ACU/ACU.vue'),
      },
    ],
  },
  {
    path: '/data-analysis',
    name: 'DataAnalysis',
    meta: { title: '数据分析及管理' },
    redirect: '/data-monitoring',
    component: () => import('@/views/Home/Home.vue'),
    children: [
      {
        path: '/data-monitoring',
        name: 'DataMonitoring',
        meta: { title: '数据监测' },
        component: () => import('@/views/DataAnalysis/DataMonitoring/index.vue'),
      },
      // {
      //   path: '/task-macro-parameters',
      //   name: 'TaskMacroParameters',
      //   meta: { title: '任务宏参数' },
      //   component: () => import('@/views/DataAnalysis/TaskMacroParameters.vue'),
      // },
    ],
  },
];
const routes = noPermission;
const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const chunkLoadFailed = error.message.match(pattern);
  if (chunkLoadFailed) {
    window.location.reload();
  } else {
    console.log(error);
  }
});
export default router;
