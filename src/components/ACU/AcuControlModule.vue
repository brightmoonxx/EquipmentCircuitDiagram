<!--
 * @Author: huangzhendong
 * @Date: 2022-11-28 09:14:31
 * @LastEditors: WangXin
 * @LastEditTime: 2023-02-07 13:52:17
 * @FilePath: \code\src\components\ACU\AcuControlModule.vue
-->
<template>
  <div class="wrap">
    <!-- 手动 -->
    <!-- <div v-show="navIndex == 0" class="flex justify-between">
      <div>
        <div v-for="handItem in manualObject" :key="handItem.title" class="mg-bottom-30">
          <div class="acu-control-title mg-bottom-10">[ {{ handItem.title }} ]</div>
          <el-radio-group v-model="handItem.value">
            <el-radio v-for="second in handItem.options" :label="second.value" :key="second.label" class="acu-control-radio">{{ second.label }}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="acu-control-buju">
        <div class="acu-control-title mg-bottom-10">[ 箭头步距 ]</div>
        <el-radio-group v-model="manuqlStep" class="content-form-item buju-radio-group">
          <el-radio :label="0.01" class="acu-control-radio mg-top-30">0.01V</el-radio>
          <el-radio :label="0.1" class="acu-control-radio mg-top-30">0.1V</el-radio>
          <el-radio :label="999" class="acu-control-radio mg-top-30">
            <el-input class="control-radio-inp acu-inp-40" v-model="val1" maxlength="10">
              <template class="control-radio-unit" slot="append">V</template>
            </el-input>
          </el-radio>
        </el-radio-group>
      </div>
      <Azimuthal></Azimuthal>
    </div> -->
    <!-- 指向 -->
    <div v-show="navIndex == 0" class="flex justify-between">
      <!-- <div class="mg-bottom-30">
          <div class="acu-control-title mg-bottom-10">[ 预置位置 ]</div>
          <div class="flex align-items-end">
            <el-select v-model="presetPosition" class="acu-phase-value normal-select acu-inp-40">
              <el-option v-for="(opt, idx) in presetObject" :key="idx" :label="opt" :value="opt"></el-option>
            </el-select>
            <div class="acu-control-btn acu-control-btn-active">保存</div>
            <div class="acu-control-btn">删除</div>
          </div>
          <div class="flex align-items-end mg-top-20">
            <div class="acu-preset-box flex flex-wrap justify-between">
              <div class="mg-bottom-10">
                <p class="text-center acu-numled-label">AZ</p>
                <el-input v-model="AZ.value1" :disabled="preset1 == 2 || preset1 == 3" class="acu-inp-40 acu-inp-main" :class="{'acu-inp-readonly':preset1 == 2 || preset1 == 3}"></el-input>
              </div>
              <div>
                <p class="text-center acu-numled-label">EL</p>
                <el-input v-model="EL.value1" :disabled="preset1 == 2 || preset1 == 3" class="acu-inp-40 acu-inp-main" :class="{'acu-inp-readonly':preset1 == 2 || preset1 == 3}"></el-input>
              </div>
              <div><el-input v-model="AZ.value2" :disabled="preset1 == 1 || preset1 == 3" class="acu-inp-40 acu-inp-main" :class="{'acu-inp-readonly':preset1 == 1 || preset1 == 3}"></el-input></div>
              <div><el-input v-model="EL.value2" :disabled="preset1 == 1 || preset1 == 3" class="acu-inp-40 acu-inp-main" :class="{'acu-inp-readonly':preset1 == 1 || preset1 == 3}"></el-input></div>
            </div>
            <div class="acu-preset-radio">
              <el-radio v-model="preset1" label="1" class="acu-control-radio">预置位置</el-radio>
              <el-radio v-model="preset1" label="2" class="acu-control-radio">当前位置</el-radio>
            </div>
          </div>
          <div class="flex justify-around align-items-center">
            <el-radio v-model="preset2" label="1" class="acu-control-radio">大地系</el-radio>
            <el-radio v-model="preset2" label="2" class="acu-control-radio">座驾系</el-radio>
            <div v-for="item in colPresetBtn" @click="presetStatus=item.label" class="acu-control-btn" :class="{'acu-control-btn-active':presetStatus === item.label}" :key="item.name">{{item.name}}</div>
          </div>
        </div> -->
      <div class="flex flex-direction-column justify-between">
        <div>
          <div class="acu-control-title mg-bottom-10">进站时间</div>
          <el-input class="control-radio-inp acu-control-time acu-inp-250" v-model="inTime" readonly></el-input>
        </div>
        <div>
          <div class="acu-control-title mg-bottom-10">出站时间</div>
          <el-input class="control-radio-inp acu-control-time acu-inp-250" v-model="outTime" readonly></el-input>
        </div>
      </div>
      <!-- 箭头步距 -->
      <div class="acu-control-buju1">
        <div class="acu-control-title mg-bottom-10">[ 箭头步距 ]</div>
        <el-radio-group v-model="pointStep" class="content-form-item buju-radio-group">
          <el-radio label="0.06" class="acu-control-radio mg-top-30">0.06°(1密位)</el-radio>
          <el-radio label="0.12" class="acu-control-radio mg-top-30">0.12°(2密位)</el-radio>
          <el-radio label="custom" class="acu-control-radio mg-top-30">
            <el-input class="control-radio-inp acu-inp-40" v-model="val2" maxlength="10">
              <template class="control-radio-unit" slot="append">密位</template>
            </el-input>
          </el-radio>
        </el-radio-group>
      </div>
      <!-- 方位控制 -->
      <Azimuthal :step="step()" :position="position"></Azimuthal>
    </div>
    <!-- 数引-->
    <!-- <div v-show="navIndex == 2" class="flex justify-between">
      <div class="acu-numled-wrap flex flex-wrap justify-between">
        <div v-for="numItem in numLedObject" :key="numItem.label">
          <p class="acu-numled-label mg-bottom-5 mg-left-10">{{ numItem.label }}</p>
          <el-input v-model="numItem.value" class="acu-inp-40 mg-bottom-20"></el-input>
        </div>
      </div>
      <div class="acu-control-buju1">
        <div class="acu-control-title mg-bottom-10">[ 箭头步距 ]</div>
        <el-radio-group v-model="numStep" class="content-form-item buju-radio-group">
          <el-radio :label="0.06" class="acu-control-radio mg-top-30">0.06°(1密位)</el-radio>
          <el-radio :label="0.12" class="acu-control-radio mg-top-30">0.12°(2密位)</el-radio>
          <el-radio :label="999" class="acu-control-radio mg-top-30">
            <el-input class="control-radio-inp acu-inp-40" v-model="val4" maxlength="10">
              <template class="control-radio-unit" slot="append">密位</template>
            </el-input>
          </el-radio>
        </el-radio-group>
      </div>
      <Azimuthal></Azimuthal>
    </div> -->
    <!-- 程引 -->
    <!-- <div v-show="navIndex == 3" class="flex justify-between">
      <div>
        <div class="acu-control-title mg-bottom-10">进站时间</div>
        <el-input class="control-radio-inp acu-control-time acu-inp-250" v-model="inTime"></el-input>
        <div class="acu-control-title mg-top-30 mg-bottom-10">[ 时间偏置 ]</div>
        <div>
          <el-radio v-model="timeUnit" label="s" class="acu-control-radio mg-top-10">s</el-radio>
          <el-radio v-model="timeUnit" label="ms" class="acu-control-radio mg-top-10">ms</el-radio>
        </div>
        <el-input-number v-model="num" :disabled="!timeUnit" :min="1" :max="10" class="acu-control-num mg-top-10 acu-inp-40"></el-input-number>
      </div>
      <div class="acu-control-buju2">
        <div>
          <div class="acu-control-title mg-bottom-10">出站时间</div>
          <el-input class="control-radio-inp acu-control-time acu-inp-250" v-model="outTime"></el-input>
        </div>
        <div class="acu-control-title mg-top-30 mg-bottom-10">[ 箭头步距 ]</div>
        <el-radio-group v-model="chenyinStep" class="acu-chenyin-radio flex flex-wrap buju-radio-group">
          <el-radio :label="0.06" class="acu-control-radio mg-top-10">0.06°(1密位)</el-radio>
          <el-radio :label="0.12" class="acu-control-radio mg-top-10">0.12°(2密位)</el-radio>
          <el-radio :label="999" class="acu-control-radio mg-top-20">
            <el-input class="control-radio-inp chenyin-radio-inp acu-inp-40" v-model="val3" maxlength="10">
              <template class="control-radio-unit" slot="append">密位</template>
            </el-input>
          </el-radio>
        </el-radio-group>
      </div>
      <Azimuthal></Azimuthal>
    </div> -->
    <!-- 收藏 -->
    <!-- <div v-show="navIndex == 4" class="flex justify-between">
      <div>
        <div class="mg-bottom-30">
          <div class="flex align-items-end mg-top-20">
            <div class="acu-scanning-box flex flex-wrap justify-between">
              <div class="mg-bottom-20">
                <p class="text-center acu-numled-label mg-bottom-5">方位角度</p>
                <el-input v-model="Col1.value1" :disabled="collection == 2 || collection == 3" class="acu-inp-40 acu-inp-main" :class="{'acu-inp-readonly':collection == 2 || collection == 3}"></el-input>
              </div>
              <div>
                <p class="text-center acu-numled-label mg-bottom-5">俯仰角度</p>
                <el-input v-model="Col2.value1" :disabled="collection == 2 || collection == 3" class="acu-inp-40 acu-inp-main" :class="{'acu-inp-readonly':collection == 2 || collection == 3}"></el-input>
              </div>
              <div><el-input v-model="Col1.value2" :disabled="collection == 1 || collection == 3" class="acu-inp-40 acu-inp-main" :class="{'acu-inp-readonly':collection == 1 || collection == 3}"></el-input></div>
              <div><el-input v-model="Col2.value2" :disabled="collection == 1 || collection == 3" class="acu-inp-40 acu-inp-main" :class="{'acu-inp-readonly':collection == 1 || collection == 3}"></el-input></div>
            </div>
            <div class="acu-preset-radio">
              <el-radio v-model="collection" label="1" class="acu-control-radio">收藏角度1</el-radio>
              <el-radio v-model="collection" label="2" class="acu-control-radio">收藏角度2</el-radio>
            </div>
          </div>
          <div class="mg-y-20 mg-left-50"><el-checkbox v-model="collectPitch">仅收藏俯仰</el-checkbox></div>
          <div class="flex mg-left-20">
            <div v-for="item in colPresetBtn" @click="collectionStatus=item.label" class="acu-control-btn" :class="{'acu-control-btn-active':collectionStatus === item.label}" :key="item.name">{{item.name}}</div>
          </div>
        </div>
      </div>
    </div> -->
    <!-- 倾斜控制-->
    <!-- <div v-show="navIndex == 5" class="flex justify-between">
      <div>
        <div class="acu-control-title mg-bottom-10">[ 倾斜手动控制 ]</div>
        <div class="flex mg-top-20">
          <div>
            <p class="acu-numled-label mg-bottom-15">速度 ({{ collection=='1'? 'v':'°/s'}})</p>
            <el-input v-model="speed" class="acu-inp-40" maxlength="5"></el-input>
          </div>
          <div class="acu-preset-radio">
            <el-radio v-model="collection" label="1" class="acu-control-radio">速度模式</el-radio>
            <el-radio v-model="collection" label="2" class="acu-control-radio">位置模式</el-radio>
          </div>
        </div>
        <div class="flex mg-top-30">
          <div v-for="item in tiltBtn" @click="tiltStatus=item.label" class="acu-control-btn" :class="{'acu-control-btn-active':tiltStatus === item.label}" :key="item.name">{{item.name}}</div>
        </div>
      </div>
      <div class="acu-control-buju">
        <div class="acu-control-title mg-bottom-10">[ 位置控制 ]</div>
            <p class="acu-numled-label mg-bottom-15">位置</p>
            <el-input v-model="tiltPosition" class="acu-inp-40" maxlength="5"></el-input>
          <div class="flex mg-top-30">
            <div v-for="item in positionBtn" @click="positionStatus=item.label" class="acu-control-btn" :class="{'acu-control-btn-active':positionStatus === item.label}" :key="item.name">{{item.name}}</div>
        </div>
      </div>
      <div>
        <div class="acu-control-title mg-bottom-10">[ 预置控制 ]</div>
        <div class="flex align-items-end">
          <div>
            <p class="acu-numled-label mg-bottom-15">位置</p>
            <el-input v-model="presetPosition" class="acu-inp-40" maxlength="5"></el-input>
          </div>
          <div class="acu-control-btn acu-control-btn-active">保存</div>
        </div>
        <div class="mg-top-20">
          <p class="acu-numled-label mg-bottom-15">卷绕角</p>
          <el-input v-model="windingAngle" readonly class="acu-inp-readonly"></el-input>
        </div>
      </div>
    </div> -->
    <!-- 扫描 -->
    <!-- <div v-show="navIndex == 6" class="flex justify-between">
        <div class="mg-bottom-30">
            <div class="acu-scanning-box flex flex-wrap justify-between">
                <div class="acu-control-title mg-bottom-10">[ X轴扫描参数 ]</div>
              <div class="mg-bottom-20">
                <p class="text-center acu-numled-label mg-bottom-5">扫描范围(°)</p>
                <el-select v-model="scanX.scope" :disabled="scanStep=='y'  || scanStep=='neither'" class="acu-inp-main normal-select acu-inp-40" :class="{'acu-inp-readonly':scanStep=='y'  || scanStep=='neither'}">
                  <el-option v-for="(opt, idx) in scanRangeObject" :key="idx" :label="opt" :value="opt"></el-option>
                </el-select>
                </div>
              <div>
                <p class="text-center acu-numled-label mg-bottom-5">扫描速度(°/S)</p>
                <el-select v-model="scanX.speed" :disabled="scanStep=='y'  || scanStep=='neither'" class="acu-inp-main normal-select acu-inp-40" :class="{'acu-inp-readonly':scanStep=='y'  || scanStep=='neither'}">
                  <el-option v-for="(opt, idx) in scanSpeedObject" :key="idx" :label="opt" :value="opt"></el-option>
                </el-select>
                </div>
            </div>
            <div class="acu-scanning-box flex flex-wrap justify-between mg-top-10">
                <div class="acu-control-title mg-bottom-10">[ Y轴扫描参数 ]</div>
              <div class="mg-bottom-20">
                <p class="text-center acu-numled-label mg-bottom-5">扫描范围(°)</p>
                <el-select v-model="scanY.scope" :disabled="scanStep=='x' || scanStep=='neither'" class="acu-inp-main normal-select acu-inp-40" :class="{'acu-inp-readonly':scanStep=='x' || scanStep=='neither'}">
                  <el-option v-for="(opt, idx) in scanRangeObject" :key="idx" :label="opt" :value="opt"></el-option>
                </el-select>
                </div>
              <div>
                <p class="text-center acu-numled-label mg-bottom-5">扫描速度(°/S)</p>
                <el-select v-model="scanY.speed" :disabled="scanStep=='x' || scanStep=='neither'" class="acu-inp-main normal-select acu-inp-40" :class="{'acu-inp-readonly':scanStep=='x' || scanStep=='neither'}">
                  <el-option v-for="(opt, idx) in scanSpeedObject" :key="idx" :label="opt" :value="opt"></el-option>
                </el-select>
              </div>
            </div>
        </div>
      <div>
        <div class="acu-control-title mg-bottom-10">[ 扫描方式 ]</div>
        <el-radio-group v-model="scanStep" class="content-form-item buju-radio-group">
          <el-radio label="x" class="acu-control-radio mg-top-10">X轴扫描</el-radio>
          <el-radio label="y" class="acu-control-radio mg-top-30">Y轴扫描</el-radio>
          <el-radio label="both" class="acu-control-radio mg-top-30">双轴扫描</el-radio>
        </el-radio-group>
        <div class="flex mg-top-20">
          <div v-for="item in scanBtn" @click="scanStatus=item.label" class="acu-control-btn" :class="{'acu-control-btn-active':scanStatus === item.label}" :key="item.name">{{item.name}}</div>
        </div>
      </div>
      <div class="acu-control-buju">
        <div class="acu-control-title mg-bottom-10">[ 待机扫描 ]</div>
        <el-radio-group v-model="Standby" class="content-form-item buju-radio-group">
            <el-radio label="1" class="acu-control-radio mg-top-10">正常待机</el-radio>
            <el-radio label="2" class="acu-control-radio mg-top-30">待机扫描</el-radio>
        </el-radio-group>
      </div>
    </div> -->
  </div>
