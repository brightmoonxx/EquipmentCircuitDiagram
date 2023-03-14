/*
 * @Author: wangxin;
 * @Date: 2022-05-16 10:55:06
 * @LastEditors: WangXin
 * @LastEditTime: 2023-02-20 11:43:01
 * @FilePath: \code\src\request\api.js
 * @Description:
 *
 * Copyright (c) 2022 by yuxing, All Rights Reserved.
 */
import http, { uploadFile } from './http';
import base from './baseUrl';
const API_VERSION = process.env.NODE_ENV === 'development' ? '/api/v1' : '/station-control-center/api/v1';
export const login = (data) => http({ url: '/gateway/network/cloud-network-login/cloud/login', method: 'POST', loading: false, data });
export const selectUserInfoByToken = (data) => http({ url: '/gateway/network/cloud-network-login/cloud/selectUserInfoByToken', method: 'POST', loading: false, data });
//获取卫星的tle
export const getSatellite = () => http({ url: '/gateway/stationControl/satellite_infos', method: 'GET' });

//协议配置类接口
export const getProtocol = (data) => http({ url: `${API_VERSION}/protocol`, method: 'GET', loading: true, data });
export const addProtocol = (data) => http({ url: `${API_VERSION}/protocol`, method: 'POST', loading: true, data: data, isCheck: true });

export const changeProtocol = (data) => http({ url: `${API_VERSION}/protocol`, method: 'PUT', loading: true, data: data, isCheck: true });
export const deleteProtocol = (data) => http({ url: `${API_VERSION}/protocol`, method: 'DELETE', isParams: true, loading: false, data: data, isCheck: true });
export const searchProtocol = (data) => http({ url: `${API_VERSION}/protocol/body/search`, method: 'POST', loading: false, data });

export const addProtocolList = (data) => http({ url: `${API_VERSION}/protocol/add/body/${data.unitUuid}`, method: 'POST', loading: false, data: data.data, isCheck: true });
export const protocolSort = (data) => http({ url: `${API_VERSION}/protocol/unit/sort`, method: 'PUT', loading: false, data: data });

export const getProtocolPattern = (data) => http({ url: `${API_VERSION}/protocol/pattern/${data.protocolUuid}`, method: 'GET', loading: false, data: data.data });
export const addProtocolPattern = (data) => http({ url: `${API_VERSION}/protocol/pattern`, method: 'POST', loading: false, data: data, isCheck: true });
export const updateProtocolPattern = (data) => http({ url: `${API_VERSION}/protocol/pattern`, method: 'PUT', loading: false, data: data, isCheck: true });
export const deleteProtocolPattern = (data) => http({ url: `${API_VERSION}/protocol/pattern/${data.patternUuid}`, method: 'DELETE', loading: false, data: data, isCheck: true });
export const getProtocolUnit = (data) => http({ url: `${API_VERSION}/protocol/unit/search`, method: 'POST', loading: true, data: data });
export const addProtocolUnit = (data) => http({ url: `${API_VERSION}/protocol/unit`, method: 'POST', loading: true, data: data, isCheck: true });
export const updateProtocolUnit = (data) => http({ url: `${API_VERSION}/protocol/unit`, method: 'PUT', loading: true, data: data, isCheck: true });
export const addProtocolUnitList = (data) => http({ url: `${API_VERSION}/protocol/add/unit/body/${data.unitUuid}`, method: 'POST', loading: true, data: data.data, isCheck: true });
export const deleteProtocolUnit = (data) => http({ url: `${API_VERSION}/protocol/unit/${data.unitUuid}`, method: 'DELETE', loading: true, isCheck: true });
export const copyProtocol = (data) => http({ url: `${API_VERSION}/protocol/copy/${data.protocaolUuid}`, method: 'POST', loading: false, data, isCheck: true });
export const testProtocol = (data) => http({ url: `${API_VERSION}/protocol/parse/h16String`, method: 'POST', loading: false, data });
export const getProtocolLog = (data) => http({ url: `${API_VERSION}/protocol/log/data`, method: 'POST', isParams: true, loading: false, data });
//配置类接口
export const getProtocolConfig = (id) => http({ url: `${API_VERSION}/config/protocol/select`, method: 'GET', isParams: true, loading: true });

// 站点管理类接口
export const searchStation = (data, loading) => http({ url: `${API_VERSION}/station/search`, method: 'POST', loading: loading, data });
export const addStation = (data) => http({ url: `${API_VERSION}/station/add`, method: 'POST', loading: false, data });
export const changeStationStatus = (data, suffix) => http({ url: `${API_VERSION}/station/status/${suffix}`, method: 'PUT', loading: false, isParams: true, data });
export const deleteStation = (suffix) => http({ url: `${API_VERSION}/station/del/${suffix}`, method: 'DELETE', loading: false });
export const getSelectDevice = () => http({ url: `${API_VERSION}/device/all/select`, method: 'GET', loading: true });
export const getPduSocketList = (data) => http({ url: `${API_VERSION}/device/pdu/socket/list`, method: 'GET', isParams: true, loading: false, data });

