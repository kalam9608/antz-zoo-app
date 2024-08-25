import Configs from "../configs/Config";
import { sendPostData, sendGetRequest } from "../utils/RequestHelper";

export const searchEnclosure = async (requestObj) => {
  let url = Configs.BASE_URL + "enclosures/search-enclosure";
  return sendGetRequest(url, requestObj);
};
export const searchSection = async (requestObj) => {
  let url = Configs.BASE_URL + "section/search-section";
  return sendGetRequest(url, requestObj);
};
export const searchSite = async (requestObj) => {
  let url = Configs.BASE_URL + "site/search-site";
  return sendGetRequest(url, requestObj);
};
export const searchCommonName = async (requestObj) => {
  let url = Configs.BASE_URL + "taxonomyvernacular/search-taxonomyvernacular";
  return sendGetRequest(url, requestObj);
};
export const searchScientificName = async (requestObj) => {
  let url = Configs.BASE_URL + "taxonomicunit/search-taxonomicunit";
  return sendGetRequest(url, requestObj);
};
export const searchIdentifier = async (requestObj) => {
  let url = Configs.BASE_URL + "search/search-animal-by-local-id";
  return sendGetRequest(url, requestObj);
};
export const AnimalSearch = async (requestObj) => {
  let url = Configs.BASE_URL + "search/search-animal";
  return sendGetRequest(url, requestObj);
};
