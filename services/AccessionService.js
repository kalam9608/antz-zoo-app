import Configs from "../configs/Config";
import {
  sendPostData,
  sendGetRequest,
  sendPostFormData,
} from "../utils/RequestHelper";

export const listVernacularType = async (requestObj) => {
  let url = Configs.BASE_URL + "master/taxonomy/vernacular";
  return sendGetRequest(url, requestObj);
};

export const createTaxonomy = async (requestObj, files) => {
  let url = Configs.BASE_URL + "master/taxonomy/add";
  return sendPostFormData(url, requestObj, files, "banner_images[]");
};

export const taxonomyEdit = async (requestObj) => {
  let url = Configs.BASE_URL + `master/taxonomy/edit/${requestObj.tsn_id}`;
  return sendPostFormData(url, requestObj);
};

export const deleteBannerImage = async (requestObj) => {
  let url = Configs.BASE_URL + `master/banner/delete`;
  return sendPostData(url, requestObj);
};

export const bannerUpload = async (requestObj, files) => {
  let url = Configs.BASE_URL + `master/taxonomy/bannerUpload`;
  return sendPostFormData(url, requestObj, files, "banner_images[]");
};
export const getBannerImage = async (requestObj) => {
  let url = Configs.BASE_URL + `taxonomy/banner/images`;
  return sendGetRequest(url, requestObj);
};
export const getVernacularName = async (id) => {
  let url = Configs.BASE_URL + `master/taxonomy/zoo/vernacular/${id}`;
  return sendGetRequest(url);
};
export const getTaxonomyList = async (requestObj) => {
  let url = Configs.BASE_URL + "master/zoo/taxonomy/list";
  return sendPostData(url, requestObj);
};

export const listAccessionType = async () => {
  let url = Configs.BASE_URL + "masters/getAccessionType";
  return sendGetRequest(url);
};

export const createAccessionType = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/accessionType";
  return sendPostData(url, requestObj);
};

export const getAccessionType = async (itemId) => {
  let url = Configs.BASE_URL + "masters/accessionType/" + itemId;
  return sendGetRequest(url);
};
