import Configs from "../configs/Config";
import { sendPostData, sendGetRequest } from "../utils/RequestHelper";

export const getHomeStat = async (zoo_id) => {
  let url = Configs.BASE_URL + `zoo/home/${zoo_id}`;
  return sendGetRequest(url);
};

//Based on Post it will return the hierarchy data
export const getHierarchy = async (requestObj) => {
  let url = Configs.BASE_URL + "collection/stats";
  return sendPostData(url, requestObj);
};
// insihts
export const getInsightsData = async (requestObj) => {
  let url = Configs.BASE_URL + "collection/insights";
  return sendPostData(url, requestObj);
};


//for insight slider species count 
export const getInsightsDatacount = async (requestObj) => {
  let url = Configs.BASE_URL + "collection/insights-count";
  return sendGetRequest(url, requestObj);
};

export const getSpeciesAnimals = async (requestObj) => {
  let url = Configs.BASE_URL + "collection/species/animals";
  return sendPostData(url, requestObj);
};

export const getMortalityListingByReasons = async (requestObj) => {
  let url = Configs.BASE_URL + "animal/mortality/reason/listing";
  return sendPostData(url, requestObj);
};

export const getMortalityAnimalListByManner = async (requestObj) => {
  let url = Configs.BASE_URL + "animal/mortality/manner/listing";
  return sendPostData(url, requestObj);
};

export const getMortalityStats = async (requestObj) => {
  let url = Configs.BASE_URL + "animal/mortality/stats";
  return sendPostData(url, requestObj);
};

export const getSpeciesHierarchy = async (requestObj) => {
  let url = Configs.BASE_URL + "collection/species/stats";
  return sendPostData(url, requestObj);
};
export const getGalleryImage = async (type, id) => {
  let url = Configs.BASE_URL + `species-galary-image?type=${type}&id=${id}`;
  return sendGetRequest(url);
};
