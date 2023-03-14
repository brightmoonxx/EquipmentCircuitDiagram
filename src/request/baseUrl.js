/*
 * @LastEditors: WangXin
 * @LastEditTime: 2023-03-10 10:16:37
 * @LastEditors: WangXin
 * @LastEditTime: 2023-03-03 14:46:57
 * @FilePath: \code\src\request\baseUrl.js
 * @Description:
 *
 * Copyright (c) 2022 by YuXing, All Rights Reserved.
 */
const baseUrl =
  process.env.NODE_ENV === 'development'
    ? {
        domainUrl: 'http://yuxing.test.com', //yuxing.develop.com
        devApiUrl: 'http://yuxing.test.com/station-control-center', //http://yuxing.develop.com/station-control-center http://stationcontrolcenter.develop.com  http://10.2.0.125:8080
        stationWs: 'ws://yuxing.test.com/station-control-center', //10.2.0.144:8080  ws://yuxing.develop.com/station-control-center
      }
    : {
        domainUrl: '',
        devApiUrl: '',
        stationWs: '/station-control-center', // socket
      };
exports = module.exports = baseUrl;
