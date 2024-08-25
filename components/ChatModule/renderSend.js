import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Send } from "react-native-gifted-chat";
import { useSelector } from "react-redux";

const RenderSend = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Send {...props} containerStyle={{ justifyContent: "center" }}>
        <MaterialCommunityIcons
          name="send"
          size={30}
          color={constThemeColor?.primary}
          style={{
            // transform: [{ rotateZ: "-45deg" }],
            marginHorizontal: 5,
          }}
        />
      </Send>
    </View>
  );
};

const style = (reduxColors) => StyleSheet.create({});

export default RenderSend;
