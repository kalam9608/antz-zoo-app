import Configs from "../configs/Config";
import {
  sendPostData,
  sendGetRequest,
  sendPostFormData,
  sendPostFormDataForMedicine,
} from "../utils/RequestHelper";

// MAnufacturer List and Add
export const GetListZooManufacturer = async (count, search, obj) => {
  let url =
    Configs.BASE_URL +
    `v1/master/pharma/manufacture/list?page=${count}&limit=10&sort=${obj.sort}&q=${search}&column=${obj.column}`;
  return sendGetRequest(url);
};
export const AddManufacture = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/master/pharma/manufacture/add";
  return sendPostFormData(url, requestObj);
};

// Package List and add
export const GetListZooPackages = async (count, search, obj) => {
  let url =
    Configs.BASE_URL +
    `v1/master/pharma/packages/list?page=${count}&limit=10&sort=${obj.sort}&q=${search}&column=${obj.column}`;
  return sendGetRequest(url);
};
export const AddPackages = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/master/pharma/packages/add";
  return sendPostFormData(url, requestObj);
};

// UOM List and add
export const GetListZooUom = async (count, search, obj) => {
  let url =
    Configs.BASE_URL +
    `v1/master/pharma/uom/list?page=${count}&limit=10&sort=${obj.sort}&q=${search}&column=${obj.column}`;
  return sendGetRequest(url);
};
export const AddUom = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/master/pharma/uom/add";
  return sendPostFormData(url, requestObj);
};

// ProductForm List and Add
export const GetListZooProductforms = async (count, search, obj) => {
  let url =
    Configs.BASE_URL +
    `v1/master/pharma/productforms/list?page=${count}&limit=10&sort=${obj.sort}&q=${search}&column=${obj.column}`;
  return sendGetRequest(url);
};
export const AddProductforms = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/master/pharma/productforms/add";
  return sendPostFormData(url, requestObj);
};

// Salt Composition list and Add
export const GetListZooSalts = async (count, search, obj) => {
  let url =
    Configs.BASE_URL +
    `v1/master/pharma/salts/list?page=${count}&limit=10&sort=${obj.sort}&q=${search}&column=${obj.column}`;
  return sendGetRequest(url);
};
export const AddSalts = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/master/pharma/salts/add";
  return sendPostFormData(url, requestObj);
};

// Drugs List and Add
export const GetListZooDrugs = async (count, search, obj) => {
  let url =
    Configs.BASE_URL +
    `v1/master/pharma/drugclass/list?page=${count}&limit=10&sort=${obj.sort}&q=${search}&column=${obj.column}`;
  return sendGetRequest(url);
};
export const AddDrugs = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/master/pharma/drugclass/add";
  return sendPostFormData(url, requestObj);
};

// Storage Add and List
export const GetListZooDrugStorage = async (count, search, obj) => {
  let url =
    Configs.BASE_URL +
    `v1/master/pharma/storage/list?page=${count}&limit=10&sort=${obj.sort}&q=${search}&column=${obj.column}`;
  return sendGetRequest(url);
};
export const AddDrugStorage = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/master/pharma/storage/add";
  return sendPostFormData(url, requestObj);
};

// Gst TAX list and Add
export const AddGSTtaxslab = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/master/taxslab/add";
  return sendPostFormData(url, requestObj);
};

export const GetListZooGSTtaxslab = async (count, search, obj) => {
  let url =
    Configs.BASE_URL +
    `v1/master/taxslab/list?page=${count}&limit=10&sort=${obj.sort}&q=${search}&column=${obj.column}`;
  return sendGetRequest(url);
};
// v1/master/pharma/stock/add
export const AddStockMedicine = async (requestObj, dataArray, files) => {
  let url = Configs.BASE_URL + "v1/pharma/stock/add";
  return sendPostFormDataForMedicine(
    url,
    dataArray,
    requestObj,
    files,
    "image"
  );
};
///v1/pharma/stock/update/1
export const UpdateStockMedicine = async (requestObj, dataArray, files, id) => {
  let url = Configs.BASE_URL + `v1/pharma/stock/update/${id}`;
  return sendPostFormDataForMedicine(
    url,
    dataArray,
    requestObj,
    files,
    "image"
  );
};
// v1/master/pharma/stock/list?page=1&limit=10
export const GetListZooStockMedicineList = async (count, search, obj) => {
  let url =
    Configs.BASE_URL +
    `v1/pharma/stock/list?page=${count}&limit=10&sort=${obj.sort}&q=${search}&column=${obj.column}`;
  return sendGetRequest(url);
};

