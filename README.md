webpack4 + vue 多应用、多页面框架

```json
环境:
"webpack": "^4.43.0",
"webpack-cli": "^3.3.11",

node v12.16.1
```

目录:

![image-20200424173054291](https://github.com/WALL-E-WEB/webpack-multi-project/blob/master/image-20200424173054291.png)

package.json:

```json
{
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev:app1": "cross-env FILE_NAME=app1 webpack-dev-server --env.NODE_ENV=development --config build/webpack.dev.conf.js",
    "dev:app2": "cross-env FILE_NAME=app2 webpack-dev-server --env.NODE_ENV=development --config build/webpack.dev.conf.js",
    "build:app1": "cross-env FILE_NAME=app1 webpack --env.NODE_ENV=production --config build/webpack.prod.conf.js",
    "build:app2": "cross-env FILE_NAME=app2 webpack --env.NODE_ENV=production --config build/webpack.prod.conf.js"
  },
}
```

多应用思路:

```js
1.通过命令行 声明 指定打包的文件名变量 和 环境;
2.根据文件名变量 指定打包哪一个应用 和 输出文件的文件夹名称;
3.根据环境变量 指定http请求的基地址;
```



# 一、开发环境配置-dev

```js
√ 跨域;
√ 路径别名@;
√ 不同环境http基地址;
√ 多页面应用;
√ 持久缓存contenthash；
√ restful风格axios封装;
√ babel7 配置；
```



```js
const webpack = require("webpack");
const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 请求后端的地址
let url = require(`../src/apply/${process.env.FILE_NAME}/api/config.js`);
module.exports = (env) => {
	console.log(env);
	return {
		mode: "development",
		//是否显示源码
		devtool: "inline-source-map",
		devServer: {
			host: "0.0.0.0",
			hot: true,
			// compress:true,
			//不显示页面顶部的 app ready 标栏
			inline: true,
			open: false,
			//编译错误时覆盖全屏 显示错误
			overlay: true,
			port: 81,
			proxy: {
				"/api": {
					target: url,
					pathRewrite: { "^/api": "" },
                    // axios 的 baseurl 设置为'/api'
				},
			},
		},
		
		// stats: {
		// 	// One of the two if I remember right
		// 	entrypoints: false,
		// 	children: false,
		// 	colors: true
		// },
		//显示信息
		stats:'errors-only',
		entry: `./src/apply/${process.env.FILE_NAME}/main.js`,
		output: {
			filename: "[name].js",
			// path: path.resolve(__dirname, "../dist", `./${process.env.FILE_NAME}`),
			publicPath: "/",
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: "vue-loader",
				},
				{
					test: /\.css$/,
					use: [
						"vue-style-loader",
						{
							loader: "css-loader",
							options: { importLoaders: 1 },
						},
						"postcss-loader",
					],
				},
				{
					test: /\.js$/,
					loader: "babel-loader",
					exclude: (file) =>
						/node_modules/.test(file) && !/\.vue\.js/.test(file),
				},
				{
					test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
					loader: "url-loader",
					options: {
						limit: 1000,
						name: "static/img/[name].[hash:7].[ext]",
						// 版本
						esModule: false,
					},
				},
				{
					test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
					loader: "url-loader",
					options: {
						limit: 10000,
						name: "static/media/[name].[hash:7].[ext]",
					},
				},
				{
					test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
					loader: "url-loader",
					options: {
						limit: 10000,
						name: "static/fonts/[name].[hash:7].[ext]",
					},
				},
			],
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new VueLoaderPlugin(),
			new webpack.DefinePlugin({
				"process.env.FILE_NAME": JSON.stringify(process.env.FILE_NAME),
				"process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
			}),
			new HtmlWebpackPlugin({
				filename: "index.html",
				template: path.resolve(
					__dirname,
					`../src/apply/${process.env.FILE_NAME}/${process.env.FILE_NAME}.html`
				),
			}),
		],
		resolve: {
			alias: {
				//配置别名
				"@": path.resolve(__dirname, "../src"),
			},
			//配置拓展文件 /src/router  === /src/router/index.js
			extensions: [".js", ".vue", ".json"],
		},
	};
};

```



# 二、生产环境配置-prod

```js
√ css分包 压缩 补全;
√ js 分包 chunk;
√ gzip;
√ 持久缓存;
√ 打包分析;
√ 打包时间;
```



## 1.基础配置

## 	1.1命令行

```js
package.json

"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build:app1": "cross-env FILE_NAME=app1 webpack --env.NODE_ENV=production --config build/webpack.prod.conf.js",
    "build:app2": "cross-env FILE_NAME=app2 webpack --env.NODE_ENV=production --config build/webpack.prod.conf.js"
  },
```

cross-env 指定变量

```js
//现在已经可以不需要这样声明打包的文件名了
cross-env FILE_NAME=app1  

声明变量FILE_NAME=app1 指定文件名

下载:npm install --save-dev cross-env

npm run build:app1 时打包app1应用
npm run build:app2 时打包app2应用
```

--env.NODE_ENV=production

```js
https://webpack.js.org/guides/environment-variables/#root
指定环境名
配置文件中使用function 写法可获得该参数
const config = (env) => {
    console.log(process.env.NODE_ENV) //production
}
module.exports =config;
```

--config build/webpack.prod.conf.js

```js
指定配置文件
```

设置全局变量名

```js
const webpack = require("webpack");
const config = (env) => {
return{
 plugins: [
	new webpack.DefinePlugin({
    //获取COSS-env 设置的变量方式
	"process.env.FILE_NAME": JSON.stringify(process.env.FILE_NAME),
    //该变量用于应用中api>config.sj中判断不同环境的请求地址
	"process.env.NODE_ENV": JSON.stringify(env.NODE_ENV)
	}),
 ]
}
}
module.exports = config;
```

## 1.2 webpack.prod.conf.js

```js
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
//---------------------vue-loader------------------------------
const VueLoaderPlugin = require("vue-loader/lib/plugin");
//---------------------打包分析------------------------------
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
	.BundleAnalyzerPlugin;

//-------------build清除dist目录---------------------------------------
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
//-------------css分块---------------------------------------
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// -------------css压缩----------------------------------------------
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// --------------打包时间--------------------------------------------
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
// --------------------gzip压缩--------------------
const CompressionPlugin = require("compression-webpack-plugin");

const config = (env) => {
	console.log(env);//{NODE_ENV: 'production'}
	console.log(process.env.FILE_NAME);//app1
	return {
		entry: `./src/apply/${process.env.FILE_NAME}/main.js`,
		output: {
			path: path.resolve(__dirname, "../dist", `./${process.env.FILE_NAME}`),
			filename: "static/js/[name].[contenthash].js",
			publicPath: "./",
			//懒加载模块 或 分块模块 的 输出路径 以及命名 不写则默认filename路径 name为vendors
			chunkFilename: "static/js/[name].[contenthash].js",
		},
		mode: "production",
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: "vue-loader",
				},
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
				{
					test: /\.js$/,
					// loader: "babel-loader",
					use: ["babel-loader"],
					// exclude: (file) =>
					// 	/node_modules/.test(file) && !/\.vue\.js/.test(file),
					include: [path.resolve(__dirname, "src")],
				},
				{
					test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
					loader: "url-loader",
					options: {
						limit: 1000,
						name: "static/img/[name].[hash:7].[ext]",
						// 版本
						esModule: false,
					},
				},
				{
					test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
					loader: "url-loader",
					options: {
						limit: 10000,
						name: "static/media/[name].[hash:7].[ext]",
					},
				},
				{
					test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
					loader: "url-loader",
					options: {
						limit: 10000,
						name: "static/fonts/[name].[hash:7].[ext]",
					},
				},
			],
		},
		plugins: [
			//开启gzip压缩
			// new CompressionPlugin({
			// 	algorithm: "gzip",
			// 	test: /\.js$|\.css$/,
			// }),
			//打包分析
			// new BundleAnalyzerPlugin(),
			new CleanWebpackPlugin(),
			new VueLoaderPlugin(),
			//设置js全局变量
			new webpack.DefinePlugin({
				"process.env.NODE_ENV": env.NODE_ENV,
				"process.env.FILE_NAME": JSON.stringify(process.env.FILE_NAME),
			}),
			//html文件
			new HtmlWebpackPlugin({
				title: "瓦力",
				filename: "index.html",
				template: path.resolve(
					__dirname,
					`../src/apply/${process.env.FILE_NAME}/${process.env.FILE_NAME}.html`
				),
			}),
			//css分块
			new MiniCssExtractPlugin({
				filename: "static/css/[name].[contenthash].css",
				chunkFilename: "static/css/[name].[contenthash].css",
			}),
			//以路经为id
			new webpack.HashedModuleIdsPlugin({
				context: __dirname,
				hashDigestLength: 10,
			}),

			//设定chunk name
			new webpack.NamedChunksPlugin(
				(chunk) =>
					chunk.name || Array.from(chunk.modulesIterable, (m) => m.id).join("_")
			),
		],
		resolve: {
			alias: {
				//配置别名
				"@": path.resolve(__dirname, "../src"),
			},
			//配置拓展文件 /src/router  === /src/router/index.js
			extensions: [".js", ".vue", ".json"],
		},
		optimization: {
			splitChunks: {
				chunks: "all",
				automaticNameDelimiter: "~",
				minSize: 30000,
				cacheGroups: {
					vue: {
						test: /[\\/]node_modules[\\/]vue[\\/]/,
						name: "vue",
						chunks: "all",
					},
				},
			},
			minimize: true,
			// css压缩
			minimizer: [
				new TerserPlugin({
					cache: true,
					parallel: true,
					// 不生成txt文档
					extractComments: false,
					// terserOptions: {
					// 	output: {
					// 		comments: false,
					// 	},
					// },
				}),
				new OptimizeCSSAssetsPlugin({}),
			],
			// 将包含chunks映射关系单独提出出来,避免main.js hash变动
			runtimeChunk: {
				name: (entrypoint) => `runtime~${entrypoint.name}`,
			},
		},
	};
};
// module.exports = config;

// 打包时间分析
module.exports = smp.wrap(config);

```



## 2.打包优化

### 2.1 自带优化

mode为production模式时自带优化

- tree shaking：打包时移除未引用的代码(dead-code)；
- scope hoisting： 打散的模块合并到一个函数中去；
- 对代码进行压缩、混淆；
- 

### 2.2 CSS

#### css补全

postcss-loader 和autoprefixer

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
		require("autoprefixer")({
			overrideBrowserslist: [
				"Android 4.1",
				"iOS 7.1",
				"Chrome > 31",
				"ff > 31",
				"ie >= 8",
				"last 3 iOS versions",
			],grid:true
		}),
	],
};
```

#### 	css分块

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

  

- 使用前后区别:

  ![image-20200422150952677](https://github.com/WALL-E-WEB/webpack-multi-project/blob/master/image-20200422150952677.png)



#### 	css压缩

- 官方文档地址:`https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production`

- 依靠两个插件:


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
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css',
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

  

### 2.3 js分割``SplitChunksPlugin``

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



### 2.4 持久缓存优化

​	**目标**:每次打包, 保证未改变内容的文件的hash保持不变;

#### 	1、 hash、chunkhash、contenthash区别

- hash

```js

