// path  config
const path = require("path");
module.exports = {
	dev: {
		SubFile: "static",
		PublicPath: "./",
	},
	build: {
		//Template for index.html
		HtmlPath: path.resolve(
			__dirname,
			`../dist/${process.env.FILE_NAME}/index.html`
		),
		RootFile: path.resolve(__dirname, `../dist/${process.env.FILE_NAME}`),
        SubFile: "static",
        // index.html 引用资源的路径
		PublicPath: "./",
	},
};
