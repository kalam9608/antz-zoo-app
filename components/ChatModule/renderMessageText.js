import React, { useState } from "react";
import moment from "moment";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useSelector } from "react-redux";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { MessageText } from "react-native-gifted-chat";

const CustomMessageText = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);
  return (
    <Pressable
      style={[
        styles.textContainer,
        {
          flexDirection:
            props?.currentMessage?.text?.trim()?.length < 15 ? "row" : null,
        }
      ]}
      onLongPress={() => props.onLongPress(props.context, props.currentMessage)}
    >
      <MessageText
        {...props}
      />
      <Text
        style={[
          styles.timeText,
          {
            marginLeft:
              props?.currentMessage?.text?.trim()?.length < 15
                ? Spacing.small
                : null,
            color:
              props.currentMessage?.sender_id == UserId
                ? constThemeColor.onPrimary
                : null,
          },
        ]}
      >
        {moment(props?.currentMessage?.createdAt).format("LT")}
      </Text>
    </Pressable>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    textContainer: {
      padding: Spacing.small,
    },
    textBody: {
      // fontSize:16
    },
    timeText: {
      fontSize: FontSize.Antz_Small,
      fontWeight: FontSize.weight400,
      alignSelf: "flex-end",
      bottom: -5,
    },
  });

export default CustomMessageText;
