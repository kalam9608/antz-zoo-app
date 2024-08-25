import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import FontSize from "../../configs/FontSize";
import moment from "moment";
const MeasSummaryList = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{ flexDirection: "row" }}
      disabled={props.deleted ? props.deleted : props.dead ? props.dead : false}
    >
      <View
        style={[
          reduxColors.weightView,
          {
            backgroundColor: constThemeColor.displaybgPrimary,
            flexDirection: "row",

            borderBottomLeftRadius: 7,
            borderTopLeftRadius: 7,
          },
        ]}
      >
        <View style={reduxColors.weightViewinside}>
          <View
            style={{
              // width: 70,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <Text
              style={[
                reduxColors.ageStyle,
                {
                  fontSize: FontSize.Antz_Major_Medium.fontSize,
                  fontWeight: FontSize.Antz_Major_Medium.fontWeight,
                },
              ]}
            >
              {moment(props.day).format("DD")}
            </Text>
            <View style={{ left: 5 }}>
              <Text
                style={[
                  reduxColors.ageStyle,
                  {
                    fontSize: FontSize.Antz_Body_Medium.fontSize,
                    fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  },
                ]}
              >
                {moment(props.month).format("MMM")}
              </Text>
              <Text
                style={[
                  reduxColors.ageStyle,
                  {
                    fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                    fontSize: FontSize.Antz_Body_Medium.fontSize,
                    color: constThemeColor.outline,
                  },
                ]}
              >
                {moment(props.year).format("YYYY")}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              alignItems: "stretch",
            }}
          >
            <View
              style={{
                alignItems: "flex-end",
                width: "40%",
              }}
            >
              <Text style={[reduxColors.weight, { textAlign: "right" }]}>
                {props.measurement_value.length < 5
                  ? `${props.measurement_value}`
                  : `${props.measurement_value.substring(0, 5)}`}
              </Text>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-start",
                width: "20%",
              }}
            >
              <Text
                style={{
                  fontSize: FontSize.Antz_Subtext_Medium.fontSize,
                  // alignItems: "flex-start",
                  color: constThemeColor.outline,
                  textAlign: "left",
                }}
              >
                {props.measurementUOM}
              </Text>
            </View>
          </View>
          <View style={[reduxColors.ageView, { width: "15%" }]}>
            <Text style={[reduxColors.ageStyle, { textAlign: "right" }]}>
              {props.age}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <View
          style={{
            backgroundColor: props.comments
              ? constThemeColor.moderateSecondary
              : constThemeColor.displaybgPrimary,
            flex: 1,
            width: 7,
            paddingTop: 10,
            paddingBottom: 10,
            marginVertical: 8,
            borderBottomRightRadius: 15,
            borderTopRightRadius: 15,
            left: -1,
          }}
        >
          <Text
            style={[
              reduxColors.commentStyle,
              {
                display: "none",
              },
            ]}
          >
            {props.comments}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MeasSummaryList;
// STYLES STARTS FROM HERE
const windowHeight = Dimensions.get("screen").height;
const windowWidth = Dimensions.get("screen").width;
const styles = (reduxColors) =>
  StyleSheet.create({
    weightView: {
      justifyContent: "space-between",
      marginVertical: 8,
    },
    weightViewinside: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 10,
      paddingBottom: 10,
      paddingHorizontal: 5,
      width: "98%",
    },
    weight: {
      color: reduxColors.onSurfaceVariant,
      fontSize: FontSize.Antz_Major_Medium.fontSize,
      fontWeight: FontSize.Antz_Major_Medium.fontWeight,
    },
    ageView: {
      alignItems: "center",
      justifyContent: "center",
    },
    ageStyle: {
      color: reduxColors.onSurfaceVariant,
    },
    image: {
      width: 44,
      height: 44,
      borderRadius: 50,
      alignSelf: "center",
      justifyContent: "center",
    },
  });
