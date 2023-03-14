/*
 * @Author: huangzhendong
 * @Date: 2022-12-08 16:42:25
 * @LastEditors: WangXin
 * @LastEditTime: 2023-01-05 18:01:51
 * @FilePath: \code\src\views\ACU\js\config.js
 */
// key,单帧
export const frameFormatKey = [
  'monitor_mode',
  'work_mode',
  'azimuth_guiding_angle',
  'pitch_guide_angle',
  'azimuth_angle',
  'pitch_angle',
  'tilt_axle_frame_angle',
  'plan_code',
  'plan_time',
  'agc',
  'ua',
  'ue',
  'agc_lock',
  'trk_transfer_channel',
  'trk_pitch_transfer',
  'trk_slope_bearing',
  'trk_slope_pitch',
  'acu_outer_time',
  'acu_system_status',
  'acu_drive_cabinet',
  'acu_emergency_stop_state',
  'tail_after_1_status',
  'tail_after_2_status',
  'azimuth_drive_status',
  'azimuth_drive_en',
  'azimuth_lock',
  'azimuth_plus_astrict',
  'azimuth_minus_astrict',
  'pitch_drive_status',
  'pitch_drive_en',
  'pitch_lock',
  'pitch_plus_astrict',
  'pitch_minus_astrict',
  'incline_drive_status',
  'incline_drive_en',
  'incline_lock',
  'incline_plus_astrict',
  'incline_minus_astrict',
  'azimuth_drive_1_electric',
  'azimuth_drive_1_link',
  'azimuth_drive_2_electric',
  'azimuth_drive_2_link',
  'pitch_drive_1_electric',
  'pitch_drive_1_link',
  'pitch_drive_2_electric',
  'pitch_drive_2_link',
  'incline_drive_1_electric',
  'incline_drive_1_link',
  'incline_drive_2_electric',
  'incline_drive_2_link',
];
//配置： con 容器，fieldName 对应字段名
export const initObj = [
  {
    con: 'acuLocation',
    fieldName: 'work_mode',
  },
  {
    con: 'control',
    fieldName: 'monitor_mode',
  },
  {
    con: 'startTime',
    fieldName: 'plan_time',
  },
  {
    con: 'incAngle',
    fieldName: 'tilt_axle_frame_angle',
  },
  {
    con: 'angleTable',
    fieldName: ['azimuth_guiding_angle', 'pitch_guide_angle', 'azimuth_angle', 'pitch_angle'],
  },
  {
    con: 'AGC',
    fieldName: 'agc',
  },
  {
    con: 'Ua',
    fieldName: 'ua',
  },
  {
    con: 'Ue',
    fieldName: 'ue',
  },
  {
    con: 'isLock',
    fieldName: 'agc_lock',
  },
  // { con: 'ACU_SET_PARAM_SETTAIL_AFTER_1' },
  // { con: 'ACU_SET_PARAM_SETTAIL_AFTER_2' },
  {
    con: 'shiftSlopeObj',
    fieldName: ['trk_transfer_channel', 'trk_pitch_transfer', 'trk_slope_bearing', 'trk_slope_pitch'],
  },
  {
    con: 'inspectionObject',
    fieldName: [
      'acu_outer_time',
      'acu_system_status',
      'acu_drive_cabinet',
      'acu_emergency_stop_state',
      'tail_after_1_status',
      'tail_after_2_status',
      'azimuth_drive_status',
      'azimuth_drive_en',
      'azimuth_lock',
      'azimuth_plus_astrict',
      'azimuth_minus_astrict',
      'pitch_drive_status',
      'pitch_drive_en',
      'pitch_lock',
      'pitch_plus_astrict',
      'pitch_minus_astrict',
      'incline_drive_status',
      'incline_drive_en',
      'incline_lock',
      'incline_plus_astrict',
      'incline_minus_astrict',
      'azimuth_drive_1_electric',
      'azimuth_drive_1_link',
      'azimuth_drive_2_electric',
      'azimuth_drive_2_link',
      'pitch_drive_1_electric',
      'pitch_drive_1_link',
      'pitch_drive_2_electric',
      'pitch_drive_2_link',
      'incline_drive_1_electric',
      'incline_drive_1_link',
      'incline_drive_2_electric',
      'incline_drive_2_link',
    ],
  },
  {
    con: 'cabinetObject',
    fieldName: [
      'azimuth_drive_1_electric',
      'azimuth_drive_1_link',
      'azimuth_drive_2_electric',
      'azimuth_drive_2_link',
      'pitch_drive_1_electric',
      'pitch_drive_1_link',
      'pitch_drive_2_electric',
      'pitch_drive_2_link',
      'incline_drive_1_electric',
      'incline_drive_1_link',
      'incline_drive_2_electric',
      'incline_drive_2_link',
    ],
  },
];
// export const inspectionKey = {
//     acu:['acu_outer_time','acu_system_status','acu_drive_cabinet','acu_emergency_stop_state','tail_after_1_status','tail_after_2_status'],
//     azimuth:['azimuth_drive_status','azimuth_drive_en','azimuth_lock','azimuth_plus_astrict','azimuth_minus_astrict'],
//     pitch:['pitch_drive_status','pitch_drive_en','pitch_lock','pitch_plus_astrict','pitch_minus_astrict'],
//     tilt:['incline_drive_status','incline_drive_en','incline_lock','incline_plus_astrict','incline_minus_astrict']
// }
// 巡检弹窗
export const inspectionObject = [
  {
    key: 'acu',
    title: 'ACU系统状态',
    data: [
      {
        key: 'acu_outer_time',
      },
      {
        key: 'acu_system_status',
      },
      {
        key: 'acu_drive_cabinet',
      },
      {
        key: 'acu_emergency_stop_state',
      },
      {
        key: 'tail_after_1_status',
      },
      {
        key: 'tail_after_2_status',
      },
    ],
  },
  {
    key: 'azimuth',
    title: '方位X轴',
    data: [
      {
        key: 'azimuth_drive_status',
      },
      {
        key: 'azimuth_drive_en',
      },
      {
        key: 'azimuth_lock',
      },
      {
        key: 'azimuth_plus_astrict',
      },
      {
        key: 'azimuth_minus_astrict',
      },
    ],
  },
  {
    key: 'pitch',
    title: '俯仰Y轴',
    data: [
      {
        key: 'pitch_drive_status',
      },
      {
        key: 'pitch_drive_en',
      },
      {
        key: 'pitch_lock',
      },
      {
        key: 'pitch_plus_astrict',
      },
      {
        key: 'pitch_minus_astrict',
      },
    ],
  },
  {
    key: 'tilt',
    title: '倾斜轴',
    data: [
      {
        key: 'incline_drive_status',
      },
      {
        key: 'incline_drive_en',
      },
      {
        key: 'incline_lock',
      },
      {
        key: 'incline_plus_astrict',
      },
      {
        key: 'incline_minus_astrict',
      },
    ],
  },
];
// 巡检弹窗 天线驱动机柜
export const cabinetObject = [
  {
    key: 'azimuth_drive_1_electric',
  },
  {
    key: 'azimuth_drive_1_link',
  },
  {
    key: 'azimuth_drive_2_electric',
  },
  {
    key: 'azimuth_drive_2_link',
  },
  {
    key: 'pitch_drive_1_electric',
  },
  {
    key: 'pitch_drive_1_link',
  },
  {
    key: 'pitch_drive_2_electric',
  },
  {
    key: 'pitch_drive_2_link',
  },
  {
    key: 'incline_drive_1_electric',
  },
  {
    key: 'incline_drive_1_link',
  },
  {
    key: 'incline_drive_2_electric',
  },
  {
    key: 'incline_drive_2_link',
  },
];
