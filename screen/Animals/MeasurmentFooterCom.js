import { View, Text } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";

const MeasurmentFooterCom = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <View style={[reduxColors.btnView]}>
      <TouchableOpacity style={reduxColors.btnTouch} onPress={props.onPress}>
        <Text
          style={{
            color: constThemeColor.onPrimary,
            fontSize: FontSize.Antz_Medium_Medium.fontSize,
            fontWeight: FontSize.Antz_Medium_Medium.fontWeight,
          }}
        >
          {props.name}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MeasurmentFooterCom;
const styles = (reduxColors) =>
  StyleSheet.create({
    btnView: {
      height: 100,
      width: "100%",
      position: "absolute",
      bottom: 0,
      backgroundColor: reduxColors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    btnTouch: {
      alignItems: "center",
      justifyContent: "center",
      height: 56,
      width: "90%",
      backgroundColor: reduxColors.primary,
      borderRadius: 10,
    },
  });
