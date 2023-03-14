<!--
 * @Author: huangzhendong
 * @Date: 2022-11-14 14:14:12
 * @LastEditors: WangXin
 * @LastEditTime: 2023-03-03 13:37:11
 * @FilePath: \code\src\components\ACU\AcuTimeControl.vue
-->
<template>
  <div>
    <div class="acu-time-control flex justify-between">
      <div class="acu-control-item" v-for="(item, index) in acuTimeControl" @click="tabHandle(index)" :key="index" :class="{ 'active-control-item': currentCtl === index }">
        <img :src="require(`@/assets/images/acu/${currentCtl === index ? item.selIconSrc : item.iconSrc}.png`)" alt="" />
        {{ item.label }}
      </div>
    </div>
    <!-- T0时间弹窗 -->
    <CommonDialog :show.sync="showT0" dialog-width="400px" dialog-title="T0-时间设置" customClass="task-detail" :hasFooter="true">
      <template v-slot:body>
        <div class="dialog-content">
          <div class="content">
            <div class="content-item-time">
              <el-date-picker v-model="timeT0" :picker-options="setFulltime" format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择时间"></el-date-picker>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <button class="button-default outline" @click="cancel">取消</button>
        <button class="button-default" @click="loadT0Instruct">确认</button>
      </template>
    </CommonDialog>
    <!-- 设备巡检弹窗 -->
    <CommonDialog :show.sync="showInspection" dialog-width="600px" top="10vh" dialog-title="设备巡检" customClass="task-check">
      <template v-slot:body>
        <div v-if="loadInspection" class="dialog-content flex justify-between">
          <div class="content flex flex-wrap justify-between">
            <div v-for="item in inspectionObject" :key="item.title" class="content-left-item">
              <div class="left-item-title">{{ item.title }}</div>
              <div class="left-item-box flex justify-between flex-wrap">
                <div v-for="second in item.data" :key="second.label" class="pd-y-10 pd-x-10 item-box-model flex justify-between align-items-center">
                  <span class="item-box-label">{{ second.label }}</span>
                  <div class="equipment-status" :class="{ active: second.status }"></div>
                </div>
              </div>
            </div>
            <div class="content-right content-left-tianxian item-box-label wd-100">
              <div class="left-item-title">天线驱动机柜</div>
              <div class="flex flex-wrap justify-between content-right-box">
                <div v-for="item in cabinetObject" :key="item.label" class="right-item">
                  <!-- <div class="right-item-label">{{ item.label }}</div> -->
                  <div class="right-item-model flex pd-y-10 pd-x-15">
                    <div class="item-model-box flex-center">
                      <span class="item-box-label">
                        {{ item.label }}
                      </span>
                      <div v-if="item.selectConfig && item.selectConfig.length > 0" class="equipment-status" :class="{ active: item.status }"></div>
                      <span v-else>{{ item.value ? item.value : '0' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="content-right content-left item-box-label">
              <div class="left-item-title">天线驱动机柜</div>
              <div class="flex flex-wrap justify-between">
                <div v-for="item in cabinetObject" :key="item.label" class="right-item">
                  <div class="right-item-label">{{ item.label }}</div>
                  <div class="right-item-model flex pd-y-10 pd-x-15">
                    <div class="item-model-box">
                      <div>
                        <span class="right-item-label">通信状态</span>
                        <div class="equipment-status" :class="{ active: item.status }"></div>
                      </div>
                    <div>
                      <span class="right-item-label">电流:</span>
                      <span>{{item.value ?item.value:'0'}}</span>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
          </div>
        </div>
      </template>
    </CommonDialog>
    <!-- 轨道弹窗 -->
    <!-- <CommonDialog :show.sync="showOrbital" dialog-width="600px" top="10vh" dialog-title="轨道设置" customClass="task-orbital">
      <template v-slot:body>
        <div class="dialog-content">
          <div class="content pd-20">
            <div class="flex justify-between align-items-end">
              <div class="orbital-type acu-track-item">
                <span>轨道类型</span>
                <el-select v-model="oribitType" class="acu-phase-value normal-select">
                  <el-option v-for="(opt, idx) in oribitOpition" :key="idx" :label="opt.label" :value="opt.value"></el-option>
                </el-select>
              </div>
              <div class="btn-box flex justify-between flex-wrap">
                <button class="btn-item btn-data" >导入数据</button>
                <button class="btn-item btn-show" @click="previewHandle" :class="{'active':showPreview}">预览</button>
                <button class="btn-item btn-data" >卸载数据</button>
                <button class="btn-item btn-show" @click="creatCurve" :class="{'active':showCurve}">轨道曲线</button>
              </div>
            </div>
            <div class="guodin orbital-module flex flex-wrap justify-between">
              <div v-for="item in overtopObject" :key="item.label">
                <span class="orbital-label" :class="{'orbital-label-long':item.label == '过顶时刻'}">{{item.label}}</span>
                <div class="orbital-value" :class="{'orbital-value-long':item.label == '过顶时刻'}">{{item.value}}</div>
              </div>
            </div>
            <div class="jinzhan guodin orbital-module flex flex-wrap justify-between">
              <div class="orbital-item-title">进站点特征</div>
              <div class="orbital-item-line wd-100"></div>
              <div v-for="item in enterSiteObject" :key="item.label">
                <span class="orbital-label" :class="{'orbital-label-long':item.label == '进站时刻'}">{{item.label}}</span>
                <div class="orbital-value" :class="{'orbital-value-long':item.label == '进站时刻'}">{{item.value}}</div>
              </div>
            </div>
            <div class="chuzhan guodin orbital-module flex flex-wrap justify-between">
              <div class="orbital-item-title">出站点特征</div>
              <div class="orbital-item-line wd-100"></div>
             <div v-for="item in outSiteObject" :key="item.label">
                <span class="orbital-label" :class="{'orbital-label-long':item.label == '出站时刻'}">{{item.label}}</span>
                <div class="orbital-value" :class="{'orbital-value-long':item.label == '出站时刻'}">{{item.value}}</div>
              </div>
            </div>
            <div class="orbital-box">
                <div v-show="showPreview" class="orbital-model  mg-bottom-30">
                    <div class="orbital-header">数据预览</div>
                    <div class="orbital-close" @click="closeDialog('data')"><i class="el-dialog__close el-icon el-icon-close"></i></div>
                    <div class="dialog-content pd-20">
                        <el-table class="normal-table" height="260" :data="previewData">
                            <el-table-column label="日期时间" :show-overflow-tooltip="true" align="center">
                                <template slot-scope="scope">
                                <span>{{ scope.row.date || '无' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="方位角" :show-overflow-tooltip="true" align="center">
                                <template slot-scope="scope">
                                <span>{{ scope.row.az_angle || '无' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="俯仰角" :show-overflow-tooltip="true" align="center">
                                <template slot-scope="scope">
                                <span>{{ scope.row.pi_angle || '无' }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div v-show="showCurve" class="orbital-model">
                    <div class="orbital-header">轨道曲线</div>
                    <div class="orbital-close" @click="closeDialog('curve')"><i class="el-dialog__close el-icon el-icon-close"></i></div>
                    <div class="dialog-content">
                        <div class="container" id="lineContainer"></div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </template>
    </CommonDialog> -->
  </div>
</template>
<script>
import CommonDialog from '@/components/common/CommonDialog/index.vue';
import * as echarts from 'echarts';
export default {
  props: {
    inspectionObject: {
      type: Array,
      default: [],
    },
    cabinetObject: {
      type: Array,
      default: [],
    },
  },
  components: { CommonDialog },
  data() {
    return {
      loadInspection: true,
      setFulltime: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000; // 可选未来天、可选当前天、不可选历史天
        },
      },
      currentCtl: '',
      acuTimeControl: [
        { label: 'T0时间', iconSrc: 'time', selIconSrc: 'time-active' },
        // { label: '轨道', iconSrc: 'guidao', selIconSrc: 'guidao-active' },
        { label: '巡检', iconSrc: 'xunjian', selIconSrc: 'xunjian-active' },
      ],
      showT0: false,
      // showOrbital: false,
      showInspection: false,
      // showCurve: false,
      // showPreview:false,
      timeT0: '',
      // oribitType: '',
      // oribitOpition: [
      //   { label: '两行', value: 'twoLines' },
      //   { label: '瞬根', value: 'insRadical' },
      //   { label: '程引', value: 'proQuotation' }
      // ],
      // 数据预览
      // previewData: [
      //   { date:'2022-08-12 12:12:00.111',az_angle: 'GA-04',pi_angle: 'GA-04', },
      //   { date:'2022-08-12 12:12:00.111',az_angle: 'GA-04',pi_angle: 'GA-04', },
      //   { date:'2022-08-12 12:12:00.111',az_angle: 'GA-04',pi_angle: 'GA-04', },
      //   { date:'2022-08-12 12:12:00.111',az_angle: 'GA-04',pi_angle: 'GA-04', },
      //   { date:'2022-08-12 12:12:00.111',az_angle: 'GA-04',pi_angle: 'GA-04', },
      // ],
      // overtopObject: [
      //   { label: '过顶时刻', value: '0000-00-00 00:00:00' },
      //   { label: '过顶方位角(°)', value: 0.000 },
      //   { label: '方位最大速度(°/S)', value: 0.000 },
      //   { label: '过顶俯仰角(°)', value: 0.000 },
      //   { label: '俯仰最大速度(°/S)', value: 0.000 },
      // ],
      // overtopObject: [
      //   { label: '过顶时刻', value: '0000-00-00 00:00:00' },
      //   { label: '过顶方位角(°)', value: 0.000 },
      //   { label: '方位最大速度(°/S)', value: 0.000 },
      //   { label: '过顶俯仰角(°)', value: 0.000 },
      //   { label: '俯仰最大速度(°/S)', value: 0.000 },
      // ],
      // enterSiteObject: [
      //   { label: '进站时刻', value: '0000-00-00 00:00:00' },
      //   { label: '进站方位角(°)', value: 0.000 },
      //   { label: '进站俯仰角(°)', value: 0.000 },
      // ],
      // outSiteObject: [
      //   { label: '出站时刻', value: '0000-00-00 00:00:00' },
      //   { label: '出站方位角(°)', value: 0.000 },
      //   { label: '出站俯仰角(°)', value: 0.000 },
      // ],
    };
  },
  mounted() {
    this.cancel();
  },
  methods: {
    cancel() {
      this.showT0 = false;
    },
    // ACU T零时加载指令
    async loadT0Instruct() {
      if (!this.timeT0) {
        if (document.getElementsByClassName('el-message').length !== 0) return;
        this.$message.warning('请选择T0时!');
        return;
      }
      const params = {
        stationId: this.$route.query.stationId,
        timestamp: new Date(this.timeT0).getTime(),
      };
      const data = await this.$api.acuT0LoadInstruct(params);
      if (data.isSuccess) {
        this.$message.success(data.resultMsg);
        this.showT0 = false;
      }
    },
    tabHandle(n) {
      this.currentCtl = n;
      if (n === 0) {
        this.showT0 = true;
      }
      // else if (n === 1) {
      //   this.showPreview = false;
      //   this.showCurve = false;
      //   this.showOrbital = true;
      // }
      else {
        this.showInspection = true;
      }
    },
    // // 预览
    // previewHandle(){
    //     this.showPreview = true;
    // },
    // // 关闭 表格/折线图 弹窗
    // closeDialog(type){
    //     if(type == 'data'){
    //         this.showPreview = false;
    //     }else{
    //         this.showCurve = false;
    //     }
    // },
    // // 生成折线图
    // creatCurve(){
    //     this.$nextTick(()=>{
    //         if(this.showCurve) return;
    //         this.initEchars();
    //     });
    // },
    // initEchars(){
    //     var myChart = echarts.init(document.getElementById('lineContainer'));
    //     if (myChart != null && myChart != "" && myChart != undefined) {
    //       myChart.dispose(); //销毁
    //      }
    //      const chartDom = document.getElementById('lineContainer');
    //            var myChart = echarts.init(chartDom);
    //             var option;
    //             option = {
    //             xAxis: {
    //                 type: 'category',
    //                 data: [60, 120, 160, 240, 300, 360]
    //             },
    //             yAxis: {
    //                 type: 'value'
    //             },
    //             series: [
    //                 {
    //                 data: [230,50,150,20,180,70],
    //                 type: 'line'
    //                 }
    //             ],
    //             grid: {
    //                 top: "40px",
    //                 left:'50px',
    //                 right:'40px',
    //                 bottom: "40px"
    //                 },
    //             };
    //         option && myChart.setOption(option);
    //         this.showCurve = true;
    // },
    // dateTransform (e) {
    //   let date = new Date(e);
    //   let year,mouth,day,hour, minute, second,milliseconds;
    //   year = date.getFullYear();
    //   mouth = date.getMonth()+1;
    //   day = date.getDate();
    //   hour = date.getHours();
    //   minute = date.getUTCMinutes();
    //   second = date.getSeconds();
    //   hour = hour < 10 ? "0" + hour : hour;
    //   minute = minute < 10 ? "0" + minute : minute;
    //   second = second < 10 ? "0" + second : second;
    //   milliseconds = date.getMilliseconds();
    //   let handleTime = year+"-"+mouth+"-"+day+" "+hour + ":" + minute + ":" + second + "." + milliseconds;
    //   console.log(e,handleTime);
    //   return handleTime;
    // }
  },
};
</script>
<style lang="scss" scoped>
.acu-time-control {
  // width: 474px;
  height: 57px;
  background: #ebf0f6;
  border-radius: 5px;
  overflow: hidden;
}
.acu-control-item {
  // width: 158px;
  width: 306px;
  font-weight: 500;
  line-height: 34px;
  color: var(--yx-font-2);
  cursor: pointer;
  text-align: center;
  line-height: 57px;
  font-size: 20px;
}
.active-control-item {
  background: var(--yx-font-8);
  color: var(--yx-font-1);
}
.acu-control-item img {
  width: 32px;
  vertical-align: middle;
}
.el-dialog.common-dialog.task-detail {
  .dialog-content {
    padding: 20px;
  }
  .content {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .content-item {
      width: 108px;
      margin-bottom: 0;
      :deep() {
        .el-input-group__append {
          padding: 0 10px;
        }
      }
    }
    .content-item-time {
      width: auto;
      margin-right: 10px;
      :deep() {
        .el-date-editor.el-input,
        .el-date-editor.el-input__inner {
          width: 200px;
        }
        .el-input__icon {
          line-height: 28px;
        }
      }
    }
  }
}
.el-dialog.common-dialog.task-check {
  .dialog-content {
    padding: 20px 30px;
    // width: 47%;
    .content-left-tianxian {
      width: 100%;
    }
    .content-left-item {
      width: 47%;
      margin-bottom: 20px;
      .item-box-model {
        width: 120px;
        margin-top: 12px;
        background: rgba(249, 251, 252, 0.39);
        border: 1px solid #c3c9d2;
        opacity: 1;
        border-radius: 4px;
      }
    }
    .content-right {
      .right-item {
        margin-top: 24px;
        margin-right: 10px;
        .right-item-label {
          min-width: 85px;
          max-width: 150px;
        }
        .right-item-model {
          width: max-content;
          max-height: 58px;
          background: rgba(249, 251, 252, 0.39);
          border: 1px solid #c3c9d2;
          border-radius: 4px;
          padding: 10px;
          margin-top: 8px;
        }
      }
      .content-right-box::after {
        content: '';
        flex-grow: 0.95;
      }
    }
  }
}

.left-item-title {
  height: 27px;
  border-bottom: 1px solid #8a9cb8;
  color: var(--yx-font-4);
}
.item-box-label {
  width: 70px;
  color: var(--yx-font-6);
}
.right-item-label {
  margin-right: 10px;
}
.equipment-status {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: var(--yx-layer-1);
  border: 1px solid var(--yx-border-2);
  border-radius: 50%;
}
.equipment-status.active {
  background: var(--yx-success-2);
}
.btn-box {
  width: 270px;
  height: 65px;
  margin-right: 20px;
  align-content: space-between;
  .btn-show {
    width: 90px;
  }
  .btn-data {
    width: 150px;
  }
  .btn-item {
    display: inline-block;
    padding: 0 16px;
    background: var(--yx-font-2);
    min-width: 60px;
    height: 28px;
    line-height: 26px;
    cursor: pointer;
    white-space: nowrap;
    border: 1px solid var(--yx-default-btn);
    text-align: center;
    border-radius: 4px;
    color: var(--yx-font-1);
    font-size: 16px;
    font-weight: 500;
  }
  .btn-item.active {
    background: var(--yx-default-btn);
  }
}
.orbital-type {
  color: var(--yx-font-2);
}
.guodin {
  padding: 22px 26px;
  height: 182px;
}

.orbital-module {
  margin-top: 24px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid var(--yx-border-3);
  box-shadow: 0px 3px 6px #d6e3f3;
  border-radius: 2px;
}
.orbital-label {
  display: inline-block;
  color: var(--yx-font-2);
}
.orbital-label-long {
  display: inline-block;
  width: 85px;
  color: var(--yx-font-2);
  text-align: right;
}
.orbital-value {
  display: inline-block;
  width: 130px;
  height: 33px;
  margin-left: 10px;
  padding: 0 14px;
  background: rgba(51, 70, 129, 0.04);
  font-size: 24px;
  font-family: OPPOSans;
  font-weight: bold;
  color: var(--yx-font-9);
}
.orbital-value-long {
  width: 407px;
  padding: 0 14px;
}
.jinzhan,
.chuzhan {
  height: 166px;
}
.orbital-item-title {
  height: 27px;
  color: var(--yx-font-4);
}
.orbital-item-line {
  height: 1px;
  background: rgba(138, 156, 184, 0.39);
}
.task-orbital {
  position: relative;
}
.orbital-box {
  position: absolute;
  right: -620px;
  top: -57px;
  z-index: 999;
  .orbital-model {
    width: 600px;
    border: #8a9cb8 2px solid;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    .orbital-header {
      height: 56px;
      padding: 18px 18px 18px 24px;
      background-position: 34px;
      background: #485c7c url('@/assets/images/common/dialog-header-bg.png') no-repeat;
      color: var(--yx-font-1);
      font-size: 18px;
      line-height: 16px;
    }
    .dialog-content {
      background: #f4f6fa;
      border-radius: 0 0 10px 10px;
      .container {
        width: 600px;
        height: 300px;
      }
    }
  }
}
.orbital-close {
  width: 20px;
  height: 20px;
  background: #579af5;
  cursor: pointer;
  font-size: 16px;
  border-radius: 50%;
  color: var(--yx-font-1);
  font-weight: 600;
  position: absolute;
  top: 20px;
  right: 20px;
  text-align: center;
}
</style>
