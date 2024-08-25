import Configs from "../configs/Config";
import { sendPostData, sendGetRequest } from "../utils/RequestHelper";

export const createEducationType = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/educationtype";
  return sendPostData(url, requestObj);
};

export const editEducationType = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/editeducationtype";
  return sendPostData(url, requestObj);
};

export const deleteEducationType = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/deleteeducationtype";
  return sendPostData(url, requestObj);
};
