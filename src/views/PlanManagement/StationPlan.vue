<!--
  * @Author: WangXin
  * @Date: 2022-10-14 09:18:16
 * @LastEditors: heliling
 * @LastEditTime: 2023-03-09 09:43:09
 * @FilePath: \code\src\views\PlanManagement\StationPlan.vue
* @Description:
*
* Copyright (c) 2022 by YuXing, All Rights Reserved.
   -->
<template>
  <div class="station_plan">
    <div class="wrap">
      <div class="data">
        <div class="top" v-show="showNowTask">
          <el-table class="normal-table cmd-table" :data="tableData">
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <div class="equipment-status" :class="{ success: Object.keys(tableData[0]).length }"></div>
              </template>
            </el-table-column>
            <el-table-column label="任务标识" align="center" min-width="110px">
              <template slot-scope="scope">
                <span>{{ scope.row.traceplanId || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="目标名称" align="center" min-width="110px">
              <template slot-scope="scope">
                <span>{{ scope.row.satelliteName || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="工作频段" align="center" min-width="110px">
              <template slot-scope="scope">
                <span>{{ scope.row.spectrum || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="任务类型" align="center" min-width="110px">
              <template slot-scope="scope">
                <span>{{ getContent(scope.row.content) || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="测控模式" align="center" min-width="110px">
              <template slot-scope="scope">
                <span>{{ patternMap[scope.row.pattern] || '-' }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="功率dBm" align="center" min-width="100px">
              <template slot-scope="scope">
                <span>{{ scope.row.power || '-' }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="进站时间" align="center" min-width="160px">
              <template slot-scope="scope">
                <span>{{ scope.row.startTime || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="出站时间" align="center" min-width="160px">
              <template slot-scope="scope">
                <span>{{ (scope.row.endTime && scope.row.endTime.replace('T', '')) || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="进站方位角" align="center" min-width="110px">
              <template slot-scope="scope">
                <span>{{ (scope.row.startAzi && scope.row.startAzi + '°') || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="最高仰角" align="center" min-width="100px">
              <template slot-scope="scope">
                <span>{{ (scope.row.startAzi && scope.row.maxEl + '°') || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="码速率" align="center" min-width="100px">
              <template slot-scope="scope">
                <span>{{ scope.row.bbeCodeRate || scope.row.ddtCodeRate || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="180px">
              <template slot-scope="scope" v-if="Object.keys(tableData[0]).length">
                <div class="operate-btn-wrap">
                  <span class="normal-btn" @click="toCheck(scope.row)">
                    <yx-icon name="view" style="width: 16px; height: 16px"></yx-icon>
                    查看
                  </span>
                  <span class="normal-btn" @click="toMonitor(scope.row)">
                    <yx-icon name="monitor" style="width: 16px; height: 16px"></yx-icon>
                    数据监测
                  </span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <template v-if="Object.keys(tableData[0]).length">
            <hr />
            <div class="process">
              <div class="count-down-wrap">
                <div class="count-down">
                  <div class="description">{{ planTime.countdown_type == 'ready' ? '准备中' : '执行中' }}</div>
                  <div class="clock">
                    <CountDown :auto-start="true" :countdown="planTime.countdown_time" @countdown-over="refresh"></CountDown>
                  </div>
                  <div class="font-medium txt">倒计时</div>
                </div>
              </div>
              <div class="prosess-step">
                <div class="edge start">任务开始</div>
                <div class="prosess-line">
                  <div class="flex-center tag" :class="`${stepStatusMap[item.stepStatus]}-tag`" v-for="(item, index) in processData" :key="index" :style="{ width: item?.width + '%' }">
                    <div class="icon flex-center">
                      <i v-if="item.stepStatus == 2" class="el-icon-success"></i>
                      <i v-if="item.stepStatus == 3" class="el-icon-error" @click="processReload(item.id)"></i>
                      <i v-if="item.stepStatus == 4" class="el-icon-warning" style="color: #ffcc00"></i>
                      <i v-if="item.stepStatus == 0 || item.stepStatus == 1" class="el-icon-remove-outline"></i>
                    </div>
                    <div class="tag-content position-absolute flex-center" :style="{ top: index % 2 == 0 ? '-30px' : '25px' }">
                      <div class="tag-name font-medium">{{ item.stepInfo }}</div>
                      <div class="tag-arrow"></div>
                    </div>
                  </div>
                  <div class="prosess-line-container" :style="{ width: processWidth + '%' }"></div>
                </div>
                <div class="edge end">任务结束</div>
              </div>
            </div>
          </template>
        </div>
        <div class="bottom">
          <div class="station-plan-list" :class="{ full: !showNowTask }">
            <div class="station-plan-list-head mg-bottom-20">
              <div class="title-wrap">
                <h2 class="default-title">任务计划列表</h2>
                <div class="normal-btn plain expand-btn" @click="toggleShowTask" :title="showNowTask ? '展开' : '收起'">
                  <yx-icon v-if="showNowTask" name="expand" style="width: 14px; height: 14px"></yx-icon>
                  <yx-icon v-if="!showNowTask" name="narrow" style="width: 14px; height: 14px"></yx-icon>
                </div>
              </div>

              <div class="tabs">
                <div v-for="(item, index) in tabs" :key="index" class="tab-item normal-btn plain" :class="{ active: index == activeIndex }" @click="tabClick(item, index)">
                  {{ item.title }}
                  <div v-if="index == tabs.length - 1 && errorCount > 0" class="num">{{ errorCount }}</div>
                </div>
              </div>
            </div>
            <el-form :inline="true" :model="formInline" class="plan-list-form">
              <div class="select-item-wrap">
                <div>
                  <el-form-item>
                    <el-select
                      class="normal-select"
                      ref="satelliteSelect"
                      v-model="formInline.satelliteName"
                      placeholder="卫星"
                      filterable
                      multiple
                      clearable
                      collapse-tags
                      :title="formInline.satelliteName"
                      @change="satChange"
                    >
                      <el-option v-for="item in satellite" :key="item.satelliteId" :label="item.satelliteName" :value="item.satelliteName"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-select
                      class="normal-select"
                      ref="contentSelect"
                      v-model="formInline.content"
                      placeholder="任务"
                      filterable
                      multiple
                      clearable
                      collapse-tags
                      @change="taskChange"
                      :title="getContent(formInline.content)"
                    >
                      <el-option v-for="item in satContent" :key="item.id" :label="item.content" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div>
                  <el-date-picker
                    v-model="value1"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changeDate"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                  <el-form-item>
                    <el-button type="primary" class="normal-btn primary" @click="onSubmit">查询</el-button>
                  </el-form-item>
                </div>
              </div>
            </el-form>
            <el-table class="normal-table cmd-table" :data="planListTableData" :row-style="getRowStyle">
              <el-table-column label="序号" align="center" type="index" width="70px">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column label="代号" align="center" width="70px">
                <template slot-scope="scope">
                  <span>{{ scope.row.satelliteId || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="卫星名称" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.satelliteName || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="!showNowTask" label="工作频段" align="center" min-width="110px">
                <template slot-scope="scope">
                  <span>{{ scope.row.spectrum || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="!showNowTask" label="任务类型" align="center" min-width="110px">
                <template slot-scope="scope">
                  <span>{{ getContent(scope.row.content) || '-' }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column v-if="!showNowTask" label="测控模式" align="center" min-width="110px">
                <template slot-scope="scope">
                  <span>{{ patternMap[scope.row.pattern] || '-' }}</span>
                </template>
              </el-table-column> -->
              <el-table-column v-if="!showNowTask" label="执行方式" align="center" min-width="110px">
                <template slot-scope="scope">
                  <span>{{ scope.row.autoSupport == 1 ? '自动化' : '手动' }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="!showNowTask" label="进站时间" align="center" min-width="160px">
                <template slot-scope="scope">
                  <span>{{ scope.row.startTime || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="!showNowTask" label="出站时间" align="center" min-width="160px">
                <template slot-scope="scope">
                  <span>{{ (scope.row.endTime && scope.row.endTime.replace('T', '')) || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="!showNowTask" label="进站方位角" align="center" min-width="110px">
                <template slot-scope="scope">
                  <span>{{ (scope.row.startAzi && scope.row.startAzi + '°') || '-' }}</span>
                </template>
              </el-table-column>

              <el-table-column v-if="!showNowTask" label="最高仰角" align="center" min-width="100px">
                <template slot-scope="scope">
                  <span>{{ (scope.row.startAzi && scope.row.maxEl + '°') || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="!showNowTask" label="码速率" align="center" min-width="100px">
                <template slot-scope="scope">
                  <span>{{ scope.row.bbeCodeRate || scope.row.ddtCodeRate || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="showNowTask" label="时间" align="center" width="160px">
                <template slot-scope="scope">
                  <span>{{ scope.row.startTime || '-' }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="自动化" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.autoSupport == 1 ? '支持' : '不支持' || '-' }}</span>
                </template>
              </el-table-column> -->
              <el-table-column label="操作" align="center" width="150px">
                <template slot-scope="scope">
                  <div class="operate-btn-wrap">
                    <span class="table-operate-btn" @click="check(scope.row)">查看</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-footer clearfix">
              <i class="icon-plus"></i>
              <el-pagination
                v-if="planListTableData.length"
                background
                layout="prev, pager, next"
                @size-change="sizeHandleChange"
                @current-change="pageHandleChange"
                :current-page="page"
                :page-size="size"
                :total="total"
              ></el-pagination>
            </div>
          </div>
          <div class="task-log" v-show="showNowTask">
            <div class="task-log-head">
              <h2 class="default-title">任务日志</h2>
              <div class="sum-detail font-medium">
                <div class="time" v-if="taskStartTime">起止时间：{{ taskStartTime }}~{{ taskEndTime }}</div>
                <div class="num">
                  <div class="num-item">
                    命令数：
                    <span>{{ taskLog?.total }}</span>
                  </div>
                  <div class="num-item">
                    成功：
                    <span>{{ taskLog?.successNum }}</span>
                  </div>
                  <div class="num-item">
                    故障：
                    <span>{{ taskLog?.warnNum }}</span>
                  </div>
                  <div class="num-item">
                    失败：
                    <span>{{ taskLog?.failedNum }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="log-list" v-if="taskLog?.taskLogDetailVOList">
              <div v-for="item in taskLog?.taskLogDetailVOList" :key="item.id" :class="`log-item ${statusClass[item.logLevel]}`">
                <!-- <span>{{ item.id }}</span> -->
                <div class="log-item-content">
                  <div class="log-item-status font-medium">{{ statusMap[item.logLevel] }}</div>
                  <div class="log-item-name font-medium">{{ item.title }}</div>
                  <div class="log-item-time">{{ item.createTime }}</div>
                  <div class="log-item-desc ellipse">{{ item.logInfo }}</div>
                  <div class="log-item-desc" v-if="item.errorMsg">原因：{{ item.errorMsg }}</div>
                </div>
              </div>
            </div>
            <div v-else class="task-log-content">
              <Exception />
            </div>
          </div>
        </div>
      </div>
    </div>
    <CommonDialog :show.sync="show" dialog-width="600px" dialog-title="查看任务" :appendToBody="false" top="0" customClass="check-task" :hasFooter="true">
      <template v-slot:body>
        <div class="dialog-content">
          <div class="border-title"><div class="font-medium">卫星信息</div></div>
          <div class="content">
            <div class="content-item">
              <div class="key font-medium">目标代号</div>
              <div class="value">{{ checkContent.satelliteName }}</div>
            </div>
            <div class="content-item">
              <div class="key font-medium">代号</div>
              <div class="value">{{ checkContent.satelliteId }}</div>
            </div>
          </div>
          <div class="border-title"><div class="font-medium">工作属性</div></div>
          <div class="content">
            <div class="content-item">
              <div class="key font-medium">计划来源</div>
              <div class="value">{{ sourceMap[checkContent.source] }}</div>
            </div>
            <div class="content-item">
              <div class="key font-medium">工作频段</div>
              <div class="value">{{ checkContent.spectrum }}</div>
            </div>
            <div class="content-item">
              <div class="key font-medium">任务类型</div>
              <div class="value">{{ getContent(checkContent.content) }}</div>
            </div>
            <div class="content-item">
              <div class="key font-medium">测控模式</div>
              <div class="value">{{ patternMap[checkContent.pattern] }}</div>
            </div>
            <div class="content-item">
              <div class="key font-medium">圈次类型</div>
              <div class="value">{{ planTypeMap[checkContent.planType] }}</div>
            </div>
          </div>
          <div class="border-title"><div class="font-medium">时间属性</div></div>
          <div class="content time">
            <div class="content-item">
              <div class="key font-medium">发数传时间</div>
              <div class="value">{{ checkContent.transmissionTime ?? '-' }}</div>
            </div>
            <div class="content-item">
              <div class="key font-medium">进站时间</div>
              <div class="value">{{ checkContent.startTime }}</div>
            </div>
            <div class="content-item">
              <div class="key font-medium">加功率时间</div>
              <div class="value">{{ checkContent.addpowerTime }}</div>
            </div>
            <div class="content-item">
              <div class="key font-medium">出站时间</div>
              <div class="value">{{ checkContent.endTime }}</div>
            </div>
            <div class="content-item">
              <div class="key font-medium">去功率时间</div>
              <div class="value">{{ checkContent.removepowerTime }}</div>
            </div>
          </div>
          <div class="border-title"><div class="font-medium">角度属性</div></div>
          <div class="content">
            <div class="content-item">
              <div class="key font-medium">进站方式角</div>
              <div class="value">{{ checkContent.startAzi }}°</div>
            </div>
            <div class="content-item">
              <div class="key font-medium">出站方式角</div>
              <div class="value">{{ checkContent.endAzi }}°</div>
            </div>
            <div class="content-item">
              <div class="key font-medium">最高仰角</div>
              <div class="value">{{ checkContent.maxEl }}°</div>
            </div>
          </div>
          <div class="border-title"><div class="font-medium">进度情况</div></div>
          <div class="content">
            <div class="step-wrap" v-for="(item, index) in checkContent.stepStatus" :key="index + 'step'">
              <div class="step-item" :class="{ 'success-step': item.stepStatus == 2 || item.stepStatus == 1, 'failed-step': item.stepStatus == 3, 'warning-step': item.stepStatus == 0 }">
                <yx-icon v-if="item.stepStatus == 2" name="complete" style="width: 16px; height: 16px"></yx-icon>
                <yx-icon v-if="item.stepStatus == 3" name="failed" style="width: 16px; height: 16px"></yx-icon>
                <yx-icon v-if="item.stepStatus == 0" name="warning" style="width: 16px; height: 16px"></yx-icon>
                <span>{{ item.stepName }}</span>
              </div>
              <yx-icon name="caret-right" class="right" style="width: 6px; height: 7px"></yx-icon>
            </div>
          </div>
        </div>
      </template>
      <div slot="footer" v-permission>
        <div class="btn-wrap">
          <!-- <div class="button-default">
            <yx-icon name="download" style="width: 16px; height: 16px"></yx-icon>
            下载任务列表
          </div> -->
        </div>
      </div>
    </CommonDialog>
    <CommonDialog :show.sync="showTask" dialog-width="600px" dialog-title="任务查看" customClass="task-detail">
      <template v-slot:body>
        <div class="dialog-content">
          <div class="content">
            <div class="content-item content-form-item">
              <div class="key font-medium">目标代号</div>
              <div class="value">{{ currentContent.satelliteName }}</div>
            </div>
            <div class="content-item content-form-item">
              <div class="key font-medium">目标编号</div>
              <div class="value">{{ currentContent.satelliteId }}</div>
            </div>
            <div class="content-item content-form-item">
              <div class="key font-medium">目标圈次</div>
              <div class="value">{{ currentContent.revNum }}</div>
            </div>
            <div class="content-item content-form-item">
              <div class="key font-medium">出站方位角</div>
              <div class="value">{{ `${currentContent.endAzi}°` }}</div>
            </div>
            <div class="content-item content-form-item">
              <div class="key font-medium">圈次类型</div>
              <div class="value">{{ planTypeMap[currentContent.planType] }}</div>
            </div>
            <div class="content-item content-form-item">
              <div class="key font-medium">计划来源</div>
              <div class="value">{{ sourceMap[currentContent.source] }}</div>
            </div>
            <div class="content-item content-form-item">
              <div class="key font-medium">发数传时间</div>
              <div class="value">{{ currentContent.transmissionTime }}</div>
            </div>
            <div class="content-item content-form-item">
              <div class="key font-medium">加功率时间</div>
              <div class="value">{{ currentContent.addpowerTime }}</div>
            </div>
            <div class="content-item content-form-item">
              <div class="key font-medium">去功率时间</div>
              <div class="value">{{ currentContent.removepowerTime }}</div>
            </div>
            <div class="content-item content-form-item">
              <div class="key font-medium">计划更新时间</div>
              <div class="value">{{ currentContent.updateTime }}</div>
            </div>
          </div>
        </div>
      </template>
    </CommonDialog>
  </div>
</template>
<script>
import { elementOfArray } from '@/utils/utils';
import moment from 'moment';
import baseUrl from '../../request/baseUrl';
import websocket from '../../utils/socket';
import CountDown from '@/components/common/CountDown/index.vue';
import CommonDialog from '@/components/common/CommonDialog/index.vue';
import Exception from '@/components/common/Exception/index.vue';
export default {
  metaInfo() {
    return {
      title: this.pageName,
    };
  },
  data() {
    const { stationId } = this.$route.query;
    return {
      showNowTask: false,
      taskStartTime: '',
      taskEndTime: '',
      interval: 4,
      traceplanId: 0,
      nowInfo: {},
      stepStatusMap: { 0: 'unexecuted', 1: 'executing', 2: 'success', 3: 'failed' },
      anteId: stationId,
      errorCount: 0,
      satContent: [],
      satellite: [],
      queryStart: '',
      queryEnd: '',
      currentContent: {},
      countdown: 0,
      planSocket: null,
      stepStatusSocket: null,
      _logSocket: null,
      planTypeMap: { 1: '正常', 2: '应急', 3: '补收' },
      patternMap: { 1: '扩频模式', 2: '扩频二模式', 3: '低速数传', 4: '双通路数传', 5: '测控 + 单通道', 6: '测控 + 双通道' },
      sourceMap: { 1: '中心', 2: '站内' },
      queryType: 2,
      statusClass: {
        1: 'success-log',
        0: 'failed-log',
        2: 'warning-log',
      },
      statusMap: {
        // waiting: '等待',
        1: '成功',
        0: '失败',
        2: '警告',
      },
      showTask: false,
      show: false,
      value1: '',
      processData: [],
      taskLog: {},
      formInline: {
        satellite: '',
        task: '',
      },
      tableData: [{}],
      page: 1,
      size: 12,
      total: 0,
      tabs: [
        { title: '待开始', value: 2 },
        { title: '已完成', value: 1 },
        { title: '错误任务', value: 3 },
      ],
      activeIndex: 0,
      planListTableData: [],
      planTime: {
        countdown_type: 'ready', //perform
        countdown_time: 0,
        total_time: 0,
        ready_time: 5 * 60 * 1000,
        perform_time: 0,
        end_time: 2 * 60 * 1000,
      },
      processWidth: 0,
      planId: 6088427,
    };
  },
  computed: {
    pageName() {
      return `${this.$route.query.name} - ${this.$route.meta.title}`;
    },
  },
  watch: {
    queryType(val) {
      (this.page = 1), this.getData(true);
    },
    traceplanId() {
      this.queryPlanTask();
      this.getTaskLog();
      this.stepStatusWs();
      this.logWs();
    },
  },
  components: { CommonDialog, CountDown, Exception },
  mounted() {
    this.getNowTask();
    this.selectErrorCount();
    this.selectSatContent();
    this.getSatellite();
    this.getData(true);
    this.getData(false, 3);
    this.planWs();
    setInterval(() => {
      // this.processWidth += 0.1;
    }, 1000);
  },

  destroyed() {
    if (this.planSocket) {
      this.planSocket.destroy();
      this.planSocket = null;
    }
    if (this.stepStatusSocket) {
      this.stepStatusSocket.destroy();
      this.stepStatusSocket = null;
    }
  },
  methods: {
    satChange() {
      this.getData(true);
    },
    taskChange() {
      this.getData(true);
    },
    getRowStyle({ row }) {
      if (row.autoSupport !== 1) return { background: '#E2E7EF', color: '#fff' };
    },
    toggleShowTask() {
      this.showNowTask = this.showNowTask ? false : true;
    },
    selectChange(val) {
      let that = this;
      setTimeout(() => {
        that.$refs[val].blur();
      }, 10);
    },
    getContent(val) {
      return (elementOfArray('id', val, this.satContent) && elementOfArray('id', val, this.satContent).content) || '';
    },
    /**
     * @description: 根据noticeInfo处理时间
     * @param {*} noticeInfo
     * @return {*}
     */
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
    /**
     * @description:根据流程id和状态获取进度条宽度
     * @param {*} id
     * @param {*} stepStatus 流程状态
     * @return {*}
     */
    getWidthByTaskId(id, stepStatus, data) {
      if (data) {
        data.execute = true;
      }
      if (id && stepStatus == 1) {
        const width = this.processData.reduce((prev, next) => {
          return (prev += id > next.id ? Number(next.width) : 0);
        }, 0);
        const half_width = Number(this.processData.filter((item) => item.id == id)[0]?.width) / 2;
        return width + half_width;
      }
      if (id) {
        const width = this.processData.reduce((prev, next) => {
          return (prev += id >= next.id ? Number(next.width) : 0);
        }, 0);
        return width;
      } else {
        const already_list = this.processData.filter((item) => item.stepStatus !== 0);
        const width = already_list.reduce((prev, next) => {
          return (prev += Number(next.width));
        }, 0);
        return width;
      }
    },
    async processReload(id) {
      const data = await this.$api.processReload({ id });
    },
    async getNowTask() {
      const data = await this.$api.selectNowTask(this.$route.query.stationId);
      if (data.code == 200) {
        this.nowInfo = data.data;
        this.showNowTask = true;
        this.traceplanId = this.nowInfo.traceplanId;
        this.tableData = [this.nowInfo];
        this.taskStartTime = moment(moment(this.nowInfo.startTime) - this.interval * 60 * 1000).format('YYYY-MM-DD HH:mm:ss');
        this.taskEndTime = moment(this.nowInfo.endTime).format('YYYY-MM-DD HH:mm:ss');
        this.timeHandle(this.nowInfo);
      } else {
        if (data.code == 502) {
          this.tableData = [{}];
          this.showNowTask = false;
        }
      }
    },
    getProcessDataWidth(data) {
      const time = {
        0: 'ready_time',
        1: 'perform_time',
        2: 'end_time',
      };
      data.forEach((item) => {
        const length = data.filter((item2) => item2.taskState == item.taskState).length; //获取每一个阶段的length
        console.log(this.planTime[time[item.taskState]], this.planTime.total_time, length); //
        item.width = ((this.planTime[time[item.taskState]] / this.planTime.total_time / length) * 100).toFixed(2);
        item.execute = item.stepStatus == 0 ? false : true; //是否已经执行
      });
      this.processData = data;
      this.processWidth = this.getWidthByTaskId();
      console.log(this.processData, this.processWidth);
    },
    refresh() {
      // 取消倒计时结束后刷新页面;
      if (this.planTime.countdown_type == 'perform') {
        // this.processData = [];
        // this.processWidth = 0;
        // this.tableData = [{}];
        this.planTime.countdown_type = 'ready';
      } else {
        this.timeHandle(this.nowInfo); //更新时间更新状态
        //   this.getNowTask();
      }
    },
    planWs() {
      if (this.planSocket) {
        this.planSocket.destroy();
        this.planSocket = null;
      }
      const options = {
        url: `${baseUrl.stationWs}/notice/${this.anteId}`,
        reconnectTime: 5 * 1000,
        heartBeatTime: 5 * 1000,
        waitBeatTime: 10 * 1000,
        HEART_KEY: 'ping',
        HEART_VALUE: 'ping',
        callback: (e) => {
          if (e) {
            setTimeout(() => {
              this.getData(false); //更新列表
            }, 2000);
          }
          if (e.noticeType == 'warning' || e.noticeType == 'error') {
            this.getNowTask(); //更新当前执行的任务
          }
          if (e.noticeType == 'end') {
            //任务结束
            // this.$message.success('当前任务已执行完毕！');
          }
        },
      };
      this.planSocket = new websocket(options);
    },
    logWs() {
      if (this._logSocket) {
        this._logSocket.destroy();
        this._logSocket = null;
      }
      const options = {
        url: `${baseUrl.stationWs}/task/log/${this.traceplanId}`,
        reconnectTime: 5 * 1000,
        heartBeatTime: 5 * 1000,
        waitBeatTime: 10 * 1000,
        HEART_KEY: 'ping',
        HEART_VALUE: 'ping',
        callback: (data) => {
          if (data.taskLogDetailVOList) {
            data.taskLogDetailVOList.forEach((item) => {
              item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
            });
            this.taskLog = data;
          }
          // console.log(data);
        },
      };
      this._logSocket = new websocket(options);
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
          const result = this.processData.filter((item) => item.id == task.id)[0];
          result.stepStatus = task.stepStatus;
          //只在任务进行中状态更新进度条，此时更新进度条
          if (result.execute) return; //已经执行的流程不执行
          const prevStepList = this.processData.filter((item) => item.orderNum > result.orderNum); //找到当前流程前面所有步骤
          const isChangeProcess = prevStepList.every((item) => !item.execute); //判断之前的流程都是未执行状态
          if (task.stepStatus == 1 && isChangeProcess) {
            this.processWidth = this.getWidthByTaskId(task.id, task.stepStatus, result);
          }
          const orderNum = this.processData[this.processData.length - 1].orderNum; //最后一步的id
          if (orderNum == result.orderNum && task.stepStatus == 1) {
            this.processWidth = '100';
          }
          if (prevStepList.length === 0 && task.stepStatus == 1) {
            this.processWidth = '100';
            return this.$message.success('当前任务已执行完毕！');
          }
        },
      };
      this.stepStatusSocket = new websocket(options);
    },
    async queryPlanTask() {
      const data = await this.$api.queryPlanTask(this.traceplanId);
      // const data = await this.$api.queryPlanTask(6914305);
      this.getProcessDataWidth(data.data);
    },
    async selectErrorCount() {
      const data = await this.$api.selectErrorCount(this.anteId);
      this.errorCount = data.data > 99 ? '99+' : data.data;
    },
    async selectSatContent() {
      const data = await this.$api.selectSatContent();
      this.satContent = data.data;
    },
    async getSatellite() {
      const data = await this.$api.selectSat();
      let arr = Array.from(data.data);
      this.satellite = arr;
    },
    changeDate() {
      if (!this.value1) {
        this.queryStart = '';
        this.queryEnd = '';
      } else {
        this.queryStart = this.value1[0];
        this.queryEnd = this.value1[1];
      }
    },
    async getData(loading, queryType) {
      console.log('获取计划接口', new Date(), {
        anteId: this.anteId,
        content: this.formInline.content ? this.formInline.content : [],
        pageIndex: this.page,
        pageSize: this.size,
        queryEnd: this.queryEnd,
        queryStart: this.queryStart,
        queryType: queryType ? queryType : this.queryType,
        satelliteName: this.formInline.satelliteName ? this.formInline.satelliteName : [],
      });

      const data = await this.$api.queryPlan(
        {
          anteId: this.anteId,
          content: this.formInline.content ? this.formInline.content : [],
          pageIndex: this.page,
          pageSize: this.size,
          queryEnd: this.queryEnd,
          queryStart: this.queryStart,
          queryType: queryType ? queryType : this.queryType,
          satelliteName: this.formInline.satelliteName ? this.formInline.satelliteName : [],
        },
        loading,
      );
      if (this.queryType == 3) {
        this.errorCount = data.data?.total;
      }
      if (queryType) return;
      this.planListTableData = data.data?.records;
      this.total = data.data?.total;
      this.page = data.data?.current;
    },
    async getTaskLog() {
      const { data } = await this.$api.getTaskLog({ planId: this.traceplanId });
      this.taskLog = data;
      // console.log(data);
    },
    onSubmit() {
      this.page = 1;
      this.getData(true);
    },
    pageHandleChange(page) {
      this.page = page;
      this.getData(true);
    },
    tabClick(item, index) {
      this.page = 1;
      this.activeIndex = index;
      this.queryType = item.value;
      this.page = 1;
    },
    toCheck(item) {
      this.showTask = true;
      this.currentContent = item;
    },
    toMonitor() {
      this.$router.push({ path: '/data-monitoring', query: this.$route.query });
    },
    async check(item) {
      const data = await this.$api.queryPlanById(item.id);
      this.checkContent = data.data;
      this.show = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-dialog.common-dialog.check-task {
  .dialog-body {
    .btn-wrap {
      .button-default {
        width: 300px;
      }
    }
    .dialog-content {
      padding: 20px;
      max-height: calc(100vh - 128px);
      overflow-y: scroll;
      .content {
        align-items: center;
        margin-left: 18px;
        .content-item {
          display: flex;
          flex-direction: column;
          width: calc((100% - 84px) / 3);
          margin-right: 42px;
          &:nth-child(3n) {
            margin-right: 0;
          }
          .key {
            font-size: 12px;
          }
          .value {
            margin-top: 6px;
            padding: 8px 6px;
            background: var(--yx-thead);
            border-radius: 4px;
            color: var(--yx-font-8);
            font-size: 12px;
            line-height: 12px;
          }
        }
      }
    }
    hr {
      margin: 12px 0;
      width: 528px;
      height: 1px;
      border: none;
      background: rgba(138, 156, 184, 0.39);
    }
  }
  .title {
    color: var(--yx-font-4);
    font-size: 14px;
    line-height: 24px;
  }
  .content {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 14px;
    .step-wrap {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      .step-item {
        display: flex;
        align-items: center;

        padding: 0 12px 0 4px;
        height: 24px;

        border-radius: 12px;
        i,
        .svg-icon {
          margin-right: 6px;
          border-radius: 50%;
          &.status {
            font-size: 12px;
            padding: 1px;
          }
        }
        span {
          line-height: 24px;
          font-size: 14px;
          color: var(--yx-font-5);
        }
        &.success-step {
          border: var(--yx-success-3) 1px solid;
          padding: 0 12px 0 12px;
          &:has(svg) {
            padding: 0 12px 0 4px;
          }
        }
        &.failed-step {
          border: var(--yx-danger-3) 1px solid;

          span {
            color: var(--yx-danger-3);
          }
        }
        &.warning-step {
          border: var(--yx-warning-3) 1px solid;
        }
      }
      .svg-icon.right {
        margin: 0 4px;
      }
      &:nth-last-child(1) {
        .svg-icon.right {
          display: none;
        }
      }
    }
  }
}

.el-dialog.common-dialog.task-detail {
  .dialog-content {
    padding: 20px;
  }
  .content {
    display: flex;
    flex-wrap: wrap;

    .content-item {
      flex-direction: column;
      margin: 0 42px 16px 0;
      width: calc((100% - 84px) / 3);
      white-space: nowrap;
      &:nth-child(3n) {
        margin-right: 0;
      }
      .el-input.value {
        min-width: 32px;
        margin-top: 6px;
      }
    }
  }
}
.station_plan {
  height: calc(100% - 54px);
  overflow: scroll;
  :deep() div .el-dialog.common-dialog.check-task {
    margin-left: 772px;
    margin-bottom: 0;
    transform: translateY(-50%);
    top: 50%;
  }
  .wrap {
    display: flex;
    width: 100%;
    min-height: 100%;
    .data {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      width: 100%;
      // height: calc(100% - 104px);
      padding: 16px 24px 24px;
      background: var(--yx-background-gradient);

      .top {
        width: 100%;
        margin-bottom: 28px;
        padding: 25px;
        background: var(--yx-container-translucent);
        border: 1px solid rgba(131, 150, 173, 0.6314);
        border-radius: 4px;
        flex-shrink: 0;
        transition: all 0.2s linear;
        .operate-btn-wrap {
          .normal-btn {
            i {
              font-size: 14px;
            }
          }
        }
        hr {
          margin-bottom: 11px;
          border: #f3f3f3 1px dashed;
        }
        .process {
          display: flex;
          color: var(--yx-font-2);
          .count-down-wrap {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100px;
            height: 100px;
            border: 1px solid var(--yx-font-2);
            border-radius: 105px;
          }
          .count-down {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 96px;
            height: 96px;
            border: 0.5px dotted var(--yx-font-2);
            border-radius: 105px;
            .txt {
              font-size: 14px;
            }
            .description {
              color: var(--yx-btn-active);
            }
            .clock {
              font-size: 24px;
              font-family: Bahnschrift;
              font-weight: 400;
              line-height: 34px;
              color: var(--yx-font-2);
            }
          }
          .prosess-step {
            flex-grow: 1;
            display: flex;
            align-items: center;
            margin-left: 30px;
            .edge {
              flex-shrink: 0;
              position: relative;
              z-index: 2;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              padding: 6px;
              width: 47px;
              height: 47px;
              background: var(--yx-background-4);
              border: 2px solid #ffffff;
              box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
              border-radius: 50%;
              font-size: 14px;
              font-weight: 400;
              line-height: 18px;
              color: #ffffff;

              &.start {
                transform: translateX(50%);
              }
              &.end {
                background: var(--light-gray);
                color: var(--yx-font-2);
                transform: translateX(-18%);
              }
            }
            .prosess-line {
              display: flex;
              // justify-content: space-around;
              position: relative;
              width: 100%;
              height: 18px;
              box-sizing: content-box;
              border: 2px solid #ffffff;
              border-radius: 9px;
              .tag {
                display: flex;
                flex-direction: column;
                align-items: center;
                // position: absolute;
                background: transparent;
                z-index: 1;
                bottom: 0;
                left: calc(10% - 9px);
                width: 18px;
                height: 18px;
                border-radius: 50%;
                color: var(--yx-font-2);
                &:nth-child(2) {
                  left: calc(30% - 9px);
                }
                .icon {
                  position: absolute;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: #fff;
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  cursor: pointer;

                  i {
                    font-size: 20px;
                  }
                }
                .tag-content {
                  position: relative;
                  display: flex;
                  flex-direction: column;
                  text-align: center;
                  align-items: center;
                  top: -34px;
                }
                .tag-name {
                  white-space: nowrap;
                  font-size: 16px;
                }

                .tag-icon {
                  width: 18px;
                  height: 18px;
                  border-radius: 50%;
                  background: var(--yx-success-1);
                }
                .tag-arrow {
                  margin-top: 2px;
                  width: 10px;
                  height: 8px;
                  transform: scaleX(0.8);
                  border: 7px solid transparent;

                  border-top-color: var(--yx-font-2);
                }
                &.success-tag {
                  .tag-arrow {
                    border-top-color: var(--yx-success-1);
                  }
                  i {
                    color: var(--yx-success-1);
                  }
                }
                &.warning-tag {
                  .tag-arrow {
                    border-top-color: var(--yx-warning-3);
                  }
                  i {
                    color: var(--yx-warning-3);
                  }
                }
                &.executing-tag {
                  .tag-arrow {
                    border-top-color: var(--yx-content-1);
                  }
                  .icon {
                    background: transparent;
                    i {
                      color: var(--yx-font-1);
                    }
                  }
                }
                &.failed-tag {
                  .tag-arrow {
                    border-top-color: var(--yx-danger-3);
                  }
                  i {
                    color: var(--yx-danger-3);
                  }
                }
                &.unexecuted-tag {
                  //border: var(--yx-font-1) 2px solid;
                  .icon {
                    background: transparent;
                    i {
                      color: var(--yx-font-1);
                    }
                  }
                }
                &:nth-child(even) {
                  .tag-content {
                    display: flex;
                    flex-direction: column-reverse;
                    top: 13px;
                    .tag-arrow {
                      transform: scaleX(0.8) rotate(180deg);
                    }
                  }
                }
              }
              .prosess-line-container {
                position: absolute;
                top: 0;
                transition: 0.5s all ease-in-out;
                left: 0;
                // width: 45%;
                max-width: 100%;
                height: 100%;
                background: linear-gradient(90deg, rgba(0, 131, 255, 0.5) 0%, #0083ff 100%);
              }
            }
          }
        }
      }
      .bottom {
        display: flex;
        flex-grow: 1;
        overflow: hidden;
        .station-plan-list {
          background: rgba(255, 255, 255, 0.3);
          width: 749px;
          padding: 18px 24px 16px;
          margin-right: 28px;
          flex-shrink: 0;
          border: 1px solid rgba(131, 150, 173, 0.6314);
          border-radius: 4px;
          transition: all 0.1s linear;
          &.full {
            width: 100%;
          }

          .station-plan-list-head {
            display: flex;
            justify-content: space-between;
            .title-wrap {
              display: flex;
              align-items: center;
              .expand-btn {
                margin-left: 16px;
                padding: 5px;
                min-width: auto;
              }
            }
            .tabs {
              display: flex;
              .tab-item {
                position: relative;
                margin-right: 15px;
                &:nth-last-child(1) {
                  margin-right: 0;
                  .num {
                    position: absolute;
                    top: -8px;
                    right: 0;
                    transform: translateX(50%);
                    padding: 2px 6px;
                    border-radius: 11px;
                    line-height: 14px;
                    background: #ff4e4e;
                    border: 1px solid #ffffff;
                    font-weight: 500;
                    font-size: 12px;
                    color: #fff;
                  }
                }
              }
            }
          }
          .plan-list-form {
            display: flex;
            justify-content: space-between;
            margin-bottom: 9px;
            .select-item-wrap {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
              :deep() {
                .el-date-editor--datetimerange.el-input__inner {
                  flex-shrink: 0;
                  width: 338px;
                }
              }
              > div {
                display: flex;
                &:nth-child(1) {
                  margin-right: 12px;
                }
              }
            }
            .normal-btn {
              margin-left: 16px;
            }
          }
          .el-pagination {
            float: right;
          }
        }
        .task-log {
          flex-grow: 1;
          padding: 24px;
          border: 1px solid rgba(131, 150, 173, 0.6314);
          border-radius: 4px;
          transition: all 0.1s linear;
          .task-log-head {
            display: flex;
            justify-content: space-between;

            .sum-detail {
              font-size: 14px;
              color: var(--yx-font-2);
              display: flex;
              .time {
                margin-right: 38px;
              }
              .num {
                display: flex;
                .num-item {
                  margin-right: 16px;
                  white-space: nowrap;
                  span {
                    color: var(--yx-content-1);
                  }
                }
              }
            }
          }
          .task-log-content {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .log-list {
            margin-top: 30px;
            max-height: 588px;
            overflow-y: scroll;
            .log-item {
              display: flex;
              align-items: center;
              margin-bottom: 16px;
              color: var(--yx-font-2);
              .log-item-content {
                display: flex;
                align-items: center;
                padding-right: 30px;
                margin-left: 10px;
                width: 100%;
                min-height: 41px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 21px;
                font-weight: 400;

                .log-item-status {
                  flex-shrink: 0;
                  display: flex;
                  align-items: center;
                  justify-content: space-around;
                  margin-right: 27px;
                  width: 40px;
                  height: 40px;
                  border: 1px solid #ffffff;
                  border-radius: 50%;
                  font-size: 16px;
                  color: var(--yx-font-1);
                }
                .log-item-name {
                  flex-shrink: 0;
                  margin-right: 37px;
                }
                .log-item-time {
                  margin-right: 23px;
                  white-space: nowrap;
                }
                .log-item-desc {
                  width: 200px;
                  flex-grow: 1;
                }
              }
              &.success-log {
                .log-item-status {
                  color: var(--yx-success-1);
                }
              }
              &.failed-log {
                .log-item-content {
                  color: var(--yx-danger-4);
                }
                .log-item-status {
                  background: var(--yx-danger-4);
                }
                .log-item-name {
                  color: var(--yx-danger-4);
                }
              }
              &.warning-log {
                .log-item-status {
                  background: var(--yx-warning-1);
                }
                .log-item-name {
                  color: var(--yx-warning-1);
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
