import React from "react";
import { StyleSheet } from "react-native";
import FontSize from "./FontSize";
import Spacing from "./Spacing";

const getTabBarStyleSheet = (themeColors) => {
  return StyleSheet.create({
    indicatorStyle: {
      backgroundColor: themeColors.onSurface,
      height: 3,
      borderTopLeftRadius: 150,
      borderTopRightRadius: 150,
    },
    contentContainerStyle: {
      backgroundColor: themeColors.onPrimary,
      paddingLeft: 50,
      paddingRight: Spacing.major,
    },
    labelStyle: {
      ...FontSize.Antz_Body_Medium,
      marginLeft: Spacing.body,
      marginRight: Spacing.body,
    },
    tabBar: {
      paddingTop: 0,
      borderBottomColor: themeColors.surfaceVariant,
      borderBottomWidth: 1,
      backgroundColor: themeColors.onPrimary,
    },
  });
};

export default { getTabBarStyleSheet };
