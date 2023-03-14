<template>
  <div class="optional-plan">
    <div class="wrap">
      <div class="data">
        <div class="main">
          <div class="list-info pd-bottom-20">
            <h2 class="default-title">自选计划列表</h2>
            <div class="search">
              <el-form :inline="true" :model="formInline" class="optional-plan-form">
                <el-form-item>
                  <el-select v-model="formInline.satelliteNo" placeholder="请选择卫星" class="normal-select">
                    <el-option v-for="item in satellite" :key="item.satelliteId" :label="item.satelliteName" :value="item.satelliteId"></el-option>
                  </el-select>
                </el-form-item>
                <el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeDate"></el-date-picker>
                <el-form-item>
                  <el-button class="normal-btn" @click="onSubmit">
                    <yx-icon name="calculate" style="width: 12px; height: 12px; margin-right: 4px"></yx-icon>
                    计算
                  </el-button>
                </el-form-item>
                <div class="normal-btn view-btn">
                  <yx-icon name="add" style="width: 12px; height: 12px; margin-right: 4px"></yx-icon>
                  添加
                </div>
              </el-form>
            </div>
          </div>
          <div class="list-content">
            <div class="list-table">
              <el-table class="normal-table station-table" :data="tableData" highlight-current-row>
                <el-table-column label="序号" align="center" type="index" width="70px"></el-table-column>
                <el-table-column label="卫星名称" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name || '无' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="圈号" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name || '无' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="开始时间" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name || '无' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="结束时间" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name || '无' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="结束时间" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name || '无' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="仰角" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name || '无' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="跟踪时常" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name || '无' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="工作频率" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name || '无' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="升降轨" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name || '无' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="冲突" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name || '无' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="150px">
                  <template slot-scope="scope">
                    <div class="operate-btn-wrap">
                      <span class="table-operate-btn" @click="addHandler(scope.row)">添加计划</span>
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
    <CommonDialog :show.sync="showAddDialog" dialog-width="695px" dialog-title="计划参数" :showMainBtn="true" mainBtnText="确认" :showSubBtn="true" subBtnText="取消" customClass="plan-params">
      <template v-slot:body>
        <div class="dialog-content">
          <el-form ref="form" :model="form">
            <el-form-item label="圈次类型">
              <el-select class="normal-select" v-model="form.cycleType" placeholder="请选择圈次类型">
                <el-option v-for="item in cycleTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务内容">
              <el-select class="normal-select" v-model="form.taskType">
                <el-option v-for="item in taskTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="频段">
              <el-select class="normal-select" v-model="form.frequency" placeholder="请选择频段">
                <el-option v-for="item in frequencyList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务宏参数">
              <el-select class="normal-select" v-model="form.param" placeholder="请选择任务宏参数">
                <el-option v-for="item in paramList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </CommonDialog>
  </div>
</template>
<script>
import CommonDialog from '@/components/common/CommonDialog/index.vue';
export default {
  metaInfo() {
    return {
      title: this.pageName,
    };
  },
  data() {
    return {
      planTypeMap: { 1: '正常', 2: '应急', 3: '补收' },
      taskTypeList: [
        { label: '测控', value: 'X01' },
        { label: '遥测', value: 'X02' },
        { label: '高速数传', value: 'X03' },
        { label: '测控数传', value: 'X04' },
        { label: '低速数传', value: 'X08' },
      ],
      satellite: [],
      form: {
        frequency: '',
        cycleType: '',
        task: '',
        param: '',
        symbolRate: '',
      },
      showAddDialog: false,
      page: 1,
      size: 2,
      total: 4,
      frequencyList: [
        {
          value: 's',
          label: 'S',
        },
        {
          value: 'x',
          label: 'X',
        },
        {
          value: 'ka',
          label: 'ka',
        },
      ],
      symbolRateList: [
        {
          value: 1,
          label: '1M',
        },
        {
          value: 2,
          label: '4M',
        },
      ],
      taskList: [
        {
          value: 1,
          label: '测控',
        },
        {
          value: 2,
          label: '遥测',
        },
        {
          value: 3,
          label: '数传',
        },
        {
          value: 4,
          label: '测控数传',
        },
        {
          value: 5,
          label: '自动化测试',
        },
        {
          value: 6,
          label: '飞控',
        },
      ],
      cycleTypeList: [
        {
          value: 1,
          label: '正常圈次',
        },
        {
          value: 2,
          label: '补救圈次',
        },
        {
          value: 3,
          label: '应急圈次',
        },
        {
          value: 4,
          label: '测试圈次',
        },
      ],
      paramList: [],
      value1: [],
      tableData: [{ name: 'GA-04' }, { name: 'GA-04' }, { name: 'GA-04' }],
      value1: [],
      formInline: {
        satellite: '',
        task: '',
      },
    };
  },
  computed: {
    pageName() {
      return `${this.$route.query.name} - ${this.$route.meta.title}`;
    },
  },
  created() {
    this.getSatellite();
  },
  components: { CommonDialog },
  mounted() {},
  methods: {
    async getSatellite() {
      const data = await this.$api.selectSat();
      let arr = Array.from(data.data);
      this.satellite = arr;
    },
    onSubmit() {
      console.log(this.formInline, this.value1);
    },
    addHandler() {
      this.showAddDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-dialog.common-dialog.plan-params {
  .dialog-content {
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
    .el-form {
      flex-wrap: wrap;
      color: var(--yx-font-2);
    }
    .el-form-item:deep {
      justify-content: flex-end;
      display: flex;
      margin: 0 12px 21px 0;
      width: calc((100% - 12px) / 2);
      white-space: nowrap;
      &:nth-child(2n) {
        margin-right: 0;
      }
      .el-form-item__label {
        line-height: normal;
        font-size: 16px;
        color: var(--yx-font-2);
      }
    }
  }
  .btn-wrap {
    .button-default:nth-child(1) {
      margin-right: 32px;
    }
  }
}
.optional-plan {
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
          .optional-plan-form {
            .el-form-item {
              margin-right: 12px;
              &:nth-last-child(2) {
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
