import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import Spacing from "../configs/Spacing";
import FontSize from "../configs/FontSize";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import moment from "moment";
import { SvgXml } from "react-native-svg";
import line_start from "../assets/line_start_circle.svg";
import line_end from "../assets/line_end_square.svg";
const BlockedPrescriptionCard = ({
  item,
  handleEditToggleCommDropdown,
  handleDeleteName,
  index,
  backgroundColor,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <TouchableOpacity
      disabled={handleEditToggleCommDropdown ? false : true}
      accessible={true}
      accessibilityLabel={"selectedPrescription"}
      AccessibilityId={"selectedPrescription"}
      onPress={() => handleEditToggleCommDropdown(item)}
      style={[
        reduxColors?.listCard,
        {
          backgroundColor: backgroundColor
            ? backgroundColor
            : item?.additional_info?.blocked
            ? constThemeColor?.displaybgSecondary
            : constThemeColor?.onBackground,
        },
      ]}
      key={index}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: Spacing.small,
        }}
      >
        <Text
          style={{
            fontSize: FontSize.Antz_Body_Title.fontSize,
            fontWeight: FontSize.Antz_Body_Title.fontWeight,
            color: constThemeColor.neutralPrimary,
            textDecorationLine: item?.additional_info?.blocked
              ? "line-through"
              : "none",
          }}
        >
          {item.name ?? item.prescription}
        </Text>
        {item?.additional_info?.start_date ? null : (
          <Ionicons
            name="close-outline"
            size={24}
            color={constThemeColor.onSurfaceVariant}
            onPress={() => handleDeleteName(item)}
          />
        )}
      </View>
      {item?.additional_info ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: Spacing.body,
            paddingBottom: Spacing.body,
          }}
        >
          <View style={reduxColors?.listCardSub}>
            <MaterialCommunityIcons
              name="pill"
              size={16}
              color={constThemeColor.onSurfaceVariant}
            />
            <Text style={reduxColors?.listCardSubText}>
              {item?.additional_info?.quantity}
            </Text>
          </View>
          <View
            style={[reduxColors?.listCardSub, { justifyContent: "center" }]}
          >
            <Octicons
              name="pulse"
              size={16}
              color={constThemeColor.onSurfaceVariant}
            />
            <Text
              style={[reduxColors?.listCardSubText, { textAlign: "center" }]}
            >
              {item?.additional_info?.dosage}
              {item?.additional_info?.when
                ? ` ${item?.additional_info?.when
                    ?.split(" ")[1]
                    ?.replace(
                      "_x_",
                      ` ${item?.additional_info?.when?.split(" ")[0]} `
                    )
                    ?.replaceAll("_", " ")}`
                : null}
            </Text>
          </View>
          <View
            style={[reduxColors?.listCardSub, { justifyContent: "flex-end" }]}
          >
            <MaterialIcons
              name="timer"
              size={16}
              color={constThemeColor.onSurfaceVariant}
            />
            <Text
              style={[
                reduxColors?.listCardSubText,
                { textAlign: "center", textTransform: "capitalize" },
              ]}
              lineBreakMode="middle"
            >
              {item?.additional_info?.duration?.split("")[0] == 0
                ? item.additional_info?.duration
                    ?.split(" ")[1]
                    ?.replaceAll("_", " ")
                : item.additional_info?.duration}
            </Text>
          </View>
        </View>
      ) : null}

      {item?.additional_info?.blocked ? (
        <Text
          style={[
            reduxColors?.listCardSubText,
            {
              paddingLeft: Spacing.small,
              paddingBottom: Spacing.small,
              color: constThemeColor?.neutralPrimary,
            },
          ]}
        >
          {"This medicine is blocked"}
          {/* {item?.additional_info?.stop_reason} */}

        </Text>
      ) : item?.additional_info?.notes ? (
        <Text
          style={[
            reduxColors?.listCardSubText,
            {
              paddingLeft: Spacing.small,
              paddingBottom: Spacing.small,
              color: constThemeColor?.neutralPrimary,
            },
          ]}
        >
          {item?.additional_info?.notes}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: item?.additional_info?.start_date
            ? Spacing.body
            : 0,
          paddingBottom: item?.additional_info?.start_date ? Spacing.small : 0,
          justifyContent: "space-between",
        }}
      >
        {item?.additional_info?.start_date ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <SvgXml xml={line_start} width="20" height="18" />
            <Text
              style={{
                fontSize: FontSize.Antz_Small,
                color: constThemeColor?.neutralSecondary,
                paddingHorizontal: Spacing.mini,
              }}
            >
              {moment(item?.additional_info?.start_date).format("DD MMM yyyy")}
            </Text>
          </View>
        ) : null}

        {item?.additional_info?.stop_date ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: FontSize.Antz_Small,
                color: constThemeColor?.neutralSecondary,
                paddingHorizontal: Spacing.mini,
              }}
            >
              {moment(item?.additional_info?.stop_date).format("DD MMM yyyy")}
            </Text>
            <SvgXml xml={line_end} width="20" height="18" />
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default BlockedPrescriptionCard;

const styles = (reduxColors) =>
  StyleSheet.create({
    listCard: {
      backgroundColor: reduxColors?.onBackground,
      marginVertical: Spacing.mini,
      borderRadius: Spacing.small,
    },
    listCardSub: {
      flexDirection: "row",
      alignItems: "center",
      width: "33%",
      paddingHorizontal: Spacing.mini,
    },
    listCardSubText: {
      fontSize: FontSize?.Antz_Subtext_Regular?.fontSize,
      fontWeight: FontSize?.Antz_Subtext_Regular?.fontWeight,
      paddingLeft: Spacing.mini,
      color: reduxColors?.onSurfaceVariant,
    },
  });
