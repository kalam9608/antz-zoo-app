import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useSelector } from "react-redux";

import { opacityColor } from "../../utils/Utils";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";

const EnclosureInsightCard = ({
  enclosuresCount,
  animalsCount,
  speciesCount,
  onAnimalsPress,
  onEnclosuresPress,
  onSpeciesPress,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);

  return (
    <View style={dynamicStyles.mainContainer}>
      <TouchableOpacity
        disabled={Number(speciesCount ?? 0) === 0}
        style={dynamicStyles.cardContainer}
        onPress={onSpeciesPress}
      >
        <Text style={dynamicStyles.valueText}>{speciesCount}</Text>
        <Text style={dynamicStyles.titleText}>{"Species"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={Number(animalsCount ?? 0) === 0}
        onPress={onAnimalsPress}
        style={dynamicStyles.cardContainer}
      >
        <Text style={dynamicStyles.valueText}>{animalsCount}</Text>
        <Text style={dynamicStyles.titleText}>{"Animals"}</Text>
      </TouchableOpacity>

      {enclosuresCount > 0 ? (
        <TouchableOpacity
          disabled={Number(enclosuresCount ?? 0) === 0}
          style={dynamicStyles.cardContainer}
          onPress={onEnclosuresPress}
        >
          <Text style={dynamicStyles.valueText}>{enclosuresCount}</Text>
          <Text style={dynamicStyles.titleText}>{"Enclosures"}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default EnclosureInsightCard;

const styles = (reduxColors) =>
  StyleSheet.create({
    mainContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    cardContainer: {
      alignItems: "center",
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.small,
      borderWidth: 1,
      borderRadius: Spacing.body,
      borderColor: opacityColor(reduxColors.onPrimary, 30),
      backgroundColor: reduxColors.blackWithPointFour,
      marginRight: Spacing.small,
    },
    titleText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onPrimary,
    },
    valueText: {
      fontSize: FontSize.Antz_Large_Title.fontSize,
      fontWeight: FontSize.Antz_Large_Title.fontWeight,
      color: reduxColors.onPrimary,
    },
  });
