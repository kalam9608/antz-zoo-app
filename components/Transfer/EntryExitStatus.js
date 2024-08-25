import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { Image } from "react-native";
import { ShortFullName } from "../../utils/Utils";

const EntryExitStatus = ({
  onPress,
  approve,
  title,
  time,
  user_name,
  subTitle,
  summary,
  showCancel,
  profile_pic,
  close,
  sourceSite,
}) => {
  const themeColors = useSelector((state) => state.darkMode.theme.colors);

  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          borderTopLeftRadius: showCancel ? 0 : Spacing.small,
          borderTopRightRadius: showCancel ? 0 : Spacing.small,
          flexDirection: "row",
          backgroundColor: approve
            ? themeColors.onBackground
            : themeColors.errorContainer,
          paddingHorizontal: Spacing.body,
          paddingVertical: Spacing.minor,
          width: showCancel ? "100%" : "90%",
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          {approve ? (
            <MaterialIcons
              name={"check-circle"}
              color={themeColors.primary}
              size={20}
              style={{ marginRight: Spacing.small }}
            />
          ) : (
            <AntDesign
              name={"exclamationcircle"}
              color={themeColors.error}
              size={20}
              style={{ marginRight: Spacing.body }}
            />
          )}
          <View style={{ flexDirection: "column" }}>
            <Text
              style={{
                color: themeColors.onErrorContainer,
                fontSize: showCancel
                  ? FontSize.Antz_Medium_Medium.fontSize
                  : FontSize.Antz_Minor_Regular.fontSize,
                fontWeight: showCancel
                  ? FontSize.Antz_Medium_Medium.fontWeight
                  : FontSize.Antz_Minor_Regular.fontWeight,
              }}
            >
              {title}
            </Text>
            {showCancel ? (
              <Text
                style={{
                  color: themeColors.onErrorContainer,
                  fontSize: FontSize.Antz_Small,
                  fontWeight: FontSize.weight500,
                  paddingTop: Spacing.mini,
                }}
              >
                {time}
              </Text>
            ) : null}
          </View>
        </View>
        {showCancel ? (
          <AntDesign
            onPress={close}
            name="close"
            size={30}
            color={themeColors.onPrimaryContainer}
          />
        ) : (
          <Text
            style={{
              color: themeColors.onErrorContainer,
              fontSize: FontSize.Antz_Small,
              fontWeight: FontSize.weight500,
            }}
          >
            {time}
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={{
          paddingHorizontal: Spacing.body,
          paddingVertical: Spacing.body,
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
          width: showCancel ? "100%" : "90%",
          backgroundColor: approve ? themeColors.surface : themeColors.onDanger,
          borderBottomLeftRadius: showCancel ? 0 : Spacing.small,
          borderBottomRightRadius: showCancel ? 0 : Spacing.small,
        }}
      >
        <View
          style={{
            backgroundColor: themeColors.secondary,
            borderRadius: 20,
            height: 40,
            width: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {profile_pic ? (
            <Image
              source={{ uri: profile_pic }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
              }}
            />
          ) : (
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  ...FontSize.Antz_Subtext_Medium,
                  color: themeColors.onPrimary,
                }}
              >
                {ShortFullName(user_name)}
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            paddingHorizontal: Spacing.minor,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: Spacing.micro,
            }}
          >
            <Text
              style={{
                fontSize: FontSize.Antz_Minor_Regular.fontSize,
                fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                color: themeColors.onSurfaceVariant,
              }}
            >
              {user_name}
            </Text>
            <MaterialIcons
              name="local-police"
              size={20}
              style={{ marginLeft: Spacing.mini }}
              color={themeColors.tertiary}
            />
          </View>
          <Text
            style={{
              fontSize: FontSize.Antz_Subtext_Regular.fontSize,
              fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
              color: themeColors.onSurfaceVariant,
              marginVertical: Spacing.micro,
            }}
          >
            {sourceSite
              ? `Exit Gate: ${subTitle}`
              : `Destination site: ${subTitle}`}
          </Text>
          <Text
            style={{
              fontSize: FontSize.Antz_Body_Regular.fontSize,
              fontWeight: FontSize.Antz_Body_Regular.fontWeight,
              color: approve ? themeColors.onSurface : themeColors.error,
              marginVertical: Spacing.micro,
            }}
          >
            {summary}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default EntryExitStatus;
