import React, { useState } from "react";
import { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

const Switch = ({ handleToggle, active, multiple, data, blockToggle }) => {
  const [isActive, setIsActive] = useState(active ?? false);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const handleSwitch = () => {
    if (blockToggle) {
      // If blockToggle is truthy, prevent switching
      return;
    }
    setIsActive(!isActive);
    if (multiple) {
      handleToggle(data, !isActive);
    } else {
      handleToggle(!isActive);
    }
  };

  useEffect(() => {
    setIsActive(active);
  }, [active]);

  return (
    <>
      <TouchableOpacity onPress={handleSwitch}>
        <View style={isActive ? styles.activeSwitchWrap : styles.switchWrap}>
          <View
            style={isActive ? styles.activeInnerPoint : styles.innerPoint}
          />
        </View>
      </TouchableOpacity>
    </>
  );
};

const style = (reduxColor) =>
  StyleSheet.create({
    switchWrap: {
      height: heightPercentageToDP(3.5),
      width: heightPercentageToDP(8),
      backgroundColor: reduxColor?.background,
      borderRadius: widthPercentageToDP(5),
      borderWidth: widthPercentageToDP(0.5),
      borderColor: reduxColor?.onPrimaryContainer,
      flexDirection: "row",
      alignItems: "center",
    },
    activeSwitchWrap: {
      height: heightPercentageToDP(3.5),
      width: heightPercentageToDP(6),
      backgroundColor: reduxColor?.primary,
      borderRadius: heightPercentageToDP(5),
      borderWidth: heightPercentageToDP(0.5),
      borderColor: reduxColor?.primary,
      flexDirection: "row",
      alignItems: "center",
    },
    innerPoint: {
      height: heightPercentageToDP(3),
      width: heightPercentageToDP(3),
      borderRadius: heightPercentageToDP(12),
      backgroundColor: reduxColor?.onPrimaryContainer,
      position: "absolute",
      left: widthPercentageToDP(0.2),
    },
    activeInnerPoint: {
      height: heightPercentageToDP(3),
      width: heightPercentageToDP(3),
      borderRadius: heightPercentageToDP(12),
      backgroundColor: reduxColor?.onPrimary,
      position: "absolute",
      right: widthPercentageToDP(0.2),
    },
  });

export default Switch;
