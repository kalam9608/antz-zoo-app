import { AntDesign, Octicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  LayoutAnimation,
  Platform,
  StyleSheet,
  UIManager,
} from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
const ConfermationModalCom = ({
  isVisible,
  closeModal,
  firstButton,
  secondButton,
  titleText,
  icon1,
  icon2,
  buttonPropStyle1,
  buttonPropStyle2,
  buttonTextStyle,
  buttonTextStyle1,
  topIcon,
  button,
  buttonPropStyle3,
  buttonTextStyle2,
  firstButtonPress,
  secondButtonPress,
  thirdButtonPress,
  thirdButton,
  type,
  update,
  laterUpdate,
  handleBackdropPress,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [showMore, setShowMore] = useState(false);
  const [textLines, setTextLines] = useState(2);
  const textRef = useRef(null);
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [showMore]);

  const handleTextLayout = (e) => {
    const { lines } = e.nativeEvent;
    setTextLines(lines.length);
  };

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <Modal
      isVisible={isVisible}
      style={{
        justifyContent: "flex-end",
        margin: 0,
      }}
      propagateSwipe={true}
      hideModalContentWhileAnimating={true}
      swipeThreshold={90}
      swipeDirection={"down"}
      animationInTiming={500}
      animationOutTiming={770}
      useNativeDriver={true}
      onBackdropPress={handleBackdropPress}
    >
      {type === "alert" ? (
        <View
          style={{
            backgroundColor: constThemeColor.onPrimary,
            minHeight: "40%",
            maxHeight: "70%",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            width: "100%",
          }}
        >
          <View style={reduxColors.modalContent}>
            {topIcon ? (
              <AntDesign
                name="closecircleo"
                size={56}
                color={constThemeColor.error}
                style={{ marginVertical: Spacing.body }}
              />
            ) : (
              <Octicons
                name="check-circle-fill"
                size={56}
                color={constThemeColor.primary}
              />
            )}
            <View style={{ marginVertical: 16 }}>
              <Text style={reduxColors.TextStyle}>{titleText}</Text>
            </View>
            <TouchableOpacity
              style={[reduxColors.buttonStyle1, buttonPropStyle1]}
              onPress={firstButtonPress}
            >
              <View style={reduxColors.buttonView}>
                <View>{icon1}</View>
                <Text style={[reduxColors.buttonText, buttonTextStyle]}>
                  {firstButton}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[reduxColors.buttonStyle1, buttonPropStyle2]}
              onPress={secondButtonPress}
            >
              <View style={reduxColors.buttonView}>
                <View>{icon2}</View>
                <Text style={[reduxColors.buttonText2, buttonTextStyle1]}>
                  {secondButton}
                </Text>
              </View>
            </TouchableOpacity>
            {button ? (
              <TouchableOpacity
                style={[reduxColors.buttonStyle1, buttonPropStyle3]}
                onPress={thirdButtonPress}
              >
                <View style={reduxColors.buttonView}>
                  <View>{icon2}</View>
                  <Text style={[reduxColors.buttonText2, buttonTextStyle2]}>
                    {thirdButton}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: constThemeColor.onPrimary,
            minHeight: "40%",
            maxHeight: "70%",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            width: "100%",
            paddingHorizontal: Spacing.major,
            paddingVertical: Spacing.major,
          }}
        >
          <View style={reduxColors.updateContainer}>
            <Image
              style={{ width: 132, height: 96, alignSelf: "center" }}
              source={require("../assets/app_update.png")}
            />
            <Text style={reduxColors.updateTitle}>App Update Available</Text>
            <Text style={reduxColors.versionTitle}>Version 1.0.48</Text>
            <Text
              style={reduxColors.detailsDesc}
              ref={textRef}
              onTextLayout={handleTextLayout}
              numberOfLines={showMore ? undefined : 3}
            >
              A new app update is ready for your device. This update includes
              bug fixes, performance improvements, and new features. Click the
              "Update Now" button to proceed. A new app update is ready for your
              device. This update includes bug fixes, performance improvements,
              and new features. Click the "Update Now" button to proceed.
            </Text>
          </View>
          {textLines > 1 && (
            <TouchableOpacity
              onPress={toggleShowMore}
              style={{
                alignItems: "flex-start",
                marginTop: -16,
                paddingVertical: 8,
                paddingBottom: 16,
              }}
            >
              <Text style={{ color: constThemeColor.secondary }}>
                {showMore ? "Show less" : "Show more"}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={reduxColors.btnContainer}>
            <Text style={reduxColors.updateButtonText}>Update Now</Text>
          </TouchableOpacity>
          {update === "forceupdate" ? (
            <TouchableOpacity
              style={[reduxColors.buttonStyle1, { marginTop: 16 }]}
              onPress={laterUpdate}
            >
              <View style={reduxColors.buttonView}>
                <Text style={[reduxColors.buttonText2]}>
                  I'll do this later
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </Modal>
  );
};

export default ConfermationModalCom;
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
//   titleText={"Do you want to delete animal?"}
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
