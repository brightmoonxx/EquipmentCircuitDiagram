<!--
 * @Author: heliling
 * @Date: 2022-10-20 14:18:16 
 * @LastEditors: heliling
 * @LastEditTime: 2023-01-16 17:17:00
 * @FilePath: \yxopenmctd:\hll\station-control-center-view\src\views\PlanManagement\OptionalPlan.vue
 * @Description:  
 * 
 * Copyright (c) 2022 by YuXing, All Rights Reserved. 
-->
<template>
  <div class="task-macro-parameters">
    <div class="wrap">
      <div class="data">
        <div class="main">
          <div class="list-info pd-bottom-20">
            <h2 class="default-title">任务宏参数</h2>
            <div class="search">
              <el-form :inline="true" :model="formInline" class="task-macro-parameters-form">
                <el-form-item>
                  <el-input v-model="formInline.task" placeholder="请输入宏名称"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-select class="normal-select" v-model="formInline.satellite" placeholder="请选择卫星">
                    <el-option label="高分一号" value="shanghai"></el-option>
                  </el-select>
                </el-form-item>
                <el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeDate"></el-date-picker>
                <el-form-item>
                  <el-button type="primary" class="normal-btn primary" @click="onSubmit">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="list-content">
            <div class="list-table">
              <el-table class="normal-table station-table" :data="tableData" highlight-current-row>
                <el-table-column label="编号" align="center" type="index" width="70px"></el-table-column>
                <el-table-column label="宏名称" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name || '无' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="卫星编号" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name || '无' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="卫星名称" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name || '无' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="码速率" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name || '无' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="类型" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name || '无' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="创建人" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name || '无' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name || '无' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="150px">
                  <template slot-scope="scope">
                    <div class="operate-btn-wrap">
                      <span class="table-operate-btn" @click="toCheck(scope.row)">查看</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table-footer clearfix">
                <el-pagination
                  background
                  layout="prev, pager, next"
                  @size-change="sizeHandleChange"
                  @current-change="pageHandleChange"
                  :current-page="page"
                  :page-size="size"
                  :total="total"
                ></el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CommonDialog :show.sync="showCheckDialog" dialog-width="600px" dialog-title="任务宏详情" customClass="macro-detail">
      <template v-slot:body>
        <div class="dialog-content">
          <div class="border-title"><div class="font-medium">卫星信息</div></div>
          <div class="content">
            <div class="content-item">
              <div class="key font-medium">卫星频段：</div>
              <div class="value">xxxx</div>
            </div>
          </div>
          <div class="border-title">
            <div class="font-medium">测控基带</div>
          </div>
          <div class="content measure-control">
            <div class="content-item">
              <div class="key font-medium">测控模式：</div>
              <div class="value">xxxx</div>
            </div>
            <div class="content-item">
              <div class="key font-medium">宏文件：</div>
              <div class="value">xxxx</div>
            </div>
          </div>
          <div class="border-title"><div class="font-medium">数传基带</div></div>
          <div class="content data-transmission">
            <div class="content-item">
              <div class="key font-medium">数传通道：</div>
              <div class="value">xxxx</div>
            </div>
            <div class="content-item">
              <div class="key font-medium">宏文件：</div>
              <div class="value">xxxx</div>
            </div>
          </div>
          <div class="border-title"><div class="font-medium">宏单元</div></div>
          <CascaderForm :readOnly="true" />
        </div>
      </template>
    </CommonDialog>
  </div>
</template>
<script>
import CascaderForm from '@/components/ParameterManagement/CascaderForm/index.vue';
import CommonDialog from '@/components/common/CommonDialog/index.vue';
export default {
  metaInfo() {
    return {
      title: this.pageName,
    };
  },
  data() {
    return {
      showCheckDialog: false,
      page: 1,
      size: 2,
      total: 4,
      value1: [],
      tableData: [{ name: 'GA-04' }, { name: 'GA-04' }, { name: 'GA-04' }],
      value1: [],
      formInline: { macro: '', satellite: '' },
    };
  },
  computed: {
    pageName() {
      return `${this.$route.query.name} - ${this.$route.meta.title}`;
    },
  },
  components: { CommonDialog, CascaderForm },
  mounted() {},
  methods: {
    onSubmit() {
      console.log(this.formInline, this.value1);
    },
    toCheck() {
      this.showCheckDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-dialog.common-dialog.macro-detail {
  .dialog-content {
    padding: 20px;
  }
  .el-form {
    display: block;
    color: var(--yx-font-2);
  }
  .content {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 12px;
    .content-item {
      display: flex;
      flex-direction: column;
      width: calc((100% - 84px) / 3);
      margin-right: 42px;
    }
    .el-form-item {
      margin: 0 73px 12px 0;
      width: 30%;
      white-space: nowrap;
    }
    &.data-transmission,
    &.measure-control {
      .content-item:nth-last-child(1) {
        flex-grow: 1;
        margin-right: 0;
        .normal-select {
          width: 100%;
        }
      }
    }
  }
}
.task-macro-parameters {
  height: 100%;

  .wrap {
    display: flex;
    width: 100%;
    min-height: calc(100%);
    .data {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      width: 100%;
      // height: calc(100% - 104px);
      padding: 24px 28px 28px;
      background: var(--yx-background-gradient);

      .main {
        width: 100%;
        margin-bottom: 28px;
        padding: 21px 22px 27px;
        background: rgba(255, 255, 255, 0.11);
        border: 1px solid #e8ecef;
        border-radius: 4px;
        .list-info {
          display: flex;
          justify-content: space-between;
          .search {
            display: flex;
          }
          .task-macro-parameters-form {
            .el-form-item {
              margin-right: 12px;
              &:nth-last-child(1) {
                margin: 0 12px;
              }
            }
            .view-btn {
              min-width: auto;
            }
          }
        }
        .list-content {
          .list-table {
            .table-footer {
              .el-pagination {
                float: right;
              }
            }
          }
        }
      }
    }
  }
}
</style>
