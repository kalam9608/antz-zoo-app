import Configs from "../configs/Config";
import {
  sendPostData,
  sendGetRequest,
  sendPostFormData,
} from "../utils/RequestHelper";

export const addAnimal = async (requestObj) => {
  let url = Configs.BASE_URL + "animal/create";
  return sendPostData(url, requestObj);
};

export const addGroupofAnimal = async (requestObj) => {
  let url = Configs.BASE_URL + "groupAnimal/create";
  return sendPostData(url, requestObj);
};

export const editGroupofAnimal = async (requestObj) => {
  let url = Configs.BASE_URL + "animal/updateGroup";
  return sendPostData(url, requestObj);
};

export const getAnimalConfigs = async (requestObj) => {
  let url = Configs.BASE_URL + "animal/getconfigs";
  return sendGetRequest(url, requestObj);
};

export const deleteIdentifierData = (requestObj) => {
  let url = Configs.BASE_URL + `delete/animalidentifier`;
  return sendGetRequest(url,requestObj);
}

export const getAnimalStats = async () => {
  let url = Configs.BASE_URL + "v1/collection/animal/stats";
  return sendGetRequest(url);
};

export const filterAnimals = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/collection/animal/list";
  return sendPostData(url, requestObj);
};

export const getAnimalList = async (requestObj) => {
  let url = Configs.BASE_URL + "animals/getzooanimals";
  return sendPostData(url, requestObj);
};

export const getAnimalDetails = async (requestObj) => {
  let url = Configs.BASE_URL + "animal-details";
  return sendGetRequest(url, requestObj);
};

export const getmMeasurementConfig = async (animal_id) => {
  let url =
    Configs.BASE_URL + "masters/animal/" + animal_id + "/measurement-unit";
  return sendGetRequest(url);
};

export const getAllMeasurementTypes = async () => {
  let url = Configs.BASE_URL + "masters/measurement-types";
  return sendGetRequest(url);
};

export const addAnimalMeasurment = (requestObj) => {
  let url = Configs.BASE_URL + "animal/measurement/add";
  return sendPostData(url, requestObj);
};
export const AnimalCountUpdate = (requestObj) => {
  let url = Configs.BASE_URL + "animal-count-update";
  return sendPostData(url, requestObj);
};

export const getMeasurmentDetails = async (animal_id) => {
  let url = Configs.BASE_URL + "animal/" + animal_id + "/measurements";
  return sendGetRequest(url);
};
export const getMeasurmentSummary = async (animal_id) => {
  let url = Configs.BASE_URL + "animal/" + "allmeasurements/" + animal_id;
  return sendGetRequest(url);
};
export const editMeasurmentSummary = (requestObj) => {
  let url = Configs.BASE_URL + "animal/measurement/edit";
  return sendPostData(url, requestObj);
};

export const getMeasurmentUnit = async (id) => { 
  let url =
    Configs.BASE_URL + `masters/measurement-unit-by-id?measurement_type=${id}`;
  return sendGetRequest(url);
};

export const getMeasurmentListUnit = async () => { 
  let url =
    Configs.BASE_URL + `masters/measurement-units`;
  return sendGetRequest(url);
};

export const saveMeasurementConfig = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/animal/measurement-unit";
  return sendPostData(url, requestObj);
};

// GET /api/medical/get-medical-details-by-id?medical_record_id=35
export const getAnimalMedicalDetails = async (requestObj) => {
  let url = Configs.BASE_URL + `medical/get-medical-details-by-id`;
  return sendGetRequest(url, requestObj);
};
export const getAnimalMedicalDetailsNew = async (requestObj) => {
  let url = Configs.BASE_URL + `medical/get-medical-record-details`;
  return sendGetRequest(url, requestObj);
};

export const getAnimalMedicalRecordList = async (requestObj) => {
  let url = Configs.BASE_URL + `medical/get-all-medical-records`;
  return sendGetRequest(url, requestObj);
};
export const getAnimalMedicalRecordListNew = async (requestObj) => {
  let url = Configs.BASE_URL + `medical/get-medical-record-list`;
  return sendGetRequest(url, requestObj);
};
export const getAnimalMedicalRecordListById = async (id) => {
  let url = Configs.BASE_URL + `medicalrecordByAnimal/${id}`;
  return sendGetRequest(url);
};

