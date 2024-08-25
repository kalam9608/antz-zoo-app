import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const Background = ({
  children,
  hideBackgroundImage,
  imageResizeForIos,
  ...props
}) => {
  const settings = useSelector((state) => state.UserAuth.setting);
  return (
    <ImageBackground
      source={
        hideBackgroundImage == false
          ? null
          : settings?.WATER_MARK == false || settings?.WATER_MARK == null
          ? null
          : require("../assets/Sample-img.png")
      }
      style={[props.style, styles.backgroundImage]}
      resizeMode={"contain"}
    >
      {children}
    </ImageBackground>
  );
};
// enum('cover', 'contain', 'stretch', 'repeat', 'center')
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
});

export default Background;
