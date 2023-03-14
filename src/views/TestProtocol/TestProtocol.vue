<!--
 * @Author: WangXin
 * @Date: 2022-11-10 17:10:37
 * @LastEditors: WangXin
 * @LastEditTime: 2022-11-30 16:54:35
 * @FilePath: \code\src\views\TestProtocol\TestProtocol.vue
 * @Description:
 *
 * Copyright (c) 2022 by YuXing, All Rights Reserved.
-->
<template>
  <div class="test-bg wd-100 hg-100">
    <div class="flex flex-direction-column align-items-center pd-y-20 wd-80 hg-100" style="margin: 0 auto">
      <div class="test-title">站控协议测试</div>
      <el-input class="mg-y-20" type="textarea" :rows="5" placeholder="请输入内容" v-model="h16String"></el-input>
      <div class="flex align-items-center justify-end wd-100">
        <el-checkbox v-model="openSocket" class="mg-x-10">同步到socket</el-checkbox>
        <el-button type="primary" size="medium" class="mg-x-10" style="width: 100px" @click="getTestResult">提交</el-button>
      </div>
      <div class="mg-y-10">
        解析结果: {{ testData.stationInfo?.name }} / {{ testData.deviceInfo?.name }} / {{ testData.protocolParse?.protocolPattern?.patternName }} 解析状态:
        <span :class="result.isSuccess ? 'success' : 'error'">{{ result.resultMsg }}</span>
      </div>
      <div class="flex wd-100 justify-between test-body">
        <div style="width: 33%" class="hg-100">
          <div class="title">PDXP头解析</div>
          <div class="overflow-y-scroll table-view">
            <div v-for="(value, key, index) in testData.pdxp">
              <div class="test-item flex" v-if="key !== 'originalBytes' && key !== 'dataFiled'">
                <div class="wd-50 border-right border-bottom">
                  {{ pdxp[key] }}
                </div>
                <div class="wd-50 border-bottom">
                  {{ value }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="width: 33%" class="hg-100">
          <div class="title">设备协议头解析</div>
          <div class="overflow-y-scroll table-view">
            <div v-for="(item, index) in testData.protocolParse?.protocolBodyList">
              <div class="test-item flex">
                <div class="wd-50 border-right border-bottom">
                  {{ item.paramName }}
                </div>
                <div class="wd-50 border-bottom" v-if="item.selectConfig && item.selectConfig.length > 0">
                  {{ item.selectConfig.filter((item2) => item2.key == item.value)[0]?.value }}
                </div>
                <div v-else class="wd-50 border-bottom text-ellipsis" :title="item?.value">
                  {{ item?.value }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="width: 33%" class="hg-100 table-danyuan overflow-y-scroll">
          <div class="" v-for="(item, index) in testData.protocolParse?.protocolUnits">
            <div class="title">{{ item.unitName }}</div>
            <div class="table-view">
              <div class="test-item flex" v-for="item2 in item.bodyList">
                <div class="wd-50 border-right border-bottom">
                  {{ item2.paramName }}
                </div>
                <div class="wd-50 border-bottom" v-if="item2.selectConfig">
                  {{ item2.selectConfig.filter((item3) => item3.key == item2.value)[0] ? item2.selectConfig.filter((item3) => item3.key == item2.value)[0].value : item2?.value }}:
                  {{ item2.selectConfig.filter((item3) => item3.key == item2.value)[0]?.key }}
                </div>
                <div v-else class="wd-50 border-bottom text-ellipsis" :title="item2.value">
                  {{ item2?.value }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      h16String: '',
      testData: {},
      openSocket: false,
      pdxp: {
        version: '版本号',
        dataLen: '数据域长度	',
        date: '日期',
        deviceId: '设备ID',
        did: '目的地址',
        time: '时间',
        stationId: '信源地址',
        no: '包序号',
        mid: '卫星标识',
        messageType: '信息类别(bid)',
        flag: '保留',
      },
      result: {
        isSuccess: false,
        resultMsg: '',
      },
    };
  },
  methods: {
    async getTestResult() {
      if (this.h16String == '') return this.$message.error('数据不能为空');
      this.testData = {};
      const data = await this.$api.testProtocol({ h16String: this.h16String, openSocket: this.openSocket });
      if (data.isSuccess) {
        this.$message.success('解析成功');
        this.testData = data.data;
      }
      this.result.isSuccess = data.isSuccess;
      this.result.resultMsg = data.resultMsg;
    },
  },
};
</script>
<style scoped>
.success {
  color: var(--yx-success-1);
}
.error {
  color: var(--yx-danger-4);
}
.test-body {
  height: calc(100% - 250px);
}
.test-bg {
  background: #000000d6;
  color: #fff;
}
.title {
  height: 40px;
  background: #ccc;
  color: #000;
  line-height: 40px;
  text-align: center;
}
.test-item {
  height: 40px;
  background: #fff;
  color: #000;
  line-height: 40px;
  text-align: center;
}
.table-view {
  background: #fff;
  height: calc(100% - 40px);
}
.table-view::-webkit-scrollbar {
  background: #00000000;
}
.table-danyuan::-webkit-scrollbar {
  background: #00000000;
}
</style>
