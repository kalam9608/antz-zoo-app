import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import { opacityColor } from "../utils/Utils";

const SubmitBtn = ({
  onPress,
  Title,
  firstTitle,
  isButtonDisabled,
  buttonText,
  backgroundColor,
  color,
  iconName,
  width,
  horizontalPadding,

  fontSize,
  fontWeight,
}) => {
  const themeColors = useSelector((state) => state.darkMode.theme.colors);

  return (
    <View
      style={{
        paddingHorizontal:
          horizontalPadding != null ? horizontalPadding : Spacing.minor,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        style={{
          // width: widthPercentageToDP(width?width:90),
          width: "100%",
          alignSelf: "center",
          // marginVertical: heightPercentageToDP(2),
          borderWidth: iconName ? null : 1,
          borderColor: backgroundColor
            ? backgroundColor
            : isButtonDisabled
            ? opacityColor(themeColors.neutralPrimary, 10)
            : themeColors.onPrimaryContainer,
          height: 56,
          borderRadius: Spacing.small,
          backgroundColor: backgroundColor
            ? backgroundColor
            : isButtonDisabled
            ? opacityColor(themeColors.neutralPrimary, 10)
            : themeColors.onPrimaryContainer,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
        disabled={isButtonDisabled}
        accessible={true}
        accessibilityLabel={"submitBtn"}
        AccessibilityId={"submitBtn"}
      >
        {iconName && (
          <MaterialCommunityIcons
            name={iconName}
            color={color}
            size={24}
            style={{}}
          />
        )}
        <Text
          style={{
            textAlign: "center",
            //  paddingTop:heightPercentageToDP(1.5),
            color: color ? color : themeColors.onPrimary,
            fontSize:
              fontSize === undefined
                ? FontSize.Antz_Major_Title_btn.fontSize
                : fontSize,
            fontWeight:
              fontWeight === undefined
                ? FontSize.Antz_Major_Title_btn.fontWeight
                : fontWeight,
          }}
        >
          {buttonText ? buttonText : "Submit"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SubmitBtn;