`hash` 和每次 `build`有关，
打包后所有文件的hash都一样；
没有任何改变的情况下，每次编译出来的 `hash`都是一样的；


但当你改变了任何一点东西，所有的`hash`全都会发生改变。

```

![image-20200424104539602](https://github.com/WALL-E-WEB/webpack-multi-project/blob/master/image-20200424104539602.png)

------

- chunkhash

```js


`chunkhash`是和`chunk`有关;
根据具体每一个模块文件自己的的内容包括它的依赖计算所得的;
某个文件的改动只会影响它本身和所引入的文件`hash`，不会影响其它文件。

同一类chunk 有相同的hash.

比如：main.js中引入base.css;
当你改main.js或改base.css时:main 和 base 的hash都会改变;
```

![image-20200424105511640](https://github.com/WALL-E-WEB/webpack-multi-project/blob/master/image-20200424105511640.png)

------

- contenthash

```js


它的出现主要是为了解决，让`css`文件不受`js`文件的影响。比如`foo.css`被`foo.js`引用了，所以它们共用相同的`chunkhash`值。但这样子是有问题的，如果`foo.js`修改了代码，`css`文件就算内容没有任何改变，由于是该模块的 `hash` 发生了改变，其`css`文件的`hash`也会随之改变。

每个文件的hash都不一样

