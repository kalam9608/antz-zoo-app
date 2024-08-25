import Configs from "../../configs/Config";
import { sendPostData } from "../../utils/RequestHelper";

export const deactivateUser = async (requestObj) => {
    let url = Configs.BASE_URL + "user/update-status";
    return sendPostData(url, requestObj);
  };