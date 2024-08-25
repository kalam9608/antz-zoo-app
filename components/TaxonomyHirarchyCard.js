import { View, Text, StyleSheet, Platform } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import Spacing from "../configs/Spacing";
import FontSize from "../configs/FontSize";
import { Card } from "react-native-paper";
import { opacityColor } from "../utils/Utils";

const TaxonomyHirarchyCard = ({
  name,
  title,
  backgroundColor,
  default_common_name,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <View
      style={[
        {
          // minHeight: 68,
          backgroundColor: backgroundColor,
          justifyContent: "center",
          borderRadius: Spacing.small,
          marginBottom: Spacing.body,
          alignItems: "center",
        },
      ]}
    >
      <View style={[reduxColors.cardContainerTaxonomy]}>
        <Text style={reduxColors.titleStyle}>{title ?? "NA"}</Text>
        <Text style={reduxColors.nameStyle}>{name ?? "NA"}</Text>
        <Text style={reduxColors.defaultNameStyle}>
          {default_common_name ?? name}
        </Text>
      </View>
    </View>
  );
};

export default TaxonomyHirarchyCard;

const styles = (reduxColors) =>
  StyleSheet.create({
    cardContainerTaxonomy: {
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: Spacing.body,
      width: "70%",
    },
    titleStyle: {
      color: reduxColors.outline,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      paddingHorizontal: Spacing.small,
      marginVertical: Spacing.micro,
    },
    nameStyle: {
      color: reduxColors.onSurface,
      fontWeight: FontSize.Antz_Major_Medium.fontWeight,
      fontSize: FontSize.Antz_Major_Medium.fontSize,
      textAlign: "center",
      paddingHorizontal: Spacing.small,
      // marginBottom: Spacing.mini,
    },
    defaultNameStyle: {
      color: reduxColors.onSurfaceVariant,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      textAlign: "center",
      paddingHorizontal: Spacing.small,
      marginVertical: Spacing.micro,
      fontStyle: "italic",
    },
  });
