import {
  sendPostData,
  sendGetRequest,
  sendPostFormData,
} from "../utils/RequestHelper";
import Configs from "../configs/Config";

export const getObservationList = async (obj) => {
  let url = Configs.BASE_URL + `v1/get-observation-list`;
  return sendGetRequest(url, obj);
};

export const getObservationListOccupant = async (obj) => {
  let url = Configs.BASE_URL + `v1/get-observation-by-type-id`;
  return sendGetRequest(url, obj);
};
// ?id=${15451}&type=${"enclosure"}&page_no=${1}
export const getAnimalCommonData = async (animal_id, section) => {
  let url = Configs.BASE_URL + `animal/get-common-data-by-animal-id`;
  return sendGetRequest(url, { animal_id, section });
};

export const getObservationListforAdd = async (requestObj) => {
  let url = Configs.BASE_URL + `master/observation/list`;
  return sendGetRequest(url, requestObj);
};

export const addNotesList = async (requestObj) => {
  let url = Configs.BASE_URL + `master/observation/add`;
  return sendPostData(url, requestObj);
};

export const editNotesList = async (requestObj) => {
  let url = Configs.BASE_URL + `master/observation/edit`;
  return sendPostData(url, requestObj);
};

export const deleteNotesList = async (requestObj) => {
  let url = Configs.BASE_URL + `master/observation/delete`;
  return sendGetRequest(url, requestObj);
};

// /v1/observation
export const NewObservation = async (requestObj, files) => {
  let url = Configs.BASE_URL + `v1/observation2`;
  return sendPostFormData(url, requestObj, files, "observation_attachment[]");
};

// template observation
export const NewObservationTemplate = async (requestObj) => {
  let url = Configs.BASE_URL + `antz/observation/templates/create`;
  return sendPostData(url, requestObj);
};

export const NewObservationEditTemplate = async (requestObj, id) => {
  let url = Configs.BASE_URL + `antz/observation/templates/update/${id}`;
  return sendPostData(url, requestObj);
};

export const NewObservationTemplateList = async (requestObj) => {
  let url = Configs.BASE_URL + `antz/observation/templates`;
  return sendGetRequest(url, requestObj);
};
export const NewObservationTypeList = async (requestObj) => {
  let url = Configs.BASE_URL + `observation/master-type`;
  return sendGetRequest(url, requestObj);
};
export const NewObservationDelete = async (observationId) => {
  let url =
    Configs.BASE_URL + `antz/observation/templates/delete/${observationId}`;
  return sendPostData(url);
};
// observation comments
export const observationNote = async (requestObj, files) => {
  let url = Configs.BASE_URL + `v1/observation/note/add`;
  return sendPostFormData(
    url,
    requestObj,
    files,
    "observation_note_attachment[]"
  );
};

//Observation Details

export const getObservationDetails = async (obj) => {
  let url = Configs.BASE_URL + `v1/observation/details`;
  return sendGetRequest(url, obj);
};

export const EditObservationData = async (requestObj, files) => {
  let url = Configs.BASE_URL + `v1/observation/edit`;
  return sendPostFormData(url, requestObj, files, "observation_attachment[]");
};

export const EditObservationDatav2 = async (requestObj, files) => {
  let url = Configs.BASE_URL + `v1/observation2/edit`;
  return sendPostFormData(url, requestObj, files, "observation_attachment[]");
};

//Delete observation api

export const DeleteObservation = async (requestObj) => {
  let url = Configs.BASE_URL + `v1/observation/delete`;
  return sendGetRequest(url, requestObj);
};
