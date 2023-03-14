<!--
 * @Author: heliling
 * @Date: 2022-10-28 15:50:33
 * @LastEditors: heliling
 * @LastEditTime: 2022-12-14 10:34:36
 * @Description: 
 * 
 * Copyright (c) 2022 by YuXing, All Rights Reserved. 
-->
<template>
  <div class="cascader-form">
    <div class="left">
      <!-- <div v-for="(item, index) in options" :key="index" class="panel" :class="{ active: index == activeIndex }" @click="selectPanel(index)">{{ item.label }}</div> -->

      <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
        <el-submenu v-for="(item, index) in options" :key="index" :index="index">
          <template slot="title">
            <span>{{ item.label }}</span>
          </template>
          <el-menu-item v-for="(childrenItem, childrenIndex) in item.children" :key="childrenIndex" :index="index - childrenIndex">
            {{ childrenItem.label }}
            <i class="el-icon-circle-plus-outline" @click="addToList(index, childrenIndex)"></i>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="right">
      <div v-for="(item, index) in viewList" :key="index">{{ item.label }}</div>
      <!-- <div v-for="(item1, index1) in options[activeIndex].children" :key="index1">
        <div class="border-title">
          <div class="font-medium">{{ item1.label }}</div>
        </div>
        <el-form ref="form" :model="form">
          <el-form-item :label="item2.label" class="content-form-item" :class="{ 'read-only': readOnly }" v-for="(item2, index2) in item1.children" :key="index2">
            <el-input v-model="options[activeIndex].form[`${item2.name}`]" :readonly="readOnly"></el-input>
          </el-form-item>
        </el-form>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  props: {
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {},
      activeIndex: 0,
      options: [
        {
          form: {},
          label: 'X校零变频器',
          children: [
            {
              label: '频率',
              children: [
                { label: '输入频率', name: 'aa' },
                { label: '增益', name: 'bb' },
              ],
            },
          ],
        },
        {
          form: {},
          label: 'ACU',
          children: [
            {
              label: '频点',
              children: [
                { label: '频点', name: 'cc' },
                { label: '旋向', name: 'dd' },
              ],
            },
          ],
        },
      ],
      viewList: [],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    addToList(index, childrenIndex) {
      this.viewList.push({ label: this.options[index].label });
      this.viewList;
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    selectPanel(index) {
      this.activeIndex = index;
    },
  },
};
</script>

<style lang="scss" scoped>
.cascader-form {
  display: flex;
  padding: 14px 1px;
  width: 528px;
  height: 192px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid #e8ecef;
  box-shadow: 0px 3px 6px #d6e3f3;
  border-radius: 2px;
  .left {
    width: 143px;
    height: 100%;
    overflow-y: scroll;
    border-right: #8a9cb8 1px solid;
    .el-menu {
      padding-left: 0;
      background: transparent;
      line-height: 28px;
      font-size: 14px;
      font-weight: 500;
      color: #7b8fb0;
      :deep() {
        .el-submenu {
          .el-menu {
            background: transparent;
          }
          .el-submenu__title {
            display: flex;
            align-items: center;
            height: 24px;
            color: var(--yx-font-5);
            font-size: 14px;
            font-weight: 500;
          }

          .el-menu-item {
            min-width: 142px;
            height: 24px;
            line-height: 24px;
            padding: 0 12px;
            font-size: 14px;
            font-weight: 400;
            color: #4288ee;
            i {
              color: #4288ee;
            }
            &:hover {
              background: rgba(221, 232, 250, 0.39);
            }
          }
        }
      }
    }
    .panel {
      padding-left: 22px;
      width: 143px;
      height: 28px;
      line-height: 28px;
      font-size: 14px;
      font-weight: 500;
      color: #7b8fb0;
      cursor: pointer;
      &.active {
        background: rgba(66, 136, 238, 0.04);
        font-weight: 500;
        color: #4288ee;
      }
    }
  }
  .right {
    flex-grow: 1;
    padding: 0 24px;
    .content-form-item:nth-child(odd) {
      margin-right: 20px;
    }
  }
}
</style>
