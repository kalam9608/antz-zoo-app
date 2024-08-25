import Configs from "../configs/Config";
import {
  sendPostData,
  sendGetRequest,
  sendPostFormData,
} from "../utils/RequestHelper";

export const getJournals = async (requestObj) => {
  let url = Configs.BASE_URL + `get-journal-record`;

  return sendGetRequest(url, requestObj);
};
