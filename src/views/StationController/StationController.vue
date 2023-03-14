<!--
 * @Author: heliling
 * @Date: 2022-10-31 14:02:16
 * @LastEditors: WangXin
 * @LastEditTime: 2023-03-10 10:15:51
 * @Description:
 *
 * Copyright (c) 2022 by YuXing, All Rights Reserved.
-->
<template>
  <div class="station-controller pd-20">
    <div>
      <div class="normal-btn" @click="toAddStation">新增站点</div>
      <div class="station-controller-list">
        <div class="station-item pd-20" v-for="(item, index) in listData" :key="index">
          <div class="station-item-image"><img :src="item.coverUrl" alt="" /></div>
          <div class="station-item-content">
            <div class="content-top">
              <div class="station-info">
                <div class="station-id">（{{ item.stationId }}）</div>
                <div class="station-name">{{ item.name }}</div>
                <div class="station-status" :class="[{ inuse: item.useStatus == 1 }, { closed: item.useStatus == 0 }]">{{ statusMap[item.useStatus] }}</div>
              </div>
              <div class="btn-wrap">
                <div class="normal-btn" :class="{ close: item.useStatus == 1 }" @click="statusSwitch(item)">{{ item.useStatus == 0 ? '开启使用' : '停用' }}</div>
                <div class="edit-btn"><i class="el-icon-edit" @click="toEdit(item)"></i></div>
                <div class="delete-btn"><i class="el-icon-delete" @click="toDelete(item)"></i></div>
              </div>
            </div>
            <div class="content-bottom">
              <div v-for="device in item.deviceList" :key="device.deviceId" class="equipment">
                ({{ device.deviceId }}) {{ device.name }}
                <div class="socket">
                  <span v-if="device.pduName">{{ device.pduName }}-{{ device.pduSocketName }}</span>
                  <div class="normal-btn" @click="bindHandler(item, device)">绑定PDU插口</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CommonDialog :show.sync="showAddDialog" dialog-width="990px" dialog-title="新增站点" customClass="station-add" @mainBtnClick="submitForm" :hasFooter="true">
      <template v-slot:body>
        <div class="dialog-content">
          <el-form ref="form" :model="form" :rules="rules">
            <div class="content">
              <div class="detail-wrap">
                <el-form-item label="站点名称" prop="name"><el-input v-model="form.name" placeholder="请输入站点名称"></el-input></el-form-item>
                <el-form-item label="站点ID" prop="stationId"><el-input v-model="form.stationId" placeholder="请输入站点ID"></el-input></el-form-item>
                <el-form-item label="是否启用自跟踪	" prop="autoTracking">
                  <el-radio-group v-model="form.autoTracking">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="detail-wrap">
                <el-form-item label="站点封面" prop="coverUrl">
                  <el-upload class="avatar-uploader" action :show-file-list="false" :http-request="uploadFile">
                    <img v-if="form.coverUrl" :src="form.coverUrl" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
                <el-form-item label="拓扑图配置文件" prop="gplotUrl">
                  <el-upload class="upload-demo" action limit="1" :show-file-list="false" :http-request="uploadGplot">
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                  <div class="text-ellipsis wd-100" :title="form.gplotUrl">{{ form.gplotUrl }}</div>
                </el-form-item>
              </div>
              <el-form-item label="站内设备" class="device">
                <div class="device-select">
                  <div class="left">
                    <div class="device-item" v-for="(item, index) in device" :key="item.deviceId" :index="index" v-show="!relations[item.key]">
                      <span class="ellipse" :title="item.value">{{ item.value }}</span>
                      <i class="el-icon-circle-plus-outline" @click="addItem(false, index)" v-if="!relations[item.key]"></i>
                    </div>
                  </div>
                  <div class="right">
                    <div v-for="(item, index) in device" :key="item.deviceId" class="item-group" v-show="relations[item.key]">
                      <el-checkbox v-model="relations[item.key]" class="form-item-line">{{ item.value }}</el-checkbox>
                      <div>
                        <el-input v-model="deviceProtocolRelations[index].name" placeholder="请输入设备名称" class="form-item-line"></el-input>
                        <el-input v-model="deviceProtocolRelations[index].deviceId" placeholder="请输入设备ID" class="form-item-line"></el-input>
                        <el-select v-model="deviceProtocolRelations[index].protocolUuid" class="normal-select form-item-line" placeholder="请关联设备协议">
                          <el-option v-for="item in protocolList" :key="item.protocaolUuid" :label="`${item.name}  ${item.version}`" :value="item.protocaolUuid"></el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- <div v-for="(item, index) in device" :key="item.deviceId">
                  <el-checkbox v-model="relations[item.key]" class="form-item-line">{{ item.value }}</el-checkbox>
                  <div v-show="relations[item.key]">
                    <el-input v-model="deviceProtocolRelations[index].name" placeholder="请输入设备名称" class="form-item-line"></el-input>
                    <el-input v-model="deviceProtocolRelations[index].deviceId" placeholder="请输入设备ID" class="form-item-line"></el-input>
                    <el-select v-model="deviceProtocolRelations[index].protocolUuid" class="normal-select form-item-line" placeholder="请关联设备协议">
                      <el-option v-for="item in protocolList" :key="item.protocaolUuid" :label="`${item.name}  ${item.version}`" :value="item.protocaolUuid"></el-option>
                    </el-select>
                  </div>
                </div> -->
              </el-form-item>
            </div>
          </el-form>
        </div>
      </template>
      <template v-slot:footer>
        <button class="button-default outline" @click="cancelSubmit">取消</button>
        <button class="button-default" @click="submitForm" :disabled="saveDisabled">确认</button>
      </template>
    </CommonDialog>
    <CommonDialog :show.sync="showEditDialog" dialog-width="990px" dialog-title="修改站点" customClass="station-add" :hasFooter="true" @mainBtnClick="submitEditForm">
      <template v-slot:body>
        <div class="dialog-content">
          <el-form ref="editForm" :model="editForm" :rules="rules">
            <div class="content">
              <div class="detail-wrap">
                <el-form-item label="站点名称" prop="name"><el-input v-model="editForm.name" placeholder="请输入站点名称"></el-input></el-form-item>
                <el-form-item label="站点ID" prop="stationId"><el-input v-model="editForm.stationId" placeholder="请输入站点ID"></el-input></el-form-item>
                <el-form-item label="是否启用自跟踪	" prop="autoTracking">
                  <el-radio-group v-model="editForm.autoTracking">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="detail-wrap">
                <el-form-item label="站点封面" prop="coverUrl">
                  <el-upload class="avatar-uploader" action :show-file-list="false" :http-request="editUploadFile">
                    <img v-if="editForm.coverUrl" :src="editForm.coverUrl" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
                <el-form-item label="拓扑图配置文件" prop="gplotUrl">
                  <el-upload class="upload-demo" action limit="1" accept=".json" :show-file-list="false" :http-request="editUploadGplot">
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                  <div class="text-ellipsis wd-100" :title="editForm.gplotUrl">{{ editForm.gplotUrl }}</div>
                </el-form-item>
              </div>
              <el-form-item label="站内设备" class="device">
                <div class="device-select">
                  <div class="left">
                    <div class="device-item" v-for="(item, index) in device" :key="item.deviceId" :index="index" v-show="!editRelations[item.key]">
                      <span class="ellipse" :title="item.value">{{ item.value }}</span>
                      <i class="el-icon-circle-plus-outline" @click="addItem(true, index)" v-if="!editRelations[item.key]"></i>
                    </div>
                  </div>
                  <div class="right">
                    <div v-for="(item, index) in device" :key="item.deviceId" class="item-group" v-show="editRelations[item.key]">
                      <el-checkbox v-model="editRelations[item.key]" class="form-item-line">{{ item.value }}</el-checkbox>
                      <div>
                        <el-input v-model="editDeviceProtocolRelations[index].name" placeholder="请输入设备名称" class="form-item-line"></el-input>
                        <el-input v-model="editDeviceProtocolRelations[index].deviceId" placeholder="请输入设备ID" class="form-item-line"></el-input>
                        <el-select v-model="editDeviceProtocolRelations[index].protocolUuid" class="normal-select form-item-line" placeholder="请关联设备协议">
                          <el-option v-for="item in protocolList" :key="item.protocaolUuid" :label="`${item.name}  ${item.version}`" :value="item.protocaolUuid"></el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- <div v-for="(item, index) in device" :key="item.deviceId">
                  <el-checkbox v-model="editRelations[item.key]" class="form-item-line">{{ item.value }}</el-checkbox>
                  <div v-show="editRelations[item.key]">
                    <el-input v-model="editDeviceProtocolRelations[index].name" placeholder="请输入设备名称" class="form-item-line"></el-input>
                    <el-input v-model="editDeviceProtocolRelations[index].deviceId" placeholder="请输入设备ID" class="form-item-line"></el-input>
                    <el-select v-model="editDeviceProtocolRelations[index].protocolUuid" class="normal-select form-item-line" placeholder="请关联设备协议">
                      <el-option v-for="item in protocolList" :key="item.protocaolUuid" :label="`${item.name}  ${item.version}`" :value="item.protocaolUuid"></el-option>
                    </el-select>
                  </div>
                </div> -->
              </el-form-item>
            </div>
          </el-form>
        </div>
      </template>
      <template v-slot:footer>
        <button class="button-default outline" @click="cancelEditSubmit">取消</button>
        <button class="button-default" @click="submitEditForm" :disabled="editDisabled">确认</button>
      </template>
    </CommonDialog>
    <CommonDialog :show.sync="showPduDialog" dialog-width="490px" dialog-title="绑定PDU插口" customClass="pdu-bind" :hasFooter="true">
      <template v-slot:body>
        <div class="dialog-content">
          <el-form ref="form" :model="form" label-width="70px" :rules="rules">
            <div class="content">
              <el-cascader placeholder="请选择插口" v-model="socket" :options="options" :props="{ label: 'value', value: 'key' }" clearable></el-cascader>
            </div>
          </el-form>
        </div>
      </template>
      <template v-slot:footer>
        <button class="button-default outline" @click="cancelBind">取消</button>
        <button class="button-default" @click="bindPduSocket(true)" :disabled="bindDisabled">保存</button>
        <button class="button-default remove" @click="bindPduSocket(false)" :disabled="!ableToRemove">解除绑定</button>
      </template>
    </CommonDialog>
  </div>
