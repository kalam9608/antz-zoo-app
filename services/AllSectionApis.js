 import Configs from "../configs/Config";
import { sendPostData, sendGetRequest } from "../utils/RequestHelper";

export const GetSectionData = async () => {
	let url = Configs.BASE_URL + "user/get-user-section";
	return sendGetRequest(url);
}

export const CreateSectionData = async (requestObj) => {
	let url = Configs.BASE_URL + "/user/add-user-section" ;
	return sendPostData(url, requestObj);
}

export const EditSectionData = async (requestObj) => {
	let url = Configs.BASE_URL + "user/edit-user-section" ;
	return sendPostData(url, requestObj);
}

export const deleteSectionData = async (requestObj) => {
	let url = Configs.BASE_URL + "/user/delete-user-section";
	return sendPostData(url, requestObj);
}