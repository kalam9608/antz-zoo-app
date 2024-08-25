import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { opacityColor } from "../utils/Utils";
import { Image } from "expo-image";
const AssessmentTemplateCreaterInfo = ({
  profilePicture,
  userName,
  dateTime,
  assessmentTempDetails
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);
  console.log(assessmentTempDetails)
  return (
    <View style={dynamicStyles.mainContainer}>
      <Text style={dynamicStyles.contentText}>{"Created by"}</Text>
      <View style={dynamicStyles.createdByContainer}>
        <View
          style={[
            dynamicStyles.iconStyle,
            {marginLeft: 2, height: 28,width: 28,backgroundColor: constThemeColor.secondary },
          ]}
        >
          {profilePicture ? (
            <Image
              source={profilePicture}
              style={{
                width: 28,
                height: 28,
                borderRadius: 50,
              }}
            />
          ) : (
            <View style={{ flexDirection: "row",}}>
            <Text
              style={{
                ...FontSize.Antz_Subtext_Regular,
                color: constThemeColor.onPrimary,
              }}
            >
              {assessmentTempDetails?.user_first_name?.charAt(
                0
              ).toUpperCase() ?? ""}
            </Text>
            <Text
              style={{
                marginLeft: Spacing.micro,
                ...FontSize.Antz_Subtext_Regular,
                color: constThemeColor.onPrimary,
              }}
            >
              {assessmentTempDetails?.user_last_name?.charAt(
                0
              ).toUpperCase() ?? ""}
            </Text>
          </View>
          )}
        </View>
        <Text
          style={[
            dynamicStyles.contentText,
            { marginHorizontal: Spacing.mini },
          ]}
        >
          {userName}
        </Text>
      </View>
      <Text
        style={[dynamicStyles.contentText, { marginBottom: Spacing.small-4 }]}
      >
        {"Created on"}
      </Text>
      <Text style={dynamicStyles.contentText}>
        {moment(dateTime).format("D MMM YYYY • h:mm A")}
      </Text>
    </View>
  );
};

export default AssessmentTemplateCreaterInfo;

const styles = (reduxColors) =>
  StyleSheet.create({
    mainContainer: {
      marginHorizontal: Spacing.minor,
      padding: Spacing.minor,
      borderRadius: Spacing.small,
      backgroundColor: reduxColors.displaybgSecondary,
    },
    contentText: {
      ...FontSize.Antz_Subtext_Regular,
      color: reduxColors.onSurfaceVariant,
    },
    createdByContainer: {
      marginTop: Spacing.small,
      marginBottom: Spacing.body-2,
      flexDirection: "row",
      alignItems: "center",
    },
    iconStyle: {
      height: 25,
      width: 25,
      backgroundColor: opacityColor(reduxColors.outline, 30),
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 50,
      marginLeft: Spacing.small-2,
    },
  });
