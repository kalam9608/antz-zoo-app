import Configs from "../../configs/Config";
import { sendGetRequest, sendPostData } from "../../utils/RequestHelper";

export const getEducationType = async (requestObj) => {
  let url = Configs.BASE_URL + "/masters/educationtypes";
  return sendGetRequest(url, requestObj);
};

export const getSection = async ($postObj) => {
  let url = Configs.BASE_URL + "zoos/getsections";
  return sendPostData(url, $postObj);
};

export const getEnclosurebySection = async (section_id) => {
  let url = Configs.BASE_URL + "enclosures";
  return sendPostData(url, { section_id });
};

export const getDepartments = async () => {
  let url = Configs.BASE_URL + "/masters/departments";
  return sendGetRequest(url);
};

export const getDesignation = async () => {
  let url = Configs.BASE_URL + "/masters/designations";
  return sendGetRequest(url);
};

{
  /* Author: Wasim Akram
    Description : Add a DeleteEnclosure Api(POST) service */
}
export const DeleteEnclosure = async (requestObj) => {
  let url = Configs.BASE_URL + "enclosure/remove";
  return sendPostData(url, requestObj);
};