比如：main.js中引入base.css;
当你改main.js时:base 的hash不会都会改变;
```

![image-20200424110619538](https://github.com/WALL-E-WEB/webpack-multi-project/blob/master/image-20200424110619538.png)

**问题:**当有增加异步模块时,因chunks的Id数字自增 会导致未改变文件的hash值改变;

![image-20200424114026021](https://github.com/WALL-E-WEB/webpack-multi-project/blob/master/image-20200424114026021.png)

需要webpack内置插件NamedChunksPlugin 和 HashedModuleIdsPlugin 解决:

```js
const webpack = require("webpack");

plugin:{
new webpack.HashedModuleIdsPlugin({
				context: __dirname,
				hashDigestLength: 10,
			}),
new webpack.NamedChunksPlugin(
	(chunk) =>
		chunk.name || Array.from(chunk.modulesIterable, (m) => m.id).join("_")
),
}
```

![image-20200424121335154](https://github.com/WALL-E-WEB/webpack-multi-project/blob/master/image-20200424121335154.png)



#### 2、 HashedModuleIdsPlugin 和 NamedChunksPlugin 区别



#### 3、runtimeChunk

```js
作用:将包含chunks映射关系单独提出出来,避免main.js hash变动
使用:
optimization:{
	runtimeChunk: {
		name: (entrypoint) => `runtime~${entrypoint.name}`,
	},
}
```

# 三、babel7 配置

## 1. babel/preset-env

- 安装:

  ```js
  npm install --save-dev @babel/preset-env
  ```

  

## 2.core-js@3

- 安装:

  ```js
  npm i --save core-js@3 
  ```

  

## 3.babel/plugin-transform-runtime

- 安装:

  ```
  npm install --save-dev @babel/plugin-transform-runtime
  ```

  

## 4.@babel/runtime

- 安装:https://babeljs.io/docs/en/babel-plugin-transform-runtime#docsNav

  ```js
  根据corejs选项选定:
  npm install --save @babel/runtime			// corejs: false
  npm install --save @babel/runtime-corejs2	// corejs: 2
  npm install --save @babel/runtime-corejs3 	// corejs: 3
  ```

  

## 5.webpack配置babel

```js
// webpack.prod.conf.js
{	.....
	module:{
		rules:[
            ....
		{
          test: /\.js$/,
          use: 'babel-loader',
          exclude: /(node_modules)/
        },
		]
	}
}
```

```js
// babel.config.js
module.exports = function(api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: {
          version: 3,
          proposals: true
        },
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not ie<= 8']
        }
      }
    ]
  ];
  const plugins = [['@babel/plugin-transform-runtime', { corejs: 3 }]];
  return {
    presets,
    plugins
  };
};

```



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

  

## webpack.definePlugin

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

  

# loader说明:

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



## webpack-dev-server

- 作用:实时重新加载

- 安装:

  ```
  npm install --save-dev webpack-dev-server
  ```

- 使用:

  ```
  
  ```

  



# 打包分析

### 打包时间分析

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

