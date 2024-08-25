import Configs from "../configs/Config";
import { sendGetRequest, sendPostData } from "../utils/RequestHelper";

export const getMortalityStatsCount = async (requestObj) => {
  let url = Configs.BASE_URL + "zoos/zoo-wise-mortality-count";
  return sendGetRequest(url, requestObj);
};

export const getMortalityListTypeWise = async (requestObj) => {
  let url = Configs.BASE_URL + "animal/get-mortality-listing-type-wise";
  return sendGetRequest(url, requestObj);
};

export const getMortalitySpeciesCount = async (requestObj) => {
  let url = Configs.BASE_URL + "zoos/zoo-wise-mortality-count";
  return sendGetRequest(url, requestObj);
};
// ?purpose=animals&taxonomy_id=76041&reason_id=1' 
export const getMortalitySpeciesWiseList = async (requestObj) => {
  let url = Configs.BASE_URL + "mortality-species-wise-list";
  return sendGetRequest(url, requestObj);
};

export const getMortalityResonWiseList = async (requestObj) => {
  let url = Configs.BASE_URL + "mortality-reason-wise-list";
  return sendGetRequest(url, requestObj);
};


