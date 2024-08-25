import { sendPostData, sendGetRequest } from "../utils/RequestHelper";
import Configs from "../configs/Config";



export const getOrganization = async (id) => {
  let url = Configs.BASE_URL + `masters/organization/${id}`
  return sendGetRequest(url)
}

export const addOrganization = async (obj) => {
  let url = Configs.BASE_URL + 'masters/organization'
  return sendPostData(url,obj)
}