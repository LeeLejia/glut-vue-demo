// webpack.dev.js
// 存放 dev 配置
const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const path = require('path');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: '../dist',
    useLocalIp: true,
    port: 5656
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
