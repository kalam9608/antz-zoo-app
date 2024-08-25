import Configs from "../configs/Config";
import { sendPostData, sendGetRequest } from "../utils/RequestHelper";

export const addEducation = async (requestObj) => {
  let url = Configs.BASE_URL + "/user/add-user-education-duplicate";
  return sendPostData(url, requestObj);
};

export const getEducation = async (requestObj) => {
  let url = Configs.BASE_URL + "/user/get-user-education-duplicate";
  return sendGetRequest(url, requestObj);
};

export const editEducation = async (requestObj) => {
  let url = Configs.BASE_URL + "/user/edit-user-education-duplicate";
  return sendPostData(url, requestObj);
};

export const deletetEducation = async (requestObj) => {
  let url = Configs.BASE_URL + "/user/delete-user-education";
  return sendPostData(url, requestObj);
};


