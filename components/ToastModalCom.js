// created by - Mohit sharma
// import const { showToast } = useToast(); this from ToastConfig File

//   showToast(
//     "success",
//     "Observation deleted successfully"
//   )

// pass this where you want to show the alert with type and message
// types = error,success,alert,warning use these all types

import { AntDesign, Octicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import FontSize from "../configs/FontSize";
import { useSelector } from "react-redux";
import Spacing from "../configs/Spacing";
import Config from "../configs/Config";

const ToastModal = ({ isVisible, message, onClose, duration = 5000, type }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  useEffect(() => {
    let timer;

    if (isVisible) {
      timer = setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, duration);
    }

    return () => clearTimeout(timer);
  }, [duration, onClose, isVisible]);
  return (
    <>
      {isVisible ? (
        <View
          style={[reduxColors.toast, { top: Platform.OS == "ios" ? 30 : 0 }]}
        >
          <View style={reduxColors.tostStyle}>
            {type ? (
              <View>
                {type == Config.ERROR_TYPE ? (
                  <AntDesign
                    name="exclamationcircle"
                    size={26}
                    color={constThemeColor.error}
                  />
                ) : type == Config.SUCCESS_TYPE ? (
                  <Octicons
                    name="check-circle-fill"
                    size={26}
                    color={constThemeColor.primary}
                  />
                ) : type == Config.ALERT_TYPE ? (
                  <AntDesign
                    name="exclamationcircle"
                    size={26}
                    color={constThemeColor.tertiary}
                  />
                ) : type == Config.WARNING_TYPE ? (
                  <AntDesign
                    name="exclamationcircle"
                    size={26}
                    color={constThemeColor.moderateSecondary}
                  />
                ) : null}
              </View>
            ) : null}
            <View style={{ flex: 1, width: "100%" }}>
              <Text style={reduxColors.toastText}>{message}</Text>
            </View>
          </View>
        </View>
      ) : null}
    </>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    toast: {
      backgroundColor: reduxColors.onPrimary,
      padding: Spacing.body,
      borderRadius: Spacing.small,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      justifyContent: "center",
      marginHorizontal: Spacing.minor,
      marginVertical: Spacing.minor,
      elevation: 5,
      paddingVertical: Spacing.minor + Spacing.micro,
    },
    toastText: {
      ...FontSize.Antz_Minor_Regular,
      color: reduxColors.neutralPrimary,
      marginLeft: Spacing.small,
    },
    tostStyle: {
      flexDirection: "row",
      alignItems: "center",
    },
  });

export default ToastModal;
