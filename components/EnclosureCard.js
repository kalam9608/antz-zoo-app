import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import FontSize from "../configs/FontSize";
import { useSelector } from "react-redux";
import Spacing from "../configs/Spacing";
import SvgUri from "react-native-svg-uri";
import Config from "../configs/Config";
import { capitalizeFirstLetterAndUppercaseRest } from "../utils/Utils";

const EnclosureCard = ({ item, onPress }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  const handlePress = (e) => {
    onPress(e);
  };
  const img = item?.images
    ? item?.images?.filter((item) => item?.display_type == "banner")[0]?.file
    : false;
  return (
    <>
      <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
        <View style={{ height: 40, width: 40 }}>
          {img ? (
            <Image
              style={[styles.icon, { width: 40, height: 40 }]}
              source={{ uri: img }}
            />
          ) : (
            <SvgUri
              width={40}
              height={40}
              style={styles.icon}
              source={{
                uri:
                  Config.BASE_APP_URL +
                  "assets/class_images/default_animal.svg",
              }}
            />
          )}
        </View>
        <View style={{ marginHorizontal: Spacing.mini, flex: 1 }}>
          <Text
            style={[
              FontSize.Antz_Minor_Title,
              {
                color: constThemeColor.onPrimaryContainer,
                marginBottom: Spacing.mini,
              },
            ]}
          >
            {item?.user_enclosure_name}
          </Text>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Text
              style={[
                FontSize.Antz_Body_Regular,
                { color: constThemeColor.onSurfaceVariant },
              ]}
            >
              Sec:
            </Text>
            <Text
              style={[
                FontSize.Antz_Body_Regular,
                {
                  color: constThemeColor.onSurfaceVariant,
                  marginLeft: Spacing.micro,
                  flex: 1,
                },
              ]}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {item?.section_name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginBottom: Spacing.mini,
              flex: 1,
            }}
          >
            <Text
              style={[
                FontSize.Antz_Body_Regular,
                { color: constThemeColor.onSurfaceVariant },
              ]}
            >
              Site:
            </Text>
            <Text
              style={[
                FontSize.Antz_Body_Regular,
                {
                  color: constThemeColor.onSurfaceVariant,
                  marginLeft: Spacing.micro,
                  textTransform: "capitalize",
                  flex: 1,
                },
              ]}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {item?.site_name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    cardContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: reduxColors.onPrimary,
      marginVertical: Spacing.mini + Spacing.micro,
      padding: Spacing.small,
      borderRadius: Spacing.small,
    },
    icon: {
      width: 42,
      height: 42,
      borderRadius: 50,

      alignSelf: "center",
    },
  });

export default EnclosureCard;
