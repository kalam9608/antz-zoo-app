import Config from "../configs/Config";
import {
  sendPostData,
  sendGetRequest,
  sendPostFormData,
} from "../utils/RequestHelper";

export const getEnclosureBySectionId = async (requestObj) => {
  let url = Config.BASE_URL + `enclosure/details`;
  return sendGetRequest(url, requestObj);
};
export const getEnclosuresList = async (requestObj) => {
  let url = Config.BASE_URL + `v1/enclosure/sub/listing`;
  return sendGetRequest(url, requestObj);
};
export const getSpeciesList = async (requestObj) => {
  let url = Config.BASE_URL + `v1/species/listing`;
  return sendGetRequest(url, requestObj);
};
export const getAnimalsList = async (requestObj) => {
  let url = Config.BASE_URL + `v1/animal/listing`;
  return sendGetRequest(url, requestObj);
};
export const getAnimalsListWithSubEnc = async (requestObj) => {
  let url = Config.BASE_URL + `v1/enclosure/animal/listing`;
  return sendGetRequest(url, requestObj);
};
export const getSectionWiseAnimalTreatment = async (requestObj) => {
  let url =
    Config.BASE_URL +
    `section-wise-animal-medical-data/${requestObj.section_id}`;
  return sendGetRequest(url, requestObj);
};
export const getSectionDetails = async (requestObj) => {
  let url = Config.BASE_URL + `zoos/section/details`;
  return sendPostData(url, requestObj);
};
export const getSpeciesListingBySections = async (requestObj) => {
  let url = Config.BASE_URL + `collection/species/stats`;
  return sendPostData(url, requestObj);
};
export const getInchargesListingBySections = async (requestObj) => {
  let url =
    Config.BASE_URL +
    `incharge/sections/${requestObj?.section_id}?page_no=${requestObj?.page_no}&search=${requestObj?.search}`;
  return sendGetRequest(url);
};

export const getAnimalListBySections = async (requestObj) => {
  let url = Config.BASE_URL + `enclosure/animaldetails`;
  return sendGetRequest(url, requestObj);
};

export const getSpeciesListByEnclousre = async (requestObj) => {
  let url = Config.BASE_URL + `enclosure-species`;
  return sendGetRequest(url, requestObj);
};

export const getHistoryData = async (requestObj) => {
  let url = Config.BASE_URL + `enclosure-animal-log-history`;
  return sendGetRequest(url, requestObj);
};

export const getBasicInfoData = async (enclosureId) => {
  let url =
    Config.BASE_URL +
    `enclosure/get-enclosure-basic-info?enclosure_id=${enclosureId}`;
  return sendGetRequest(url);
};

// location 'http://localhost:8000/api/animal-log-history?animal_id=216620' \
export const getEnclosureHistoryData = async (requestObj) => {
  let url = Config.BASE_URL + `animal-log-history`;
  return sendGetRequest(url, requestObj);
};


export const getEnclosureHistoryInmatesData = async (requestObj) => {
  let url = Config.BASE_URL + `inmate-details`;
  return sendGetRequest(url, requestObj);
};

export const getInchargesListingByEnclosure = async (requestObj) => {
  let encId = requestObj.enclosure_id;
  let url = Config.BASE_URL + `incharge/enclosure/${requestObj.enclosure_id}`;
  return sendGetRequest(url, requestObj);
};

export const getAnimalMortality = async (requestObj) => {
  let url = Config.BASE_URL + `animal/getmortalityrecords`;
  return sendGetRequest(url, requestObj);
};

export const getAnimalIdentifier = async (requestObj) => {
  let url = Config.BASE_URL + `animal/identifier-list`;
  return sendGetRequest(url, requestObj);
};

export const changeAnimalEnclosure = async (requestObj) => {
  let url = Config.BASE_URL + `antz/change-animal-enclosure`;
  return sendPostFormData(url, requestObj);
};
