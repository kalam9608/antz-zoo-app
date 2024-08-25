import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import Colors from "../../configs/Colors";
import { useSelector } from "react-redux";

export const MonthlyDate = ({
  item,
  index,
  isSelectedDate,
  isCurrentDate,
  selectedDate,
  checkCurrentDate,
  onDatePress,
  showAllDate,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  const dateViewStyles = {
    backgroundColor: isSelectedDate
      ? Colors.defaultTextColor
      : isCurrentDate
      ? Colors.LinearGradient1
      : constThemeColor.onPrimary,
    height: 60,
    aspectRatio: 1 / 0.95,
    marginHorizontal: Spacing.small,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: Platform.OS == "android" ? 1 : 0.5,
    borderRadius: Spacing.small,
    borderColor: isCurrentDate
      ? Colors.LinearGradient1
      : constThemeColor.insightBottomBorder,
  };

  const renderDateView = () => (
    <View style={{ position: "relative" }}>
      <View style={dateViewStyles}>
        <Text
          style={[
            reduxColors.day,
            {
              color: isSelectedDate
                ? Colors.journalDateColor
                : isCurrentDate
                ? Colors.black
                : Colors.mediumGrey,
            },
          ]}
        >
          {item?.day}
        </Text>
        <Text
          style={[
            reduxColors.date,
            {
              color: isSelectedDate ? Colors.journalDateColor : Colors.black,
            },
          ]}
        >
          {item?.date}
        </Text>
      </View>

      {(isSelectedDate || (selectedDate === "" && isCurrentDate)) && (
        <View style={{ position: "absolute", bottom: -5, alignSelf: "center" }}>
          <View
            style={{
              borderBottomWidth: 0.4,
              borderLeftWidth: 0.4,
              backgroundColor: isSelectedDate
                ? Colors.defaultTextColor
                : isCurrentDate
                ? Colors.LinearGradient1
                : constThemeColor.onPrimary,
              borderColor: isCurrentDate
                ? Colors.LinearGradient1
                : constThemeColor.insightBottomBorder,
              width: Spacing.body,
              height: Spacing.body,
              transform: [{ rotate: "315deg" }],
            }}
          ></View>
        </View>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{ marginBottom: Spacing.body }}
      onPress={() => onDatePress(isCurrentDate, index, item)}
    >
      {showAllDate && renderDateView()}
      {!showAllDate && checkCurrentDate && renderDateView()}
    </TouchableOpacity>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.displaybgSecondary,
    },
    card: {
      borderRadius: Spacing.small,
      // flexDirection: "row",
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.body,
      alignSelf: "center",
      flex: 1,
    },
    cardTitleStyle: {
      color: reduxColors.subtitle,
      ...FontSize.Antz_Minor_Medium,
      paddingVertical: Spacing.mini,
    },
    date: { ...FontSize.Antz_Minor_Title },
    day: { ...FontSize.Antz_Subtext_title },
    item: {
      flexDirection: "row",
      paddingVertical: Spacing.small,
      paddingHorizontal: Spacing.body,
    },
    time: {
      ...FontSize.Antz_Body_Title,
      paddingRight: Spacing.small,
    },
    timeFormat: {
      textAlign: "right",
      paddingRight: Spacing.small,
      ...FontSize.Antz_Subtext_Regular,
    },
    text1: {
      ...FontSize.Antz_Minor_Medium,
      paddingBottom: Spacing.small,
    },
    text2: {
      ...FontSize.Antz_Body_Regular,
      paddingBottom: Spacing.small,
    },
    footerContainer: {
      width: "100%",
      paddingVertical: Spacing.minor,
      alignItems: "center",
      justifyContent: "center",
    },
  });
