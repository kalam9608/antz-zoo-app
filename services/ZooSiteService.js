import Configs from "../configs/Config";
import {
  sendPostData,
  sendGetRequest,
  sendPostFormData,
} from "../utils/RequestHelper";

export const createZooSite = async (requestObj, files) => {
  let url = Configs.BASE_URL + "zoos/createZooSite";
  return sendPostFormData(url, requestObj, files, "media[]");
};

export const editZooSite = async (requestObj, files) => {
  let url = Configs.BASE_URL + "zoos/editzoosite";
  return sendPostFormData(url, requestObj, files, "media[]");
};
export const removeDisplayImage = async (requestObj) => {
  let url = Configs.BASE_URL + "zoos/delete-display-image";
  return sendGetRequest(url, requestObj);
};

export const deleteGalleryImage = async (requestObj) => {
  let url = Configs.BASE_URL + `zoos/delete-site-gallery-image`;
  return sendGetRequest(url, requestObj);
};

export const galleryImageUpload = async (requestObj, files) => {
  let url = Configs.BASE_URL + `zoos/add-gallery-image`;
  return sendPostFormData(url, requestObj, files, "media[]");
};

export const deleteZooSite = async (requestObj) => {
  let url = Configs.BASE_URL + "zoos/deletezoosite";
  return sendGetRequest(url, requestObj);
};

export const getZooSiteDetails = async (requestObj) => {
  let url = Configs.BASE_URL + "site-details";
  return sendGetRequest(url, requestObj);
};

export const getSpeciesData = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/collection/animalspecies/listing";
  return sendPostData(url, requestObj);
};
export const getTestsLabMappingList = async (id) => {
  let url = Configs.BASE_URL + `antz/tests/list-available?test_id=${id}`;
  return sendGetRequest(url);
};
export const getTestsDefaultLab = async (id) => {
  let url = Configs.BASE_URL + `antz/site-test-labs?site_id=${id}`;
  return sendGetRequest(url);
};
export const createSiteLab = async (requestObj) => {
  let url = Configs.BASE_URL + "antz/labs/create-site-lab";
  return sendPostData(url, requestObj);
};
