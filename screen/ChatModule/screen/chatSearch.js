import React, { useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Spacing from "../../../configs/Spacing";
import FontSize from "../../../configs/FontSize";
import { useSelector } from "react-redux";
import { Searchbar } from "react-native-paper";

const ChatSearch = () => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const searchRef = useRef();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: constThemeColor.surfaceVariant },
      ]}
    >
      <View></View>
    </View>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
  });

export default ChatSearch;
