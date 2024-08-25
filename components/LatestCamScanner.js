import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useIsFocused } from "@react-navigation/native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Camera, FlashMode } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import Loader from "./Loader";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useToast } from "../configs/ToastConfig";
const windowScreenWidth = Dimensions.get("screen").width;
const windowScreenHeight = Dimensions.get("screen").height;
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const LatestCamScanner = (props) => {
  const isFocused = useIsFocused();
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();
  const [scanned, setScanned] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const navigation = useNavigation();
  const [Flash, setFlash] = useState(Camera.Constants.FlashMode.off);

  const askForCameraScanner = () => {
    (async () => {
      BarCodeScanner.requestPermissionsAsync()
        .then((result) => {
          if (result.status === "granted") {
            setScanned(true);
          } else {
            Alert.alert("Please give the permission");
          }
        })
        .catch((error) => errorToast("Oops!", "Something went wrong!!"));
    })();
  };
  const screenHeigt = Dimensions.get("screen").height;
  useEffect(() => {
    if (isFocused) {
      askForCameraScanner();
    } else {
      setScanned(false);
    }
  }, [isFocused]);

  const handleBarCodeScanner = async ({ data }) => {
    if (
      props.route.params.screen == "Transfer" ||
      props.route.params.screen == "Medical" ||
      props.route.params.screen == "Observation"
    ) {
      navigation.goBack();
    }
    try {
      const parseData = JSON.parse(data);
      if (parseData) {
        props.route.params?.dataSendBack(parseData);
        if (props.route.params.screen == "enclosure") {
          navigation.navigate("SearchTransferanimal", {
            type: "Select",
          });
        } else if (props.route.params.screen == "Medical") {
          navigation.navigate("AnimalSearchScreen", {
            details: parseData,
          });
        } else if (props.route.params.screen == "Transfer") {
          navigation.navigate("CommonAnimalSelect", {
            details: parseData,
            screenName: props.route.params.screen,
          });
        } else if (props.route.params.screen == "Observation") {
          navigation.navigate("AnimalSearchScreen", {
            details: parseData,
          });
        } else {
          navigation.goBack();
        }
      }
      setisLoading(false);
    } catch {
      errorToast("Wrong QR code scanned!!");
      setisLoading(false);
      gotoBack();
    }
  };

  const gotoBack = () => {
    setScanned(false);
    navigation.goBack();
  };

  const pickImage = async () => {
    // pick an image from gallery
    setisLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      try {
        const scannedResults = await BarCodeScanner.scanFromURLAsync(
          result?.assets[0].uri
        );
        await handleBarCodeScanner(scannedResults[0]);
      } catch (error) {
        errorToast("Wrong QR code scanned!!");
        setisLoading(false);
        gotoBack();
      }
    } else {
      setisLoading(false);
    }
  };
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <>
      {scanned && (
        <Camera
          onBarCodeScanned={handleBarCodeScanner}
          ratio="16:9"
          style={StyleSheet.absoluteFillObject}
          flashMode={Flash}
        />
      )}
      <Loader visible={isLoading} />
      <View
        style={{
          alignItems: "center",
          marginTop: "auto",
          marginBottom: "auto",
          width: windowScreenWidth,
          height: windowScreenHeight,
        }}
      >
        <View style={[reduxColors.container1]}>
          <View style={reduxColors.child1}></View>
          <View style={reduxColors.child2}></View>
        </View>
        <View style={reduxColors.qrCodeSacnBox}></View>
        <View style={[reduxColors.container2]}>
          <View style={reduxColors.child3}></View>
          <View style={reduxColors.child4}></View>
        </View>
      </View>
      <View
        style={{
          // position:"relative",
          justifyContent: "space-around",
          flexDirection: "row",
          bottom:
            Platform.OS == "android"
              ? heightPercentageToDP("20%")
              : Platform.OS == "ios"
              ? heightPercentageToDP("16%")
              : "1%",
          width: widthPercentageToDP("50%"),
          alignSelf: "center",
        }}
      >
        <TouchableOpacity onPress={pickImage}>
          <MaterialIcons
            name="insert-photo"
            size={30}
            color={constThemeColor.onPrimary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setFlash(
              Flash === Camera.Constants.FlashMode.off
                ? Camera.Constants.FlashMode.torch
                : Camera.Constants.FlashMode.off
            );
          }}
        >
          <FontAwesome
            name="flash"
            size={30}
            color={
              Flash == Camera.Constants.FlashMode.torch
                ? constThemeColor.primaryContainer
                : constThemeColor.onPrimary
            }
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          alignSelf: "center",
          bottom: "5%",
          width: widthPercentageToDP("30%"),
          height: heightPercentageToDP("5%"),
          justifyContent: "center",
          borderColor: constThemeColor.onPrimary,
          borderWidth: 1,
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            color: constThemeColor.onPrimary,
            fontSize: FontSize.Antz_Medium_Medium.fontSize,
            fontWeight: FontSize.Antz_Medium_Medium.fontWeight,
            alignSelf: "center",
          }}
        >
          Close
        </Text>
      </TouchableOpacity>
    </>
  );
};
export default LatestCamScanner;
const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    container1: {
      width: widthPercentageToDP("70%"),
      flex: 1 / 2,
      justifyContent: "space-between",
      flexDirection: "row",
      position: "absolute",
      alignItems: "center",
      top: heightPercentageToDP("35%"),
    },
    container2: {
      width: widthPercentageToDP("70%"),
      flex: 1 / 2,
      justifyContent: "space-between",
      flexDirection: "row",
      top: heightPercentageToDP("40%"),
      alignItems: "center",
    },

    child1: {
      width: widthPercentageToDP("16%"),
      height: heightPercentageToDP("8%"),
      borderLeftWidth: 2.5,
      borderTopWidth: 2.5,
      borderColor: reduxColors.primaryContainer,
    },
    child2: {
      width: widthPercentageToDP("16%"),
      height: heightPercentageToDP("8%"),
      borderTopWidth: 2.5,
      borderRightWidth: 2.5,
      borderColor: reduxColors.primaryContainer,
    },
    child3: {
      width: widthPercentageToDP("16%"),
      height: heightPercentageToDP("8%"),
      borderBottomWidth: 2.5,
      borderLeftWidth: 2.5,
      borderColor: reduxColors.primaryContainer,
    },
    child4: {
      width: widthPercentageToDP("16%"),
      height: heightPercentageToDP("8%"),
      borderBottomWidth: 2.5,
      borderRightWidth: 2.5,
      borderColor: reduxColors.primaryContainer,
    },
    qrCodeSacnBox: {
      width: Math.floor((windowWidth * 68) / 100),
      height: Math.floor((windowWidth * 68) / 100),
      borderColor: reduxColors.onPrimary,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderRadius: 30,
      position: "absolute",
      zIndex: 1,
      top: "26.3%",
    },
  });
