import Configs from "../../configs/Config";
import { sendPostData, sendGetRequest } from "../../utils/RequestHelper";


export const createAnimalTransferRequest = async (requestObj) => {
  let url = Configs.BASE_URL + "animal/transfer";
  return sendPostData(url, requestObj);
};

export const getListOfTransfers = async (requestObj) => {
	// let url = Configs.BASE_URL + "animal/transfer/" + entityType;
	let url = Configs.BASE_URL + `animal/transfer`;
	return sendGetRequest(url,requestObj);
};

export const getListOfTeams = async (requestObj) => {
	let url = Configs.BASE_URL + `get-default-animal-movement-user-list-by-site-id`;
	return sendGetRequest(url,requestObj);
};

export const addTeamMembers = async (requestObj) => {
	let url = Configs.BASE_URL + `zoos/site-team`;
	return sendPostData(url,requestObj);
};

export const updateApprovalPermission = async (requestObj) => {
	let url = Configs.BASE_URL + `zoos/update-perform-action`;
	return sendPostData(url,requestObj);
};

export const removeMembers = async (requestObj) => {
	let url = Configs.BASE_URL + `zoos/edit-site-team`;
	return sendPostData(url,requestObj);
};

export const getTransferListbySite = async (requestObj) => {
	let url = Configs.BASE_URL + `v1/animal/get-transfer-list`;
	return sendGetRequest(url,requestObj);
};