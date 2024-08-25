import Configs from "../../configs/Config";
import { sendPostData } from "../../utils/RequestHelper";

export const createZooDetails = async (requestObj) => {
  let url = Configs.BASE_URL + "zoos/createZoo";
  return sendPostData(url, requestObj);
};
