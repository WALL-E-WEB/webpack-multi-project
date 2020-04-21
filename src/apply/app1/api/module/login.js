import { getRequest } from "@/axios/index.js";

export const wxWorkLogin = (params) => {
	//获取微校wxcode
	return getRequest("/authenticationSchoolBus/login", params);
};
