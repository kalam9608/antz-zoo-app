import React from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import Spacing from "../configs/Spacing";

const FixBottomSheetComponent = ({
  horizontalPadding,
  children,
  allButtonStatus,
  status,
  approvedCheck,
}) => {
  const themeColors = useSelector((state) => state.darkMode.theme.colors);

  return (
    <View
      style={{
        borderTopLeftRadius: Spacing.major,
        borderTopRightRadius: Spacing.major,
        backgroundColor:
        status === "CANCELED" ? themeColors?.neutralSecondary :
          allButtonStatus?.reinitiate_button ||
          allButtonStatus?.already_rejected
            ? themeColors?.error
            : allButtonStatus?.already_approved
            ? // ||
              //   (approvedCheck &&
              //     !allButtonStatus?.show_check_temperature_button &&
              //     !allButtonStatus?.show_load_animals_button)
              themeColors?.primary
            : themeColors?.onPrimary,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2.5,
        zIndex: 999,
        elevation: 6,
      }}
    >
      {children}
    </View>
  );
};

export default FixBottomSheetComponent;
