import Configs from "../configs/Config";
import { sendPostData, sendGetRequest } from "../utils/RequestHelper";

export const idproof = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/clientidproof";
  return sendPostData(url, requestObj);
};

export const listIdProof = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/clientidproofs";
  return sendGetRequest(url, requestObj);
};

export const getIdProof = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/getclientidproof/" + requestObj.itemId;
  return sendGetRequest(url, requestObj);
};