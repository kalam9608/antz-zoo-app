import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";

const AssessmentMeasurList = ({ item, type, index, ...props }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  moment.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "sec",
      ss: "%dsec",
      m: "a min",
      mm: "%dmin",
      h: "an hr",
      hh: "%dh",
      d: "a day",
      dd: "%dd",
      w: "a week",
      ww: "%d weeks",
      M: "a month",
      MM: "%d months",
      y: "a year",
      yy: "%d years",
    },
  });
  const dateObj = new Date(item?.recorded_date_time);
  const options = { hour: "numeric", minute: "numeric" };
  const timeString = dateObj.toLocaleTimeString(undefined, options);
  return (
    <View style={reduxColors.container}>
      <View style={reduxColors.Datacontainer}>
        <View style={{ width: 60 }}>
          <Text
            style={{
              ...FontSize.Antz_Subtext_title,
              color: constThemeColor.onSurfaceVariant,
              textAlign: "right",
            }}
          >
            {moment(item?.recorded_date_time).fromNow()}
          </Text>
          <Text
            style={{
              ...FontSize.Antz_Subtext_title,
              color: constThemeColor.neutralSecondary,
              textAlign: "right",
            }}
          >
            {timeString}
          </Text>
        </View>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={
            type === "numeric_value"
              ? props.numericValuePress
              : type === "numeric_scale"
              ? props.numericScalePress
              : type === "text"
              ? props.textPress
              : type === "list"
              ? props.listPress
              : null
          }
        >
          <View
            style={[
              reduxColors.typeView,
              {
                backgroundColor:
                  index % 2 == 0
                    ? constThemeColor.background
                    : constThemeColor.displaybgPrimary,
              },
            ]}
          >
            {type === "numeric_value" ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={reduxColors.weightSize}>
                  {item?.assessment_value}
                </Text>
                <Text style={reduxColors.weight}>{item?.unit_name}</Text>
              </View>
            ) : type === "numeric_scale" ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    ...FontSize.Antz_Body_Medium,
                    color: constThemeColor.onSecondaryContainer,
                  }}
                >
                  {item?.assessment_rank} {item?.default_value_label}
                </Text>
              </View>
            ) : type === "text" ? (
              <View>
                <Text
                  style={{
                    ...FontSize.Antz_Body_Medium,
                    color: constThemeColor.onSecondaryContainer,
                  }}
                >
                  {item?.assessment_value}
                </Text>
              </View>
            ) : type === "list" ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    ...FontSize.Antz_Body_Medium,
                    color: constThemeColor.onSecondaryContainer,
                  }}
                >
                  {item?.default_value_label}
                </Text>
              </View>
            ) : null}
            {item?.comments ? (
              <MaterialIcons
                name="sticky-note-2"
                size={20}
                color={constThemeColor.moderateSecondary}
              />
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AssessmentMeasurList;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      //   flex: 1,
    },
    Datacontainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: Spacing.minor,
      marginHorizontal: Spacing.minor,
    },
    typeView: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      justifyContentL: "center",
      padding: Spacing.body,
      borderRadius: Spacing.mini,
      marginLeft: Spacing.body,
    },
    weightSize: {
      ...FontSize.Antz_Major_Medium,
      color: reduxColors.onSurfaceVariant,
    },
    weight: {
      ...FontSize.Antz_Minor_Medium,
      color: reduxColors.outline,
      paddingLeft: Spacing.mini,
    },
  });
