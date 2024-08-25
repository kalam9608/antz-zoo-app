import Configs from "../configs/Config";
import { sendPostData, sendGetRequest } from "../utils/RequestHelper";


export const getDynamicForm = async (requestObj) => {
	let url = Configs.BASE_URL + "get-field-config";
	return sendGetRequest(url,requestObj);
};

export const dynamicApi = async (endpoint,requestObj) => {
	let url = Configs.BASE_URL + endpoint;
	return sendGetRequest(url,requestObj);
};

export const addEggs = async (requestObj) => {
    let url = Configs.BASE_URL + "egg/add-egg";
    return sendPostData(url, requestObj);
};

export const getTaxonomic= async (requestObj) => {
    let url = Configs.BASE_URL + "taxonomyunits";
    return sendPostData(url,requestObj);
};

export const getMasterTaxonomic= async (requestObj) => {
  let url = Configs.BASE_URL + "master/taxonomy/search";
  return sendGetRequest(url,requestObj);
};

export const getParentEnclosure= async (requestObj) => {
    let url = Configs.BASE_URL + "enclosure/getanimals";
    return sendPostData(url,requestObj);
};

export const PostaddEggs = async (requestObj) => {
    let url = Configs.BASE_URL + "egg/add-egg";
    return sendPostData(url, requestObj);
};

export const editData = async (requestObj) => {
	let url = Configs.BASE_URL + "egg/edit-egg";
	return sendPostData(url, requestObj);
};

export const getEggConfigData = async (requestObj) => {
	let url = Configs.BASE_URL + "eggs/geteggconfigs";
	return sendGetRequest(url, requestObj);
};

export const getEggsDetails = async(requestObj) =>{
    let url = Configs.BASE_URL + "egg/get-egg-details"
    return sendGetRequest(url, requestObj)
  }

  export const getEggsList = async(requestObj) =>{
    let url = Configs.BASE_URL + "egg/get-egg"
    return sendGetRequest(url, requestObj)
  }


  export const DeleteEggsEditList = async(requestObj) =>{
    let url = Configs.BASE_URL + "egg/remove"
    return sendPostData(url, requestObj)
  }
