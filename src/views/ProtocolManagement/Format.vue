<!--
 * @Author: heliling
 * @Date: 2022-11-02 11:45:09
 * @LastEditors: heliling
 * @LastEditTime: 2023-01-06 18:22:38
 * @Description: 
 * 
 * Copyright (c) 2022 by YuXing, All Rights Reserved. 
-->
<template>
  <div class="format">
    <div class="normal-btn" @click="goBack">
      <i class="el-icon-back"></i>
      返回
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="协议帧格式" name="first">
        <FrameFormat :config="configData" />
      </el-tab-pane>
      <el-tab-pane label="协议消息体" name="second">
        <ProtocolPattern :config="configData" />
      </el-tab-pane>
      <!-- <el-tab-pane label="协议单元" name="third">协议单元</el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
import FrameFormat from '@/components/ProtocolManagement/FrameFormat.vue';
import ProtocolPattern from '@/components/ProtocolManagement/ProtocolPattern.vue';
export default {
  data() {
    return {
      activeName: 'first',
      //公共配置数据，两个组件共享
      configData: {
        // indexType: [
        //   {
        //     key: 'NOTHING',
        //     value: '无',
        //     children: null,
        //   },
        //   {
        //     key: 'PATTERN',
        //     value: '模式索引',
        //     children: null,
        //   },
        //   {
        //     key: 'MESSAGE_TYPE',
        //     value: '消息类型索引',
        //     children: null,
        //   },
        // ],
        // byteType: [
        //   {
        //     key: 'I8',
        //     value: '有符号1字节',
        //     children: null,
        //   },
        //   {
        //     key: 'I16',
        //     value: '有符号2字节（大端）',
        //     children: null,
        //   },
        //   {
        //     key: 'I16_LE',
        //     value: '有符号2字节（小端）',
        //     children: null,
        //   },
        //   {
        //     key: 'I32',
        //     value: '有符号4字节（大端）',
        //     children: null,
        //   },
        //   {
        //     key: 'I32_LE',
        //     value: '有符号4字节（小端）',
        //     children: null,
        //   },
        //   {
        //     key: 'I64',
        //     value: '有符号8字节（大端）',
        //     children: null,
        //   },
        //   {
        //     key: 'I64_LE',
        //     value: '有符号8字节（小端）',
        //     children: null,
        //   },
        //   {
        //     key: 'U8',
        //     value: '无符号1字节（大端）',
        //     children: null,
        //   },
        //   {
        //     key: 'U16',
        //     value: '无符号2字节（大端）',
        //     children: null,
        //   },
        //   {
        //     key: 'U16_LE',
        //     value: '无符号2字节（小端）',
        //     children: null,
        //   },
        //   {
        //     key: 'U32',
        //     value: '无符号4字节（大端）',
        //     children: null,
        //   },
        //   {
        //     key: 'U32_LE',
        //     value: '无符号4字节（小端）',
        //     children: null,
        //   },
        //   {
        //     key: 'BIT',
        //     value: 'bit按位度',
        //     children: null,
        //   },
        //   {
        //     key: 'BYTE_6',
        //     value: '6字节',
        //     children: null,
        //   },
        //   {
        //     key: 'DATA_FIELD',
        //     value: '数据域',
        //     children: null,
        //   },
        // ],
        // paramType: [
        //   {
        //     key: 'FIXED',
        //     value: '固定值',
        //     children: null,
        //   },
        //   {
        //     key: 'VALUE',
        //     value: '数值',
        //     children: null,
        //   },
        //   {
        //     key: 'STRING',
        //     value: '字符串',
        //     children: null,
        //   },
        //   {
        //     key: 'SELECT',
        //     value: '选项',
        //     children: null,
        //   },
        //   {
        //     key: 'STATUS',
        //     value: '状态参数',
        //     children: null,
        //   },
        //   {
        //     key: 'DATA_FIELD',
        //     value: '数据域',
        //     children: null,
        //   },
        //   {
        //     key: 'CHECK',
        //     value: '校验',
        //     children: null,
        //   },
        // ],
        // unitType: [
        //   {
        //     key: 'MONITOR',
        //     value: '监视单元',
        //     children: null,
        //   },
        //   {
        //     key: 'RESPONSE',
        //     value: '响应单元',
        //     children: null,
        //   },
        //   {
        //     key: 'INSTRUCT',
        //     value: '指令单元',
        //     children: null,
        //   },
        // ],
        // verifyType: [
        //   {
        //     key: 'TEST',
        //     value: '测试',
        //     children: null,
        //   },
        // ],
        // monitorUnitBind: [
        //   {
        //     key: 'BBE',
        //     value: '测控基带',
        //     children: [
        //       {
        //         key: 'BBE_COMMAND_PARAM_CONFIG',
        //         value: '参数配置',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_BASEBAND_MODE_SWITCH',
        //         value: '基带模式切换',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_TASK_CONTROL',
        //         value: '任务控制',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_DATA_STORAGE',
        //         value: '数据存储',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_DATA_FORWARDING',
        //         value: '数据转发',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_PARAMETER_MACRO',
        //         value: '参数宏文件设置',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_DATA_TRANSMISSION',
        //         value: '数传数据传输/事后数传数据传输（双向数传、FM、TURBO）',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_TELEMETRY_DATA_TRANSMISSION',
        //         value: '遥测数据传输',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_SPEED_DATA_TRANSMISSION',
        //         value: '测速数据传输',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_RANGING_DATA_TRANSMISSION',
        //         value: '测距数据传输',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_REMOTE_CONTROL_TO_THE',
        //         value: '遥控发令',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_ON_THE_HIGH_SPEED',
        //         value: '高速上注',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_DOUBLE_TRAP_COMMAND',
        //         value: '双捕',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_SWEEP_COMMAND',
        //         value: '启扫',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_BACK_TO_THE_ZERO_ORDER',
        //         value: '回零',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_FROM_THE_TRAP_COMMAND',
        //         value: '距捕',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_DIRECT_RANGE_ZEROING',
        //         value: '直接距离校零',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_SET_THE_SYSTEM_CAPTURE_MODE',
        //         value: '系统捕获方式设置',
        //         children: null,
        //       },
        //     ],
        //   },
        // ],
        // responseUnitBind: [
        //   {
        //     key: 'BBE',
        //     value: '测控基带',
        //     children: [
        //       {
        //         key: 'BBE_COMMAND_PARAM_CONFIG',
        //         value: '参数配置',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_BASEBAND_MODE_SWITCH',
        //         value: '基带模式切换',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_TASK_CONTROL',
        //         value: '任务控制',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_DATA_STORAGE',
        //         value: '数据存储',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_DATA_FORWARDING',
        //         value: '数据转发',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_PARAMETER_MACRO',
        //         value: '参数宏文件设置',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_DATA_TRANSMISSION',
        //         value: '数传数据传输/事后数传数据传输（双向数传、FM、TURBO）',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_TELEMETRY_DATA_TRANSMISSION',
        //         value: '遥测数据传输',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_SPEED_DATA_TRANSMISSION',
        //         value: '测速数据传输',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_RANGING_DATA_TRANSMISSION',
        //         value: '测距数据传输',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_REMOTE_CONTROL_TO_THE',
        //         value: '遥控发令',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_ON_THE_HIGH_SPEED',
        //         value: '高速上注',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_DOUBLE_TRAP_COMMAND',
        //         value: '双捕',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_SWEEP_COMMAND',
        //         value: '启扫',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_BACK_TO_THE_ZERO_ORDER',
        //         value: '回零',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_FROM_THE_TRAP_COMMAND',
        //         value: '距捕',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_DIRECT_RANGE_ZEROING',
        //         value: '直接距离校零',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_SET_THE_SYSTEM_CAPTURE_MODE',
        //         value: '系统捕获方式设置',
        //         children: null,
        //       },
        //     ],
        //   },
        // ],
        // instructUnitBind: [
        //   {
        //     key: 'BBE',
        //     value: '测控基带',
        //     children: [
        //       {
        //         key: 'BBE_COMMAND_PARAM_CONFIG',
        //         value: '参数配置',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_BASEBAND_MODE_SWITCH',
        //         value: '基带模式切换',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_TASK_CONTROL',
        //         value: '任务控制',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_DATA_STORAGE',
        //         value: '数据存储',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_DATA_FORWARDING',
        //         value: '数据转发',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_PARAMETER_MACRO',
        //         value: '参数宏文件设置',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_DATA_TRANSMISSION',
        //         value: '数传数据传输/事后数传数据传输（双向数传、FM、TURBO）',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_TELEMETRY_DATA_TRANSMISSION',
        //         value: '遥测数据传输',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_SPEED_DATA_TRANSMISSION',
        //         value: '测速数据传输',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_RANGING_DATA_TRANSMISSION',
        //         value: '测距数据传输',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_REMOTE_CONTROL_TO_THE',
        //         value: '遥控发令',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_ON_THE_HIGH_SPEED',
        //         value: '高速上注',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_DOUBLE_TRAP_COMMAND',
        //         value: '双捕',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_SWEEP_COMMAND',
        //         value: '启扫',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_BACK_TO_THE_ZERO_ORDER',
        //         value: '回零',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_FROM_THE_TRAP_COMMAND',
        //         value: '距捕',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_DIRECT_RANGE_ZEROING',
        //         value: '直接距离校零',
        //         children: null,
        //       },
        //       {
        //         key: 'BBE_COMMAND_SET_THE_SYSTEM_CAPTURE_MODE',
        //         value: '系统捕获方式设置',
        //         children: null,
        //       },
        //     ],
        //   },
        // ],
      },
    };
  },
  components: { FrameFormat, ProtocolPattern },
  created() {
    this.getProtocolConfig();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async getProtocolConfig() {
      const { data } = await this.$api.getProtocolConfig();
      this.configData = data;
      console.log(this.configData);
    },
  },
};
</script>
<style lang="scss">
.format {
  padding: 24px 28px 28px;
  background: var(--yx-background-gradient);
  height: calc(100% - 54px);
  overflow: scroll;
}
</style>
