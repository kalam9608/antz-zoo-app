import React from "react";
import { View, Text, StyleSheet,TextInput } from "react-native";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
// import { TextInput } from "react-native-paper";
import { useSelector } from "react-redux";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

const ChatInput = ({value, onChangeText, placeholder}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  return (
    <>
      <TextInput
        placeholder={placeholder}
        value={value}
        style={[FontSize.Antz_Body_Title, styles.input]}
        placeholderTextColor={constThemeColor?.onSurfaceVariant}
        onChangeText={onChangeText}
      />
    </>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    input: {
      // height: 50,
      borderBottomWidth: 1,
      borderBottomColor: reduxColors?.outline,
      marginHorizontal: Spacing.small,
      backgroundColor:'transparent',
    },
  });

export default ChatInput;
