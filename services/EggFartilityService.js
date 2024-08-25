import Configs from "../configs/Config";
import { sendPostData, sendGetRequest } from "../utils/RequestHelper";

export const createEggFertility = async (requestObj) => {
	let url = Configs.BASE_URL + "/masters/eggFertilityType";
	return sendPostData(url, requestObj);
};

export const getEggFertility = async () => {
	let url = Configs.BASE_URL + "/masters/eggFertilityType";
	return sendGetRequest(url);
};

export const getEggFertilityByID = async (id) => {
	let url = Configs.BASE_URL + "/masters/eggFertilityType/" + id;
	return sendGetRequest(url);
  };