</template>
<script>
import websocket from '../../utils/socket';
import baseUrl from '../../request/baseUrl';
import Azimuthal from '@/components/ACU/AzimuthalControl';
export default {
  components: { Azimuthal },
  props: {
    navIndex: {
      type: Number,
      default: 0,
    },
    position: {
      type: Object,
      default: { x: 0, y: 0 },
    },
  },
  data() {
    return {
      planSocket: null,
      isUp: false,
      isDown: false,
      isLeft: false,
      isRight: false,
      // 手动
      manualObject: [
        {
          title: '手杆选项',
          value: '',
          options: [
            { label: '双轴', value: 1 },
            { label: '仅方位', value: 2 },
            { label: '仅俯仰', value: 3 },
          ],
        },
        {
          title: '手杆速度选择',
          value: '',
          options: [
            { label: '低速', value: 1 },
            { label: '中速', value: 2 },
            { label: '高速', value: 3 },
          ],
        },
        {
          title: '控制模式',
          value: '',
          options: [
            { label: '速度模式', value: 1 },
            { label: '位置模式', value: 2 },
          ],
        },
      ],
      val1: 0,
      val2: 0,
      val3: 0,
      val4: 0,
      manuqlStep: '',
      pointStep: '',
      chenyinStep: '',
      numStep: '',
      scanStep: 'neither',
      presetPosition: '',
      presetObject: ['128.5', '110'],
      preset1: 3,
      preset2: '',
      AZ: { value1: '1', value2: '2' },
      EL: { value1: '1', value2: '2' },
      inTime: '-',
      outTime: '-',
      num: 1,
      timeUnit: '',
      numLedObject: [
        { label: 'AZ', value: '0' },
        { label: 'EL', value: '0' },
        { label: 'Va', value: '0' },
        { label: 'Ve', value: '0' },
        { label: 'X', value: '0' },
        { label: 'Y', value: '0' },
        { label: 'Z', value: '0' },
        { label: '当前点时', value: '0' },
        { label: '外推', value: '0' },
        { label: '外推', value: '0' },
        { label: '外推', value: '0' },
      ],
      collection: '1',
      Col1: { value1: '1', value2: '2' },
      Col2: { value1: '1', value2: '2' },
      collectPitch: false,
      speed: 0,
      tiltPosition: '100',
      presetPosition: '100',
      windingAngle: '86.036',
      Standby: '',
      scanRangeObject: ['0.1', '0.2', '0.3', '0.4', '0.5', '1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0'],
      scanSpeedObject: ['0.001', '0.002', '0.005', '0.01', '0.02', '0.03', '0.05', '0.1', '0.2', '0.5'],
      scanX: {
        scope: 0.1,
        speed: 0.001,
      },
      scanY: {
        scope: 0.1,
        speed: 0.001,
      },
      scanStatus: 'start',
      tiltStatus: 'reverse',
      positionStatus: 'start',
      collectionStatus: 'start',
      presetStatus: 'start',
      scanBtn: [
        { name: '运行', label: 'start' },
        { name: '停止', label: 'stop' },
        { name: '自跟踪', label: 'autotracking' },
      ],
      tiltBtn: [
        { name: '逆转', label: 'reverse' },
        { name: '停止', label: 'stop' },
        { name: '顺转', label: 'rotation' },
      ],
      positionBtn: [
        { name: '开始', label: 'start' },
        { name: '停止', label: 'stop' },
      ],
      positionBtn: [
        { name: '开始', label: 'start' },
        { name: '停止', label: 'stop' },
      ],
      colPresetBtn: [
        { name: '运行', label: 'start' },
        { name: '停止', label: 'stop' },
      ],
    };
  },
  mounted() {
    this.planWs();
    this.getCurrentPlan();
  },
  methods: {
    // 步距
    step() {
      if (this.pointStep == 'custom') {
        return this.val2;
      }
      return this.pointStep;
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
          if (e.noticeType !== 'warning') return;
          this.getCurrentPlan();
        },
      };
      this.planSocket = new websocket(options);
    },
    async getCurrentPlan() {
      // const params = {
      //   anteId: this.$route.query.stationId,
      // };
      const { data } = await this.$api.getCurrentPlan(this.$route.query.stationId);
      if (data) {
        this.inTime = data.startTime || '-';
        this.outTime = data.endTime || '-';
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.acu-control-title {
  font-size: 24px;
  color: var(--yx-font-2);
}
.acu-control-radio {
  margin-right: 50px;
  :deep() {
    .el-radio__label {
      font-size: 24px;
      color: #7e93af;
    }
    .el-radio__input.is-checked + .el-radio__label {
      color: #5e7495;
    }
    .el-input-group--append .el-input__inner,
    .el-input-group__prepend {
      background: rgba(242, 248, 253, 0.39);
      border: 1px solid #5e7495;
      height: 40px;
      font-size: 24px;
      color: #7e93af;
      padding: 0 10px;
    }
    .el-input-group__append,
    .el-input-group__prepend {
      padding: 0 10px;
      font-size: 24px;
      color: #7e93af;
      border: 1px solid #5e7495;
    }
  }
}

.acu-control-buju {
  width: 180px;
}
.acu-control-buju1 {
  width: 220px;
}
.acu-control-buju2 {
  width: 360px;
}

.acu-control-btn {
  width: 72px;
  margin-left: 15px;
}
.acu-preset-box {
  width: 272px;
}
.acu-preset-radio {
  height: 80px;
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 5px;
}
.acu-preset-value {
  width: 127px;
  background-color: var(--yx-font-7);
  border-radius: 4px;
  margin-top: 8px;
  :deep() {
    .el-input__inner,
    .el-textarea__inner {
      height: 32px;
      font-size: 20px;
      font-weight: bold;
      color: var(--yx-font-9) !important;
    }
  }
}

.acu-chenyin-radio {
  width: 410px;
}
.chenyin-radio-inp {
  width: 148px;
}
.acu-control-time {
  width: 260px;
  :deep() {
    .el-input__inner,
    .el-textarea__inner {
      height: 40px;
      font-size: 24px;
      color: var(--yx-font-3);
    }
  }
}
.acu-control-num {
  width: 128px;
  :deep() {
    .el-input-number__decrease,
    .el-input-number__increase {
      width: 45px;
      height: 39px;
      background: rgba(236, 238, 244, 0.39);
      color: #7e93af;
      font-size: 24px;
    }
    .el-input .el-input__inner {
      padding: 0 45px;
      height: 39px;
      font-size: 24px;
      color: #7e93af;
    }
  }
}
.wrap :deep(.el-radio__input) {
  vertical-align: baseline;
}
.buju-radio-group .acu-control-radio {
  :deep() {
    .el-input-group--append .el-input__inner {
      border: none;
    }
    .el-input-group__append {
      border: none;
    }
    .el-input-group {
      border-radius: 4px;
      border: 1px solid var(--yx-border-1);
    }
  }
}
.acu-numled-wrap {
  width: 590px;
  margin-right: 10px;
}
.acu-numled-wrap::after {
  content: '';
  width: 128px;
}
.acu-numled-label {
  font-size: 18px;
  color: var(--yx-font-5);
}
.acu-inp-40 {
  :deep() {
    .el-input__inner {
      width: 128px;
      height: 40px !important;
      background: var(--yx-font-7);
      border: 1px solid var(--yx-font-5);
      border-radius: 4px;
      font-size: 20px;
      font-weight: bold;
      color: var(--yx-font-3);
    }
  }
}
.acu-inp-250 {
  :deep() {
    .el-input__inner {
      width: 260px;
      height: 40px !important;
      background: var(--yx-font-7);
      border: 1px solid var(--yx-font-5);
      border-radius: 4px;
    }
  }
}
.acu-scanning-box {
  width: 275px;
}
.acu-inp-main {
  :deep() {
    .el-input__inner {
      color: var(--yx-font-9) !important;
    }
  }
}
.acu-inp-readonly {
  :deep() {
    .el-input__inner {
      width: 128px;
      height: 40px;
      background: #e4e8f0;
      border-radius: 4px;
      font-size: 20px;
      color: var(--yx-font-9);
      font-weight: bold;
      border: none;
    }
  }
}
.acu-control-btn {
  width: 90px;
  height: 40px;
  background: var(--yx-font-2);
  border-radius: 4px;
  color: var(--yx-font-1);
  font-size: 22px;
  text-align: center;
  line-height: 37px;
  cursor: pointer;
}
.acu-control-btn-active {
  width: 90px;
  height: 40px;
  background: var(--yx-font-8);
  box-shadow: 0px 3px 6px rgba(56, 125, 255, 0.5);
  border-radius: 4px;
  color: var(--yx-font-1);
  font-size: 22px;
  text-align: center;
  line-height: 37px;
  cursor: pointer;
}
</style>
