// webpack.dev.js
// 存放 dev 配置
const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const path = require('path');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: '../dist',
    // 开启此参数需确保防火墙已经开放设置的端口
    useLocalIp: false,
    port: 5656,
    // 设置https为了在多数网站下可以调试
    https: true
  },
  stats: {
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  },
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {},
  mode: 'development',
});
