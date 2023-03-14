<!--
 * @Author: WangXin
 * @Date: 2022-10-10 15:51:40
 * @LastEditors: WangXin
 * @LastEditTime: 2023-02-13 14:02:51
 * @FilePath: \code\src\views\Home\Home.vue
 * @Description:
 *
 * Copyright (c) 2022 by YuXing, All Rights Reserved.
-->
<template>
  <div class="station-control-container">
    <div class="station-control-header">
      <div class="header-left">
        <div class="logo">
          <yx-icon name="logo" @click="chooseStation" style="font-size: 100px; height: 50px"></yx-icon>
          <h2 class="mg-left-10" @click="chooseStation">地面站管理系统</h2>
          <div class="gap"></div>
          <div class="station-name mg-left-10">{{ query.name }}</div>
        </div>
        <div class="station-nav">
          <router-link
            v-for="(item, index) in navList"
            :to="{ path: item.redirect, query: query }"
            :key="index"
            class="nav-item"
            :class="{ active: navIndex === index }"
            @click.native="goToPage(item, index)"
          >
            <div class="nav-item-title">
              {{ item.meta.title }}
            </div>
            <div class="line">
              <span></span>
              <span></span>
              <div class="main-line"></div>
              <span></span>
              <span></span>
            </div>

            <div class="dropdown-list-wrapper" v-show="item.children.length > 1">
              <div class="station-control-nav">
                <router-link
                  v-for="(childItem, childIndex) in item.children"
                  :to="{ path: childItem.path }"
                  :key="childIndex"
                  class="station-control-nav-item"
                  @click.native="goToSubPge(childItem, index)"
                >
                  {{ childItem.meta.title }}
                  <!-- <router-link :to="{ path: childItem.path, query: query }">{{ childItem.meta.title }}</router-link> -->
                </router-link>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      <div class="header-right">
        <span class="system-time">
          {{ time }}
        </span>
        <div class="user mg-x-10">{{ userInfo.name }}</div>
      </div>
    </div>
    <!-- <div class="page-tab">
      <el-tabs v-model="editableTabsValue" type="card">
        <el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.meta.title" :name="index"></el-tab-pane>
      </el-tabs>
    </div> -->

    <div class="view">
      <router-view />
    </div>
  </div>
