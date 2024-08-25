import Configs from "../configs/Config";
import { sendPostData, sendGetRequest } from "../utils/RequestHelper";

export const getFeedUOM = async () => {
	let url = Configs.BASE_URL + "masters/feeduom";
	return sendGetRequest(url);
};

export const getFeedBy = async () => {
	let url = Configs.BASE_URL + "user/get-users";
	return sendGetRequest(url);
};

export const createFeedLog = async (requestObj) => {
	let url = Configs.BASE_URL + "feed/createfeedlog";
	return sendPostData(url,requestObj);
};
