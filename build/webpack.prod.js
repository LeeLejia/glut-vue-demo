const path = require('path')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const merge = require('webpack-merge');
const common = require('./webpack.base.js');

module.exports = merge(common, {
  module: {},
  plugins: [],
  mode: 'production',
  output: {
    filename: 'prod-build.js', //contenthash 若文件内容无变化，则contenthash 名称不变
    path: path.resolve(__dirname, '../dist')
  },
  optimization: {
    minimizer: [
      // 压缩JS
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            // warnings: false, // 去除警告
            drop_debugger: true, // 去除debugger
            drop_console: false // 去除console.log
          },
        },
        cache: true, // 开启缓存
        parallel: true, // 平行压缩
        sourceMap: false // set to true if you want JS source maps
      }),
      // 压缩css
      new OptimizeCSSAssetsPlugin({})
    ]
  },
});