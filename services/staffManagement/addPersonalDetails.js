import Configs from "../../configs/Config";
import {
  sendPostData,
  sendGetRequest,
  sendPostFormData,
} from "../../utils/RequestHelper";

export const personalDetails = async (requestObj) => {
  let url = Configs.BASE_URL + "user/adduserpersonaldetails";
  return sendPostData(url, requestObj);
};
export const EditpersonalDetails = async (requestObj) => {
  let url = Configs.BASE_URL + "user/edituserpersonaldetails";
  return sendPostData(url, requestObj);
};
export const getPersonalDetails = async (requestObj) => {
  let url = Configs.BASE_URL + "user/getuserpersonaldetails";
  return sendGetRequest(url, requestObj);
};

export const addStaff = async (requestObj) => {
  // let url = Configs.BASE_URL + "user/add-staff";
  let url = Configs.BASE_URL + "user/add-basic-info";
  return sendPostFormData(url, requestObj);
};

export const ResetPass = async (requestObj) => {
  // let url = Configs.BASE_URL + "user/add-staff";
  let url = Configs.BASE_URL + "user/reset-password";
  return sendPostData(url, requestObj);
};

export const EditStaff = async (requestObj) => {
  // let url = Configs.BASE_URL + "user/add-staff";
  let url = Configs.BASE_URL + "user/edit-basic-info";
  return sendPostFormData(url, requestObj);
};

export const checkUserNameExist = async (requestObj) => {
  let url = Configs.BASE_URL + "user/username-check";
  return sendPostData(url, requestObj);
};

export const getStaffListWithPagination = async (requestObj) => {
  let url = Configs.BASE_URL + "user/listing";
  return sendPostData(url, requestObj);
};

export const getStaffList = async (requestObj) => {
  let url = Configs.BASE_URL + "user/get-zoo-staff";
  return sendPostData(url, requestObj);
};

// export const getStaffList = async (requestObj) => {
//   let url = Configs.BASE_URL + "/user/listing";
//   return sendPostData(url,requestObj);
// };
export const getStaffDetails = async (id) => {
  let url = Configs.BASE_URL + "user/get-staff-details";
  return sendGetRequest(url, id);
};
export const getDeviceLoggedDetails = async (id, page) => {
  let url =
    Configs.BASE_URL + `user/devices?user_id=${id}&page_no=${page}&status=`;
  return sendGetRequest(url);
};
export const DeviceDeRegister = async (requestObj) => {
  let url =
    Configs.BASE_URL +
    `device/update-user-status?user_id=${requestObj?.user_id}&device_id=${requestObj?.device_id}`;
  return sendGetRequest(url);
};
export const emailExist = async (requestObj) => {
  let url = Configs.BASE_URL + "user/email-check";
  return sendPostData(url, requestObj);
};

export const updateUserStatus = async (requestObj) => {
  let url = Configs.BASE_URL + "user/update-status";
  return sendPostData(url, requestObj);
};

export const mobileExist = async (requestObj) => {
  let url = Configs.BASE_URL + "user/mobile-check";
  return sendPostFormData(url, requestObj);
};
export const SuggestUsername = async (requestObj) => {
  let url = Configs.BASE_URL + "user/suggest-username";
  return sendPostData(url, requestObj);
};

//api for device details
export const manageDeviceLog = async (requestObj) => {
  let url = Configs.BASE_URL + "logdata/add";
  return sendPostData(url, requestObj);
};
// for generate passcode
export const Generatepasscode = async (requestObj) => {
  let url = Configs.BASE_URL + "generate/passcode";
  return sendPostData(url, requestObj);
};

// for Check passcode
export const checkPasscode = async (requestObj) => {
  let url = Configs.BASE_URL + "check/passcode";
  return sendPostData(url, requestObj);
};

// /reset/passcode
export const resetPasscode = async (requestObj) => {
  let url = Configs.BASE_URL + "reset/passcode";
  return sendPostData(url, requestObj);
};
export const resetPasscodeForDiffUser = async (requestObj) => {
  let url = Configs.BASE_URL + "reset/passcode";
  return sendPostFormData(url, requestObj);
};
//for role list
export const getRoleListDetails = async (id) => {
  let url = Configs.BASE_URL + "role/list";
  return sendGetRequest(url, id);
};

export const getRoleListFilterData = async (id) => {
  let url = Configs.BASE_URL + "rolepermission/get-user-by-role-id";
  return sendGetRequest(url, id);
};
// qrcode/details?type=animal&id=189' \
// --data ''
export const QrGetDetails = async (requestObj) => {
  let url = Configs.BASE_URL + `qrcode/details`;
  return sendGetRequest(url, requestObj);
};

export const createLab = async (requestObj, files) => {
  let url = Configs.BASE_URL + "antz/labs/create-lab";
  return sendPostFormData(url, requestObj, files, "image");
};
export const getSampleAndTests = async () => {
  let url = Configs.BASE_URL + `antz/get-sample-tests`;
  return sendGetRequest(url);
};

export const getLabList = async (zooID, page_no) => {
  let url =
    Configs.BASE_URL + `antz/labs/list-labs/${zooID}?page_no=${page_no}`;
  return sendGetRequest(url);
};

export const getUserLabs = async (requestObj) => {
  let url = Configs.BASE_URL + `user-lab-stats`;
  return sendGetRequest(url, requestObj);
};

export const getUserLabsTests = async (requestObj) => {
  let url = Configs.BASE_URL + `logged-user-lab-test-filter`;
  return sendGetRequest(url, requestObj);
};

export const getUserLabsTestsStats = async (requestObj) => {
  let url = Configs.BASE_URL + `get-lab-statistics-day-wise`;
  return sendGetRequest(url, requestObj);
};
