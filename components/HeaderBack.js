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
import { Ionicons } from "@expo/vector-icons";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Colors from "../configs/Colors";
import FontSize from "../configs/FontSize";

const HeaderBack = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <>
      <StatusBar
        barStyle={props.StatusBarStyle ? props.StatusBarStyle : "dark-content"}
        backgroundColor={props.StatusBarBg ? props.StatusBarBg : constThemeColor.onPrimary}
      />
      <View
        style={[
          reduxColors.container,
          {
            backgroundColor: props.backgroundColor
              ? props.backgroundColor
              : constThemeColor.onPrimary,
             
          },
        ]}
      >
        <TouchableOpacity
          onPress={props.gotoBack}
          style={{
            left: 14,
          }}
        >
          <Ionicons name="arrow-back-outline" size={wp(7.8)} color={constThemeColor.onSecondaryContainer} />
        </TouchableOpacity>

        <Text
          style={
            props.headerTitle === undefined
              ? reduxColors.titleStyle
              : props.headerTitle
          }
        >
          {props.title}
        </Text>
      </View>
    </>
  );
};

export default HeaderBack;
const styles =(reduxColors)=> StyleSheet.create({
  container: {
    padding: wp(1),
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 10,
  
  },
  titleStyle: {
    fontSize: FontSize.Antz_Major,
    color: reduxColors.neutralPrimary,
    paddingLeft: wp(6),
  },
  headerText: {},
});
