/*
 * @Author: WangXin
 * @Date: 2022-12-13 16:36:23
 * @LastEditors: WangXin
 * @LastEditTime: 2023-02-02 14:46:52
 * @FilePath: \code\src\directives\index.js
 * @Description:
 *
 * Copyright (c) 2022 by YuXing, All Rights Reserved.
 */
import permission from './permission';
const directives = {
  permission,
};
export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key]);
    });
  },
};
