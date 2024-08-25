import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  ImageBackground,
} from "react-native";
import { useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Spacing from "../../configs/Spacing";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import FontSize from "../../configs/FontSize";

const RenderCustomView = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);

  const { currentMessage } = props;
  let fileName = currentMessage?.pdf?.split("/")[currentMessage?.pdf?.split("/")?.length - 1];
  if (currentMessage?.message_type == "pdf") {
    return (
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(`${currentMessage.pdf}`);
        }}
      >
        <ImageBackground
          style={[styles.pdfContainer]}
          source={require("../../assets/folders.png")}
          resizeMode="contain"
        >
          <View
            style={{
              backgroundColor: constThemeColor?.backdrop,
              bottom: 0,
              position: "absolute",
              width: wp(80),
              padding: Spacing.small,
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="file"
              size={24}
              color={
                props.currentMessage?.sender_id == UserId
                  ? constThemeColor.onPrimary
                  : constThemeColor?.onSurfaceVariant
              }
            />
            <Text
              style={{
                width: wp(70),
                color:
                  props.currentMessage?.sender_id == UserId
                    ? constThemeColor.onPrimary
                    : constThemeColor?.onSurfaceVariant,
              }}
            >
              {fileName}
            </Text>
          </View>

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
            {moment(currentMessage?.createdAt).format("LT")}
          </Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  return null;
};

const style = (reduxColors) =>
  StyleSheet.create({
    pdfContainer: {
      width: wp(80),
      padding: Spacing.small,
      height: hp(20),
    },
    pdfBody: {
      width: wp(65),
      marginLeft: Spacing.small,
    },
    timeText: {
      fontSize: FontSize.Antz_Small,
      fontWeight: FontSize.weight400,
      alignSelf: "flex-end",
      bottom: -5,
    },
  });

export default RenderCustomView;
