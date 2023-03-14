<!--
 * @Author: heliling
 * @Date: 2022-11-02 16:32:28 
 * @LastEditors: heliling
 * @LastEditTime: 2023-01-09 18:25:33
 * @LastEditTime: 2023-01-09 10:48:31
 * @Description: 
 * 
 * Copyright (c) 2022 by YuXing, All Rights Reserved. 
-->
<template>
  <div class="protocol-pattern">
    <div class="pattern">
      <el-form :inline="true" :model="formInline" class="add-form">
        <el-form-item>
          <el-input v-model="formInline.patternName" placeholder="请输入模式名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.patternIndex" placeholder="请输入模式索引值"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="normal-btn primary" @click="onSubmit">添加模式</el-button>
        </el-form-item>
      </el-form>

      <el-table class="normal-table format-table" row-key="id" :data="patternData" style="width: 500px" border>
        <el-table-column label="模式名称" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.patternName"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="模式索引值" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.patternIndex"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" min-width="150px">
          <template slot-scope="scope">
            <div class="flex-center">
              <div class="operate-btn-wrap">
                <i class="operate-btn el-icon-success" @click="updateProtocolPattern(scope.row)"></i>
              </div>
              <div class="operate-btn-wrap">
                <i class="operate-btn el-icon-delete-solid" @click="deletePattern(scope.row)"></i>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="unit pd-20">
      <div class="unit-header">
        <div class="tabs">
          <div v-for="(item, index) in config.unitType" :key="item.key" class="tab-item normal-btn plain" :class="index == activeIndex ? 'active' : ''" @click="tabClick(item, index)">
            {{ item.value }}
          </div>
        </div>
        <div class="normal-btn" @click="addUnit">新增单元</div>
      </div>
      <el-select v-if="patternData.length > 0" clearable @change="changePattern" class="normal-select" placeholder="选择模式/如有" v-model="searchPatternUuid">
        <el-option v-for="item in patternData" :key="item.patternUuid" :label="item.patternName" :value="item.patternUuid"></el-option>
      </el-select>
      <div class="unit-list pd-20">
        <el-collapse accordion v-model="collapseName" @change="changeCollapse">
          <el-collapse-item class="unit-item" v-for="(item, index) in unitList" :key="item.unitUuid" :name="index">
            <template slot="title">
              <div class="unit-item-header">
                <div class="item-info">
                  名称:{{ item.unitName }}&nbsp;&nbsp;
                  <span v-if="item.unitId !== '' || item.unitId !== null">id {{ item?.unitId }}</span>
                  <span v-if="item.responseMessageValue !== null">上报信息类别：{{ item.responseMessageValue }}</span>
                  <span v-if="item.parseMessageValue !== null">解析信息类别：{{ item.parseMessageValue }}</span>
                </div>
                <div v-if="item.responseUnit">响应单元：{{ item.responseUnit.unitName }}</div>
                <div class="operate-btn-wrap">
                  <i class="operate-btn el-icon-search" title="放大显示" @click.stop="item.zoom = true"></i>
                  <i class="operate-btn el-icon-rank" title="按住拖拽"></i>
                  <i class="operate-btn el-icon-copy-document" @click.stop="copyUnitItem(item)"></i>
                  <i class="operate-btn el-icon-edit" @click.stop="editUnit(item)"></i>
                  <i class="operate-btn el-icon-delete-solid" @click.stop="deleteUnit(item)"></i>
                  <!-- <i class="operate-btn el-icon-arrow-down" @click="foldHandler(index)"></i> -->
                </div>
              </div>
            </template>
            <div class="unit-item-content" :class="item.zoom ? 'full' : 'pd-20'">
              <el-button v-if="item.zoom" class="mg-y-10" style="position: fixed; top: 20px; z-index: 4" @click.stop="item.zoom = false">恢复</el-button>
              <el-table class="normal-table format-table" :height="item.zoom ? '' : 300" style="width: 100%" row-key="id" :data="item.tableData">
                <el-table-column label="序号" fixed="left" type="index" width="70"></el-table-column>
                <el-table-column label="名称" fixed="left" width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.paramName"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="参数key" fixed="left" width="200">
                  <template slot-scope="scope">
                    <div class="flex align-items-center">
                      <el-input v-model="scope.row.paramKey" :disabled="scope.row.disabled"></el-input>
                      <i :class="scope.row.disabled ? 'el-icon-edit-outline' : 'el-icon-circle-check'" class="mg-left-10" @click="scope.row.disabled = !scope.row.disabled"></i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="150">
                  <template slot-scope="scope">
                    <div class="operate-btn-wrap">
                      <i class="operate-btn el-icon-rank" title="按住拖拽"></i>
                      <i class="operate-btn el-icon-circle-plus" @click="addUnitItem(index, scope.$index)"></i>
                      <i class="operate-btn el-icon-delete-solid" @click="deleteTableData(scope.$index)"></i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="参数设置" min-width="200" v-if="activeUnitType == 'PARAM_SETTING'">
                  <template slot-scope="scope">
                    <el-cascader
                      clearable
                      v-model="scope.row.bind"
                      :props="{ label: 'name', value: 'id', children: 'bodyList', leaf: 'bindUnitUuid' }"
                      :options="copyUnitList"
                      @change="cascaderHandleChange($event, scope.row)"
                    ></el-cascader>
                  </template>
                </el-table-column>
                <el-table-column label="字节类型" min-width="200">
                  <template slot-scope="scope">
                    <el-select class="normal-select" v-model="scope.row.byteType">
                      <el-option v-for="item in config.byteType" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="参数类型" min-width="200">
                  <template slot-scope="scope">
                    <el-select class="normal-select" v-model="scope.row.paramType">
                      <el-option v-for="item in config.paramType" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="内容配置" width="200" align="center">
                  <template slot-scope="scope">
                    <div class="column">
                      <template v-if="scope.row.paramType == 'CHECK'">
                        <el-select class="normal-select" placeholder="校验方式" v-model="scope.row.verifyType">
                          <el-option v-for="item in config.verifyType" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                      </template>
                      <!-- <template v-else-if="scope.row.paramType == 'SELECT' || scope.row.paramType == 'STATUS' || scope.row.paramType == 'STR'">
                        <template v-if="scope.row.selectConfig && scope.row.selectConfig.length">
                          <div>
                            <p :class="item.isSuccess ? 'success' : ''" v-for="(item, index) in scope.row.selectConfig" :key="index">{{ item.key }}:{{ item.value }}</p>
                          </div>
                          <i class="el-icon-edit" @click="editConfig(scope.row, scope.$index)"></i>
                        </template>
                        <i v-else class="el-icon-circle-plus" @click="editConfig(scope.row, scope.$index, index)"></i>
                      </template> -->
                      <template v-else-if="scope.row.paramType == 'FIXED'">
                        <el-input v-model="scope.row.value" placeholder="单行输入"></el-input>
                      </template>
                      <!-- <template v-if="scope.row.paramType == 'VALUE'">/</template> -->
                      <template v-else>
                        <template v-if="scope.row.selectConfig && scope.row.selectConfig.length">
                          <div>
                            <p :class="item.isSuccess ? 'success' : ''" v-for="(item, index) in scope.row.selectConfig" :key="index">{{ item.key }}:{{ item.value }}</p>
                          </div>
                          <i class="el-icon-edit" @click="editConfig(scope.row, scope.$index)"></i>
                        </template>
                        <i v-else class="el-icon-circle-plus" @click="editConfig(scope.row, scope.$index, index)"></i>
                      </template>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="循环次数" min-width="200" align="center">
                  <template slot-scope="scope">
                    <el-input-number class="mg-left-10" v-model="scope.row.loopCount" :min="1" :max="100" label="循环次数"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="循环配置" align="center" min-width="250">
                  <template slot-scope="scope">
                    <el-checkbox v-if="activeUnitType == 'RESPONSE' || activeUnitType == 'MONITOR'" v-model="scope.row.loopParse" :true-label="1" :false-label="0">循环解</el-checkbox>
                    <el-checkbox v-if="activeUnitType == 'INSTRUCT' || activeUnitType == 'PARAM_SETTING'" v-model="scope.row.loopBuild" :true-label="1" :false-label="0">循环组建</el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column :label="activeUnitType == 'MONITOR' ? '是否显示' : '是否只读'" width="150" align="center">
                  <template slot-scope="scope">
                    <el-radio-group v-model="scope.row.ifSet" v-if="activeUnitType == 'PARAM_SETTING' || activeUnitType == 'INSTRUCT' || activeUnitType == 'RESPONSE'">
                      <el-radio :label="0">只读</el-radio>
                      <el-radio :label="1">读写</el-radio>
                    </el-radio-group>
                    <el-radio-group v-model="scope.row.ifSet" v-else-if="activeUnitType == 'MONITOR'">
                      <el-radio :label="1">显示</el-radio>
                      <el-radio :label="0">不显示</el-radio>
                    </el-radio-group>
                    <span v-else>只读</span>
                  </template>
                </el-table-column>
                <el-table-column label="索引类型" align="center" min-width="200">
                  <template slot-scope="scope">
                    <el-select class="normal-select" v-model="scope.row.indexType">
                      <el-option v-for="item in config.indexType" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="步进" width="100">
                  <template slot-scope="scope"><el-input v-model="scope.row.valueStep"></el-input></template>
                </el-table-column>
                <el-table-column label="单位" width="100">
                  <template slot-scope="scope"><el-input v-model="scope.row.valueUnit"></el-input></template>
                </el-table-column>
                <el-table-column label="取值范围" width="200">
                  <template slot-scope="scope">
                    <div class="column">
                      <el-input v-model="scope.row.valueRange.min" type="number"></el-input>
                      <span>-</span>
                      <el-input v-model="scope.row.valueRange.max" type="number"></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="预值范围" width="200">
                  <template slot-scope="scope">
                    <div class="column">
                      <el-input v-model="scope.row.earlyRange.min" type="number"></el-input>
                      <span>-</span>
                      <el-input v-model="scope.row.earlyRange.max" type="number"></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="是否在拓扑图显示" align="center" width="150">
                  <template slot-scope="scope">
                    <!-- {{ scope.row.showGplot ? '显示' : '不显示' }} -->
                    <el-switch v-model="scope.row.showGplot" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                  </template>
                </el-table-column>
                <el-table-column label="是否是虚拟字段" width="150" align="center">
                  <template slot-scope="scope">
                    <!-- {{ scope.row.showGplot ? '显示' : '不显示' }} -->
                    <el-switch v-model="scope.row.virtualField" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                  </template>
                </el-table-column>
              </el-table>
              <div class="normal-btn save-btn" @click="submitAddUnit(index)">保存</div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <CommonDialog
        :show.sync="showAddUnitDialg"
        dialog-width="400px"
        :dialog-title="isCopy ? '复制单元' : '新增单元'"
        customClass="unit-add"
        :showMainBtn="true"
        mainBtnText="保存"
        :showSubBtn="true"
        subBtnText="取消"
        @mainBtnClick="saveUnit"
        @subBtnClick="cancelAddUnit"
      >
        <template v-slot:body>
          <div class="dialog-content">
            <div class="content">
              <el-form ref="form" :model="form" label-width="100px">
                <div class="content">
                  <el-form-item label="单元名称" prop="unitName"><el-input v-model="form.unitName" placeholder="单行输入"></el-input></el-form-item>
                  <el-form-item label="单元id" prop="unitId"><el-input v-model="form.unitId" placeholder="单行输入"></el-input></el-form-item>
                  <el-form-item label="单元分类" prop="unitType">
                    <el-select clearable v-model="form.unitType" placeholder="请选择" class="normal-select" @change="unitTypeChange">
                      <el-option v-for="item in config.unitType" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="解析信息类别" prop="parseMessageValue" v-if="activeDialogUnitType == 'MONITOR' || activeDialogUnitType == 'RESPONSE'">
                    <el-input v-model="form.parseMessageValue" placeholder="解析信息类别"></el-input>
                  </el-form-item>

                  <el-form-item label="上报信息类别" prop="responseMessageValue" v-if="activeDialogUnitType == 'PARAM_SETTING' || activeDialogUnitType == 'INSTRUCT'">
                    <el-input v-model="form.responseMessageValue" placeholder="上报信息类别"></el-input>
                  </el-form-item>

                  <el-form-item label="响应单元" prop="responseUnitBind" v-if="activeDialogUnitType == 'INSTRUCT' || activeDialogUnitType == 'PARAM_SETTING'">
                    <el-select clearable v-model="form.responseUnitUuid" placeholder="请选择" class="normal-select">
                      <el-option v-for="item in responseList" :key="item.unitUuid" :label="item.unitName" :value="item.unitUuid"></el-option>
                    </el-select>
                  </el-form-item>
                  <!-- <el-form-item label="关联参数设置" prop="protocolInstruct">
                    <el-cascader
                      class="normal-select"
                      v-model="form.paramSettingUnitBind"
                      :options="config[`${unitMap[activeDialogUnitType]}`]"
                      :props="{ expandTrigger: 'hover', value: 'key', label: 'value', emitPath: false }"
                      @change="handleChange"
                    ></el-cascader>
                  </el-form-item> -->
                  <el-form-item :label="name('form')" prop="protocolInstruct">
                    <el-cascader
                      clearable
                      class="normal-select"
                      v-model="form.protocolInstruct"
                      :options="config[`${unitMap[activeDialogUnitType]}`]"
                      :props="{ expandTrigger: 'hover', value: 'key', label: 'value', emitPath: false }"
                      @change="handleChange"
                    ></el-cascader>
                  </el-form-item>
                  <el-form-item label="所属模式" prop="patternUuid">
                    <el-select clearable class="normal-select" placeholder="选择模式" v-model="form.patternUuid">
                      <el-option v-for="item in patternData" :key="item.patternUuid" :label="item.patternName" :value="item.patternUuid"></el-option>
                    </el-select>
                    <!-- <el-input v-model="form.patternUuid" placeholder=" " class="normal-select"></el-input> -->
                  </el-form-item>
                  <el-form-item label="显示单元" prop="unitType">
                    <el-switch v-model="form.showOpen" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                  </el-form-item>
                  <el-form-item label="设置间隔" prop="unitType" v-if="activeDialogUnitType == 'INSTRUCT'">
                    <el-switch v-model="timedSend" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                  </el-form-item>
                  <el-form-item label="时间间隔" prop="unitType" v-if="activeDialogUnitType == 'INSTRUCT' && timedSend">
                    <el-popover v-model="showCron" placement="top">
                      <cron @change="changeCron" @close="showCron = false"></cron>
                      <el-input slot="reference" @click="showCron = true" v-model="form.timedSend" placeholder="请输入定时策略"></el-input>
                    </el-popover>
                  </el-form-item>
                  <!-- <el-popover v-model="showCron" placement="right-start" title="标题" width="500" trigger="click">
                    <cron style="height: 500px"></cron>
                  </el-popover> -->
                </div>
              </el-form>
            </div>
          </div>
        </template>
      </CommonDialog>
      <CommonDialog
        :show.sync="showEditUnitDialg"
        dialog-width="400px"
        dialog-title="编辑单元"
        customClass="unit-edit"
        :showMainBtn="true"
        mainBtnText="保存"
        :showSubBtn="true"
        subBtnText="取消"
        @mainBtnClick="saveEditUnit"
        @subBtnClick="cancelEditUnit"
      >
        <template v-slot:body>
          <div class="dialog-content">
            <div class="content">
              <el-form ref="editForm" :model="editForm" label-width="100px">
                <div class="content">
                  <el-form-item label="单元名称" prop="unitName"><el-input v-model="editForm.unitName" placeholder="单行输入"></el-input></el-form-item>
                  <el-form-item label="单元id" prop="unitId"><el-input v-model="editForm.unitId" placeholder="单行输入"></el-input></el-form-item>
                  <!-- <el-form-item label="信息类别" prop="messageValue"><el-input v-model="editForm.messageValue" placeholder="单行输入"></el-input></el-form-item> -->
                  <el-form-item label="单元分类" prop="unitType">
                    <el-select clearable @change="unitTypeChange" v-model="editForm.unitType" placeholder="请选择" class="normal-select">
                      <el-option v-for="item in config.unitType" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="解析信息类别" prop="parseMessageValue" v-if="activeDialogUnitType == 'MONITOR' || activeDialogUnitType == 'RESPONSE'">
                    <el-input v-model="editForm.parseMessageValue" placeholder="解析信息类别"></el-input>
                  </el-form-item>
                  <el-form-item label="上报信息类别" prop="responseMessageValue" v-if="activeDialogUnitType == 'PARAM_SETTING' || activeDialogUnitType == 'INSTRUCT'">
                    <el-input v-model="editForm.responseMessageValue" placeholder="上报信息类别"></el-input>
                  </el-form-item>
                  <el-form-item label="响应单元" prop="responseUnitUuid" v-if="activeDialogUnitType == 'INSTRUCT' || activeDialogUnitType == 'PARAM_SETTING'">
                    <el-select clearable v-model="editForm.responseUnitUuid" placeholder="请选择" class="normal-select">
                      <el-option v-for="item in responseList" :key="item.unitUuid" :label="item.unitName" :value="item.unitUuid"></el-option>
                    </el-select>
                  </el-form-item>
                  <!-- <el-form-item label="关联参数设置" prop="protocolInstruct">
                    <el-cascader
                      class="normal-select"
                      v-model="editForm.paramSettingUnitBind"
                      :options="config[`${unitMap[activeDialogUnitType]}`]"
                      :props="{ expandTrigger: 'hover', value: 'key', label: 'value', emitPath: false }"
                      @change="handleChange"
                    ></el-cascader>
                  </el-form-item> -->
                  <el-form-item :label="name('editForm')" prop="protocolInstruct">
                    <el-cascader
                      clearable
                      class="normal-select"
                      v-model="editForm.protocolInstruct"
                      :options="config[`${unitMap[activeDialogUnitType]}`]"
                      :props="{ expandTrigger: 'hover', value: 'key', label: 'value', emitPath: false }"
                      @change="handleChange"
                    ></el-cascader>
                  </el-form-item>
                  <el-form-item label="所属模式" prop="patternUuid">
                    <el-select clearable class="normal-select" placeholder="选择模式" v-model="editForm.patternUuid">
                      <el-option v-for="item in patternData" :key="item.patternUuid" :label="item.patternName" :value="item.patternUuid"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="显示单元" prop="unitType">
                    <el-switch v-model="editForm.showOpen" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                  </el-form-item>
                  <el-form-item label="设置间隔" prop="timedSend" v-if="activeDialogUnitType == 'INSTRUCT'">
                    <el-switch v-model="timedSend" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                  </el-form-item>
                  <el-form-item label="时间间隔" prop="timedSend" v-if="activeDialogUnitType == 'INSTRUCT' && timedSend">
                    <!-- <el-input v-model="editForm.timedSend" :min="1" type="number" placeholder="请输入间隔时间" class="normal-select"></el-input> -->
                    <el-popover v-model="showCron" placement="top">
                      <cron @change="changeCronByEdit" @close="showCron = false" :data="editForm.timedSend"></cron>
                      <el-input slot="reference" @click="showCron = true" v-model="editForm.timedSend" placeholder="请输入定时策略"></el-input>
                    </el-popover>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
        </template>
      </CommonDialog>
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
                  <el-radio-group v-model="item.isSuccess" v-if="unitList[collapseName].tableData[editContentIndex].paramType == 'STATUS'">
                    <el-radio :label="true">正常</el-radio>
                    <el-radio :label="false">异常</el-radio>
                  </el-radio-group>
                  <i class="el-icon-circle-plus-outline" @click="addKey(index)"></i>
                  <i class="el-icon-delete" @click="deleteKey(index)"></i>
                </div>
              </div>
            </div>
          </div>
        </template>
      </CommonDialog>
      <!-- <CommonDialog :show.sync="timedSend" dialog-width="60%">
        <template v-slot:body>
          <Vcrontab style="height: 500px" />
        </template>
      </CommonDialog> -->
    </div>
  </div>
