<!--
 * @Author: heliling
 * @Date: 2022-10-19 18:13:18
 * @LastEditors: huangzhendong
 * @LastEditTime: 2022-11-28 09:17:14
 * @FilePath: \station-control-center-view\src\components\common\CommonDialog\index.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by YuXing, All Rights Reserved. 
--> 
<template>
  <div>
    <el-dialog
      v-if="show"
      :visible.sync="show"
      :top="top"
      :show-close="true"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :width="dialogWidth"
      :modal="modal"
      :custom-class="`common-dialog ${customClass}`"
      :append-to-body="appendToBody"
      :title="dialogTitle"
      @close="closeHandler"
    >
      <div class="common-dialog-template">
        <div class="dialog-body" :style="{ background: bodyBg }">
          <!-- <slot name="body" /> -->
          <slot name="body"></slot>
          <div class="dialog-footer" v-if="hasFooter || showMainBtn || showSubBtn">
            <template v-if="showMainBtn || showSubBtn">
              <div v-if="subBtnText || showSubBtn" class="button-default outline" @click="subBtnClickHandler">
                {{ subBtnText }}
              </div>
              <div v-if="mainBtnText || showMainBtn" class="button-default" @click="mainBtnClickHandler">
                {{ mainBtnText }}
              </div>
            </template>
            <slot v-else name="footer"></slot>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogTitle: {
      default: '',
      type: String,
    },
    dialogWidth: {
      default: '40%',
      type: String,
    },
    show: {
      default: false,
      type: Boolean,
    },
    showCloseIcon: {
      default: true,
      type: Boolean,
    },
    showLeftIcon: {
      default: false,
      type: Boolean,
    },
    bodyBg: {
      default: '',
      type: String,
    },
    top: {
      default: '20vh',
      type: String,
    },
    appendToBody: {
      default: true,
      type: Boolean,
    },
    modal: {
      default: false,
      type: Boolean,
    },
    customClass: {
      default: '',
      type: String,
    },
    hasFooter: {
      default: false,
      type: Boolean,
    },
    mainBtnText: {
      default: '确认',
      type: String,
    },
    showMainBtn: {
      default: false,
      type: Boolean,
    },
    subBtnText: {
      default: '取消',
      type: String,
    },
    showSubBtn: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    mainBtnClickHandler() {
      this.$emit('mainBtnClick');
      this.closeHandler();
    },
    subBtnClickHandler() {
      this.$emit('subBtnClick');
      this.closeHandler();
    },
    closeHandler() {
      this.$emit('update:show', false);
    },
  },
};
</script>

<style lang="scss">
.el-dialog.common-dialog {
  background: transparent;
  box-shadow: none;
  border: #8a9cb8 2px solid;
  border-radius: 12px;
  .el-dialog__header {
    padding: 18px 18px 18px 24px;
    background: #485c7c url('../../../assets/images/common/dialog-header-bg.png') no-repeat;
    background-position: 34px;
    border-radius: 10px 10px 0 0;
    span {
      color: var(--yx-font-1);
      line-height: 16px;
    }
    .el-dialog__headerbtn .el-dialog__close {
      padding: 2px;
      background: #579af5;
      border-radius: 50%;
      color: var(--yx-font-1);
      font-weight: 600;
    }
  }
  .el-dialog__body {
    background: #f4f6fa;
    word-break: break-word;
    position: relative;
    border-radius: 0 0 10px 10px;
    padding: 0;
    // width: 512px;
    .dialog-body {
      width: 100%;
    }
    .dialog-footer {
      display: flex;
      justify-content: center;
      padding: 19px;
      background: var(--yx-shadow);
      border-radius: 0 0 10px 10px;
      .button-default {
        &:nth-child(1) {
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
