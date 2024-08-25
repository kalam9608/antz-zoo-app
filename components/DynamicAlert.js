/**
   * Create by - Anirban Pan
      Date - 27.06.23
      Des- All Functionality and design
   */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { widthPercentageToDP } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/FontAwesome";
import FontSize from "../configs/FontSize";
import { useSelector } from "react-redux";
import Spacing from "../configs/Spacing";

const DynamicAlert = ({
  isVisible,
  isCancelButton,
  onCancel,
  onOK,
  type,
  title,
  message,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const getAlertStyle = () => {
    if (type === "error") {
      return reduxColors.errorAlert;
    } else if (type === "success") {
      return reduxColors.successAlert;
    }
    return reduxColors.defaultAlert;
  };

  const getAlertIcon = () => {
    if (type === "error") {
      return "times-circle";
    } else if (type === "success") {
      return "check-circle";
    }
    return "info-circle";
  };

  return (
    <Modal
      isVisible={isVisible}
      //If need Back drop open this code
      // onBackdropPress={onCancel}
    >
      <View style={reduxColors.container}>
        <View style={[reduxColors.content, getAlertStyle()]}>
          <Icon
            name={getAlertIcon()}
            size={40}
            color={constThemeColor.onPrimary}
          />
          <Text style={reduxColors.title}>{title}</Text>
          <Text style={reduxColors.message}>{message}</Text>
          <View style={reduxColors.buttonContainer}>
            {isCancelButton ? (
              <TouchableOpacity
                style={reduxColors.cancelButton}
                onPress={onCancel}
              >
                <Text style={reduxColors.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={reduxColors.okButton} onPress={onOK}>
              <Text
                style={[
                  reduxColors.okButtonText,
                  { color: isCancelButton ? constThemeColor.inversePrimary : constThemeColor.error },
                ]}
              >
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      backgroundColor: reduxColors.tagColor,
      borderRadius: 10,
      padding: Spacing.minor,
      width: widthPercentageToDP(80),
      alignItems: "center",
    },
    defaultAlert: {
      backgroundColor: reduxColors.tagColor,
    },
    errorAlert: {
      backgroundColor: reduxColors.error,
    },
    successAlert: {
      backgroundColor: reduxColors.inversePrimary,
    },
    title: {
      fontSize: FontSize.Antz_Major_Title.fontSize,
      fontWeight: FontSize.Antz_Major_Title.fontWeight,
      marginBottom: 12,
      textAlign: "center",
      color: reduxColors.onPrimary,
    },
    message: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      marginBottom: Spacing.major,
      textAlign: "center",
      color: reduxColors.onPrimary,
    },
    buttonContainer: {
      flexDirection: "row",
    },
    cancelButton: {
      backgroundColor: reduxColors.onPrimary,
      borderRadius: 4,
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginRight: 10,
    },
    cancelButtonText: {
      color: "#FF6464",
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
    },
    okButton: {
      backgroundColor: reduxColors.onPrimary,
      borderRadius: 4,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    okButtonText: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
    },
  });

export default DynamicAlert;
