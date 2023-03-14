<!--
 * @Author: WangXin
 * @Date: 2022-10-14 09:18:16
 * @LastEditors: heliling
 * @LastEditTime: 2023-02-03 10:55:20
 * @FilePath: \code\src\views\StationManagement\StationList.vue
 * @Description:  
 * Copyright (c) 2022 by YuXing, All Rights Reserved. 
-->
<template>
  <div class="station-list">
    <div class="wrap">
      <div class="data">
        <div class="main">
          <div class="list-info pd-bottom-20">
            <h2>站点列表</h2>
            <!-- <yx-icon name="shitong" class="" style="color: #ff3a6f; font-size: 80px"></yx-icon> -->
            <div class="search">
              <!-- <el-form :inline="true" :model="formInline" class="station-list-form">
                <el-form-item>
                  <el-input v-model="formInline.name" placeholder="请输入站点名称"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-select class="normal-select" v-model="formInline.communicationStatus" placeholder="请选择通信状态">
                    <el-option v-for="item in communicationStatusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select class="normal-select" v-model="formInline.taskStatus" placeholder="请选择任务执行状态">
                    <el-option v-for="item in taskStatusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select class="normal-select" v-model="formInline.frequency" multiple placeholder="请选择频段">
                    <el-option v-for="item in frequencyList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" class="normal-btn" @click="onSubmit">查询</el-button>
                </el-form-item>
              </el-form> -->
              <div class="normal-btn view-btn" @click="toggleView">
                <yx-icon v-if="showTable" name="pic-list" style="width: 14px; height: 14px"></yx-icon>
                <yx-icon v-else name="list-view" style="width: 14px; height: 14px"></yx-icon>
              </div>
            </div>
          </div>
          <div class="list-content">
            <div class="list-table" v-if="showTable">
              <el-table class="normal-table station-table" :data="stationList" highlight-current-row>
                <el-table-column label="序号" align="center" type="index" width="70px"></el-table-column>
                <el-table-column label="站点名称" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name || '无' }}</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column label="站点类型" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name || '无' }}</span>
                  </template>
                </el-table-column> -->
                <el-table-column label="设备连接状态" align="center">
                  <template slot-scope="scope">
                    <div class="equipment-status small" :class="scope.row.status"></div>
                  </template>
                </el-table-column>
                <el-table-column label="任务状态" align="center">
                  <template slot-scope="scope">
                    <div class="task-status" :class="{ abnormal: !scope.row.executePlan }">{{ statusMap[`${scope.row.executePlan ? 1 : 0}`] }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="150px">
                  <template slot-scope="scope">
                    <div class="operate-btn-wrap" v-permission>
                      <span class="table-operate-btn" @click="toEnter(scope.row)">进入页面</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="list-layout" v-if="!showTable">
              <div class="station" v-for="(item, index) in stationList" :key="index" @click="toEnter(item)">
                <div class="station-header">
                  <div class="equipment-status small" :class="item.status"></div>
                  <div class="title">{{ item.name }}</div>
                  <!-- <div class="type">{{ item.name }}</div> -->
                </div>
                <div class="station-container"><img :src="item.coverUrl" alt="" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { elementOfArray } from '@/utils/utils';
import Ws from '../../utils/socket';
import baseUrl from '../../request/baseUrl';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      statusMap: {
        1: '正在执行',
        0: '空闲',
      },
      taskWs: null,
      statusWs: null,
      frequencyList: [
        {
          value: 's',
          label: 'S',
        },
        {
          value: 'x',
          label: 'X',
        },
        {
          value: 'ka',
          label: 'ka',
        },
      ],
      communicationStatusList: [
        {
          value: '1',
          label: '正常',
        },
        {
          value: '0',
          label: '异常',
        },
      ],
      taskStatusList: [
        {
          value: '1',
          label: '正在执行',
        },
        {
          value: '0',
          label: '未执行',
        },
        {
          value: '2',
          label: '执行异常',
        },
      ],
      showTable: true,
      tableData: [],
      formInline: {
        name: '',
        communicationStatus: '',
        taskStatus: '',
        frequency: [],
      },
      stationList: [],
    };
  },
  components: {},
  computed: {
    ...mapState(['userStationList']),
  },
  mounted() {
    this.getStationList(true);
    this.initStatusWs();
    this.initTaskWs();
  },
  destroyed() {
    this.statusWs.destroy();
    this.statusWs = null;
    this.taskWs.destroy();
    this.taskWs = null;
  },
  methods: {
    initStatusWs() {
      if (this.statusWs) {
        this.statusWs.destroy();
        this.statusWs = null;
      }
      this.statusWs = new Ws({
        url: `${baseUrl.stationWs}/station/all_station/status`,
        reconnectTime: 5 * 1000,
        heartBeatTime: 5 * 1000,
        waitBeatTime: 10 * 1000,
        HEART_KEY: 'ping',
        HEART_VALUE: 'ping',
        callback: (e) => {
          this.stationList.forEach((item) => {
            if (item.stationId == e.stationId) {
              if (e.status == 'NORMAL') {
                this.$set(item, 'status', 'success');
              } else if (e.status == 'WARN') {
                this.$set(item, 'status', 'danger');
              }
            }
          });
        },
      });
    },
    initTaskWs() {
      if (this.taskWs) {
        this.taskWs.destroy();
        this.taskWs = null;
      }
      this.taskWs = new Ws({
        url: `${baseUrl.stationWs}/notice/all_station`,
        reconnectTime: 5 * 1000,
        heartBeatTime: 5 * 1000,
        waitBeatTime: 10 * 1000,
        HEART_KEY: 'ping',
        HEART_VALUE: 'ping',
        callback: (e) => {
          console.log(e);
          console.log(e.noticeInfo == '请重新刷新站点列表');
          if (e.noticeInfo == '请重新刷新站点列表') {
            let that = this;
            setTimeout(() => {
              that.getStationList(false);
            }, 2000);
          }
        },
      });
    },
    async getStationList(loading) {
      const params = {
        pageIndex: 1,
        pageSize: 999,
        stationIds: this.userStationList.map((item) => item.path),
        useStatus: 1,
      };
      // console.log(this.userStationList.map((item) => item.path));
      const { data } = await this.$api.searchStation(params, loading);
      if (data) {
        this.stationList = data.records;
      }
      // this.initStatusWs();
      // this.initTaskWs();
    },
    toEnter(item) {
      // console.log(item);
      // const route = this.$router.resolve({ path: '/station-plan', query: { stationId: item.stationId } });
      const route = this.$router.resolve({ path: '/equipment-admin', query: { stationId: item.stationId, name: item.name } });
      sessionStorage.setItem('curTab', 'equipment');
      window.open(route.href, '_blank');
    },
    onSubmit() {
      console.log(this.formInline);
    },
    toggleView() {
      this.showTable = !this.showTable;
    },
  },
};
</script>

