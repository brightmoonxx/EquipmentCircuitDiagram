<!--
 * @Author: huangzhendong
 * @Date: 2022-11-17 17:56:13
 * @LastEditors: huangzhendong
 * @LastEditTime: 2022-12-05 14:10:53
 * @FilePath: \station-control-center-view\src\views\Datalog\Datalog.vue
-->
<template>
  <div class="wrap">
    <div class="datalog-wrap">
      <div class="flex justify-between datalog-header">
        <p>数据日志</p>
        <div class="pd-bottom-20">
          <el-form :inline="true" :model="formInline">
            <el-form-item class="datalog-cascader">
              <el-cascader class="normal-select" v-model="formInline.staValue" :options="stationOptions"></el-cascader>
            </el-form-item>
            <el-form-item>
              <el-select class="normal-select" v-model="formInline.type">
                <el-option v-for="(opt, idx) in typeOptions" :key="idx" :label="opt.label" :value="opt.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="normal-btn" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="frame-format">
        <div>
          <el-table class="normal-table format-table" :data="tableData" height="650" border>
            <el-table-column prop="date" label="时间" width="200" align="center"></el-table-column>
            <el-table-column prop="memo" label="描述" width="600" align="center"></el-table-column>
            <el-table-column prop="data" label="内容" align="center"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formInline: {
        staValue: [],
        type: 0,
      },
      typeOptions: [
        { label: '接收', value: 0 },
        { label: '发送', value: 1 },
      ],
      stationOptions: [],
      tableData: [],
    };
  },
  created() {
    this.getStaData();
  },
  methods: {
    onSubmit() {
      this.getLogData();
    },
    // 获取测站及设备
    async getStaData() {
      const data = await this.$api.searchStation({
        pageIndex: 1,
        pageSize: 10000,
        useStatus: 1,
      });
      data.data.records.forEach((staItem) => {
        let obj = {
          value: '',
          label: '',
          children: [],
        };
        obj.value = staItem.stationId;
        obj.label = staItem.name;
        staItem.deviceList?.forEach((deItem) => {
          obj.children.push({ value: deItem.deviceId, label: deItem.name });
        });
        this.stationOptions.push(obj);
      });
    },
    // 获取日志
    async getLogData() {
      if (this.formInline.staValue.length == 0) {
        if (document.getElementsByClassName('el-message').length !== 0) return;
        this.$message.warning('请选择测站及设备!');
        return;
      }
      const params = {
        stationId: this.formInline.staValue[0],
        deviceId: this.formInline.staValue[1],
        type: this.formInline.type,
      };
      const data = await this.$api.getProtocolLog(params);
      this.tableData = data.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  padding: 24px 28px 28px;
}
.datalog-wrap {
  width: 100%;
  padding: 25px;
  background: rgba(255, 255, 255, 0.11);
  border: 1px solid #e8ecef;
  border-radius: 4px;
}
.el-input-number {
  line-height: 26px;
}
.success {
  color: var(--yx-success-1);
}
.el-dialog.common-dialog.config-edit {
  .dialog-content {
    padding: 12px 24px;
    .content {
      .row {
        display: flex;
        margin-bottom: 20px;
        span {
          margin: 0 12px;
        }
        .row-btn-wrap {
          padding-left: 12px;
          display: flex;
          align-items: center;

          i {
            cursor: pointer;
            margin-left: 12px;
            font-size: 16px;
          }
          .el-radio-group {
            display: flex;
          }
        }
      }
    }
  }
}
.frame-format {
  .operate-btn-wrap {
    .operate-btn {
      cursor: pointer;
      margin-right: 18px;
      color: var(--yx-font-2);
      font-size: 18px;
      font-weight: 500;
      &.el-icon-delete-solid {
        color: var(--yx-danger-3);
      }
    }
  }

  .format-table {
    :deep() tr {
      background: #e8ecef;
    }
    :deep() .el-table__row {
      background: #fff;
      &.chosenClass {
        background: #e1e7f1;
      }
    }
    i {
      cursor: pointer;
      font-size: 18px;
      font-weight: 500;
    }
    .column {
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        margin-left: 12px;
      }
    }
  }
  .bottom-btn-wrap {
    margin-top: 20px;
  }
}
.acu-config-btn {
  width: 80px;
  height: 32px;
  background: var(--yx-btn);
  border-radius: 4px;
  line-height: 32px;
  text-align: center;
  color: var(--yx-font-1);
  cursor: pointer;
}
.acu-phase-btn-active {
  background: var(--yx-content-1);
  border: 1px solid var(--yx-font-1);
  box-shadow: 0px 3px 6px rgba(56, 125, 255, 0.5);
}
.datalog-header {
  font-weight: 500;
  font-size: 18px;
  color: #334681;
}
</style>

