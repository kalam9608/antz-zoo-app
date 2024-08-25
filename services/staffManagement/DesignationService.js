import Configs from "../../configs/Config";
import { sendPostData, sendGetRequest } from "../../utils/RequestHelper";

export const createDesignation = async (requestObj) => {
	let url = Configs.BASE_URL + "/masters/designation";
	return sendPostData(url, requestObj);
};
export const GetDesignation = async () => {
	let url = Configs.BASE_URL + "/masters/designations";
	return sendGetRequest(url);
}
export const GetListDesignation = async ({itemId}) => {
	let url = Configs.BASE_URL + "/masters/getdesignation/" + itemId.itemId;
	return sendGetRequest(url, itemId);
}
