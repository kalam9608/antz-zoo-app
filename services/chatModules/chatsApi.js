import Configs from "../../configs/Config";
import { sendGetRequest, sendPostFormData, sendFileFormData } from "../../utils/RequestHelper";

export const getGroupList = async (userId) => {
  let url = Configs.CHAT_URL + `chat/group-list?user_id=${userId}`;
  return sendGetRequest(url);
};

export const getGroupDetails = async (group_id) => {
  let url = Configs.CHAT_URL + `chat/group-details?group_id=${group_id}`;
  return sendGetRequest(url);
};

export const getGroupMember = async (requestObj) => {
  let url = Configs.CHAT_URL + `chat/group-member`;
  return sendPostFormData(url, requestObj);
};

export const createGroupImage = async (image) => {
  let url = Configs.CHAT_URL + "chat/create-group-image";
  return sendPostFormData(url, image);
};

export const createGroup = async (requestObj) => {
  let url = Configs.CHAT_URL + "chat/group-create";
  return sendPostFormData(url, requestObj);
};

export const groupUpdate = async (requestObj) => {
  let url = Configs.CHAT_URL + "chat/group-update";
  return sendPostFormData(url, requestObj);
};

export const groupAddMember = async (requestObj) => {
  let url = Configs.CHAT_URL + "chat/add-member";
  return sendPostFormData(url, requestObj);
};

export const groupRemoveMember = async (requestObj) => {
  let url = Configs.CHAT_URL + "chat/remove-member";
  return sendPostFormData(url, requestObj);
};

export const sendImage = async (file) => {
  let url = Configs.CHAT_URL + "chat/send-image";
  return sendPostFormData(url, file);
};

export const sendDocuments = async (file) => {
  let url = Configs.CHAT_URL + "chat/send-doc";
  return sendPostFormData(url, file);
};

export const sendAudioFile = async (file) => {
  let url = Configs.CHAT_URL + "chat/send-audio";
  return sendPostFormData(url, file);
};

export const userListforChat = async (requestObj) => {
  let url = Configs.CHAT_URL + "user/chat-users";
  return sendPostFormData(url, requestObj);
};

export const userSeenMessage = async (requestObj) => {
  let url = Configs.CHAT_URL + "chat/update-private-message";
  return sendPostFormData(url, requestObj);
};

export const fetchPrivateMessage = async (requestObj) => {
  let url = Configs.CHAT_URL + "chat/fetch-private-message";
  return sendPostFormData(url, requestObj);
};

export const fetchGroupMessage = async (requestObj) => {
  let url = Configs.CHAT_URL + "chat/fetch-group-message";
  return sendPostFormData(url, requestObj);
};

export const groupSeenMessage = async (requestObj) => {
  let url = Configs.CHAT_URL + "chat/update-group-message";
  return sendPostFormData(url, requestObj);
};