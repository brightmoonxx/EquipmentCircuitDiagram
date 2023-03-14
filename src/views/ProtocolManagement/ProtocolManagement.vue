<template>
  <div class="protocol-management pd-20">
    <router-view></router-view>
    <div class="hg-100">
      <div class="head-operate">
        <el-form :inline="true" :model="formInline" class="macro-parameter-admin-form">
          <el-form-item>
            <el-select v-model="formInline.deviceTag" filterable clearable class="normal-select form-item-line" placeholder="站内设备">
              <el-option v-for="item in tagGroup" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" class="normal-btn" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="normal-btn" @click="toAdd">新增协议</div>
      </div>

      <!-- <div class="normal-btn mg-x-10" @click="testProtocol">协议测试</div> -->
      <div class="protocol-management-list">
        <!-- <div class="protocol-item pd-20" v-for="(item, index) in listData" :key="index">
          <div class="protocol-info">
            <div class="protocol-name ellipsis2">{{ item.name }}</div>
            <div class="protocol-id">（{{ item.version }}）</div>
            <div class="protocol-time">{{ item.createTime }}</div>
          </div>
          <div class="btn-wrap">
            <div class="normal-btn primary" @click="formatManage(item)">格式管理</div>
            <div class="mg-x-10 edit-btn"><i class="el-icon-edit" @click="toEdit(item)"></i></div>
            <div class="mg-right-10 cursor-pointer" @click="toCopy(item)"><i class="el-icon-document-copy"></i></div>
            <div class="delete-btn"><i class="el-icon-delete" @click="toDelete(item)"></i></div>
          </div>
        </div> -->
        <el-table class="normal-table station-table" :data="listData" highlight-current-row fit>
          <el-table-column label="序号" align="center" type="index" width="70px"></el-table-column>
          <el-table-column label="协议名称" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name || '无' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="协议版本" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.version || '无' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime || '无' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div class="operate-btn-wrap">
                <div class="table-operate-btn" @click="formatManage(scope.row)">格式管理</div>
                <div class="edit-btn" title="编辑"><i class="el-icon-edit" @click="toEdit(scope.row)"></i></div>
                <div class="cursor-pointer" title="复制" @click="toCopy(scope.row)"><i class="el-icon-document-copy"></i></div>
                <div class="cursor-pointer" title="下载" @click="toDownload(scope.row)"><i class="el-icon-download"></i></div>

                <div class="delete-btn" title="删除"><i class="el-icon-delete" @click="toDelete(scope.row)"></i></div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <CommonDialog
      :show.sync="showAddDialog"
      dialog-width="490px"
      dialog-title="新增协议"
      customClass="protocol-add"
      :showMainBtn="true"
      mainBtnText="保存"
      :showSubBtn="true"
      subBtnText="取消"
      @mainBtnClick="submitForm"
      @subBtnClick="cancelAdd"
    >
      <template v-slot:body>
        <div class="dialog-content">
          <el-form ref="form" :model="form" label-width="70px">
            <div class="content">
              <el-form-item label="协议名称" prop="name"><el-input v-model="form.name" placeholder="请输入协议名称"></el-input></el-form-item>
              <el-form-item label="协议版本" prop="version"><el-input v-model="form.version" placeholder="请输入协议版本"></el-input></el-form-item>
              <el-form-item label="站内设备" prop="deviceTag">
                <el-select v-model="form.deviceTag" class="normal-select form-item-line" placeholder="站内设备">
                  <el-option v-for="item in tagGroup" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="协议文件" prop="coverUrl">
                <el-upload class="file-upload" action="''" :http-request="() => {}" :before-upload="uploadSuccess" :file-list="fileList" limit="1" :on-remove="fileRemove" :multiple="false">
                  <div class="normal-btn" :class="{ cancel: fileList.length }">选择文件</div>
                  <div slot="tip" v-show="fileList.length == 0" class="el-upload__tip">未选择文件</div>
                </el-upload>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </template>
    </CommonDialog>
    <CommonDialog
      :show.sync="showEditDialog"
      dialog-width="490px"
      :dialog-title="isCopy ? '复制协议' : '编辑协议'"
      customClass="protocol-add"
      :showMainBtn="true"
      mainBtnText="保存"
      :showSubBtn="true"
      subBtnText="取消"
      @mainBtnClick="submitEditForm"
      @subBtnClick="cancelEdit"
    >
      <template v-slot:body>
        <div class="dialog-content overflow-hidden">
          <el-form ref="editForm" :model="editForm" label-width="70px">
            <div class="content">
              <el-form-item label="协议名称" prop="name"><el-input v-model="editForm.name" placeholder="请输入协议名称"></el-input></el-form-item>
              <el-form-item label="协议版本" prop="version"><el-input v-model="editForm.version" placeholder="请输入协议版本"></el-input></el-form-item>
              <el-form-item label="站内设备" prop="deviceTag">
                <el-select v-model="editForm.deviceTag" class="normal-select form-item-line" placeholder="站内设备">
                  <el-option v-for="item in tagGroup" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="协议文件" prop="coverUrl">
                <el-upload class="file-upload" action="''" :http-request="() => {}" :before-upload="editUploadSuccess" :file-list="fileList" limit="1" :on-remove="editFileRemove" :multiple="false">
                  <div class="normal-btn" :class="{ cancel: editForm.fileUrl }">选择文件</div>
                  <div slot="tip" v-show="fileList.length == 0" class="el-upload__tip">未选择文件</div>
                </el-upload>
                <div class="text-ellipsis wd-100" :title="editForm.fileUrl">{{ editForm.fileUrl }}</div>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </template>
    </CommonDialog>
  </div>
