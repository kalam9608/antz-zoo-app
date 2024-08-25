import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
import SvgUri from "react-native-svg-uri";
import { useSelector } from "react-redux";

import { shortenNumber } from "../utils/Utils";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import { RadioButton } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import ImageComponent from "./ImageComponent";
import Background from "./BackgroundImage";

const EnclosureCustomCard = ({
  title,
  count,
  onPress,
  icon,
  subenclosuresCount,
  parentEnclosure,
  enclosureType,
  sectionName,
  isSelected,
  isAllocate,
  siteName,
  onItemPressCheck,
  disabled = false,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  return (
    <TouchableWithoutFeedback>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.5}
        style={[reduxColors.cardContainer]}
        disabled={disabled}
      >
          {isAllocate ? (
            <View
              style={{
                backgroundColor: constThemeColor?.background,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: Spacing.body,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
              }}
            >
              <RadioButton.Android
                status={isSelected ? "checked" : "unchecked"}
                disabled={disabled}
                color={reduxColors.onSurface}
                onPress={onItemPressCheck}
              />
            </View>
          ) : null}

          <View
            style={[
              reduxColors.contentContainer,
              { padding: Spacing.small, flex: 1, flexDirection: "row" },
            ]}
          >
            <View style={[reduxColors.imageWrapper, {}]}>
              {/* <View style={[reduxColors.image]}>
              <SvgUri
                width={"40"}
                height={"40"}
                style={reduxColors.image}
                source={{ uri: icon }}
              />
            </View> */}
              <ImageComponent icon={icon} />
            </View>
            <View style={[reduxColors.middleSection, { flex: 1 }]}>
              <Text style={reduxColors.title}>{title}</Text>
              {/* {enclosureType ? <Text style={reduxColors.subTitle}>{`Encl Type: ${enclosureType}`}</Text> : null} */}
              {sectionName ? (
                <Text
                  style={reduxColors.subTitle}
                >{`Sec: ${sectionName}`}</Text>
              ) : null}
              {siteName ? (
                <Text style={reduxColors.subTitle}>{`Site: ${siteName}`}</Text>
              ) : null}

              {subenclosuresCount > 0 ? (
                <View style={reduxColors.subenclosuresCountContainer}>
                  <Text style={reduxColors.subenclosuresCountTitle}>
                    {"Subenclosures "}
                    <Text style={reduxColors.subenclosuresCountValue}>
                      {subenclosuresCount}
                    </Text>
                  </Text>
                </View>
              ) : null}

              {parentEnclosure ? (
                <Text style={reduxColors.parentEnclosureText}>
                  {`P. Encl : ${parentEnclosure}`}
                </Text>
              ) : null}
            </View>
            {count && (
              <View
                style={[
                  reduxColors.rightSection,
                  {
                    width: icon
                      ? widthPercentageToDP(25)
                      : widthPercentageToDP(35),
                  },
                ]}
              >
                <Text style={reduxColors.count}>{shortenNumber(count)}</Text>
              </View>
            )}
            {isAllocate && !count && subenclosuresCount > 0 && (
              <View style={[reduxColors.rightSection]}>
                <AntDesign
                  name="right"
                  size={20}
                  color={constThemeColor.onSurfaceVariant}
                />
              </View>
            )}
          </View>
      </TouchableOpacity>
    </TouchableWithoutFeedback>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    cardContainer: {
      borderRadius: 10,
      marginVertical: Spacing.mini,
      elevation: 0.5,
      shadowColor: reduxColors.onPrimary,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      flexDirection: "row",
      backgroundColor: reduxColors.onPrimary,
    },
    image: {
      width: 42,
      height: 42,
      borderRadius: 50,
      alignSelf: "center",
    },
    contentContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    rightSection: {
      justifyContent: "center",
      marginRight: 0,
    },
    count: {
      fontSize: FontSize.Antz_Major_Title.fontSize,
      fontWeight: FontSize.Antz_Major_Title.fontWeight,
      alignSelf: "flex-end",
      color: reduxColors.onSurface,
      marginRight: 10,
    },
    middleSection: {
      justifyContent: "center",
    },
    title: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
      marginBottom: Spacing.micro,
    },
    subTitle: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      marginBottom: Spacing.micro,
    },
    subenclosuresCountContainer: {
      backgroundColor: reduxColors.background,
      alignSelf: "flex-start",
      marginTop: Spacing.mini + Spacing.micro,
      paddingHorizontal: Spacing.mini + Spacing.micro,
      paddingVertical: Spacing.mini,
      borderRadius: Spacing.mini,
    },
    subenclosuresCountTitle: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColors.onPrimaryContainer,
    },
    subenclosuresCountValue: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onPrimaryContainer,
    },
    parentEnclosureText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      marginTop: Spacing.micro,
    },
    imageWrapper: {
      marginRight: Spacing.body,
      alignSelf: "center",
    },
  });

export default EnclosureCustomCard;
