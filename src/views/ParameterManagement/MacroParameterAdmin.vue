<!--
 * @Author: WangXin
 * @Date: 2022-10-21 11:03:48
 * @LastEditors: heliling
 * @LastEditTime: 2023-03-02 10:51:31
 * @FilePath: \code\src\views\ParameterManagement\MacroParameterAdmin.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by YuXing, All Rights Reserved. 
-->

<template>
  <div class="macro-parameter-admin">
    <div class="wrap">
      <div class="data">
        <div class="main">
          <div class="list-info pd-bottom-20">
            <h2 class="default-title">任务宏参数</h2>
            <div class="search">
              <el-form :inline="true" :model="formInline" class="macro-parameter-admin-form">
                <el-form-item>
                  <el-input v-model="formInline.macroName" placeholder="请输入任务宏名称" clearable></el-input>
                </el-form-item>

                <el-form-item>
                  <el-select filterable v-model="formInline.stationId" placeholder="请选择站点" class="normal-select" clearable>
                    <el-option v-for="item in stationList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select filterable v-model="formInline.satelliteNo" placeholder="请选择卫星" class="normal-select" clearable>
                    <el-option v-for="item in satellite" :key="item.satelliteId" :label="item.satelliteName" :value="item.satelliteId"></el-option>
                  </el-select>
                </el-form-item>
                <el-date-picker
                  v-model="value1"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="changeDate"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" class="normal-btn" @click="onSubmit">查询</el-button>
                </el-form-item>
                <div class="normal-btn view-btn" type="primary" @click="toAdd">
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
                <el-table-column label="宏名称" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.macroName || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="站点名称" align="center">
                  <template slot-scope="scope">
                    <span>{{ getStation(scope.row.stationId) || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="卫星编号" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.satelliteNo || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="卫星名称" align="center">
                  <template slot-scope="scope">
                    <span>{{ getSatelliteName(scope.row.satelliteNo) || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="码速率" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.bbeCodeRate || scope.row.ddtCodeRate || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="类型" align="center">
                  <template slot-scope="scope">
                    <span>{{ getTaskType(scope.row.taskType) || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="创建人" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.createUser || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.createTime || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="150px">
                  <template slot-scope="scope">
                    <div class="operate-btn-wrap">
                      <span class="table-operate-btn" @click="toCheck(scope.row)">查看</span>
                      <el-tooltip content="Bottom center" placement="bottom" effect="light">
                        <span class="table-operate-btn">更多</span>
                        <template slot="content">
                          <span class="table-operate-btn" @click="toEdit(scope.row)">修改</span>
                          <span class="table-operate-btn delete" @click="toDelete(scope.row)">删除</span>
                          <span class="table-operate-btn" @click="toCopy(scope.row)">复制</span>
                        </template>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table-footer clearfix">
                <el-pagination background layout="prev, pager, next" @current-change="pageHandleChange" :current-page="page" :page-size="size" :total="total"></el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CommonDialog :show.sync="showCheckDialog" dialog-width="960px" dialog-title="任务宏详情" customClass="macro-detail">
      <template v-slot:body>
        <div class="dialog-content">
          <el-form ref="checkContent" :model="checkContent">
            <el-collapse class="group" v-model="collapseList">
              <el-collapse-item class="group-item" name="1">
                <template slot="title">
                  <div class="font-medium">卫星信息</div>
                </template>
                <div class="content">
                  <el-form-item label="宏名称" class="content-item content-form-item read-only">
                    <el-input v-model="checkContent.macroName" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="站点名称" class="content-item content-form-item read-only">
                    <el-select disabled v-model="checkContent.stationId" class="normal-select">
                      <el-option v-for="item in stationList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="目标卫星" class="content-item content-form-item read-only">
                    <el-select disabled v-model="checkContent.satelliteNo" class="normal-select">
                      <el-option v-for="item in satellite" :key="item.satelliteId" :label="item.satelliteName" :value="item.satelliteId"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="类型" class="content-item content-form-item read-only">
                    <el-select disabled v-model="checkContent.taskType" class="normal-select">
                      <el-option v-for="item in taskTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="跟踪极化" class="content-item content-form-item read-only">
                    <el-select disabled v-model="checkContent.polarization" class="normal-select">
                      <el-option v-for="item in polarizationList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="基带模式" v-if="['X01', 'X02', 'X08'].includes(checkContent.taskType)" class="content-item content-form-item read-only">
                    <el-select disabled v-model="checkContent.patternType" class="normal-select">
                      <el-option v-for="item in patternTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="卫星频段" v-if="checkContent.taskType == 'X03'" class="content-item content-form-item read-only">
                    <el-select disabled v-model="checkContent.satelliteBand" class="normal-select">
                      <el-option v-for="item in satelliteBandList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="任务宏信息" class="content-item content-form-item read-only">
                    <el-input v-model="checkContent.macroRemark" readonly></el-input>
                  </el-form-item>

                  <el-form-item v-if="checkAutoTracking" label="是否启用自跟踪" class="content-item content-form-item read-only">
                    <el-radio-group v-model="checkContent.autoTrackingFlag">
                      <el-radio disabled :label="1">是</el-radio>
                      <el-radio disabled :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-collapse-item>
              <el-collapse-item class="group-item" name="2" v-if="checkContent.taskType != 'X03'">
                <template slot="title">
                  <div class="font-medium">测控基带</div>
                </template>
                <div class="content measure-control">
                  <el-form-item label="宏文件" class="content-item content-form-item read-only">
                    <el-select disabled v-model="checkContent.bbeMacroFileName" :title="checkContent.bbeMacroFileName" class="normal-select" @change="changeMacroName($event, checkContent)">
                      <el-option v-for="(item, index) in macroRxDTOList" :key="`bbefile-${index}`" :label="item.bbeFileName" :value="item.bbeFileName"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="卫星频段" class="content-item content-form-item read-only">
                    <el-select disabled v-model="checkContent.satelliteBand" class="normal-select">
                      <el-option v-for="item in satelliteBandList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="码速率" class="content-item content-form-item read-only">
                    <el-input v-model="checkContent.bbeCodeRate" readonly></el-input>
                  </el-form-item>
                </div>
              </el-collapse-item>
              <el-collapse-item class="group-item" name="3" v-if="checkContent.taskType == 'X03' || checkContent.taskType == 'X04'">
                <template slot="title">
                  <div class="font-medium">数传基带</div>
                </template>
                <div class="content data-transmission">
                  <div class="data-transmission-item" v-for="(item, index) in checkContent.ddtMacroInfoList" :key="`ddtmacro-${index}`">
                    <div class="form-wrap">
                      <el-form-item label="数传通道" class="content-item content-form-item read-only">
                        <el-input v-model="item.channel" readonly></el-input>
                      </el-form-item>
                      <el-form-item label="卫星频段" class="content-item content-form-item read-only">
                        <el-select disabled v-model="item.satelliteBand" class="normal-select">
                          <el-option v-for="item in satelliteBandList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>

                      <el-form-item label="宏文件" class="content-item content-form-item read-only">
                        <el-select disabled v-model="item.ddtMacroName" class="normal-select" @change="changeItemddtMacroName(index, $event, checkContent)">
                          <el-option v-for="(item, index) in macroDdtFileDTO" :key="`ddtfile-${index}`" :label="item.ddtFileName" :value="item.ddtFileName"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="码速率" class="content-item content-form-item read-only">
                        <el-input v-model="item.ddtCodeRate" readonly></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item class="group-item" name="4">
                <template slot="title">
                  <div class="font-medium">宏单元</div>
                </template>
                <div class="content">
                  <CascaderForm :options="options" @formData="getForm" :formData="checkContent.deviceInfos" :readOnly="true" />
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-form>
        </div>
      </template>
    </CommonDialog>
    <CommonDialog :show.sync="showEditDialog" dialog-width="960px" dialog-title="任务宏修改" customClass="macro-edit" :has-footer="true">
      <template v-slot:body>
        <div class="dialog-content">
          <el-form ref="editContent" :model="editContent" :rules="rules">
            <el-collapse class="group" v-model="collapseList">
              <el-collapse-item class="group-item" name="1">
                <template slot="title">
                  <div class="font-medium">卫星信息</div>
                </template>
                <div class="content">
                  <el-form-item label="宏名称" class="content-item content-form-item" prop="macroName">
                    <el-input v-model="editContent.macroName"></el-input>
                    <p class="input-warning" v-if="editContent.macroName && editContent.stationId && editWarning">宏名称不可用</p>
                  </el-form-item>
                  <el-form-item label="站点名称" class="content-item content-form-item" prop="stationId">
                    <el-select filterable v-model="editContent.stationId" class="normal-select">
                      <el-option v-for="item in stationList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="目标卫星" class="content-item content-form-item" prop="satelliteNo">
                    <el-select filterable v-model="editContent.satelliteNo" class="normal-select">
                      <el-option v-for="item in satellite" :key="item.satelliteId" :label="item.satelliteName" :value="item.satelliteId"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="类型" class="content-item content-form-item" prop="taskType">
                    <el-select filterable v-model="editContent.taskType" class="normal-select">
                      <el-option v-for="item in taskTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="跟踪极化" class="content-item content-form-item" prop="polarization">
                    <el-select filterable v-model="editContent.polarization" class="normal-select">
                      <el-option v-for="item in polarizationList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="基带模式" v-if="['X01', 'X02', 'X08'].includes(editContent.taskType)" class="content-item content-form-item">
                    <el-select filterable v-model="editContent.patternType" class="normal-select" :disabled="patternTypeDisabledEdit">
                      <el-option v-for="item in patternTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="卫星频段" v-if="editContent.taskType == 'X03'" class="content-item content-form-item" prop="satelliteBand">
                    <el-select filterable v-model="editContent.satelliteBand" class="normal-select">
                      <el-option v-for="item in satelliteBandList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="任务宏信息" class="content-item content-form-item" prop="macroRemark">
                    <el-input v-model="editContent.macroRemark"></el-input>
                  </el-form-item>
                  <el-form-item v-if="editAutoTracking" label="是否启用自跟踪" class="content-item content-form-item" prop="autoTrackingFlag">
                    <el-radio-group v-model="editContent.autoTrackingFlag">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-collapse-item>
              <el-collapse-item class="group-item" name="2" v-if="editContent.taskType != 'X03'">
                <template slot="title">
                  <div class="font-medium">测控基带</div>
                </template>
                <div class="content measure-control">
                  <el-form-item label="宏文件" class="content-item content-form-item">
                    <el-select filterable v-model="editContent.bbeMacroFileName" :title="editContent.bbeMacroFileName" class="normal-select" @change="changeMacroName($event, editContent)">
                      <el-option v-for="(item, index) in macroRxDTOList" :key="`bbefile-${index}`" :label="item.bbeFileName" :value="item.bbeFileName"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="卫星频段" class="content-item content-form-item" prop="satelliteBand">
                    <el-select filterable v-model="editContent.satelliteBand" class="normal-select">
                      <el-option v-for="item in satelliteBandList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="码速率" class="content-item content-form-item">
                    <el-input v-model="editContent.bbeCodeRate" readonly></el-input>
                  </el-form-item>
                </div>
              </el-collapse-item>
              <el-collapse-item class="group-item" name="3" v-if="editContent.taskType == 'X03' || editContent.taskType == 'X04'">
                <template slot="title">
                  <div class="font-medium">数传基带</div>
                </template>
                <div class="content data-transmission">
                  <div class="data-transmission-item" v-for="(item, index) in editContent.ddtMacroInfoList" :key="index">
                    <div v-if="index == 1" class="delete-header"><i class="delete el-icon-delete" @click="deleteChild(index, editContent)"></i></div>
                    <div class="form-wrap">
                      <el-form-item label="数传通道" class="content-item content-form-item">
                        <!-- <el-input v-model="item.channel" readonly></el-input> -->

                        <el-select filterable v-model="item.channel" class="normal-select">
                          <el-option v-for="item in channelList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="卫星频段" class="content-item content-form-item">
                        <el-select filterable v-model="item.satelliteBand" class="normal-select">
                          <el-option v-for="item in satelliteBandList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="宏文件" class="content-item content-form-item">
                        <el-select filterable v-model="item.ddtMacroName" class="normal-select" @change="changeItemddtMacroName(index, $event, editContent)">
                          <el-option v-for="(item, index) in macroDdtFileDTO" :key="`ddtfile-${index}`" :label="item.ddtFileName" :value="item.ddtFileName"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="码速率" class="content-item content-form-item">
                        <el-input v-model="item.ddtCodeRate" readonly></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="add-macro" v-if="editContent.ddtMacroInfoList.length < 2" @click="addDdtMacroInfoList(editContent)">
                    <i class="el-icon-plus"></i>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item class="group-item" name="4">
                <template slot="title">
                  <div class="font-medium">宏单元</div>
                </template>
                <div class="content">
                  <CascaderForm :options="options" @formData="getForm" :formData="editContent.deviceInfos" />
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-form>
        </div>
      </template>
      <template v-slot:footer>
        <button class="button-default outline" @click="cancelEditSubmit">取消</button>
        <button class="button-default" @click="submitEditForm" :disabled="editDisabled">确认</button>
      </template>
    </CommonDialog>
    <CommonDialog :show.sync="showAddDialog" dialog-width="960px" dialog-title="任务宏新增" customClass="macro-edit" :hasFooter="true">
      <template v-slot:body>
        <div class="dialog-content">
          <el-form ref="form" :model="form" :rules="rules">
            <el-collapse class="group" v-model="collapseList">
              <el-collapse-item class="group-item" name="1">
                <template slot="title">
                  <div class="font-medium">卫星信息</div>
                </template>
                <div class="content">
                  <el-form-item label="宏名称" class="content-item content-form-item" prop="macroName">
                    <el-input v-model="form.macroName"></el-input>
                    <p class="input-warning" v-if="form.macroName && form.stationId && addWarning">宏名称不可用</p>
                  </el-form-item>
                  <el-form-item label="站点名称" class="content-item content-form-item" prop="stationId">
                    <el-select filterable :disabled="isCopy" v-model="form.stationId" class="normal-select">
                      <el-option v-for="item in stationList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="目标卫星" class="content-item content-form-item" prop="satelliteNo">
                    <el-select filterable v-model="form.satelliteNo" class="normal-select">
                      <el-option v-for="item in satellite" :key="item.satelliteId" :label="item.satelliteName" :value="item.satelliteId"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="类型" class="content-item content-form-item" prop="taskType">
                    <el-select filterable v-model="form.taskType" class="normal-select">
                      <el-option v-for="item in taskTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="跟踪极化" class="content-item content-form-item" prop="polarization">
                    <el-select filterable v-model="form.polarization" class="normal-select">
                      <el-option v-for="item in polarizationList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="基带模式" v-if="['X01', 'X02', 'X08'].includes(form.taskType)" class="content-item content-form-item">
                    <el-select filterable v-model="form.patternType" class="normal-select" :disabled="patternTypeDisabled">
                      <el-option v-for="item in patternTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="卫星频段" v-if="form.taskType == 'X03'" class="content-item content-form-item" prop="satelliteBand">
                    <el-select filterable v-model="form.satelliteBand" class="normal-select">
                      <el-option v-for="item in satelliteBandList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="任务宏信息" class="content-item content-form-item" prop="macroRemark">
                    <el-input v-model="form.macroRemark"></el-input>
                  </el-form-item>
                  <el-form-item v-if="addAutoTracking" label="是否启用自跟踪" class="content-item content-form-item" prop="autoTrackingFlag">
                    <el-radio-group v-model="form.autoTrackingFlag">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-collapse-item>

              <el-collapse-item class="group-item" name="2" v-if="form.taskType != 'X03'">
                <template slot="title">
                  <div class="font-medium">测控基带</div>
                </template>
                <div class="content measure-control">
                  <el-form-item label="宏文件" class="content-item content-form-item">
                    <el-select filterable v-model="form.bbeMacroFileName" :title="form.bbeMacroFileName" class="normal-select" @change="changeMacroName($event, form)">
                      <el-option v-for="(item, index) in macroRxDTOList" :key="`bbefile-${index}`" :label="item.bbeFileName" :value="item.bbeFileName"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="卫星频段" class="content-item content-form-item" prop="satelliteBand">
                    <el-select filterable v-model="form.satelliteBand" class="normal-select">
                      <el-option v-for="item in satelliteBandList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="码速率" class="content-item content-form-item">
                    <el-input v-model="form.bbeCodeRate" readonly></el-input>
                  </el-form-item>
                </div>
              </el-collapse-item>
              <el-collapse-item class="group-item" name="3" v-if="form.taskType == 'X03' || form.taskType == 'X04'">
                <template slot="title">
                  <div class="font-medium">数传基带</div>
                </template>
                <div class="content data-transmission">
                  <div class="data-transmission-item" v-for="(item, index) in form.ddtMacroInfoList" :key="index">
                    <div v-if="index == 1" class="delete-header"><i class="delete el-icon-delete" @click="deleteChild(index, form)"></i></div>
                    <div class="form-wrap">
                      <el-form-item label="数传通道" class="content-item content-form-item">
                        <!-- <el-input v-model="item.channel" readonly></el-input> -->
                        <el-select filterable v-model="item.channel" class="normal-select">
                          <el-option v-for="item in channelList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="卫星频段" class="content-item content-form-item">
                        <el-select filterable v-model="item.satelliteBand" class="normal-select">
                          <el-option v-for="item in satelliteBandList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>

                      <el-form-item label="宏文件" class="content-item content-form-item">
                        <el-select filterable v-model="item.ddtMacroName" class="normal-select" @change="changeItemddtMacroName(index, $event, form)">
                          <el-option v-for="(item, index) in macroDdtFileDTO" :key="`ddtfile-${index}`" :label="item.ddtFileName" :value="item.ddtFileName"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="码速率" class="content-item content-form-item">
                        <el-input v-model="item.ddtCodeRate" readonly></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div v-if="form.ddtMacroInfoList.length < 2" class="add-macro" @click="addDdtMacroInfoList(form)">
                    <i class="el-icon-plus"></i>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item class="group-item" name="4">
                <template slot="title">
                  <div class="font-medium">宏单元</div>
                </template>
                <div class="content"><CascaderForm :options="options" @formData="getForm" :formData="form.deviceInfos || []" /></div>
              </el-collapse-item>
            </el-collapse>
          </el-form>
        </div>
      </template>
      <template v-slot:footer>
        <button class="button-default outline" @click="cancelSubmit">取消</button>
        <button class="button-default" @click="submitForm" :disabled="saveDisabled">确认</button>
      </template>
    </CommonDialog>
  </div>
</template>
<script>
import { elementOfArray } from '@/utils/utils';
import CascaderForm from '@/components/ParameterManagement/CascaderForm/index.vue';
import CommonDialog from '@/components/common/CommonDialog/index.vue';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      isCopy: false,
      editWarning: false,
      addWarning: false,
      editId: '',
      addAutoTracking: false,
      checkAutoTracking: false,
      editAutoTracking: false,
      rules: {
        macroName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        satelliteNo: [{ required: true, message: '不能为空', trigger: 'blur' }],
        macroRemark: [{ required: true, message: '不能为空', trigger: 'blur' }],
        stationId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        taskType: [{ required: true, message: '不能为空', trigger: 'blur' }],
        polarization: [{ required: true, message: '不能为空', trigger: 'blur' }],
        satelliteBand: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
      collapseList: ['1', '2', '3', '4'],
      stationList: [],
      CascaderData: [],
      deviceUnitList: [],
      editContent: {},
      checkContent: {},
      macroRxDTOList: [],
      macroDdtFileDTO: [],
      patternTypeDisabled: false,
      patternTypeDisabledEdit: false,
      polarizationList: [
        { label: '左旋', value: 1 },
        { label: '右旋', value: 2 },
      ],
      taskTypeList: [
        { label: '测控', value: 'X01' },
        { label: '遥测', value: 'X02' },
        { label: '高速数传', value: 'X03' },
        { label: '测控数传', value: 'X04' },
        { label: '低速数传', value: 'X08' },
      ],
      patternTypeList: [
        { label: '标准模式', value: 1 },
        { label: '扩频二模式', value: 3 },
        { label: 'FM模式', value: 4 },
        { label: '双向数传', value: 5 },
      ],
      ddtMacroInfoFileList: [],
      fileList: [],
      channelList: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
      ],
      satelliteBandList: [
        { label: 'X', value: 10 },
        { label: 'S', value: 0 },
      ],
      satellite: [],
      formData: [],
      options: [],
      form: { ddtMacroInfoList: [{ channel: '1', satelliteBand: '', ddtMacroName: '' }] },
      showAddDialog: false,
      showEditDialog: false,
      showCheckDialog: false,
      page: 1,
      size: 12,
      total: 0,
      value1: [],
      tableData: [],
      value1: [],
      formInline: {
        macroName: '',
        satelliteNo: '',
        stationId: '',
      },
    };
  },
  computed: {
    ...mapState(['userStationList']),
  },
  components: { CommonDialog, CascaderForm },
  created() {
    this.getStations();
    this.getSatellite();
    this.getData();
  },
  watch: {
    'form.taskType': {
      handler: function (val) {
        if (!['X01', 'X02', 'X08'].includes(val)) {
          this.form.patternType = '';
        } else if (val == 'X03') {
          this.form.bbeCodeRate = '';
          this.form.satelliteBand = '';
          this.form.bbeMacroFileName = '';
        }
        if (val == 'X08') {
          this.form.patternType = 4;
          this.patternTypeDisabled = true;
        } else {
          this.patternTypeDisabled = false;
        }
        this.getFile(this.form);
      },
    },
    'form.patternType': {
      handler: function (val) {
        this.getFile(this.form);
      },
    },
    'form.satelliteNo': {
      handler: function (val) {
        this.getFile(this.form);
      },
    },
    'form.macroName': {
      handler: function (val) {
        if (val) {
          if (this.form.stationId && val) {
            this.validateMacroName(this.form.stationId, val, false);
          }
        }
      },
    },
    'form.stationId': {
      handler: function (val) {
        if (val) {
          if (val && this.form.macroName) {
            this.validateMacroName(val, this.form.macroName, false);
          }
          this.getDeviceUnitList(val);
          this.stationList.forEach((item) => {
            if (item.value == val && item.autoTracking) {
              this.addAutoTracking = item.autoTracking;
            }
          });
        }
      },
    },
    'editContent.taskType': {
      handler: function (val) {
        if (!['X01', 'X02', 'X08'].includes(val)) {
          this.editContent.patternType = '';
        } else if (val == 'X03') {
          this.editContent.bbeCodeRate = '';
          this.editContent.satelliteBand = '';
          this.editContent.bbeMacroFileName = '';
        }
        if (val == 'X08') {
          this.editContent.patternType = 4;
          this.patternTypeDisabledEdit = true;
        } else {
          this.patternTypeDisabledEdit = false;
        }
        this.getFile(this.editContent);
      },
    },
    'editContent.patternType': {
      handler: function (val) {
        this.getFile(this.editContent);
      },
    },
    'editContent.satelliteNo': {
      handler: function (val) {
        this.getFile(this.editContent);
      },
    },
    'editContent.macroName': {
      handler: function (val) {
        if (val) {
          if (val && this.editContent.stationId) {
            this.validateMacroName(this.editContent.stationId, val, true);
          }
        }
      },
    },
    'editContent.stationId': {
      handler: function (val) {
        if (val) {
          if (val && this.editContent.macroName) {
            this.validateMacroName(val, this.editContent.macroName, true);
          }
          this.stationList.forEach((item) => {
            if (item.value == val) {
              this.editAutoTracking = item.autoTracking;
            }
          });
          this.getDeviceUnitList(val);
        }
      },
    },
    'checkContent.stationId': {
      handler: function (val) {
        if (val) {
          this.getDeviceUnitList(val);
        }
      },
    },
    'checkContent.stationId': {
      handler: function (val) {
        if (val) {
          this.stationList.forEach((item) => {
            if (item.value == val) {
              this.checkAutoTracking = item.autoTracking;
            }
          });
          this.getDeviceUnitList(val);
        }
      },
    },
    showAddDialog(val) {
      this.addWarning = false;
      this.formData = [];
      if (!val) {
        this.form = {};
        this.options = [];
      }
    },
    showEditDialog(val) {
      this.editWarning = false;
      this.formData = [];
      if (!val) {
        this.editContent = {};
        this.editId = '';
        this.options = [];
      }
    },
    showCheckDialog(val) {
      if (!val) {
        this.checkContent = {};
        this.options = [];
      }
    },
    macroRxDTOList(val) {
      if (!val.length) {
        this.editContent.bbeMacroFileName = '';
        this.editContent.bbeCodeRate = '';
        this.form.bbeMacroFileName = '';
        this.form.bbeCodeRate = '';
      }
    },
    macroDdtFileDTO(val) {
      if (!val.length) {
        if (this.form.ddtMacroInfoList && this.form.ddtMacroInfoList.length) {
          this.form.ddtMacroInfoList.forEach((item) => {
            item.ddtFileName = '';
            item.ddtCodeRate = '';
          });
        }
        if (this.editContent.ddtMacroInfoList && this.editContent.ddtMacroInfoList.length) {
          this.editContent.ddtMacroInfoList.forEach((item) => {
            item.ddtFileName = '';
            item.ddtCodeRate = '';
          });
        }
      }
    },
    'editContent.ddtMacroInfoList': {
      handler: function (val) {
        this.changeChannelList(val);
      },
      deep: true,
    },
    'form.ddtMacroInfoList': {
      handler: function (val) {
        this.changeChannelList(val);
      },
      deep: true,
    },
  },
  methods: {
    changeChannelList(val) {
      if (val && val.length) {
        if (val.length == 2) {
          val[1].channel = val[0].channel == '1' ? '2' : '1';
        }
      }
    },
    async validateMacroName(stationId, macroName, isEdit) {
      //2023-01-29 10:39:48 wangxin 新增 id: this.editContent.id
      let id = this.editId ? this.editId : '';
      const data = await this.$api.checkMacroName({ macroName: macroName, stationId: stationId, id: id });
      if (!data.data) {
        if (isEdit) {
          this.editWarning = true;
        } else {
          this.addWarning = true;
        }
      } else {
        this.addWarning = false;
        this.editWarning = false;
      }

      // callback();
    },
    exchangeType(val) {
      if (['X01', 'X02', 'X08'].includes(val)) {
        return '1';
      }
      if (['X03'].includes(val)) {
        return '2';
      }
      if (['X04'].includes(val)) {
        return '3';
      }
    },
    openCollapse() {
      this.collapseList = ['1', '2', '3', '4'];
    },
    async getStations() {
      const data = await this.$api.searchStation({
        pageIndex: 1,
        pageSize: 10000,
        stationIds: this.userStationList.map((item) => item.path),
        useStatus: -1,
      });
      this.stationList = data.data.records.map((item) => ({
        value: item.stationId,
        label: item.name,
        autoTracking: item.autoTracking,
      }));
    },
    deleteChild(index, form) {
      form.ddtMacroInfoList.splice(index, 1);
    },
    addDdtMacroInfoList(form) {
      let val = form.ddtMacroInfoList[0].channel == '1' ? '2' : '1';
      form.ddtMacroInfoList.push({ channel: val, satelliteBand: '', ddtMacroName: '' });
    },
    async getDeviceUnitList(val) {
      const data = await this.$api.deviceUnitList({ stationId: val });
      this.deviceUnitList = data.data;
      this.options = data.data;
    },
    changeDate(val) {
      if (val) {
        this.formInline.startTime = val[0];
        this.formInline.endTime = val[1];
      } else {
        this.formInline.startTime = '';
        this.formInline.endTime = '';
      }
    },
    submitEditForm() {
      //editMarco
      this.editContent.deviceInfos = this.formData;
      this.$refs['editContent'].validate((valid) => {
        if (valid && !this.editWarning) {
          this.editMarco();
        } else {
          return false;
        }
      });
    },
    async editMarco() {
      const { id } = this.editContent;
      // delete this.editContent.id;
      const data = await this.$api.editMarco(id, this.editContent);
      if (data.code == 200) {
        this.getData();
        this.showEditDialog = false;
        return this.$message.success(data.resultMsg);
      }
    },
    changeItemddtMacroName(index, val, form) {
      var obj = {};
      obj = this.macroDdtFileDTO.find(function (i) {
        return i.ddtFileName === val;
      });
      form.ddtMacroInfoList[index].ddtCodeRate = obj.codeRate;
    },
    getSatelliteBand(val) {
      return (elementOfArray('value', val, this.satelliteBandList) && elementOfArray('value', val, this.satelliteBandList).label) || '';
    },
    getTaskType(val) {
      return (elementOfArray('value', val, this.taskTypeList) && elementOfArray('value', val, this.taskTypeList).label) || '';
    },
    getStation(val) {
      return (elementOfArray('value', val, this.stationList) && elementOfArray('value', val, this.stationList).label) || '';
    },
    getSatelliteName(val) {
      return (elementOfArray('satelliteId', val, this.satellite) && elementOfArray('satelliteId', val, this.satellite).satelliteName) || '';
    },
    pageHandleChange(page) {
      this.page = page;
      this.getData();
    },
    changeMacroName(val, form) {
      var obj = {};
      obj = this.macroRxDTOList.find(function (i) {
        return i.bbeFileName === val;
      });
      form.bbeCodeRate = obj.codeRate;
    },

    async getMacroFile(val) {
      let data = {
        satelliteNo: val.satelliteNo,
        taskType: this.exchangeType(val.taskType),
      };
      const res = await this.$api.getMacroFile(data);
      const { macroDdtFileDTO, macroRxDTOList } = res.data ?? [];
      this.macroRxDTOList = macroRxDTOList;
      this.macroDdtFileDTO = macroDdtFileDTO;
    },
    getFile(val) {
      if ((val.taskType && val.patternType && val.satelliteNo) || (val.taskType && val.satelliteNo && ['X03', 'X04'].includes(val.taskType))) {
        this.getMacroFile(val);
      }
    },

    async getSatellite() {
      const data = await this.$api.selectSat();
      let arr = Array.from(data.data);
      this.satellite = arr;
    },
    async getData() {
      let data = {
        endTime: this.formInline.endTime || '',
        macroName: this.formInline.macroName || '',
        pageIndex: this.page,
        pageSize: this.size,
        satelliteNo: this.formInline.satelliteNo,
        startTime: this.formInline.startTime || '',
        stationId: this.formInline.stationId || '',
      };
      const res = await this.$api.marcoList(data);
      this.tableData = res.data.records;
      this.total = res.data.total;
      this.page = res.data?.current;
    },
    getForm(val) {
      this.formData = val;
    },
    async addMarco() {
      this.$refs['form'].validate(async (valid) => {
        if (valid && !this.addWarning) {
          const data = await this.$api.marcoAdd(this.form);
          if (data.code == 200) {
            this.getData();
            this.showAddDialog = false;
            return this.$message.success(data.resultMsg);
          }
        } else {
          return false;
        }
      });
    },
    submitForm() {
      this.form.deviceInfos = this.formData;
      this.addMarco();
    },
    cancelEditSubmit() {
      this.showEditDialog = false;
    },
    cancelSubmit() {
      this.showAddDialog = false;
    },
    onSubmit() {
      this.page = 1;
      this.getData();
    },
    async toCheck(item) {
      const data = await this.$api.marcoDetail(item.id);
      this.checkContent = data.data;
      this.openCollapse();
      this.showCheckDialog = true;
    },
    async toEdit(item) {
      const data = await this.$api.marcoDetail(item.id);
      // console.log(data);
      this.editContent = data.data;
      this.editId = data.data.id;
      this.openCollapse();
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
      const data = await this.$api.deleteMarco(item.id);
      if (data.code == 200) {
        this.getData();
        return this.$message.success(data.resultMsg);
      }
    },
    async toCopy(item) {
      const data = await this.$api.marcoDetail(item.id);
      const { bbeCodeRate, bbeMacroFileName, ddtMacroInfoList, deviceInfos, macroName, macroRemark, patternType, satelliteBand, satelliteNo, stationId, polarization, taskType, autoTrackingFlag } =
        data.data;
      var obj = { bbeCodeRate, bbeMacroFileName, ddtMacroInfoList, deviceInfos, macroName, macroRemark, patternType, satelliteBand, satelliteNo, stationId, taskType, polarization, autoTrackingFlag };
      this.form = obj;
      delete this.form.id;
      this.isCopy = true;
      this.openCollapse();
      this.showAddDialog = true;
    },
    toAdd() {
      this.isCopy = false;
      this.form = { ddtMacroInfoList: [{ channel: '1', satelliteBand: '', ddtMacroName: '' }] };
      this.openCollapse();
      this.showAddDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-tooltip__popper.is-light {
  .table-operate-btn {
    &.delete {
      color: #ff2b2b;
    }
    &:hover {
      color: var(--yx-font-8);
    }
  }
}
.el-dialog.common-dialog.macro-detail,
.el-dialog.common-dialog.macro-edit {
  .dialog-content {
    padding: 20px;
  }
  .el-form {
    display: block;
    color: var(--yx-font-2);
    :deep().el-collapse.group {
      border: none;
      > .el-collapse-item > div > .el-collapse-item__header {
        height: 42px;
        background: transparent;
        border: none;
        color: var(--yx-font-4);
        border-bottom: #8a9cb8 1px solid;
        .el-collapse-item__arrow {
          margin-right: 0;
          font-size: 14px;
          color: var(--yx-font-5);
          &::before {
            content: '\e790';
          }
          &.is-active {
            transform: rotate(180deg);
          }
        }
      }
      .el-collapse-item__content {
        padding-bottom: 0;
      }
      .el-collapse-item__wrap {
        background: transparent;
        border-bottom: none;
      }
    }
  }
  .content {
    display: flex;
    flex-wrap: wrap;
    padding: 12px 0;
    .add-macro {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px;
      width: 100%;
      background: var(--yx-background-5);
      line-height: 28px;
      border-radius: 4px;
      cursor: pointer;
      i {
        font-weight: 500;
        font-size: 18px;
        color: var(--yx-font-8);
      }
    }
    .content-item {
      flex-direction: column;
      width: calc((100% - 168px) / 5);
      margin-right: 42px;
      &:not([style*='display: none']) {
        &:nth-child(5n),
        &:nth-last-child(1) {
          margin-right: 0;
        }
      }
    }

    &.data-transmission {
      .content-item:nth-last-child(1) {
        flex-grow: 1;
        margin-right: 0;
        .normal-select,
        .value {
          width: 338px;
        }
      }
    }
    &.measure-control {
      flex-wrap: nowrap;
    }
    &.data-transmission {
      .data-transmission-item {
        width: 100%;
        .form-wrap {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
        }

        .delete-header {
          width: 100%;
          margin: 12px 0;
          text-align: right;
          padding-bottom: 8px;
          border-bottom: #8a9cb8 1px solid;
          i {
            cursor: pointer;
            color: var(--yx-font-4);
          }
        }
      }
    }
  }

  .content-form-item {
    margin: 0 41px 18px 0;
    white-space: nowrap;
    :deep().el-form-item__content .el-select .el-input .el-input__inner[readonly] {
      background: transparent;
    }
    &.read-only {
      :deep().el-select {
        background: transparent;

        &::before {
          display: none;
        }
      }

      :deep().el-form-item__content .el-input .el-input__inner[readonly],
      :deep().el-form-item__content .el-select .el-input.is-disabled .el-input__inner {
        background: var(--yx-thead);
        color: var(--yx-font-8);
      }
    }
  }
  .btn-wrap {
    .button-default:nth-child(1) {
      margin-right: 32px;
    }
  }
}
.macro-parameter-admin {
  height: 100%;
  overflow: scroll;
  padding-bottom: 82px;
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
          .macro-parameter-admin-form {
            .el-form-item {
              margin-right: 12px;
              &:nth-last-child(2) {
                margin: 0 12px;
              }
            }
            .view-btn {
              display: flex;
              align-items: center;
            }
          }
        }
        .list-content {
          .list-table {
            .table-operate-btn {
              padding: 0 8px;
              &:nth-child(1) {
                border-right: var(--yx-font-5) 1px solid;
              }
              .el-tooltip__popper.is-light {
                .sub-btn:hover {
                  color: red;
                }
              }
            }
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
