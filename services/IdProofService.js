import Configs from "../configs/Config";
import { sendPostData, sendGetRequest, sendPostFormData, sendPostFormDataExtra } from "../utils/RequestHelper";

// export const AddIdProofService = async(requestObj) =>{
//   let url = Configs.BASE_URL + "user/add-user-id-proof"
//   return sendPostData(url, requestObj)
// }

export const AddIdProofService = async (requestObj, files) => {
  let url = Configs.BASE_URL + "user/add-user-id-proof";
  return sendPostFormData(url, requestObj, files, "doc_file[]");
};
export const EditIdProofService = async (requestObj,files) => {
  let url = Configs.BASE_URL + "user/edit-user-id-proof";
  return sendPostFormData(url, requestObj);
};
export const DeleteIdProofService = async (requestObj) => {
  let url = Configs.BASE_URL + "user/delete-user-id-proof";
  return sendPostFormDataExtra(url, requestObj);
};

export const DeleteIdProofImg = async(requestObj)=>{
  let url = Configs.BASE_APP_URL + 'api/user/hard-delete-user-id-proof';
  return sendPostFormData(url, requestObj);
  
}

export const GetIdProofService = async(requestObj) =>{
  let url = Configs.BASE_URL + "user/get-user-id-proof"
  return sendGetRequest(url, requestObj)
  
}
export const getIdProofsForm = async() =>{
  let url = Configs.BASE_URL + "masters/idproofs/form"
  return sendGetRequest(url)
}
export const getIdProofsList = async(requestObj) =>{
  let url = Configs.BASE_URL + "user/not-assigned-idproofs"
  return sendGetRequest(url, requestObj)
}
