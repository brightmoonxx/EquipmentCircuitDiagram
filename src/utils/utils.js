/*
 * @Author: WangXin
 * @Date: 2022-06-28 17:35:53
 * @LastEditors: heliling
 * @LastEditTime: 2023-01-31 16:59:50
 * @FilePath: \code\src\utils\utils.js
 * @Description:
 *
 * Copyright (c) 2022 by YuXing, All Rights Reserved.
 */

import moment from 'moment';
import { BigNumber } from 'bignumber.js';
export function deepCopy(target) {
  if (typeof target == 'object') {
    const result = Array.isArray(target) ? [] : {};
    for (const key in target) {
      if (typeof target[key] == 'object') {
        result[key] = deepCopy(target[key]);
      } else {
        result[key] = target[key];
      }
    }
    return result;
  }
  return target;
}
export function debounce(fun, time) {
  let timer;
  return function () {
    clearTimeout(timer);
    let args = arguments;
    timer = setTimeout(() => {
      fun.apply(this, args);
    }, time);
  };
}
// throttle.js

export function throttle(fun, time) {
  let t1 = 0; //初始时间
  return function () {
    let t2 = new Date(); //当前时间
    if (t2 - t1 > time) {
      console.log('0000');
      fun.apply(this, arguments);
      t1 = t2;
    }
  };
}
export function randomWord() {
  let str = '';
  let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  for (let i = 0; i < 32; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1));
    str += ([8, 12, 16, 20].includes(i) ? '-' : '') + arr[pos];
  }
  return str;
}
/**
 * 倒计时格式化
 * @param {number} countdown
 * @returns
 */
export const getDaysByCountdown = (countdown, isTopUnit) => {
  if (!countdown || countdown < 0) return '00';
  let day = '';
  if (isTopUnit) day = Math.floor(moment.duration(countdown).asDays());
  else day = Math.floor(moment.duration(countdown).days());
  day = `${day}`.padStart(2, '0');
  return day;
};

export const getHoursByCountdown = (countdown, isTopUnit) => {
  if (!countdown || countdown < 0) return '00';
  let hour = '';
  if (isTopUnit) hour = Math.floor(moment.duration(countdown).asHours());
  else hour = moment.duration(countdown).hours();
  hour = `${hour}`.padStart(2, '0');
  return hour;
};

export const getMinsByCountdown = (countdown, isTopUnit) => {
  if (!countdown || countdown < 0) return '00';
  let mins = '';
  if (isTopUnit) mins = Math.floor(moment.duration(countdown).asMinutes());
  else mins = moment.duration(countdown).minutes();
  mins = `${mins}`.padStart(2, '0');
  return mins;
};

export const getSecondsByCountdown = (countdown, isTopUnit) => {
  if (!countdown || countdown < 0) return '00';
  let secs = '';
  if (isTopUnit) secs = Math.floor(moment.duration(countdown).asSeconds());
  else {
    secs = moment.duration(countdown).seconds();
    secs = `${secs}`.padStart(2, '0');
  }
  return secs;
};
export const getCurrentTime = (formatStr) => moment().format(formatStr);

/**
 * 查找数组中某个元素，返回该元素
 */
export const elementOfArray = (key, value, list) => {
  if (!Array.isArray(list)) return null;
  if (list.length == 0) return null;
  for (let i = 0; i < list.length; i++) {
    if (list[i][key] == value) {
      return list[i];
    }
  }
  return null;
};

// 小数加法精度
export const floatAdd = (a, b) => {
  a = BigNumber(a);
  b = BigNumber(b);
  return a.plus(b).toNumber();
};

// 小数减法精度
export const floatMinus = (a, b) => {
  a = BigNumber(a);
  b = BigNumber(b);
  return a.minus(b).toNumber();
};
