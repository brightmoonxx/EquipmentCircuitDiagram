<!--
 * @Author: WangXin
 * @Date: 2022-10-14 18:06:40
 * @LastEditors: WangXin
 * @LastEditTime: 2023-03-03 09:45:50
 * @FilePath: \code\src\views\ACU\ACU.vue
 * @Description:
 *
 * Copyright (c) 2022 by YuXing, All Rights Reserved.
-->
<template>
  <div class="acu-container">
    <!-- 时间 -->
    <div class="acu-time-wrap flex align-items-center justify-between">
      <div class="acu-time">
        当前时间：
        <span class="acu-time-info">{{ curTime }}</span>
      </div>
      <div class="acu-time">
        开始时间：
        <span class="acu-time-info">{{ startTime.value * 1 ? formatSeconds(startTime.value) : '-' }}</span>
      </div>
      <div class="acu-time">
        相对时间：
        <span class="acu-time-info">{{ startTime.value * 1 ? diffTime + 's' : '-' }}</span>
      </div>
      <AcuTimeControl :inspectionObject="inspectionObject" :cabinetObject="cabinetObject" ref="AcuTimeControl"></AcuTimeControl>
    </div>
    <!-- 方位 -->
    <div class="acu-direction flex justify-between">
      <div class="acu-location">
        <div
          class="location-info"
          v-for="(item, index) in acuLocation"
          @click="sendHandle(item, 'single')"
          :key="index"
          :class="[{ 'location-info-active': item.isSelect }, { 'location-info-disable': item.keyValue == null }]"
        >
          {{ item ? item.value : '' }}
        </div>
      </div>
      <!-- 倾斜 -->
      <!-- <div class="acu-slope flex flex-wrap mg-right-20">
        <div class="acu-slope-info" v-for="(item, index) in slope" @click="item.select = !item.select" :key="index" :class="item.select ? 'location-info-active' : ''">
          {{ item ? item.name : '' }}
        </div>
      </div> -->
      <!-- <div class="acu-zero mg-right-20">
        <div class="acu-zero-info" v-for="(item, index) in zero" @click="item.isSelect = !item.isSelect" :key="index" :class="item.isSelect ? 'location-info-active' : ''">
          {{ item ? item.name : '' }}
        </div>
      </div> -->
      <div class="flex">
        <div class="acu-control-info" v-for="(item, index) in control" :key="index" :class="{ 'acu-control-active': item.isSelect }">
          {{ item ? item.value : '' }}
        </div>
      </div>
    </div>
    <!-- 角度 -->
    <div class="acu-angle flex justify-between">
      <div class="acu-angle-earth flex flex-direction-column" style="width: 33.3%">
        <div class="angle-earth-title">大地测量系角度</div>
        <div class="angle-earth-content flex-1 pd-x-10">
          <div class="angle-header flex flex align-items-center justify-around">
            <div v-for="item in angleHead" class="angle-name" :key="item">
              {{ item }}
            </div>
          </div>
          <div class="angle-body flex justify-around">
            <div class="angle-body flex flex-direction-column justify-around mg-x-10">
              <div>方位</div>
              <div>俯仰</div>
            </div>
            <div class="angle-databox flex justify-between flex-wrap align-content-between">
              <div v-for="item in angleTable" class="angle-number-value angle-value ellipse pd-x-10" :key="item.key">
                {{ item.value ? item.value + '°' : '-' }}
              </div>
            </div>
            <div class="flex flex-direction-column justify-between">
              <div class="angle-number-value angle-diff-value">{{ azimuthErr ? azimuthErr + '°' : '-' }}</div>
              <div class="angle-number-value angle-diff-value">{{ pitchErr ? pitchErr + '°' : '-' }}</div>
            </div>
          </div>
          <!-- <div class="angle-body"> -->
          <!-- 倾斜 -->
          <div class="flex align-items-center mg-top-50">
            <div class="angle-number">倾斜</div>
            <div class="angle-value angle-number-tilt ellipse pd-x-10">{{ incAngle.value ? incAngle.value * 1 + '°' : '-' }}</div>
          </div>
          <!-- </div> -->
        </div>
      </div>
      <div class="acu-angle-machine mg-x-20 flex pd-20" style="width: 33.3%">
        <div class="machine-tracking flex flex-direction-column align-items-center">
          <span class="machine-title">跟踪接收机</span>
          <div class="flex">
            <div class="mg-top-30">
              <div class="flex machine-tracking-label">
                <span class="wd-50px text-right mg-right-10">AGC</span>
                <div class="machine-tracking-value">{{ AGC.value ? AGC.value + 'V' : '0' }}</div>
              </div>
              <div class="flex machine-tracking-label">
                <span class="wd-50px text-right mg-right-10">Ua</span>
                <div class="machine-tracking-value">{{ Ua.value ? Ua.value + 'V' : '0' }}</div>
              </div>
              <div class="flex machine-tracking-label">
                <span class="wd-50px text-right mg-right-10">Ue</span>
                <div class="machine-tracking-value">{{ Ue.value ? Ue.value + 'V' : '0' }}</div>
              </div>
              <div class="flex justify-end align-items-center">
                <div class="losing-lock" :style="{ color: isLock.value == '1' ? '#07D022' : '#FF3A6F' }">
                  <img :src="require(`@/assets/images/acu/${isLock.value == '1' ? 'suodin' : 'shisuo'}.png`)" alt="" />
                  {{ isLock.value == '1' ? '锁定' : '失锁' }}
                </div>
              </div>
            </div>
            <div class="machine-progress-wrap mg-top-30 flex mg-x-20">
              <div class="progress-calibration">
                <div v-for="item in calibration" class="calibration" :style="{ top: item.top + 'px', right: 0 }" :key="item.value">{{ item.value }}V...</div>
              </div>
              <div class="machine-progress-bg">
                <div class="machine-progress" :style="{ height: (AGC.value / 5) * 100 + '%', background: isLock.value == '1' ? '#07D022' : '#FF3A6F' }"></div>
              </div>
              <div class="progress-calibration">
                <div v-for="item in calibration" class="calibration" :style="{ top: item.top + 'px' }" :key="item.value">...{{ item.value }}V</div>
              </div>
            </div>
          </div>
        </div>
        <div class="machine-oscilloscope flex flex-direction-column align-items-center">
          <span class="machine-title">误差示波器</span>
          <div class="oscilloscope-picture-wrap mg-top-20">
            <div class="oscilloscope-coordinate">
              <svg width="270" height="270">
                <text fill="var(--yx-font-5)" transform=" translate(120,15)">5 Ue</text>
                <text fill="var(--yx-font-5)" transform=" translate(110,265)">-5</text>
                <text fill="var(--yx-font-5)" transform=" translate(0,128)">-5</text>
                <text fill="var(--yx-font-5)" transform=" translate(255,128)">5</text>
                <text fill="var(--yx-font-5)" transform=" translate(245,148)">Ua</text>
                <g v-for="(item, index) in 10" :transform="`translate(0, ${item * 27 - 3})`" :key="index">
                  <polyline points="0 0 ,270 0" stroke-dasharray="1 1" style="fill: #5e7495; stroke: #5e7495; stroke-width: 0.5" />
                </g>
                <g v-for="(item, index) in 10" :transform="`translate(${item * 27 - 3},0)`" :key="index">
                  <polyline points="0 0 ,0 270" stroke-dasharray="1 1" style="fill: #5e7495; stroke: #5e7495; stroke-width: 0.5" />
                </g>
                <g>
                  <polyline points="0 131 ,270 131" stroke-dasharray="1 1" style="fill: #ffffff; stroke: #ffffff; stroke-width: 2; z-index: 2" />
                  <path transform="scale(2.5) translate(107.6,52.5) rotate(180)" fill="#ffffff" stroke-linecap="round" stroke-linejoin="round" d="M 2.5,-1.5,0.5,0,2.5,1.5 Z" />
                </g>
                <g>
                  <polyline points="131 0 ,131 270" stroke-dasharray="1 1" style="fill: #ffffff; stroke: #ffffff; stroke-width: 2; z-index: 2" />
                  <path transform="scale(2.5) translate(52.2,-1) rotate(90)" fill="#ffffff" stroke-linecap="round" stroke-linejoin="round" d="M 2.5,-1.5,0.5,0,2.5,1.5 Z" />
                </g>
                <g transform="translate(0, 0)" style="z-index: 2">
                  <circle stroke="black" stroke-width="0.5" r="4" cx="131" cy="131" fill="var(--yx-danger-4)" />
                </g>
                <g :transform="`translate(${pointX}, ${pointY})`" style="transition: 0.5s linear">
                  <circle stroke="black" stroke-width="0.5" r="4" cx="0" :cy="0" fill="var(--yx-warning-4)" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div class="acu-phase-calibration flex flex-direction-column" style="width: 33.3%">
        <div class="acu-phase-nav flex-center">
          <div v-for="item in phase" @click="phaseIndex = item.value" class="acu-phase-nav-item flex-center" :class="{ 'acu-phase-nav-active': phaseIndex == item.value }" :key="item.label">
            {{ item.label }}
          </div>
        </div>
        <!-- 快速校相 -->
        <div v-if="phaseIndex == 'phase'" class="flex-1 flex pd-20">
          <div class="wd-50 flex flex-wrap">
            <div v-for="item in phaseObject.bodyList" class="wd-50 mg-top-20" :key="item.label">
              <span>{{ item.label }}</span>
              <el-input v-if="!item.options" v-model="item.value" class="acu-phase-value"></el-input>
              <el-select v-else v-model="item.value" :style="{ width: item.width }" class="acu-phase-value normal-select">
                <el-option v-for="(opt, idx) in item.options" :key="idx" :label="opt.value" :value="opt.key"></el-option>
              </el-select>
            </div>
            <div class="mg-top-45 mg-left-10">
              <div v-permission @click="sendHandle(phaseObject, 'multi')" class="acu-phase-btn acu-phase-btn-active cursor-pointer">校相开始</div>
              <!-- <div class="acu-phase-btn cursor-pointer">校相停止</div> -->
            </div>
          </div>
          <div class="wd-50 flex-center flex-direction-column">
            <div v-for="item in shiftSlopeObj" :key="item.key" class="fast-phase-label flex">
              {{ item.name }}
              <div class="pd-x-10 ellipse">{{ item.value || '-' }}</div>
            </div>
            <!-- <div class="acu-phase-radio mg-top-20">
              <el-radio v-model="calibrationModel" label="1">极性及耦合检查</el-radio>
            </div>
            <div class="acu-phase-radio mg-top-20">
              <el-radio v-model="calibrationModel" label="2">自动化快速校相</el-radio>
            </div> -->
          </div>
        </div>
        <!-- 跟踪配置 -->
        <div v-else class="flex-1 flex pd-20 flex-wrap justify-center">
          <div class="flex flex-wrap wd-100 justify-around acu-config">
            <div v-for="conItem in configKey" :key="conItem">
              <span class="font-bold">{{ configObject[conItem].unitName }}</span>
              <div v-for="item in configObject[conItem].bodyList" :key="item.label" class="flex justify-between acu-threshold align-items-center">
                <span>{{ item.label }}</span>
                <el-input
                  v-if="!item.options"
                  v-model="item.value"
                  :controls="false"
                  class="acu-phase-value1"
                  :max="item.range['max'] ? item.range['max'] : 100"
                  :min="item.range['min'] ? item.range['min'] : 0"
                  @focus="item.isEdit = true"
                  @blur="item.isEdit = false"
                ></el-input>
                <!-- <el-input-number
                  v-if="!item.options"
                  v-model="item.value"
                  :controls="false"
                  class="acu-phase-value1"
                  :max="item.range['max'] ? item.range['max'] : 100"
                  :min="item.range['min'] ? item.range['min'] : 0"
                  @focus="item.isEdit = true"
                  @blur="item.isEdit = false"
                ></el-input-number> -->
                <el-select v-else v-model="item.value" class="acu-phase-value1 normal-select">
                  <el-option v-for="(opt, idx) in item.options" :key="idx" :label="opt.value" :value="opt.key"></el-option>
                </el-select>
              </div>
              <div class="flex justify-around mg-top-10" v-permission>
                <div @click="sendHandle(configObject[conItem], 'multi')" class="acu-config-btn acu-phase-btn-active">应用</div>
              </div>
            </div>
          </div>
          <!-- <div class="mg-top-10 flex wd-85 justify-between">
            <div v-for="trackItem in trackMethod" :key="trackItem.label" class="acu-track-item">
              <span>{{ trackItem.label }}</span>
              <el-select v-model="trackItem.value" class="acu-phase-value normal-select">
                <el-option v-for="(opt, idx) in trackItem.options" :key="idx" :label="opt.label" :value="opt.value"></el-option>
              </el-select>
            </div>
          </div> -->
        </div>
      </div>
    </div>
    <!-- 控制 -->
    <div class="acu-control flex justify-between">
      <div class="acu-control-left">
        <div class="acu-control-nav">
          <!-- 模块导航 -->
          <!-- <div
            v-for="(item, index) in controlNavList"
            class="acu-control-nav-item"
            :class="index == controlNavIndex ? 'acu-control-nav-active' : ''"
            @click="controlNavIndex = index"
            :key="item.label"
          >
            {{ item.label }}
          </div> -->
          <div class="acu-control-item-single">指向</div>
        </div>
        <div class="acu-control-list">
          <AcuControlModule :navIndex="controlNavIndex"></AcuControlModule>
        </div>
      </div>
      <div class="acu-control-right">
        <el-table class="normal-table" :row-class-name="tableRowClassName" height="305" :data="logTableData">
          <el-table-column label="时间" align="center" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.time || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" width="150" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ mappingType[scope.row.unitType] || '无' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="内容" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.log ? scope.row.deviceName + ': ' + scope.row.log : '无' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import Ws from '../../utils/socket';
