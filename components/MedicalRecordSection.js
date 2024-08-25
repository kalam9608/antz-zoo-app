import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import Spacing from "../configs/Spacing";
import FontSize from "../configs/FontSize";

const MedicalRecordSection = ({
  title,
  textStyle,
  itemStyle,
  onPress,
  data,
  titleStyle,
  contStyle,
  handleToggle,
  templateData,
  selectedItemsColor,
  activeSearchSgBtnCover,
  searchSuggestionbtnCover,
  onLongPress,
  ...props
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <>
      <Text style={[reduxColors.searchSuggestionTitle, titleStyle]}>
        {title}
      </Text>
      <View style={reduxColors.commBtnContainer}>
        {data?.map((item, index) => {
          return (
            <View key={index}>
              <TouchableOpacity
                onPress={() => {
                  handleToggle(item);
                }}
                onLongPress={() => {
                  onLongPress? onLongPress(item):null
                }}
                style={[
                  selectedItemsColor != undefined && selectedItemsColor(item)
                    ? reduxColors.activeSearchSgBtnCover
                    : reduxColors.searchSuggestionbtnCover,
                  contStyle,
                ]}
              >
                <Text
                  style={[reduxColors.caseTypeBtnTxt, textStyle]}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </>
  );
};

export default MedicalRecordSection;

const styles = (reduxColors) =>
  StyleSheet.create({
    commBtnContainer: { flexDirection: "row", flex: 1, flexWrap: "wrap" },
    caseTypeBtnTxt: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors.onPrimaryContainer,
    },
    searchSuggestionTitle: {
      color: reduxColors.onSecondaryContainer,
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      marginTop: Spacing.minor,
      marginBottom: Spacing.mini,
      marginLeft: Spacing.micro,
    },
    recentlyUsedbtnCover: {
      width: "auto",
      margin: Spacing.mini,
      paddingHorizontal: Spacing.small,
      paddingVertical: Spacing.mini + Spacing.micro,
      height: 32,
      borderRadius: Spacing.small,
      borderWidth: 1,
      color: reduxColors.outline,
      borderColor: reduxColors.outline,
      backgroundColor: reduxColors.surface,
      justifyContent: "center",
      alignItems: "center",
    },
    activeSearchSgBtnCover: {
      width: "auto",
      margin: Spacing.mini,
      paddingHorizontal: Spacing.small,
      paddingVertical: Spacing.mini + Spacing.micro,
      height: 32,
      borderRadius: Spacing.small,
      borderWidth: 1,
      borderColor: reduxColors.outline,
      backgroundColor: reduxColors.secondaryContainer,
      justifyContent: "center",
      alignItems: "center",
    },
    searchSuggestionbtnCover: {
      width: "auto",
      height: 32,
      margin: Spacing.mini,
      paddingHorizontal: Spacing.small,
      paddingVertical: Spacing.mini + Spacing.micro,
      borderRadius: Spacing.small,
      borderWidth: 1,
      borderColor: reduxColors.outline,
      backgroundColor: reduxColors.onPrimary,
      justifyContent: "center",
      alignItems: "center",
    },
  });