export const bindPpduSocket = (data) => http({ url: `${API_VERSION}/device/bind/pdu/socket`, method: 'POST', isParams: true, loading: false, data });

export const editStation = (data) => http({ url: `${API_VERSION}/station/edit`, method: 'PUT', loading: false, data });

//计划
export const queryPlanById = (id) => http({ url: `${API_VERSION}/plan/queryPlanById/${id}`, method: 'GET', isParams: true, loading: false });

//获取计划的 所有任务
export const queryPlanTask = (planId) => http({ url: `${API_VERSION}/marco/task/${planId}`, method: 'GET', isParams: true, loading: false });

//文件上传
export const uploadFiles = (file) => uploadFile({ url: `${API_VERSION}/file/upload`, file });
//任务计划

export const queryPlan = (data, loading) => http({ url: `${API_VERSION}/plan/queryPlan`, method: 'POST', loading: loading, data });
export const selectSat = () => http({ url: `${API_VERSION}/plan/selectSat`, method: 'GET', loading: true });

export const selectSatContent = () => http({ url: `${API_VERSION}/plan/selectSatContent`, method: 'GET', loading: true });
export const selectErrorCount = (suffix) => http({ url: `${API_VERSION}/plan/selectErrorCount/${suffix}`, method: 'GET', loading: false });

export const selectNowTask = (suffix) => http({ url: `${API_VERSION}/plan/selectNow/${suffix}`, method: 'GET', loading: false, showMsg: false });

export const getCurrentPlan = (data) => http({ url: `${API_VERSION}/plan/selectNow/${data}`, method: 'GET', loading: true, data, showMsg: false });

//宏管理
export const marcoList = (data) => http({ url: `${API_VERSION}/marco/list`, method: 'POST', loading: true, data });
export const marcoAdd = (data) => http({ url: `${API_VERSION}/marco/add`, method: 'POST', loading: false, data });
export const getMacroFile = (data) => http({ url: `${API_VERSION}/marco/get/macro/file`, method: 'POST', loading: false, data });
export const marcoDetail = (suffix) => http({ url: `${API_VERSION}/marco/${suffix}`, method: 'GET', loading: false });
export const editMarco = (suffix, data) => http({ url: `${API_VERSION}/marco/${suffix}`, method: 'PUT', loading: false, data });
export const deleteMarco = (suffix) => http({ url: `${API_VERSION}/marco/${suffix}`, method: 'DELETE', loading: false });
export const deviceUnitList = (data) => http({ url: `${API_VERSION}/device/unit/list`, method: 'GET', loading: false, data });
export const getDeviceTagGroup = (data) => http({ url: `${API_VERSION}/device/tag/group`, method: 'GET', loading: false, data });
export const checkMacroName = (data) => http({ url: `${API_VERSION}/marco/check/macro/name`, method: 'POST', isParams: true, loading: false, data });
//重新执行任务
export const processReload = (data) => http({ url: `${API_VERSION}/marco/task/process/load/${data.id}`, method: 'GET', loading: false });
//任务日志
export const getTaskLog = (data) => http({ url: `${API_VERSION}/marco/task/log/${data.planId}`, method: 'GET', loading: false });
//设备管理
export const getGplotMonitorList = (data) => http({ url: `${API_VERSION}/device/gplot/monitor/list/${data.stationId}`, method: 'GET', isParams: true, loading: true });
export const getDeviceInfo = (data) => http({ url: `${API_VERSION}/device/control/info`, method: 'GET', isParams: true, loading: true, data });

//发送指令
export const sendInstruct = (data) => http({ url: `${API_VERSION}/instruct/send/instruct`, method: 'POST', loading: false, data });
//极化开关发送指令
export const sendSingleInstruct = (data) => http({ url: `${API_VERSION}/instruct/send/instruct/limit/param`, method: 'POST', loading: false, data, isParams: true });

//获取key
export const getBodyByKeys = (suffix, data) => http({ url: `${API_VERSION}/device/body/by/keys/${suffix}`, method: 'POST', loading: false, data });

export const getFrameFormatKey = (data) => http({ url: `${API_VERSION}/device/body/by/keys/${data.stationId}`, method: 'POST', loading: false, data: data.data });
export const getInstructList = (data) => http({ url: `${API_VERSION}/device/instruct/by/keys/${data.stationId}`, method: 'POST', loading: false, data: data.data });
//设备指令
export const acuT0LoadInstruct = (data) => http({ url: `${API_VERSION}/instruct/acu/zero/load`, method: 'POST', isParams: true, loading: false, data });
export const acuPointInstruct = (data) => http({ url: `${API_VERSION}/instruct/acu/point/to`, method: 'POST', isParams: true, loading: false, data });

//查询配置

export const configSearch = (data) => http({ url: `${API_VERSION}/config/config/search`, method: 'GET', loading: false, data });

export const getStationInfo = (data) => http({ url: `${API_VERSION}/station/info/${data.stationId}`, method: 'GET', loading: false });
