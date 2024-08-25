import { StyleSheet, Text, View } from "react-native";
import React from "react";
import InsightDataCarousel from "./DataCarousel";
import { useSelector } from "react-redux";
import Spacing from "../configs/Spacing";
import FontSize from "../configs/FontSize";
import InsightStatsCarousel from "./InsightStatsCarousel";

const CarouselCurrentData = ({ data, ...props }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);
  return (
    <View
      style={[
        dynamicStyles.cardContainer,
        {
          backgroundColor: constThemeColor.surface,
          borderRadius: 10,
          flex: 1,
        },
      ]}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignSelf: "flex-start",
          width: "100%",
        }}
      >
        <Text style={[dynamicStyles.dropdown]}>{props.title}</Text>
      </View>

      <View style={{ overflow: "hidden" }}>
        {/* <InsightDataCarousel data={data} {...props} /> */}
        <InsightStatsCarousel data={data} {...props} />
      </View>
    </View>
  );
};

export default CarouselCurrentData;

const styles = (reduxColors) =>
  StyleSheet.create({
    dropdown: {
      fontSize: FontSize.Antz_Subtext_title.fontSize,
      fontWeight: FontSize.Antz_Subtext_title.fontWeight,
      color: reduxColors.onSurface,
    },
    cardContainer: {
      marginTop: Spacing.body,
      marginBottom: Spacing.body,
      backgroundColor: reduxColors.surface,
      paddingHorizontal: Spacing.minor,
      paddingTop: Spacing.body,
    },
  });
