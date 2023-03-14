<!--
 * @Author: heliling
 * @Date: 2023-02-01 17:17:32
 * @LastEditors: heliling
 * @LastEditTime: 2023-02-01 17:43:37
 * @Description: 
 * 
 * Copyright (c) 2023 by YuXing, All Rights Reserved. 
-->
<template>
  <div class="no-avalible-data-wrapper">
    <div class="placeholder-img-wrapper" />
    <div class="tip-text text-describe" v-html="tipText" />
  </div>
</template>

<script>
export default {
  props: {
    tipText: {
      default: '暂无数据',
      type: String,
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.no-avalible-data-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .placeholder-img-wrapper {
    margin: 0 auto;
    width: 225px;
    height: 225px;
    background: url('@/assets/images/common/nodata.png') center no-repeat;
    width: 174px;
    background-size: 100%;
  }

  .placeholder-img {
    width: 100%;
    height: 100%;
  }

  .tip-text {
    margin-top: 10px;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
    color: #a8b6c7;
  }

  .operate-container {
    margin-top: 20px;
    text-align: center;

    .button {
      display: inline-block;
      margin: 0 auto;
    }
  }
}
</style>
