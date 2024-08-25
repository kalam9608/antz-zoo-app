import { View } from "react-native";
import { Text } from "react-native";
import { TouchableOpacity, StyleSheet } from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
// import { SvgXml } from "react-native-svg";
import { dateFormatter, ifEmptyValue, opacityColor } from "../utils/Utils";
import Spacing from "../configs/Spacing";
import FontSize from "../configs/FontSize";
import { useSelector } from "react-redux";
import { SvgXml } from "react-native-svg";
import line_start from "../assets/line_start_circle.svg";
import line_end from "../assets/line_end_circle.svg";

import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import ImageComponent from "./ImageComponent";
import GenderChipComponents from "./GenderChipComponents";
import { useState } from "react";
import moment from "moment";

const EnclosureInmateCard = ({ item, type = false }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <View
      style={{
        backgroundColor: constThemeColor.onPrimary,
        borderBottomLeftRadius: Spacing.small,
        borderBottomRightRadius: Spacing.small,
      }}
    >
      <TouchableOpacity
        style={{
          padding: Spacing.body + Spacing.mini,
          borderTopWidth: 1,
          borderColor: constThemeColor.outlineVariant,
        }}
        disabled={true}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <View style={{ marginRight: Spacing.mini, alignSelf: "center" }}>
            <ImageComponent icon={item?.default_icon} />
            <GenderChipComponents chipType={item?.sex} />
          </View>
          <View
            style={{
              marginLeft: Spacing.small,
              marginTop: Spacing.mini,
              flexDirection: "row",
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: FontSize.Antz_Small,
                  fontWeight: FontSize.Antz_Small.fontWeight,
                  color: constThemeColor?.neutralSecondary,
                }}
              >
                INMATE
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: FontSize.Antz_Minor_Title.fontSize,
                    fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                  }}
                >
                  {item?.local_id &&
                  item?.local_identifier_value &&
                  item?.local_id != null &&
                  item?.local_identifier_value != null
                    ? item?.local_id + ": " + item?.local_identifier_value
                    : item?.local_identifier_value &&
                      item?.local_identifier_value != null
                    ? item?.local_identifier_value
                    : item?.animal_id ?? "NA"}{" "}
                </Text>
                {type != "inmateHistory" && (
                  <GenderChipComponents chipType={item?.sex} />
                )}
              </View>

              <Text
                style={{
                  fontSize: FontSize.Antz_Body_Medium.fontSize,
                  fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                  color: constThemeColor?.onSurfaceVariant,
                }}
              >
                {ifEmptyValue(
                  item?.common_name
                    ? item?.common_name
                    : item?.scientific_name ?? "NA"
                )}
              </Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={24} />
          </View>
        </View>

        <View
          style={{
            backgroundColor: opacityColor(constThemeColor.neutralPrimary, 5),
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: Spacing.small,
            borderRadius: Spacing.mini,
            padding: Spacing.small,
          }}
        >
          <Text
            style={{
              fontSize: FontSize.Antz_Subtext_Regular.fontSize,
              fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
              color: constThemeColor.onSurfaceVariant,
            }}
          >
            From - {moment(item?.in_date).format("DD MMM yyyy")}
          </Text>

          {item?.out_date && (
            <Text
              style={{
                fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                color: constThemeColor.onSurfaceVariant,
              }}
            >
              To - {moment(item?.out_date).format("DD MMM yyyy")}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default EnclosureInmateCard;

const styles = (reduxColors) =>
  StyleSheet.create({
    tagsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 4,
      paddingRight: 0,
      paddingLeft: 0,
    },

    malechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.secondaryContainer,
      marginRight: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    femalechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.errorContainer,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      marginHorizontal: widthPercentageToDP(0.5),
    },
    undeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.displaybgSecondary,
      marginHorizontal: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    indeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.displaybgSecondary,
      marginHorizontal: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    malechipText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onSecondaryContainer,
    },
    femalechipText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onErrorContainer,
    },
    undeterminedText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.error,
    },
    indeterminedText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onSurfaceVariant,
    },
  });