export const getAnimalMedicalBasicData = async (id) => {
  let url = Configs.BASE_URL + `medical/${id}/get-basic-data`;
  return sendGetRequest(url);
};

export const getAnimalMedicalDiagnosisData = async (id, type, page_no) => {
  let url =
    Configs.BASE_URL +
    `medical/${id}/get-diagnosis-data?type=${type}&page_no=${page_no}`;
  return sendGetRequest(url);
};

export const getAnimalMedicalPrescriptionData = async (id, type, page_no) => {
  let url =
    Configs.BASE_URL +
    `medical/${id}/get-prescription-data?type=${type}&page_no=${page_no}`;
  return sendGetRequest(url);
};

export const animalEditData = async (requestObj) => {
  let url = Configs.BASE_URL + "animal/update";
  return sendPostData(url, requestObj);
};

export const getAnimalMasterData = async (requestObj) => {
  let url = Configs.BASE_URL + "animal/getAnimalMaster";
  return sendGetRequest(url, requestObj);
};

export const getDeletedAnimalList = async (requestObj) => {
  let url = Configs.BASE_URL + "animals/getzoodeletedanimals";
  return sendGetRequest(url, requestObj);
};

export const DeleteAnimal = async (requestObj) => {
  let url = Configs.BASE_URL + "animal/remove";
  return sendPostData(url, requestObj);
};

export const RestoreAnimal = async (requestObj) => {
  let url = Configs.BASE_URL + "animal/restore";
  return sendPostData(url, requestObj);
};

export const addAnimalLocalIdentifier = async (requestObj, files) => {
  let url = Configs.BASE_URL + "add/animalidentifier";
  return sendPostFormData(url, requestObj, files, "identifier_attachment[]");
};

export const editAnimalLocalIdentifier = async (requestObj, files) => {
  let url = Configs.BASE_URL + "edit/animalidentifier";
  return sendPostFormData(url, requestObj, files, "identifier_attachment[]");
};

export const get_Print_Label = async (requestObj) => {
  let url = Configs.BASE_URL + "print-label";
  return sendPostData(url, requestObj);
};

export const getNecropsySummary = async (requestObj) => {
  let url = Configs.BASE_URL + `v1/animal/necropsy/details`;
  return sendGetRequest(url, requestObj);
};

export const animalAddMedia = async (requestObj, files) => {
  let url = Configs.BASE_URL + "animal/add-media";
  return sendPostFormData(url, requestObj, files, "media_attachment[]");
};
export const allAddMedia = async (requestObj, files) => {
  let url = Configs.BASE_URL + "zoos/all-type-add-media";
  return sendPostFormData(url, requestObj, files, "media_attachment[]");
};
export const getDocs = async (ref_type, ref_id, page_no, type) => {
  let url;
  if (type == 'image') {
    url =
    Configs.BASE_URL +
    `zoos/all-type-media-list?ref_type=${ref_type}&ref_id=${ref_id}&filter_type=${type}`;
  } else {
    url =
    Configs.BASE_URL +
    `zoos/all-type-media-list?ref_type=${ref_type}&ref_id=${ref_id}&page_no=${page_no}&filter_type=${type}`;
  }
  return sendGetRequest(url);
};

export const getMediaList = async (type, count, animal_id) => {
  let url;
  if (type == 'image') {
    url =
    Configs.BASE_URL +
    `animal/media-list?type=${type}&animal_id=${animal_id}`;
  } else {
  url =
    Configs.BASE_URL +
    `animal/media-list?type=${type}&page_no=${count}&animal_id=${animal_id}`;
  }
  return sendGetRequest(url);
};

export const getLabRequestAnimal = async (page_no, animal_id, type) => {
  let url =
    Configs.BASE_URL +
    `get-lab-test-request-status-wise?page_no=${page_no}&animal_id=${animal_id}&type=${type}`;
  return sendGetRequest(url);
};

export const getDeleteReasonList = async () => {
  let url = Configs.BASE_URL + `animals/deletereason`;
  return sendGetRequest(url);
};

export const getSiteWiseAnimalsTreatment = async (requestObj) => {
  let url =
    Configs.BASE_URL + `site-wise-animal-medical-data/${requestObj.site_id}`;
  return sendGetRequest(url, requestObj);
};

export const deleteMedia = async (requestObj, files) => {
  let url = Configs.BASE_URL + "zoos/all-type-delete-media";
  return sendPostData(url, requestObj);
};
