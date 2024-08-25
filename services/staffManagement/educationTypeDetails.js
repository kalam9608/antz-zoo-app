import Configs from "../../configs/Config";
import { sendGetRequest } from "../../utils/RequestHelper";

export const getEducationTypeDetails = async (requestObj) => {
  let url = Configs.BASE_URL + "/masters/geteducationtype/" + requestObj.itemId;
  return sendGetRequest(url, requestObj);
};
