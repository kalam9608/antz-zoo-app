/**
   * Create and modified by - Anirban Pan
      Date - 09.06.23
      Des- All Functionality and design
   */
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
} from "react-native";
import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { removeMedical } from "../../redux/MedicalSlice";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";

const MedicalHeader = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const gotoBack = () => {
    dispatch(removeMedical());
    navigation.goBack();
  };
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  return (
    <>
      <StatusBar
        barStyle={props.StatusBarStyle ? props.StatusBarStyle : "dark-content"}
        backgroundColor={
          props.StatusBarBg ? props.StatusBarBg : constThemeColor.onPrimary
        }
      />
      <View
        style={[
          reduxColors.container,
          {
            backgroundColor: props.backgroundColor
              ? props.backgroundColor
              : constThemeColor.onPrimary,
            paddingHorizontal: Spacing.minor,
          },
        ]}
      >
        <TouchableOpacity
          // onPress={gotoBack}
          // style={
          //   {
          //     left: 14,
          //   }
          // }
          accessible={true}
          accessibilityLabel={"medicalHeaderBack"}
          AccessibilityId={"medicalHeaderBack"}
        >
          <Ionicons
            name="arrow-back-outline"
            onPress={gotoBack}
            size={24}
            color={constThemeColor.onSecondaryContainer}
          />
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

export default MedicalHeader;
const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      padding: Spacing.mini,
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingTop: Spacing.small,
      height: 58,
    },
    titleStyle: {
      fontSize: FontSize.Antz_Medium_Medium_btn.fontSize,
      fontWeight: FontSize.Antz_Major_Regular.fontWeight,
      color: reduxColors?.onSecondaryContainer,
      paddingLeft: Spacing.major,
    },
  });
