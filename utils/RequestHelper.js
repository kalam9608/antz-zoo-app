import { getAsyncData } from "./AsyncStorageHelper";
import Constants from "expo-constants";

const getRawJson = (obj) => {
  let rawJson = JSON.stringify(obj);
  return rawJson;
};

const getFormData = (obj) => {
  let formdata = new FormData();
  for (let key in obj) {
    formdata.append(key, obj[key]);
  }
  return formdata;
};

const getUserToken = async () => {
  var token = "";
  try {
    token = await getAsyncData("@antz_user_token");
    token = `Bearer ${token}`;
  } finally {
    return token;
  }
};

const getZooId = async () => {
  try {
    const data = await getAsyncData("@antz_user_data");
    return data?.user?.zoos[0]?.zoo_id;
  } catch (e) {
    return "";
  }
};

const getSiteId = async () => {
  try {
    const data = await getAsyncData("@antz_selected_site");
    return data?.site_id ? data?.site_id : null;
  } catch (e) {
    return "";
  }
};

export async function sendFileFormData(url, files, key, debug = true) {
  const token = await getUserToken();
  const formData = new FormData();
  formData.append(key, files);
  console.log(url);
  let requestOptions = {
    method: "POST",
    headers: {
      Authorization: token,
      ZooId: await getZooId(),
      SiteId: await getSiteId(),
      Version: Constants.expoConfig.version,
    },
    body: formData,
  };

  let response = await fetch(url, requestOptions);
  if (debug) {
    console.log(await response.text());
    return;
  } else {
    let data = await response.json();
    if (!response.ok) {
      throw new ValidationError(data.message, data.errors);
    }
    return data;
  }
}

export async function sendPostData(url, obj, debug = false) {
  const token = await getUserToken();
  console.log(url);
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
      ZooId: await getZooId(),
      SiteId: await getSiteId(),
      Selectedstore: obj?.Selectedstore ?? null,
      Version: Constants.expoConfig.version,
    },
    body: obj == undefined ? null : getRawJson(obj),
  });
  if (debug) {
    console.log(await response.text());
    return;
  } else {
    let data = await response.json();
    if (!response.ok) {
      console.log(data.message);
      // throw new ValidationError(data.message, data.errors);
    }
    return data;
  }
}

export async function sendPostFormDataForMedicine(
  url,
  dataArray,
  additionalFields,
  files,
  key,
  debug = false
) {
  const token = await getUserToken();
  console.log(url);
  const formDataArray = dataArray.map((item, index) => ({
    [`salts[${index}][salt_name]`]: item.name,
    [`salts[${index}][salt_qty]`]: item.quantity,
    [`salts[${index}][salt_id]`]: item.saltId,
  }));

  const additionalFieldsObject = Object.assign({}, additionalFields);

  let requestOptions = {
    method: "POST",
    headers: {
      Authorization: token,
      ZooId: await getZooId(),
      SiteId: await getSiteId(),
      Version: Constants.expoConfig.version,
    },
    body: getFormData(
      Object.assign({}, ...formDataArray, additionalFieldsObject)
    ),
  };

  if (files != null && files.length > 0) {
    files.forEach((item, i) => {
      requestOptions.body.append(key, item);
    });
  }

  let response = await fetch(url, requestOptions);

  if (debug) {
    console.log(await response.text());
    return;
  } else {
    let data = await response.json();

    if (!response.ok) {
      throw new ValidationError(data.message, data.errors);
    }

    return data;
  }
}

export async function sendPostFormData(url, obj, files, key, debug = false) {
  const token = await getUserToken();
  console.log(url);
  let requestOptions = {
    method: "POST",
    headers: {
      Authorization: token,
      ZooId: await getZooId(),
      SiteId: await getSiteId(),
      Version: Constants.expoConfig.version,
    },
    body: obj == undefined ? null : getFormData(obj),
  };
  if (files != null && files.length > 0) {
    files.forEach((item, i) => {
      requestOptions.body.append(key, item);
    });
  }
  let response = await fetch(url, requestOptions);
  if (debug) {
    console.log(await response.text());
    return;
  } else {
    let data = await response.json();
    if (!response.ok) {
      throw new ValidationError(data.message, data.errors);
    }
    return data;
  }
}
export async function sendPostFormDataExtra(url, obj, files, key) {
  const [token, zooId, siteId] = await Promise.all([
    getUserToken(),
    getZooId(),
    getSiteId(),
  ]);
  const formData = new FormData();
  // non-file data
  if (obj) {
    for (const [k, v] of Object.entries(obj)) {
      formData.append(k, v);
    }
  }
  // files
  if (files && files.length > 0) {
    files.forEach((fileObj) => {
      for (const [fileKey, fileDetails] of Object.entries(fileObj)) {
        if (fileDetails && fileDetails.uri) {
          formData.append(`${key}[${fileKey}]`, {
            uri: fileDetails.uri,
            type: fileDetails.type,
            name: fileDetails.name,
          });
        }
      }
    });
  }
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: token,
      ZooId: zooId,
      SiteId: siteId,
      Version: Constants.expoConfig.version,
    },
    body: formData,
  };
  let response;
  try {
    response = await fetch(url, requestOptions);
  } catch (error) {
    throw new Error("Network request failed: " + error.message);
  }
  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Failed to parse JSON: " + error.message);
  }
  if (!response.ok) {
    throw new ValidationError(data.message, data.errors);
  }
  return data;
}

export async function sendGetRequest(url, params = {}, debug = false) {
  const token = await getUserToken();
  if (Object.keys(params).length != 0) {
    let queryString = new URLSearchParams(params);
    url += "?" + queryString.toString();
  }
  console.log(url);
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: token,
      ZooId: await getZooId(),
      SiteId: await getSiteId(),
      Selectedstore: params?.Selectedstore ?? null,
      Version: Constants.expoConfig.version,
    },
  });
  if (debug) {
    console.log(await response.text());
    return;
  } else {
    let data = await response.json();
    if (!response.ok) {
      throw new ValidationError(data.message, data.errors);
    }
    return data;
  }
}

export class ValidationError extends Error {
  constructor(message, errors = {}) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;
  }
}
