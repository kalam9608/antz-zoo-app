import Configs from "../configs/Config";
import { sendPostData, sendGetRequest } from "../utils/RequestHelper";

export const createDepartment = async (requestObj) => {
	let url = Configs.BASE_URL + "/masters/department";
	return sendPostData(url, requestObj);
};

export const getDepartmentData = async (requestObj) => {
	let url = Configs.BASE_URL + "/masters/departments";
	return sendGetRequest(url);
};

export const getDepartmentById = async (requestObj) => {
	let url = Configs.BASE_URL + "/masters/getdepartment/" + requestObj.itemId;
	return sendGetRequest(url);
};
