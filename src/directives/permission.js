/*
 * @Author: WangXin
 * @Date: 2022-12-13 16:36:53
 * @LastEditors: WangXin
 * @LastEditTime: 2022-12-15 11:30:29
 * @FilePath: \code\src\directives\permission.js
 * @Description:
 *
 * Copyright (c) 2022 by YuXing, All Rights Reserved.
 */

//操作者 path 1
//观察者 path 2
const permission = {
  bind() {},
  inserted(el, binding) {
    controlShowByUserPower(el);
  },
  update() {},
  unbind() {},
};
function controlShowByUserPower(el) {
  const userStationPower = JSON.parse(sessionStorage.getItem('userStationPower'));
  switch (userStationPower) {
    case '2':
      el.parentNode.removeChild(el);
      break;
    case '':
      el.parentNode.removeChild(el);
      break;
  }
}
export default permission;
