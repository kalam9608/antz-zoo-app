import React, { useState } from "react";
import { FlatList } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { buttonData } from "../configs/Config";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";

export const HomeBottomSheet = ({ isVisibleHomeBottom, closeHomeBottomSheet, handleBackdropPress,...props }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <Modal
      isVisible={isVisibleHomeBottom}
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
      onBackdropPress={handleBackdropPress}
      onBackButtonPress={handleBackdropPress}
    >
      <View
        style={{
          backgroundColor: constThemeColor.surfaceVariant,
          minHeight: "30%",
          maxHeight: "70%",
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
        }}
      >
        <View style={reduxColors.titleText}>
          <Text style={reduxColors.testStyle}>{props.title}</Text>
        </View>
         <View>
            {props.children}
         </View>
      </View>
    </Modal>
  );
};
const styles = (DarkModeReducer) =>
  StyleSheet.create({
    btnCont: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "33%",
      padding: "2%",
      marginBottom: 20,
    },
    btnText: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
    },
    titleText: {
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
    },
    testStyle: {
      ...FontSize.Antz_Major_Title,
    },
  });