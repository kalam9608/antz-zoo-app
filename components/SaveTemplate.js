import { StyleSheet, Text, View } from "react-native";
import React from "react";
import InputBox from "./InputBox";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import Spacing from "../configs/Spacing";
import FontSize from "../configs/FontSize";

const SaveTemplate = ({ closeTempSave, disable, handleSave, onChangeText }) => {
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <View style={reduxColors.saveBtnContainer}>
      <View style={{ flex: 1, marginRight: Spacing.small }}>
        <InputBox
          accessible={true}
          accessibilityLabel={"templateName"}
          AccessibilityId={"templateName"}
          onChange={onChangeText}
          style={reduxColors.saveTempInput}
          inputLabel={"Enter template name"}
          placeholder={"Enter template name"}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: Spacing.mini,
          height: 40,
          width: 110,
        }}
      >
        <TouchableOpacity
          disabled={disable}
          accessible={true}
          accessibilityLabel={"saveTempTouch"}
          AccessibilityId={"saveTempTouch"}
          style={{
            flexDirection: "row",
            backgroundColor: constThemeColor.primary,
            paddingHorizontal: Spacing.body,
            borderRadius: Spacing.mini,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
          onPress={handleSave}
        >
          <Ionicons
            name="save-outline"
            size={16}
            color={constThemeColor.onPrimary}
          />
          <Text style={[reduxColors.saveTemp]}>Save</Text>
        </TouchableOpacity>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginLeft: Spacing.small,
          }}
        >
          <Ionicons
            name="close"
            size={24}
            color={constThemeColor.onSurface}
            onPress={closeTempSave}
          />
        </View>
      </View>
    </View>
  );
};

export default SaveTemplate;
export const SaveAsTemplate = ({
  handleClearAll,
  handleClickSaveTemp,
  medicalRecordId,
}) => {
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: Spacing.small,
        marginRight: Spacing.small,
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={handleClickSaveTemp}
        style={reduxColors.saveAsTempBtn}
        accessible={true}
        accessibilityLabel={"saveAsTempTouch"}
        AccessibilityId={"saveAsTempTouch"}
      >
        <Ionicons
          name="save-outline"
          size={20}
          color={constThemeColor.outline}
        />
        <Text
          style={[reduxColors.saveTemp, { color: constThemeColor.onSurface }]}
        >
          Save as Template
        </Text>
      </TouchableOpacity>
      {medicalRecordId ? null : (
        <TouchableOpacity
          style={reduxColors.clearSelection}
          onPress={handleClearAll}
          accessible={true}
          accessibilityLabel={"clearTouch"}
          AccessibilityId={"clearTouch"}
        >
          <Ionicons
            name="close-outline"
            size={24}
            color={constThemeColor.tertiary}
          />
          <Text style={[reduxColors.ClearSelect]}>Clear All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = (reduxColors) =>
  StyleSheet.create({
    saveBtnContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginTop: Spacing.small,
      justifyContent: "space-between",
      marginHorizontal: Spacing.mini,
    },
    saveTemp: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      textAlign: "center",
      fontWeight: FontSize.weight500,
      marginLeft: Spacing.mini,
      color: reduxColors.onPrimary,
    },
    saveTempInput: {
      height: 40,
    },
    clearSelection: {
      alignItems: "center",
      justifyContent: "flex-end",
      display: "flex",
      flexDirection: "row",
    },
    ClearSelect: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      textAlign: "center",
      fontWeight: FontSize.weight500,
      color: reduxColors.onSurface,
    },
    saveAsTempBtn: {
      backgroundColor: reduxColors.onPrimary,
      alignItems: "center",
      alignSelf: "flex-start",
      display: "flex",
      flexDirection: "row",
      flex: 1,
      height: 36,
    },
  });
