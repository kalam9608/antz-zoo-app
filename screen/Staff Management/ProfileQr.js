import { StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import { Appbar } from "react-native-paper";
import { StatusBar } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import { getStaffDetails } from "../../services/staffManagement/addPersonalDetails";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../components/Loader";
import { Image } from "react-native";
import { Dimensions } from "react-native";
import DownloadFile from "../../components/DownloadFile";
import FontSize from "../../configs/FontSize";
import { ShortFullName, capitalize, opacityColor } from "../../utils/Utils";
import { TouchableOpacity } from "react-native";
import Spacing from "../../configs/Spacing";
import { Animated } from "react-native";
import { AntDesign, Octicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { SvgUri } from "react-native-svg";
import Config from "../../configs/Config";
import ImageComponent from "../../components/ImageComponent";

const ProfileQr = (props) => {
  const [userId, setUserId] = useState(props?.route?.params?.userDetails);
  const [animalDetails, setAnimalDetails] = useState(
    props?.route?.params?.item
  );
  const [enclosureDetails, setEnclosureDetails] = useState(
    props?.route?.params?.enclosure
  );
  const [section, setSection] = useState(props?.route?.params?.section);
  const [userData, setUserData] = useState([]);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (userId) {
        getData();
      }
    });
    return unsubscribe;
  }, [navigation]);
  const getData = () => {
    setIsLoading(true);
    Promise.all([getStaffDetails({ id: userId })])
      .then((res) => {
        setUserData(res[0].data);
      })
      .catch(() => {
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const shareImageAsPDF = async () => {
    const name = userData?.user_first_name + " " + userData?.user_last_name;
    try {
      // Generate a PDF with the user's image and name
      const pdfFile = await Print.printToFileAsync({
        html: `
        <html>

        <body style="margin: 0; padding: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        ${
          userData?.profile_pic
            ? `
              <img src="${userData?.profile_pic}"  width="120" height="120" style="border-radius: 50%;"/>
            `
            : `<div style="border-radius: 50%;
            width: 120px; height: 120px; background-color:${
              constThemeColor.secondary
            };display: flex; justify-content: center; align-items: center;">
            <p style="font-size: 36px; margin-top: 12px; margin-bottom: 8px;color : ${
              constThemeColor.onPrimary
            }">
            ${userData?.user_first_name?.slice(0, 1)}
            ${userData?.user_last_name?.slice(0, 1)}
            </p>
            </div>`
        }
        
        <p style="font-size: 48px; margin-top: 12px; margin-bottom: 8px">${name}</p>
        <p style="font-size: 28px; margin-top: 0px; margin-bottom: -15px;">${
          userData.user_type
        }</p>
          <img src="${userData?.qr_image}" width="90%" height = "70%"/>
          <p style="font-size: 28px;margin-bottom: -50px;">Scan with the Antz App</p>
        </body>
        </html>
      `,
      });
      if (pdfFile.uri) {
        await Sharing.shareAsync(pdfFile.uri, {
          mimeType: "application/pdf",
          dialogTitle: "Share User Profile",
          UTI: "com.adobe.pdf",
        });
      } else {
        console.error("Error generating PDF");
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
    }
  };

  const shareAnimalDetailsImageAsPDF = async () => {
    try {
      // Generate a PDF with the user's image and name
      const pdfFile = await Print.printToFileAsync({
        html: `
        <html>
        <body style="margin: 0; padding: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        ${
          animalDetails?.default_icon
            ? `
              <img src="${animalDetails?.default_icon}"  width="120" height="120" style="border-radius: 50%;"/>
            `
            : `<div style="border-radius: 50%;
            width: 120px; height: 120px; background-color:${constThemeColor.secondary};display: flex; justify-content: center; align-items: center;">
            <p style="font-size: 36px; margin-top: 12px; margin-bottom: 8px;color : ${constThemeColor.onPrimary}">
            ${animalDetails?.common_name}
            </p>
            </div>`
        }
        
        <p style="font-size: 48px; margin-top: 12px; margin-bottom: 8px">${
          animalDetails?.common_name
        }</p>
        <p style="font-size: 28px; margin-top: 0px; margin-bottom: -15px;">${
          animalDetails?.local_id || animalDetails?.animal_id
        }</p>
          <img src="${
            animalDetails?.animal_qr_image
          }" width="90%" height = "70%"/>
          <p style="font-size: 28px;margin-bottom: -50px;">Scan with the Antz App</p>
        </body>
        </html>
      `,
      });
      if (pdfFile.uri) {
        await Sharing.shareAsync(pdfFile.uri, {
          mimeType: "application/pdf",
          dialogTitle: "Share User Profile",
          UTI: "com.adobe.pdf",
        });
      } else {
        console.error("Error generating PDF");
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
    }
  };

  const shareSectionDetailsImageAsPDF = async () => {
    try {
      // Generate a PDF with the user's image and name
      const pdfFile = await Print.printToFileAsync({
        html: `
        <html>
        <body style="margin: 0; padding: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="border-radius: 50%;
            width: 120px; height: 120px; background-color:${constThemeColor.secondary};display: flex; justify-content: center; align-items: center;">
            <p style="font-size: 36px; margin-top: 12px; margin-bottom: 8px;color : ${constThemeColor.onPrimary}">
            ${section?.section_name}
            </p>
            </div>
        
        <p style="font-size: 48px; margin-top: 12px; margin-bottom: 8px">${section?.section_name}</p>
        <p style="font-size: 28px; margin-top: 0px; margin-bottom: -15px;">${section?.section_id}</p>
          <img src="${section?.qr_code_image}" width="90%" height = "70%"/>
          <p style="font-size: 28px;margin-bottom: -50px;">Scan with the Antz App</p>
        </body>
        </html>
      `,
      });
      if (pdfFile.uri) {
        await Sharing.shareAsync(pdfFile.uri, {
          mimeType: "application/pdf",
          dialogTitle: "Share User Profile",
          UTI: "com.adobe.pdf",
        });
      } else {
        console.error("Error generating PDF");
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
    }
  };

  const shareEncloserDetailsImageAsPDF = async () => {
    try {
      // Generate a PDF with the user's image and name
      const pdfFile = await Print.printToFileAsync({
        html: `
        <html>
        <body style="margin: 0; padding: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="border-radius: 50%;
            width: 120px; height: 120px; background-color:${constThemeColor.secondary};display: flex; justify-content: center; align-items: center;">
            <p style="font-size: 36px; margin-top: 12px; margin-bottom: 8px;color : ${constThemeColor.onPrimary}">
            ${enclosureDetails?.user_enclosure_name}
            </p>
            </div>
        
        <p style="font-size: 48px; margin-top: 12px; margin-bottom: 8px">${enclosureDetails?.user_enclosure_name}</p>
        <p style="font-size: 28px; margin-top: 0px; margin-bottom: -15px;">${enclosureDetails?.enclosure_id}</p>
          <img src="${enclosureDetails?.enclosure_qr_image}" width="90%" height = "70%"/>
          <p style="font-size: 28px;margin-bottom: -50px;">Scan with the Antz App</p>
        </body>
        </html>
      `,
      });
      if (pdfFile.uri) {
        await Sharing.shareAsync(pdfFile.uri, {
          mimeType: "application/pdf",
          dialogTitle: "Share User Profile",
          UTI: "com.adobe.pdf",
        });
      } else {
        console.error("Error generating PDF");
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
    }
  };

  return (
    <>
      <View style={reduxColors.constainer}>
        <Loader visible={isLoading} />
        <StatusBar
          backgroundColor={constThemeColor.onPrimaryContainer}
          barStyle={"light-content"}
        />
        <Appbar.Header
          style={{ backgroundColor: constThemeColor.onPrimaryContainer }}
        >
          <Appbar.BackAction
            color={constThemeColor.onPrimary}
            onPress={() => navigation.goBack()}
          />
          <Appbar.Content title="QR" color={constThemeColor.onPrimary} />
          {/* <Appbar.Action
            icon={"dots-vertical"}
            color={constThemeColor.onPrimary}
          /> */}
        </Appbar.Header>

        <View style={reduxColors.qrMainBox}>
          <View style={reduxColors.qrBox}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingTop: Spacing.major,
              }}
            >
              {userData.profile_pic ? (
                <Animated.Image
                  source={{ uri: userData.profile_pic }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 62,
                  }}
                />
              ) : (
                <Animated.View
                  style={[
                    {
                      width: 60,
                      height: 60,
                      borderRadius: 62,
                      backgroundColor: opacityColor(
                        constThemeColor.neutralPrimary,
                        10
                      ),
                      // borderWidth: 1,
                      // borderColor: constThemeColor.secondary,
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  {animalDetails?.default_icon ? (
                    <ImageComponent icon={animalDetails?.default_icon} />
                  ) : enclosureDetails?.default_icon ? (
                    <ImageComponent icon={enclosureDetails?.default_icon} />
                  ) : section?.section_name ||
                    enclosureDetails?.user_enclosure_name ? (
                    <SvgUri
                      width="45"
                      height="45"
                      style={reduxColors.image}
                      uri={
                        Config.BASE_APP_URL +
                        "assets/class_images/default_animal.svg"
                      }
                    />
                  ) : (
                    <Animated.Text
                      style={{
                        fontSize: FontSize.Antz_Body_Medium.fontSize,
                        fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                        textAlign: "center",
                        color: constThemeColor.onPrimary,
                      }}
                    >
                      {ShortFullName(
                        userData?.user_first_name +
                          " " +
                          userData?.user_last_name
                      )}
                    </Animated.Text>
                  )}
                </Animated.View>
              )}
              <View style={reduxColors.profileDetails}>
                <View>
                  {userData?.user_first_name ? (
                    <Text style={reduxColors.profileName}>
                      {userData.user_first_name} {userData.user_last_name}
                    </Text>
                  ) : (
                    <Text style={reduxColors.profileName}>
                      {capitalize(
                        animalDetails?.common_name ||
                          section?.section_name ||
                          enclosureDetails?.user_enclosure_name
                      )}
                    </Text>
                  )}
                  {userData.user_type ? (
                    <Text style={reduxColors.profileType}>
                      {capitalize(userData.user_type)}
                    </Text>
                  ) : (
                    <Text style={reduxColors.profileType}>
                      {capitalize(
                        animalDetails?.local_id ||
                          animalDetails?.animal_id ||
                          section?.section_id ||
                          enclosureDetails?.enclosure_id
                      )}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {userData?.qr_image ? (
                <Image
                  source={{ uri: userData?.qr_image }}
                  style={{
                    height: 260,
                    width: 260,
                    resizeMode: "contain",
                  }}
                />
              ) : (
                <Image
                  source={{
                    uri:
                      animalDetails?.animal_qr_image ||
                      section?.qr_code_image ||
                      enclosureDetails?.enclosure_qr_image,
                  }}
                  style={{
                    height: 260,
                    width: 260,
                    resizeMode: "contain",
                  }}
                />
              )}
            </View>
            <View style={reduxColors.textBottom}>
              <Text style={reduxColors.scanText}>Scan with the Antz App</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={reduxColors.shareQrView}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <DownloadFile
            url={
              userData.qr_image ||
              animalDetails?.animal_qr_image ||
              section?.qr_code_image ||
              enclosureDetails?.enclosure_qr_image
            }
            text={""}
            dounlodeStyle={{
              backgroundColor: constThemeColor.onPrimary,
              marginHorizontal: Spacing.minor,
            }}
            downlodeIconColor={constThemeColor.onPrimaryContainer}
            textStyle={{ marginHorizontal: 0 }}
          />
          <TouchableOpacity
            onPress={
              // userData?.user_first_name ? shareImageAsPDF : shareAnimalDetailsImageAsPDF
              userData?.user_first_name
                ? shareImageAsPDF
                : animalDetails?.common_name
                ? shareAnimalDetailsImageAsPDF
                : section?.section_name
                ? shareSectionDetailsImageAsPDF
                : shareEncloserDetailsImageAsPDF
            }
            // ref={inputRef}
          >
            <View style={reduxColors.shareQr}>
              <AntDesign
                name="sharealt"
                size={24}
                color={constThemeColor.onPrimary}
              />
              <Text style={reduxColors.shareQrText}>Share QR Code</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default ProfileQr;

const styles = (reduxColors) =>
  StyleSheet.create({
    constainer: {
      flex: 1,
      backgroundColor: reduxColors.onPrimaryContainer,
    },
    qrMainBox: {
      alignItems: "center",
      justifyContent: "center",
      height: "90%",
    },
    qrBox: {
      backgroundColor: reduxColors.onPrimary,
      maxWidth: "80%",
      borderRadius: Spacing.small,
      paddingHorizontal: Spacing.minor,
    },
    textBottom: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: Spacing.major,
    },
    scanText: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
    },
    profileDetails: {
      marginTop: Spacing.small,
    },

    profileName: {
      fontSize: FontSize.Antz_Major_Medium.fontSize,
      fontWeight: FontSize.Antz_Major_Medium.fontWeight,
      textAlign: "center",
      color: reduxColors.neutralPrimary,
    },
    profileType: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      textAlign: "center",
      color: reduxColors.neutralPrimary,
    },
    shareQrView: {
      alignItems: "center",
      backgroundColor: reduxColors.onPrimaryContainer,
      paddingVertical: Spacing.major,
    },
    shareQr: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: reduxColors.primary,
      padding: Spacing.body,
      borderRadius: Spacing.small,
      marginRight: Spacing.small,
    },
    shareQrText: {
      color: reduxColors.onPrimary,
      marginLeft: Spacing.body,
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
    },
  });