</template>
<script>
import { getCurrentTime } from '@/utils/utils';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      editableTabsValue: null,
      editableTabs: [],
      tabIndex: 0,
      time: '2022-09-28 12:00:00',
      navIndex: 0,
      query: this.$route.query,
    };
  },
  computed: {
    ...mapState(['navList', 'userStationList', 'userPosition', 'userInfo']),
  },
  mounted() {
    console.log(this.navList);
    const curTab = sessionStorage.getItem('curTab');
    if (this.userPosition == 'inside') {
      this.getUserStationPower();
    }
    if (curTab) {
      this.navIndex = this.navList.findIndex((item) => item.name == curTab);
    }
    this.timedExecution();
  },
  watch: {
    $route: {
      handler() {
        this.navIndex = this.navList.findIndex((item) => item.name == this.$route.matched[0]?.name);
      },
    },
  },
  beforeDestroy() {
    this._timer = null;
    clearTimeout(this._timer);
  },
  methods: {
    timedExecution() {
      this._timer = setTimeout(() => {
        this.time = getCurrentTime('YYYY-MM-DD HH:mm:ss');
        this._timer && clearTimeout(this._timer);
        this.timedExecution();
      }, 1000);
    },
    removeTab(targetIndex) {
      let tabs = this.editableTabs;
      let activeIndex = this.editableTabsValue;
      if (targetIndex === activeIndex) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeIndex = index;
            }
          }
        });
      }
      this.editableTabsValue = activeIndex == 1 ? '0' : activeIndex - 1;
      this.editableTabs = tabs.filter((tab, index) => index !== targetIndex - 1);
    },
    getNavIndex(childIndex) {
      for (let i = 0; i < this.navList.length; i++) {
        for (let j = 0; j < this.navList[i].children.length; j++) {
          const fartherTitle = this.navList[i].meta.title;
          const fartherSubTitle = this.navList[i].children[j].meta.title;
          const childrenTitle = this.editableTabs[childIndex].meta.title;
          if (fartherTitle == childrenTitle || childrenTitle == fartherSubTitle) return i;
        }
      }
    },
    goToPage(item, index) {
      // if (item.name == 'DataAnalysis') return;
      this.navIndex = index;

      sessionStorage.setItem('curTab', item.name);
    },
    goToSubPge(item) {
      sessionStorage.setItem('curTab', item.name);
      // this.$router.push({ path: item.path }).catch((data) => {});
    },
    chooseStation() {
      this.$router.push('/').catch((data) => {});
      this.editableTabs = [...this.navList[0].children];
      this.navIndex = 0;
      this.editableTabsValue = '0';
      this.query = '';
    },
    addTab(children) {
      const length = this.editableTabs.length;
      for (let i = 0; i < children.length; i++) {
        const index = this.editableTabs.findIndex((tab) => tab.meta.title == children[i].meta.title);
        if (index === -1) {
          this.editableTabs.push(children[i]);
          this.editableTabsValue = length;
        } else {
          this.editableTabsValue = index == 0 ? '0' : index;
          break;
        }
      }
    },
    getUserStationPower() {
      const result = this.userStationList.filter((item) => item.path == this.query?.stationId);
      if (result.length == 0) {
        this.$message.warning('您暂无此站的权限');
        return this.$router.push({ path: '/station-list' });
      }
      const userStationPower = result.length > 0 ? result[0].children[0].path : '';
      sessionStorage.setItem('userStationPower', userStationPower);
    },
  },
};
</script>
<style lang="scss" scoped>
.station-control-container {
  width: 100%;
  height: 100%;
}
.header-left {
  display: flex;
  .logo {
    display: flex;
    align-items: center;
    cursor: pointer;
    h2 {
      margin-right: 14px;
      font-size: 20px;
      color: var(--yx-font-1);
    }
    .gap {
      width: 1px;
      height: 22px;
      border-right: 1px solid var(--yx-border-2);
      opacity: 1;
    }
    .station-name {
      font-size: 20px;
      color: var(--yx-font-1);
    }
  }
}
.station-control-header {
  padding: 0 32px;
  box-sizing: border-box;
  height: 54px;
  background: #8396ad;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view {
  height: 100%;
  // background: var(--yx-background-gradient);
  background: #e2e7ef;
}
.header-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  line-height: 24px;
  color: #ffffff;
}
.station-nav {
  display: flex;
  align-items: center;
  margin-left: 44px;
  .nav-item {
    position: relative;
    margin-right: 8px;
    min-width: 140px;
    height: 38px;
    background: var(--yx-btn);
    line-height: 38px;
    border: 1px solid #e9edf5;
    border-radius: 2px;
    font-size: 18px;
    font-weight: 400;
    .line {
      position: absolute;
      top: 4px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      .main-line {
        width: 105px;
        height: 1px;
        background: #e9edf5;
      }
      span {
        display: block;
        margin: 0 2px 0 2px;
        width: 1px;
        height: 1px;
        background: #e9edf5;
      }
    }
    > .nav-item-title {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 0 7px;
      color: #f2f8fd;
    }
    &:hover,
    &.active {
      background: var(--yx-btn-active);
    }
    .dropdown-list-wrapper {
      position: absolute;
      top: 24px;
      z-index: 9;
      left: 50%;
      transform: translateX(-50%);
      display: none;
      width: 100%;
      cursor: auto;
      .station-control-nav {
        padding: 6px 1px;
        margin-top: 20px;
        width: 100%;
        background: #ebf0f6;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        .station-control-nav-item {
          padding-left: 6px;
          white-space: nowrap;
          color: #7e93af;
          a {
            color: #7e93af;
          }
          &:hover {
            background: #e1e7f1;
            a {
              color: #0069ff;
            }
          }
        }
      }
    }
    &:hover {
      .dropdown-list-wrapper {
        display: block;
      }
    }
  }
}
.page-tab {
  padding: 14px 32px;
  min-height: 59px;
  background: #ebf0f6;
  box-shadow: 0px 2px 4px var(--yx-shadow);
}
</style>
