const TESTURL = "http://192.168.0.112:9037"; //测试地址
// const TESTURL = "https://wxapi.bdxhtx.com"; //测试地址

const PRODURL = "http://www.baidu.com"; //正式地址



module.exports = process.env.NODE_ENV == "production" ? PRODURL : TESTURL;
