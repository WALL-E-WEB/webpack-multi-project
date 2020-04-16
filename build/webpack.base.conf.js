const webpack = require("webpack");
const path = require("path");
const ENV = require("../config/prod.env.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: `./src/apply/${process.env.FILE_NAME}/main.js`,
	output: {
		path: path.resolve(__dirname, "../dist", `./${process.env.FILE_NAME}`),
		filename: "[name].js",
		publicPath: ENV.NODE_ENV == "production" ? "./" : "/",
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
			{
				test: /\.js$/,
				loader: "babel-loader",
				exclude: (file) => /node_modules/.test(file) && !/\.vue\.js/.test(file),
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
		new VueLoaderPlugin(),
		new webpack.DefinePlugin({
			"process.env": ENV,
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
	],
};
