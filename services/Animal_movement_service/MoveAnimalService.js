import Configs from "../../configs/Config";
import {
  sendPostData,
  sendGetRequest,
  sendPostFormData,
} from "../../utils/RequestHelper";

export const getParentOrChildEnc = async (requestObj) => {
  let url = Configs.BASE_URL + "section/parentchild/enclosure/listing";
  return sendPostData(url, requestObj);
};

export const createAnimalMoveRequest = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/animal/move/createrequest";
  return sendPostData(url, requestObj);
};

export const createNewAnimalMoveRequest = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/animal/move/create";
  return sendPostData(url, requestObj);
};

export const checkSiteApproval = async (id) => {
  let url = Configs.BASE_URL + `v1/site/transfer/check/authority/${id}`;
  return sendGetRequest(url);
};

export const approvalSummary = async (requestObj) => {
  let url = Configs.BASE_URL + `v1/animal/transfer/members`;
  return sendGetRequest(url, requestObj);
};
export const checkListDataFetch = async (requestObj) => {
  let url = Configs.BASE_URL + `antz/get-transfer-checklist`;
  return sendGetRequest(url, requestObj);
};

export const checkedDataFetch = async (requestObj) => {
  let url = Configs.BASE_URL + `antz/list-animals-filled-checklist`;
  return sendGetRequest(url, requestObj);
};
export const getTransferMembers = async (requestObj) => {
  let url =
    Configs.BASE_URL +
    `v1/get-source-destination-wise-site-user-list-by-animal-movement-id`;
  return sendGetRequest(url, requestObj);
};
export const getTransferLog = async (animal_movement_id) => {
  let url =
    Configs.BASE_URL +
    `antz/list-comments-logs?animal_movement_id=${animal_movement_id}`;
  return sendGetRequest(url);
};
export const addTransferComments = (requestObj) => {
  let url = Configs.BASE_URL + `antz/transfer/addcomments`;
  return sendPostData(url, requestObj);
};

export const btnStatusForTransfer = (requestObj) => {
  let url = Configs.BASE_URL + `v1/animal/transfer/btn-status`;
  return sendPostData(url, requestObj);
};
export const updateTransferStatus = (requestObj) => {
  let url = Configs.BASE_URL + `antz/animal/update-transfer-status`;
  return sendPostData(url, requestObj);
};
export const approveTransferRequest = (requestObj) => {
  let url = Configs.BASE_URL + `antz/approve-transfer-request`;
  return sendPostData(url, requestObj);
};
export const rejectAndResetRequest = (requestObj) => {
  let url = Configs.BASE_URL + `animal/transfer/action`;
  return sendPostData(url, requestObj);
};
export const animalListBySpecies = (requestObj) => {
  let url = Configs.BASE_URL + `v1/movement-animal-by-species`;
  return sendGetRequest(url, requestObj);
};

export const animalEnclosureSite = (requestObj) => {
  let url = Configs.BASE_URL + `antz/animal-enclosure-site-id`;
  return sendGetRequest(url, requestObj);
};

export const transferChecklist = (requestObj) => {
  let url = Configs.BASE_URL + `antz/get-transfer-checklist`;
  return sendGetRequest(url, requestObj);
};

export const addTransferCheckList = (requestObj) => {
  let url = Configs.BASE_URL + `antz/animal-movement-checkList`;
  return sendPostFormData(url, requestObj);
};

export const getFilledChecklist = (requestObj) => {
  let url = Configs.BASE_URL + `antz/list-animals-filled-checklist`;
  return sendGetRequest(url, requestObj);
};

export const getChekoutList = (requestObj) => {
  let url = Configs.BASE_URL + `security-checkout/animal-list`;
  return sendGetRequest(url, requestObj);
};

export const checkOutList = (id) => {
  let url =
    Configs.BASE_URL + `exit-denied-animal-list?animal_movement_id=${id}`;
  return sendGetRequest(url);
};

export const getAllSiteList = (requestObj) => {
  let url = Configs.BASE_URL + "get-zoo-wise-site-list";
  return sendGetRequest(url, requestObj);
};

export const vehicleArrived = (requestObj) => {
  let url = Configs.BASE_URL + `vehicle-arrive`;
  return sendGetRequest(url, requestObj);
};
