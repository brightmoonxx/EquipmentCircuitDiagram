<!--
 * @Author: WangXin
 * @Date: 2022-11-15 16:40:28
 * @LastEditors: WangXin
 * @LastEditTime: 2022-11-15 18:01:06
 * @FilePath: \code\src\components\common\Svg\Svg.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by YuXing, All Rights Reserved. 
-->
<template>
  <svg :class="name" class="svg-icon" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>
<script>
export default {
  name: 'yx-icon',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    iconName() {
      return `#icon-${this.name}`;
    },
  },
};
</script>
<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
