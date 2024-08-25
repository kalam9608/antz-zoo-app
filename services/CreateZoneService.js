import Configs from "../configs/Config";
import { sendPostData, sendGetRequest } from "../utils/RequestHelper";


export const CreateZoneService = async(requestObj) =>{
    let url = Configs.BASE_URL + "/zoos/createzone"
    return sendPostData(url, requestObj)
}

export const PostZoneListByZooIdService = async(requestObj) =>{
  let url = Configs.BASE_URL + "/zoos/getzoozones"
  return sendPostData(url, requestObj)
}
  