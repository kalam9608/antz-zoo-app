// ceated By: Anirban Pan
// created At: 10/05/2023

import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
} from "react-native";
import React from "react";
// import { Ionicons } from "@expo/vector-icons";
// import {
//   heightPercentageToDP,
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from "react-native-responsive-screen";
// import Colors from "../configs/Colors";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const MoveAnimalHeader = (props) => {
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  return (
    <>
      <StatusBar
        barStyle={isSwitchOn ? "light-content" : "dark-content"}
        backgroundColor={constThemeColor.onPrimary}
      />
      <View
        style={[
          reduxColors.container,
          {
            backgroundColor: constThemeColor.onPrimary,
            // backgroundColor: "green",
          },
        ]}
      >
        <TouchableOpacity
          onPress={props.gotoBack}
          style={{
            // position: "absolute",
            // left: 14,
            marginLeft: -4,
          }}
        >
          {/* <Ionicons
            name="arrow-back-outline"
            size={FontSize.Antz_Large_Title.fontSize}
            color={constThemeColor.onSecondaryContainer}
          /> */}

          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={constThemeColor.onSecondaryContainer}
            style={{
              paddingRight: Spacing.minor,
              paddingVertical: Spacing.small,
            }}
          />
        </TouchableOpacity>

        <Text
          style={[
            props.headerTitle === undefined
              ? FontSize.Antz_Medium_Medium
              : props.headerTitle,
            { color: constThemeColor.onSecondaryContainer },
          ]}
        >
          {props.title}
        </Text>
      </View>
    </>
  );
};

export default MoveAnimalHeader;
const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      // padding: wp(1),
      // position: "relative",
      // display: "flex",
      // flexDirection: "row",
      // justifyContent: "center",
      // alignItems: "center",
      // paddingTop: 10,

      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: Spacing.major,
      paddingTop: 10,
    },
    // titleStyle: {
    //   fontSize: FontSize.Antz_Major_Title.fontSize,
    //   color: reduxColors.neutralPrimary,
    //   paddingLeft: wp(6),
    // },
    // headerText: {},
  });
