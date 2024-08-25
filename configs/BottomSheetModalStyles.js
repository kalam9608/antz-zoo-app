import React from "react";
import { StyleSheet } from "react-native";
import FontSize from "./FontSize";
import { useSelector } from "react-redux";
import { opacityColor } from "../utils/Utils";

const getBottomSheetModalStyle = (themeColors) => {
  return StyleSheet.create({
    bottomSheetStyle: {
      margin: 0,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
  });
};



export const ShodowOpacity = (themeColors) => {
  return StyleSheet.create({
    elevationShadow: {
      shadowColor: opacityColor(themeColors.neutralPrimary,15),
      elevation:0.5,
    },
  });
};

export default { getBottomSheetModalStyle ,ShodowOpacity};

