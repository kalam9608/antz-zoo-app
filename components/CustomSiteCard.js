import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LengthDecrease, contactFun, opacityColor } from "../utils/Utils";
import Spacing from "../configs/Spacing";
import FontSize from "../configs/FontSize";
import Background from "./BackgroundImage";

const CustomSiteCard = ({
  onPress,
  title,
  speciesCount,
  animalCount,
  sectionCount,
  encCount,
  incharge,
  InchargePhoneNumber,
  images,
  permission,
  isHideStats,
  hideBackgroundImage
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const customStyle = styles(constThemeColor);

  const img = images
    ? images?.filter((item) => item?.display_type == "banner")[0]?.file
    : false;

  const openMessagingApp = (data) => {
    const phoneNumber = typeof data !== "undefined" ? data : null;

    if (phoneNumber !== null) {
      contactFun("sms", phoneNumber);
    }
  };

  const makePhoneCall = (data) => {
    const phoneNumber = typeof data !== "undefined" ? data : null;

    if (phoneNumber !== null) {
      contactFun("tel", phoneNumber);
    }
  };

  const content = (
    <View style={customStyle.contentContainer}>
      {/* <Background hideBackgroundImage={hideBackgroundImage}> */}
        <View style={{ flex: 1 }}>
          <Text
            ellipsizeMode={"tail"}
            numberOfLines={1}
            style={customStyle.mainTitle}
          >
            {title}
          </Text>
        </View>

        <View
          style={[
            customStyle.statsMainContainer,
            permission
              ? {
                  display:
                    !isHideStats && permission?.["housing_view_insights"]
                      ? "flex"
                      : "none",
                }
              : null,
          ]}
        >
          <View style={customStyle.statContainer}>
            <Text style={customStyle.stats}>{speciesCount ?? 0}</Text>
            <Text style={customStyle.statsType}>Species</Text>
          </View>
          <View style={customStyle.statContainer}>
            <Text style={customStyle.stats}>{animalCount ?? 0}</Text>
            <Text style={customStyle.statsType}>Animals</Text>
          </View>
          {sectionCount ? (
            <View style={customStyle.statContainer}>
              <Text style={customStyle.stats}>{sectionCount}</Text>
              <Text style={customStyle.statsType}>Sections</Text>
            </View>
          ) : null}
          <View style={customStyle.statContainer}>
            <Text style={customStyle.stats}>{encCount}</Text>
            <Text style={customStyle.statsType}>Enclosures</Text>
          </View>
        </View>

        <View style={customStyle.bottomContainer}>
          <View style={customStyle.inchargeContainer}>
            <MaterialIcons
              name={"person-outline"}
              size={20}
              color={constThemeColor.onPrimary}
            />
            <Text style={customStyle.inchargeText}>
              {/* {incharge} */}
              {LengthDecrease(25, incharge)}
            </Text>
          </View>

          {incharge === "NA" ? (
            <View style={{ height: 44 }}></View>
          ) : (
            <View style={customStyle.bottomActionButtonsContainer}>
              <TouchableOpacity
                style={customStyle.actionIconContainer}
                onPress={() => makePhoneCall(InchargePhoneNumber)}
              >
                <MaterialIcons
                  name={"call"}
                  size={20}
                  color={constThemeColor.onPrimary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={customStyle.actionIconContainer}
                onPress={() => openMessagingApp(InchargePhoneNumber)}
              >
                <MaterialCommunityIcons
                  color={constThemeColor.onPrimary}
                  name={"message-text-outline"}
                  size={20}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      {/* </Background> */}
    </View>
  );

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={customStyle.mainContainer}
      elevation={0}
      onPress={onPress}
    >
      <Image
        contentFit={"cover"}
        contentPosition={"center"}
        source={{ uri: img }}
        // style={{ borderRadius: 8, minHeight: 190 }}
        style={{
          borderRadius: 8,
          minHeight:
            !isHideStats && permission?.["housing_view_insights"] ? 190 : 135,
        }}
      />
      {content}
    </TouchableOpacity>
  );
};

export default CustomSiteCard;

const styles = (reduxColors) =>
  StyleSheet.create({
    mainContainer: {
      backgroundColor: reduxColors.onPrimaryContainer,
      marginVertical: Spacing.mini + Spacing.micro,
      marginHorizontal: Spacing.minor,
      borderRadius: 8,
    },
    contentContainer: {
      minHeight: 70,
      flex: 1,
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: opacityColor(reduxColors.neutralPrimary, 40),
      borderRadius: 8,
    },
    mainTitle: {
      fontSize: FontSize.Antz_Major_Title.fontSize,
      fontWeight: FontSize.Antz_Major_Title.fontWeight,
      color: reduxColors.onPrimary,
      marginHorizontal: Spacing.body + Spacing.micro,
      marginTop: Spacing.minor,
    },
    statsMainContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      paddingHorizontal: Spacing.body + Spacing.micro,
      marginTop: Spacing.minor,
    },
    statContainer: {
      justifyContent: "center",
      alignItems: "flex-start",
    },
    stats: {
      fontSize: FontSize.Antz_Major_Medium.fontSize,
      fontWeight: FontSize.Antz_Major_Medium.fontWeight,
      color: reduxColors.onPrimary,
    },
    statsType: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.onPrimary,
      marginTop: Spacing.micro,
    },
    bottomContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      backgroundColor: opacityColor(reduxColors.neutralPrimary, 60),
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      minHeight: 60,
      paddingHorizontal: Spacing.body,
    },
    inchargeContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    inchargeText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onPrimary,
      marginLeft: Spacing.mini,
      marginRight: Spacing.mini,
    },
    actionIconContainer: {
      padding: Spacing.body,
    },
    bottomActionButtonsContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
