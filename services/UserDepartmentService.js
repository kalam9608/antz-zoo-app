import Configs from "../configs/Config";
import { sendPostData, sendGetRequest } from "../utils/RequestHelper";

export const createUserDepartment = async (requestObj) => {
	let url = Configs.BASE_URL + "/user/add-user-department";
	return sendPostData(url, requestObj);
};

export const editUserDepartment = async (requestObj) => {
	let url = Configs.BASE_URL + "/user/edit-user-department";
	return sendPostData(url, requestObj);
};

export const deleteUserDepartment = async (requestObj) => {
	let url = Configs.BASE_URL + "/user/delete-user-department";
	return sendPostData(url, requestObj);
};

export const getUserDepartment = async (requestObj) => {
	let url = Configs.BASE_URL + "/user/get-user-department";
	return sendGetRequest(url);
};

export const getDepartmentById = async (requestObj) => {
	let url = Configs.BASE_URL + "/masters/getdepartment/" + requestObj.itemId;
	return sendGetRequest(url);
};




