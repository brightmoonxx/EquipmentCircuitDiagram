/*
 * @Author: wangxin
 * @Date: 2022-05-16 10:55:06
 * @LastEditors: WangXin
 * @LastEditTime: 2023-01-11 14:13:55
 * @FilePath: \code\babel.config.js
 * @Description:
 *
 * Copyright (c) 2022 by yuxing, All Rights Reserved.
 */
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset', '@babel/preset-env'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk',
      },
    ],
    [
      'import',
      {
        libraryName: 'vxe-table',
        style: true,
      },
    ],
  ],
};
