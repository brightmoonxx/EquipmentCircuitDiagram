<!--
 * @Author: heliling
 * @Date: 2022-10-19 18:13:18
 * @LastEditors: heliling
 * @LastEditTime: 2023-01-31 17:16:24
 * @FilePath: \yxopenmctd:\hll\station-control-center-view\src\components\common\CountDown\index.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by YuXing, All Rights Reserved. 
-->
<template>
  <div class="common-countdown-wrapper">
    <div>
      <template v-if="timeUnitMap[topUnit] >= timeUnitMap['DAY']">{{ days }}:</template>
      <template v-if="timeUnitMap[topUnit] >= timeUnitMap['HOUR']">{{ hours }}:</template>
      <template v-if="timeUnitMap[topUnit] >= timeUnitMap['MIN']">{{ mins }}:</template>
      {{ secs }}
    </div>
  </div>
</template>

<script>
import countdownConfig from './config';
import { getDaysByCountdown, getHoursByCountdown, getMinsByCountdown, getSecondsByCountdown } from '@/utils/utils';

export default {
  props: {
    autoStart: {
      default: false,
      type: Boolean,
    },
    // 剩余时间(毫秒级)
    countdown: {
      default: 0,
      type: Number,
    },
    // 最高单位(DAY、HOUR、MIN、SEC)
    topUnit: {
      default: 'HOUR',
      type: String,
    },
  },
  data() {
    const times = this.countdown;
    const endTime = new Date().getTime() + this.countdown;
    const { timeUnitMap } = countdownConfig;
    return {
      times,
      endTime,
      timer: null,
      timeUnitMap,
    };
  },
  computed: {
    days() {
      if (this.timeUnitMap[this.topUnit] < this.timeUnitMap.DAY) return '00';
      return getDaysByCountdown(this.times, this.topUnit === 'DAY');
    },
    hours() {
      if (this.timeUnitMap[this.topUnit] < this.timeUnitMap.HOUR) return '00';
      return getHoursByCountdown(this.times, this.topUnit === 'HOUR');
    },
    mins() {
      if (this.timeUnitMap[this.topUnit] < this.timeUnitMap.MIN) return '00';
      return getMinsByCountdown(this.times, this.topUnit === 'MIN');
    },
    secs() {
      return getSecondsByCountdown(this.times, this.topUnit === 'SEC');
    },
  },
  watch: {
    countdown(newVal) {
      this.times = newVal;
      this.endTime = new Date().getTime() + newVal;
      if (this.autoStart) this.startTimer();
    },
  },
  mounted() {
    if (this.autoStart) this.startTimer();
  },
  destroyed() {
    this.resetTimer();
  },
  methods: {
    /**
     * 倒计时开始(参数为毫秒级)
     */
    startTimer(times) {
      this.resetTimer();
      if (times) {
        this.times = times;
        this.endTime = new Date().getTime() + this.countdown;
      }
      if (this.times < 1000) {
        this.$emit('countdown-over');
        this.resetTimer();
        return;
      }
      if (this.times > 0) {
        this.times = this.endTime - new Date().getTime();
        this.timer = setTimeout(() => {
          this.startTimer();
        }, 1000);
      }
    },
    // 计时器重置
    resetTimer() {
      clearTimeout(this.timer);
      this.timer = null;
    },
  },
};
</script>
<style lang="scss" scoped>
.common-countdown-wrapper {
  word-spacing: -7px;
  div {
    white-space: nowrap;
  }
}
</style>
