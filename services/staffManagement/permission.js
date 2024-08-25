import Configs from "../../configs/Config";
import {
  sendPostData,
  sendGetRequest,
  sendPostFormData,
} from "../../utils/RequestHelper";

export const createRole = async (requestObj) => {
  let url = Configs.BASE_URL + "rolepermission/add";
  return sendPostData(url, requestObj);
};

export const getRoleEditData = async (roleId) => {
  let url = Configs.BASE_URL + `role/edit-data?user_role_id=${roleId}`;
  return sendGetRequest(url);
};

export const editRole = async (requestObj) => {
  let url = Configs.BASE_URL + "rolepermission/edit";
  return sendPostData(url, requestObj);
};

export const getStaffData = async (userId) => {
  let url = Configs.BASE_URL + `user/get-staff-details?id=${userId}`;
  return sendGetRequest(url);
};

export const permissionSummary = async (requestObj) => {
  let url = Configs.BASE_URL + `permission/summary`;
  return sendPostData(url, requestObj);
};

export const getUserAccess = async (requestObj) => {
  let url = Configs.BASE_URL + `permission/getLocationAccess`;
  return sendPostData(url, requestObj);
};
export const getUserAccessLab = async (requestObj) => {
  let url =
    Configs.BASE_URL +
    `get-lab-permission-by-user-id?user_id=${requestObj.user_id}`;
  return sendGetRequest(url);
};

export const getUserAccessPhermacy = async (user_id) => {
  let url =
    Configs.BASE_URL +
    `get-pharmacy-permission-by-user-id?user_id=${user_id}`;
  return sendGetRequest(url);
};

export const masterAssignpermission = async (requestObj) => {
  let url = Configs.BASE_URL + `permission/usersettings`;
  return sendPostData(url, requestObj);
};

export const userAssignpermission = async (requestObj) => {
  let url = Configs.BASE_URL + `rolepermission/assign`;
  return sendPostData(url, requestObj);
};

export const fullZooAccessPermission = async (requestObj) => {
  let url = Configs.BASE_URL + `permission/locationaccess`;
  return sendPostData(url, requestObj);
};

export const fullLabAccessPermission = async (requestObj) => {
  let url = Configs.BASE_URL + `add-lab-full-access-permission`;
  return sendPostFormData(url, requestObj);
};

export const fullPharmacyAccessPermission = async (requestObj) => {
  let url = Configs.BASE_URL + `add-pharmacy-full-access-permission`;
  return sendPostFormData(url, requestObj);
};

export const getSectionsList = async (requestObj) => {
  let url = Configs.BASE_URL + `zoos/getsections`;
  return sendPostData(url, requestObj);
};

export const getAllSectionsList = async (requestObj) => {
  let url = Configs.BASE_URL + `zoos/getsectionsbysite`;
  return sendPostData(url, requestObj);
};

export const getPermissionData = async (lab_id, user_id) => {
  let url =
    Configs.BASE_URL + `get-permission-data?lab_id=${lab_id}&type=lab_module&user_id=${user_id}`;
  return sendGetRequest(url);
};

export const getPhermacyPermissionData = async (pharmacy_id, user_id) => {
  let url =
    Configs.BASE_URL +
    `get-pharmacy-permission-data?pharmacy_id=${pharmacy_id}&type=pharmacy_module&user_id=${user_id}`;
  return sendGetRequest(url);
};

export const addLabMappingData = async (requestObj) => {
  let url = Configs.BASE_URL + `add-user-lab-mapping-data`;
  return sendPostFormData(url, requestObj);
};

export const addPhamacyMappingData = async (requestObj) => {
  let url = Configs.BASE_URL + `add-user-pharmacy-mapping-data`;
  return sendPostFormData(url, requestObj);
};
