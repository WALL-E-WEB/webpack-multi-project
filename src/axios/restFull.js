import { HTTP, ContentType } from './config';

class API {
  constructor(url) {
    this.url = url;
  }

  get(params) {
    return HTTP({
      method: 'get',
      url: this.url,
      data: params,
      headers: {
        Authorization: window.localStorage.getItem('Authorization') || '',
        'Content-Type': ContentType[ContentType.json]
      }
    });
  }
  post({ data, params = null, type = ContentType.json }) {
    return HTTP({
      method: 'post',
      url: this.url,
      data: data,
      params: params,
      headers: {
        Authorization: window.localStorage.getItem('Authorization') || '',
        'Content-Type': ContentType[type]
      }
    });
  }
  put() {
    return 'put';
  }
  delete() {
    return 'delete';
  }
}

export default API;
