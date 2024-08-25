import moment from "moment";
import * as Device from "expo-device";
import * as Application from "expo-application";
import * as Network from "expo-network";
import * as Location from "expo-location";
import * as mime from "react-native-mime-types";
import { usePermission } from "../components/Custom_hook/UserPermissionHook";
import * as Notifications from "expo-notifications";
import { warningToast } from "./Alert";
import { Linking, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { DeviceType, getDeviceTypeAsync } from "expo-device";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import Configs from "../configs/Config";
import Constants from "expo-constants";

export const getFileInfo = async (file) => {
  const fileInfo = await FileSystem.getInfoAsync(file?.uri);
  return { ...fileInfo, type: file?.type, name: file?.name };
};

export const isLessThanTheMB = (fileSize, smallerThanSizeMB) => {
  const isOk = fileSize / 1024 / 1024 < smallerThanSizeMB;
  return isOk;
};

export const getFileData = (obj) => {
  let uri = obj.uri;

  let arr = uri.split("/");
  let fileName = arr[arr.length - 1];

  let extArr = fileName.split(".");
  let extention = extArr[extArr.length - 1];

  return {
    uri: uri,
    name: fileName,
    type: mime.lookup(fileName),
  };
};

export const getDocumentData = (obj) => {
  return {
    uri: obj.uri,
    name: obj.name,
    type: obj.mimeType ? obj.mimeType : obj.type,
  };
};

export const getObjFromDynamicForm = (arr) => {
  var obj = {};
  for (var i = 0; i < arr.length; ++i) {
    obj[arr[i].key] = arr[i].value;
  }
  return obj;
};

export const getDeviceInformation = async () => {
  // let { status } = await Location.requestForegroundPermissionsAsync();
  const deviceTypeMap = {
    [DeviceType.UNKNOWN]: "unknown",
    [DeviceType.PHONE]: "phone",
    [DeviceType.TABLET]: "tablet",
    [DeviceType.DESKTOP]: "desktop",
    [DeviceType.TV]: "tv",
  };
  let deviceType = await getDeviceTypeAsync();
  const device_id =
    Platform.OS == "android"
      ? await Application.getAndroidId()
      : await getUniqueDeviceId();
  const obj = {
    brand: Device.brand,
    manufacturer: Device.manufacturer,
    modelName: Device.modelName,
    modelId: Device.modelId,
    osName: Device.osName,
    osVersion: Device.osVersion,
    osBuildId: Device.osBuildId,
    deviceName: Device.deviceName,
    DeviceType: deviceTypeMap[deviceType],
    device_id: device_id,
    buildVersion: Application.nativeBuildVersion,
    ipAddress: await Network.getIpAddressAsync(),
    networkState: await Network.getNetworkStateAsync(),
  };
  return await {
    device: JSON.stringify(obj),
    device_id: device_id,
    long: null,
    lat: null,
  };

  // if (status !== "granted") {
  // }
  // if (Device.isDevice) {
  //   try {
  //     let location = await Location.getCurrentPositionAsync({});
  //     console.log("From utils location", { location });
  //     return await {
  //       device: JSON.stringify(obj),
  //       long: location.coords.longitude.toString(),
  //       lat: location.coords.latitude.toString(),
  //     };
  //   } catch (e) {
  //     console.log({ e });
  //     // errorToast("Oops!", "Something went wrong!!");
  //   }
  // } else {
  //   return await { device: JSON.stringify(obj), long: null, lat: null };
  // }
};

export const getUniqueDeviceId = async () => {
  let deviceUniqueId = await SecureStore.getItemAsync("deviceUniqueId");
  if (!deviceUniqueId) {
    deviceUniqueId = Crypto.randomUUID(); //or generate uuid
    await SecureStore.setItemAsync("deviceUniqueId", deviceUniqueId);
  }
  return deviceUniqueId;
};

export const getDeviceData = async () => {
  const deviceTypeMap = {
    [DeviceType.UNKNOWN]: "unknown",
    [DeviceType.PHONE]: "phone",
    [DeviceType.TABLET]: "tablet",
    [DeviceType.DESKTOP]: "desktop",
    [DeviceType.TV]: "tv",
  };
  const response = await Promise.all([
    getDeviceTypeAsync(),
    getDeviceToken(),
    getUniqueDeviceId(),
  ]);
  return {
    device_token: response[1] && response[1].data ? response[1].data : "",
    device_id:
      Platform.OS == "android" ? Application.getAndroidId() : response[2],
    device_name: Device.deviceName,
    device_model: Device.modelName,
    device_type: deviceTypeMap[response[0]],
    experience_id: Configs.EXPERIENCE_ID,
  };
};

export const capitalize = (s) => {
  if (!s) {
    return s;
  }
  let str = s && s.toLowerCase();
  return getTextWithoutExtraSpaces(str[0].toUpperCase() + str.slice(1));
};

export const capitalizeFirstLetterAndUppercaseRest = (input) => {
  if (input && typeof input === "string") {
    const firstLetter = input.charAt(0);
    const restOfString = input.slice(1);
    if (firstLetter === firstLetter.toLowerCase()) {
      // If the first letter is lowercase, capitalize it and convert the rest to uppercase
      return firstLetter.toUpperCase() + restOfString.toUpperCase();
    } else {
      // If the first letter is already uppercase, keep it as it is and convert the rest to uppercase
      return firstLetter + restOfString.toUpperCase();
    }
  } else {
    // Handle non-string input or empty string
    return input;
  }
};

export const getCapitalizeTextWithoutExtraSpaces = (text) => {
  const words = text.replace(/\s+/g, " ").trim().split(" ");

  return words
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");
};

export const getTextWithoutExtraSpaces = (text) => {
  const words = text.replace(/\s+/g, " ").trim().split(" ");

  return words.join(" ");
};

export const ifEmptyValue = (s) => {
  if (typeof s == "number") {
    return 0;
  } else if (typeof s == "undefined") {
    return "-";
  } else if (s == null || s == "") {
    return "NA";
  } else if (s == "Invalid date") {
    return "NA";
  }
  return getTextWithoutExtraSpaces(s);
};

export const dateFormatter = (date, format) => {
  if (date) {
    return moment(date).format(format ?? "Do MMM YY");
  }
  return null;
};

export const shortenNumber = (number) => {
  if (isNaN(number)) {
    return number;
  }
  if (number < 10000) {
    return number?.toString();
  }

  const suffixes = ["", "K", "M", "B", "T"];
  let suffixNum = 0;
  let shortNumber = number;

  while (shortNumber >= 1000 && suffixNum < suffixes.length - 1) {
    shortNumber /= 1000;
    suffixNum++;
  }

  const roundedNumber = Math.floor(shortNumber * 100) / 100;
  return number ? roundedNumber + suffixes[suffixNum] : "NA";
};

//Use this if needs to shorten number lesser tha 10,000
export const shortenSmallerNumber = (number) => {
  if (isNaN(number)) {
    return number;
  }

  if (number <= 999) {
    return number?.toString();
  }

  const suffixes = ["", "K", "M", "B", "T"];
  let suffixNum = 0;
  let shortNumber = number;

  while (shortNumber >= 1000 && suffixNum < suffixes.length - 1) {
    shortNumber /= 1000;
    suffixNum++;
  }
  var roundedNumber = shortNumber;
  if (Math.floor(shortNumber * 100) / 100 <= 9999) {
    var shortenedNumber = Math.floor(shortNumber * 100) / 100;
    let result =
      shortenedNumber % 1 === 0
        ? shortenedNumber.toFixed(0)
        : shortenedNumber.toFixed(1);
    roundedNumber = result;
  } else {
    roundedNumber = (Math.floor(shortNumber * 100) / 100).toFixed();
  }
  return number ? roundedNumber + suffixes[suffixNum] : "NA";
};

export const removeUnderScore = (string) => {
  const newString = string.replace(/_/g, " ").replace(/\w+/g, function (str) {
    return str[0].toUpperCase() + str.slice(1);
  });
  return newString;
};
export const getCurrentDateWithTime = () => {
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthIndex = currentDate.getMonth();
  const month = monthNames[monthIndex];
  const year = currentDate.getFullYear();
  const hour = currentDate.getHours();
  const minute = currentDate.getMinutes().toString().padStart(2, "0");
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  const formattedDate = `${day} ${month} ${year}, ${formattedHour}:${minute} ${ampm}`;

  return formattedDate;
};

export const severityColor = (type) => {
  let color = "#AFEFEB";
  if (type == "Moderate") {
    color = "#E4B819"; //"#EFD756";
  } else if (type == "Mild") {
    color = "#00D6C9";
  } else if (type == "High") {
    color = "#FA6140";
  } else if (type == "Extreme") {
    color = "#E93353";
  }
  return color;
};

export function calculateAge(from, to) {
  const today = moment(to);
  const dobMoment = moment(from, "YYYY-MM-DD");
  const duration = moment.duration(today.diff(dobMoment));
  const years = duration.years();
  const months = duration.months();
  const days = duration.days();

  return {
    years: years,
    months: months,
    days: days,
  };
}

export const formatTimeAgo = (date) => {
  if (date == undefined) return null;

  const currentDate = new Date();
  const targetDate = new Date(date);

  const timeDiff = currentDate - targetDate;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  if (daysDiff < 90) {
    if (daysDiff === 0) {
      return "today";
    } else {
      return `${daysDiff} days ago`;
    }
  } else {
    const options = { month: "long", year: "numeric" };
    return targetDate.toLocaleDateString(undefined, options);
  }
};

// permission filter
export const filterData = (data, permission) => {
  return data.filter(
    (item) =>
      permission[item.key] == true ||
      item.key == "not_required" ||
      permission[item.subKey] == "ADD" ||
      permission[item.subKey] == "EDIT" ||
      permission[item.subKey] == "DELETE"
  );
};

export const checkPermissionAndNavigate = (
  permission,
  requiredPermission,
  navigation,
  routeName,
  data,
  userCheck
) => {
  const hasPermission =
    permission[requiredPermission] ||
    requiredPermission == "not_required" ||
    userCheck
      ? true
      : false;

  if (hasPermission) {
    if (data) {
      navigation.navigate(routeName, data); // Navigate when the condition is met
    } else {
      navigation.navigate(routeName); // Navigate when the condition is met
    }
  } else {
    // Handle unauthorized access
    warningToast(
      "Restricted",
      "You do not have permission to access this page!!"
    );
  }
};

export const timeCalculate = (time) => {
  const currentTime = moment();
  const apiMoment = moment(time, "YYYY-MM-DD HH:mm:ss");
  const duration = moment.duration(currentTime.diff(apiMoment));

  if (duration.asSeconds() < 60) {
    return "Just now";
  } else if (duration.asMinutes() < 60) {
    return `${Math.floor(duration.asMinutes())} m`;
  } else if (duration.asHours() < 24) {
    return `${Math.floor(duration.asHours())} h`;
  } else {
    if (duration.asDays() >= 29) {
      return apiMoment.format("DD MMM YYYY");
    } else {
      return `${Math.floor(duration.asDays())} d`;
    }
  }
};

export const checkPermissionAndNavigateWithAccess = (
  permission,
  requiredPermission,
  navigation,
  routeName,
  data,
  accessKey,
  userCheck
) => {
  const status = () => {
    if (permission[requiredPermission] == "VIEW") {
      if (accessKey == "VIEW") {
        return true;
      } else {
        return false;
      }
    } else if (permission[requiredPermission] == "ADD") {
      if (accessKey == "VIEW" || accessKey == "ADD") {
        return true;
      } else {
        return false;
      }
    } else if (permission[requiredPermission] == "EDIT") {
      if (accessKey == "VIEW" || accessKey == "ADD" || accessKey == "EDIT") {
        return true;
      } else {
        return false;
      }
    } else if (permission[requiredPermission] == "DELETE") {
      if (
        accessKey == "VIEW" ||
        accessKey == "ADD" ||
        accessKey == "EDIT" ||
        accessKey == "DELETE"
      ) {
        return true;
      } else {
        return false;
      }
    } else if (permission[requiredPermission] == null) {
      return false;
    } else if (userCheck) {
      return true;
    }
  };

  if (status()) {
    if (data && navigation) {
      navigation.navigate(routeName, data); // Navigate when the condition is met
    } else if (navigation) {
      navigation.navigate(routeName); // Navigate when the condition is met
    }
  } else {
    // Handle unauthorized access
    if (routeName || navigation) {
      warningToast("Restricted", "You do not have permission to access!!");
    }
    return status();
  }
  return status();
};

export const contactFun = (type, phoneNumber) => {
  Linking.openURL(`${type}:${phoneNumber}`);
};

export const LengthDecrease = (length, word) => {
  if (length ? word?.length > length : word?.length > 20) {
    return length
      ? word?.substring(0, length) + "..."
      : word?.substring(0, 20) + "...";
  }
  return word;
};

export const ShortFullName = (word) => {
  if (word) {
    return word
      .split(/\s+/)
      .filter(Boolean)
      .map((word, index, arr) =>
        index === 0 || index === arr.length - 1 || arr.length === 2
          ? word.charAt(0).toUpperCase()
          : ""
      )
      .filter((str) => str !== "")
      .join("");
  }
};

export const getDeviceToken = async () => {
  let token = null;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus === "granted") {
      token = await Notifications.getExpoPushTokenAsync({
        experienceId: Configs.EXPERIENCE_ID,
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
    } else {
      // console.log("Oops!", "Failed to get push token for push notification!");
    }
  } else {
    // console.log("Oops!", "Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
};

export const opacityColor = (colorCode, opacityPercentage) => {
  const baseColor = colorCode;
  const clampedOpacityPercentage = Math.min(
    Math.max(opacityPercentage, 0),
    100
  );

  const opacityMap = [
    "00",
    "03",
    "05",
    "08",
    "0A",
    "0D",
    "0F",
    "12",
    "14",
    "17",
    "1A",
    "1C",
    "1F",
    "21",
    "24",
    "26",
    "29",
    "2B",
    "2E",
    "30",
    "33",
    "36",
    "38",
    "3B",
    "3D",
    "40",
    "42",
    "45",
    "47",
    "4A",
    "4D",
    "4F",
    "52",
    "54",
    "57",
    "59",
    "5C",
    "5E",
    "61",
    "63",
    "66",
    "69",
    "6B",
    "6E",
    "70",
    "73",
    "75",
    "78",
    "7A",
    "7D",
    "80",
    "82",
    "85",
    "87",
    "8A",
    "8C",
    "8F",
    "91",
    "94",
    "96",
    "99",
    "9C",
    "9E",
    "A1",
    "A3",
    "A6",
    "A8",
    "AB",
    "AD",
    "B0",
    "B3",
    "B5",
    "B8",
    "BA",
    "BD",
    "BF",
    "C2",
    "C4",
    "C7",
    "C9",
    "CC",
    "CF",
    "D1",
    "D4",
    "D6",
    "D9",
    "DB",
    "DE",
    "E0",
    "E3",
    "E6",
    "E8",
    "EB",
    "ED",
    "F0",
    "F2",
    "F5",
    "F7",
    "FA",
    "FC",
    "FF",
  ];

  const opacityIndex = Math.round(
    (clampedOpacityPercentage / 100) * (opacityMap.length - 1)
  );
  const opacityHex = opacityMap[opacityIndex];
  return `${baseColor}${opacityHex}`;
};
