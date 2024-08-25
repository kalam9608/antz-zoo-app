import Configs from "../configs/Config";
import { sendGetRequest, sendPostData, sendPostFormData } from "../utils/RequestHelper";

export const CreateSection = async (requestObj,file) => {
  let url = Configs.BASE_URL + "zoos/createsection";
  return sendPostFormData(url, requestObj,file,"media[]");
};

export const assignUserSite = async (requestObj) => {
  let url = Configs.BASE_URL + "user/assignUserSite";
  return sendPostData(url, requestObj);
};

export const assignUserSection = async (requestObj) => {
  let url = Configs.BASE_URL + "user/assignUserSection";
  return sendPostData(url, requestObj);
};

export const editSection = async (requestObj,file) => {
  let url = Configs.BASE_URL + "zoos/editsection";
  return sendPostFormData(url,requestObj,file,"media[]");
};

export const deleteSection = async (requestObj) => {
  let url = Configs.BASE_URL + "zoos/deletesection";
  return sendGetRequest(url, requestObj);
};

export const sectionGalleryImageUpload = async (requestObj,file) => {
  let url = Configs.BASE_URL + "zoos/add-section-gallery-image";
  return sendPostFormData(url, requestObj,file,"media[]");
};

export const sectionDeleteGalleryImage = async (requestObj) => {
  let url = Configs.BASE_URL + "zoos/delete-section-gallery-image";
  return sendGetRequest(url, requestObj);
};

export const getSectionlisting = async (requestObj) => {
  let url = Configs.BASE_URL + "zoos/getsections";
  return sendPostData(url, requestObj);
};
export const getSectionwithPagination = async (requestObj) => {
  let url = Configs.BASE_URL + "zoos/all-getsections";
  return sendPostData(url, requestObj);
};

export const GetDetailesSection = async (requestObj) => {
  let url = Configs.BASE_URL + "zoos/section/details";
  return sendPostData(url, requestObj);
};