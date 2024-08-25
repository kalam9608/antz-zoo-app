import Configs from "../configs/Config";
import {
  sendPostData,
  sendGetRequest,
  sendPostFormData,
} from "../utils/RequestHelper";

export const GetOrganList = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/animal/necropsy/bodyparts";
  return sendPostData(url, requestObj);
};
export const NecropsyAdd = async (requestObj, files) => {
  let url = Configs.BASE_URL + "v1/animal/necropsy/add";
  return sendPostFormData(url, requestObj, files, "necropsy_attachment[]");
};
export const NecropsyEdit = async (requestObj, files) => {
  let url = Configs.BASE_URL + "v1/animal/necropsy/edit";
  return sendPostFormData(url, requestObj, files, "necropsy_attachment[]");
};
