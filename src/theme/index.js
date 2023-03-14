/*
 * @Author: wangxin
 * @Date: 2022-06-22 16:19:32
 * @LastEditors: WangXin
 * @LastEditTime: 2023-02-07 13:41:42
 * @FilePath: \code\src\theme\index.js
 * @Description:
 *
 * Copyright (c) 2022 by yuxing, All Rights Reserved.
 */
const systemColor = {
  light: {
    'yx-font-1': '#ffffff',
    'yx-font-2': '#334681',
    'yx-font-3': '#5C7195',
    'yx-font-4': '#3785E8',
    'yx-font-5': '#5E7495',
    'yx-font-6': '#4B4F55',
    'yx-font-7': '#F2F8FD',
    'yx-font-8': '#387DFF',
    'yx-font-9': '#2B63F1',
    'yx-success-1': '#00CF1C',
    'yx-success-2': '#0DCF28',
    'yx-success-3': '#00CB2F',
    'yx-success-4': '#07D022',
    'yx-warning-1': '#FFAA00',
    'yx-warning-2': '#FFBB61',
    'yx-warning-3': '#FFCC00',
    'yx-warning-4': '#FFF700',
    'yx-danger-1': '#CF0000',
    'yx-danger-2': '#FF0000',
    'yx-danger-3': '#EC2020',
    'yx-danger-4': '#FF3A6F',
    'yx-border-1': '#8396AD',
    'yx-border-2': '#ffffff',
    'yx-border-3': '#E8ECEF',
    'yx-border-4': '#7E93AF',
    'yx-background-1': '#F9FBFC',
    'yx-background-2': '#E0E3ED',
    'yx-background-3': '#f6f8fa',
    'yx-background-4': '#7280a9',
    'yx-background-5': 'rgba(56, 125, 255, 0.1)',
    'yx-background-6': '#F4F5F7',
    'yx-background-deep': '#D3D8E5',
    'yx-background-gradient': '#e2e7ef',
    'yx-content-1': '#0083FF',
    'yx-container-translucent': 'rgba(255, 255, 255, 0.12)',
    'yx-layer-1': '#C5CCD8',
    'yx-layer-2': '#8a919f',
    'yx-layer-3': '#8a919f',
    'yx-layer-4': '#8a919f',
    'yx-btn': '#334681',
    'yx-btn-active': '#0069FF',
    'yx-pager': '#ECEFF4',
    'yx-pager-active': '#0083FF',
    'yx-mask-1': 'rgba(0,0,0,0.4)',
    'yx-title-1': 'rgba(0,0,0,0.4)',
    'yx-title-2': '#0072FF',
    'yx-thead': 'rgba(51, 70, 129, 0.05)',
    'yx-tr-active': 'linear-gradient(270deg, rgba(56,125,255,0.15) 0%, rgba(56,125,255,0) 100%)',
    'yx-line-default': '#A2B2C5',
    'yx-line-active': '#3474E4',
    'yx-default-btn': '#0690F5',
    'yx-default-btn-outline': 'rgba(6, 144, 245, 0.32)',
    'yx-shadow': 'rgba(51, 70, 129, 0.1)',
    'yx-content-header': ' rgba(51, 70, 129, 0.04)',
  },
  dark: {
    'yx-font-1': '#ffffff',
    'yx-font-2': '#334681',
    'yx-font-3': '#5C7195',
    'yx-font-4': '#3785E8',
    'yx-font-5': '#5E7495',
    'yx-font-6': '#4B4F55',
    'yx-font-7': '#F2F8FD',
    'yx-font-8': '#387DFF',
    'yx-font-9': '#2B63F1',
    'yx-success-1': '#00CF1C',
    'yx-success-2': '#00C814',
    'yx-success-3': '#00CB2F',
    'yx-success-4': '#07D022',
    'yx-warning-1': '#FFAA00',
    'yx-warning-2': '#FFBB61',
    'yx-warning-3': '#FFCC00',
    'yx-warning-4': '#FFF700',
    'yx-danger-1': '#CF0000',
    'yx-danger-2': '#FF0000',
    'yx-danger-3': '#EC2020',
    'yx-danger-4': '#FF3A6F',
    'yx-border-1': '#8396AD',
    'yx-border-2': '#ffffff',
    'yx-border-3': '#E8ECEF',
    'yx-border-4': '#7E93AF',
    'yx-background-1': '#000',
    'yx-background-2': '#E0E3ED',
    'yx-background-3': '#f6f8fa',
    'yx-background-4': '#7280a9',
    'yx-background-5': 'rgba(56, 125, 255, 0.1)',
    'yx-background-deep': '#D3D8E5',
    'yx-background-gradient': 'linear-gradient(132deg, #000 0%, #fff 100%',
    'yx-content-1': '#0083FF',
    'yx-container-translucent': 'rgba(255, 255, 255, 0.12)',
    'yx-layer-1': '#C5CCD8',
    'yx-layer-2': '#8a919f',
    'yx-layer-3': '#8a919f',
    'yx-layer-4': '#8a919f',
    'yx-btn': '#334681',
    'yx-btn-active': '#0069FF',
    'yx-pager': '#ECEFF4',
    'yx-pager-active': '#0083FF',
    'yx-mask-1': 'rgba(0,0,0,0.4)',
    'yx-title-1': 'rgba(0,0,0,0.4)',
    'yx-title-2': '#0072FF',
    'yx-thead': 'rgba(51, 70, 129, 0.05)',
    'yx-tr-active': 'linear-gradient(270deg, rgba(56,125,255,0.15) 0%, rgba(56,125,255,0) 100%)',
    'yx-line-default': '#A2B2C5',
    'yx-line-active': '#3474E4',
    'yx-default-btn': '#0690F5',
    'yx-default-btn-outline': 'rgba(6, 144, 245, 0.32)',
    'yx-shadow': 'rgba(51, 70, 129, 0.1)',
    'yx-content-header': ' rgba(51, 70, 129, 0.04)',
  },
};

export class themeColor {
  constructor() {
    this.install = this.install;
    this.theme = 'light';
  }
  install() {
    const root = document.querySelector(':root');
    Object.keys(systemColor[this.theme]).forEach((color) => {
      root.style.setProperty(`--${color}`, systemColor[this.theme][color]);
    });
  }
  changeTheme(theme) {
    const themeList = this.getThemeList();
    if (!themeList.includes(theme)) return;
    this.theme = theme;
    this.install();
  }
  getThemeList() {
    return Object.keys(systemColor);
  }
}
