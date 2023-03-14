/*
 * @Author: wangxin
 * @Date: 2022-05-16 10:55:06
 * @LastEditors: WangXin
 * @LastEditTime: 2023-01-11 14:34:52
 * @FilePath: \code\src\lib\ui\element.js
 * @Description:
 *
 * Copyright (c) 2022 by yuxing, All Rights Reserved.
 */
import Vue from 'vue';
import {
  Menu,
  MenuItem,
  Submenu,
  Message,
  Tree,
  MessageBox,
  Loading,
  Input,
  Dialog,
  Form,
  FormItem,
  Select,
  Option,
  Button,
  Upload,
  colorPicker,
  Switch,
  Checkbox,
  Tooltip,
  Table,
  TableColumn,
  Pagination,
  DatePicker,
  RadioGroup,
  Radio,
  Tabs,
  TabPane,
  Collapse,
  CollapseItem,
  Cascader,
  Popover,
  InputNumber,
} from 'element-ui';

Vue.use(Tree)
  .use(Popover)
  .use(InputNumber)
  .use(Loading)
  .use(Tooltip)
  .use(Input)
  .use(Checkbox)
  .use(Dialog)
  .use(Form)
  .use(FormItem)
  .use(Select)
  .use(Option)
  .use(Button)
  .use(Upload)
  .use(Switch)
  .use(Table)
  .use(TableColumn)
  .use(Pagination)
  .use(DatePicker)
  .use(RadioGroup)
  .use(Radio)
  .use(Tabs)
  .use(TabPane)
  .use(Menu)
  .use(MenuItem)
  .use(Submenu)
  .use(Collapse)
  .use(CollapseItem)
  .use(Cascader)
  .use(colorPicker)
  .use(InputNumber);

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$alert = MessageBox.alert;
