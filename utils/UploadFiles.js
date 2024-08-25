{
  /*
@author -   Arnab Gupta
date -      13.4.24
params -    errorToast,                 for errortoast
            mediaTypes = string         type of files(image/video/gallery/audio/doc)
            setIsLoading = true/false   Handle Loader, default false
            prevData = []               previous all files
            multiple = true/false       Allows multiple files to be selected from the system UI, default false
            modalVisible = true/false   Allows modal open or close
function -  await handleFilesPick(errorToast, "image", setIsLoading, selectedItems, true, setModalVisible)
*/
}
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import AlertAsync from "react-native-alert-async";
import Constants from "../configs/Constants";
import { getDocumentData, getFileData } from "./Utils";
import {
  audioType,
  documentType,
  galeryType,
  imageType,
  videoType,
} from "../configs/Config";
import { getAsyncData } from "./AsyncStorageHelper";
import { Alert, Linking } from "react-native";

export const handleFilesPick = async (
  errorToast,
  mediaTypes,
  setIsLoading = () => {},
  prevData = [],
  multiple = false,
  modalVisible = () => {}
) => {
  let selectedFiles = prevData;
  let notSelectedFiles = [];
  try {
    setIsLoading(true);
    let type = "*/*";
    let MAX_SIZE = 26214400;
    let MAX_NUMBER = 5;
    const antz_max_upload_sizes = await getAsyncData("@antz_max_upload_sizes");

    if (mediaTypes == "image") {
      type = imageType;
      MAX_SIZE = antz_max_upload_sizes.MAX_IMAGE_UPLOAD_SIZE;
      MAX_NUMBER = antz_max_upload_sizes.MAX_NUMBER_IMAGE_FILE;
    } else if (mediaTypes == "camera") {
      type = videoType;
      MAX_SIZE = antz_max_upload_sizes.MAX_VIDEO_UPLOAD_SIZE;
      MAX_NUMBER = antz_max_upload_sizes.MAX_NUMBER_VIDEO_FILE;
    } else if (mediaTypes == "video") {
      type = videoType;
      MAX_SIZE = antz_max_upload_sizes.MAX_VIDEO_UPLOAD_SIZE;
      MAX_NUMBER = antz_max_upload_sizes.MAX_NUMBER_VIDEO_FILE;
    } else if (mediaTypes == "gallery") {
      type = galeryType;
      MAX_SIZE = antz_max_upload_sizes.MAX_VIDEO_UPLOAD_SIZE;
      MAX_NUMBER = antz_max_upload_sizes.MAX_NUMBER_VIDEO_FILE;
    } else if (mediaTypes == "audio") {
      type = audioType;
      MAX_SIZE = antz_max_upload_sizes.MAX_AUDIO_UPLOAD_SIZE;
      MAX_NUMBER = antz_max_upload_sizes.MAX_NUMBER_AUDIO_FILE;
    } else if (mediaTypes == "doc") {
      type = documentType;
      MAX_SIZE = antz_max_upload_sizes.MAX_APPLICATION_UPLOAD_SIZE;
      MAX_NUMBER = antz_max_upload_sizes.MAX_NUMBER_APPLICATION_FILE;
    }
    const result = await DocumentPicker.getDocumentAsync({
      type: type,
      multiple: multiple,
    });

    if (!result.canceled) {
      result?.assets.forEach((asset) => {
        if (asset.size <= MAX_SIZE) {
          if (
            selectedFiles?.filter((i) => type.includes(i.type))?.length ==
            MAX_NUMBER
          ) {
            errorToast(
              "",
              `Exceeded the file limit!, Can't choose more than ${MAX_NUMBER} File`
            );
            modalVisible(false);
          } else {
            selectedFiles.push(getDocumentData(asset));
          }
        } else {
          notSelectedFiles.push(asset.name);
        }
      });
    } else {
      setIsLoading(false);
    }
    if (notSelectedFiles.length > 0) {
      errorToast(
        "",
        `${notSelectedFiles.join(
          ", "
        )} Can't choose file greater than ${Math.round(
          MAX_SIZE / 1024 / 1024
        )} MB`
      );
      modalVisible(false);
    }
  } catch (err) {
    errorToast("", `Error picking image`);
    modalVisible(false);
  } finally {
    setIsLoading(false);
  }
  return selectedFiles;
};

export const takeCameraFiles = async (errorToast, prevData) => {
  let selectedFiles = prevData;
  let notSelectedFiles = [];
  try {
    const antz_max_upload_sizes = await getAsyncData("@antz_max_upload_sizes");
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Confirmation",
        "Access denied, would you like to grant permission?",
        [
          { text: "No", style: "cancel", onPress: () => {} },
          { text: "Yes", onPress: () => Linking.openSettings() },
        ],
        { cancelable: false }
      );
      return;
    }

    const choice = await AlertAsync(
      "Select Media",
      "Would you like to take a picture or record a video?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => Promise.resolve("no"),
        },
        {
          text: "Image",
          onPress: async () => "image",
        },
        {
          text: "Video",
          onPress: async () => "video",
        },
      ]
    );
    if (choice === "image") {
      return await pickCameraFile(
        ImagePicker.MediaTypeOptions.Images,
        antz_max_upload_sizes.MAX_IMAGE_UPLOAD_SIZE,
        selectedFiles,
        notSelectedFiles
      );
    } else if (choice === "video") {
      return await pickCameraFile(
        ImagePicker.MediaTypeOptions.Videos,
        antz_max_upload_sizes.MAX_VIDEO_UPLOAD_SIZE,
        selectedFiles,
        notSelectedFiles
      );
    }
  } catch (err) {
    errorToast("", `Error picking image`);
    console.log("Error picking image:", err);
  }
  return selectedFiles;
};

const pickCameraFile = async (
  pickerOption,
  MAX_SIZE,
  selectedFiles,
  notSelectedFiles
) => {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: pickerOption,
  });

  if (!result.canceled) {
    result?.assets.forEach((asset) => {
      if (asset?.fileSize ?? asset?.filesize <= MAX_SIZE) {
        // if (selectedFiles.length == MAX_NUMBER) {
        //   errorToast(
        //     "",
        //     `Exceeded the file limit!, Can't choose more than ${MAX_NUMBER} File`
        //   );
        // } else {
        selectedFiles.push(getFileData(asset));
        // }
      } else {
        notSelectedFiles.push(asset.fileName);
      }
    });
  }
  if (notSelectedFiles.length > 0) {
    errorToast(
      "",
      `${notSelectedFiles.join(
        ", "
      )} Can't choose file greater than ${Math.round(
        MAX_SIZE / 1024 / 1024
      )} MB`
    );
  }
  return selectedFiles;
};
