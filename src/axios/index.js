import axios from "axios";
const baseURL = require(`../apply/${process.env.FILE_NAME}/api/config.js`);
const HTTP = axios.create({
	baseURL: baseURL,
	timeout: 12 * 1000,
});

HTTP.interceptors.request.use(
	(config) => {
		//loading
		return config;
	},
	(err) => {
		return Promise.reject(err);
	}
);

HTTP.interceptors.response.use(
	(response) => {
		//loading
		return response;
	},
	(err) => {
		return Promise.reject(err);
	}
);

export const postRequest = (url, params) => {
	return HTTP({
		method: "post",
		url: url,
		data: params,
		transformRequest: [
			function(data) {
				let ret = "";
				for (let it in data) {
					ret +=
						encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
				}
				return ret;
			},
		],
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: getStore("Authorization") || "",
		},
	});
};

export const postRequests = (url, params) => {
	return HTTP({
		method: "post",
		url: url,
		data: params,
		headers: {
			Authorization: getStore("Authorization") || "",
		},
	});
};

export const getRequest = (url, params) => {
	return HTTP({
		method: "get",
		url: url,
		params: params,
		headers: {
			// Authorization: getStore("Authorization") || "",
		},
	});
};
