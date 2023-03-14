/*
 * @Author: WangXin
 * @Date: 2022-11-15 17:14:58
 * @LastEditors: WangXin
 * @LastEditTime: 2022-12-02 11:34:37
 * @FilePath: \code\src\icons\index.js
 * @Description:
 *
 * Copyright (c) 2022 by YuXing, All Rights Reserved.
 */
import Vue from 'vue';
import Svg from '@/components/common/Svg/Svg.vue';
const requireAll = (requireContext) => requireContext.keys().map(requireContext);
const req = require.context('./svg', false, /\.svg$/); // webpack方法
requireAll(req);
Vue.component('yx-icon', Svg);
