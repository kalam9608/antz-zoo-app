/**
 * @React Imports
 */
import React from "react";
import { StyleSheet, Text, View } from "react-native";
/**
 * @Config Imports
 */
import { Checkbox } from "react-native-paper";
import FontSize from "../configs/FontSize";

const CheckBox = ({ onPress, checked, title, disabled }) => {
  return (
    <>
      <View style={styles.checkboxWrap}>
        <Text style={styles.label}>{title}</Text>
        <Checkbox.Android
          status={checked ? "checked" : "unchecked"}
          onPress={onPress}
          disabled={disabled ? true : false}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  checkboxWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: FontSize.Antz_Body_Title.fontSize,
    fontWeight: FontSize.Antz_Body_Title.fontWeight,
    color: "rgba(0,0,0,0.5)",
  },
});

export default CheckBox;
