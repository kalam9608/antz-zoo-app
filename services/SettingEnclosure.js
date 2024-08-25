import Configs from "../configs/Config";
import { sendGetRequest } from "../utils/RequestHelper";

export const getEnclosureService = async(requestObj) =>{
    let url = Configs.BASE_URL + "/enclosure/settings"
    return sendGetRequest(url, requestObj)
  }