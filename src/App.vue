<!--
 * @Author: WangXin
 * @Date: 2022-06-22 13:56:47
 * @LastEditors: WangXin
 * @LastEditTime: 2023-01-12 15:56:17
 * @FilePath: \code\src\App.vue
 * @Description:
 *
 * Copyright (c) 2022 by YuXing, All Rights Reserved.
-->
<template>
  <div id="app" class="">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'app',
  components: {},
  data() {
    return {
      msg: '',
    };
  },
  beforeCreate() {},
  mounted() {},
  methods: {},
};
</script>

<style>
#app {
  width: 100vw;
  height: 100vh;
  /* background-color: var(--background); */
  color: var(--textColor);
  font-family: aliph-regular;
  overflow: hidden;
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  /* box-sizing: border-box; */
  background: var(--yx-background-2);
  margin-right: 2px;
}

::-webkit-scrollbar-thumb {
  background: var(--yx-font-4);
  border-radius: 10px;
  border: 0;
}
</style>
