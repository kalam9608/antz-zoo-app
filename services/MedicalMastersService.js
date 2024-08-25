// /api/masters/diagnosis
import Configs from "../configs/Config";
import { sendPostData, sendGetRequest } from "../utils/RequestHelper";

export const instituteList = async (requestObj) => {
  let url = Configs.BASE_URL + "master/institutes";
  return sendGetRequest(url, requestObj);
};

export const OwnerShipList = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/animal-ownership-terms";
  return sendGetRequest(url, requestObj);
};

export const diagnosisList = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/diagnosis";
  return sendGetRequest(url, requestObj);
};
export const prescriptionList = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/prescription";
  return sendGetRequest(url, requestObj);
};

export const complaintsList = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/animalcomplaints";
  return sendGetRequest(url, requestObj);
};
export const medicalCaseType = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/medicalcasetype";
  return sendGetRequest(url, requestObj);
};
export const prescriptiondosageList = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/prescriptiondosage";
  return sendGetRequest(url, requestObj);
};
export const medicalAdviceList = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/medicaladvices";
  return sendGetRequest(url, requestObj);
};
// Add all the data
export const addDiagnosis = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/diagnosis";
  return sendPostData(url, requestObj);
};

// Add Institute the data
export const addInstitute = async (requestObj) => {
  let url = Configs.BASE_URL + "master/institutes";
  return sendPostData(url, requestObj);
};
export const addPrescription = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/prescription";
  return sendPostData(url, requestObj);
};

export const addComplaints = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/animalcomplaints";
  return sendPostData(url, requestObj);
};

export const addPrescriptionDosage = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/prescriptiondosage";
  return sendPostData(url, requestObj);
};

export const addMedicalCaseType = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/medicalcasetype";
  return sendPostData(url, requestObj);
};
export const addAdvice = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/medicaladvices";
  return sendPostData(url, requestObj);
};
// Edit all the data
export const editDiagnosis = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/edit-diagnosis";
  return sendPostData(url, requestObj);
};
export const editPrescription = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/edit-prescription";
  return sendPostData(url, requestObj);
};
export const editComplaints = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/edit-animalcomplaints";
  return sendPostData(url, requestObj);
};

export const editPrescriptionDosage = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/edit-prescriptiondosage";
  return sendPostData(url, requestObj);
};
export const editMedicalCaseType = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/edit-medicalcasetype";
  return sendPostData(url, requestObj);
};

export const editAdvice = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/edit-medicaladvices";
  return sendPostData(url, requestObj);
};
