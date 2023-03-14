/*
 * @Author: WangXin
 * @Date: 2022-09-15 14:07:14
 * @LastEditors: WangXin
 * @LastEditTime: 2023-02-08 10:36:33
 * @FilePath: \code\vue.config.js
 * @Description:
 *
 * Copyright (c) 2022 by YuXing, All Rights Reserved.
 */
const { defineConfig } = require('@vue/cli-service');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const isProduction = process.env.NODE_ENV == 'production';
const path = require('path');
// // 本地环境是否需要使用cdn
const devNeedCdn = true;
const baseUrl = require('./src/request/baseUrl');
// // cdn链接
const cdn = {
  // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
  },
  // cdn的css链接
  css: [
    // 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
  ],
  // cdn的js链接
  js: [
    'https://cdn.staticfile.org/vue/2.6.11/vue.min.js',
    'https://cdn.staticfile.org/vuex/3.0.1/vuex.min.js',
    'https://cdn.staticfile.org/vue-router/3.6.5/vue-router.min.js',
    // 'https://unpkg.com/vue-router@4.1.5/dist/vue-router.global.js',
    // 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
  ],
};
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = defineConfig({
  // 挂在NGXIN时需要
  // publicPath: process.env.NODE_ENV === 'development' ? '/' : '/station-control-center-view/',
  publicPath: process.env.NODE_ENV === 'development' ? '/' : './',
  transpileDependencies: true,
  devServer: {
    // host: 'localhost',
    host: '0.0.0.0',
    // port:8080,
    port: 3000,
    hot: true,
    open: false,
    proxy: {
      '/gateway': {
        target: baseUrl.domainUrl,
        changeOrigin: true,
        ws: false,
      },
      '/api': {
        target: baseUrl.devApiUrl,
        changeOrigin: true,
      },
      // '/api': {
      //   target: 'http://10.2.0.125:8080',
      //   //   target: baseUrl.devApiUrl,
      //   changeOrigin: true,
      // },
      '/getJsonFile': {
        target: 'https://yx-picture.obs.cn-north-4.myhuaweicloud.com/station-control/image',
        changeOrigin: true,
        ws: false,
        pathRewrite: {
          '^/getJsonFile': '',
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.resolve.symlinks(true);
    config.module.rules.delete('svg');
    config.resolve.alias.set('@', resolve('src')).set('~@', resolve('src/assets')).set('@c', resolve('src/components'));
    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include.add(path.join(__dirname, 'src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end();
    config.plugin('html').tap((args) => {
      // 生产环境或本地需要cdn时，才注入cdn
      if (isProduction || devNeedCdn) args[0].cdn = cdn;
      return args;
    });
  },
  configureWebpack: (config) => {
    config.resolve.extensions = ['.ts', '.js', '.vue', '.json'];
    if (isProduction || devNeedCdn) config.externals = cdn.externals;
    if (process.env.NODE_ENV == 'production') {
      // 为生产环境修改配置
      config.mode = 'production';
      // 将每个依赖包打包成单独的js文件
      let optimization = {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            parallel: 8, // 并行打包
            terserOptions: {
              ecma: undefined,
              warnings: false,
              parse: {},
              compress: {
                drop_debugger: false,
                drop_console: true,
              },
              mangle: true,
              module: false,
              output: null,
              toplevel: false,
              nameCache: null,
              ie8: false,
              keep_classnames: undefined,
              keep_fnames: false,
              safari10: false,
            },
          }),
        ],
      };
      Object.assign(config, {
        optimization,
      });
      // 查看打包体积
      config.plugins.push(new BundleAnalyzerPlugin());
    } else {
      // 为开发环境修改配置
      config.mode = 'development';
    }
    // 查看配置启动耗时速度
    config.plugins.push(new SpeedMeasurePlugin());

    //增加缓存
    config.cache = {
      type: 'filesystem',
      allowCollectingMemory: true,
    };
    // 配置webpack 压缩
    config.plugins.push(
      new CompressionWebpackPlugin({
        test: /\.js$|\.html$|\.css$/,
        algorithm: 'gzip',
        minRatio: 0.7,
        // 超过4kb压缩
        threshold: 500,
      }),
    );
  },
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: false,
  parallel: undefined,
  css: undefined,
  lintOnSave: false,
});
