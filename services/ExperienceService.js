import Configs from "../configs/Config";
import { sendGetRequest, sendPostData } from "../utils/RequestHelper";

export const getExperience = async (requestObj) => {
  let url = Configs.BASE_URL + "/user/get-user-work-experience";
  return sendGetRequest(url, requestObj);
};

export const addExperience = async (requestObj) => {
  let url = Configs.BASE_URL + "/user/add-user-work-experience";
  return sendPostData(url, requestObj);
};

export const editExperience = async (requestObj) => {
  let url = Configs.BASE_URL + "/user/edit-user-work-experience";
  return sendPostData(url, requestObj);
};

export const deleteExperience = async (requestObj) => {
  let url = Configs.BASE_URL + "/user/delete-user-work-experience";
  return sendPostData(url, requestObj);
};
