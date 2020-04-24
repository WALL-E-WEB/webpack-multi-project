const webpack = require("webpack");
const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
			open: true,
			//编译错误时覆盖全屏 显示错误
			overlay: true,
			port: 81,
			proxy: {
				"/api": {
					target: "http://baidu.com:3000",
					pathRewrite: { "^/api": "" },
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
