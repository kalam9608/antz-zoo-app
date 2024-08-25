import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ChatUserCard = ({
  onPress,
  image,
  name,
  timeStamp,
  message,
  count,
  already_member,
  trick,
  isSelected,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  return (
    <TouchableOpacity
      style={[styles.userCardContainer, { opacity: already_member ? 0.5 : 1 }]}
      onPress={onPress}
      disabled={already_member ? true : false}
    >
      <View>
        {isSelected == true && trick && (
          <View style={styles.checkIcon}>
            <MaterialCommunityIcons
              name="check"
              size={20}
              color={constThemeColor?.onPrimary}
            />
          </View>
        )}
        <Image source={{ uri: image }} style={styles.userImage} />
      </View>
      <View style={styles.middleContent}>
        <View style={styles.upperBody}>
          <Text style={[FontSize.Antz_Minor_Title, styles.heading]}>
            {name}
          </Text>
          <Text style={styles.timeText}>{timeStamp}</Text>
        </View>
        {(message || count) && (
          <View style={[styles.upperBody]}>
            {message?.split("/")[message?.split("/")?.length - 2] ==
            "images" || message?.split("/")[message?.split("/")?.length - 2] == "files" || message?.split("/")[message?.split("/")?.length - 2] == "audio" ? (
              <View style={{ flexDirection: "row", alignItems: "center", width: wp(70) }}>
                <MaterialCommunityIcons
                  name="file-outline"
                  size={18}
                  color={constThemeColor.onSurfaceVariant}
                />
                <Text
                  style={[FontSize.Antz_Body_Regular, styles.lowerBodyText]}
                >
                  Attachments
                </Text>
              </View>
            ) : (
              <Text
                style={[FontSize.Antz_Body_Regular, styles.lowerBodyText]}
                numberOfLines={2}
              >
                {message}
              </Text>
            )}
            {count > 0 && (
              <View style={styles.countSection}>
                <Text style={styles.countNumber}>{count}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    userCardContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: Spacing.small,
    },
    userImage: {
      height: 60,
      width: 60,
      borderRadius: wp(50),
    },
    checkIcon: {
      height: 20,
      width: 20,
      backgroundColor: reduxColors?.primary,
      position: "absolute",
      zIndex: 1,
      borderRadius: 50,
      bottom: 0,
      right: 0,
    },
    middleContent: {
      marginLeft: Spacing.small,
      flex: 1,
      marginRight: Spacing.mini,
      justifyContent: "space-evenly",
    },
    upperBody: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: Spacing.mini,
    },
    heading: {
      color: reduxColors?.onSurfaceVariant,
    },
    timeText: {
      fontSize: FontSize.Antz_Small,
      fontWeight: FontSize.weight500,
      color: reduxColors?.primary,
    },
    lowerBodyText: {
      color: reduxColors?.onSurfaceVariant,
      width: wp(70)
    },
    countSection: {
      backgroundColor: reduxColors?.primary,
      height: 20,
      width: 20,
      borderRadius: wp(50),
      alignItems: "center",
      justifyContent: "center",
    },
    countNumber: {
      color: reduxColors?.onPrimary,
      fontSize: FontSize.Antz_Small,
      fontWeight: FontSize.weight500,
    },
  });

export default ChatUserCard;
