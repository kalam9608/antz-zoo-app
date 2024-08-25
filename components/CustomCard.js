/**
 * @React Imports
 */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
/**
 * @Third Party Imports
 */
import { widthPercentageToDP } from "react-native-responsive-screen";
import SvgUri from "react-native-svg-uri";
import { useSelector } from "react-redux";
import { SvgXml } from "react-native-svg";
/**
 * @Config Imports
 */
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import Configs from "../configs/Config";

/**
 * @Utils Imports
 */
import { shortenNumber } from "../utils/Utils";
/**
 * @Assets Imports
 */
import call from "../assets/call.svg";
import chat from "../assets/chat.svg";
import ImageComponent from "./ImageComponent";
import Background from "./BackgroundImage";

const Card = ({
  PhoneCall,
  SendMsz,
  fname,
  date,
  title,
  secondtitle,
  subtitle,
  tags,
  count,
  imageSource,
  onPress,
  checkbox,
  rightIcon,
  chips,
  icon,
  cardID,
  cardIdtobeChecked,
  svgUri,
  scientific_name,
  genderChip,
  fontStyle,
  userIcon,
  displayIcon,
  subenclosuresCount,
  parentEnclosure,
  textTransformStyle,
  hideBackgroundImage,
  showWaterMark,
  ...props
}) => {
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const makePhoneCall = (PhoneCall) => {
    Linking.openURL(`tel:${PhoneCall}`);
  };
  const handlePress = () => {
    makePhoneCall(PhoneCall);
  };

  const handleMsz = (PhoneCall) => {
    let phoneNumber = typeof PhoneCall !== "undefined" ? PhoneCall : null;

    if (phoneNumber !== null) {
      phoneNumber = "+91" + phoneNumber;
      Linking.openURL(`sms:${phoneNumber}`);
    }
  };

  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  return (
    <TouchableWithoutFeedback>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.5}
        style={[
          reduxColors.cardContainer,
          props?.style,
          {
            cardID,
            // backgroundColor : "black"
            display: "flex",
          },
        ]}
      >
        <Background
          hideBackgroundImage={showWaterMark ? hideBackgroundImage : false}
        >
          <View style={reduxColors.cardContainers}>
            {checkbox ? checkbox : null}

            {icon != null ? (
              <View style={reduxColors.imageWrapper}>
                <View style={[reduxColors.image]}>
                  <SvgUri
                    width="40"
                    height="40"
                    style={reduxColors.image}
                    source={{ uri: Configs.BASE_APP_URL + icon }}
                  />
                </View>
              </View>
            ) : userIcon != null ? (
              <View style={reduxColors.imageWrapper}>
                <View style={reduxColors.image}>
                  <Image
                    width="40"
                    height="40"
                    style={reduxColors.image}
                    source={{ uri: userIcon }}
                  />
                </View>
              </View>
            ) : displayIcon != null ? (
              <View style={reduxColors.imageWrapper}>
                <View style={reduxColors.image}>
                  <ImageComponent icon={displayIcon} />
                </View>
              </View>
            ) : fname ? (
              <View style={[reduxColors.image1, { alignSelf: "center" }]}>
                <Text style={[FontSize.Antz_Minor_Medium]}>{fname}</Text>
              </View>
            ) : null}

            {svgUri ? (
              <View style={reduxColors.imageWrapper}>
                <View style={reduxColors.image}>
                  <SvgUri
                    width="40"
                    height="40"
                    style={reduxColors.image}
                    source={{
                      uri:
                        Configs.BASE_APP_URL +
                        "assets/class_images/default_animal.svg",
                    }}
                  />
                </View>
              </View>
            ) : null}
            {props.svgXML ? (
              <View style={reduxColors.imageWrapper}>
                <View
                  style={[
                    reduxColors.image,
                    { alignItems: "center", justifyContent: "center" },
                  ]}
                >
                  <SvgXml
                    xml={props.svgXMLData}
                    width="20"
                    height="20"
                    style={[reduxColors.image, { alignSelf: "center" }]}
                  />
                </View>
              </View>
            ) : null}

            <View
              style={[
                reduxColors.contentContainer,
                {
                  // width:
                  //   props.routeName == "MedicalRecord"
                  //     ? widthPercentageToDP(50)
                  //     : widthPercentageToDP(65),
                  flex: 1,
                },
              ]}
            >
              <View style={[reduxColors.middleSection, { flex: 1 }]}>
                {date ? (
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text
                      style={[
                        reduxColors.title,
                        {
                          color: constThemeColor.onSurfaceVariant,
                          fontSize: FontSize.Antz_Body_Medium.fontSize,
                        },
                      ]}
                    >
                      {date}
                    </Text>
                    {chips}
                  </View>
                ) : null}
                {title ? (
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text
                      style={[
                        reduxColors.title,
                        {
                          color: isSwitchOn
                            ? constThemeColor.onSurFace
                            : constThemeColor.onSurfaceVariant,
                          textTransform:
                            title == "NA"
                              ? null
                              : textTransformStyle
                              ? textTransformStyle
                              : "capitalize",
                        },
                        props?.titleStyle,
                      ]}
                    >
                      {title}
                    </Text>
                    {chips}
                  </View>
                ) : null}
                {secondtitle ? (
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text
                      style={[
                        reduxColors.title,
                        {
                          color: isSwitchOn
                            ? constThemeColor.onSurFace
                            : constThemeColor.onSurfaceVariant,
                        },
                      ]}
                    >
                      {secondtitle}
                    </Text>
                  </View>
                ) : null}
                {subtitle ? (
                  <Text
                    style={[
                      title ? reduxColors.subtitle : reduxColors.title,
                      { fontStyle: fontStyle ? "italic" : "normal" },
                      {
                        color: isSwitchOn
                          ? constThemeColor.onSurFace
                          : constThemeColor.onSurfaceVariant,
                      },
                    ]}
                  >
                    {subtitle}
                  </Text>
                ) : null}
                {scientific_name ? (
                  <Text
                    style={[
                      title ? reduxColors.subtitle : reduxColors.title,
                      {
                        color: isSwitchOn
                          ? constThemeColor.onSurFace
                          : constThemeColor.onSurfaceVariant,
                      },
                    ]}
                  >
                    ({scientific_name})
                  </Text>
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
                    {`Parent Enclosure - ${parentEnclosure}`}
                  </Text>
                ) : null}

                {tags ? (
                  <>
                    <View style={{ height: Spacing.small }}></View>
                    <View>
                      <View
                        style={reduxColors.tagsContainer}
                        onStartShouldSetResponder={() => true}
                      >
                        {Object.keys(tags).map((key) => {
                          if (tags[key] > 0) {
                            return (
                              <View
                                key={key}
                                style={
                                  key == "male"
                                    ? reduxColors.malechip
                                    : key == "female"
                                    ? reduxColors.femalechip
                                    : key == "undetermined"
                                    ? reduxColors.undeterminedChip
                                    : key == "indeterminate"
                                    ? reduxColors.indeterminedChip
                                    : {}
                                }
                              >
                                <Text
                                  style={
                                    key == "male"
                                      ? reduxColors.malechipText
                                      : key == "female"
                                      ? reduxColors.femalechipText
                                      : key == "undetermined"
                                      ? reduxColors.undeterminedText
                                      : key == "indeterminate"
                                      ? reduxColors.indeterminedText
                                      : {}
                                  }
                                >
                                  {key == "male"
                                    ? `M - ${tags[key]}`
                                    : key == "female"
                                    ? `F - ${tags[key]}`
                                    : key == "undetermined"
                                    ? `UD - ${tags[key]}`
                                    : key == "indeterminate"
                                    ? `ID - ${tags[key]}`
                                    : null}
                                </Text>
                              </View>
                            );
                          }
                        })}
                      </View>
                    </View>
                  </>
                ) : null}
                {genderChip ? (
                  <View style={{ marginTop: Spacing.mini }}>{genderChip}</View>
                ) : null}
              </View>
              {count ? (
                <View
                  style={[
                    reduxColors.rightSection,
                    {
                      width:
                        icon || svgUri
                          ? widthPercentageToDP(25)
                          : widthPercentageToDP(35),
                    },
                  ]}
                >
                  <Text style={reduxColors.count}>{shortenNumber(count)}</Text>
                </View>
              ) : SendMsz && PhoneCall ? (
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: 66,
                    gap: 4,
                  }}
                >
                  <TouchableOpacity
                    onPress={handlePress}
                    style={{
                      backgroundColor: constThemeColor.onBackground,
                      height: 28,
                      width: 32,
                      borderColor: constThemeColor.secondaryContainer,
                      borderRadius: 5,
                      borderWidth: widthPercentageToDP(0.3),
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* <Ionicons
                  name="call"
                  // size={20}
                  size={16}
                  // color={reduxColors.drNameColorinMEdical}
                  color={constThemeColor.onSurface}
                  
                  // style={{ marginTop: "10%" }}
                /> */}
                    <SvgXml xml={call} style={{ width: 20, height: 20 }} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleMsz(PhoneCall)}
                    style={{
                      height: 28,
                      width: 32,
                      backgroundColor: constThemeColor.onBackground,
                      borderColor: constThemeColor.secondaryContainer,
                      borderRadius: 5,
                      borderWidth: widthPercentageToDP(0.3),
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* <MaterialIcons
                  name="message"
                  // size={20}
                  size={16}

                  color={reduxColors.onSurface}
                  style={{ marginTop: "13%" }}
                /> */}

                    <SvgXml xml={chat} style={{ width: 20, height: 20 }} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={reduxColors.rightIcon}>{rightIcon}</View>
              )}
            </View>
          </View>
        </Background>
      </TouchableOpacity>
    </TouchableWithoutFeedback>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    cardContainer: {
      borderRadius: 10,
      marginVertical: Spacing.mini,
      elevation: 0.5, // for shadow on Android
      shadowColor: reduxColors.onPrimary, // for shadow on iOS
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      flexDirection: "row",
      padding: Spacing.body,
      backgroundColor: reduxColors.onPrimary,
    },
    cardContainers: {
      flexDirection: "row",
    },
    image: {
      width: 42,
      height: 42,
      borderRadius: 50,

      alignSelf: "center",
      //marginRight: Spacing.body,
      //marginLeft: 5,
    },
    image1: {
      width: 45,
      height: 45,
      borderRadius: 50,
      backgroundColor: "cyan",
      marginRight: Spacing.body,
      alignItems: "center",
      justifyContent: "center",
    },

    contentContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      // backgroundColor: reduxColors.onPrimary
    },
    leftSection: {
      paddingLeft: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    rightSection: {
      justifyContent: "center",
      marginRight: 0,
    },
    rightIcon: {
      alignItem: "flex-end",
      justifyContent: "center",
      marginRight: widthPercentageToDP(2),
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
      marginBottom: 2,
    },
    subtitle: {
      fontSize: FontSize.Antz_Subtext_title.fontSize,

      fontWeight: FontSize.Antz_Subtext_title.fontWeight,
      fontStyle: "italic",
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
    tagsContainer: {
      flexDirection: "row",
    },
    tag: {
      backgroundColor: reduxColors.tagColor,
      borderRadius: 8,
      paddingVertical: 4,
      paddingHorizontal: 8,
      marginRight: 8,
    },

    malechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.surfaceVariant,
      marginRight: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    femalechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.surfaceVariant,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      marginHorizontal: widthPercentageToDP(0.5),
    },
    undeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.errorContainer,
      marginHorizontal: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    indeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.indertermineChip,
      marginHorizontal: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    malechipText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onPrimaryContainer,
    },
    femalechipText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onPrimaryContainer,
    },
    undeterminedText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onPrimaryContainer,
    },
    indeterminedText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onPrimaryContainer,
    },
    imageWrapper: {
      marginRight: Spacing.body,
      alignSelf: "center",
    },
  });

export default Card;
