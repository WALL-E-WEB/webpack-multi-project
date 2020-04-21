const  TESTURL = "198.0.0.1:80" //测试地址

const  PRODURL = "http://www.baidu.com" //正式地址

if(process.env.NODE_ENV === 'production'){
    //axios.baseurl = PRODURL
}else{
    //axios.baseurl = TESTURL
}