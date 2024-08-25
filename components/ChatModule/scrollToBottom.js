import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const ScrollToBottomComponent = () => {

    const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
    const styles = style(constThemeColor);
    return (
      <View>
        <MaterialCommunityIcons
          name="arrow-down"
          size={24}
          color={constThemeColor?.primary}
        />
      </View>
    );
  };

const style = (reduxColors) => StyleSheet.create({})

export default ScrollToBottomComponent;