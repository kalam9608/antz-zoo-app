import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { SvgUri } from "react-native-svg";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import { Fontisto } from "@expo/vector-icons";
import Spacing from "../configs/Spacing";
import Config from "../configs/Config";

const NotesSiteCard = ({ backgroundColor, onPress, type, ...props }) => {
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);

  return (
    <>
      <View
        style={[
          props?.style,
          {
            backgroundColor: backgroundColor ?? constThemeColor.onPrimary,
            opacity: props.opacity,
          },
        ]}
        disabled={props?.disabled}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              paddingVertical: Spacing.body,
            }}
          >
            <View style={styles.image}>
              <SvgUri
                width="100%"
                height="100%"
                uri={
                  Config.BASE_APP_URL + "assets/class_images/default_animal.svg"
                }
              />
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{
                  color: constThemeColor.onSurfaceVariant,
                  fontSize: FontSize.Antz_Minor_Title.fontSize,
                  fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                  height: "auto",
                }}
              >
                {props.title}
              </Text>
              {props.incharge ? (
                <Text
                  style={{
                    color: constThemeColor.onSurfaceVariant,
                    marginBottom: Spacing.small,
                    fontSize: FontSize.Antz_Body_Regular.fontSize,
                    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                  }}
                >
                  In Charge - {}
                  <Text
                    style={{
                      color: constThemeColor.onSurfaceVariant,
                      fontSize: FontSize.Antz_Body_Regular.fontSize,
                      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                    }}
                  >
                    {props.incharge}
                  </Text>
                </Text>
              ) : null}
            </View>
          </View>

          {props.remove ? (
            <View
              style={{
                alignItems: "flex-end",
                justifyContent: "center",
                marginLeft: Spacing.small,
              }}
            >
              <Fontisto
                onPress={props?.onRemove}
                name="close"
                size={22}
                color={constThemeColor.tertiary}
              />
            </View>
          ) : null}
        </View>
      </View>
    </>
  );
};

export default NotesSiteCard;

const styles = StyleSheet.create({
  image: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignSelf: "center",
    marginRight: Spacing.body,
  },
});
