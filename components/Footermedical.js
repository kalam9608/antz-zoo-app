// created By: Wasim Akram;
// Created at: 27/04/2023

// modify By : Gaurav Shukla
//date:2-05-2023
//description: pass the props for navigation and apply the condition to ShowIonicons

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";

const Footermedical = ({
  firstlabel,
  lastlabel,
  navigateNextScreen,
  navigatePreviousScreen,
  ShowIonicons,
  ShowRighticon,
  doneRight,
  ...props
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  return (
    <View style={reduxColors.content}>
      <LinearGradient
        colors={[
          constThemeColor?.displaybgPrimary,
          constThemeColor?.displaybgPrimary,
        ]}
      >
        <View style={reduxColors.mainbox}>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel={"footerFirstLvl"}
            AccessibilityId={"footerFirstLvl"}
            style={reduxColors.firstbutton}
            onPress={navigatePreviousScreen}
          >
            {ShowIonicons == true ? (
              <Ionicons
                name="arrow-back-outline"
                size={24}
                color={constThemeColor.onPrimaryContainer}
              />
            ) : null}
            <Text style={[reduxColors.textstyleOne]}>{firstlabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={reduxColors.secondbutton}
            onPress={props.onPress}
            accessible={true}
            accessibilityLabel={"footerDoneLvl"}
            AccessibilityId={"footerDoneLvl"}
          >
            <Text style={[reduxColors.textstyleSecond]}>Done</Text>
          </TouchableOpacity>
          {doneRight ? null : (
            <TouchableOpacity
              style={reduxColors.thirdbutton}
              onPress={navigateNextScreen}
              accessible={true}
              accessibilityLabel={"footerSecondLvl"}
              AccessibilityId={"footerSecondLvl"}
            >
              <Text style={reduxColors.textstyleThree}>{lastlabel}</Text>
              {ShowRighticon == true ? (
                <Ionicons
                  name="arrow-forward-sharp"
                  size={24}
                  color={constThemeColor.onSecondaryContainer}
                />
              ) : null}
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

export default Footermedical;

const styles = (reduxColors) =>
  StyleSheet.create({
    mainbox: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: Spacing.minor,
      width: "100%",
      height: 80,
    },
    firstbutton: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      height: 48,
      backgroundColor: reduxColors.elevation.level,
      width: "32%",
    },
    secondbutton: {
      borderRadius: Spacing.small,
      width: 90,
      height: 40,
      justifyContent: "center",
      backgroundColor: reduxColors.primary,
      marginHorizontal: Spacing.small,
    },
    thirdbutton: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      height: 48,
      backgroundColor: reduxColors.elevation.level,
      width: "32%",
    },
    textstyleOne: {
      fontSize: FontSize.Antz_Subtext_title.fontSize,
      fontWeight: FontSize.Antz_Subtext_title.fontWeight,
      textAlign: "left",
      flexWrap: "wrap",
      alignSelf: "center",
      marginLeft: Spacing.mini,
      color: reduxColors.onPrimaryContainer,
      flex: 1,
    },
    textstyleSecond: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      textAlign: "center",
      color: reduxColors.onPrimary,
    },
    textstyleThree: {
      fontSize: FontSize.Antz_Subtext_title.fontSize,
      fontWeight: FontSize.Antz_Subtext_title.fontWeight,
      textAlign: "right",
      flexWrap: "wrap",
      alignSelf: "center",
      marginRight: Spacing.mini,
      color: reduxColors.onPrimaryContainer,
      flex: 1,
    },
  });
