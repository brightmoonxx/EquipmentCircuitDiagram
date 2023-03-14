<template>
  <div class="frame-format">
    <div class="draggable" style="padding: 20px">
      <el-table class="normal-table format-table" row-key="id" :data="tableData" style="width: 100%" border>
        <el-table-column fixed label="序号" align="center" type="index" width="70"></el-table-column>
        <el-table-column fixed label="名称" align="center" width="200">
          <template slot-scope="scope"><el-input v-model="scope.row.paramName"></el-input></template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <div class="operate-btn-wrap">
              <i class="operate-btn el-icon-rank" title="按住拖拽"></i>
              <i class="operate-btn el-icon-circle-plus" @click="addProtocol(scope.$index)"></i>
              <i class="operate-btn el-icon-delete-solid" @click="deleteFormat(scope.$index)"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="字节类型" align="center" min-width="200">
          <template slot-scope="scope">
            <el-select class="normal-select" v-model="scope.row.byteType">
              <el-option v-for="item in config.byteType" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="参数类型" align="center" min-width="200">
          <template slot-scope="scope">
            <el-select class="normal-select" v-model="scope.row.paramType">
              <el-option v-for="item in config.paramType" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="内容配置" align="center" min-width="200">
          <template slot-scope="scope">
            <div class="column">
              <template v-if="scope.row.paramType == 'CHECK'">
                <el-select class="normal-select" placeholder="校验方式" v-model="scope.row.verifyType">
                  <el-option v-for="item in config.verifyType" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
              </template>
              <template v-if="scope.row.paramType == 'SELECT'">
                <template v-if="scope.row.selectConfig && scope.row.selectConfig.length">
                  <div>
                    <p :class="item.isSuccess ? 'success' : ''" v-for="(item, index) in scope.row.selectConfig" :key="index">{{ item.key }}:{{ item.value }}</p>
                  </div>
                  <i class="el-icon-edit" @click="editConfig(scope.row, scope.$index)"></i>
                </template>
                <i v-else class="el-icon-circle-plus" @click="editConfig(scope.row, scope.$index)"></i>
              </template>
              <template v-if="scope.row.paramType == 'STATUS'" title="状态参数">
                <template v-if="scope.row.selectConfig && scope.row.selectConfig.length">
                  <div>
                    <p v-for="(item, index) in scope.row.selectConfig" :key="index">{{ item.key }}:{{ item.value }}</p>
                  </div>
                  <i class="el-icon-edit" @click="editConfig(scope.row, scope.$index)"></i>
                </template>
                <i v-else class="el-icon-circle-plus" @click="editConfig(scope.row, scope.$index)"></i>
              </template>
              <template v-if="scope.row.paramType == 'FIXED'">
                <el-input v-model="scope.row.value" placeholder="单行输入"></el-input>
                <!-- <el-input-number class="mg-left-10" style="width: 120px" v-model="scope.row.loopCount" :min="1" :max="100" label="循环次数"></el-input-number> -->
              </template>
            </div>
            <template v-if="scope.row.paramType == 'VALUE'">/</template>
          </template>
        </el-table-column>
        <el-table-column label="循环次数" align="center" min-width="200">
          <template slot-scope="scope">
            <el-input-number class="mg-left-10" style="width: 120px" v-model="scope.row.loopCount" :min="1" :max="100" label="循环次数"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="循环配置" align="center" min-width="250">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.loopParse" :true-label="1" :false-label="0">循环解</el-checkbox>
            <el-checkbox v-model="scope.row.loopBuild" :true-label="1" :false-label="0">循环组建</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="索引类型" align="center" min-width="200">
          <template slot-scope="scope">
            <el-select class="normal-select" v-model="scope.row.indexType">
              <el-option v-for="item in config.indexType" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="长度计算" align="center" width="150">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.joinLen" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="参与校验" align="center" width="150">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.joinVerify" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否是虚拟字段" width="150" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.virtualField" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <div class="bottom-btn-wrap mg-y-20 flex">
        <div class="normal-btn" @click="saveTable()">保存更改</div>
        <!-- <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination> -->
      </div>
    </div>
    <CommonDialog
      :show.sync="showEditDialog"
      dialog-width="400px"
      dialog-title="编辑选项"
      customClass="config-edit"
      :showMainBtn="true"
      mainBtnText="确认"
      :showSubBtn="true"
      subBtnText="取消"
      @mainBtnClick="saveEditConfig"
      @subBtnClick="cancelEditConfig"
    >
      <template v-slot:body>
        <div class="dialog-content">
          <div class="content">
            <div class="row" v-for="(item, index) in editConfigForm" :key="index">
              <el-input v-model="item.key" placeholder=" "></el-input>
              <span>:</span>
              <el-input v-model="item.value" placeholder=" "></el-input>
              <div class="row-btn-wrap">
                <el-radio-group v-model="item.type" v-if="tableData[editContentIndex].paramType == 'STATUS'">
                  <el-radio :label="3">正常</el-radio>
                  <el-radio :label="6">异常</el-radio>
                </el-radio-group>
                <i class="el-icon-circle-plus-outline" @click="addKey(index)"></i>
                <i class="el-icon-delete" @click="deleteKey(index)"></i>
              </div>
            </div>
          </div>
        </div>
      </template>
    </CommonDialog>
  </div>
