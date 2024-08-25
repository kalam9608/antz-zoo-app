import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Spacing from "../configs/Spacing";
import { Ionicons } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import Chronic_white from "../assets/Chronic_white.svg";
import FontSize from "../configs/FontSize";
import { useSelector } from "react-redux";
import { opacityColor } from "../utils/Utils";
const DiagnosisItem = ({ item, handleEditSelected, handleDeleteName }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  function backgroundColor(priroty, constThemeColor) {
    if (priroty == "Mild") {
      return constThemeColor?.secondaryContainer;
    } else if (priroty == "Moderate") {
      return constThemeColor?.notes;
    } else if (priroty == "High") {
      return constThemeColor?.tertiaryContainer;
    } else if (priroty == "Extreme") {
      return constThemeColor?.errorContainer;
    } else if (priroty == "active") {
      return constThemeColor?.onBackground;
    } else if (priroty == "closed") {
      return constThemeColor?.errorContainer;
    } else {
      return constThemeColor?.secondaryContainer;
    }
  }
  function backgroundSideColor(priroty, constThemeColor) {
    if (priroty == "Mild") {
      return constThemeColor?.secondary;
    } else if (priroty == "Moderate") {
      return constThemeColor?.moderateSecondary;
    } else if (priroty == "High") {
      return constThemeColor?.tertiary;
    } else if (priroty == "Extreme") {
      return constThemeColor?.error;
    } else if (priroty == "active") {
      return constThemeColor?.onBackground;
    } else if (priroty == "closed") {
      return constThemeColor?.errorContainer;
    } else {
      return constThemeColor?.secondary;
    }
  }
  return (
    <View style={{ flexDirection: "row", width: "100%" }}>
      <View
        style={{
          width: 8,
          backgroundColor: backgroundSideColor(
            item.additional_info?.severity,
            constThemeColor
          ),
          marginTop: Spacing.small,
          borderTopLeftRadius: Spacing.mini,
          borderBottomLeftRadius: Spacing.mini,
        }}
      />
      <View
        style={{
          backgroundColor:
            item?.additional_info?.status == "closed"
              ? constThemeColor?.adviceBorderColor1
              : backgroundColor(
                  item.additional_info?.severity,
                  constThemeColor
                ),
          flex: 1,
          marginTop: Spacing.small,
          borderBottomRightRadius: Spacing.mini,
          borderTopRightRadius: Spacing.mini,
          paddingHorizontal: Spacing.small,
        }}
      >
        <View style={[reduxColors.commonNameList]}>
          <TouchableOpacity
            style={{ flex: 1 }}
            disabled={handleEditSelected ? false : true}
            onPress={() => handleEditSelected(item)}
            accessible={true}
            accessibilityLabel={"selectedDiagnosis"}
            AccessibilityId={"selectedDiagnosis"}
          >
            <Text
              style={[
                reduxColors.selectedName,
                {
                  textDecorationLine:
                    item?.additional_info?.status == "closed"
                      ? "line-through"
                      : "none",
                },
              ]}
            >
              {item.name ?? item.diagnosis}
            </Text>
            {item.additional_info?.chronic == true ? (
              <View
                style={{
                  flexDirection: "row",
                  marginTop: Spacing.small,
                  padding: Spacing.mini + Spacing.micro,
                  backgroundColor: opacityColor(
                    constThemeColor.neutralPrimary,
                    40
                  ),
                  borderRadius: Spacing.mini,
                  width: 80,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SvgXml
                    xml={Chronic_white}
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                </View>
                <Text
                  style={[
                    FontSize.Antz_Subtext_title,
                    {
                      color: constThemeColor.onPrimary,
                      marginLeft: Spacing.mini,
                    },
                  ]}
                >
                  Chronic
                </Text>
              </View>
            ) : null}
            { item.additional_info.notes ||
                            item.additional_info?.start_note ||
                            item.additional_info?.stop_note ? (
              <>
                {Object.keys(item.additional_info).length > 0 ? (
                  <>
                    <View
                      style={[
                        reduxColors.noteItem,
                        {
                          marginTop: Spacing.small,
                          display:
                            ((item.additional_info.notes ||
                            item.additional_info?.start_note)&& item.additional_info?.status == "active")||
                            (item.additional_info?.stop_note && item.additional_info?.status == "closed")
                              ? "flex"
                              : "none",
                        },
                      ]}
                    >
                      <Text style={[reduxColors.detailsReportTitle]}>
                        {item.additional_info?.status == "active"
                          ? item.additional_info?.start_note?item.additional_info?.start_note:
                            item.additional_info?.notes
                          : null}
                        {item.additional_info?.status == "closed"
                          ? item.additional_info?.stop_note ?? null
                          : null}
                      </Text>
                    </View>               
                  </>
                ) : null}
              </>
            ):null}
          </TouchableOpacity>
          {item.additional_info?.active_at ? null : (
            <TouchableOpacity
              disabled={handleDeleteName ? false : true}
              onPress={() => handleDeleteName(item)}
              accessible={true}
              accessibilityLabel={"closeDiagnosis"}
              AccessibilityId={"closeDiagnosis"}
            >
              <Ionicons
                name="close-outline"
                size={24}
                color={constThemeColor.onSurfaceVariant}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default DiagnosisItem;

const styles = (reduxColors) =>
  StyleSheet.create({
    commonNameList: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      paddingVertical: Spacing.body,
    },
    selectedName: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.neutralPrimary,
    },
    noteItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    detailsReportTitle: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.neutralPrimary,
    },
  });
