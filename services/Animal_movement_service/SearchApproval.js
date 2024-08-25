import Configs from "../../configs/Config";
import { sendPostData, sendGetRequest } from "../../utils/RequestHelper";

export const searchAnimalDepartment = async (requestObj) => {
  let url = Configs.BASE_URL + "/masters/departments";
  return sendGetRequest(url, requestObj);
};

export const searchUserListing = async (requestObj) => {
  let url = Configs.BASE_URL + "user/listing";
  return sendPostData(url, requestObj);
};
