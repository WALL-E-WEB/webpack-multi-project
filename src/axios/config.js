import axios from 'axios';

const baseURL =
  process.env.NODE_ENV == 'production'
    ? require(`../apply/${process.env.FILE_NAME}/api/config.js`)
    : '/api';

/**
 *  Content-Type
 */
const ContentType = {
  urlencoded: 'application/x-www-form-urlencoded;charset=utf-8',
  formData: 'multipart/form-data;charset=utf-8',
  json: 'application/json;charset=utf-8',
  stream: 'application/octet-stream'
};

const codeMsg = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '请求错误(400)。',
  401: '未授权，请重新登录(401)。',
  403: '拒绝访问(403)。',
  404: '请求出错(404)。',
  408: '请求超时(408)。',
  500: '服务器错误(500)。',
  502: '网络错误(502)。',
  503: '服务不可用(503)。',
  504: '网络超时(504)。'
};

/**
 *  错误处理
 */
const handleError = (error) => {
  const { response } = error;
  const errorText =
    response && response.code
      ? codeMsg[response.code] || response.message
      : '网络异常';

  // ui提示

  return Promise.reject(error);
};

const HTTP = axios.create({
  baseURL: baseURL,
  //   baseURL: process.env.BASEURL,
  timeout: 12 * 1000
});

/**
 *  请求拦截
 */
HTTP.interceptors.request.use((config) => {
  //loading
  return config;
}, handleError);

/**
 *  响应拦截
 */
HTTP.interceptors.response.use((response) => {
  // rm loading
  if (response.status === 200) {
    return response;
  } else {
    // 出错,统一提示错误
    return Promise.reject('错误');
  }
}, handleError);

export { HTTP, ContentType };
