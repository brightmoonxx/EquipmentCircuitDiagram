<!--
 * @Author: heliling
 * @Date: 2022-10-28 15:50:33
 * @LastEditors: heliling
 * @LastEditTime: 2023-03-02 10:59:13
 * @Description:
 *
 * Copyright (c) 2022 by YuXing, All Rights Reserved.
-->
<template>
  <div class="cascader-form">
    <!-- 左侧--选择 -->
    <div class="left" v-show="!readOnly">
      <el-menu class="el-menu-vertical-demo" @open="handleOpen" :default-openeds="navList">
        <el-submenu v-for="(item, index) in paramOptions" :key="item.deviceId" :index="index">
          <template slot="title">
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item v-for="(childrenItem, childrenIndex) in item.units" :key="childrenItem.unitUuid" :index="index - childrenIndex" :class="{ selected: childrenItem.selected }">
            {{ childrenItem.unitName }}
            <i v-if="!readOnly" class="el-icon-circle-plus-outline" @click="addToList(index, '', childrenIndex, true)"></i>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <!-- 右侧--操作区域 -->
    <div class="right">
      <el-collapse v-model="collapseList" @change="changeCollapse" :accordion="isChange">
        <el-collapse-item class="unit-item" v-for="(item, index) in viewList" :key="item.deviceId" :name="index">
          <template slot="title">
            <div class="title-outer">
              {{ item.name }}
            </div>
          </template>
          <div v-for="(item1, index1) in item.units" :key="item1.unitUuid">
            <div class="attribute-header">
              <span>{{ item1.unitName }}</span>
              <i v-if="!readOnly" class="delete el-icon-delete" @click="deleteChild(index, index1)"></i>
            </div>
            <el-form>
              <div class="form-item-wrap">
                <el-form-item :label="item2.paramName" class="content-form-item" :class="{ 'read-only': readOnly }" v-for="item2 in item1.bodyList" :key="item2.id">
                  <template v-if="item2.selectConfig && item2.selectConfig.length > 0">
                    <el-select filterable v-model="item1.form[`param${item2.id}`]" class="normal-select" :disabled="item2.ifSet == 0 || readOnly">
                      <el-option v-for="item in item2.selectConfig" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                  </template>
                  <template v-else-if="item2.paramType == 'FIXED'">
                    <el-input v-model="item2.value" readonly></el-input>
                  </template>
                  <template v-else-if="item2.paramType == 'STRING'">
                    <el-input type="text" v-model="item1.form[`param${item2.id}`]" :readonly="item2.ifSet == 0 || readOnly"></el-input>
                  </template>
                  <template v-else-if="item2.paramType == 'VALUE'">
                    <el-input
                      v-model="item1.form[`param${item2.id}`]"
                      :readonly="readOnly || item2.ifSet == 0"
                      type="number"
                      @mousewheel.native.prevent
                      :min="item2.valueRange && item2.valueRange.min ? item2.valueRange.min : ''"
                      :max="item2.valueRange && item2.valueRange.max ? item2.valueRange.max : ''"
                    ></el-input>
                  </template>
                  <template v-else><el-input v-model="item1.form[`param${item2.id}`]" :readonly="item2.ifSet == 0 || readOnly"></el-input></template>
                  <span v-if="item2.valueUnit">{{ item2.valueUnit }}</span>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
