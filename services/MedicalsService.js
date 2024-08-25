import Configs from "../configs/Config";
import {
  sendPostData,
  sendGetRequest,
  sendPostFormData,
} from "../utils/RequestHelper";

export const getMedicalMasterdata = async (requestObj) => {
  let url = Configs.BASE_URL + "medical/masterdata";
  return sendGetRequest(url, requestObj);
};

export const listMedicalCaseType = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/medicalcasetype";
  return sendGetRequest(url, requestObj);
};

export const listAnimalComplaints = async (requestObj) => {
  // let url = Configs.BASE_URL + "masters/animalcomplaints";
  let url = Configs.BASE_URL + "masters/animalcomplaints-new";
  return sendGetRequest(url, requestObj);
};

export const listAnimalDiagnosis = async (requestObj) => {
  // let url = Configs.BASE_URL + "masters/diagnosis";
  let url = Configs.BASE_URL + "masters/diagnosis-new";
  return sendGetRequest(url, requestObj);
};

export const getComplaintsDiagnosisList = async (requestObj) => {
  // let url = Configs.BASE_URL + "masters/animalcomplaints";
  console.log("REQUEST OBJ: ", requestObj);
  // let url =
  //   Configs.BASE_URL +
  //   `medical/get-complaint-diagnosis-list?type=${requestObj.type}&page_no=${requestObj.page_no}`;
  let url = Configs.BASE_URL + `medical/get-complaint-diagnosis-list`;
  return sendGetRequest(url, requestObj);
};

export const getemplate = async (requestObj) => {
  let url = Configs.BASE_URL + "medical/get-template";
  return sendGetRequest(url, requestObj);
};

export const listAnimalPrescription = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/prescription";
  return sendGetRequest(url, requestObj);
};

export const listMostlyUsed = async (requestObj) => {
  let url = Configs.BASE_URL + "medical/get-most-use";
  return sendGetRequest(url, requestObj);
};
export const listRecentlyUsed = async (requestObj) => {
  let url = Configs.BASE_URL + "medical/get-recently-use";
  return sendGetRequest(url, requestObj);
};

export const listAnimalAdvices = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/medicaladvices";
  return sendGetRequest(url, requestObj);
};
export const listAnimalLabRequest = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/medicallab";
  return sendGetRequest(url, requestObj);
};
export const labSampleList = async (requestObj) => {
  let url = Configs.BASE_URL + "medical/get-all-test-by-sample";
  return sendGetRequest(url, requestObj);
};
export const createMedicalRecord = async (requestObj, files, key) => {
  let url = Configs.BASE_URL + "medicalrecord/create";
  return sendPostFormData(url, requestObj, files, key);
};
export const createMedicalRecordNew = async (requestObj, files, key) => {
  let url = Configs.BASE_URL + "medicalrecord/create-medical-record";
  return sendPostFormData(url, requestObj, files, key);
};
export const EditMedicalTemp = async (requestObj, id) => {
  let url = Configs.BASE_URL + `medical/updateTemplate/${id}`;
  return sendPostData(url, requestObj);
};
export const DeleteMedicalTemp = async (id) => {
  let url = Configs.BASE_URL + `medical/deleteTemplate/${id}`;
  return sendPostData(url);
};

export const editMedicalRecordNew = async (
  requestObj,
  medical_id,
  files,
  key
) => {
  let url =
    Configs.BASE_URL + `medicalrecord/${medical_id}/update-medical-record`;
  return sendPostFormData(url, requestObj, files, key);
};

export const addLabFiles = async (requestObj, files, key) => {
  let url = Configs.BASE_URL + "medical/add-lab-test-files";
  return sendPostFormData(url, requestObj, files, key);
};

export const removeLabFiles = async (id) => {
  let url = Configs.BASE_URL + `medical/${id}/delete-lab-test-file`;
  return sendPostFormData(url);
};

export const createTemplate = async (requestObj) => {
  let url = Configs.BASE_URL + "medical/createTemplate";
  return sendPostData(url, requestObj);
};

export const getDeliveryRoute = async (requestObj) => {
  let url = Configs.BASE_URL + "master/get-medical-delivery-route";
  return sendGetRequest(url, requestObj);
};

export const getTemplate = async (requestObj) => {
  let url = Configs.BASE_URL + "medical/get-template";
  return sendGetRequest(url, requestObj);
};

export const getMedicines = async (requestObj) => {
  let url = Configs.BASE_URL + "medical/medical-search";
  return sendGetRequest(url, requestObj);
};

export const getDosageUnit = async (type) => {
  let url = Configs.BASE_URL + `masters/prescriptiondosage?dosage_type=${type}`;
  return sendGetRequest(url);
};

export const getDurationUnit = async () => {
  let url = Configs.BASE_URL + `masters/list-duration-prescription`;
  return sendGetRequest(url);
};
export const getFrequencyUnit = async () => {
  let url = Configs.BASE_URL + `masters/list-prescription-frequency`;
  return sendGetRequest(url);
};

export const getLatestWeight = async (id) => {
  let url = Configs.BASE_URL + `animal/get-latest-measurement?animal_id=${id}`;
  return sendGetRequest(url);
};

export const deleteMedicalRecord = async (id) => {
  let url =
    Configs.BASE_URL + `medical/delete-medical-record?medical_record_id=${id} `;
  return sendGetRequest(url);
};

export const diagnosisUpdate = async (requestObj) => {
  let url = Configs.BASE_URL + "medical/diagnosis-note-add";
  return sendPostData(url, requestObj);
};
export const prescriptionUpdate = async (requestObj) => {
  let url = Configs.BASE_URL + "medical/prescription-status-update";
  return sendGetRequest(url, requestObj);
};

export const medicineSideEffect = async (requestObj) => {
  let url = Configs.BASE_URL + "medical/medicine-side-effect";
  return sendPostFormData(url, requestObj);
};

export const deleteMedicineSideEffect = async (requestObj) => {
  let url = Configs.BASE_URL + "medical/delete-medicine-side-effect";
  return sendPostData(url, requestObj);
};

export const addAdminster = (requestObj) => {
  let url = Configs.BASE_URL + "add-administritive-data";
  return sendPostData(url, requestObj);
};

export const getAdminsterData = (requestObj) => {
  let url = Configs.BASE_URL + "administritive-data-list";
  return sendGetRequest(url, requestObj);
};

export const getDispenseBatch = (requestObj) => {
  // let url =
  //   Configs.BASE_URL + `batch-details/${requestObj?.id}/${requestObj?.type}`;
  let url = Configs.BASE_URL + `batch-details/${requestObj?.id}`;
  return sendGetRequest(url, requestObj);
};

export const createDispense = (requestObj) => {
  let url = Configs.BASE_URL + `dispense-item`;
  return sendPostData(url, requestObj);
};

export const getDispenseList = (requestObj) => {
  let url = Configs.BASE_URL + `dispense-item`;
  return sendGetRequest(url, requestObj);
};
export const getDispenseSummary = (requestObj) => {
  let url = Configs.BASE_URL + `dispense-item/${requestObj?.id}/show`;
  return sendGetRequest(url, requestObj);
};
export const checkDiagonosisByAnimals = (requestObj) => {
  let url = Configs.BASE_URL + `medical/check-diagnosis-by-animal`;
  return sendGetRequest(url, requestObj);
};
export const complaintUpdate = async (requestObj) => {
  let url = Configs.BASE_URL + "medical/complaint-note-add";
  return sendPostData(url, requestObj);
};
