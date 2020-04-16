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

  

## webpack-dev-server

- 作用:实时重新加载

- 安装:

  ```
  npm install --save-dev webpack-dev-server
  ```

- 使用:

  ```
  
  ```

  