import baseUrl from '../../request/baseUrl';
import { floatMinus, getCurrentTime } from '@/utils/utils';
import { inspectionObject, cabinetObject, frameFormatKey, initObj } from './js/config';
import AcuTimeControl from '@/components/ACU/AcuTimeControl.vue';
import AcuControlModule from '@/components/ACU/AcuControlModule.vue';
let ws = null;
let log_ws = null;
export default {
  metaInfo() {
    return {
      title: this.pageName,
    };
  },
  data() {
    return {
      cabinetObject: [],
      inspectionObject: [],
      timer: '',
      curTime: '',
      today: '',
      startTime: { id: '', value: '' },
      currentCtl: '',
      acuLocation: [],
      zero: [
        { name: '收藏', select: false },
        { name: '归零', select: true },
      ],
      slope: [
        { name: '倾斜待机', select: false },
        { name: '倾斜东倾', select: true },
        { name: '倾斜归零', select: false },
        { name: '倾斜西倾', select: true },
      ],
      controlModel: '',
      control: [],
      angleHead: ['', '引导角', '大地角', '误差'],
      angleLeft: ['方位', '俯仰'],
      angleTable: [
        { id: '', key: 'azimuth_guiding_angle', value: '' },
        { id: '', key: 'azimuth_angle', value: '' },
        { id: '', key: 'pitch_guide_angle', value: '' },
        { id: '', key: 'pitch_angle', value: '' },
      ],
      AGC: { id: '', value: '' },
      Ua: { id: '', value: '' },
      Ue: { id: '', value: '' },
      calibration: [
        { value: 5, top: -10 },
        { value: 4, top: 42 },
        { value: 3, top: 94 },
        { value: 2, top: 146 },
        { value: 1, top: 198 },
        { value: 0, top: 245 },
      ],
      baseX: 131,
      baseY: 131,
      pointX: 0,
      pointY: 0,
      position: {
        x: 0,
        y: 0,
      },
      rate: 135 / 5,
      phase: [
        { label: '快速校相', value: 'phase' },
        { label: '跟踪配置', value: 'config' },
      ],
      // 快速校相
      phaseObject: {
        key: 'ACU_FAST_PHASE_CALIBRATION',
        bodyList: [],
      },
      // 跟踪配置
      configObject: {
        ACU_SET_PARAM_SETTAIL_AFTER_1: {
          key: 'ACU_SET_PARAM_SETTAIL_AFTER_1',
          unitName: '',
          bodyList: [],
        },
        ACU_SET_PARAM_SETTAIL_AFTER_2: {
          key: 'ACU_SET_PARAM_SETTAIL_AFTER_2',
          unitName: '',
          bodyList: [],
        },
      },
      configKey: ['ACU_SET_PARAM_SETTAIL_AFTER_1', 'ACU_SET_PARAM_SETTAIL_AFTER_2'],
      // 跟踪方式
      // trackMethod: [
      //   { label: '运行方式', value: 1, options: [{ label: '自动', value: 1 }] },
      //   { label: '伺服带宽', value: 1, options: [{ label: '自动', value: 1 }] },
      //   { label: '捕获方式', value: 1, options: [{ label: '自动', value: 1 }] },
      // ],
      phaseIndex: 'phase',
      controlNavList: [
        // { label: '手动', value: '基带1' },
        { label: '指向', value: '基带1' },
        // { label: '数引', value: '基带1' },
        // { label: '程引', value: '基带1' },
        // { label: '收藏', value: '基带1' },
        // { label: '倾斜控制', value: '基带1' },
        // { label: '扫描', value: '基带1' },
      ],
      controlNavIndex: 0,
      // // 极性及耦合检查
      // checkPolarity: false,
      // // 自动化快速校相
      // autoCalibration: false,
      // 日志数据
      logTableData: [],
      isLock: {
        id: '',
        value: '1',
      },
      incAngle: {
        id: '',
        value: '',
      },

      shiftSlopeObj: [
        { id: '', name: '通道移项', key: 'trk_transfer_channel', value: '' },
        { id: '', name: '俯仰移项', key: 'trk_pitch_transfer', value: '' },
        { id: '', name: '方位倍数', key: 'trk_slope_bearing', value: '' },
        { id: '', name: '俯仰倍数', key: 'trk_slope_pitch', value: '' },
      ],
      // 指令对应键值 配置文件 , 值为 null 的按钮禁用
      instructFaceKey: {
        待机: 'ACU_STANDBY',
        手动: null,
        指向: null,
        数引: 'ACU_FUNCTIONREFERENCE',
        程引: 'ACU_REMOTE_BOOT_',
        自动跟踪1: 'ACU_SELF_TRACKING_1',
        自动跟踪2: 'ACU_SELF_TRACKING_2',
        收藏: 'ACU_COLLECT',
        归零: null,
      },
      instructList: [],
      mappingType: { INSTRUCT: '指令下发', PARAM_SETTING: '参数设置', RESPONSE: '响应' },
    };
  },
  components: { AcuTimeControl, AcuControlModule },
  computed: {
    pageName() {
      return `${this.$route.query.name} - ${this.$route.meta.title}`;
    },
    // 相对时间
    diffTime() {
      if (!this.startTime.value) return;
      let time = this.formatSeconds(this.startTime.value);
      const diff = Date.parse(this.curTime) / 1000 - Date.parse(this.today + ' ' + time) / 1000;
      console.log(time, diff);
      return diff;
    },
    azimuthErr() {
      let dadi = this.angleTable.find((e) => e.key == 'azimuth_angle');
      let yindao = this.angleTable.find((e) => e.key == 'azimuth_guiding_angle');
      if (!dadi.value || !yindao.value) return;
      let dadiDiff = floatMinus(dadi.value, yindao.value);
      return dadiDiff;
    },
    pitchErr() {
      let dadi = this.angleTable.find((e) => e.key == 'pitch_angle');
      let yindao = this.angleTable.find((e) => e.key == 'pitch_guide_angle');
      if (!dadi.value || !yindao.value) return;
      let guideDiff = floatMinus(dadi.value, yindao.value);
      return guideDiff;
    },
  },
  mounted() {
    this.date();
    this.initWs();
    // this.timer = setInterval(this.date, 1000);
    this.getComputedCoordinate();
    this.getInitConfig();
    this.timedExecution();
  },
  methods: {
    timedExecution() {
      this._timer = setTimeout(() => {
        this.curTime = getCurrentTime('YYYY-MM-DD HH:mm:ss');
        this._timer && clearTimeout(this._timer);
        this.timedExecution();
      }, 1000);
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.warn) return 'warn-row';
      return '';
    },
    handleEdit(value, max, min) {
      if (!/^[0-9]+$/.test(value)) value = value.replace(/\D/g, '');
      if (value > max) value = max;
      if (value <= min) value = min;
    },
    // 初始化配置
    async getInitConfig() {
      const arr = frameFormatKey;
      const params = {
        stationId: this.$route.query.stationId,
        data: arr,
      };
      const { data } = await this.$api.getFrameFormatKey(params);
      if (data.length == 0) return;
      console.log(data, initObj);
      initObj.forEach((objItem) => {
        data.forEach((item) => {
          if (typeof objItem.fieldName == 'object' && objItem.fieldName.constructor == Array) {
            objItem.fieldName.forEach((fieldItem) => {
              if (fieldItem == item.paramKey) {
                this.getConfigId(objItem.con, item);
              }
            });
          } else {
            if (objItem.fieldName == item.paramKey) {
              this.getConfigId(objItem.con, item);
            }
          }
        });
      });
      // this.acuLocation.push(this.acuLocation[0]);
      // 处理可选择配置
      this.protocolConfigHandle();
    },
    // 配置 id
    getConfigId(con, dataItem) {
      if (con == 'inspectionObject') {
        inspectionObject.forEach((conItem) => {
          conItem.data.forEach((tarItem) => {
            if (tarItem.key == dataItem.paramKey) {
              let obj = { id: dataItem.id, label: dataItem.paramName, status: null, selectConfig: dataItem.selectConfig };
              Object.assign(tarItem, obj);
            }
          });
        });
      } else {
        if (dataItem.paramType == 'SELECT') {
          this[con] = dataItem.selectConfig;
          this[con].forEach((conItem) => {
            if (con == 'acuLocation') {
              conItem.keyValue = this.instructFaceKey[conItem.value] || null;
            }
            conItem.id = dataItem.id;
          });
        } else {
          if (con == 'angleTable' || con == 'shiftSlopeObj' || con == 'cabinetObject') {
            this[con].forEach((angleItem) => {
              if (angleItem.key == dataItem.paramKey) {
                let obj = { id: dataItem.id, label: dataItem.paramName, status: false, selectConfig: dataItem.selectConfig };
                Object.assign(angleItem, obj);
              }
            });
          } else {
            this[con].id = dataItem.id;
          }
        }
      }

      this.inspectionObject = inspectionObject;
      this.cabinetObject = cabinetObject;
      // this.acuLocation.push(this.acuLocation[0]);
    },
    // 初始化 WS
    initWs() {
      if (ws) {
        ws.destroy();
        log_ws.destroy();
        ws = null;
        log_ws = null;
      }
      ws = new Ws({
        url: `${baseUrl.stationWs}/station/param/${this.$route.query.stationId}/ACU,TRK`,
        reconnectTime: 5 * 1000,
        heartBeatTime: 5 * 1000,
        waitBeatTime: 10 * 1000,
        HEART_KEY: 'ping',
        HEART_VALUE: 'ping',
        callback: (e) => {
          // console.log(e);
          if (!e.keyValues) return;
          if (e.deviceAlias !== 'ACU' && e.deviceAlias !== 'TRK') return;
          const valueList = e.keyValues;
          this.$refs.AcuTimeControl.loadInspection = false;

          initObj.forEach((objItem) => {
            // SELECT
            if (objItem.con == 'ACU_SET_PARAM_SETTAIL_AFTER_1' || objItem.con == 'ACU_SET_PARAM_SETTAIL_AFTER_2') {
              console.log(valueList);
              // this.configObject[objItem.con].bodyList.forEach((con) => {
              //   valueList.forEach((val) => {
              //     if (con.bindBodyId == val.key && !con.isEdit) {
              //       con.value = val.value;
              //     }
              //   });
              // });
            } else {
              if (this[objItem.con].length) {
                this[objItem.con].forEach((con) => {
                  if (e.deviceAlias == 'ACU' && (objItem.con == 'acuLocation' || objItem.con == 'control')) {
                    const result = valueList.filter((val) => con.id == val.key && con.key == val.value);
                    if (result.length > 0) {
                      this[objItem.con].forEach((item) => (item.isSelect = false));
                      con.isSelect = true;
                    }
                  }
                  valueList.forEach((val) => {
                    // 大地测量系角度部分
                    if (objItem.con == 'angleTable' || objItem.con == 'shiftSlopeObj' || objItem.con == 'cabinetObject') {
                      if (con.status && objItem.con !== 'cabinetObject') {
                        con.status = null;
                      }
                      // console.log(val);
                      if (con.id == val.key) {
                        con.value = val.value;
                        if (con.selectConfig) {
                          let target = con.selectConfig.find((i) => i.key == val.value);
                          con.status = target?.success;
                        } else {
                          con.value = val.value;
                          con.status = true;
                        }
                      }
                    }
                    //设备巡检
                    if (objItem.con == 'inspectionObject') {
                      // console.log(this[objItem.con]);
                      // console.log(con.title);
                      con.data.forEach((sec) => {
                        // console.log('lise', sec.id, valueList);
                        if (sec.id == val.key) {
                          // console.log(sec);
                          sec.value = val.value;
                          let target = sec.selectConfig.find((i) => i.key == val.value);
                          sec.status = target?.success;
                        }
                      });
                    }
                  });
                });
              }
              // VALUE
              else {
                valueList.forEach((val) => {
                  if (val.key == this[objItem.con].id) {
                    this[objItem.con].value = val.value;
                  }
                });
              }
            }
          });
          this.getComputedCoordinate();
          this.inspectionObject = inspectionObject;
          this.cabinetObject = cabinetObject;
          // console.log(this.cabinetObject);
          // console.log(this.inspectionObject, this.cabinetObject);
          this.$refs.AcuTimeControl.loadInspection = true;
          // console.log(this.inspectionObject);
        },
      });
      // 日志 socket
      log_ws = new Ws({
        url: `${baseUrl.stationWs}/station/${this.$route.query.stationId}/log`,
        reconnectTime: 5 * 1000,
        heartBeatTime: 5 * 1000,
        waitBeatTime: 10 * 1000,
        HEART_KEY: 'ping',
        HEART_VALUE: 'ping',
        callback: (e) => {
          if (e.device !== 'ACU') return;
          this.logTableData.unshift(e);
        },
      });
    },
    // 处理可选择配置
    async protocolConfigHandle() {
      const params = {
        stationId: this.$route.query.stationId,
        data: [
          'ACU_STANDBY',
          'ACU_INSTRUCTION_TO_POINT',
          'ACU_REMOTE_BOOT_',
          'ACU_FUNCTIONREFERENCE',
          'ACU_COLLECT',
          'ACU_FAST_PHASE_CALIBRATION',
          'ACU_SELF_TRACKING_1',
          'ACU_SELF_TRACKING_2',
          'ACU_SET_PARAM_SETTAIL_AFTER_1',
          'ACU_SET_PARAM_SETTAIL_AFTER_2',
          'ACU_ZERO_TIME_LOADING',
        ],
      };
      const { data } = await this.$api.getInstructList(params);
      // 指令列表存着找单元id用
      this.instructList = data;
      data.forEach((item) => {
        // 快速校相逻辑
        if (item.protocolInstruct == 'ACU_FAST_PHASE_CALIBRATION') {
          item.bodyList.forEach((phaseItem) => {
            let obj = { id: phaseItem.id, label: phaseItem.paramName, value: '', options: phaseItem.selectConfig };
            this.phaseObject.bodyList.push(obj);
          });
        }
        // 跟踪配置逻辑
        this.configKey.forEach((key) => {
          if (item.protocolInstruct == key) {
            this.configObject[key].unitName = item.unitName;
            item.bodyList.forEach((trackItem) => {
              let obj = { id: trackItem.id, label: trackItem.paramName, value: '', options: trackItem.selectConfig, bindBodyId: trackItem.bindBodyId, range: trackItem.valueRange, isEdit: false };
              this.configObject[key].bodyList.push(obj);
            });
          }
        });
      });
    },
    // 发送指令
    sendHandle(param, type) {
      if (type == 'multi') {
        let paramArr = [];
        param.bodyList.map((item) => {
          paramArr.push({ key: item.id, value: item.value });
        });
        // 校验
        if (paramArr.some((i) => i.value == '')) {
          this.$message.warning('请完善配置项!');
          return;
        }
        // 校验
        let target = this.instructList.find((insItem) => insItem.protocolInstruct == param.key);
        this.sendInstruct(param.key, paramArr, target.unitUuid);
      } else {
        if (!param.keyValue) return;
        this.sendInstruct(param.keyValue);
      }
    },
    async sendInstruct(instructKey, keyValues, unitUuid) {
      const params = {
        instructKey: instructKey,
        keyValues: keyValues || [],
        stationId: this.$route.query.stationId,
        unitUuid: unitUuid || '',
      };
      const data = await this.$api.sendInstruct(params);
      if (data.isSuccess) {
        this.$message.success(data.resultMsg);
      }
    },
    getComputedCoordinate() {
      this.position.x = this.Ua.value;
      this.position.y = this.Ue.value;
      this.pointY = this.baseY - this.position.y * this.rate;
      this.pointX = this.baseX + this.position.x * this.rate;
    },
    // 获取当前时间
    date() {
      let date = new Date();
      let year, mouth, day, hour, minute, second;
      year = date.getFullYear();
      mouth = date.getMonth() + 1;
      day = date.getDate();
      hour = date.getHours();
      minute = date.getUTCMinutes();
      second = date.getSeconds();
      hour = hour < 10 ? '0' + hour : hour;
      minute = minute < 10 ? '0' + minute : minute;
      second = second < 10 ? '0' + second : second;
      this.today = year + '-' + mouth + '-' + day;
      // this.curTime = year + '-' + mouth + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    },
    //秒数转化为时分秒
    formatSeconds(value) {
      var secondTime = parseInt(value); // 秒
      var minuteTime = 0; // 分
      var hourTime = 0; // 小时
      if (secondTime > 60) {
        //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取余，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime >= 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取余的分，获取分钟除以60取余的分
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      hourTime = hourTime < 10 ? '0' + hourTime : hourTime;
      minuteTime = minuteTime < 10 ? '0' + minuteTime : minuteTime;
      secondTime = secondTime < 10 ? '0' + secondTime : secondTime;
      var result = hourTime + ':' + minuteTime + ':' + secondTime;
      return result;
    },
  },
  destroyed() {
    window.removeEventListener('resize', () => {});
    ws.destroy();
    ws = null;
    log_ws = null;
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss" scoped>
@import url(./ACU.css);
.acu-threshold {
  :deep(.el-input-number .el-input__inner) {
    text-align: left !important;
  }
}
</style>
