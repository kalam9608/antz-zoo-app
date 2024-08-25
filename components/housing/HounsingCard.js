// Created By: Mohit sharma
// created at: 08/05/2023

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Chip } from "react-native-paper";
import { SvgUri } from "react-native-svg";
import { useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";
import Spacing, { elevationStyle } from "../../configs/Spacing";
import { AntDesign } from "@expo/vector-icons";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import Config from "../../configs/Config";

const HounsingCard = ({ backgroundColor, onPress, ...props }) => {
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const stylesSheet = BottomSheetModalStyles.ShodowOpacity(constThemeColor);
  return (
    <>
      <TouchableOpacity
        style={[
          props?.style,
          {
            backgroundColor: backgroundColor ?? constThemeColor.onPrimary,
            elevation: stylesSheet.elevationShadow.elevation,
            shadowColor: stylesSheet.elevationShadow.shadowColor,
          },
        ]}
        disabled={!onPress ? true : false}
        onPress={onPress}
      >
        <View
          style={{
            flexDirection: "row",
            margin: Spacing.body,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={styles.image}>
              <SvgUri
                width="100%"
                height="100%"
                uri={
                  Config.BASE_APP_URL + "assets/class_images/default_animal.svg"
                }
              />
            </View>
            <View style={{ width: "80%" }}>
              <Text
                style={{
                  color: constThemeColor.onSurfaceVariant,
                  fontSize: FontSize.Antz_Minor_Title.fontSize,
                  fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                  marginBottom: Spacing.small,
                  textTransform:props?.textTransform??'capitalize',
                  // width: "65%",
                  height: "auto",
                }}
              >
                {props.title}
              </Text>
              {props.incharge && props.incharge != " NA" ? (
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
              {props.section ? (
                <Text
                  style={{
                    color: constThemeColor.onSurfaceVariant,
                    marginBottom: Spacing.small,
                    fontSize: FontSize.Antz_Body_Regular.fontSize,
                    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                  }}
                >
                  Sec - {}
                  <Text style={{}}>{props.section}</Text>
                </Text>
              ) : null}
              {props.sitename ? (
                <Text
                  style={{
                    color: constThemeColor.onSurfaceVariant,
                    marginBottom: Spacing.small,
                    fontSize: FontSize.Antz_Body_Regular.fontSize,
                    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                  }}
                >
                  Site - {}
                  <Text
                    style={{
                      color: constThemeColor.onSurfaceVariant,
                      fontSize: FontSize.Antz_Body_Regular.fontSize,
                      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                    }}
                  >
                    {props.sitename}
                  </Text>
                </Text>
              ) : null}
              {props.subtitle ? (
                <View>
                  <Text> {props.subtitle}</Text>
                </View>
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
                      backgroundColor: constThemeColor.background,
                      color: constThemeColor.onPrimaryContainer,
                      fontSize: FontSize.Antz_Minor_Regular.fontSize,
                      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                      textTransform:'uppercase'
                      
                    }}
                  >
                    {props.chip1}
                  </Chip>
                ) : null}
                {props.chip2 ? (
                  <Chip
                    style={{
                      marginLeft: Spacing.mini,
                      backgroundColor: constThemeColor.background,
                      color: constThemeColor.onPrimaryContainer,
                      fontSize: FontSize.Antz_Minor_Regular.fontSize,
                      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                    }}
                  >
                    {props.chip2}
                  </Chip>
                ) : null}
                {props.genderChip ? <View>{props.genderChip}</View> : null}
              </View>
            </View>
          </View>
          {props.animalSelect ? (
            <View
              style={{
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <AntDesign
                name="checkcircle"
                size={20}
                color={constThemeColor.primary}
              />
            </View>
          ) : null}
          {props.arrow ? (
            <View
              style={{
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <AntDesign
                name="right"
                size={14}
                color={constThemeColor.onSurfaceVariant}
              />
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </>
  );
};

export default HounsingCard;

const styles = StyleSheet.create({
  image: {
    width: 44,
    height: 44,
    borderRadius: 50,
    alignSelf: "center",
    marginRight: Spacing.body,
  },
});
