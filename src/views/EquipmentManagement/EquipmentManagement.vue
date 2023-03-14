<!--
 * @Author: WangXin
 * @Date: 2022-10-10 15:58:19
 * @LastEditors: WangXin
 * @LastEditTime: 2023-03-14 23:04:32
 * @FilePath: \设备拓扑图\src\views\EquipmentManagement\EquipmentManagement.vue
 * @Description:
 *
 * Copyright (c) 2022 by YuXing, All Rights Reserved.
-->
<template>
  <div class="wd-100 equipment-container" v-loading="loading" element-loading-text="指令下发中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <div class="position-relative" :style="{ width: 1920 * scale + 'px', height: 700 * scale + 'px' }">
      <div class="svg flex topology-container" :style="{ transform: `scale(${scale})` }">
        <div class="wd-100 hg-100 position-relative" style="transform: scale(1)">
          <div v-for="item in topologyElement" :key="item.id" class="element-wrap" :name="item?.equipment_name" :element-id="item.id">
            <div class="element" v-if="item.type == 'round_rect'" :style="getElementStyle(item.style)" @click="equipmentHandle(item)">
              <div class="round-rect-text">{{ item.text }}</div>
            </div>
            <div class="element" style="z-index: 1" v-else-if="item.type == 'arrow'" :style="[getElementStyle(item.style), getArrowStyle(item)]">
              <svg :stroke="getElementColor(item)" :fill="getElementColor(item)" class="svg-line">
                <g transform="scale(2.008) translate(0, 0.5) ">
                  <line x1="1.5" :x2="item.style.width" stroke-linecap="round" style="stroke-width: 2; fill: none" />
                  <path :transform="item.style.transform" fill="inherit" stroke-linecap="round" stroke-linejoin="round" d="M 4,-3,-0.5,0,4,3 Z" />
                </g>
              </svg>
            </div>
            <div v-else-if="item.type == 'round_rect_mini'" class="element" :style="[getElementStyle(item.style), getBallRectStyle(item)]">{{ item.text }}</div>
            <div v-else-if="item.type == 'rect-mini'" class="element" :style="getElementStyle(item.style)">
              <div class="round-rect-text">{{ item.text }}</div>
            </div>
            <div v-else-if="item.type == 'ball-mini'" class="element" @click="changeBall(item)" :style="[getElementStyle(item.style), getBallStyle(item)]" style="transform: rotate(180deg)">
              <svg :stroke="item.style.color" fill="#fff" class="svg-line">
                <g :transform="item.style.transform">
                  <circle r="6" :cx="item.circle_cx" :cy="item.circle_cy" fill="#FFBB00" stroke="#fff" style="stroke-width: 1" />
                  <!-- 右旋 -->
                  <path d="M 0 4.5 Q 5 5 ,5 10" fill="none" style="stroke-width: 2" :stroke="getBallRightStyle(item)" />
                  <!-- 左旋 -->
                  <path d="M 5 0 Q 5 5,10 5" fill="none" style="stroke-width: 2" :stroke="getBallLeftStyle(item)" />
                  <!-- <path d="M 6 10 q 0 -5 -6 -5" fill="none" /> -->
                </g>
              </svg>
            </div>
            <div v-else-if="item.type == 'line-straight'" class="element" :style="[getElementStyle(item.style), getElementLineColor(item)]">
              <svg :stroke="getElementColor(item)" :fill="getElementColor(item)" class="svg-line">
                <g transform="scale(2.008) translate(0, 0.5)" style="transform-origin: 0px 0px">
                  <path v-if="item.isArc" :d="item.line_points" style="stroke-width: 2; fill: none" />
                  <polyline v-else :points="item.line_points" style="stroke-width: 2; fill: none" />
                  <path
                    :style="{ opacity: item.line_start == 'arrow' ? 1 : 0 }"
                    fill="inherit"
                    :transform="item.line_start_arrow_transform"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M 4,-3,-0.5,0,4,3 Z"
                  />
                  <path :style="{ opacity: item?.no_arrow ? 0 : 1 }" fill="inherit" stroke-linecap="round" :transform="item.arrow_transform" stroke-linejoin="round" d="M 4,-3,-0.5,0,4,3 Z" />
                  <!-- 动画 -->
                  <circle v-if="item.status == 'NORMAL'" r="1.5" cx="0" cy="0" :fill="item.s_fed ? '#07d022' : '#07d022'" :stroke="item.s_fed ? '#07d022' : '#07d022'">
                    ''
                    <animateMotion
                      dur="5s"
                      :path="`${item.isArc ? '' : 'M'}${item?.animateStartRight ? item.line_points.split(',').reverse().join(',') : item.line_points}`"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              </svg>
            </div>
            <div
              v-else-if="item.type == 'equipment'"
              class="element equipment flex-center"
              @click="equipmentHandle(item)"
              :class="getElementStatus(item)"
              :style="[getElementStyle(item.style), getEquipmentBackground(item.status)]"
            >
              <div class="hg-100 flex flex-direction-column justify-center" v-if="item.equipment_name == '防火墙/交换机' || item.equipment_name == '存储转发'">
                <div class="flex-center">
                  <img src="../../assets/images/equipment-admin/biankuang.png" alt="" />
                  <img v-if="item.equipment_name == '防火墙/交换机'" class="position-absolute" src="../../assets/images/equipment-admin/fhq.png" alt="" />
                  <img v-if="item.equipment_name == '存储转发'" class="position-absolute" src="../../assets/images/equipment-admin/cczf.png" alt="" />
                </div>
                <div class="equipment-title text-center mg-top-10">
                  <!-- <img src="" alt="" style="width: 14px; height: 14px" /> -->
                  <span>{{ item.equipment_name }}</span>
                </div>
              </div>
              <div v-else class="wd-100">
                <div class="flex align-items-center justify-between" style="min-height: 25px">
                  <div class="equipment-title">
                    <yx-icon :name="item.equipment_icon" class="mg-x-5" style="width: 14px; height: 14px"></yx-icon>
                    <span>{{ item.equipment_name }}</span>
                  </div>
                  <span v-if="item.status" class="equipment-status" :style="{ background: equipmentStatus[item.status] }"></span>
                </div>
                <div class="flex equipment-wrap flex-wrap" v-if="item.status !== 'OFF_LINE'" style="max-height: 86px; overflow-y: scroll">
                  <div :style="item.equipment_style" v-for="equipment in item.device?.bodyList" :key="equipment.id" class="equipment-details wd-100 ellipsis1">
                    <div
                      v-if="equipment.selectConfig && showSelectConfigStatus(equipment.selectConfig)"
                      class="flex align-items-center"
                      :class="getEquipmentSuccess(equipment.value, equipment.selectConfig) ? 'equipment-status-success' : 'equipment-status-error'"
                    >
                      {{ equipment.paramName }}:{{ getEquipmentValue(equipment.value, equipment.selectConfig) }}
                    </div>
                    <span class="pd-x-10" :title="getEquipmentValue(equipment.value, equipment.selectConfig) + '' + equipment.valueUnit" v-else>
                      {{ equipment.paramName }}:{{ getEquipmentValue(equipment.value, equipment.selectConfig) }}{{ equipment.valueUnit }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="item.type == 'img'" class="element img" :style="getElementStyle(item.style)">
              <img src="../../assets/images/equipment-admin/tianxian.png" alt="" class="wd-100 hg-100" />
              <!-- <img :src="item.url" alt="" class="wd-100 hg-100" /> -->
            </div>
          </div>
          <div class="topology-tips">
            <div class="flex align-items-center">
              <span class="equipment-status mg-right-10" :style="{ background: equipmentStatus['NORMAL'] }"></span>
              设备正常
            </div>
            <div class="flex align-items-center">
              <span class="equipment-status mg-right-10" :style="{ background: equipmentStatus['WARN'] }"></span>
              设备异常
            </div>
            <div class="flex align-items-center">
              <span class="equipment-status mg-right-10" :style="{ background: equipmentStatus['OFF_LINE'] }"></span>
              设备离线
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Dialog from '@/components/common/CommonDialog';
import Ws from '../../utils/socket';
import baseUrl from '../../request/baseUrl';
import { data } from './data';
import axios from 'axios';
const status = [
  { deviceId: '26FF0101', deviceName: '信道插箱', deviceStatus: 'NORMAL' },
  { deviceId: '26120101', deviceName: '高速数传基带', deviceStatus: 'NORMAL' },
  { deviceId: '26030107', deviceName: 'X下变频器-数传左', deviceStatus: 'NORMAL' },
  { deviceId: '26030108', deviceName: 'X下变频器-数传右', deviceStatus: 'NORMAL' },
  { deviceId: '26030103', deviceName: 'S下变频器-左旋', deviceStatus: 'NORMAL' },
  { deviceId: '26030102', deviceName: 'S下变频器-右旋', deviceStatus: 'NORMAL' },
  { deviceId: '260C0102', deviceName: 'X合成网络', deviceStatus: 'NORMAL' },
  { deviceId: '26020101', deviceName: '综合基带(测控)', deviceStatus: 'NORMAL' },
  { deviceId: '26020102', deviceName: '综合基带(中低速)', deviceStatus: 'NORMAL' },
  { deviceId: '26070101', deviceName: 'S-BUC', deviceStatus: 'NORMAL' },
  { deviceId: '26070102', deviceName: 'X-BUC', deviceStatus: 'NORMAL' },
  { deviceId: '26030106', deviceName: 'X下变频器-遥测', deviceStatus: 'NORMAL' },
  { deviceId: '260C0101', deviceName: 'S合成网络-左旋', deviceStatus: 'NORMAL' },
  { deviceId: '260C0103', deviceName: 'S合成网络-右旋', deviceStatus: 'NORMAL' },
  { deviceId: '260D0101', deviceName: '天线控制', deviceStatus: 'NORMAL' },
  { deviceId: '26080101', deviceName: '中频矩阵', deviceStatus: 'NORMAL' },
  { deviceId: '260F0101', deviceName: '跟踪接收机', deviceStatus: 'NORMAL' },
  { deviceId: '260F0102', deviceName: '跟踪接收机-2', deviceStatus: 'NORMAL' },
  { deviceId: '26080101XSBPQ', deviceName: 'X上变频器', deviceStatus: 'NORMAL' },
  { deviceId: '26080101XSCSBPQ', deviceName: '数传测试变频器', deviceStatus: 'NORMAL' },
];
const params = [
  {
    deviceId: '26FF0101',
    deviceName: '信道插箱',
    deviceAlias: 'CPB',
    keyValues: [
      {
        key: '2487',
        value: '10',
        name: 'CPB_JX_5',
        valueMemo: '右旋',
        success: false,
        early: false,
      },
      {
        key: '2488',
        value: '10',
        name: 'CPB_JX_6',
        valueMemo: '右旋',
        success: false,
        early: false,
      },
    ],
  },
  {
    deviceId: '260D0101',
    deviceName: ' 天线控制',
    deviceAlias: 'ACU',
    keyValues: [
      {
        key: '14204',
        value: '0',
        name: 'ACU_JX_S_1',
        valueMemo: '无效',
        success: false,
        early: false,
      },
      {
        key: '14205',
        value: '0',
        name: 'ACU_JX_S_2',
        valueMemo: '无效',
        success: false,
        early: false,
      },
      {
        key: '14206',
        value: '0',
        name: 'ACU_JX_S_3',
        valueMemo: '右旋',
        success: false,
        early: false,
      },
      {
        key: '14207',
        value: '0',
        name: 'ACU_JX_S_4',
        valueMemo: '无效',
        success: false,
        early: false,
      },
      {
        key: '14134',
        value: '0',
        name: 'ACU_JX_X_1',
        valueMemo: '无效',
        success: false,
        early: false,
      },
      {
        key: '14135',
        value: '2',
        name: 'ACU_JX_X_2',
        valueMemo: '右旋',
        success: false,
        early: false,
      },
      {
        key: '14136',
        value: '2',
        name: 'ACU_JX_X_3',
        valueMemo: '右旋',
        success: false,
        early: false,
      },
      {
        key: '14136',
        value: '2',
        name: 'ACU_JX_X_74',
        valueMemo: '右旋',
        success: false,
        early: false,
      },
      {
        key: '14136',
        value: '1',
        name: 'ACU_JX_X_90',
        valueMemo: '右旋',
        success: false,
        early: false,
      },
      {
        key: '14136',
        value: '1',
        name: 'ACU_JX_X_95',
        valueMemo: '右旋',
        success: false,
        early: false,
      },
      {
        key: '14136',
        value: '1',
        name: 'ACU_JX_X_131',
        valueMemo: '右旋',
        success: false,
        early: false,
      },
      {
        key: '14136',
        value: '1',
        name: 'ACU_JX_X_137',
        valueMemo: '右旋',
        success: false,
        early: false,
      },
      {
        key: '14136',
        value: '1',
        name: 'ACU_JX_X_141',
        valueMemo: '右旋',
        success: false,
        early: false,
      },
      {
        key: '14136',
        value: '1',
        name: 'ACU_JX_X_148',
        valueMemo: '右旋',
        success: false,
        early: false,
      },
      {
        key: '14136',
        value: '1',
        name: 'ACU_JX_X_154',
        valueMemo: '右旋',
        success: false,
        early: false,
      },
      {
        key: '14136',
        value: '1',
        name: 'ACU_JX_X_158',
        valueMemo: '右旋',
        success: false,
        early: false,
      },
      {
        key: '14137',
        value: '0',
        name: 'ACU_JX_X_4',
        valueMemo: '无效',
        success: false,
        early: false,
      },
    ],
  },
];
// import { topologyData } from './equipment-SW';
import { topologyData } from './equipment-ML';
let ws = null;
let log_ws = null;
let status_ws = null;
let devices_ws = null;
const equipmentObject = {}; //备份数据
let topology = {};
export default {
  components: { Dialog },
  metaInfo() {
    return {
      title: this.pageName,
    };
  },
  data() {
    return {
      loading: false,
      loading2: false,
      maxHeight: document.body.clientHeight * 0.6,
      style: {
        x: 150,
        y: 50,
      },
      scale: 1,
      showDialog: false,
      dialogNav: [
        { label: '状态参数', key: 'monitorUnits', show: true },
        { label: '参数设置', key: 'paramSettingUnits', show: sessionStorage.getItem('userStationPower') == '1' ? true : false },
        { label: '设备指令', key: 'instructUnit', show: true },
      ],
      dialogNavIndex: 0,
      activeDialogNavKey: 'monitorUnits',
      asideIndex: 0,
      equipmentDetails: {},
      equipmentStatus: {
        NORMAL: '#07D022',
        WARN: '#FF3A6F',
        OFF_LINE: '#4B4F55',
      },
      equipmentBackground: {
        NORMAL: {
          background: '#F9FBFC',
          border: '1px solid #C3C9D2',
        },
        WARN: {
          background: '#F9FBFC',
          border: '1px solid #FF3A6F',
        },
        OFF_LINE: {
          background: '#D6D8D9',
          border: '1px solid #fff',
        },
      },
      widgetStatus: {
        OFF_LINE: () => '#A2B2C5', //离线
        WARN: () => '#FF3A6F',
        NORMAL: (s_fed) => (s_fed ? '#07D0D0' : '#3474E4'), //X频段馈源
      },
      topologyElement: null,
      equipmentList: [
        { label: '转存设备', device: '', icon: 'zhuancun', background: '#E3E9F0', color: '#b2b3b5', fillColor: '#fff' },
        // { img: require('../../assets/images/equipment-admin/pdu.png'), label: 'PDU' },
        { label: 'UPS', device: '', icon: 'ups', background: '#E3E9F0', color: '#b2b3b5', fillColor: '#fff' },
        { label: '交换机', device: '', icon: 'jhj', background: '#E3E9F0', color: '#b2b3b5', fillColor: '#fff' },
        { label: '气象仪', device: '', icon: 'qxy', background: '#E3E9F0', color: '#b2b3b5', fillColor: '#fff' },
        { label: '时统设备', device: '', icon: 'shitongshebei', background: '#E3E9F0', color: '#b2b3b5', fillColor: '#fff' },
      ],
      deviceInfo: {},
      filterElement: [22, 23, 24, 25, 78, 79, 80, 81, 82, 98, 99, 100],
      tableHead: [
        { label: '序号', key: '', type: 'index', width: 100 },
        { label: '设备名称', key: 'deviceName', width: 180 },
        { label: '时间', key: 'day', width: 180 },
        { label: '类型', key: 'unitType', width: 180 },
        { label: '日志内容', key: 'log', width: '' },
      ],
      dataType: {
        PARAM_SETTING: '参数设置',
        RESPONSE: '设备响应',
        INSTRUCT: '指令下发',
      },
      logData: [],
      enable: sessionStorage.getItem('userStationPower') == '1' ? true : false,
      first: false,
    };
  },
  computed: {
    showSelectConfigStatus() {
      return (item) => {
        return item.some((item) => item.success);
      };
    },
    getEquipmentSuccess() {
      return (value, selectConfig) => {
        return selectConfig.filter((item) => item.key == value)[0]?.success;
      };
    },
    pageName() {
      return `${this.$route.query.name} - ${this.$route.meta.title}`;
    },
    getAsideIndex() {
      return (ifSet) => {
        const asideList = this.deviceInfo?.[this.activeDialogNavKey];
        // const result = ifSet ? asideList?.[this.asideIndex]?.bodyList?.filter((item) => item.ifSet == 1) : asideList?.[this.asideIndex]?.bodyList;
        return asideList?.[this.asideIndex]?.bodyList?.filter((item) => item.ifSet == 1);
      };
    },
    getMonitorData() {
      const asideList = JSON.parse(JSON.stringify(this.deviceInfo?.[this.activeDialogNavKey]));
      return asideList?.[this.asideIndex]?.bodyList;
    },
    getElementStyle() {
      return (style) => {
        const result = { ...style };
        if (result.width) result.width += 'px';
        if (result.height) result.height += 'px';
        if (result.top || result.left) {
          result.transform = `translate(${result.left}px,${result.top}px) rotate(${result.rotate ?? 0}deg)`;
        }
        if (result.borderRadius) result.borderRadius = result.borderRadius.join('px ') + 'px';
        return result;
      };
    },
    getElementLineColor() {
      return (item) => {
        return { zIndex: item.status == 0 ? 0 : 1 };
      };
    },
    getElementStatus() {
      return (item) => {
        return !item.device?.deviceId && !this.filterElement.includes(item.id) ? 'no-equipment' : '';
      };
    },
    getElementColor() {
      return (item) => {
        return item.status ? this.widgetStatus[item.status](item.s_fed ? true : false) : '';
        // return item.status == 0 ? 'var(--yx-line-default)' : 'var(--yx-line-active)';
      };
    },
    getEquipmentBackground() {
      return (status) => {
        return this.equipmentBackground[status];
        // return status == 2 ? { background: `${this.equipmentStatus[status]}` } : '';
      };
    },
    getBallLeftStyle() {
      return (item) => {
        if (item.status == 'OFF_LINE') return;
        if (item.device?.value == item.direction.left) return item.s_fed ? '#07D0D0' : 'rgb(52, 116, 228)';
      };
    },
    getBallRightStyle() {
      return (item) => {
        if (item.status == 'OFF_LINE') return;
        if (item.device?.value == item.direction.right) return item.s_fed ? '#07D0D0' : 'rgb(52, 116, 228)';
      };
    },
    getBallRectStyle() {
      return (item) => {
        if (item.status == 'NORMAL') {
          return { color: '#fff', background: item.s_fed ? 'linear-gradient(90deg, #07D0D0 0%, rgba(7,208,208,0) 100%)' : 'linear-gradient(90deg, #0069FF 0%, rgba(0,105,255,0) 100%)' };
        }

        if (item.status == 'OFF_LINE') return { color: '#C3C9D2', background: '#F1F4F7' };
      };
    },
    getArrowStyle() {
      return (item) => {
        if (item.status == 'NORMAL') return { color: 'var(--yx-font-4)' };
        if (item.status == 'OFF_LINE') return { color: 'var(--yx-line-active)' };
      };
    },
    getBallStyle() {
      return (item) => {
        if (item.device?.value == item.direction.left) return { transform: `translate(${item.style.left}px,${item.style.top}px) rotate(${item.rotate ? item.rotate.left : 0}deg)` };
        if (item.device?.value == item.direction.right) return { transform: `translate(${item.style.left}px,${item.style.top}px) rotate(${item.rotate ? item.rotate.right : 270}deg)` };
      };
    },
    getMonitorValue() {
      return (item) => {
        return item.selectConfig && item.selectConfig.length > 0 ? item.selectConfig.filter((item2) => item2.key == item.value)[0]?.value : item.value;
      };
    },
  },
  watch: {
    showDialog(val) {
      this.first = !val;
      if (!val) {
        devices_ws.destroy();
        devices_ws = null;
      }
    },
  },
  created() {
    this.getStationInfo();
    if (this.$route.query.stationId == '02100101') this.filterElement.push(31); //三亚拓扑图L上下变频器只显示在线 不显示详情
  },
  mounted() {
    this.scale = document.body.clientWidth / 1920;
    this.enable = sessionStorage.getItem('userStationPower') == '1' ? true : false;
    window.addEventListener('resize', () => {
      this.scale = document.body.clientWidth / 1920;
    });
    // this.getStationInfo();
  },
  methods: {
    async getPlotData(url) {},
    async getStationInfo() {
      topology = topologyData;
      this.topologyElement = topology.element;
      this.initStatus(data);
      this.timedExecution();
      this.asyncParams();
    },
    timedExecution() {
      this._timer = setTimeout(() => {
        const index = Math.floor(Math.random() * status.length);
        const data = status[index];
        this.setEquipmentStatusByDeviceId(data);
        this._timer && clearTimeout(this._timer);
        this.timedExecution();
      }, 1000);
    },
    asyncParams() {
      this._timer2 = setTimeout(() => {
        params.forEach((item) => {
          this.setEquipmentParamsByDeviceId(item);
        });
        this._timer2 && clearTimeout(this._timer2);
        this.asyncParams();
      }, 1000);
    },
    getEquipmentValue(value, selectConfig) {
      if (selectConfig && selectConfig.length > 0) {
        const result = selectConfig?.filter((item) => item.key === value);

        return result?.length > 0 ? result[0].value : '';
      } else {
        return value;
      }
    },
    /**
     * @description: 控制极化开关
     * @return {*}
     */
    channelJackHandle(data) {
      const ballList = this.getPolarityDevice();

      let close_line = [];
      data.forEach((item) => {
        if (item.name) {
          const element = ballList.filter((ball) => ball.paramKey == item.name)[0];
          if (element) {
            element.device.value = item?.value;
            //计算本次推送数据中极化开关关联的所有线中需要处理为离线的线条

            //计算需要关闭的key值 当前为左旋则关闭右旋链路 反之则关闭左旋链路
            if (item?.value == element.direction.left || item?.value == element.direction.right) {
              const key = item?.value == element.direction.left ? element.direction.right : element.direction.left;
              const line = element.polarity[key];
              close_line = [...close_line, ...line];
            }
          }
        }
      });

      if (close_line.length > 0) {
        Array.from(new Set(close_line)).forEach((item) => {
          const element = this.getElementById(item);
          element.status = 'OFF_LINE';
        });
      }
      // value不是左旋或者右旋时 同步极化状态为离线
      ballList.forEach((item) => this.controlBall({ paramKey: item.paramKey, value: item.device.value }));
    },
    /**
     * @description: 通过信道插箱状态设置计划开关状态
     * @return {*}
     */
    asyncBallByChannelInsertedBox(status) {
      this.topologyElement[0].deviceStatus = status;
      const ballList = this.topologyElement.filter((item) => item.type == 'ball-mini');
      ballList.forEach((item) => {
        item.status = status;
        status !== 'NORMAL' ? this.initBall(item, 'OFF_LINE') : '';
      });
    },
    /**
     * @description: 实时同步弹窗数据状态
     * @return {*}
     */
    asyncDialogDeviceData(e) {
      if (e.deviceId == this.deviceInfo.deviceId) {
        this.controlDialogNav(false);
        this.dialogNav.forEach((item) => {
          let list = this.deviceInfo[item.key];
          //过滤多余的数据
          if (e?.patternUuid) {
            list = list.filter((item) => item.patternUuid == e.patternUuid);
            if (list.length > 0) {
              this.deviceInfo[item.key] = list;
            }
          }
          list?.forEach((item2) => {
            if (item2.bodyList.length > 0) {
              item2.bodyList.forEach((item3) => {
                const result = e.keyValues.filter((params) => params.key == item3.id);
                if (item.key == 'paramSettingUnits' && item3.selectConfig) {
                } else {
                  item3.value = result.length > 0 ? result[0].value : item3.value;
                }
              });
            }
          });
        });
      }
    },
    /**
     * @description: 同步设备状态
     * @param {*} data
     * @return {*}
     */
    setEquipmentStatusByDeviceId(data) {
      if (data.deviceName == '信道插箱') {
        // this.asyncBallByChannelInsertedBox(data.deviceStatus);
      } else if (data.deviceName == '中频矩阵') {
        const M = this.getElementById(topology?.matrix['70M']); //70M中频矩阵
        if (M) {
          M.status = data.deviceStatus;
          this.setEquipmentChildrenStatus(M.children_id, data.deviceStatus, M.s_fed ? true : false);
        }
        const G = this.getElementById(topology?.matrix['1.2G']); //1.2G中频矩阵
        if (G) {
          G.status = data.deviceStatus;
          this.setEquipmentChildrenStatus(G.children_id, data.deviceStatus, G.s_fed ? true : false);
        }
      } else {
        const equipment = this.getElementDeviceById(data.deviceId);
        const extra_equipment = this.equipmentList.filter((item) => item.deviceId == data.deviceId)[0];
        if (extra_equipment) {
          extra_equipment.deviceStatus = data.deviceStatus;
        }
        if (equipment) {
          equipment.status = data.deviceStatus;
          this.setEquipmentChildrenStatus(equipment.children_id, data.deviceStatus, equipment.s_fed ? true : false);
        }
      }
    },
    /**
     * @description: 通过设备Children id 设置线条状态
     * @param {*} list
     * @param {*} status
     * @return {*}
     */
    setEquipmentChildrenStatus(list, status, isS_fed) {
      if (Array.isArray(list)) {
        list.forEach((item) => {
          const equipment = this.getElementById(item);
          if (equipment) {
            equipment.s_fed = isS_fed;
            equipment.status = status;
          }
        });
      } else {
        const equipment = this.getElementById(list);
        if (equipment) {
          equipment.s_fed = isS_fed;
          equipment.status = status;
        }
      }
    },
    /**
     * @description: 获取所有极化开关
     * @param {*} data
     * @return {*}
     */
    getPolarityDevice() {
      return this.topologyElement.filter((item) => item.type == 'ball-mini');
    },

    setEquipmentParamsByDeviceId(data) {
      const equipment = this.getElementDeviceById(data.deviceId);

      //如果推送的消息中有包含极化开关
      if (topology.polarity_device.includes(data.deviceAlias)) {
        this.channelJackHandle(data.keyValues);
      }
      if (equipment) {
        if (data?.patternUuid) {
          const deviceBodyList = equipmentObject[data.deviceAlias]; //取copy的数据进行过滤赋值
          const bodyList = deviceBodyList && deviceBodyList.filter((item) => item.patternUuid == data.patternUuid);
          bodyList.forEach((item) => (item.value = data.keyValues.filter((e) => e.key == item.id)[0]?.value));
          equipment.device.bodyList = bodyList;
        } else {
          equipment.device.bodyList.forEach((item) => {
            const result = data.keyValues.filter((e) => e.key == item.id);
            if (result.length > 0) {
              item.value = result[0].value;
            }
          });
        }
        // equipment.device.patternUuid = data?.patternUuid;
        this.$forceUpdate();
      }
    },
    /**
     * @description: 控制极化开关
     * @return {*}
     */
    controlBall(params = { paramKey: 'JX_6', value: '01' }) {
      const data = params;
      const element = this.topologyElement.filter((item) => item?.paramKey == data.paramKey)[0];
      element.device.value = data.value;
      const status = data.value == element.direction.left || data.value == element.direction.right ? 'NORMAL' : 'OFF_LINE';
      element.status = status;
      //找到所有极化开关的父节点同步状态
      const ball_parent = element.polarity[data.value];
      if (ball_parent) {
        ball_parent.forEach((parent_id) => {
          const parent = this.getElementById(parent_id);
          parent.status = status;
        });
      }
      //找到所有极化开关的子节点同步状态
      const children = this.getElementById(element.children_id);
      children.status = status;
    },
    /**
     * @description: 初始化极化开关相关元素样式
     * @return {*}
     */
    initBall(element, status) {
      // return;
      Object.values(element.polarity).forEach((ids) => {
        if (Array.isArray(ids)) {
          ids.forEach((item) => {
            const ball_parent = this.getElementById(item);
            ball_parent.status = status;
          });
        }
        //先关闭所有极化直属父级节点
        const ball_directly_parent = element.parent_id;
        ball_directly_parent.forEach((item) => {
          const parent = this.getElementById(item);
          parent.status = 'OFF_LINE';
        });
      });
    },
    /**
     * @description: 初始化拓扑图
     * @return {*}
     */
    initStatus(data) {
      // const alwaysOnline = [22, 23, 24, 25, 29, 38, 63, 64, 65, 66, 78, 79, 80, 81, 98, 99, 100];
      const filterElement = [];
      this.topologyElement.forEach((item) => {
        if (topology.always_online.includes(item.id)) {
          item.status = 'NORMAL';
          this.setEquipmentChildrenStatus(item.children_id, 'NORMAL', item.s_fed ? true : false);
        }
        if (item.type == 'ball-mini') {
          item.device = {};
          this.initBall(item, 'OFF_LINE');
        } else if (Object.values(topology.matrix).includes(item.id)) {
          const equipment = data.filter((item2) => item2.device.replaceAll(' ', '') == 'IF_MATRIX')[0];
          if (equipment) {
            item.device = equipment;
            item.status = equipment.deviceStatus;
          }
        } else if (item.type == 'equipment' && !filterElement.includes(item.id)) {
          const equipment = data.filter((item2) => item2.device == item.device_key)[0];
          if (equipment) {
            item.device = equipment;
            item.status = equipment.deviceStatus;
            item.equipment_name = equipment.name;
          } else {
            // console.log(item);
          }
        }
      });
    },
    getElementDeviceById(deviceId) {
      return this.topologyElement.filter((item) => (item.type == 'equipment' || item.type == 'round_rect') && item.device?.deviceId == deviceId)[0];
    },
    getElementById(id) {
      return this.topologyElement.filter((item) => item.id == id)[0];
    },
    setElementStatusById(id, status) {
      const index = this.topologyElement.findIndex((item) => item.id == id);
      if (index !== -1) {
        this.topologyElement[index].status = status;
      }
    },
    changeBall(item) {
      const value = item.device.value == item.direction.left ? item.direction.right : item.direction.left;
      const data = {
        paramKey: item.paramValue,
        paramValue: value,
        stationId: this.$route.query.stationId,
      };
      const key = data.paramKey.split('_')[0];
      const result = params.filter((item) => item.deviceAlias == key)[0];
      result.keyValues.forEach((devices) => {
        if (devices.name == item.paramKey) {
          devices.value = data.paramValue;
        }
      });
      this.setEquipmentParamsByDeviceId(result);
    },

    /**
     * @description: 设备点击
     * @return {*}
     */
    equipmentHandle(item) {
      this.$message.info(`点击了${item.device?.name || item.equipment_name}`);
    },
  },
};
</script>
<style scoped>
.equipment-container {
  background-color: #e3e8ef;
}
.equipment-status-success {
  background: #f4f5f7;
  border-radius: 12px 12px 12px 12px;
  border: 1px solid #07d022;
  color: #07d022;
  padding: 0 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  /* justify-content: center; */
}
.equipment-status-error {
  background: #ff3a6f;
  border-radius: 12px 12px 12px 12px;
  border: 1px solid #ff3a6f;
  color: #ffffff;
  padding: 0 10px;
  display: flex;
  align-items: center;
  /* justify-content: center; */
}
.warning {
  color: #ff3a6f;
}
.send-btn {
  width: 62px;
  height: 24px;
  background: #0690f5;
  /* border: 2px solid #0690f5; */
  text-align: center;
  color: #fff;
  line-height: 24px;
  border-radius: 4px;
  line-height: 24px;
  cursor: pointer;
}
.el-input :deep().el-input-group__prepend {
  padding: 0 5px;
}
.no-equipment {
  background: #e3e8ef !important;
}
.monitor-save-btn {
  width: 100px;
  height: 32px;
  line-height: 32px;
  border-radius: 5px;
  text-align: center;
  background: var(--yx-default-btn);
  color: #fff;
  cursor: pointer;
  margin: 0 auto;
}
.monitor-title {
  color: #0690f5;
  font-size: 15px;
}
.monitor-line {
  height: 1px;
  background: var(--yx-border-1);
}
.monitor-wrap {
  min-width: 140px;
  max-width: 160px;
}
.monitor-key {
  font-size: 14px;
  color: var(--yx-font-2);
  white-space: nowrap;
}
.monitor-btn {
  background: #0690f5;
  border: 1px solid #0690f5;
  width: 108px;
  height: 28px;
  color: #ffffff;
  text-align: center;
  line-height: 28px;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 10px;
}
.monitor-value {
  background: var(--yx-background-6);
  color: var(--yx-font-4);
  padding: 5px 10px;
  border-radius: 5px;
  margin: 5px 0;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  min-height: 28px;
  text-overflow: ellipsis;
}
.save {
  width: 50px;
  height: 25px;
  line-height: 25px;
  border-radius: 5px;
  text-align: center;
  background: var(--yx-default-btn);
  color: #fff;
  cursor: pointer;
}
.dialog-side {
  color: var(--yx-font-2);
  cursor: pointer;
  padding: 0 10px;
}
.aside-active {
  color: var(--yx-font-4);
}
.dialog-side:hover {
  color: var(--yx-font-4);
}
.nav-item {
  width: 100px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  color: var(--yx-font-5);
  cursor: pointer;
}
.nav-active {
  background: var(--yx-default-btn);
  color: #fff;
  transition: 0.2s all;
}
.dialog-nav {
  height: 50px;
  background: var(--yx-background-deep);
}
.equipment-container {
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}
.topology-container {
  width: 100%;
  transform-origin: 0 0;
}
.topology-left {
  width: 219px;
}
svg {
  transform-origin: 0px 0px;
}
.svg {
  width: 100%;
  height: 660px;
}
.element-wrap,
.element {
  position: absolute;
}
.element {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.rect {
  width: 50px;
  height: 300px;
  background: #ccc;
  position: absolute;
}
.svg-line {
  display: block;
  min-height: 1px;
  min-width: 1px;
  overflow: visible;
  width: 100%;
  height: 100%;
  position: absolute;
}
.round-rect-text {
  width: 25px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  text-align: center;
}
.equipment {
  box-sizing: border-box;
}
.equipment-title {
  color: var(--yx-font-6);
  font-weight: bold;
  line-height: 23px;
}
.equipment-details {
  font-size: 12px;
  background: var(--yx-background-6);
  margin-top: 5px;
  border-radius: 12px;
  /* height: 22px; */
  line-height: 22px;
  margin-right: 3px;
}
.equipment-wrap::-webkit-scrollbar {
  background: rgb(249, 251, 252);
}
.equipment-wrap::-webkit-scrollbar-thumb {
  background: rgb(249, 251, 252);
}
.equipment-status {
  width: 10px;
  height: 10px;
  background: #ff3a6f;
  border-radius: 50%;
  display: block;
}
.topology-tips {
  width: 110px;
  height: 84px;
  position: absolute;
  bottom: 15px;
  left: 52px;
  font-size: 14px;
  color: #334681;
  background: #ebeff4;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid rgba(255, 255, 255, 0.302);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.left-handed {
  transform: rotate(180 deg);
  transition: all 2s;
}
.equipment-log-wrap {
  margin: 20px;
  box-sizing: border-box;
  min-height: 254px;
}
.equipment-icon {
  width: 547px;
  margin-right: 20px;
  display: flex;
  background: var(--yx-background-6);
}
.equipment-log {
  width: calc(100% - 547px);
  background: var(--yx-background-6);
}
.equipment-icon-wrap {
  width: 107px;
  max-width: 107px;
  height: 128px;
  max-height: 128px;
  box-sizing: border-box;
  flex-direction: column;
  font-size: 14px;
  border-right: 1px solid var(--yx-font-1);
  cursor: pointer;
}
.equipment-icon-wrap:nth-child(5n) {
  border-right: none;
}
.equipment-icon-wrap:nth-child(n) {
  border-bottom: 1px solid var(--yx-font-1);
}
.equipment-icon-wrap > img {
  width: 56px;
  height: 66px;
}
.dialog-wrap {
  max-height: 500px;
  min-width: 700px;
}
.equipment-log-title {
  font-size: 18px;
  color: var(--yx-font-2);
}
</style>
