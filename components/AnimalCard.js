/**
 * @React Imports
 */
import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";

/**
 * @Redux Imports
 */
import { useSelector } from "react-redux";
/**

 /**
 * @Third Party Imports
 */
import { widthPercentageToDP } from "react-native-responsive-screen";
import SvgUri from "react-native-svg-uri";
/**
 * @Config Imports
 */
import FontSize from "../configs/FontSize";
import Configs from "../configs/Config";

/**
 * @Utils Imports
 */
import { shortenNumber } from "../utils/Utils";

const AnimalCard = ({
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
  ...props
}) => {
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);

  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[
          reduxColors.cardContainer,
          props?.style,
          {
            cardID,
          },
        ]}
      >
        <View style={{ display: "flex", flexDirection: "row" }}>
          {checkbox ? checkbox : null}

          <View style={{ alignItems: "center", justifyContent: "center" }}>
            {icon != null ? (
              <View style={reduxColors.image}>
                <SvgUri
                  width="40"
                  height="40"
                  style={reduxColors.image}
                  source={{ uri: Configs.BASE_APP_URL + icon }}
                />
              </View>
            ) : null}
          </View>

          <View style={[reduxColors.contentContainer]}>
            <View style={[reduxColors.middleSection]}>
              {date ? (
                <View>
                  <Text
                    style={[
                      reduxColors.title,
                      {
                        color: constThemeColor.onSurfaceVariant,
                        fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                        fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                      },
                    ]}
                  >
                    {date}
                  </Text>
                </View>
              ) : null}
              {/* <View style={{ flexDirection: "row" }}> */}
                <View>
                  {title ? (
                    <Text
                      style={[
                        reduxColors.title,
                        {
                          color: constThemeColor.onSurfaceVariant,
                          fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                        },
                      ]}
                    >
                      {title}
                    </Text>
                  ) : null}
                </View>
                <View style={{ flexDirection: "row" }}>
                  <View>
                    {secondtitle ? (
                      <Text
                        style={[
                          reduxColors.title,
                          {
                            color: constThemeColor.onSurfaceVariant,
                            fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                          },
                        ]}
                      >
                        {secondtitle}
                      </Text>
                    ) : null}
                  </View>
                  {chips ? (
                    <View>
                      <View>
                        <View
                          style={reduxColors.tagsContainer}
                          onStartShouldSetResponder={() => true}
                        >
                          <View
                            style={
                              chips == "male"
                                ? reduxColors.malechipM
                                : chips == "female"
                                ? reduxColors.femalechipF
                                : chips == "undetermined"
                                ? reduxColors.undeterminedChip
                                : chips == "indeterminate"
                                ? reduxColors.indeterminedChip
                                : {}
                            }
                          >
                            <Text
                              style={
                                chips == "male"
                                  ? reduxColors.malechipText
                                  : chips == "female"
                                  ? reduxColors.femalechipText
                                  : reduxColors.malechipText
                              }
                            >
                              {chips == "male"
                                ? `M`
                                : chips == "female"
                                ? `F`
                                : chips == "undetermined"
                                ? `UD`
                                : chips == "indeterminate"
                                ? `ID`
                                : null}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ) : null}
                </View>
              {/* </View> */}
              {props.scintficName ? (
                <Text
                  style={[
                    reduxColors.title,
                    {
                      color: constThemeColor.onSurfaceVariant,
                      fontWeight:FontSize.Antz_Body_Regular.fontWeight,
                      fontSize: FontSize.Antz_Body_Regular.fontSize,
                    },
                  ]}
                >
                  {props.scintficName}
                </Text>
              ) : null}
              {subtitle ? (
                <Text
                ellipsizeMode="tail"
                numberOfLines={2}
                  style={[

                    title ? reduxColors.subtitle : reduxColors.subtitle,
                    { fontStyle: fontStyle ? "italic" : "normal" },
                    {
                      color: constThemeColor.onSurfaceVariant,
                      fontWeight:FontSize.Antz_Body_Regular.fontWeight,
                      width:"75%"
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
                    { color: constThemeColor.onSurfaceVariant },
                  ]}
                >
                  ({scientific_name})
                </Text>
              ) : null}

              {tags ? (
                <>
                  {/* <View style={{ height: 10 }}></View> */}
                  <View>
                    <View
                      style={reduxColors.tagsContainer}
                      onStartShouldSetResponder={() => true}
                    >
                      {Object.keys(tags).map((key) => (
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
                      ))}
                    </View>
                  </View>
                </>
              ) : null}
            </View>
          </View>
        </View>
        <View style={{ alignContent: "center", justifyContent: "center" }}>
          {count ? (
            <View
              style={[
                reduxColors.rightSection,
                {
                  alignItems: "flex-end",
                },
              ]}
            >
              <Text style={reduxColors.count}>{shortenNumber(count)}</Text>
            </View>
          ) : (
            <View style={reduxColors.rightSection}>{rightIcon}</View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    cardContainer: {
      borderRadius: 10,
      marginVertical: widthPercentageToDP("1%"),
      elevation: 1, // for shadow on Android
      shadowColor: reduxColors.neutralPrimary, // for shadow on iOS
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      flexDirection: "row",
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: reduxColors.onPrimary,
      justifyContent: "space-between",
    },
    image: {
      width: 44,
      height: 44,
      borderRadius: 50,
      alignSelf: "center",
      marginRight: 10,
      marginLeft: 5,
    },

    contentContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    rightSection: {
      justifyContent: "center",
      fontSize: FontSize.Antz_Major,
      marginRight: 5,
    },
    rightIcon: {
      fontSize: FontSize.Antz_Major_Title.fontSize,
      fontWeight: FontSize.Antz_Major_Title.fontWeight,
      color: reduxColors.onSurface,
      marginRight: 10,
    },
    count: {
      fontSize: FontSize.Antz_Major_Title.fontSize,
      fontWeight: FontSize.Antz_Major_Title.fontWeight,
      color: reduxColors.onSurface,
      marginRight: 10,
    },
    middleSection: {
      paddingLeft: 10,
      justifyContent: "center",
    },
    title: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      marginBottom: 2,
      width: "130%",
    },
    subtitle: {
      fontSize: FontSize.Antz_Subtext_title.fontSize,

      fontWeight: FontSize.Antz_Subtext_title.fontWeight,
      fontStyle: "italic",
    },
    tagsContainer: {
      flexDirection: "row",
      // top: 5,
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
    malechipM: {
      backgroundColor: reduxColors.surfaceVariant,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      marginHorizontal: 5,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    femalechipF: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.secondary,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      marginLeft: 5,
    },
  });

export default AnimalCard;

// {props.svgXML ? (
//     <View
//       style={[
//         styles.image,
//         { alignItems: "center", justifyContent: "center" },
//       ]}
//     >
//       <SvgXml
//         xml={props.svgXMLData}
//         width="20"
//         height="20"
//         style={[styles.image, { alignSelf: "center" }]}
//       />
//     </View>
//   ) : null}

{
  /* : userIcon != null ? (
          <View style={styles.image}>
            <Image
              width="40"
              height="40"
              style={styles.image}
              source={{ uri: userIcon }}
            />
          </View>
        ) : fname ? (
          <View style={styles.image1}>
            <Text style={{ fontSize: 16, fontWeight: FontSize.Antz_Minor_Medium.fontSize }}>{fname}</Text>
          </View>
        ) : null} */
}
