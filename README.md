# 插件说明:

## html

- 作用:

- 安装:

  ```js
  npm install --save-dev html-webpack-plugin
  ```

- 使用:

  ```js
  https://www.jianshu.com/p/08a60756ffda
  const HtmlWebpackPlugin = require('html-webpack-plugin');
    plugins: [
      new HtmlWebpackPlugin({ // 打包输出HTML
        title: 'Hello World app',
        minify: { // 压缩HTML文件
          removeComments: true, // 移除HTML中的注释
          collapseWhitespace: true, // 删除空白符与换行符
          minifyCSS: true// 压缩内联css
        },
        filename: 'index.html', //输出文件名
        template: 'index.html', //模板来源
        inject:true
      }),
    ]
  ```

  

## cross-env

- 作用:用于命令行中指定变量.多用于指定环境变量或文件名.

- 安装:

  ```js
  npm install --save-dev cross-env
  ```

- 使用:

  ```json
  package.json
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack-dev-server",
    "build": "cross-env FILE_NAME=production webpack",
  }
  ```

  ```js
  process.env.FILE_NAME
  ```

  

# webpack.definePlugin

- 作用:	用于创建编译时 “配置的全局常量” 以方便进行 环境转换,或指定文件名.  用于把cross-env中的变量变成全局常量.

- 安装:webpack自带

  ```js
  const webpack = require('webpack')
  ```

- 使用:

  ```js
  const webpack = require('webpack')
  module.exports = {
      plugins:[
          new webpack.DefinePlugin({
              'process.env': ENV,
              'process.env.FILE_NAME': JSON.stringify(process.env.FILE_NAME),
            })
      ]
  };
  ```

  

# merge

- 作用:用于合并webpack配置;

- 安装:

  ```js
  npm install --save-dev webpack-merge
  ```

- 使用:

  ```js
  const merge = require('webpack-merge')
  
  module.exports = merge(baseconfig,{
  
  })
  ```

  

# loader

## file-loader 和url-loader

- 作用:	处理图片打包后路径url-loader可以把图片打包成base64

- 安装:

  ```js
  npm install --save-dev file-loader
  npm install --save-dev url-loader //推荐
  ```

- 使用:

- ```js
  module: {
      rules: [
  		       {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          }
        }   
  ]}
  ```

  

## vue-loader

```
npm install -D vue-loader vue-template-compiler
```

# CSS

## postcss-loader 和autoprefixer

安装:

```js
npm i -D postcss-loader autoprefixer
```

config

```json
{
				test: /\.css$/,
				use: [
					'vue-style-loader',
					{
					  loader: 'css-loader',
					  options: { importLoaders: 1 }
					},
					'postcss-loader'
				],
			},
```

更目录postcss.config.js

```js
module.exports = {
    plugins: [
        require('autoprefixer')({
            "browsers": [
                "defaults",
                "not ie < 11",
                "last 2 versions",
                "> 1%",
                "iOS 7",
                "last 3 iOS versions"
            ]
        })
    ]
};
```

## css分块

```js
npm i -D mini-css-extract-plugin`
```

- 使用:

  ```js
  const MiniCssExtractPlugin = require("mini-css-extract-plugin");
  
  module: {
  		rules: [
              {
  				test: /\.css$/,
  				use: [
  					ENV.NODE_ENV == "production"
                      #1//
  						? MiniCssExtractPlugin.loader
  						: "vue-style-loader",
  					{
  						loader: "css-loader",
  						options: { importLoaders: 1 },
  					},
  					"postcss-loader",
  				],
  			},
              ]
  }
  plugins: [
  		new MiniCssExtractPlugin({
              filename: "static/css/[name].[hash].css",
              chunkFilename:"[id].css",
  		})
  	],
  ```

- 使用报错:

  ```js
  No module factory available for dependency type: CssDependency
  
  MiniCssExtractPlugin.loader 改为生产环境使用 如#1
  ```

- 使用前后区别:

  ![image-20200422150952677](E:%5CWall-E%5Cmy-webpack%5Cimage-20200422150952677.png)

## webpack-dev-server

- 作用:实时重新加载

- 安装:

  ```
  npm install --save-dev webpack-dev-server
  ```

- 使用:

  ```
  
  ```

  





# build优化部分

## 1.mode为production模式时自带优化

- tree shaking：打包时移除未引用的代码(dead-code)；
- scope hoisting： 打散的模块合并到一个函数中去；
- 对代码进行压缩、混淆；

## 2.CSS压缩

- 官方文档地址:`https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production`

- 依靠两个插件:

- ![img](https://user-gold-cdn.xitu.io/2018/7/30/164e93dc299d7062?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

  ```js
  //将css压缩 并优化
  npm install --save-dev optimize-css-assets-webpack-plugin
  
  
  npm install terser-webpack-plugin --save-dev
  ```

  ```js
  porduction
  //css分块插件 index.html中head标签中的style样式 改为 <link>标签导入
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  
  const TerserPlugin = require('terser-webpack-plugin');
  const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
  
  module.exports = {
    optimization: {
      minimizer: [new TerserPlugin({}), new 	OptimizeCSSAssetsPlugin({})],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
    ],
    module: {
      rules: [
        {
  			test: /\.css$/,
  			use: [
  				MiniCssExtractPlugin.loader,
  				{
  					loader: "css-loader",
  					options: { importLoaders: 1 },
  				},
  				"postcss-loader",
  			],
  		},
      ],
    },
  };
  ```

  

## 3.js分割``SplitChunksPlugin``

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async', // 只对异步加载的模块进行拆分，可选值还有all | initial
      minSize: 30000, // 模块最少大于30KB才拆分
      maxSize: 0,  // 模块大小无上限，只要大于30KB都拆分
      minChunks: 1, // 模块最少引用一次才会被拆分
      maxAsyncRequests: 5, // 异步加载时同时发送的请求数量最大不能超过5,超过5的部分不拆分
      maxInitialRequests: 3, // 页面初始化时同时发送的请求数量最大不能超过3,超过3的部分不拆分
      automaticNameDelimiter: '~', // 默认的连接符
      name: true, // 拆分的chunk名,设为true表示根据模块名和CacheGroup的key来自动生成,使用上面连接符连接
      cacheGroups: { // 缓存组配置,上面配置读取完成后进行拆分,如果需要把多个模块拆分到一个文件,就需要缓存,所以命名为缓存组
        vendors: { // 自定义缓存组名
          test: /[\\/]node_modules[\\/]/, // 检查node_modules目录,只要模块在该目录下就使用上面配置拆分到这个组
          priority: -10 // 权重-10,决定了哪个组优先匹配,例如node_modules下有个模块要拆分,同时满足vendors和default组,此时就会分到vendors组,因为-10 > -20
        },
        default: { // 默认缓存组名
          minChunks: 2, // 最少引用两次才会被拆分
          priority: -20, // 权重-20
          reuseExistingChunk: true // 如果主入口中引入了两个模块,其中一个正好也引用了后一个,就会直接复用,无需引用两次
        }
      }
    }
  }
};
```

# 打包分析

## 打包时间分析

安装:

```
npm install --save-dev speed-measure-webpack-plugin
```

```js
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const config = {
}
module.exports = smp.wrap(config);
```

### 打包分析

安装:

```js
npm install --save-dev webpack-bundle-analyzer
```

```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}

运行打包后访问：127.0.0.1：8888
```

