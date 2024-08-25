import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import { capitalize } from "../utils/Utils";
import { SvgXml } from "react-native-svg";
import infertileegg from "../assets/infertileegg.svg";
import hatchedegg from "../assets/hatchedegg.svg";
import egg from "../assets/egg.svg";
import { Image } from "expo-image";
import {opacityColor} from '../utils/Utils'

import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const EggListCard = ({
  onPress,
  icon,
  animalName,
  animalIdentifier,
  chips,
  cardID,
  enclosureName,
  sectionName,
  eggStatus,
  ...props
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const getBackgroundColor = (status) => {
     if (status === "Hatched") {
      return constThemeColor.onSurface;
    } else if (status === "Undetermined") {
      return constThemeColor.onSurfaceVariant;
    } else if (status === "Fertile") {
      return constThemeColor.onPrimaryContainer;
    } else if (status === "Infertile") {
      return constThemeColor.onErrorContainer;
    } else {
      return constThemeColor.onPrimaryContainer;
    }
  };
  const getChipBackgroundColor = (status) => {
   if (status === "Hatched") {
      return constThemeColor.primary;
    } else if (status === "Undetermined") {
      return  opacityColor(constThemeColor.neutral10,10);
    } else if (status === "Fertile") {
      return constThemeColor.onBackground;
    } else if (status === "Infertile") {
      return constThemeColor.errorContainer;
    } else {
      return constThemeColor.onBackground;
    }
  };
  const getChipTextColor = (status) => {
    if (status === "Hatched") {
      return constThemeColor.onPrimary;
    } else if (status === "Undetermined") {
      return constThemeColor.onSurfaceVariant;
    } else if (status === "Fertile") {
      return constThemeColor.onSurface;
    } else if (status === "Infertile") {
      return constThemeColor.error;
    } else {
      return constThemeColor.onSurface;
    }
  };
  const getEgg = (status) => {
    if (status === null) {
      return egg;
    } else if (status === "Hatched") {
      return hatchedegg;
    } else if (status === "Infertile") {
      return infertileegg;
    } else {
      return egg;
    }
  };

  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress}>
      <View
        style={[
          reduxColors.cardContainer,
          props?.style,
          {
            cardID,
          },
        ]}
      >
        <View style={reduxColors.rowWrapper}>
          <View style={reduxColors.firstRow}>
            <View
              style={[
                reduxColors.imageWrapper,
                {
                  backgroundColor: getBackgroundColor(eggStatus),
                },
              ]}
            >
              <Image
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 36,
                  alignSelf: "center",
                }}
                source={icon}
                contentFit='fill'
                transition={300}
              />
              <SvgXml xml={getEgg(eggStatus)} height={32} width={26} />
            </View>
            <View>
              {chips ? (
                <View
                  style={[
                    reduxColors.chipBg,
                    {
                      backgroundColor: getChipBackgroundColor(eggStatus),
                    },
                  ]}
                >
                  <Text
                    style={[
                      reduxColors.chipText,
                      {
                        color: getChipTextColor(eggStatus),
                      },
                    ]}
                  >
                    {chips ? chips : null}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          <View>
            {animalIdentifier ? (
              <Text style={reduxColors.title}>{animalIdentifier}</Text>
            ) : null}

            {animalName ? (
              <Text
                style={reduxColors.title}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {capitalize(animalName)}
              </Text>
            ) : null}
            {enclosureName ? (
              <Text style={reduxColors.subtitle}>
                Enclosure: {capitalize(enclosureName)}
              </Text>
            ) : null}
            {sectionName ? (
              <Text style={reduxColors.subtitle}>
                Section: {capitalize(sectionName)}
              </Text>
            ) : null}
          </View>

          <View style={[reduxColors.rightArrowSection]}>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color={constThemeColor.onSurfaceVariant}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EggListCard;

const styles = (reduxColors) =>
  StyleSheet.create({
    cardContainer: {
      borderRadius: 10,
      // elevation: 1, // for shadow on Android
      shadowColor: reduxColors.neutralPrimary, // for shadow on iOS
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      flexDirection: "row",
      padding: Spacing.body,
      backgroundColor: reduxColors.onPrimary,
      justifyContent: "space-between",
      marginVertical: Spacing.mini,
    },
    rowWrapper: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      gap: 10,
    },
    firstRow: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
    },
    imageWrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
      width: 67,
      height: 40,
      padding: Spacing.micro,
      borderRadius: 50,
    },
    rightArrowSection: {
      alignSelf: "center",
      marginLeft: "auto",
      fontSize: FontSize.Antz_Major,
      marginHorizontal:Spacing.micro,
    },
    title: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    subtitleMedium: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,
      margin: Spacing.micro,
    },
    subtitle: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      margin: Spacing.micro,
    },

    chipBg: {
      display: "flex",
      paddingVertical: Spacing.mini,
      paddingHorizontal: Spacing.micro * 3,
      alignItems: "center",
      borderRadius: 5,
      gap: 10,
    },
    chipText: {
      fontSize: FontSize.Antz_Small.fontSize,
      fontWeight: FontSize.Antz_Small.fontWeight,
    },
  });
