import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import { opacityColor } from "../utils/Utils";

const AssessmentTemplateInsight = ({
  activeTab,
  onTabChange,
  isSpeciesDisabled,
  selectedTypeDataId,
  speciesCount = 0,
  typesCount
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);
  const InsightCard = ({ title, value, icon, isActive }) => (
    <TouchableOpacity
      onPress={() => onTabChange(title)}
      disabled={isSpeciesDisabled && title === "Species"}
      style={dynamicStyles.dataRow}
    >
      {icon ? (
        <Image
          source={icon}
          resizeMode={"contain"}
          style={{ height: 36, width: 36, marginBottom: Spacing.micro }}
        />
      ) : (
        <Text
          style={[
            dynamicStyles.cardNumber,
            isSpeciesDisabled && title === "Species"
              ? { color: constThemeColor.neutralSecondary }
              : {},
          ]}
        >
          {value}
        </Text>
      )}
      <Text
        style={[
          dynamicStyles.cardNumberTitle,
          isSpeciesDisabled && title === "Species"
            ? { color: constThemeColor.neutralSecondary }
            : {},
        ]}
      >
        {title}
      </Text>
      <View
        style={[
          dynamicStyles.activeCardIndicator,
          { opacity: isActive ? 1 : 0 },
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={dynamicStyles.mainContainer}>
      <InsightCard
        icon={require("../assets/info.png")}
        title={"Info"}
        isActive={activeTab === "Info"}
      />
      <InsightCard
        title={"Types"}
        value={typesCount}
        isActive={activeTab === "Types"}
      />
      <InsightCard
        title={"Species"}
        value={speciesCount}
        isActive={activeTab === "Species"}
      />
    </View>
  );
};

export default AssessmentTemplateInsight;

const styles = (reduxColors) =>
  StyleSheet.create({
    mainContainer: {
      marginVertical: -Spacing.major,
      marginTop: Spacing.body,
      paddingTop: Spacing.minor,
      paddingHorizontal: Spacing.minor,
      borderRadius: Spacing.small,
      backgroundColor: opacityColor(reduxColors.neutralPrimary, 40),
      flexDirection: "row",
    },
    dataRow: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-end",
    },
    cardNumber: {
      fontSize: FontSize.Antz_Large_Title.fontSize,
      fontWeight: FontSize.Antz_Large_Title.fontWeight,
      color: reduxColors.onPrimary,
    },
    cardNumberTitle: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.onPrimary,
      marginVertical: Spacing.small,
    },
    activeCardIndicator: {
      width: "80%",
      backgroundColor: reduxColors.primary,
      height: 5,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
    },
  });
