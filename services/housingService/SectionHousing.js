import Configs from "../../configs/Config";
import { sendPostData, sendGetRequest } from "../../utils/RequestHelper";

export const getSectioninsight = async (requestObj) => {
  let url = Configs.BASE_URL + "zoos/section/insights";
  return sendPostData(url, requestObj);
};

export const getHousingSection = async (requestObj) => {
  let url = Configs.BASE_URL + "zoos/section/listing";
  return sendPostData(url, requestObj);
};
export const getHousingSiteList = async (requestObj) => {
  let url = Configs.BASE_URL + "site-list";
  return sendGetRequest(url, requestObj);
};

export const getHousingSectionList = async (requestObj) => {
  let url = Configs.BASE_URL + "get-site-wise-section-list";
  return sendGetRequest(url, requestObj);
};
export const getHousingSiteUserAccessList = async (requestObj) => {
  let url = Configs.BASE_URL + "get-userswith-access";
  return sendGetRequest(url, requestObj);
};
export const getHousingSiteSpeciesList = async (requestObj) => {
  let url = Configs.BASE_URL + "site-species";
  return sendGetRequest(url, requestObj);
};
export const getEnclosureSiteWiseData = async (
  page_no,
  query,
  selected_site_id
) => {
  let url =
    Configs.BASE_URL +
    `enclosure/site-wise-search?page_no=${page_no}&q=${query}`;

  if (selected_site_id) {
    url += `&site_id=${selected_site_id}`;
  }

  return sendGetRequest(url);
};

export const getHousingInChargesList = async (requestObj) => {
  let url = Configs.BASE_URL + `get-incharge-list`;
  return sendGetRequest(url, requestObj);
};

export const addHousingInChargeMember = async (requestObj) => {
  let url = Configs.BASE_URL + "add-incharge";
  return sendPostData(url, requestObj);
};

export const getLoginHisoryList = async (requestObj) => {
  let url = Configs.BASE_URL + "get-user-login-data";
  return sendGetRequest(url, requestObj);
};
