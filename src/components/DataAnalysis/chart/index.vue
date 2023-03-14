<!--
 * @Author: heliling
 * @Date: 2023-01-06 14:30:11
 * @LastEditors: WangXin
 * @LastEditTime: 2023-03-08 16:47:07
 * @Description:
 *
 * Copyright (c) 2023 by YuXing, All Rights Reserved.
-->
<template>
  <div class="chart-item" :id="name"></div>
</template>
<script>
import { elementOfArray } from '@/utils/utils';
import echarts from '../../../plugins/echarts';

import moment from 'moment';
export default {
  props: {
    name: { type: String, default: '' },
  },
  data() {
    return { myChart: null, time: 1672387314908, data: [] };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    window.addEventListener('resize', (e) => {
      if (this.myChart) {
        this.chartResize(50);
      }
    });
  },
  destroyed() {},
  methods: {
    randomData() {
      let value = 1;
      value = value + Math.random() * 21;
      return Math.round(value);
    },
    initChart(title, data) {
      this.data = data;
      const chartDom = document.getElementById(`${this.name}`);
      this.myChart = echarts.init(chartDom);
      let option = {
        title: {
          text: title,
          left: '2%',
          top: '2%',
          textStyle: {
            fontSize: 14,
            color: '#334681',
            fontWeight: '500',
          },
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          textStyle: {
            color: '#334681',
          },
          data: data.map((item) => item.title),
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        toolbox: {
          feature: {},
        },
        xAxis: [
          {
            type: 'time',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.39)',
              },
            },
            splitNumber: 3,
            axisTick: { length: 8 },
            axisLabel: { interval: 1, color: '#334681', formatter: '{H}:{mm}:{ss}' },
            animation: true,
          },
        ],
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: '#e8ecef',
            },
          },
          axisLabel: {
            color: '#334681',
          },
          boundaryGap: ['20%', '20%'],
        },
        color: ['#387DFF', '#FFD738'],
        series: [],
        dataZoom: [
          {
            id: 'dataZoomX',
            start: 0,
            end: '100',
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'filter',
            zoomOnMouseWheel: false,
            moveOnMouseMove: false,
            moveOnMouseWheel: false,
          },
        ],
      };
      let arr = [];
      data.forEach((item) => {
        arr.push({
          name: item.title,
          key: item.name,
          type: 'line',
          symbolSize: 2,
          lineStyle: {
            width: 1,
          },
          markLine: {
            data: [],
            lineStyle: {
              color: 'rgba(217, 103, 103, 1)',
            },
          },
          data: [],
        });
      });
      option.series = arr;
      this.myChart.setOption(option);
    },
    chartResize(time) {
      setTimeout(() => {
        this.myChart.resize();
      }, time);
    },
    updateChart(key, value, mark, yAxisMaxAndMin) {
      const rate = 5; //上下最大值延申5
      const range = 60; //查看数据范围
      this.time = moment().valueOf();
      if (!this.myChart) return;
      let option = this.myChart.getOption();
      option.notMerge = true;
      option.series.forEach((item) => {
        if (item.key == key && elementOfArray('title', item.name, this.data)) {
          item.data.push({
            value: [this.time, value],
          });
          option.yAxis[0].min = (yAxisMaxAndMin.min - rate).toFixed(0);
          option.yAxis[0].max = (yAxisMaxAndMin.max + rate).toFixed(0);
          if (mark) {
            item.markLine = {
              symbol: 'none',
              data: [{ yAxis: mark, name: '参考值' }],
              label: { show: true, formatter: '{b}:{c}', position: 'insideMiddleTop', textBorderColor: 'transparent', distance: [0, 0] },
              lineStyle: {
                color: 'rgba(217, 103, 103, 1)',
              },
            };
            //确保基准值一直都在
            option.yAxis[0].min = option.yAxis[0].min < mark ? option.yAxis[0].min : (mark - rate).toFixed(0);
            option.yAxis[0].max = option.yAxis[0].max > mark ? option.yAxis[0].max : (mark + rate).toFixed(0);
            // 暂时取消超出基准值的设置
            // option.visualMap = {
            //   show: true,
            //   dimension: 0,
            //   pieces: [
            //     {
            //       lt: mark, //小于基准值
            //       color: 'green',
            //     },
            //   ],
            // };
          }
        }
        if (item.data.length > range) {
          const rate = (range / item.data.length).toFixed(2);
          option.dataZoom[0].start = (1 - rate) * 100;
        }
      });

      this.myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
.chart-item {
  padding-top: 12px;
  height: 240px;
  background: rgba(239, 242, 249, 0.11);
  border: 1px solid #e8ecef;
  border-radius: 4px;
}
</style>