<style lang="scss" scoped>
.station-list {
  padding-bottom: 28px;
  height: 100%;
  overflow: scroll;

  .wrap {
    display: flex;
    width: 100%;
    min-height: calc(100% - 54px);
    .data {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      width: 100%;
      // height: calc(100% - 104px);
      padding: 24px 28px 28px;
      background: var(--yx-background-gradient);
      h2 {
        font-weight: 500;
        font-size: 18px;
        color: #334681;
      }
      .main {
        width: 100%;
        margin-bottom: 28px;
        padding: 25px;
        background: rgba(255, 255, 255, 0.11);
        border: 1px solid #e8ecef;
        border-radius: 4px;
        .list-info {
          display: flex;
          justify-content: space-between;
          .search {
            display: flex;
            align-items: center;
          }
          .station-list-form {
            .el-form-item {
              margin-right: 12px;
              &:nth-last-child(2) {
                margin: 0 12px;
              }
            }
          }
          .view-btn {
            min-width: auto;
          }
        }
        .list-layout {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          .station {
            margin: 0 23px 25px 0;
            background: var(--yx-container-translucent);
            width: calc((100% - 69px) / 4);
            cursor: pointer;
            border: 1px solid #e8ecef;
            border-radius: 4px;

            &:nth-child(4n) {
              margin-right: 0;
            }
            .station-header {
              display: flex;
              padding: 12px 23px;
              height: 42px;
              line-height: 18px;
              background: var(--yx-content-header);
              border-radius: 3px 3px 0px 0px;
              color: var(--yx-font-2);
              .title {
                margin-left: 24px;
              }
              .type {
                margin-left: auto;
              }
            }
            .station-container {
              padding: 23px;
              img {
                width: 100%;
                height: 240px;
                background: rgb(178, 178, 204);
              }
            }
          }
        }
      }
    }
  }
}
</style>
