import Configs from "../../configs/Config";
import { sendPostData, sendGetRequest } from "../../utils/RequestHelper";

export const addNewAssessmentTemplate = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/assessment/templates/add";
  return sendPostData(url, requestObj);
};
export const assessmentTemplateList = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/assessment/templates/list";
  return sendGetRequest(url, requestObj);
};

export const assessmentTemplateDetails = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/assessment/templates/details";
  return sendGetRequest(url, requestObj);
};

export const assessmentTemplateEdit = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/assessment/templates/edit";
  return sendPostData(url, requestObj);
};

export const assessmentTemplateTypesList = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/assessment/templates/types";
  return sendGetRequest(url, requestObj);
};

export const assessmentTemplateSpeciesList = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/assessment/templates/species";
  return sendGetRequest(url, requestObj);
};

export const assessmentTemplateTaxonList = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/assessment/templates/taxon";
  return sendGetRequest(url, requestObj);
};

export const addAssessmentTemplateTaxon = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/assessment/taxons/add";
  return sendPostData(url, requestObj);
};

export const deleteAssessmentTemplateTaxon = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/assessment/taxons/delete";
  return sendPostData(url, requestObj);
};

export const assessmentTemplateTaxonFiltering = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/assessment/taxon/collection";
  return sendGetRequest(url, requestObj);
};