</template>

<script>
import { elementOfArray, deepCopy } from '@/utils/utils';
import Sortable from 'sortablejs';
import CommonDialog from '@/components/common/CommonDialog/index.vue';
import { cron } from 'vue-cron';
export default {
  watch: {},
  components: { CommonDialog, cron },
  props: {
    config: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showCron: false,
      unitMap: {
        MONITOR: 'monitorUnitBind', //状态参数
        RESPONSE: 'responseUnitBind', //响应单元
        INSTRUCT: 'instructUnitBind', //指令单元,
        PARAM_SETTING: 'paramSettingUnitBind', //参数设置
      },
      editContentIndex: '',
      editConfigForm: {},
      showEditDialog: false,
      collapseName: null,
      showCollapseTable: false,
      dropConfig: {
        animation: 150,
        chosenClass: 'chosenClass', //设置选中样式类名
      },
      form: {
        unitName: '',
        unitId: '',
        unitType: '',
        parseMessageValue: '',
        responseMessageValue: '',
        responseUnitUuid: '',
        protocolInstruct: '',
        patternUuid: '',
        timedSend: '3/5 * 4/5 * * ? *',
        showOpen: false,
      },
      editForm: {},
      showEditUnitDialg: false,
      showAddUnitDialg: false,
      // ...this.config,
      unitList: [],
      copyUnitList: [],
      patternData: [],
      formInline: {},

      tabs: [
        { title: '监视单元', value: 'MONITOR' },
        { title: '响应单元', value: 'RESPONSE' },
        { title: '指令单元', value: 'INSTRUCT' },
      ],
      activeIndex: 0,
      activeUnitType: 'MONITOR',
      activeDialogUnitType: '',
      searchPatternUuid: '',
      responseList: [],
      timedSend: false,
      value: [2],
      isCopy: false,
    };
  },
  mounted() {
    this.getProtocolPattern(this.$route.query.id);
    this.getProtocolUnitMONITOR();
    this.itemDrop();
  },
  watch: {
    config(val) {
      this.getProtocolUnit(this.$route.query.id, this.config.unitType[0].key);
    },
  },
  computed: {
    name() {
      return (key) => {
        const result = this.config.unitType.filter((item) => item.key == this[key].unitType);
        return result.length > 0 ? '关联' + result[0].value.substring(0, 2) : '关联';
      };
    },
    getBind() {
      return (row) => {};
    },
  },
  methods: {
    changeCronByEdit(e) {
      this.editForm.timedSend = e;
    },
    changeCron(e) {
      // console.log(e);
      this.form.timedSend = e;
    },
    cascaderHandleChange(e, item) {
      item.bindUnitUuid = e[0];
      item.bindBodyId = e[1];
      // console.log(e, item);
    },
    async getProtocolPattern(protocolUuid) {
      const { data } = await this.$api.getProtocolPattern({ protocolUuid });
      this.patternData = data;
      this.searchPatternUuid = data[0]?.patternUuid;
    },
    async addProtocolPattern() {
      const params = {
        ...this.formInline,
        protocolUuid: this.$route.query.id,
      };
      const data = await this.$api.addProtocolPattern(params);
      this.$message.success(data.isSuccess ? '添加成功' : '添加失败');
      this.getProtocolPattern(this.$route.query.id);
    },
    async updateProtocolPattern(item) {
      try {
        const data = await this.$api.updateProtocolPattern(item);
      } catch (err) {
        console.log(err);
      }
    },
    async deleteProtocolPattern(patternUuid) {
      const data = await this.$api.deleteProtocolPattern({ patternUuid });
      this.$message.success(data.isSuccess ? '删除成功' : '删除失败');
      this.getProtocolPattern(this.$route.query.id);
    },
    /**
     * @description: 获取监视单元数据
     * @return {*}
     */
    async getProtocolUnitMONITOR() {
      const { data } = await this.$api.getProtocolUnit({ protocolUuid: this.$route.query.id, unitType: 'MONITOR', patternUuid: this.searchPatternUuid });
      let copyUnitList = deepCopy(data);
      if (copyUnitList && copyUnitList.length > 0) {
        copyUnitList.forEach((item) => {
          item.name = item.unitName;
          item.id = item.unitUuid;
          item.bodyList.forEach((item2) => {
            item2.name = item2.paramName;
            // item2.bind = [item2.bindUnitUuid, item2.bindBodyId];
          });
        });
        this.copyUnitList = copyUnitList;
        console.log(this.copyUnitList);
      }
    },
    async getProtocolUnit(protocolUuid, unitType, response) {
      const { data } = await this.$api.getProtocolUnit({ protocolUuid, unitType, patternUuid: this.searchPatternUuid });
      // console.log(data);
      if (response) return data;
      data.forEach((item, index) => {
        item.id = index + 1;
        item.zoom = false;
        const list = item.bodyList;
        if (item.bodyList === null || item.bodyList.length == 0) {
          item.tableData = [];
          const protocol = {
            id: 1,
            ids: '',
            disabled: false,
            paramName: '',
            byteType: '',
            paramType: 'VALUE',
            indexType: '',
            joinVerify: false,
            valueStep: '',
            valueUnit: '',
            valueRange: {
              max: '',
              min: '',
            },
            earlyRange: {
              max: '',
              min: '',
            },
          };
          item.tableData.push(protocol);
        } else {
          list.forEach((item, index) => {
            item.bind = [item.bindUnitUuid, item.bindBodyId];
            item.ids = item.id;
            item.id = index + 1;
            item.disabled = true;
            if (item.earlyRange == null) {
              item.earlyRange = {
                min: '',
                max: '',
              };
            }
            if (item.valueRange == null) {
              item.valueRange = {
                min: '',
                max: '',
              };
            }
          });
          item.tableData = list;
        }
      });
      this.unitList = data;

      this.$nextTick(() => {
        this.rowDrop();
      });
      // this.tabs = data;
    },
    async addProtocolUnit() {
      const { data } = await this.$api.addProtocolUnit({ ...this.form, protocolUuid: this.$route.query.id });
      if (data) {
        this.$message.success(data.unitUuid ? '操作成功' : '操作失败');
        this.getProtocolUnit(this.$route.query.id, this.config.unitType[this.activeIndex].key);
        // if (this.activeDialogUnitType !== this.activeUnitType) {
        // } else {
        //   this.unitList.push(data);
        // }
        this.form = { showOpen: true };
      }
      // console.log(data);

      // this.getProtocolUnit(this.$route.query.id, this.tabs[this.activeIndex].value);
    },
    async updateProtocolUnit() {
      delete this.editForm.id;
      delete this.editForm.createTime;
      delete this.editForm.updateTime;
      const { data } = await this.$api.updateProtocolUnit({ ...this.editForm, protocolUuid: this.$route.query.id });
      this.$message.success(data.unitUuid ? '操作成功' : '操作失败');
      if (data) {
        this.getProtocolUnit(this.$route.query.id, this.config.unitType[this.activeIndex].key);
      }
      // console.log(data);
    },

    async searchProtocol(unitUuid) {
      const { data } = await this.$api.searchProtocol({ unitUuid });
      return data;
    },
    /**
     * @description:添加单元帧格式列表
     * @param {*} list
     * @return {*}
     */
    async addProtocolUnitList(unitUuid, list) {
      list.forEach((item) => {
        item.valueRange.min = Number(item.valueRange.min);
        item.valueRange.max = Number(item.valueRange.max);
        item.id = item.ids ? item.ids : '';
      });
      console.log(list);
      const data = await this.$api.addProtocolUnitList({ unitUuid, data: list });
      this.$message.success(data.isSuccess ? '操作成功' : '操作失败');
      console.log(data);
    },
    async deleteProtocolUnit(unitUuid) {
      const data = await this.$api.deleteProtocolUnit({ unitUuid });
      this.$message.success(data.isSuccess ? '删除成功' : '删除失败');
      // console.log(this.activeIndex, this.tabs);
      this.getProtocolUnit(this.$route.query.id, this.config.unitType[this.activeIndex].key);
    },
    submitAddUnit(index) {
      console.log(this.unitList[index]);
      this.addProtocolUnitList(this.unitList[index].unitUuid, this.unitList[index].tableData);
    },
    addUnitItem(index, $index) {
      // console.log(this.unitList[index].tableData[$index]);
      const data = {
        id: index + 1,
        disabled: false,
        paramName: '',
        byteType: '',
        paramType: 'VALUE',
        indexType: '',
        joinVerify: false,
        valueStep: '',
        valueUnit: '',
        valueRange: {
          max: '',
          min: '',
        },
        earlyRange: {
          max: '',
          min: '',
        },
      };
      console.log(data);
      this.unitList[index].tableData.splice($index + 1, 0, data);
      this.unitList[index].tableData.forEach((item, index2) => {
        index2 > $index ? item.id++ : '';
      });

      console.log(this.unitList[index]);
    },
    changeCollapse(e) {
      this.showCollapseTable = e === '' ? false : true;
      this.$forceUpdate();
      // console.log(e, this.showCollapseTable);
    },
    changePattern() {
      this.getProtocolUnit(this.$route.query.id, this.config.unitType[this.activeIndex].key);
    },
    onSubmit() {
      this.addProtocolPattern();
    },
    handleChange(e) {},
    deleteTableData(index) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          console.log(index, this.unitList[this.collapseName].tableData[index]);
          this.unitList[this.collapseName].tableData.splice(index, 1);
        })
        .catch(() => {});
    },
    unitTypeChange(val) {
      this.activeDialogUnitType = val;
    },

    deleteUnit(item) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deleteProtocolUnit(item.unitUuid);
        })
        .catch(() => {});
    },
    addKey(index) {
      console.log(this.editConfigForm, index);
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
      let configList = this.editConfigForm.filter((config) => config.key != '' && config.value != '');
      console.log(this.editConfigForm);
      if (configList.length) {
        this.$set(this.unitList[this.collapseName].tableData[this.editContentIndex], 'selectConfig', this.editConfigForm);
      } else {
        this.$set(this.unitList[this.collapseName].tableData[this.editContentIndex], 'selectConfig', []);
      }
    },
    editConfig(item, index) {
      if (!item.selectConfig || !item.selectConfig.length) {
        this.editConfigForm = [{ key: '', value: '' }];
      } else {
        this.editConfigForm = JSON.parse(JSON.stringify(item.selectConfig));
      }
      this.editContentIndex = index;
      this.showEditDialog = true;
    },
    saveUnit() {
      if (!this.timedSend) this.form.timedSend = '';
      this.addProtocolUnit();
    },
    cancelAddUnit() {
      this.$refs.form.resetFields();
      this.isCopy = false;
      // this.form = {};
    },
    saveEditUnit() {
      if (!this.timedSend) this.editForm.timedSend = '';
      this.updateProtocolUnit();
    },
    cancelEditUnit() {
      this.$refs.editForm.resetFields();
    },
    async copyUnitItem(item) {
      this.form = JSON.parse(JSON.stringify(item));
      this.activeDialogUnitType = this.activeUnitType;
      this.form.copyUnitUuid = item.unitUuid;
      if (this.activeDialogUnitType == 'INSTRUCT' || this.activeDialogUnitType == 'PARAM_SETTING') {
        const data = await this.getProtocolUnit(this.$route.query.id, this.tabs[1].value, true);
        // console.log(data);
        this.responseList = data;
      }
      this.form.unitType = this.config.unitType[this.activeIndex].key;
      this.showAddUnitDialg = true;
      this.isCopy = true;
    },
    async editUnit(item) {
      this.editForm = item;
      this.activeDialogUnitType = this.activeUnitType;
      if (this.activeDialogUnitType == 'INSTRUCT' || this.activeDialogUnitType == 'PARAM_SETTING') {
        const data = await this.getProtocolUnit(this.$route.query.id, this.tabs[1].value, true);
        // console.log(data);
        this.responseList = data;
      }
      this.editForm.unitType = this.config.unitType[this.activeIndex].key;
      this.timedSend = item.timedSend !== '0' ? true : false;
      this.showEditUnitDialg = true;
    },
    async addUnit() {
      this.isCopy = false;
      this.activeDialogUnitType = this.activeUnitType;
      if (this.activeDialogUnitType == 'INSTRUCT' || this.activeDialogUnitType == 'PARAM_SETTING') {
        const data = await this.getProtocolUnit(this.$route.query.id, this.tabs[1].value, true);
        // console.log(data);
        this.responseList = data;
      }
      this.form.showOpen = true;
      this.form.unitType = this.config.unitType[this.activeIndex].key;
      this.showAddUnitDialg = true;
    },
    async protocolSort(ids) {
      const data = await this.$api.protocolSort(ids);
      if (data.isSuccess) {
        this.$message.success('操作成功');
        this.getProtocolUnit(this.$route.query.id, 'MONITOR');
      }
      console.log(data);
    },
    tabClick(item, index) {
      this.unitList = [];
      this.activeIndex = index;
      this.activeUnitType = item.key;
      this.getProtocolUnit(this.$route.query.id, item.key);
    },
    foldHandler(index) {
      let list = Array.from(document.getElementsByClassName('unit-item')[index].classList);
      if (list.includes('simple')) {
        document.getElementsByClassName('unit-item')[index].className = `unit-item`;
      } else {
        document.getElementsByClassName('unit-item')[index].className = `unit-item simple`;
      }
    },

    deletePattern(item) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          console.log(item);
          this.deleteProtocolPattern(item.patternUuid);
          //to do :调删除接口
        })
        .catch(() => {});
    },
    rowDrop() {
      const tbody = document.querySelectorAll('.unit-list .unit-item-content .el-table__body-wrapper tbody');
      tbody.forEach((item, index) => {
        const _this = this;
        Sortable.create(item, {
          handle: '.unit-item-content .el-table__row i.el-icon-rank',
          draggable: '.unit-item-content .el-table__row',
          ...this.dropConfig,
          onEnd({ newIndex, oldIndex }) {
            const currRow = _this.unitList[index].tableData.splice(oldIndex, 1)[0];
            _this.unitList[index].tableData.splice(newIndex, 0, currRow);
          },
        });
      });
    },
    itemDrop() {
      const list = document.querySelector('.el-collapse');
      const _this = this;
      Sortable.create(list, {
        handle: '.unit-list .unit-item-header  i.el-icon-rank',
        draggable: '.unit-list .unit-item.el-collapse-item',
        ...this.dropConfig,
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.unitList.splice(oldIndex, 1)[0];
          _this.unitList.splice(newIndex, 0, currRow);

          const ids = _this.unitList.map((item) => {
            return item.unitUuid;
          });
          _this.protocolSort(ids);
          console.log(ids);
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.full {
  position: fixed;
  top: 0;
  left: 0;
  margin: auto;
  right: 0;
  height: 100%;
  overflow: scroll;
  z-index: 2;
  transition: 0.5s all;
}
.el-input-number {
  line-height: 26px;
}
.success {
  color: var(--yx-success-1);
}
.el-table th,
.el-table tr {
  background: #fff !important;
}
.el-table th,
.el-table tr {
  background: #fff !important;
}

.normal-table .el-table__header {
  width: 2000px !important;
}
.el-dialog.common-dialog.unit-add,
.el-dialog.common-dialog.unit-edit {
  .file-upload {
    display: flex;
    align-items: center;
  }
  .dialog-content {
    padding: 12px 24px;
    .content {
      margin: 0 auto;
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
          .el-input__icon {
            line-height: 28px;
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
.protocol-pattern {
  :deep() .operate-btn-wrap {
    .operate-btn {
      cursor: pointer;
      margin-right: 14px;
      color: var(--yx-font-2);
      font-size: 16px;
      font-weight: 500;
      &.el-icon-delete-solid {
        color: var(--yx-danger-3);
      }
    }
  }
  .add-form {
    margin-bottom: 20px;
  }
  .format-table {
    i {
      cursor: pointer;
      font-size: 18px;
      font-weight: 500;
    }
    .column {
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        margin: 0 4px;
      }
      i {
        margin-left: 12px;
      }
    }
  }
  .unit {
    padding: 24px;
    .unit-header {
      padding: 24px 70px 12px 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      border-bottom: #c7cfd4 1px solid;
      > .normal-btn {
        width: 190px;
      }
      .tabs {
        .tab-item {
          margin-right: 12px;
        }
      }
    }
    .normal-select {
      margin: 12px 0;
    }
    .unit-list {
      border: 1px solid #e8ecef;
      background: var(--yx-container-translucent);
      .el-collapse {
        border: none;
      }
      .unit-item {
        margin-bottom: 12px;
        height: auto;
        overflow: hidden;
        background: var(--yx-container-translucent);
        border: 1px solid #e8ecef;
        border-radius: 4px;
        &.chosenClass {
          border: var(--yx-btn-active) 2px solid;
        }
        &.simple {
          height: 42px;
        }
        :deep().el-collapse-item__header {
          background: var(--yx-content-header);
          border: none;
          .el-collapse-item__arrow {
            margin-right: 24px;
          }
        }

        .unit-item-header {
          padding-left: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 42px;
          border-radius: 4px 4px 0px 0px;
        }
        .unit-item-content {
          :deep().el-table tr {
            background: #e8ecef;
          }
          :deep().normal-table .el-table__row {
            background: #fff !important;
            &.chosenClass {
              background: #e1e7f1;
            }
            .el-radio-group {
              .el-radio {
                margin-right: 12px;
              }
            }
          }
          .save-btn {
            margin-top: 20px;
          }
        }
      }
    }
  }
}
</style>
