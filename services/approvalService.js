import Config from "../configs/Config";
import { sendPostData, sendGetRequest } from "../utils/RequestHelper";

export const getListOfRequests = async (requestObj) => {
  let url = Config.BASE_URL + `v1/animal/move/requests`;
  return sendPostData(url, requestObj);
};

export const getListOfApprovals = async (requestObj) => {
  let url = Config.BASE_URL + `v1/animal/move/approvals`;
  return sendPostData(url, requestObj);
};

export const getAllTransfers = async (type, filter, page) => {
  let url =
    Config.BASE_URL +
    `antz/get-transfer-requests?type=${type}&filter=${filter}&page_no=${page}`;
  return sendGetRequest(url);
};

export const updateStatusApproveReject = async (requestObj) => {
  let url = Config.BASE_URL + `v1/animal/move/status/update`;
  return sendPostData(url, requestObj);
};

export const updateStatusComplete = async (requestObj) => {
  let url = Config.BASE_URL + `v1/animal/move/complete`;
  return sendPostData(url, requestObj);
};