// v1/pharma/store/list?sort=asc&q=&column=name&page=1&limit=7
export const GetListZooStoreList = async (count, obj,search) => {
  let url =
    Configs.BASE_URL +
    // "v1/master/pharma/store/list?sort=asc&q=&column=name&page=1&limit=7"
    // `v1/pharma/store/list?sort=${"asc"}&q=&column=${obj.column}&page=${count}&limit=7`
    `v1/pharma/store/list?page=${count}&limit=10&sort=${obj.sort}&q=${search}&column=${obj.column}`;
  return sendGetRequest(url);
};
// http://3.7.13.80/api/supplier
export const GetListZooSupplierList = async (count, obj) => {
  let url =
    Configs.BASE_URL +"supplier"
    // "v1/master/pharma/store/list?sort=asc&q=&column=name&page=1&limit=7"
    // `v1/pharma/store/list?sort=${"asc"}&q=&column=${obj.column}&page=${count}&limit=7`
    // `v1/pharma/store/list?page=${count}&limit=10&sort=${obj.sort}&q=${search}&column=${obj.column}`;
  return sendGetRequest(url);
};
// v1/pharma/store/add
export const AddStoreNew = async (requestObj) => {
  let url = Configs.BASE_URL + "v1/pharma/store/add";
  return sendPostData(url, requestObj);
};
// add-supplier
export const AddSupplierNew = async (requestObj) => {
  let url = Configs.BASE_URL + "supplier/add";
  return sendPostData(url, requestObj);
};
// v1/master/pharma/manufacture/edit/1
export const EditManufacture = async (requestObj,id) => {
  let url = Configs.BASE_URL + `v1/master/pharma/manufacture/edit/${id}`;
  return sendPostFormData(url, requestObj);
};
// /v1/master/pharma/packages/edit/1
export const EditPackages = async (requestObj,id) => {
  let url = Configs.BASE_URL + `v1/master/pharma/packages/edit/${id}`;
  return sendPostFormData(url, requestObj);
};
// /api/v1/master/pharma/uom/edit/1
export const EditUom = async (requestObj,id) => {
  let url = Configs.BASE_URL + `v1/master/pharma/uom/edit/${id}`;
  return sendPostFormData(url, requestObj);
};
// API URL:- POST  /api/v1/master/pharma/salts/edit/1
export const EditSalts = async (requestObj,id) => {
  let url = Configs.BASE_URL + `v1/master/pharma/salts/edit/${id}`;
  return sendPostFormData(url, requestObj);
};
// v1/master/pharma/productforms/edit/1
export const EditProductForm = async (requestObj,id) => {
  let url = Configs.BASE_URL + `v1/master/pharma/productforms/edit/${id}`;
  return sendPostFormData(url, requestObj);
};
// API URL:- POST  /api/v1/master/pharma/drugclass/edit/1
export const EditDrugClass = async (requestObj,id) => {
  let url = Configs.BASE_URL + `v1/master/pharma/drugclass/edit/${id}`;
  return sendPostFormData(url, requestObj);
};
// API URL:- POST  /api/v1/master/pharma/storage/edit/1
export const EditStorage = async (requestObj,id) => {
  let url = Configs.BASE_URL + `v1/master/pharma/storage/edit/${id}`;
  return sendPostFormData(url, requestObj);
};
// API URL:- POST  /api/v1/master/taxslab/edit/1
export const EditGSTtaxslab = async (requestObj,id) => {
  let url = Configs.BASE_URL + `v1/master/taxslab/edit/${id}`;
  return sendPostFormData(url, requestObj);
};
