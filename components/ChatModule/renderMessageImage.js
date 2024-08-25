import React from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { MessageImage } from "react-native-gifted-chat";
import { useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";
import moment from "moment";

const RenderMessageImage = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);
  return (
    <Pressable
      onLongPress={() => props.onLongPress(props.context, props.currentMessage)}
    >
      <MessageImage
        {...props}
        imageStyle={{
          width: Dimensions.get("window").width * 0.5,
          height: Dimensions.get("window").height * 0.25,
          resizeMode: "cover",
        }}
      />
      <Text
        style={[
          styles.timeText,
          {
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
    timeText: {
      fontSize: FontSize.Antz_Small,
      fontWeight: FontSize.weight400,
      alignSelf: "flex-end",
      right: 10,
    },
  });

export default RenderMessageImage;
