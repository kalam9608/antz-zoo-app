import { Text, View, Image, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontSize from "../../../configs/FontSize";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Spacing from "../../../configs/Spacing";
import moment from "moment";

const ChatListItem = ({ chat, onPress, trick }) => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, { opacity: chat?.already_member ? 0.5 : 1 }]}
      disabled={chat?.already_member ? true : false}
    >
      <View>
        {chat?.isSelected == true && trick && (
          <View style={styles.checkIcon}>
            <MaterialCommunityIcons
              name="check"
              size={20}
              color={constThemeColor?.onPrimary}
            />
          </View>
        )}
        <Image
          source={{
            uri: chat?.user?.image
              ? chat?.user?.image
              : chat?.user_profile_pic
              ? chat?.user_profile_pic
              : chat?.group_image
              ? chat?.group_image
              : "https://e7.pngegg.com/pngimages/550/997/png-clipart-user-icon-foreigners-avatar-child-face.png",
          }}
          style={styles.image}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {chat?.user_name
              ? chat?.user_name
              : chat?.user_first_name && chat?.user_last_name
              ? `${chat?.user_first_name}${chat?.user_last_name}`
              : chat?.group_name}
          </Text>
          {chat?.unseen_count > 0 && (
            <View style={styles.countNumber}>
              <Text style={{ color: constThemeColor?.onPrimary }}>
                {chat?.unseen_count}
              </Text>
            </View>
          )}
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text numberOfLines={2} style={styles.subTitle}>
            {chat?.user?.bio
              ? chat?.user?.bio
              : chat?.last_message_type == "text"
              ? chat?.last_message
              : chat?.last_message_type != "text"
              ? "Media"
              : chat?.already_member
              ? "Already added this group"
              : "Start conversion"}
          </Text>
          <Text
            style={[
              styles.subTitle,
              FontSize.Antz_Subtext_Regular,
              { position: "absolute", right: 0 },
            ]}
          >
            {moment(chat?.latest_message_time).format("LT")}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      marginHorizontal: Spacing.body,
      marginVertical: 5,
      height: 70,
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 30,
      marginRight: Spacing.micro + Spacing.small,
    },
    content: {
      flex: 1,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: "lightgray",
    },
    row: {
      flexDirection: "row",
      marginBottom: 5,
    },
    name: {
      flex: 1,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
    },
    subTitle: {
      color: "gray",
    },
    countNumber: {
      backgroundColor: reduxColors?.primary,
      height: 20,
      width: 20,
      borderRadius: wp(50),
      alignItems: "center",
      justifyContent: "center",
    },
    checkIcon: {
      height: 20,
      width: 20,
      backgroundColor: reduxColors?.primary,
      position: "absolute",
      zIndex: 12,
      borderRadius: 50,
      bottom: hp(2.5),
      right: wp(1),
    },
  });

export default ChatListItem;
