const DEVURL = 'http://127.0.0.1:3001'; //测试地址
const AXIOSBASEURL = '/api';
const PRODURL = 'http://www.baidu.com'; //正式地址

module.exports = process.env.NODE_ENV == 'production' ? PRODURL : DEVURL;
// module.exports = { DEVURL, PRODURL, AXIOSBASEURL };
