import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Chip } from "react-native-paper";
import { useSelector } from "react-redux";
import Spacing from "../configs/Spacing";
import FontSize from "../configs/FontSize";
import {
  AntDesign,
  Entypo,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Switch from "./Switch";
import { ShortFullName } from "../utils/Utils";

export default function UserCustomCard({
  item,
  onPress,
  selectedStyle,
  selectedIds,
  handleToggle,
  handleRemove,
  type,
  transferType,
}) {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  return (
    <TouchableOpacity
      style={[
        reduxColors.card,
        {
          opacity: type == "addMember" ? 0.6 : 1,
          backgroundColor:
            type == "transferMember"
              ? constThemeColor?.onPrimary
              : item?.isSelect
              ? constThemeColor.onBackground
              : constThemeColor.background,
        },
        selectedStyle,
      ]}
      onPress={() => onPress(item)}
      disabled={!onPress}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          marginRight: Spacing.body,
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: constThemeColor.secondary,
              borderRadius: 20,
              height: 40,
              width: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {
              item?.user_profile_pic ? (
                <Image
                  source={{ uri: item?.user_profile_pic }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                  }}
                />
              ) : (
                // type == "transferMember" ? (
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      ...FontSize.Antz_Body_Medium,
                      color: constThemeColor.onPrimary,
                    }}
                  >
                    {ShortFullName(item?.user_name)}
                  </Text>
                </View>
              )
              // ) : (
              //   <Feather
              //     name="user"
              //     size={24}
              //     color={constThemeColor.onSurfaceVariant}
              //   />
              // )
            }
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: Spacing.body,
            display: "flex",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={reduxColors.userTitle}>
              {item?.user_name ? item?.user_name : "NA"}
            </Text>
            {item.can_perform_action == true && (
              <MaterialCommunityIcons
                name="star-circle"
                size={15}
                style={{ marginLeft: Spacing.micro }}
                color={constThemeColor.moderateSecondary}
              />
            )}
          </View>
          <Text style={reduxColors.designation}>
            {item?.role_name ? item?.role_name : "NA"}
          </Text>
          {item?.source_site_name && transferType == "inter" ? (
            <Text style={reduxColors.sourceType}>
              Originating site:{" "}
              {item?.source_site_name ? item?.source_site_name : "NA"}
            </Text>
          ) : null}
          {item?.destination_name && transferType == "inter" ? (
            <Text style={reduxColors.sourceType}>
              Destination site:{" "}
              {item?.destination_name ? item?.destination_name : "NA"}
            </Text>
          ) : null}
          {item?.source_site_name && transferType != "inter" ? (
            <Text style={reduxColors.sourceType}>
              Site: {item?.source_site_name ? item?.source_site_name : "NA"}
            </Text>
          ) : null}
        </View>
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {item?.isSelect && (
          <Entypo
            name="cross"
            size={20}
            color={constThemeColor.onSurfaceVariant}
            style={{
              marginLeft: Spacing.major,
            }}
          />
        )}
        {selectedIds?.includes(item?.user_id) && (
          <AntDesign
            name="checkcircle"
            size={20}
            color={constThemeColor.primary}
            style={{ position: "absolute", right: 20 }}
          />
        )}
        {handleToggle && (
          <Switch
            handleToggle={() => handleToggle(item)}
            active={item.can_perform_action}
          />
        )}
        {handleRemove && (
          <TouchableOpacity
            onPress={() => handleRemove(item)}
            style={{
              marginLeft: Spacing.major,
            }}
          >
            <MaterialCommunityIcons
              name="close-circle-outline"
              size={24}
              color={constThemeColor.tertiary}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = (reduxColors) =>
  StyleSheet.create({
    leftScreen: {
      flex: 0.42,
      backgroundColor: reduxColors.background,
    },
    rightScreen: {
      flex: 0.58,
      backgroundColor: reduxColors.onPrimary,
      padding: Spacing.body,
      justifyContent: "space-between",
    },
    input: {
      flex: 1,
      color: reduxColors.onPrimaryContainer,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
    card: {
      marginTop: Spacing.small,
      borderRadius: Spacing.small,
      flexDirection: "row",
      // justifyContent: "space-between",
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.minor,
      width: "100%",
    },
    selectedCard: {
      backgroundColor: reduxColors.surface,
    },
    singleClear: {
      color: reduxColors.tertiary,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
    searchBox: {
      width: "75%",
      flexDirection: "row",
      borderWidth: 1,
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: Spacing.small,
      borderColor: reduxColors.outline,
      borderRadius: Spacing.small,
    },
    userTitle: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onPrimaryContainer,
    },
    designation: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,
      marginTop: Spacing.mini,
    },
    sourceType: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      marginTop: Spacing.mini,
    },
  });
