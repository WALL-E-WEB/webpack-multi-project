const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
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
// --------------------
const CompressionPlugin = require("compression-webpack-plugin");

const config = (env) => {
	console.log(env);
	console.log(process.env.FILE_NAME);
	return {
		entry: `./src/apply/${process.env.FILE_NAME}/main.js`,
		output: {
			path: path.resolve(__dirname, "../dist", `./${process.env.FILE_NAME}`),
			filename: "static/js/[name].[chunkhash].js",
			publicPath: "./",
			//懒加载模块 或 分块模块 的 输出路径 以及命名 不写则默认filename路径 name为vendors
			chunkFilename: "static/js/[name].[chunkhash].js",
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
			new CompressionPlugin({
				algorithm: "gzip",
				test: /\.js$|\.css$/,
			}),
			//打包分析
			// new BundleAnalyzerPlugin(),
			new CleanWebpackPlugin(),
			new VueLoaderPlugin(),
			new webpack.DefinePlugin({
				// "process.env": ENV,
				"process.env.FILE_NAME": JSON.stringify(process.env.FILE_NAME),
			}),
			new HtmlWebpackPlugin({
				title: "瓦力",
				filename: "index.html",
				template: path.resolve(
					__dirname,
					`../src/apply/${process.env.FILE_NAME}/${process.env.FILE_NAME}.html`
				),
			}),
			new MiniCssExtractPlugin({
				filename: "static/css/[name].[contenthash].css",
				chunkFilename: "static/css/[name].[contenthash].css",
			}),
			new webpack.HashedModuleIdsPlugin({
				context: __dirname,
				hashDigestLength: 10,
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
			//相关引用不改变hash,保持长缓存
			runtimeChunk: {
				name: (entrypoint) => `runtime~${entrypoint.name}`,
			},
		},
	};
};

module.exports = smp.wrap(config);