</template>
<script>
import Sortable from 'sortablejs';

import CommonDialog from '@/components/common/CommonDialog/index.vue';
export default {
  components: { CommonDialog },
  props: {
    config: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dropConfig: {
        animation: 150,
        chosenClass: 'chosenClass', //设置选中样式类名
      },
      editContentIndex: '',
      showEditDialog: false,
      editConfigForm: {},
      // ...this.config,
      tableData: [],
    };
  },
  watch: {
    'editConfigForm.length'(val) {
      if (val == 0) {
        this.editConfigForm = [{ key: '', value: '' }];
      }
    },
  },
  mounted() {
    this.searchProtocol(this.$route.query.id);
    this.$nextTick(() => {
      this.rowDrop();
    });
  },
  methods: {
    async searchProtocol(protocolUuid) {
      const { data } = await this.$api.searchProtocol({ protocolUuid });
      if (data.length == 0) {
        this.tableData = [];
        const protocol = {
          id: 1,
          paramName: '',
          byteType: '',
          paramType: 'VALUE',
          indexType: '',
          joinVerify: false,
        };
        this.tableData.push(protocol);
      } else {
        data.forEach((element, index) => (element.id = index + 1));
        this.tableData = data;
      }
    },

    async addProtocolList() {
      this.tableData.forEach((item) => delete item.id);
      const params = {
        unitUuid: this.$route.query.id,
        data: this.tableData,
      };
      const data = await this.$api.addProtocolList(params);
      if (data.isSuccess) {
        this.$message.success('保存成功');
        this.searchProtocol(this.$route.query.id);
      } else {
        this.$message.error(data.resultMsg);
      }
    },
    addProtocol(index) {
      // console.log(this.tableData);
      const data = JSON.parse(JSON.stringify(this.tableData[index]));
      data.id = index + 1;
      this.tableData.splice(index, 0, data);
      this.tableData.forEach((item, index2) => {
        index2 > index ? item.id++ : '';
      });
      console.log(this.tableData);
    },
    saveTable() {
      console.log(this.tableData);
      this.addProtocolList();
    },
    deleteFormat(index) {
      console.log(this.tableData[index]);
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.tableData.splice(index, 1);
        })
        .catch(() => {});
    },
    addKey(index) {
      this.editConfigForm.splice(index + 1, 0, { key: '', value: '' });
    },
    deleteKey(index) {
      this.editConfigForm.splice(index, 1);
      console.log(this.editConfigForm);
    },
    cancelEditConfig() {
      this.editConfigForm = {};
    },
    saveEditConfig() {
      console.log(this.editConfigForm, '改');
      let configList = this.editConfigForm.filter((config) => config.key != '' && config.value != '');
      console.log(configList.length);
      if (configList.length) {
        this.$set(this.tableData[this.editContentIndex], 'selectConfig', configList);
      } else {
        this.$set(this.tableData[this.editContentIndex], 'selectConfig', []);
      }
      console.log(this.tableData);
    },
    editConfig(item, index) {
      if (!item.selectConfig || !item.selectConfig.length) {
        this.editConfigForm = [{ key: '', value: '' }];
      } else {
        this.editConfigForm = JSON.parse(JSON.stringify(item.selectConfig));
      }
      this.editContentIndex = index;
      console.log(item);
      this.showEditDialog = true;
    },
    rowDrop() {
      const tbody = document.querySelector('.draggable .el-table__body-wrapper tbody');
      const _this = this;
      Sortable.create(tbody, {
        handle: '.draggable   .el-table__row .el-table__cell .cell .operate-btn-wrap  .el-icon-rank',
        draggable: '.draggable   .el-table__row',
        ...this.dropConfig,
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0];
          _this.tableData.splice(newIndex, 0, currRow);
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
</style>
