import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

import { opacityColor } from "../utils/Utils";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import Background from "./BackgroundImage";

const SiteInsight = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);

  return (
    <View style={dynamicStyles.mainContainer}>
      <Background>
      <View style={[dynamicStyles.dataContainer, props.dataCont]}>
        <TouchableOpacity
          style={dynamicStyles.dataRow}
          disabled={Number(props?.speciesCount ?? 0) === 0}
          onPress={() => props?.onStatsPress("Species")}
        >
          <Text style={[dynamicStyles.cardNumber, props.cardNum]}>
            {props.speciesCount}
          </Text>
          <Text style={[dynamicStyles.cardNumberTitle, props.cardTitle]}>
            Species
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.dataRow}
          disabled={Number(props?.animalCount ?? 0) === 0}
          onPress={() => props?.onStatsPress("Animals")}
        >
          <Text style={[dynamicStyles.cardNumber, props.cardNum]}>
            {props.animalCount}
          </Text>
          <Text style={[dynamicStyles.cardNumberTitle, props.cardTitle]}>
            Animals
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.dataRow}
          disabled={Number(props?.encCount ?? 0) === 0}
          onPress={() => props?.onStatsPress("Enclosures")}
        >
          <Text style={[dynamicStyles.cardNumber, props.cardNum]}>
            {props.encCount}
          </Text>
          <Text style={[dynamicStyles.cardNumberTitle, props.cardTitle]}>
            Enclosures
          </Text>
        </TouchableOpacity>
      </View>
      </Background>
      {/* <Image
        source={require('../assets/down_arrow.png')}
        resizeMode={'contain'}
        style={dynamicStyles.downArrow}
      /> */}
    </View>
  );
};

export default SiteInsight;

const styles = (reduxColors) =>
  StyleSheet.create({
    mainContainer: {
      marginVertical: -Spacing.major,
      marginTop: Spacing.body,
      paddingVertical: Spacing.minor,
      // paddingBottom: Spacing.small,
      paddingHorizontal: Spacing.major,
      borderRadius: Spacing.small,
      backgroundColor: opacityColor(reduxColors.neutralPrimary, 40),
    },
    dataContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    dataRow: {
      // flex: 1,
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
    downArrow: {
      height: 14,
      width: 14,
      alignSelf: "center",
      marginTop: Spacing.minor,
    },
  });
