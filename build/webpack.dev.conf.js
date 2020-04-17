const webpack = require("webpack");
const merge = require("webpack-merge");
const path = require("path");
const config = require("../config/prod.env");
const baseconfig = require("./webpack.base.conf");

module.exports = merge(baseconfig, {
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
		port: 80,
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				pathRewrite: { "^/api": "" },
			},
		},
	},
	plugins: [new webpack.HotModuleReplacementPlugin()],
	stats: {
		// One of the two if I remember right
		entrypoints: false,
		children: false,
	},
});
