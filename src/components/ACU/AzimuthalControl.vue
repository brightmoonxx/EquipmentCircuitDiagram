<!--
 * @Author: huangzhendong
 * @Date: 2022-12-13 14:38:54
 * @LastEditors: WangXin
 * @LastEditTime: 2023-01-04 15:12:10
 * @FilePath: \code\src\components\ACU\AzimuthalControl.vue
-->
<template>
  <div>
    <div class="acu-control-title mg-bottom-10">[ 方位控制 ]</div>
    <div class="flex">
      <div class="acu-control-bearing" v-permission>
        <div @click="calculHandle('y', 'add')" class="acu-bearing-y acu-bearing-up"></div>
        <div @click="calculHandle('y', 'sub')" class="acu-bearing-y acu-bearing-down"></div>
        <div @click="calculHandle('x', 'sub')" class="acu-bearing-x acu-bearing-left"></div>
        <div @click="calculHandle('x', 'add')" class="acu-bearing-x acu-bearing-right"></div>
        <div @click="sendPointInstruct({ x: 0, y: 0 })" class="acu-bearing-center">0</div>
      </div>
      <div class="acu-control-xy mg-left-20">
        <p class="acu-control-title mg-bottom-5 mg-left-5">X</p>
        <el-input v-model="position.x" class="acu-phase-value1 acu-inp-40" readonly></el-input>
        <p class="acu-control-title mg-top-10 mg-bottom-5 mg-left-5">Y</p>
        <el-input v-model="position.y" class="acu-phase-value1 acu-inp-40" readonly></el-input>
      </div>
    </div>
  </div>
</template>
<script>
import { floatAdd, floatMinus } from '@/utils/utils.js';
export default {
  props: {
    step: {
      type: String,
      default: '',
    },
    // position: {
    //   type: Object,
    //   default: { x: 0, y: 0 },
    // },
  },
  data() {
    return {
      // param: this.position,
      position: {
        x: 0,
        y: 0,
      },
    };
  },
  methods: {
    calculHandle(e, type) {
      let param = JSON.parse(JSON.stringify(this.position));
      // if (!param.x || !param.y) {
      //   this.$message.warning('暂无方位数据!');
      //   return;
      // }
      if (!this.step) {
        this.$message.warning('请选择箭头步距!');
        return;
      }

      if (type == 'add') {
        param[e] = floatAdd(this.position[e], this.step);
      } else {
        param[e] = floatMinus(this.position[e], this.step);
      }
      this.sendPointInstruct(param, type, e);
    },
    // 初始化配置
    async sendPointInstruct(param, type, e) {
      const params = {
        azimuth: param.x,
        pitch: param.y,
        stationId: this.$route.query.stationId,
      };
      const data = await this.$api.acuPointInstruct(params);
      if (data.isSuccess) {
        if (type == 'add') {
          this.position[e] += Number(this.step);
        } else {
          this.position[e] -= Number(this.step);
        }
        this.$message.success(data.resultMsg);
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
.acu-control-bearing {
  width: 146px;
  height: 148px;
  position: relative;
}
.acu-bearing-up {
  position: absolute;
  top: 0;
  left: 39.5px;
}
.acu-bearing-down {
  position: absolute;
  bottom: 0;
  left: 39.5px;
}
.acu-bearing-left {
  position: absolute;
  left: 0;
  top: 39px;
}
.acu-bearing-right {
  position: absolute;
  right: 0;
  top: 39px;
}
.acu-control-xy {
  :deep() {
    .el-input__inner,
    .el-textarea__inner {
      height: 40px;
      font-size: 24px;
      color: var(--yx-border-4);
    }
  }
}
.acu-bearing-center {
  width: 22px;
  height: 22px;
  background: rgba(237, 239, 245, 1);
  border: 1px solid var(--yx-font-5);
  border-radius: 4px;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
.acu-bearing-center:active {
  color: var(--yx-font-1);
  background: var(--yx-font-2);
}
.acu-bearing-x {
  width: 57px;
  height: 67px;
}
.acu-bearing-y {
  width: 67px;
  height: 57px;
}
.acu-bearing-up {
  background: url('@/assets/images/acu/up.png') no-repeat;
}
.acu-bearing-up:active {
  background: url('@/assets/images/acu/up-active.png') no-repeat;
}
.acu-bearing-down {
  background: url('@/assets/images/acu/down.png') no-repeat;
}
.acu-bearing-down:active {
  background: url('@/assets/images/acu/down-active.png') no-repeat;
}
.acu-bearing-left {
  background: url('@/assets/images/acu/left.png') no-repeat;
}
.acu-bearing-left:active {
  background: url('@/assets/images/acu/left-active.png') no-repeat;
}
.acu-bearing-right {
  background: url('@/assets/images/acu/right.png') no-repeat;
}
.acu-bearing-right:active {
  background: url('@/assets/images/acu/right-active.png') no-repeat;
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
</style>