import { elementOfArray } from '@/utils/utils';
export default {
  props: {
    readOnly: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => {
        [];
      },
    },
    formData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isChange: false,
      paramOptions: [],
      form: {},
      activeIndex: 0,
      viewList: [],
    };
  },
  computed: {
    hasContent() {
      return this.viewList[this.activeIndex] && Object.keys(this.viewList[this.activeIndex]).length && this.viewList[this.activeIndex].units.length;
    },
    collapseList() {
      let list = [];
      this.viewList.forEach((item, index) => {
        list.push(index);
      });
      return list;
    },
    navList() {
      let list = [];
      this.paramOptions.forEach((item, index) => {
        if (item.units.filter((item) => item.selected).length) list.push(index);
      });
      return list;
    },
  },
  watch: {
    options: {
      handler: function (val) {
        if (!val.length) {
          this.viewList = [];
        }
        this.paramOptions = JSON.parse(JSON.stringify(this.options));
        if (this.formData && this.formData.length) {
          this.formData.forEach((item, index) => {
            this.paramOptions.forEach((item1, index1) => {
              if (item.deviceId == item1.deviceId) {
                item.units.forEach((item2, index2) => {
                  if (item1.units.length) {
                    if (item1.units[index2]) {
                      item1.units[index2].form = {};
                    }
                    if (item2.bodyList && item2.bodyList.length) {
                      //赋值
                      let childIndex;
                      item2.bodyList.forEach((item3, index3) => {
                        item1.units.forEach((item4, index4) => {
                          if (!item1.units[index4].form) {
                            item1.units[index4].form = {};
                          }
                          if (item4.unitUuid == item2.unitUuid) {
                            if (item1.units[index4].form) {
                              this.$set(item1.units[index4].form, `param${item3.id}`, item3.value);
                              childIndex = index4;
                            }
                          }
                        });
                        if (item1.units[index2]) {
                          if (!item1.units[index2].form) {
                            item1.units[index2].form = {};
                          }
                          if (item1.units[index2].form) {
                            this.$set(item1.units[index2].form, `param${item3.id}`, item3.value);
                          }
                        }
                      });
                      //做回显：添加节点

                      this.addToList(index1, index, childIndex, false);
                    }
                  }
                });
              }
            });
          });
        } else {
          this.paramOptions.forEach((item1, index1) => {
            if (item1.units.length) {
              item1.units.forEach((item2, index2) => {
                item1.units[index2].form = {};
              });
            }
          });
        }
      },
      immediate: true,
    },

    viewList: {
      //监听视图数据
      handler(val) {
        val.forEach((item, index) => {
          if (!item.units.length) {
            this.viewList.splice(index, 1);
          } else {
            if (item.units && item.units.length) {
              item.units.forEach((item1) => {
                let bodyList = [];
                if (!item1.form) {
                  item1.form = {};
                }
                Object.keys(item1.form).forEach((item2) => {
                  bodyList.push({ id: item2.replace('param', ''), value: item1.form[item2] });
                });
                // item1.saveBodyList = bodyList;
                let filteredbodyList = [];
                this.paramOptions.forEach((dev) => {
                  if (dev.deviceId == item.deviceId) {
                    dev.units.forEach((unit) => {
                      if (unit.unitUuid == item1.unitUuid) {
                        let arr = unit.bodyList.map((value) => value.id);
                        filteredbodyList = bodyList.filter((val) => arr.includes(Number(val.id)));
                      }
                    });
                  }
                });
                item1.saveBodyList = filteredbodyList;
              });
            }
          }
        });
        let list = this.viewList.map((deviceInfo) => ({ deviceId: deviceInfo.deviceId, units: deviceInfo.units }));
        list.forEach((item) => {
          item.units = item.units.map((unit) => ({ bodyList: unit.saveBodyList, unitUuid: unit.unitUuid }));
        });

        this.$emit('formData', list);
        console.log(list);
      },
      deep: true,
    },
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    changeCollapse() {
      this.isChange = true;
    },
    //删除节点
    deleteChild(parentIndex, childrenIndex) {
      this.paramOptions.forEach((item, index) => {
        if (item.deviceId == this.viewList[parentIndex].deviceId) {
          item.units.forEach((item1, index1) => {
            if (item1.unitUuid == this.viewList[parentIndex].units[childrenIndex].unitUuid) {
              if (this.viewList[parentIndex].units.length >= 1) {
                this.paramOptions[index].units[index1].selected = false;
              }
            }
          });
        }
      });
      this.viewList[parentIndex].units.splice(childrenIndex, 1);
    },
    //添加节点
    addToList(index, indexForm, childrenIndex, operate) {
      if (operate) {
        this.paramOptions.forEach((item1, index1) => {
          if (item1.units.length) {
            item1.units.forEach((item2, index2) => {
              item1.units[index2].form = {};
            });
          }
        });
      }

      if (!elementOfArray('name', this.paramOptions[index].name, this.viewList)) {
        let viewItem = { ...this.paramOptions[index] };
        viewItem.units = this.paramOptions[index].units[childrenIndex] ? [this.paramOptions[index].units[childrenIndex]] : [];

        this.viewList.push(JSON.parse(JSON.stringify(viewItem)));
      } else {
        let val = {};
        this.viewList.forEach((item) => {
          if (item.deviceId == this.paramOptions[index].deviceId) {
            val = this.paramOptions[index].units[childrenIndex];
            if (this.paramOptions[index].units[childrenIndex] && !item.units.includes(this.paramOptions[index].units[childrenIndex])) {
              item.units.push(JSON.parse(JSON.stringify(this.paramOptions[index].units[childrenIndex])));
            } else if (elementOfArray('unitUuid', this.formData[indexForm].units[childrenIndex].unitUuid, this.paramOptions[index].units)) {
              item.units.push(JSON.parse(JSON.stringify(elementOfArray('unitUuid', this.formData[indexForm].units[childrenIndex].unitUuid, this.paramOptions[index].units))));
            }
          }
        });
      }
      if (this.paramOptions[index].units[childrenIndex]) {
        this.$set(this.paramOptions[index].units[childrenIndex], 'selected', true);
      }
    },
    handleSelect(key) {
      this.activeIndex = key;
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
  margin-bottom: 20px;
  width: 100%;
  height: 332px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid #e8ecef;
  box-shadow: 0px 3px 6px #d6e3f3;
  border-radius: 2px;
  .left {
    flex-shrink: 0;
    width: 183px;
    height: 100%;
    overflow-y: scroll;
    border-right: #8a9cb8 1px solid;
    .el-menu {
      background: transparent;
      border: none;
      line-height: 28px;
      font-size: 14px;
      font-weight: 500;
      color: #7b8fb0;
      :deep() {
        > .el-menu-item,
        .el-submenu__title {
          padding: 0 25px 0 14px !important;
          display: flex;
          align-items: center;
          height: 28px;
          line-height: 28px;
          color: var(--yx-font-5);
          font-size: 14px;
          font-weight: 500;
          .el-icon-arrow-down {
            transform: scaleX(0.9);
            right: 7px;
            &:before {
              font-size: 16px;
              content: '\e790';
            }
          }
        }
        .el-menu-item.is-active {
          color: #4288ee;
          background: rgba(221, 232, 250, 0.39);
        }
        .el-submenu {
          .el-menu {
            background: transparent;
          }
          .el-menu-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-width: 169px;
            padding: 0 6px 0 37px !important;
            height: 24px;
            line-height: 24px;
            font-size: 14px;
            font-weight: 400;
            color: var(--yx-font-5);
            cursor: auto;
            &.selected {
              color: #4288ee;
            }
            i {
              display: none;
              margin-right: 0;
              cursor: pointer;
            }
            &:hover {
              color: #4288ee;
              background: rgba(221, 232, 250, 0.39);
              i {
                display: inline-block;
                color: #4288ee;
              }
            }
          }
        }
      }
    }
  }
  .right {
    flex-grow: 1;
    padding: 7px 24px 0 24px;
    overflow-y: auto;
    :deep().el-collapse {
      border: none;
      .el-collapse-item__header {
        background: transparent;
        border: none;
        margin-bottom: 12px;
        height: 14px;
        line-height: 24px;
        .el-collapse-item__arrow {
          margin-right: 0;
          font-size: 14px;
          color: #4288ee;
          &::before {
            content: '\e790';
          }
          &.is-active {
            transform: rotate(180deg);
          }
        }
      }
      .el-collapse-item__wrap {
        background: transparent;
      }
    }

    .title-outer {
      color: #4288ee;
      font-size: 14px;
    }
    .option-item {
      margin-bottom: 12px;
    }
    .attribute-header {
      display: flex;
      justify-content: space-between;
      padding-bottom: 8px;
      border-bottom: #7085a2 1px solid;
      font-size: 12px;
      color: var(--yx-font-4);
      .delete {
        cursor: pointer;
      }
    }
    .form-item-wrap {
      padding: 8px 0;
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      .content-form-item {
        width: calc((100% - 66px) / 4);
        margin-right: 22px;
        .normal-select {
          background: transparent;
        }
        margin-bottom: 12px;
        :deep().el-form-item__content {
          display: flex;
          span {
            white-space: nowrap;
            color: var(--yx-font-2);
            margin-left: 2px;
            font-size: 12px;
          }
        }
        &:nth-child(4n) {
          margin-right: 0;
        }
        :deep().el-form-item__content > .el-input .el-input__inner[readonly],
        :deep().el-form-item__content .el-select .el-input.is-disabled .el-input__inner {
          background: var(--yx-thead);
          color: var(--yx-font-8);
          border: none;
        }
        &.read-only {
          :deep().el-select {
            background: transparent;
            width: 100%;

            &::before {
              display: none;
            }
          }
          :deep().el-form-item__content .el-input .el-input__inner[readonly] {
            background: var(--yx-thead);
            color: var(--yx-font-8);
          }
        }
      }
    }
    .item {
      color: var(--yx-font-2);
      display: inline-block;
    }
  }
}
</style>
