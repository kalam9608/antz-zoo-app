import Configs from "../../configs/Config";
import { sendPostData, sendGetRequest } from "../../utils/RequestHelper";

export const getAssessmentStats = async (requestObj) => {
    let url = Configs.BASE_URL + "v1/assessment/stats";
    return sendGetRequest(url, requestObj);
  };

  export const getAssessmentTypesList = async (requestObj) => {
    let url = Configs.BASE_URL + "v1/assessment/category/list";
    return sendGetRequest(url, requestObj);
  };

  export const getAssessmentTypesListById = async (requestObj) => {
    let url = Configs.BASE_URL + "v1/assessment/type/list";
    return sendGetRequest(url, requestObj);
  };

  export const getAssessmentMasterDataList = async (requestObj) => {
    let url = Configs.BASE_URL + "v1/assessment/masters/config";
    return sendGetRequest(url, requestObj);
  };

  export const addNewAssessmentType = async (requestObj) => {
    let url = Configs.BASE_URL + "v1/assessment/type/add";
    return sendPostData(url, requestObj);
  };

  export const updateAssessmentType = async (requestObj) => {
    let url = Configs.BASE_URL + "v1/assessment/type/edit";
    return sendPostData(url, requestObj);
  };
  export const getAssessmentTypeDetails = async (requestObj) => {
    let url = Configs.BASE_URL + "v1/assessment/type/details";
    return sendGetRequest(url, requestObj);
  };
  export const getAssessmentCategoryTypeList = async (requestObj) => {
    let url = Configs.BASE_URL + "v1/assessment/type/list";
    return sendGetRequest(url, requestObj);
  };
  

  export const getAssessmentSummary = async (animalId,requestObj) => {
    let url = Configs.BASE_URL + `v1/assessment/animal/defaultValue/${animalId}`;
    return sendGetRequest(url,requestObj);
  };
  export const getAssessmentAnimalTypeList = async (requestObj) => {
    let url = Configs.BASE_URL + "v1/assessment/animal/types/" + requestObj;
    return sendGetRequest(url);
  }
  export const addAssessmentCategory = async (requestObj, id) => {
    let url = Configs.BASE_URL + "v1/assessment/animal/add/" + id;
    return sendPostData(url, requestObj);
  };
  export const updateAssessmentCategory = async (requestObj, id) => {
    let url = Configs.BASE_URL + "v1/assessment/animal/update/" + id;
    return sendPostData(url, requestObj);
  };
  export const addAssessmentType = async (requestObj, id) => {
    let url = Configs.BASE_URL + "v1/assessment/animal/types/edit/" + id;
    return sendPostData(url, requestObj);
  };

  
