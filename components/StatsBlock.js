import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { shortenNumber } from "../utils/Utils";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";

const StatsBlock = ({
  insightData,
  label,
  borderColor,
  borderWidth,
  backgroundColor,
  onPress,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  return (
    (typeof(onPress) !== 'undefined')  ? (
      <TouchableOpacity onPress={onPress} disabled={insightData == "0" ? true : false}>
      <StatsBlockUI insightData={insightData} label={label} borderColor={borderColor} borderWidth={borderWidth} backgroundColor={backgroundColor} constThemeColor={constThemeColor} />
    </TouchableOpacity>) : (<StatsBlockUI insightData={insightData} label={label} borderColor={borderColor} borderWidth={borderWidth} backgroundColor={backgroundColor} constThemeColor={constThemeColor} />)
  );
};


const StatsBlockUI = ({insightData, label, borderColor, borderWidth,  backgroundColor, constThemeColor}) => {
  return (
    <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          minWidth: "30%",
        }}
      >
        <Text
          style={{
            fontWeight: FontSize.Antz_Large_Title.fontWeight,
            fontSize: FontSize.Antz_Large_Title.fontSize,
            color: constThemeColor.onPrimaryContainer,
            borderColor: borderColor ?? null,
            borderWidth: borderWidth ?? null,
            paddingHorizontal: Spacing.body,
            borderRadius: 5,
            minWidth: 60,
            textAlign: "center",
            backgroundColor: backgroundColor ?? null,
          }}
        >
          {shortenNumber(insightData)}
        </Text>
        <Text
          style={{
            fontWeight: FontSize.Antz_Body_Regular.fontWeight,
            fontSize: FontSize.Antz_Body_Regular.fontSize,
            margin: Spacing.mini,
            paddingHorizontal: Spacing.mini,
            color: constThemeColor.onSurfaceVariant,
          }}
        >
          {label}
        </Text>
      </View>
  )
}

export default StatsBlock;