</template>
<script>
import CommonDialog from '@/components/common/CommonDialog/index.vue';
export default {
  data() {
    return {
      ableToRemove: false,
      removeDisabled: false,
      bindDisabled: true,
      deviceId: '',
      socket: [],
      options: [],
      showPduDialog: false,
      stationUuid: '',
      editDisabled: false,
      saveDisabled: false,
      rules: {
        name: [{ required: true, trigger: 'blur', message: '请输入站点名称' }],
        stationId: [{ required: true, trigger: 'blur', message: '请输入站点ID' }],
      },
      protocolList: [],
      editRelations: {},
      editForm: {},
      // coverUrl: '',
      editDeviceProtocolRelations: [],
      deviceProtocolRelations: [],
      relations: {},
      form: { name: '', stationId: '', coverUrl: '' },
      showAddDialog: false,
      showEditDialog: false,
      statusMap: { 0: '已停用', 1: '使用中' },
      listData: [],
      device: [],
      GplotDataName: '',
    };
  },

  components: {
    CommonDialog,
  },
  watch: {
    socket(val) {
      if (val.length) {
        this.bindDisabled = false;
      } else {
        this.bindDisabled = true;
      }
    },
  },
  created() {
    this.getDevice();
    this.getProtocol();
    this.getData();
  },

  methods: {
    addItem(isEdit, index) {
      if (isEdit) {
        this.$set(this.editRelations, `${this.device[index].key}`, true);
      } else {
        this.$set(this.relations, `${this.device[index].key}`, true);
      }
    },
    cancelBind() {
      this.showPduDialog = false;
    },
    async bindPduSocket(isBind) {
      let param = {
        deviceId: this.deviceId,
        pduDeviceId: isBind ? this.socket[0] : '',
        socketIndex: isBind ? this.socket[1] : '',
      };
      const data = await this.$api.bindPpduSocket(param);
      if (data.code == 200) {
        this.$message.success(data.resultMsg);
        this.showPduDialog = false;
        this.getData();
      } else {
        this.$message.error(data.resultMsg);
      }
    },
    async bindHandler(item, device) {
      this.deviceId = device.deviceId;
      if (device.pduDeviceId) {
        this.ableToRemove = true;
        this.socket = [device.pduDeviceId, device.pduSocketIndex + ''];
      } else {
        this.ableToRemove = false;
        this.socket = [];
      }
      const data = await this.$api.getPduSocketList({ stationId: item.stationId });
      this.options = data.data;
      this.handleEmptyArray(this.options);
      this.showPduDialog = true;
    },
    handleEmptyArray(data) {
      data.forEach((item) => {
        if (item.children && item.children.length > 0) {
          this.handleEmptyArray(item.children);
        } else {
          delete item.children;
        }
      });
    },
    async editUploadFile(file) {
      const data = await this.$api.uploadFiles(file.file);
      this.editForm.coverUrl = data.fileUrl;
    },
    async editUploadGplot(file) {
      const data = await this.$api.uploadFiles(file.file);
      this.editForm.gplotUrl = data.fileUrl;
    },
    // editGplotBeforeUpload(file) {
    //   console.log('执行编辑测站的拓扑图文件读取');
    //   const FILE_NAME = file.name;
    //   if (FILE_NAME.substring(FILE_NAME.lastIndexOf('.')) !== '.json') {
    //     this.$message.warning('仅支持.json文件');
    //     return false;
    //   }
    //   const isLt1M = file.size / 1024 / 1024 < 1;
    //   if (isLt1M) {
    //     this.file = file;
    //     let reader = new FileReader();
    //     reader.onload = (evt) => {
    //       this.editForm.gplotUrl = JSON.parse(evt.target.result);
    //       this.GplotDataName = FILE_NAME;
    //     };
    //     reader.readAsText(file.raw, 'UTF-8');
    //     return true;
    //   } else {
    //     this.$message.warning('请上传不超过1M的文件');
    //     return false;
    //   }
    // },
    async uploadFile(file) {
      const data = await this.$api.uploadFiles(file.file);
      this.form.coverUrl = data.fileUrl;
    },
    async uploadGplot(file) {
      const data = await this.$api.uploadFiles(file.file);
      this.form.gplotUrl = data.fileUrl;
    },
    // newGplotBeforeUpload(file) {
    //   console.log('执行新增测站的拓扑图文件读取');
    //   const FILE_NAME = file.name;
    //   if (FILE_NAME.substring(FILE_NAME.lastIndexOf('.')) !== '.json') {
    //     this.$message.warning('仅支持.json文件');
    //     return false;
    //   }
    //   const isLt1M = file.size / 1024 / 1024 < 1;
    //   if (!isLt1M) {
    //     this.$message.warning('请上传不超过1M的文件');
    //     return false;
    //   } else {
    //     let reader = new FileReader();
    //     reader.onload = (evt) => {
    //       this.form.gplotUrl = JSON.parse(evt.target.result);
    //       this.GplotDataName = FILE_NAME;
    //     };
    //     reader.readAsText(file.raw, 'UTF-8');
    //     return true;
    //   }
    // },
    async getProtocol() {
      const data = await this.$api.getProtocol();
      this.protocolList = data.data;
    },
    cancelSubmit() {
      this.showAddDialog = false;
    },
    async saveEdit(callback) {
      this.editDisabled = true;
      let arr = [];
      arr = Object.keys(this.editRelations).filter((item) => this.editRelations[item] == true);
      let editDeviceProtocolRelations = [];
      this.editDeviceProtocolRelations.forEach((item) => {
        if (arr.includes(item.deviceEnum) && Object.keys(item).length > 1) editDeviceProtocolRelations.push(item);
      });

      this.editForm.deviceProtocolRelations = editDeviceProtocolRelations;
      let form = {
        gplotUrl: this.editForm.gplotUrl,
        coverUrl: this.editForm.coverUrl,
        deviceProtocolRelations: this.editForm.deviceProtocolRelations,
        name: this.editForm.name,
        stationId: this.editForm.stationId,
        stationUuid: this.stationUuid,
        autoTracking: this.editForm.autoTracking,
      };
      console.log(form);
      const data = await this.$api
        .editStation(form)
        .then((data) => {
          this.$message.success(data.resultMsg);
          // 清空表单
          this.$refs.editForm.resetFields();
          this.GplotDataName = '';
          this.showEditDialog = false;
        })
        .catch((err) => {
          this.$message.error(err.resultMsg);
        });
      this.editDisabled = false;
      this.getData();
      // 执行回调
      if (callback) {
        callback();
      }
      return data;
    },
    submitEditForm() {
      this.$refs.editForm.validate((valid) => {
        if (!valid) {
          return false;
        }
        this.saveEdit();
        return true;
      });
    },
    cancelEditSubmit() {
      this.showEditDialog = false;
    },
    async getDevice() {
      const data = await this.$api.getSelectDevice();
      this.device = data.data;
    },
    async getData() {
      const data = await this.$api.searchStation({
        pageIndex: 1,
        pageSize: 10000,
        useStatus: -1,
      });
      this.listData = data.data.records;
    },
    async statusSwitch(item) {
      let useStatus = item.useStatus == 1 ? 0 : 1;
      const data = await this.$api
        .changeStationStatus({ status: useStatus }, item.stationUuid)
        .then((data) => {
          this.$message.success(data.resultMsg);
        })
        .catch((err) => {
          this.$message.error(err.resultMsg);
        });
      this.getData();
    },
    toEdit(item) {
      this.stationUuid = item.stationUuid;
      this.editForm = {};
      this.editRelations = {};
      this.editDeviceProtocolRelations = [];
      this.device.forEach((item) => {
        this.editDeviceProtocolRelations.push({ deviceEnum: item.key });
      });
      this.editForm = { ...item };
      if (this.editForm.deviceList) {
        this.editDeviceProtocolRelations.forEach((item1, index) => {
          this.editForm.deviceList.forEach((item) => {
            if (item.alias == item1.deviceEnum) {
              // this.editDeviceProtocolRelations[index] = {
              //   deviceEnum: item.alias,
              //   deviceId: item.deviceId,
              //   protocolUuid: item.protocolUuid,
              // };
              this.$set(this.editDeviceProtocolRelations, index, { name: item.name, deviceEnum: item.alias, deviceId: item.deviceId, protocolUuid: item.protocolUuid });
            }
          });
        });
        let obj = {};
        this.device.forEach((item) => {
          this.editForm.deviceList.forEach((item1) => {
            if (item.key == item1.alias) {
              obj[item.key] = true;
            }
          });
        });
        this.editRelations = Object.assign({}, obj);
      }
      this.showEditDialog = true;
    },
    toDelete(item) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.DeleteHandler(item);
        })
        .catch(() => {});
    },
    async DeleteHandler(item) {
      const data = await this.$api.deleteStation(item.stationUuid);
      if (data.code == 200) {
        this.getData();
        this.$message.success(data.resultMsg);
      } else {
        this.$message.error(data.resultMsg);
      }
    },
    toAddStation() {
      this.form = { coverUrl: '', deviceProtocolRelations: [], name: [], stationId: [] };
      this.relations = {};
      this.deviceProtocolRelations = [];
      this.device.forEach((item) => {
        this.deviceProtocolRelations.push({ deviceEnum: item.key });
      });
      this.showAddDialog = true;
    },
    async save(callback) {
      this.saveDisabled = true;
      let arr = [];
      arr = Object.keys(this.relations).filter((item) => this.relations[item] == true);
      let deviceProtocolRelations = [];
      this.deviceProtocolRelations.forEach((item) => {
        if (arr.includes(item.deviceEnum) && Object.keys(item).length > 1) deviceProtocolRelations.push(item);
      });
      this.form.deviceProtocolRelations = deviceProtocolRelations;
      const data = await this.$api
        .addStation(this.form)
        .then((data) => {
          this.$message.success(data.resultMsg);
          this.$refs.form.resetFields();
          this.GplotDataName = '';
          this.showAddDialog = false;
        })
        .catch((err) => {
          this.$message.error(err.resultMsg);
        });
      this.getData();
      this.saveDisabled = false;

      // 执行回调
      if (callback) {
        callback();
      }
      return data;
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false;
        }
        this.save();
      });

      return true;
    },
  },
};
</script>
<style lang="scss" scoped>
.el-dialog.common-dialog.station-add {
  .dialog-content {
    padding: 12px 24px;
    .content {
      width: 100%;
      // width: 338px;
      .detail-wrap {
        display: flex;
        .el-form-item {
          margin-right: 24px;
        }
      }
      .el-form-item {
        margin-bottom: 20px;
        &.device {
          :deep() .el-form-item__content {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            > div {
              width: calc((100% - 48px) / 3);
              margin-right: 24px;
              &:nth-child(3n) {
                margin-right: 0;
              }
              &.device-select {
                display: flex;
                padding: 14px 1px;
                width: 100%;
                background: rgba(255, 255, 255, 0.12);
                border: 1px solid #e8ecef;
                box-shadow: 0px 3px 6px #d6e3f3;
                border-radius: 2px;

                .left {
                  width: 183px;
                  border-right: #8a9cb8 1px solid;
                  .device-item {
                    color: var(--yx-font-2);
                    padding: 2px 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    span {
                      width: 139px;
                    }
                    i {
                      color: #4288ee;
                      cursor: pointer;
                      font-size: 18px;
                    }
                  }
                }
                .right {
                  padding: 0 12px;
                  .item-group {
                    display: flex;

                    .el-checkbox {
                      margin-right: 12px;
                    }
                    div {
                      display: flex;
                      .form-item-line.el-input {
                        margin-right: 12px;
                        &:nth-child(2) {
                          width: 120px;
                          flex-shrink: 0;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        .form-item-line {
          margin-bottom: 12px;
        }
        &:deep() {
          .el-checkbox__label {
            width: 134px;
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

.el-dialog.common-dialog.pdu-bind {
  .content {
    padding: 30px;
    margin: 0 auto;
  }
  .dialog-footer {
    .button-default.remove {
      margin-left: 20px;
      border-color: var(--yx-danger-3);
      background: var(--yx-danger-3);
      &[disabled] {
        border-color: var(--yx-layer-1);
        background: var(--yx-layer-1);
      }
    }
  }
}
.station-controller {
  padding: 24px 28px 28px;
  background: var(--yx-background-gradient);
  height: calc(100% - 54px);
  overflow: scroll;
  .station-controller-list {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 30px;
    .station-item {
      width: 100%;
      min-width: 654px;
      display: flex;
      margin: 23px 20px 25px 0;
      background: var(--yx-container-translucent);
      border: 1px solid #e8ecef;
      border-radius: 4px;
      color: var(--yx-font-2);
      &:nth-child(2n) {
        margin-right: 0;
      }
      .station-item-image {
        margin-right: 20px;
        flex-shrink: 0;
        width: 150px;
        height: 150px;
        background: #f2f2f2;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .station-item-content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        .content-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          white-space: nowrap;
          .station-info {
            display: flex;
            .station-id {
              color: var(--yx-title-2);
            }
            .station-name {
              font-weight: 500;
              margin: 0 12px;
            }
            .station-status {
              padding: 0 12px;
              height: 22px;
              line-height: 20px;
              background: rgba(255, 255, 255, 0.16);
              border-radius: 15px;
              font-size: 14px;

              &.inuse {
                border: 1px solid var(--yx-success-4);
                color: var(--yx-success-4);
              }
              &.closed {
                border: 1px solid var(--yx-danger-3);
                color: var(--yx-danger-3);
              }
            }
          }
          .btn-wrap {
            display: flex;
            align-items: center;
            i {
              font-size: 18px;
              font-weight: 600;
            }
            .normal-btn {
              background: var(--yx-success-4);
              &.close {
                background: var(--yx-danger-3);
              }
            }
            .edit-btn {
              margin: 0 20px;
              cursor: pointer;
              i {
                color: var(--yx-btn);
              }
            }
            .delete-btn {
              cursor: pointer;
              i {
                color: var(--yx-danger-3);
              }
            }
          }
        }
        .content-bottom {
          display: flex;
          flex-wrap: wrap;
          padding-top: 12px;
          .equipment {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            align-items: center;
            margin: 8px 24px 0 0;
            padding: 8px 12px;
            width: calc((100% - 48px) / 3);
            min-width: min-content;
            border-radius: 6px;
            font-size: 12px;
            background: var(--yx-background-5);
            //  border: 1px solid var(--yx-border-1);
            .socket {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              flex-grow: 1;
              span {
                margin: 0 12px;
              }
              .normal-btn {
                min-width: 104px;
              }
            }
            &:nth-child(3n) {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
}
</style>
