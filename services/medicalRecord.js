import Configs from "../configs/Config";
import { sendPostData, sendGetRequest } from "../utils/RequestHelper";

export const getMedicalCount = async (reqObj) => {
  let url = Configs.BASE_URL + `medical/count`;
  return sendGetRequest(url, reqObj);
};

export const getMedicalAnimalsRecord = async (reqObj) => {
  let url =
    Configs.BASE_URL +
    `medical/get-medical-stat-by-list`;
  return sendGetRequest(url, reqObj);
};

export const getMedicalRecordCount = async (reqObj) => {
  let url = Configs.BASE_URL + `medical/get-medical-record-count-by-type`;
  return sendGetRequest(url, reqObj);
};

export const getMedicalRecordList = async (reqObj) => {
  let url =
    Configs.BASE_URL +
    `medical/get-medical-record-list-by-type`;
  return sendGetRequest(url, reqObj);
};

export const getFilterData = async (reqObj) => {
  let url =
    Configs.BASE_URL +
    `medical/get-medical-details?slug=${reqObj.value}&zoo_id=${reqObj.zoo_id}`;
  return sendGetRequest(url);
};

export const getMedicalListData = async (reqObj) => {
  let url = Configs.BASE_URL + `medical/get-medical-list`;

  return sendGetRequest(url, reqObj);
};
export const getLabTestData = async (reqObj) => {
  let url = Configs.BASE_URL + `medical/get-lab-test`;
  return sendGetRequest(url, reqObj);
};

export const getPrescriptionsData = async (reqObj) => {
  let url = Configs.BASE_URL + `medical/get-prescriptions`;
  return sendGetRequest(url, reqObj);
};

export const getActiveDiagnosisData = async (reqObj) => {
  let url = Configs.BASE_URL + `medical/get-active-diagonosis`;
  return sendGetRequest(url, reqObj);
};

export const getDiagnosisWiseAnimal = async (requestObj) => {
  let url = Configs.BASE_URL + `medical/get-active-diagonosis-wise-animal`;
  return sendGetRequest(url, requestObj);
};

export const getPrescriptionsWiseAnimal = async (requestObj) => {
  let url = Configs.BASE_URL + `medical/get-prescriptions-wise-animal`;
  return sendGetRequest(url, requestObj);
};
export const getLabTestDetails = async (requestObj) => {
  let url = Configs.BASE_URL + `medical/get-lab-test-details-list`;
  return sendGetRequest(url, requestObj);
};

// New services for medical module

const addLabTestMaster = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/add-lab-test";
  return sendPostData(url, requestObj);
};
