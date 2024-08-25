import Config from "../configs/Config";
import { sendPostData, sendGetRequest } from "../utils/RequestHelper";

export const PostSite = async (requestObj) => {
  let url = Config.BASE_URL + "/user/add-user-site";
  return sendPostData(url, requestObj);
};

export const getListSite = async (zoo_id, requestObj) => {
  let url = Config.BASE_URL + "zoos/getZooSite/" + zoo_id;
  return sendGetRequest(url, requestObj);
};

export const EditSite = async (requestObj) => {
  let url = Config.BASE_URL + "/user/edit-user-site";
  return sendPostData(url, requestObj);
};

export const getUserSite = async (requestObj) => {
  let url = Config.BASE_URL + "/user/get-user-site";
  return sendGetRequest(url, requestObj);
};

export const deletesite = async (requestObj) => {
  let url = Config.BASE_URL + "/user/delete-user-site";
  return sendPostData(url, requestObj);
};

export const getZooSite = async (zoo_id) => {
  let url = Config.BASE_URL + "zoos/getZooSite/" + zoo_id;
  return sendGetRequest(url);
};

export const getZooLab = async () => {
  let url = Config.BASE_URL + `antz/labs/list-labs`;
  return sendGetRequest(url);
};

export const getZooPharmacy = async (zoo_id) => {
  let url = Config.BASE_URL + "v1/get-all-pharmacy";
  return sendGetRequest(url);
};

{
  /* Author: Wasim Akram
      Description : Add a DeleteSite Api(GET) service */
}
export const deleteSite = async (requestObj) => {
  let url = Config.BASE_URL + "zoos/deletezoosite";
  return sendGetRequest(url, requestObj);
};

{
  /*Author: Wasim Akram 
    Description:  Add a Edit Api(POST) service
    */
}

export const editSite = async (requestObj) => {
  let url = Config.BASE_URL + "zoos/editzoosite";
  return sendPostData(url, requestObj);
};

export const speciesPopulation = async (page_no, species_id, type) => {
  let url = Config.BASE_URL + `species-wise-details?page_no=${page_no}&species_id=${species_id}&type=${type}`;
  return sendGetRequest(url);
};

export const housingDataFetch = async (ref_type, data_type, ref_id, page_no, search) => {
  let url = Config.BASE_URL + `housing-listing?ref_type=${ref_type}&data_type=${data_type}&ref_id=${ref_id}&page_no=${page_no}&q=${search}`;
  return sendGetRequest(url);
};

export const collectionInsightListing = async (requestObj) => {
  let url = Config.BASE_URL + `collection/insights-list`;
  return sendGetRequest(url,requestObj);
};

export const getSpeciesWiseList = async (requestObj) => {
  let url = Config.BASE_URL + `species-wise-details`;
  return sendGetRequest(url,requestObj);
};

export const getSpeciesWiseMedicalList = async (requestObj) => {
  let url = Config.BASE_URL + `medical/get-medical-record-by-species`;
  return sendGetRequest(url,requestObj);
};

export const getSpeciesTaxonomyHierarchy = async (requestObj) => {
  let url = Config.BASE_URL + `get-texonomy-hierarchy-list-by-species`;
  return sendGetRequest(url,requestObj);
};