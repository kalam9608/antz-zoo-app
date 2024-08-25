import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";

const CustomInsightCard = ({ insightData,statsPress, ...props }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);

  return (
    <View style={[dynamicStyles.mainContainer, props.mainContainer]}>
      <View style={[dynamicStyles.dataContainer, props.dataCont]}>
        {insightData?.map((item) => {
          return (
            <TouchableOpacity onPress={()=>statsPress(item?.title)}>
            <View style={dynamicStyles.dataRow}>
              <Text style={[dynamicStyles.cardNumber, props.cardNumColor]}>
                {item.count ? item.count : 0}
              </Text>
              <Text style={[dynamicStyles.cardNumberTitle, props.cardTitle]}>
                {item.title}
              </Text>
            </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomInsightCard;

const styles = (reduxColors) =>
  StyleSheet.create({
    mainContainer: {
      marginVertical: -Spacing.major,
      marginTop: Spacing.body,
      paddingVertical: Spacing.minor,
      paddingHorizontal: Spacing.major,
      borderRadius: Spacing.small,
    },
    dataContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    dataRow: {
      alignItems: "center",
    },
    cardNumber: {
      fontSize: FontSize.Antz_Large_Title.fontSize,
      fontWeight: FontSize.Antz_Large_Title.fontWeight,
      color: reduxColors.primaryContainer,
    },
    cardNumberTitle: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.surfaceVariant,
    },
  });
