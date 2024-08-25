// created By: Wasim Akram;
// Created at: 27/04/2023

// modify By : Gaurav Shukla
//date:2-05-2023
//description: pass the props for navigation and apply the condition to ShowIonicons

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import FontSize from "../../configs/FontSize";
import { useSelector } from "react-redux";

const MoveAnimalFooter = ({
  firstlabel,
  lastlabel,
  navigateNextScreen,
  navigatePreviousScreen,
  ShowIonicons,
  ShowRighticon,
  buttonText,
  isButtonDisabled,
  ...props
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  return (
    <View style={styles.content}>
      <LinearGradient
        colors={[
          constThemeColor?.addBackground,
          constThemeColor?.addBackground,
        ]}
      >
        <View style={styles.mainbox}>
          <TouchableOpacity
            style={styles.firstbutton}
            onPress={navigateNextScreen}
          >
            {/* pass  */}
            {ShowIonicons == true ? (
              <Ionicons
                name="arrow-back-outline"
                size={24}
                color={constThemeColor?.onSecondaryContainer}
                style={{ marginTop: hp(2.3) }}
              />
            ) : null}
            <Text style={[styles.textstyleOne]}>{firstlabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondbutton}
            onPress={props.onPress}
            disabled={isButtonDisabled}
          >
            <Text style={[styles.textstyleSecond]}>
              {buttonText ? buttonText : "Done"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.thirdbutton}
            onPress={navigatePreviousScreen}
          >
            <Text style={styles.textstyleOne}>{lastlabel}</Text>
            {ShowRighticon == true ? (
              <Ionicons
                name="arrow-forward-sharp"
                size={22}
                color={constThemeColor?.onSecondaryContainer}
                style={{ marginTop: hp(2.2) }}
              />
            ) : null}
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

export default MoveAnimalFooter;

const style = (reduxColors) =>
  StyleSheet.create({
    mainbox: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-around",
      width: wp(100),
      height: hp(10),
    },
    firstbutton: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: wp(32),
      height: hp(7),
      backgroundColor: "transparent",
    },
    secondbutton: {
      borderRadius: 8,
      width: wp(40),
      height: hp(4.5),
      justifyContent: "center",
      backgroundColor: reduxColors.primary,
    },
    thirdbutton: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: wp(32),
      height: hp(7),
      backgroundColor: "transparent",
    },
    textstyleOne: {
      fontSize: wp(4),
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      textAlign: "center",
      paddingTop: hp(2.5),
      color: reduxColors.onSecondaryContainer,
    },
    textstyleSecond: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      textAlign: "center",
      color: reduxColors.onPrimary,
    },
  });