</template>
<script>
import CommonDialog from '@/components/common/CommonDialog/index.vue';
export default {
  data() {
    return {
      tagGroup: [],
      formInline: { deviceTag: '' },
      editRelations: {},
      editForm: {},
      fileList: [],
      editDeviceProtocolRelations: [],
      deviceProtocolRelations: [],
      relations: {},
      form: { name: '', version: '', fileUrl: '' },
      showAddDialog: false,
      showEditDialog: false,
      isCopy: false,
      statusMap: { 0: '已停用', 1: '使用中' },
      listData: [],
      device: [],
    };
  },

  components: {
    CommonDialog,
  },
  watch: {
    showEditDialog(val) {
      if (!val) return (this.isCopy = false);
    },
  },
  created() {
    this.device.forEach((item) => {
      this.deviceProtocolRelations.push({ deviceEnum: item.key });
      this.editDeviceProtocolRelations.push({ deviceEnum: item.key });
    });
    this.getProtocol();
    this.getDevice();
    this.getDeviceTagGroup();
  },
  methods: {
    async getDeviceTagGroup() {
      const data = await this.$api.getDeviceTagGroup();
      this.tagGroup = data.data;
    },
    onSubmit() {
      this.getProtocol();
    },
    toDownload(item) {
      window.location.href = item.fileUrl;
    },
    async getDevice() {
      const data = await this.$api.getSelectDevice();
      this.device = data.data;
    },
    async getProtocol() {
      const { data } = await this.$api.getProtocol({ deviceTag: this.formInline.deviceTag });
      this.listData = data;
    },
    async uploadFiles(file) {
      if (file) {
        const data = await this.$api.uploadFiles(file);
        return data.fileUrl;
      }
    },
    async addProtocol() {
      const data = await this.$api.addProtocol(this.form);
      if (data.code == 200) {
        this.formatManage(data.data);
        this.getProtocol();
        return this.$message.success(data.resultMsg);
      }
    },
    async changeProtocol() {
      const data = await this.$api.changeProtocol(this.editForm);
      if (data.code == 200) {
        this.getProtocol();
        return this.$message.success(data.resultMsg);
      }
    },
    async deleteProtocol(protocolUuid) {
      const data = await this.$api.deleteProtocol({ protocolUuid });
      if (data.isSuccess) {
        this.getProtocol();
        return this.$message.success(data.isSuccess ? '删除成功' : '删除失败');
      }
    },
    async copyProtocol() {
      const data = await this.$api.copyProtocol(this.editForm);
      if (data.code == 200) {
        this.getProtocol();
        return this.$message.success(data.resultMsg);
      }
    },
    toCopy(item) {
      this.editForm = JSON.parse(JSON.stringify(item));
      this.showEditDialog = true;
      this.isCopy = true;
    },
    testProtocol() {
      const route = this.$router.resolve({ path: '/testProtocol' });
      window.open(route.href, '_blank');
    },
    fileRemove(file, fileList) {
      this.fileList = fileList;
    },
    uploadSuccess(file) {
      console.log(file);
      this.fileList = [];
      this.fileList.push(file);
    },
    editFileRemove(file, fileList) {
      this.editForm.coverUrl = file;
    },
    editUploadSuccess(file) {
      this.fileList.push(file);
    },
    formatManage(item) {
      console.log(item);
      this.$router.push(`/protocol-management/format?id=${item.protocaolUuid}`);
    },
    toEdit(item) {
      this.fileList = [];
      this.editForm = item;

      this.showEditDialog = true;
    },
    toDelete(item) {
      console.log(item, '删除');
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deleteProtocol(item.protocaolUuid);
        })
        .catch(() => {});
    },
    toAdd() {
      this.fileList = [];
      this.showAddDialog = true;
    },
    async submitForm() {
      // console.log(this.fileList[0]);
      this.form.fileUrl = await this.uploadFiles(this.fileList[0]);
      this.addProtocol();
    },
    cancelAdd() {
      this.$refs.form.resetFields();
      this.fileList = [];
    },
    async submitEditForm() {
      if (this.isCopy) return this.copyProtocol();
      if (this.fileList.length > 0) {
        this.editForm.fileUrl = await this.uploadFiles(this.fileList[0]);
      }
      this.changeProtocol();
    },
    cancelEdit() {
      this.$refs.editForm.resetFields();
      this.isCopy = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.el-dialog.common-dialog.protocol-add {
  .file-upload {
    display: flex;
    align-items: center;
    :deep() .el-upload__tip {
      margin-left: 8px;
    }
  }
  .dialog-content {
    padding: 12px 24px;
    .content {
      width: 338px;
      .el-form-item {
        margin-bottom: 20px;
        .form-item-line {
          margin-bottom: 12px;
        }
        &:deep() {
          .el-checkbox__label {
            color: var(--yx-title-2);
            font-size: 14px;
          }
          .el-select {
            width: 100%;
          }
          .avatar-uploader {
            .el-upload--text {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100px;
              height: 100px;
              background-color: var(--yx-font-7);
              color: var(--yx-font-5);
              border: 1px solid var(--yx-border-1);
              border-radius: 4px;
            }

            img {
              width: 100%;
            }
          }
        }
      }
    }
  }
}
.protocol-management {
  padding: 24px 28px 28px;
  background: var(--yx-background-gradient);
  height: calc(100% - 114px);
  overflow: auto;
  .head-operate {
    display: flex;
    margin: 20px 0;
    > .normal-btn {
      margin-left: 28px;
    }
  }
  .protocol-management-list {
    display: flex;
    flex-wrap: wrap;
    // height: calc(100% - 500px);
    // overflow-y: scroll;
    .normal-table {
      .operate-btn-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        > div {
          cursor: pointer;
          margin: 0 18px;
        }
        i {
          font-size: 18px;
          font-weight: 600;
        }

        .edit-btn {
          i {
            color: var(--yx-btn);
          }
        }
        .delete-btn {
          i {
            color: var(--yx-danger-3);
          }
        }
      }
    }
    .protocol-item {
      width: 300px;
      display: flex;
      flex-direction: column;
      margin: 23px 23px 23px 0;
      background: var(--yx-content-header);
      border: 1px solid var(--yx-border-1);
      border-radius: 4px;
      color: var(--yx-font-2);

      .protocol-info {
        .protocol-id {
          margin-top: 12px;
          color: var(--yx-title-2);
        }
        .protocol-name {
          min-height: 42px;
          font-weight: 500;
          margin: 0 12px;
        }
        .protocol-time {
          margin: 20px 0;
          font-size: 12px;
          color: #7b8fb0;
        }
      }

      .content-bottom {
        display: flex;
        flex-wrap: wrap;
        .equipment {
          margin: 8px 24px 0 0;
          padding: 8px 12px;
          width: calc((100% - 48px) / 3);
          border-radius: 6px;
          background: var(--yx-background-5);
          //  border: 1px solid var(--yx-border-1);
          &:nth-child(3n) {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
