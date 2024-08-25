import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";

const CustomSystemMessage = (props) => {
  const { currentMessage } = props;

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  if (currentMessage?.currentMessage?.system) {
    return (
      <View style={styles.systemMessageContainer}>
        <Text style={styles.systemMessageText}>{currentMessage?.currentMessage?.text}</Text>
      </View>
    );
  }

  return null;
};

const style = (reduxColors) => StyleSheet.create({
    systemMessageContainer: {
        backgroundColor: reduxColors?.lightGrey,
        paddingVertical: Spacing.mini,
        paddingHorizontal:Spacing.body,
        borderRadius: 8,
        alignSelf: 'center',
        marginVertical:Spacing.mini
      },
      systemMessageText: {
        color:reduxColors?.onSurfaceVariant,
        fontSize:FontSize.Antz_Small
      },
})

export default CustomSystemMessage;
