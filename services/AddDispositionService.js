// created by ganesh 
// Date:- 31 march 2023
// work:-
//  1.mannerOfDeath
//  2.carcassCondition
//  3.carcassDisposition


import { sendPostData, sendGetRequest, sendPostFormData } from "../utils/RequestHelper";
import Configs from "../configs/Config";



export const addanimalmortality = async (requestObj,files,key) => {
  let url = Configs.BASE_URL + "animal/addanimalmortality"
  return sendPostFormData(url, requestObj,files,key)
}

// Edit Mortality==/animal/editanimalmortality
export const editAnimalMortality = async (requestObj) => {
  let url = Configs.BASE_URL + "animal/editanimalmortality"
  return sendPostData(url, requestObj)
}
export const deleteMortalityMedia = async (requestObj) => {
  let url = Configs.BASE_URL + "hard-delete-mortality-media"
  return sendPostData(url, requestObj)
}
export const addMortalityMedia = async (requestObj,files,key) => {
  let url = Configs.BASE_URL + "animal/add-mortality-media"
  return sendPostFormData(url, requestObj,files,key)
}

export const getAnimal = async (requestObj) => {
  let url = Configs.BASE_URL + "animals"
  return sendGetRequest(url, requestObj)
}
export const mannerOfDeath = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/mannerofDeath";
  return sendGetRequest(url, requestObj);
};


export const carcassCondition = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/carcassCondition";
  return sendGetRequest(url, requestObj);
};


export const carcassDisposition = async (requestObj) => {
  let url = Configs.BASE_URL + "masters/carcassDisposition";
  return sendGetRequest(url, requestObj);
};
