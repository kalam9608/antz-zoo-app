import React, { useState } from "react";
import { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

const Switch = ({
  handleToggle,
  active,
  multiple,
  data,
  activeSwitchWrapHeight,
  activeSwitchWrapWidth,
  switchWrapHeight,
  switchWrapWidth,
  activeInnerPointHeight,
  activeInnerPointWidth,
  innerPointHeight,
  innerPointWidth,
  disabled
}) => {

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const handleSwitch = () => {
    if (multiple) {
      handleToggle(data, !active);
    } else {
      handleToggle(!active);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={handleSwitch} disabled={disabled}>
        <View
          style={
            active
              ? [
                  styles.activeSwitchWrap,
                  {
                    height: activeSwitchWrapHeight
                      ? activeSwitchWrapHeight
                      : 30,
                    width: activeSwitchWrapWidth ? activeSwitchWrapWidth : 50,
                  },
                ]
              : [
                  styles.switchWrap,
                  {
                    height: switchWrapHeight ? switchWrapHeight : 30,
                    width: switchWrapWidth ? switchWrapWidth : 50,
                  },
                ]
          }
        >
          <View
            style={
              active
                ? [
                    styles.activeInnerPoint,
                    {
                      height: activeInnerPointHeight
                        ? activeInnerPointHeight
                        : 20,
                      width: activeInnerPointWidth ? activeInnerPointWidth : 20,
                    },
                  ]
                : [
                    styles.innerPoint,
                    {
                      height: innerPointHeight ? innerPointHeight : 20,
                      width: innerPointWidth ? innerPointWidth : 20,
                    },
                  ]
            }
          />
        </View>
      </TouchableOpacity>
    </>
  );
};

const style = (reduxColor) =>
  StyleSheet.create({
    switchWrap: {
      backgroundColor: reduxColor?.background,
      borderRadius: 17,
      borderWidth: 2,
      borderColor: reduxColor?.outline,
      flexDirection: "row",
      alignItems: "center",
    },
    activeSwitchWrap: {
      backgroundColor: reduxColor?.primary,
      borderRadius: 17,
      borderWidth: 2,
      borderColor: reduxColor?.primary,
      flexDirection: "row",
      alignItems: "center",
    },
    innerPoint: {
      borderRadius: 10,
      backgroundColor: reduxColor?.outline,
      position: "absolute",
      left: 5,
    },
    activeInnerPoint: {
      borderRadius: 10,
      backgroundColor: reduxColor?.onSecondary,
      position: "absolute",
      right: 5,
    },
  });

export default Switch;
