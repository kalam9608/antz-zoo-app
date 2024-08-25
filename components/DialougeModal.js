import { AntDesign, Ionicons, Octicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, UIManager } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import Config from "../configs/Config";
import Constants from "../configs/Constants";

const DialougeModal = ({
  isVisible,
  alertType,
  title,
  subTitle = null,
  firstButtonText,
  secondButtonText,
  thirdButtonText,
  firstButtonTextStyle,
  secondButtonTextStyle,
  thirdButtonTextStyle,
  firstButtonIcon,
  secondButtonIcon,
  thirdButtonIcon,
  firstButtonStyle,
  secondButtonStyle,
  thirdButtonStyle,
  firstButtonHandle,
  secondButtonHandle,
  thirdButtonHandle,
  handleBackdropPress,
  addMore,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [isModalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setModalVisible(isVisible);
    }, Constants.GLOBAL_DIALOG_TIMEOUT_VALUE);
  }, [isVisible]);
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const onPress = (type) => {
    if (typeof firstButtonHandle != "undefined" && type == 1) {
      firstButtonHandle();
    } else if (typeof secondButtonHandle != "undefined" && type == 2) {
      secondButtonHandle();
    } else if (typeof thirdButtonHandle != "undefined" && type == 3) {
      thirdButtonHandle();
    }
    setModalVisible(false);
  };

  return (
    <>
      {isModalVisible ? (
        <Modal
          isVisible={true}
          style={{
            justifyContent: "flex-end",
            margin: 0,
          }}
          propagateSwipe={true}
          hideModalContentWhileAnimating={true}
          swipeThreshold={90}
          swipeDirection={"down"}
          animationInTiming={400}
          animationOutTiming={100}
          useNativeDriver={true}
          //   onBackdropPress={handleBackdropPress}
        >
          <View
            style={{
              backgroundColor: constThemeColor.onPrimary,
              minHeight: "30%",
              maxHeight: "70%",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              width: "100%",
            }}
          >
            <View style={reduxColors.modalContent}>
              {alertType == Config.SUCCESS_TYPE ? (
                <Octicons
                  name="check-circle-fill"
                  size={56}
                  color={constThemeColor.primary}
                />
              ) : alertType == Config.ERROR_TYPE ? (
                <AntDesign
                  name="closecircleo"
                  size={56}
                  color={constThemeColor.error}
                  style={{ marginVertical: Spacing.body }}
                />
              ) : alertType == Config.WARNING_TYPE ? (
                <Ionicons
                  name="warning"
                  size={56}
                  color={constThemeColor.moderatePrimary}
                  style={{ marginVertical: Spacing.body }}
                />
              ) : null}
              <View
                style={{
                  marginVertical: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={reduxColors.TextStyle}>{title}</Text>
                {subTitle && (
                  <Text style={reduxColors.subTitleStyle}>{subTitle}</Text>
                )}
              </View>
              {firstButtonText && (
                <TouchableOpacity
                  style={[reduxColors.buttonStyle1, firstButtonStyle]}
                  onPress={() => onPress(1)}
                >
                  <View style={reduxColors.buttonView}>
                    <View>{firstButtonIcon}</View>
                    {addMore && (
                      <AntDesign
                        name="plus"
                        size={20}
                        color={constThemeColor.primary}
                        style={{ marginRight: 10 }}
                      />
                    )}
                    <Text
                      style={[reduxColors.buttonText, firstButtonTextStyle]}
                    >
                      {firstButtonText}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              {secondButtonText && (
                <TouchableOpacity
                  style={[reduxColors.buttonStyle1, secondButtonStyle]}
                  onPress={() => onPress(2)}
                >
                  <View style={reduxColors.buttonView}>
                    <View>{secondButtonIcon}</View>
                    <Text
                      style={[reduxColors.buttonText2, secondButtonTextStyle]}
                    >
                      {secondButtonText}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              {alertType == Config.SUCCESS_TYPE && thirdButtonText && (
                <TouchableOpacity
                  style={[reduxColors.buttonStyle1, thirdButtonStyle]}
                  onPress={() => onPress(3)}
                >
                  <View style={reduxColors.buttonView}>
                    <View>{thirdButtonIcon}</View>
                    <Text
                      style={[reduxColors.buttonText2, thirdButtonTextStyle]}
                    >
                      {thirdButtonText}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
};

export default DialougeModal;
const styles = (reduxColor) =>
  StyleSheet.create({
    modalContent: {
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: Spacing.minor,
      marginVertical: Spacing.major,
    },
    buttonStyle1: {
      width: "100%",
      height: 52,
      marginVertical: Spacing.body,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Spacing.small,
      borderWidth: 1,
      borderColor: reduxColor.outline,
    },

    buttonText: {
      ...FontSize.Antz_Medium_Medium,
      color: reduxColor.onSurfaceVariant,
    },
    buttonText2: {
      ...FontSize.Antz_Medium_Medium,
      color: reduxColor.onSurfaceVariant,
    },
    buttonView: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    TextStyle: {
      ...FontSize.Antz_Medium_Medium,
    },
    subTitleStyle: {
      ...FontSize.Antz_Body_Medium,
    },
    updateTitle: {
      ...FontSize.Antz_Major_Title,
      color: reduxColor.onTertiaryContainer,
      paddingVertical: Spacing.minor,
    },
    updateContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    versionTitle: {
      ...FontSize.Antz_Body_Medium,
      color: reduxColor.neutralSecondary,
    },
    detailsDesc: {
      ...FontSize.Antz_Body_Title,
      color: reduxColor.onSurfaceVariant,
      paddingVertical: Spacing.minor,
    },
    detailsBottom: {
      ...FontSize.Antz_Body_Regular,
      color: reduxColor.onSurfaceVariant,
    },
    updateButtonText: {
      ...FontSize.Antz_Medium_Medium,
      color: reduxColor.onPrimary,
    },
    btnContainer: {
      height: 56,
      backgroundColor: reduxColor.secondary,
      borderRadius: Spacing.small,
      alignItems: "center",
      justifyContent: "center",
    },
  });
// these all function You have to pass
// const [isModalVisible, setModalVisible] = useState(false);

// const openModalCom = () => {
//   setModalVisible(true);
// };

// const closeModalCom = () => {
//   setModalVisible(false);
// };
// const handleBackdropPress = () => {
//   closeModalCom();
// };
// Example for using the modal uh have to import the modal like that

//   <ConfermationModalCom
//   isVisible={isModalVisible}
//   closeModal={closeModalCom}
//   title={"Do you want to delete animal?"}
//   firstButton={"Yes"}
//   secondButton={"No"}
//   buttonPropStyle1={{backgroundColor: constThemeColor.error,borderWidth: 0}}
//   buttonTextStyle={{color : constThemeColor.onPrimary}}
//   buttonPropStyle2={{backgroundColor: constThemeColor.surfaceVariant,borderWidth: 0}}
//   button={true}
//   topIcon={true}
//   thirdButton={"Add more"}
//   // type ={"alert"}
//   update={"forceupdate"}
//   laterUpdate={closeModalCom}
// />
// <Button
//   title="Show Modal"
//   onPress={openModalCom
//   }
// />
