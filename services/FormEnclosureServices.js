import Config from "../configs/Config";
import {
  sendPostData,
  sendGetRequest,
  sendPostFormData,
} from "../utils/RequestHelper";

export const ChangeEnclosureRequest = async (requestObj) => {
  let url = Config.BASE_URL + "enclosure/createenclosureentitytransferrequest";
  return sendPostData(url, requestObj);
};

export const AddEnclosure = async (requestObj, files) => {
  let url = Config.BASE_URL + "enclosure/create-enclosure";
  return sendPostFormData(url, requestObj, files, "media[]");
};

export const GetEnclosure = async (requestObj) => {
  let url = Config.BASE_URL + "enclosures";
  return sendPostData(url, requestObj);
};
export const GetEnclosurewithPagination = async (requestObj) => {
  let url = Config.BASE_URL + "all-enclosures";
  return sendPostData(url, requestObj);
};

export const GetDetailesEnclosure = async (itemId) => {
  let url = Config.BASE_URL + "enclosure/get-enclosure/" + itemId;
  return sendGetRequest(url);
};
export const editEnclosure = async (requestObj, file) => {
  let url = Config.BASE_URL + "enclosure/update-enclosure";
  return sendPostFormData(url, requestObj, file, "media[]");
};

export const GetSubEnclosuresList = async (requestObj) => {
  let url = Config.BASE_URL + "v1/enclosure/sub/listing";
  return sendGetRequest(url, requestObj);
};

export const GetAnimalListBySpecies = async (enclosureId, requestObj) => {
  let url = Config.BASE_URL + "v1/enclosure/species/listing/" + enclosureId;
  return sendGetRequest(url, requestObj);
};

export const enclosureGalleryImageUpload = async (requestObj, file) => {
  let url = Config.BASE_URL + "zoos/add-enclosure-gallery-image";
  return sendPostFormData(url, requestObj, file, "media[]");
};

export const enclosureDeleteGalleryImage = async (requestObj) => {
  let url = Config.BASE_URL + "zoos/delete-enclosure-gallery-image";
  return sendGetRequest(url, requestObj);
};
