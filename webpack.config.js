const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'src/index.tsx'), // 入口文件
   // 打包文件出口
  output: {
    filename: 'static/js/[name].js', // 每个输出js的名称
    path: path.join(__dirname, 'dist'), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: process.env.NODE_ENV == 'development' ? '/' : './' // 打包后文件的公共前缀路径
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true, // 开启压缩
    port: 9000,
    historyApiFallback: true, // 解决createBrowserRouter路由手动刷新404问题
    open: true, // 启动后打开浏览器
  },
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/, // 匹配.ts, tsx文件
        use: {
          loader: 'babel-loader',
          options: {
            // 预设执行顺序由右往左,所以先处理ts,再处理jsx
            presets: [
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /.(ts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            // 执行顺序由右往左,所以先处理ts,再处理jsx,最后再试一下babel转换为低版本语法
            presets: [
              [
                "@babel/preset-env",
                {
                  // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
                  // "targets": {
                  //  "chrome": 35,
                  //  "ie": 9
                  // },
                  "useBuiltIns": "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
                  "corejs": 3, // 配置使用core-js低版本
                }
              ],
              [
                '@babel/preset-react',
                {
                  runtime: 'automatic', // fix: react18不需要每个页面引入React，但是运行起来会报错
                }
              ],
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts'],
  },
  plugins: [
    new CopyWebpackPlugin({
			patterns: [{
				from:  path.resolve(__dirname, "public/favicon.ico"),//当前工作路径是在dist文件夹内，搜易这里的from就是项目目录/public文件夹内。（dist和public是同级的）
				to: './',//放到output文件夹下，也就是当前工作文件夹dist内
				globOptions: {
					dot: true,
					gitignore: true
				}
			}]
		}),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'), // 模板取定义root节点的模板
      inject: true, // 自动注入静态资源
    }),
    new webpack.DefinePlugin({
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV)
    }),
  ] 
}