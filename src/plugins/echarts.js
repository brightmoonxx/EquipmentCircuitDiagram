/*
 * @Author: WangXin
 * @Date: 2022-08-19 13:08:32
 * @LastEditors: heliling
 * @LastEditTime: 2022-11-11 10:33:27
 * @FilePath: \code-wx\src\plugins\widget\chart\index.js
 * @Description:
 *
 * Copyright (c) 2022 by YuXing, All Rights Reserved.
 */
import * as echarts from 'echarts/core';
import { BarChart, PieChart, LineChart, GaugeChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  VisualMapComponent,
  MarkLineComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
// 注册必须的组件
echarts.use([
  TitleComponent,
  MarkLineComponent,
  VisualMapComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  DataZoomComponent,
  TransformComponent,
  BarChart,
  ToolboxComponent,
  LegendComponent,
  PieChart,
  LineChart,
  GaugeChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);
export default echarts;
