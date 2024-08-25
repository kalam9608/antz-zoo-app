import Configs from "../configs/Config";
import { sendPostData, sendGetRequest } from "../utils/RequestHelper";

export const addHatchedStatus = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/hatchedStatus";
  return sendPostData(url, requestObj);
};

export const listAllHatchedStatus = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/hatchedStatus";
  return sendGetRequest(url, requestObj);
};

export const getHatchedStatus = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/hatchedStatus/" + requestObj.itemId;
  return sendGetRequest(url, requestObj);
};
