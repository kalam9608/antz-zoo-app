import * as FileSystem from "expo-file-system";
import React, { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform, ActivityIndicator } from "react-native";
import * as Notifications from "expo-notifications";
import { AntDesign, Feather, Octicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import Loader from "./Loader";
import * as WebBrowser from "expo-web-browser";
import Colors from "../configs/Colors";
import FontSize from "../configs/FontSize";
import { useSelector } from "react-redux";
import Spacing from "../configs/Spacing";

const { StorageAccessFramework } = FileSystem;

function DownloadFile({ dounlodeStyle, ...props }) {
  const [downloadProgress, setDownloadProgress] = React.useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isFileSave, setIsFileSave] = useState(false);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  const downloadPath =
    FileSystem.documentDirectory + (Platform.OS == "android" ? "" : "");

  const ensureDirAsync = async (dir, intermediates = true) => {
    const props = await FileSystem.getInfoAsync(dir);
    if (props.exist && props.isDirectory) {
      return props;
    }
    let _ = await FileSystem.makeDirectoryAsync(dir, { intermediates });
    return await ensureDirAsync(dir, intermediates);
  };

  const downloadCallback = (downloadProgress) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    setDownloadProgress(progress);
  };

  const download = async (link) => {
    setIsLoading(true);
    let fileUrl = link;
    let name = fileUrl.substring(fileUrl.lastIndexOf("/") + 1, fileUrl.length);
    if (Platform.OS == "ios") {
      let result = await WebBrowser.openBrowserAsync(link);
      setIsLoading(false);
      return;
    } else {
      const dir = ensureDirAsync(downloadPath);
    }

    const downloadResumable = FileSystem.createDownloadResumable(
      fileUrl,
      downloadPath + name,
      {},
      downloadCallback
    );

    try {
      const { uri } = await downloadResumable.downloadAsync();
      if (Platform.OS == "android") saveAndroidFile(uri, name);
    } catch (e) {
      setIsLoading(false);
      errorToast("Oops!", "Something went wrong!!");
    }
  };

  const saveAndroidFile = async (fileUri, fileName) => {
    try {
      const fileString = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const permissions =
        await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        setIsLoading(false);
        return;
      }

      try {
        let ext = fileName.split(".")[1];
        await StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          fileName,
          `application/${ext}`
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, fileString, {
              encoding: FileSystem.EncodingType.Base64,
            });
            setIsLoading(false);
            setIsFileSave(true);
          })
          .catch((e) => {
            setIsLoading(false);
          });
      } catch (e) {
        setIsLoading(false);
        throw new Error(e);
      }
    } catch (err) {}
  };

  return (
    <>
      <Loader visible={isLoading} />
      {isFileSave ? (
        <View style={{ flexDirection: "row" }}>
          <Feather
            name="check-circle"
            size={25}
            color={constThemeColor.inversePrimary}
          />
          <Text
            style={[
              reduxColors.loadingText,
              {
                opacity: 0.9,
                marginLeft: 5,
                color: constThemeColor.inversePrimary,
                width: 100
              },
            ]}
          >
            File saved to your device
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[reduxColors.downloadBtn, dounlodeStyle]}
          onPress={() => {
            download(props.url);
          }}
        >
          {props.design ?? (
            <Octicons name="download" size={22}      
                color={
                  props.downlodeIconColor
                    ? props.downlodeIconColor
                    : constThemeColor.onPrimary
                } />
          )}
          <Text style={[reduxColors.loadingText,props.textStyle]}>
            {props.text ?? "Download"}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = (reduxColors) =>
  StyleSheet.create({
    downloadBtn: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: Spacing.small,
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: Spacing.small,
      borderColor: reduxColors.primary,
      backgroundColor: reduxColors.primary,
    },
    loadingText: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      marginHorizontal: 5,
      color: reduxColors.onPrimary,
    },
  });

export default DownloadFile;
