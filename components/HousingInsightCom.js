import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import Colors from "../configs/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Card, Menu } from "react-native-paper";
import { useSelector } from "react-redux";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useState } from "react";
import FontSize from "../configs/FontSize";
import { shortenNumber } from "../utils/Utils";
import insightscollectionIcon from "../assets/insights_collection_icon.svg";
import { SvgXml } from "react-native-svg";
import Spacing from "../configs/Spacing";
import InsightsSiteFilter from "./InsightsSiteFilter";
import Background from "./BackgroundImage";
const InsightsCardComp = ({
  mortalityObj = {},
  mortalityType = "",
  onPress,
  ...props
}) => {
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);

  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [itemCount, setItemCount] = useState(2);
  const data = [
    {
      id: 1,
      name: "Species",
      value: shortenNumber(props.species),
    },
    {
      id: 2,
      name: "Animals",
      value: shortenNumber(props.animal),
    },
    {
      id: 3,
      name: "Enclosures",
      value: shortenNumber(props.enclosures),
    },
  ];
  return (
    <>
      {/* {props.showsSiteFilter ? (<InsightsSiteFilter handleSiteSelect={props?.handleSiteSelect} selectedId={props?.selectedId} />) : null} */}
     
      <View
        style={[
          {
            backgroundColor: constThemeColor.onPrimaryContainer,
            borderRadius: 8,
          },
        ]}
      >
        <Background>
        <Card.Title
          style={[{}]}
          title={"All Site Insights"}
          titleStyle={{
            fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
            fontSize: FontSize.Antz_Minor_Medium.fontSize,
            color: constThemeColor.onPrimary,
            marginLeft: -5,
            marginTop: 5,
          }}
          left={(props) => (
            <View
              colors={[Colors.LinearGradient1, Colors.LinearGradient2]}
              style={{
                borderRadius: wp(30),
                height: 35,
                width: 35,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SvgXml
                xml={insightscollectionIcon}
                style={{ alignSelf: "center" }}
              />
            </View>
          )}
        />

        {/* <Entypo
            name="dots-three-vertical"
            size={20}
            style={{
              color: constThemeColor.onPrimary,
              alignSelf: "flex-end",
              top: hp(3.5),
              right: wp(5),
              position: "absolute",
            }}
          /> */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
            flexWrap: "wrap",
            paddingHorizontal: 15,
            width: data.length > itemCount ? "100%" : "60%",
          }}
        >
          {data.map((item) => {
            return (
              <TouchableOpacity
                style={[reduxColors.statistics]}
                onPress={() => onPress(item)}
                disabled={item.value == "0" ? true : false}
              >
                <Text style={reduxColors.statisticsValue}>{item.value}</Text>

                <Text style={reduxColors.statisticsDownText}>{item.name}</Text>
              </TouchableOpacity>
              // {/* <View style={reduxColors.statistics}>
              //   <Text style={reduxColors.statisticsValue}>
              //     {shortenNumber(props.enclosures)}
              //   </Text>

              //   <Text style={reduxColors.statisticsDownText}>Enclosures</Text>
              // </View> */}
              // {/* <View style={reduxColors.statistics}>
              //   <Text style={reduxColors.statisticsValue}>
              //     {shortenNumber(props.animal)}
              //   </Text>
              //   <Text style={reduxColors.statisticsDownText}>Animals</Text>
              // </View> */}
            );
          })}
        </View>
        {/* <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 15,
            marginBottom: 20,
            flexWrap: "wrap",
            paddingHorizontal: 15,
          }}
        >
          <View style={reduxColors.statistics}>
            <Text style={reduxColors.statisticsValue}>
              {shortenNumber(props.species)}
            </Text>
            <Text style={reduxColors.statisticsDownText}>Species</Text>
          </View>

          <View style={reduxColors.statistics}>
            <Text style={reduxColors.statisticsValue}>
              {shortenNumber(props.animal)}
            </Text>
            <Text style={reduxColors.statisticsDownText}>Animals</Text>
          </View>
        </View> */}
        </Background>
      </View>
    </>
  );
};

export default InsightsCardComp;

const styles = (reduxColors) =>
  StyleSheet.create({
    statistics: {
      // flex: 1,
      alignItems: "center",
    },
    statisticsValue: {
      fontSize: FontSize.Antz_Large_Title.fontSize,
      fontWeight: FontSize.Antz_Large_Title.fontWeight,
      color: reduxColors.primaryContainer,
    },

    statisticsDownText: {
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      color: reduxColors.surfaceVariant,
    },

    addAllSideBorderRadius: {
      borderRadius: Spacing.minor,
    },

    addTopBorderRadius: {
      borderBottomLeftRadius: Spacing.minor,
      borderBottomRightRadius: Spacing.minor,
    },
  });
