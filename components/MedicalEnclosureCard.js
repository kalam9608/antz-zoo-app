// Created By: Mohit sharma
// created at: 08/05/2023

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Chip } from "react-native-paper";
import { SvgUri } from "react-native-svg";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import Spacing from "../configs/Spacing";
import { opacityColor } from "../utils/Utils";
import Config from "../configs/Config";

const MedicalEnclosureCard = ({ backgroundColor, onPress, type, ...props }) => {
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  //  const reduxColors = styles(constThemeColor);

  return (
    <>
      <TouchableOpacity
        style={[
          props?.style,
          {
            backgroundColor: backgroundColor ?? constThemeColor.onPrimary,
            // paddingVertical: Spacing.mini,
            opacity: props.opacity,
          },
        ]}
        onPress={onPress}
        disabled={props?.disabled}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={styles.image}>
              <SvgUri
                width="100%"
                height="100%"
                uri={
                  Config.BASE_APP_URL + "assets/class_images/default_animal.svg"
                }
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{
                  color: constThemeColor.onSurfaceVariant,
                  fontSize: FontSize.Antz_Minor_Title.fontSize,
                  fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                  marginBottom: Spacing.small,
                  textTransform: props?.textTransform ?? "capitalize",
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
              {props.subtitle ? (
                <View>
                  <Text> {props.subtitle}</Text>
                </View>
              ) : null}
              {props.section ? (
                <Text
                  style={{
                    color: constThemeColor.onSurfaceVariant,
                    marginBottom: Spacing.small,
                    fontSize: FontSize.Antz_Body_Regular.fontSize,
                    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                  }}
                >
                  Section - {}
                  <Text style={{}}>{props.section}</Text>
                </Text>
              ) : null}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  //marginTop: widthPercentageToDP(2),
                  //marginBottom: widthPercentageToDP(1.5),
                }}
              >
                {props.chip1 ? (
                  <Chip
                    style={{
                      backgroundColor: opacityColor(
                        constThemeColor.neutralPrimary,
                        5
                      ),
                      borderRadius: Spacing.mini,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          type == "Enclosure"
                            ? constThemeColor?.onPrimaryContainer
                            : constThemeColor.onSurfaceVariant,
                        fontSize: FontSize.Antz_Body_Regular.fontSize,
                        fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                      }}
                    >
                      {props.chip1}
                    </Text>
                  </Chip>
                ) : null}
                {props.chip2 ? (
                  <Chip
                    style={{
                      marginLeft: Spacing.mini,
                      backgroundColor: opacityColor(
                        constThemeColor.neutralPrimary,
                        5
                      ),
                      borderRadius: Spacing.mini,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          type == "Enclosure"
                            ? constThemeColor?.onPrimaryContainer
                            : constThemeColor.onSurfaceVariant,
                        fontSize: FontSize.Antz_Body_Regular.fontSize,
                        fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                      }}
                    >
                      {props.chip2}
                    </Text>
                  </Chip>
                ) : null}
                {props.genderChip ? <View>{props.genderChip}</View> : null}
              </View>
              {props?.label ? (
                <View style={{ marginVertical: Spacing.small }}>
                  <Text
                    style={{
                      color: constThemeColor?.onSurfaceVariant,
                      fontSize: FontSize?.Antz_Body_Regular?.fontSize,
                      fontWeight: FontSize?.Antz_Body_Regular?.fontWeight,
                    }}
                  >
                    {props?.label}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          {props.itemSelect || props?.disabled ? (
            <View
              style={{
                alignItems: "flex-end",
                justifyContent: "center",
                marginLeft: Spacing.small,
              }}
            >
              <AntDesign
                name="checkcircle"
                size={20}
                color={
                  props?.disabled
                    ? constThemeColor.neutralSecondary
                    : constThemeColor.primary
                }
              />
            </View>
          ) : null}
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
      </TouchableOpacity>
    </>
  );
};

export default MedicalEnclosureCard;

const styles = StyleSheet.create({
  image: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignSelf: "center",
    marginRight: Spacing.body,
  },
});
