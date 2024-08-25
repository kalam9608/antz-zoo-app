import Configs from "../configs/Config";
import { sendPostData, sendGetRequest } from "../utils/RequestHelper";

export const postAnimalEnclosure = async(requestObj) =>{
    const url = Configs.BASE_URL + "enclosure/getanimals"
    return sendPostData(url,requestObj)
}

// Get Enclosure Animal
// API URL:- POST /api/enclosure/getanimals

