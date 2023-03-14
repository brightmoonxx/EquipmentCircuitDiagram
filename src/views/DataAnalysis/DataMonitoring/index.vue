<!--
 * @Author: heliling
 * @Date: 2022-10-20 14:18:16
 * @LastEditors: heliling
 * @LastEditTime: 2023-03-09 09:21:54
 * @FilePath: \code\src\views\DataAnalysis\DataMonitoring\index.vue
 * @Description:
 *
 * Copyright (c) 2022 by YuXing, All Rights Reserved.
-->

<template>
  <div class="wd-100 data-monitoring">
    <div class="wrap">
      <div class="data">
        <div class="left">
          <!-- <div class="data-item">
            <div class="item-header">
              <h2 class="default-title">信道</h2>
            </div>
            <div class="item-content">
              <div class="sum_title">上变频器</div>
              <hr />
              <div class="input-value-item">
                <div class="key">频点</div>
                <el-input class="value" :value="getShowValue('azimuth_guiding_angle')" readonly></el-input>
              </div>
              <div class="input-value-item">
                <div class="key">功率</div>
                <el-input class="value" :value="getShowValue('azimuth_guiding_angle')" readonly></el-input>
              </div>
              <div class="input-value-item">
                <div class="key">基带输出功率</div>
                <el-input class="value" :value="getShowValue('azimuth_guiding_angle')" readonly></el-input>
              </div>
              <div class="sum_title">下变频器</div>
              <hr />
              <div class="input-value-item">
                <div class="key">频点</div>
                <el-input class="value" :value="getShowValue('azimuth_guiding_angle')" readonly></el-input>
              </div>
              <div class="input-value-item">
                <div class="key">功率</div>
                <el-input class="value" :value="getShowValue('azimuth_guiding_angle')" readonly></el-input>
              </div>
            </div>
          </div> -->
          <div class="data-item">
            <div class="item-header"><h2 class="default-title">ACU</h2></div>
            <div class="item-content">
              <div class="input-value-item" v-for="(item, index) in acu.attribute" :key="index">
                <div class="key">{{ item.label }}</div>
                <el-input class="value" :value="getShowValue(item.paramKey, item.type)" readonly></el-input>
              </div>
              <div class="sum_title">角度</div>
              <hr />
              <div class="input-value-item" v-for="(item, index) in acu.angle" :key="index">
                <div class="key">{{ item.label }}</div>
                <el-input class="value" :value="getShowValue(item.paramKey, item.type) ? getShowValue(item.paramKey, item.type) + '°' : ''" readonly></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="right-top">
            <div class="data-header">
              <div class="time-data time-interval">
                <h2>起止时间：</h2>
                {{ startTime }} - {{ endTime }}
              </div>
              <div class="time-data count-down">
                <h2>
                  <span v-if="planTime.countdown_type == 'ready'">准备</span>
                  <span v-else>任务</span>
                  <span>倒计时：</span>
                </h2>
                <template v-if="hasTask">
                  <div class="time-wrap">
                    -
                    <CountDown :auto-start="true" :countdown="planTime.countdown_time" @countdown-over="refresh" topUnit="SEC"></CountDown>
                    s
                  </div>
                  <!-- <span v-show="planTime.countdown_type == 'perform'">{{ timer }}s</span> -->
                </template>
                <template v-else>-</template>
                <div class="prosess-step">
                  <div class="prosess-line"><div class="prosess-line-container" :class="taskStatus" :style="hasTask ? { width: processWidth + '%' } : { width: processWidth + '%' }"></div></div>
                  <div class="edge end">
                    <template v-if="hasTask">{{ processWidth }}%</template>
                    <template v-else>--</template>
                  </div>
                </div>
              </div>
              <div class="normal-btn" @click="toPlan">
                <i class="el-icon-document-copy"></i>
                站点计划
              </div>
            </div>
            <div class="data-content baseband">
              <div class="view-item measure-control">
                <div class="item-header">
                  <div class="title-wrap">
                    <h2 class="default-title">测控基带</h2>
                  </div>
                  <div class="btn-wrap" v-if="getShowValue('bbe_work_mode', 'text')">
                    <div class="normal-btn">{{ getShowValue('bbe_work_mode', 'text') }}</div>
                    <!--   <div class="normal-btn">外时钟</div>
                    <div class="normal-btn">外B码</div> -->
                  </div>
                </div>
                <div class="item-content">
                  <div class="item-content-left">
                    <div class="table-view">
                      <h2>遥测</h2>
                      <el-table class="normal-table cmd-table" :data="bbeTelemetryTableData" fit>
                        <el-table-column label="通道" align="center" min-width="32px">
                          <template slot-scope="scope">
                            <span>{{ scope.$index + 1 || '-' }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="载波" align="center" min-width="32px">
                          <template slot-scope="scope">
                            <div
                              class="equipment-status small"
                              :class="{ success: scope.row.bbe_telemetry_carrier_lock == true, danger: scope.$index > 0 || scope.row.bbe_telemetry_carrier_lock == false }"
                            ></div>
                          </template>
                        </el-table-column>
                        <el-table-column label="伪码" align="center" min-width="32px">
                          <template slot-scope="scope">
                            <div
                              class="equipment-status small"
                              :class="{ success: scope.row.bbe_telemetry_pseudo_code_lock == true, danger: scope.$index > 0 || scope.row.bbe_telemetry_pseudo_code_lock == false }"
                            ></div>
                          </template>
                        </el-table-column>
                        <el-table-column label="位同步" align="center" min-width="44px">
                          <template slot-scope="scope">
                            <div
                              class="equipment-status small"
                              :class="{ success: scope.row.bbe_telemetry_position_sync_lock == true, danger: scope.$index > 0 || scope.row.bbe_telemetry_position_sync_lock == false }"
                            ></div>
                          </template>
                        </el-table-column>
                        <el-table-column label="帧同步" align="center" min-width="44px">
                          <template slot-scope="scope">
                            <div
                              class="equipment-status small"
                              :class="{ success: scope.row.bbe_telemetry_frame_sync_lock == true, danger: scope.$index > 0 || scope.row.bbe_telemetry_frame_sync_lock == false }"
                            ></div>
                          </template>
                        </el-table-column>
                        <el-table-column label="AGC" align="center" min-width="80px">
                          <template slot-scope="scope">
                            <span :title="scope.row.bbe_telemetry_agc || '-'">{{ scope.row.bbe_telemetry_agc || '-' }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="C/N0" align="center" min-width="80px">
                          <template slot-scope="scope">
                            <span :title="scope.row.bbe_telemetry_cno || '-'">{{ scope.row.bbe_telemetry_cno || '-' }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="Eb/N0" align="center" min-width="80px">
                          <template slot-scope="scope">
                            <span :title="scope.row.bbe_telemetry_ebno || '-'">{{ scope.row.bbe_telemetry_ebno || '-' }}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                    <div class="table-view" v-if="getShowValue('bbe_work_mode', 'text') == '扩频2'">
                      <h2>测量</h2>
                      <el-table class="normal-table cmd-table" :data="bbeMeasureTableData" fit>
                        <el-table-column label="通道" align="center" min-width="30px">
                          <template slot-scope="scope">
                            <span>{{ scope.$index + 1 || '-' }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="载波" align="center" min-width="30px">
                          <template slot-scope="scope">
                            <div
                              class="equipment-status small"
                              :class="{ success: scope.row.bbe_measure_carrier_lock == true, danger: scope.$index > 0 || scope.row.bbe_measure_carrier_lock == false }"
                            ></div>
                          </template>
                        </el-table-column>
                        <el-table-column label="伪码" align="center" min-width="28px">
                          <template slot-scope="scope">
                            <div
                              class="equipment-status small"
                              :class="{ success: scope.row.bbe_measure_pseudo_code_lock == true, danger: scope.$index > 0 || scope.row.bbe_measure_pseudo_code_lock == false }"
                            ></div>
                          </template>
                        </el-table-column>
                        <el-table-column label="位同步" align="center" min-width="46px">
                          <template slot-scope="scope">
                            <div
                              class="equipment-status small"
                              :class="{ success: scope.row.bbe_measure_position_sync_lock == true, danger: scope.$index > 0 || scope.row.bbe_measure_position_sync_lock == false }"
                            ></div>
                          </template>
                        </el-table-column>
                        <el-table-column label="帧同步" align="center" min-width="46px">
                          <template slot-scope="scope">
                            <div
                              class="equipment-status small"
                              :class="{ success: scope.row.bbe_measure_position_sync_lock == true, danger: scope.$index > 0 || scope.row.bbe_measure_position_sync_lock == false }"
                            ></div>
                          </template>
                        </el-table-column>
                        <el-table-column label="卫星载波" align="center" min-width="60px">
                          <template slot-scope="scope">
                            <div
                              class="equipment-status small"
                              :class="{ success: scope.row.bbe_sate_res_carrier_lock == true, danger: scope.$index > 0 || scope.row.bbe_sate_res_carrier_lock == false }"
                            ></div>
                          </template>
                        </el-table-column>
                        <el-table-column label="卫星伪码" align="center" min-width="60px">
                          <template slot-scope="scope">
                            <div
                              class="equipment-status small"
                              :class="{ success: scope.row.bbe_sate_res_pseudo_code_lock == true, danger: scope.$index > 0 || scope.row.bbe_sate_res_pseudo_code_lock == false }"
                            ></div>
                          </template>
                        </el-table-column>
                        <el-table-column label="AGC" align="center" min-width="80px">
                          <template slot-scope="scope">
                            <span :title="scope.row.bbe_measure_agc || '-'">{{ scope.row.bbe_measure_agc || '-' }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="C/N0" align="center" min-width="80px">
                          <template slot-scope="scope">
                            <span :title="scope.row.bbe_measure_cno || '-'">{{ scope.row.bbe_measure_cno || '-' }}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                  <div class="item-content-center">
                    <div class="table-view">
                      <h2>遥控</h2>
                      <el-table class="normal-table cmd-table" :data="bbeControlTableData" fit>
                        <el-table-column label="通道" align="center" min-width="40px">
                          <template slot-scope="scope">
                            <span>{{ scope.$index + 1 || '-' }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="载波" align="center" min-width="40px">
                          <template slot-scope="scope">
                            <div
                              class="equipment-status small"
                              :class="{ success: scope.row.bbe_control_carrier_lock == true, danger: scope.$index > 0 || scope.row.bbe_control_carrier_lock == false }"
                            ></div>
                          </template>
                        </el-table-column>
                        <el-table-column v-if="getShowValue('bbe_work_mode', 'text') == '扩频2'" label="伪码" align="center" min-width="40px">
                          <template slot-scope="scope">
                            <div
                              class="equipment-status small"
                              :class="{ success: scope.row.bbe_control_pseudo_code_lock == true, danger: scope.$index > 0 || scope.row.bbe_control_pseudo_code_lock == false }"
                            ></div>
                          </template>
                        </el-table-column>
                        <el-table-column v-if="getShowValue('bbe_work_mode', 'text') == '标准'" label="副载波" align="center" min-width="50px">
                          <template slot-scope="scope">
                            <div
                              class="equipment-status small"
                              :class="{ success: scope.row.bbe_control_copy_carrier_lock == true, danger: scope.$index > 0 || scope.row.bbe_control_copy_carrier_lock == false }"
                            ></div>
                          </template>
                        </el-table-column>
                        <el-table-column label="环路" align="center" min-width="40px">
                          <template slot-scope="scope">
                            <div
                              class="equipment-status small"
                              :class="{ success: scope.row.bbe_control_loop_lock == true, danger: scope.$index > 0 || scope.row.bbe_control_loop_lock == false }"
                            ></div>
                          </template>
                        </el-table-column>
                        <el-table-column label="发令条数" align="center" min-width="80px">
                          <template slot-scope="scope">
                            <span>{{ scope.row.bbe_control_issue_count || '-' }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="小环对比" align="center" min-width="80px">
                          <template slot-scope="scope">
                            <span>{{ scope.row.bbe_control_small_quarter_count || '-' }}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                    <!-- <div class="table-view">
                      <h2>卫星应答</h2>
                      <el-table class="normal-table cmd-table" :data="tableData">
                        <el-table-column label="卫星" align="center" min-width="42px">
                          <template slot-scope="scope">
                            <span>{{ scope.$index + 1 || '-' }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="载波" align="center" min-width="42px">
                          <template slot-scope="scope">
                            <div class="equipment-status small"></div>
                          </template>
                        </el-table-column>
                        <el-table-column label="伪码" align="center" min-width="42px">
                          <template slot-scope="scope">
                            <div class="equipment-status small"></div>
                          </template>
                        </el-table-column>
                        <el-table-column label="位同步" align="center" min-width="42px">
                          <template slot-scope="scope">
                            <div class="equipment-status small"></div>
                          </template>
                        </el-table-column>
                        <el-table-column label="AGC" align="center" min-width="80px">
                          <template slot-scope="scope">
                            <span>{{ scope.row.cmd_name || '-' }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="C/N0" align="center" min-width="80px">
                          <template slot-scope="scope">
                            <span>{{ scope.row.cmd_name || '-' }}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div> -->
                  </div>
                  <div class="item-content-right">
                    <div>
                      <div class="condition">
                        <h2 class="default-title">监控方式</h2>
                        <div class="data-block">{{ getShowValue('bbe_monitor_mode', 'text') }}</div>
                      </div>
                      <div class="condition">
                        <h2 class="default-title">工作方式</h2>
                        <div class="data-block">{{ getShowValue('bbe_work_way', 'text') }}</div>
                      </div>
                    </div>
                    <div>
                      <div class="condition">
                        <h2 class="default-title">【存储】</h2>
                        <div class="status-wrap">
                          <div class="status-item" v-for="(item, index) in measureControl.storage" :key="index">
                            <div class="equipment-status" :class="{ success: getShowValue(item.paramKey, item.type) == true, danger: getShowValue(item.paramKey, item.type) == false }"></div>
                            <span>{{ item.label }}</span>
                          </div>
                        </div>
                      </div>
                      <!-- <div class="condition">
                        <h2 class="default-title">【网络】</h2>
                        <div class="status-wrap">
                          <div class="status-item" v-for="(item, index) in measureControl.network" :key="index">
                            <div class="equipment-status" :class="{ success: getShowValue(item.paramKey, item.type), danger: getShowValue(item.paramKey, item.type) == false }"></div>
                            {{ item.label }}
                          </div>
                        </div>
                      </div> -->
                    </div>
                  </div>
                </div>
              </div>
              <div class="view-item data-transmission">
                <div class="item-header">
                  <h2 class="default-title">数传基带</h2>
                  <div v-if="getShowValue('ddt_monitor_mode', 'text')" class="normal-btn">{{ getShowValue('ddt_monitor_mode', 'text') }}</div>
                </div>
                <div class="item-content">
                  <div class="controller">
                    <div class="controller-header">
                      <!-- <h2 class="default-title">[CH1]</h2> -->

                      <!-- <div class="attribute">
                        <div
                          class="attribute-item"
                          v-for="(item, index) in dataTransmission.CH1.factor"
                          :key="index"
                          :class="{ success: getShowValue(item.paramKey, item.type), abnormal: getShowValue(item.paramKey, item.type) == false }"
                        >
                          {{ item.label }}
                        </div>
                      </div> -->
                    </div>
                    <div class="controller-content">
                      <div class="controller-content-left">
                        <div class="value-item-wrap">
                          <div class="input-value-item" v-for="(item, index) in dataTransmission.CH1.params" :key="index">
                            <div class="key">{{ item.label }}</div>
                            <el-input class="value" :value="getShowValue(item.paramKey, item.type)" :title="getShowValue(item.paramKey, item.type)" readonly></el-input>
                          </div>
                        </div>
                        <div class="situation-wrap">
                          <div class="situation-item" v-for="(item, index) in dataTransmission.CH1.status" :key="index">
                            <yx-icon
                              :name="getShowValue(item.paramKey, item.type) ? 'lock' : getShowValue(item.paramKey, item.type) == false ? 'unlock' : 'lock'"
                              style="width: 12px; height: 14px"
                              class="lock"
                              :class="{ locking: getShowValue(item.paramKey, item.type) == true, losinglock: getShowValue(item.paramKey, item.type) == false }"
                            ></yx-icon>
                            <span>{{ item.label }}</span>
                          </div>
                        </div>
                      </div>
                      <!-- <div>
                        <el-table :data="transData" class="normal-table controller-table">
                          <el-table-column v-for="(item, index) in changedTitle" :label="item" :key="index" align="center" :width="index == 0 ? '80px' : '30px'">
                            <template slot-scope="scope">
                              <yx-icon
                                v-if="typeof scope.row[index] == 'object'"
                                :name="getShowValue(scope.row[index].paramKey) ? 'lock' : getShowValue(scope.row[index].paramKey) == false ? 'unlock' : 'lock'"
                                style="width: 12px; height: 14px"
                                class="lock"
                                :class="{ locking: getShowValue(scope.row[index].paramKey) == true, losinglock: getShowValue(scope.row[index].paramKey) == false }"
                              ></yx-icon>
                              <span v-else>{{ scope.row[index] }}</span>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div> -->
                    </div>
                  </div>
                  <!-- <div class="controller">
                    <div class="controller-header">
                      <h2 class="default-title">[CH2]</h2>
                      <div class="normal-btn">本控</div>
                      <div class="attribute">
                        <div
                          class="attribute-item"
                          v-for="(item, index) in dataTransmission.CH2.factor"
                          :key="index"
                          :class="{ success: getShowValue(item.paramKey, item.type), abnormal: getShowValue(item.paramKey, item.type) == false }"
                        >
                          {{ item.label }}
                        </div>
                      </div>
                    </div>
                    <div class="controller-content">
                      <div class="controller-content-left">
                        <div class="value-item-wrap">
                          <div class="input-value-item" v-for="(item, index) in dataTransmission.CH2.params" :key="index">
                            <div class="key">{{ item.label }}</div>
                            <el-input class="value" :value="getShowValue(item.paramKey, item.type)" readonly></el-input>
                          </div>
                        </div>
                        <div class="situation-wrap">
                          <div class="situation-item" v-for="(item, index) in dataTransmission.CH2.status" :key="index">
                            <yx-icon
                              :name="getShowValue(item.paramKey, item.type) ? 'lock' : getShowValue(item.paramKey, item.type) == false ? 'unlock' : 'lock'"
                              style="width: 12px; height: 14px"
                              class="lock"
                              :class="{ locking: getShowValue(item.paramKey, item.type) == true, losinglock: getShowValue(item.paramKey, item.type) == false }"
                            ></yx-icon>
                            <span>{{ item.label }}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <el-table :data="transData" class="normal-table controller-table">
                          <el-table-column v-for="(item, index) in changedTitle" :label="item" :key="index" align="center" :width="index == 0 ? '80px' : '30px'">
                            <template slot-scope="scope">
                              <yx-icon
                                v-if="typeof scope.row[index] == 'object'"
                                :name="getShowValue(scope.row[index].paramKey) ? 'lock' : getShowValue(scope.row[index].paramKey) == false ? 'unlock' : 'lock'"
                                style="width: 12px; height: 14px"
                                class="lock"
                                :class="{ locking: getShowValue(scope.row[index].paramKey) == true, losinglock: getShowValue(scope.row[index].paramKey) == false }"
                              ></yx-icon>
                              <span v-else>{{ scope.row[index] }}</span>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                    </div>
                  </div> -->
                  <Chart ref="ddt_jietiao_ebno" name="ddt_jietiao_ebno"></Chart>
                </div>
              </div>
            </div>
          </div>
          <div class="right-bottom view-item">
            <div class="item-header"><h2 class="default-title">任务图表</h2></div>
            <div class="chart-wrap">
              <Chart ref="bbe_telemetry_agc" name="bbe_telemetry_agc"></Chart>
              <Chart ref="bbe_telemetry_cno" name="bbe_telemetry_cno"></Chart>
              <Chart ref="bbe_telemetry_ebno" name="bbe_telemetry_ebno"></Chart>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Ws from '../../../utils/socket';
import baseUrl from '../../../request/baseUrl';

import { elementOfArray } from '@/utils/utils';
import moment from 'moment';
import CountDown from '@/components/common/CountDown/index.vue';
import echarts from '../../../plugins/echarts';
import Chart from '@/components/DataAnalysis/chart/index.vue';

export default {
  metaInfo() {
    return {
      title: this.pageName,
    };
  },
  data() {
    return {
      configList: ['bbe_telemetry_ebno', 'ddt_jietiao_ebno'],
      configData: {},
      deviceAliasLis: ['ACU', 'BBE', 'DDT'],
      timer: 0,
      taskStatus: '',
      processData: [],
      processWidth: 0,
      paramSocket: null,
      planSocket: null,
      stepStatusSocket: null,
      planTime: { countdown_type: 'ready', countdown_time: 0, total_time: 0, ready_time: 5 * 60 * 1000, perform_time: 0, end_time: 2 * 60 * 1000 },
      acu: {
        attribute: [
          {
            label: '跟踪模式',
            paramKey: 'work_mode',
            type: 'text',
          },
          { label: ' AGC电压', paramKey: 'agc' },
          { label: ' 锁定指示', paramKey: 'agc_lock', type: 'text' },
        ],
        angle: [
          {
            label: '方位',
            paramKey: 'azimuth_angle',
          },
          { label: ' 俯仰', paramKey: 'pitch_angle' },
          { label: ' 倾斜', paramKey: 'tilt_axle_frame_angle' },
        ],
      },
      measureControl: {
        storage: [
          {
            label: '遥测',
            paramKey: 'bbe_telemetry_storage_status',
          },
          {
            label: '遥控',
            paramKey: 'bbe_remote_storage_status',
          },
          {
            label: '测量',
            paramKey: 'bbe_measure_storage_status',
          },
          {
            label: '设备状态',
            paramKey: 'bbe_device_status',
          },
        ],
        network: [
          {
            label: '遥控',
            paramKey: 'acu_system_status',
          },
          {
            label: '站监控',
            paramKey: 'acu_system_status',
          },
          {
            label: '测控中心',
            paramKey: 'acu_system_status',
          },
        ],
      },
      dataTransmission: {
        CH1: {
          factor: [
            {
              label: '硬件',
              paramKey: 'acu_system_status',
            },
            {
              label: '电压',
              paramKey: 'acu_system_status',
            },
            {
              label: '温度',
              paramKey: 'acu_system_status',
            },
          ],
          params: [
            {
              label: '功率',
              paramKey: 'ddt_ jietiao_power',
            },
            {
              label: 'Eb/N0',
              paramKey: 'ddt_jietiao_ebno',
            },
            {
              label: '载偏(KHZ)',
              paramKey: 'ddt_jietiao_carrier_shift',
            },
            {
              label: '码偏Ksps',
              paramKey: 'ddt_jietiao_code_offset',
            },
          ],
          status: [
            {
              label: '载波',
              paramKey: 'ddt_jietiao_carrier_lock',
            },
            {
              label: '码元',
              paramKey: 'ddt_jietiao_symbol_lock',
            },
            {
              label: 'Viterbi',
              paramKey: 'ddt_jietiao_viterbi_lock',
            },
            {
              label: '帧同步',
              paramKey: 'ddt_jietiao_vsync_lock',
            },
            { label: 'RS/LDPC', paramKey: 'ddt_jietiao_rsldpc_lock' },
          ],
        },
        CH2: {
          factor: [
            {
              label: '硬件',
              paramKey: 'acu_system_status',
            },
            {
              label: '电压',
              paramKey: 'acu_system_status',
            },
            {
              label: '温度',
              paramKey: 'acu_system_status',
            },
          ],
          params: [
            {
              label: '功率',
              paramKey: 'azimuth_guiding_angle',
            },
            {
              label: 'Eb/N0',
              paramKey: 'azimuth_guiding_angle',
            },
            {
              label: '载偏(KHZ)',
              paramKey: 'azimuth_guiding_angle',
            },
            {
              label: '码偏Ksps',
              paramKey: 'azimuth_guiding_angle',
            },
          ],
          status: [
            {
              label: '中频',
              paramKey: 'acu_system_status',
            },
            {
              label: '均衡',
              paramKey: 'acu_system_status',
            },
            {
              label: '载波',
              paramKey: 'acu_system_status',
            },
            {
              label: '码元同步',
              paramKey: 'acu_system_status',
            },
          ],
        },
      },
      paramList: [
        'bbe_work_way',
        'agc',
        'agc_lock',
        'azimuth_x_angle',
        'pitch_y_angle',
        'azimuth_guiding_angle',
        'tilt_axle_frame_angle',
        'acu_system_status',
        'monitor_mode',
        'bbe_telemetry_carrier_lock',
        'bbe_telemetry_pseudo_code_lock',
        'bbe_telemetry_position_sync_lock',
        'bbe_telemetry_frame_sync_lock',
        'bbe_telemetry_agc',
        'bbe_telemetry_cno',
        'bbe_telemetry_ebno',
        'bbe_control_carrier_lock',
        'bbe_control_pseudo_code_lock',
        'bbe_control_loop_lock',
        'bbe_control_issue_count',
        'bbe_control_small_quarter_count',
      ],
      bbeTelemetry: [
        'bbe_telemetry_carrier_lock',
        'bbe_telemetry_pseudo_code_lock',
        'bbe_telemetry_position_sync_lock',
        'bbe_telemetry_frame_sync_lock',
        'bbe_telemetry_agc',
        'bbe_telemetry_cno',
        'bbe_telemetry_ebno',
      ],
      bbeControl: ['bbe_control_carrier_lock', 'bbe_control_pseudo_code_lock', 'bbe_control_copy_carrier_lock', 'bbe_control_loop_lock', 'bbe_control_issue_count', 'bbe_control_small_quarter_count'],
      bbeMeasure: [
        'bbe_measure_carrier_lock',
        'bbe_measure_pseudo_code_lock',
        'bbe_measure_position_sync_lock',
        'bbe_measure_position_sync_lock',
        'bbe_measure_agc',
        'bbe_measure_cno',
        'bbe_sate_res_carrier_lock',
        'bbe_sate_res_pseudo_code_lock',
      ],

      obj: {},
      data: [],
      tableData: [{}, {}, {}, {}],
      bbeTelemetryTableData: [{}, {}, {}, {}],
      bbeControlTableData: [{}, {}, {}, {}],
      bbeMeasureTableData: [{}, {}, {}, {}],
      originData: [
        [{ paramKey: 'acu_system_status' }, { paramKey: 'acu_system_status' }, { paramKey: 'acu_system_status' }, { paramKey: 'acu_system_status' }],
        [{ paramKey: 'acu_system_status' }, { paramKey: 'acu_system_status' }, { paramKey: 'acu_system_status' }, { paramKey: 'acu_system_status' }],
      ],
      originTitle: ['Viterbi译码', '帧同步', 'RS', 'LDPC'],
      changedTitle: ['项目', '1', '2'],
      transData: [],
      nowInfo: {},
      traceplanId: 0,
      chartYAxis: {
        bbe_telemetry_ebno: { min: 0, max: 0 },
        bbe_telemetry_cno: { min: 0, max: 0 },
        bbe_telemetry_agc: { min: 0, max: 0 },
        ddt_jietiao_ebno: { min: 0, max: 0 },
      },
    };
  },
  destroyed() {
    if (this.paramSocket) {
      this.paramSocket.destroy();
      this.paramSocket = null;
    }
    if (this.stepStatusSocket) {
      this.stepStatusSocket.destroy();
      this.stepStatusSocket = null;
    }
  },
  computed: {
    pageName() {
      return `${this.$route.query.name} - ${this.$route.meta.title}`;
    },
    hasTask() {
      return Object.keys(this.nowInfo).length > 0;
    },
    startTime() {
      if (this.nowInfo && this.nowInfo.startTime) return moment(this.nowInfo.startTime).format('HH:mm:ss');
      return '';
    },
    endTime() {
      if (this.nowInfo && this.nowInfo.endTime) return moment(this.nowInfo.endTime).format('HH:mm:ss');
      return '';
    },
  },
  created() {
    let matrixData = this.originData.map((row) => {
      let arr = [];
      for (let i in row) {
        arr.push(row[i]);
      }
      return arr;
    });
    // 加入标题拼接最终的数据
    this.transData = matrixData[0].map((col, i) => {
      return [
        this.originTitle[i],
        ...matrixData.map((row) => {
          return row[i];
        }),
      ];
    });
    this.getNowTask();
    this.planWs();
    this.initWs();
    this.configSearch(this.configList);
  },
  components: { CountDown, Chart },

  watch: {
    'planTime.countdown_type': {
      handler: function (val) {
        if (val == 'perform') {
          this.getTimer();
        }
      },
      immediate: true,
    },
    obj: {
      handler: function (val) {
        this.bbeTelemetry.forEach((item) => {
          this.$set(this.bbeTelemetryTableData[0], item, this.getShowValue(item));
        });
        this.bbeControl.forEach((item) => {
          this.$set(this.bbeControlTableData[0], item, this.getShowValue(item));
        });

        this.bbeMeasure.forEach((item) => {
          this.$set(this.bbeMeasureTableData[0], item, this.getShowValue(item));
        });
      },
      deep: true,
    },
    traceplanId() {
      this.queryPlanTask();
      this.stepStatusWs();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs['bbe_telemetry_ebno'].initChart('Eb/N0', [{ title: '测控基带', name: 'bbe_telemetry_ebno' }]);
      this.$refs['bbe_telemetry_cno'].initChart('C/N0', [{ title: '测控基带', name: 'bbe_telemetry_cno' }]);
      this.$refs['bbe_telemetry_agc'].initChart('AGC', [{ title: '测控基带', name: 'bbe_telemetry_agc' }]);
      this.$refs['ddt_jietiao_ebno'].initChart('Eb/N0', [{ title: '数传基带', name: 'ddt_jietiao_ebno' }]);
    });
  },
  methods: {
    configSearch(val) {
      val.forEach(async (item) => {
        const { data } = await this.$api.configSearch({ key: item });
        this.configData[`${item}`] = (data && data.configValue) || '';
      });
      console.log(this.configData);
    },
    getTimer() {
      setInterval(() => {
        this.timer = moment(moment()).diff(this.nowInfo.startTime, 'seconds');
      }, 1000);
    },

    planWs() {
      if (this.planSocket) {
        this.planSocket.destroy();
        this.planSocket = null;
      }
      const options = {
        url: `${baseUrl.stationWs}/notice/${this.$route.query.stationId}`,
        reconnectTime: 5 * 1000,
        heartBeatTime: 5 * 1000,
        waitBeatTime: 10 * 1000,
        HEART_KEY: 'ping',
        HEART_VALUE: 'ping',
        callback: (e) => {
          if (e.noticeType == 'warning') {
            this.getNowTask();
          }
        },
      };
      this.planSocket = new Ws(options);
    },
    async queryPlanTask() {
      const { data } = await this.$api.queryPlanTask(this.traceplanId);
      this.getProcessDataWidth(data);
    },
    getProcessDataWidth(data) {
      const time = {
        0: 'ready_time',
        1: 'perform_time',
        2: 'end_time',
      };
      if (data && data.length) {
        data.forEach((item) => {
          const length = data.filter((item2) => item2.taskState == item.taskState).length;
          item.width = ((this.planTime[time[item.taskState]] / this.planTime.total_time / length) * 100).toFixed(2);
        });
        this.processData = data;
        this.processWidth = this.getWidthByTaskId();
      }
    },
    getWidthByTaskId(id, stepStatus) {
      if (id && stepStatus == 1) {
        const width = this.processData.reduce((prev, next) => {
          return (prev += id > next.id ? Number(next.width) : 0);
        }, 0);
        const half_width = Number(this.processData.filter((item) => item.id == id)[0].width) / 2;
        return (width + half_width).toFixed(0);
      }
      if (id) {
        const width = this.processData.reduce((prev, next) => {
          return (prev += id >= next.id ? Number(next.width) : 0);
        }, 0);
        return width.toFixed(0);
      } else {
        const already_list = this.processData.filter((item) => item.stepStatus !== 0);
        const width = already_list.reduce((prev, next) => {
          return (prev += Number(next.width));
        }, 0);
        return width.toFixed(0);
      }
    },
    //任务流程
    stepStatusWs() {
      if (this.stepStatusSocket) {
        this.stepStatusSocket.destroy();
        this.stepStatusSocket = null;
      }
      const options = {
        url: `${baseUrl.stationWs}/macro/${this.traceplanId}`,
        reconnectTime: 5 * 1000,
        heartBeatTime: 5 * 1000,
        waitBeatTime: 10 * 1000,
        HEART_KEY: 'ping',
        HEART_VALUE: 'ping',
        callback: (data) => {
          const task = data[0];
          this.processData.forEach((item) => {
            if (item.id == task.id) {
              item.stepStatus = task.stepStatus;
              this.taskStatus = task.stepStatus == 3 ? 'failed' : '';
            }
          });
          this.processWidth = this.getWidthByTaskId(task.id, task.stepStatus);
        },
      };
      this.stepStatusSocket = new Ws(options);
    },

    timeHandle(noticeInfo) {
      const diff_time = moment(noticeInfo.startTime).diff(moment());
      this.planTime.total_time = moment(noticeInfo.endTime).diff(moment(noticeInfo.startTime)) + this.planTime.ready_time + this.planTime.end_time;
      this.planTime.perform_time = moment(noticeInfo.endTime).diff(moment(noticeInfo.startTime));
      if (diff_time > 0) {
        this.planTime.countdown_type = 'ready';
        this.planTime.countdown_time = diff_time;
      } else {
        this.planTime.countdown_type = 'perform';
        this.planTime.countdown_time = moment(noticeInfo.endTime).diff(moment());
      }
    },
    getShowValue(val, textType) {
      if (textType && this.obj[val] && this.obj[val].valueMemo) {
        return this.obj[val]?.valueMemo;
      } else if (this.obj[val] && this.obj[val].success != undefined) {
        return this.obj[val].success;
      } else if (this.obj[val] && this.obj[val].value != undefined) return this.obj[val]?.value;
      return null;
    },
    getName(val) {
      return this.obj[val]?.paramName;
    },
    initWs() {
      if (this.paramSocket) {
        this.paramSocket.destroy();
        this.paramSocket = null;
      }
      this.paramSocket = new Ws({
        url: `${baseUrl.stationWs}/station/param/${this.$route.query.stationId}/BBE,DDT,ACU`,
        reconnectTime: 5 * 1000,
        heartBeatTime: 5 * 1000,
        waitBeatTime: 10 * 1000,
        HEART_KEY: 'ping',
        HEART_VALUE: 'ping',
        callback: (e) => {
          this.setEquipmentParamsByDeviceId(e);
        },
      });
    },
    setEquipmentParamsByDeviceId(e) {
      if (this.deviceAliasLis.includes(e.deviceAlias)) {
        e.keyValues.forEach((item) => {
          if (item.name) {
            this.$set(this.obj, item.name, { ...item });
            //这里有两个问题1.if判断条件冗余逻辑相似太多 2.为什么不直接把后端的字段直接作为ref的值呢，为什么不把后端指定的key作为基准值的key呢
            //优化之前
            // if (item.name == 'bbe_telemetry_ebno') {
            //   this.$refs.ebnoChart.updateChart('bbe_telemetry_ebno', item.value, this.configData.bbe_eb_n0);
            // }
            // if (item.name == 'bbe_telemetry_cno') {
            //   this.$refs.cnoChart.updateChart('bbe_telemetry_cno', item.value);
            // }
            // if (item.name == 'bbe_telemetry_agc') {
            //   this.$refs.agcChart.updateChart('bbe_telemetry_agc', item.value);
            // }
            // if (item.name == 'ddt_jietiao_ebno') {
            //   this.$refs.ddtebnoChart.updateChart('ddt_jietiao_ebno', item.value);
            // }
            //优化之后
            if (this.$refs[item.name]) {
              this.chartYAxis[item.name].min = +item.value > +this.chartYAxis[item.name].min ? +this.chartYAxis[item.name].min : +item.value;
              this.chartYAxis[item.name].max = +item.value > +this.chartYAxis[item.name].max ? +item.value : +this.chartYAxis[item.name].max;
              this.$refs[item.name].updateChart(item.name, item.value, +this.configData?.[item.name], this.chartYAxis[item.name]);
            }
          }
        });
      }
    },
    async getNowTask() {
      const data = await this.$api.selectNowTask(this.$route.query.stationId);
      // this.nowInfo = {
      //   addpowerTime: '2022-11-09T11:30:16',
      //   anteId: '06100901',
      //   anteName: '七台河4.5米X站',
      //   antennaStatus: 2,
      //   createTime: '2022-11-07T13:54:01',
      //   endAzi: 191.14,
      //   endStatus: 2,
      //   endTime: '2022-12-16T18:59:51',
      //   id: 381,
      //   macroStatus: 2,
      //   maxEl: 79.7527,
      //   meteorologyStatus: 2,
      //   pattern: 1,
      //   phaseStatus: 2,
      //   planType: 1,
      //   removepowerTime: '2022-11-09T11:45:51',
      //   reportStatus: 2,
      //   revNum: 1371,
      //   satelliteId: '462F',
      //   satelliteName: '高分三号D39星',
      //   sendplanStatus: 2,
      //   source: 1,
      //   startAzi: 13.7244,
      //   startStatus: 2,
      //   startTime: '2022-12-16T14:08:16',
      //   traceplanId: 5301316,
      //   transmissionTime: '2022-11-09T11:35:16',
      //   updateTime: '2022-11-07T13:54:01',
      //   zeroStatus: 2,
      // };
      if (data.code == 200) {
        this.nowInfo = data.data;
        this.traceplanId = this.nowInfo.traceplanId;
        this.timeHandle(data.data);
        this.initWs();
      } else {
        if (data.code == 502) {
          //todo
        }
      }
    },
    getTime(value) {
      return value;
    },
    toPlan() {
      this.$router.push({ name: 'StationPlan', query: this.$route.query });
    },
    refresh() {
      if (this.planTime.countdown_type == 'perform') {
        this.processData = [];
        this.processWidth = 0;
        this.nowInfo = {};
        this.planTime.countdown_type = 'ready';
      } else {
        this.getNowTask();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.data-monitoring {
  height: calc(100% - 54px);
  overflow-y: scroll;
  .wrap {
    display: flex;
    width: 100%;
    min-height: 100%;
    .data {
      display: flex;
      box-sizing: border-box;
      width: 100%;
      // height: calc(100% - 104px);
      padding: 16px 24px 24px;
      background: var(--yx-background-gradient);
      .view-item,
      .data-item {
        display: flex;
        flex-direction: column;
        background: var(--yx-container-translucent);
        border: 1px solid #e8ecef;
      }
      .normal-btn {
        cursor: auto;
        &:hover {
          background-color: var(--yx-btn);
        }
      }
      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 12px 12px 24px;
        width: 100%;
        height: 42px;
        background: var(--yx-content-header);
        border-radius: 4px 4px 0px 0px;
        .btn-wrap {
          .normal-btn {
            margin-right: 12px;
          }
        }
        .title-wrap {
          display: flex;
          align-items: center;

          .default-title {
            margin-right: 12px;
          }
        }
      }
      .item-content {
        flex-grow: 1;
        padding: 12px 24px 24px;
        hr {
          border-bottom: rgba(138, 156, 184, 0.39) 1px solid;
          margin-top: 12px;
        }
      }

      .left {
        display: flex;
        flex-direction: column;
        width: calc((1520vw) / 194);
        min-width: 152px;
        margin-right: 26px;
        border-radius: 4px;
        flex-shrink: 0;
        .data-item {
          margin-bottom: 24px;
          width: 100%;
          box-shadow: 0px 3px 6px #d6e3f3;
          border-radius: 4px;
          &:nth-last-child(1) {
            // flex-grow: 1;
            margin-bottom: 0;
          }
          .item-content {
            .sum_title {
              margin-top: 12px;
            }
          }
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        .right-top {
          margin-bottom: 24px;
          width: 100%;
          .data-header {
            padding-bottom: 12px;
            display: flex;
            align-items: center;
            .time-data {
              display: flex;
              align-items: center;
              margin-right: 63px;
              font-size: 32px;
              font-weight: bold;
              color: var(--yx-font-9);
              h2 {
                font-size: 26px;
                font-weight: 400;
                color: var(--yx-font-5);
              }
              &.count-down {
                flex-grow: 1;
                .time-wrap {
                  display: flex;
                }
              }
              .prosess-step {
                flex-grow: 1;
                display: flex;
                align-items: center;
                margin-left: 30px;
                .edge {
                  position: relative;
                  z-index: 2;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 6px;
                  width: 40px;
                  height: 40px;
                  background: var(--yx-background-4);
                  border: 2px solid #ffffff;
                  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
                  border-radius: 50%;
                  font-size: 14px;
                  font-weight: 400;
                  line-height: 18px;
                  color: #ffffff;

                  &.end {
                    background: var(--light-gray);
                    color: var(--yx-font-2);
                    transform: translateX(-50%);
                  }
                }
                .prosess-line {
                  display: flex;
                  justify-content: space-around;
                  position: relative;
                  width: 100%;
                  height: 9px;
                  box-sizing: content-box;
                  border: 1px solid #ffffff;
                  border-radius: 9px;

                  .prosess-line-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    border-radius: 9px;
                    background: var(--yx-font-9);
                    &.failed {
                      background: var(--yx-danger-4);
                    }
                  }
                }
              }
            }
          }
          .data-content {
            display: flex;
          }
        }
        .right-bottom {
          flex-grow: 1;
          background: var(--yx-container-translucent);
          border: 1px solid #e8ecef;
          border-radius: 4px;
        }
        .view-item {
          border-radius: 4px;
          &.measure-control {
            margin-right: 23px;
            flex-grow: 1;
            .item-content {
              display: flex;
              justify-content: space-between;
              .table-view {
                padding: 16px;
                background: rgba(239, 242, 249, 0.11);
                border: 1px solid #e8ecef;
                border-radius: 4px;
                &:nth-child(1) {
                  margin-bottom: 24px;
                }
                h2 {
                  padding: 2px 0 12px 8px;
                  font-size: 14px;
                  font-weight: 500;
                  color: var(--yx-font-8);
                }
                .normal-table :deep() {
                  .el-table__cell {
                    padding: 0 0;
                    div {
                      padding: 4px 0;
                    }
                  }
                }
              }
            }
            .item-content-left,
            .item-content-center,
            .item-content-right {
              margin-right: 24px;
              &:nth-last-child(1) {
                margin-right: 0;
              }
            }
            .item-content-left {
              height: 100%;
            }
            .item-content-right {
              min-width: 153px;
              display: flex;
              justify-content: space-between;
              flex-direction: column;
              > div:nth-child(2) {
                margin-top: 12px;
              }
              .condition {
                &:nth-child(1) {
                  margin-bottom: 30px;
                }
                .status-wrap {
                  display: flex;
                  flex-wrap: wrap;
                  margin-top: 20px;
                  .status-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 16px;
                    width: calc((100% - 10px) / 2);
                    min-width: fit-content;
                    font-size: 16px;
                    font-weight: 400;
                    white-space: nowrap;
                    color: var(--yx-font-5);
                    .equipment-status {
                      flex-shrink: 0;
                      margin-right: 8px;
                    }
                    &:nth-child(2n-1) {
                      margin-right: 10px;
                    }
                    .el-checkbox {
                      user-select: auto;
                      cursor: auto;
                      :deep() .el-checkbox__input {
                        cursor: auto;
                      }
                    }
                  }
                }
              }
              .data-block {
                min-height: 42px;
                margin-top: 12px;
                padding-left: 8px;
                background: var(--yx-content-header);
                font-size: 28px;
                font-weight: 500;
                color: #2b63f1;
              }
            }
          }
          &.data-transmission {
            width: calc((4100vw) / 194);
            min-width: min-content;
            .item-content {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }

            .controller {
              margin-bottom: 24px;
              .controller-header {
                display: flex;
                align-items: center;
                .normal-btn {
                  margin: 0 auto 0 8px;
                  min-width: 55px;
                }
                .attribute {
                  display: flex;
                  .attribute-item {
                    margin-right: 1px;
                    padding: 0 14px;
                    height: 28px;
                    background: var(--light-gray);
                    border-radius: 2px;
                    font-size: 14px;
                    font-weight: 500;
                    white-space: nowrap;
                    line-height: 28px;
                    color: #ffffff;
                    &.success {
                      background: var(--yx-success-4);
                    }
                    &.abnormal {
                      background: var(--yx-danger-4);
                    }
                  }
                }
              }
              .controller-content {
                display: flex;
                // padding-top: 16px;
                .controller-content-left {
                  // margin-right: 24px;
                }
                .value-item-wrap {
                  display: flex;
                  //  flex-wrap: wrap;
                  min-width: 176px;
                  .input-value-item {
                    width: calc((100% - 72px) / 4);
                    min-width: min-content;
                    margin-right: 24px;
                    &:nth-last-child(1) {
                      margin-right: 0;
                    }
                    .key {
                      white-space: nowrap;
                    }
                    .value {
                      min-width: 80px;
                    }
                    :deep().value.el-input .el-input__inner {
                      text-overflow: initial;
                      padding: 7px;
                    }
                  }
                }
                .situation-wrap {
                  padding-top: 24px;
                  display: flex;
                  justify-content: space-between;
                  .situation-item {
                    margin-bottom: 8px;
                    display: flex;
                    font-size: 12px;
                    font-weight: 400;
                    color: var(--yx-font-2);
                    &:nth-last-child(1) {
                      margin-right: 0;
                    }
                    .lock {
                      flex-shrink: 0;
                      margin-right: 4px;
                    }
                  }
                }
                .controller-table :deep() {
                  .el-table__cell {
                    padding: 0 0;
                    div {
                      padding: 6px 0;
                    }
                  }
                }
              }
            }
          }
          .chart-wrap {
            display: flex;
            padding: 25px 23px 23px;
            height: 100%;
            .chart-item {
              margin-right: 19px;
              width: calc((100% - 38px) / 3);
              //  min-width: 445px;
              min-height: 240px;
              height: 100%;
              background: rgba(239, 242, 249, 0.11);
              border: 1px solid #e8ecef;
              border-radius: 4px;
              &:nth-last-child(1) {
                margin-right: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
