import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Spacing from "../configs/Spacing";
import { opacityColor } from "../utils/Utils";
import ImageComponent from "./ImageComponent";
import Config from "../configs/Config";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";

const CommonSpeciesCard = ({ icon, SpeciesName, complete_name }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = style(constThemeColor);
  return (
    <View style={reduxColors.speciesCard}>
      <View style={{ marginRight: Spacing.body, alignSelf: "center" }}>
        <ImageComponent
          icon={
            icon ??
            `${Config.BASE_APP_URL}uploads/assets/class_images/default_animal.svg`
          }
        />
      </View>
      <View>
        <Text
          style={{
            fontSize: FontSize.Antz_Minor,
            fontWeight: FontSize.weight600,
          }}
        >
          {SpeciesName}
        </Text>
        <Text
          style={{
            color: constThemeColor.onSurfaceVariant,
            fontStyle: "italic",
            marginTop: Spacing.micro,
          }}
        >
          ({complete_name})
        </Text>
      </View>
    </View>
  );
};

export default CommonSpeciesCard;

const style = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors?.secondaryContainer,
    },
    body: {
      flex: 1,
      paddingHorizontal: Spacing.minor,
    },
    speciesCard: {
      backgroundColor: opacityColor(reduxColors.surfaceDisabled, 10),
      flexDirection: "row",
      borderWidth: 1,
      borderColor: opacityColor(reduxColors?.outlineVariant, 5),
      borderRadius: Spacing.small,
      paddingHorizontal: Spacing.minor,
      paddingVertical: Spacing.minor,
      marginTop: Spacing.body,
    },
  });
