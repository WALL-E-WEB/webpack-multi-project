const webpack = require("webpack");
const merge = require("webpack-merge");
const path = require("path");
const config = require("../config/prod.env");
const baseconfig = require("./webpack.base.conf");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');


module.exports = merge(baseconfig, {
	mode: 'production',
	output: {
		filename: "static/js/[name].bundle.js",
		path: path.resolve(__dirname, "../dist", `./${process.env.FILE_NAME}`),
		publicPath: "./",
	},
	plugins: [
        new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
            filename: "static/css/[name].[hash].css",
            chunkFilename:"[id].css",
		})
	],
});
