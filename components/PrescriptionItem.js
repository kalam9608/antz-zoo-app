import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
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
import { Appbar, Menu } from "react-native-paper";
const PrescriptionItem = ({
  item,
  handleEditToggleCommDropdown,
  handleDeleteName,
  index,
  backgroundColor,
  blockMedicine,
  onRemoveSideEffect,
  administer,
  openAdministerModal,
  openLogged,
  ...props
}) => {
  const [moreOptionData] = useState(
    props.optionData ?? [
      {
        id: 1,
        option: <Text>Remove from list</Text>,
      },
    ]
  );
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const adverse = item?.additional_info?.side_effect;
  const checkIdMatch = (array, obj) => {
    if (props?.selectId&&props?.selectId?.length>0) {
      const objId = String(obj?.id);
    return array?.some(item => item === objId);
    }else{
      return false
    }
  };
  const isMatched = checkIdMatch(props.selectId, item);
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
          backgroundColor:isMatched|| adverse
            ? constThemeColor?.notes
            : backgroundColor
            ? backgroundColor
            : item?.additional_info?.stop_date
            ? constThemeColor?.displaybgSecondary
            : constThemeColor?.onBackground,
        },
      ]}
      key={index}
    >
      {(adverse && !blockMedicine) ||(isMatched&& !blockMedicine)? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: Spacing.small,
            paddingBottom: 0,
          }}
        >
          <MaterialIcons
            name="warning"
            size={24}
            color={constThemeColor?.tertiary}
          />
          <Text
            style={{
              fontSize: FontSize.Antz_Subtext_title.fontSize,
              fontWeight: FontSize.Antz_Subtext_title.fontWeight,
              color: constThemeColor?.tertiary,
              paddingLeft: Spacing.small,
            }}
          >
            CAUSED ADVERSE SIDE EFFECTS
          </Text>
        </View>
      ) : null}

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
            color: blockMedicine
              ? constThemeColor?.tertiary
              : constThemeColor.neutralPrimary,
            textDecorationLine: item?.additional_info?.stop_date
              ? "line-through"
              : "none",
          }}
        >
          {item.name ?? item.prescription??""}
        </Text>
        {item?.additional_info?.start_date ? null : blockMedicine ? (
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <Appbar.Action
                icon="dots-vertical"
                color={constThemeColor.onSecondaryContainer}
                size={20}
                onPress={openMenu}
              />
            }
          >
            {moreOptionData.map((data, index) => {
              return (
                <Menu.Item
                  onPress={() => {
                    setMenuVisible(false);
                    onRemoveSideEffect(item?.id);
                  }}
                  titleStyle={{ textAlign: "center" }}
                  title={data.option}
                  key={index}
                />
              );
            })}
          </Menu>
        ) : (
          <Ionicons
            name="close-outline"
            size={24}
            color={constThemeColor.onSurfaceVariant}
            onPress={() => handleDeleteName(item)}
          />
        )}
      </View>
      {item?.additional_info && !blockMedicine ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: Spacing.body,
            paddingBottom: Spacing.body,
          }}
        >
          {/* <View style={reduxColors?.listCardSub}>
            <MaterialCommunityIcons
              name="pill"
              size={16}
              color={constThemeColor.onSurfaceVariant}
            />
            <Text style={reduxColors?.listCardSubText}>
              {item?.additional_info?.quantity}
            </Text>
          </View> */}
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

      {item?.additional_info?.stop_reason ||
      item?.additional_info?.restart_reason ? (
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
          {item?.additional_info?.restart_reason}
          {item?.additional_info?.stop_reason}
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
      {item?.additional_info?.side_effect_reason ? (
        <Text
          style={[
            reduxColors?.listCardSubText,
            {
              paddingLeft: Spacing.small,
              paddingBottom: Spacing.small,
              color: constThemeColor?.tertiary,
            },
          ]}
        >
          {item?.additional_info?.side_effect_reason}
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
      {administer && !item?.additional_info?.stop_date ? (
        <TouchableOpacity
          onPress={openLogged}
          style={{
            height: 70,
            width: "100%",
            flexDirection: "row",
            backgroundColor: constThemeColor?.surface,
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            paddingHorizontal: Spacing.body,
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                paddingLeft: Spacing.small,
                paddingBottom: Spacing.micro,
              }}
            >
              <MaterialCommunityIcons
                name="pill"
                size={16}
                color={constThemeColor.primary}
              />
              <Text
                style={[
                  reduxColors?.listCardSubText,
                  { color: constThemeColor?.primary },
                ]}
              >
                {item?.additional_info?.administritive_count} Given
              </Text>
            </View>
            {item?.additional_info?.last_administered ? (
              <Text
                style={[
                  reduxColors?.listCardSubText,
                  { color: constThemeColor?.onSurfaceVariant },
                ]}
              >
                {` Last given on: ${moment(
                  item?.additional_info?.last_administered
                ).format("DD MMM YYYY")}`}
              </Text>
            ) : null}
          </View>
          <TouchableOpacity
            style={{
              paddingVertical: Spacing.small,
              paddingHorizontal:Spacing.minor,
              backgroundColor: constThemeColor?.secondaryContainer,
              borderRadius: 8,
            }}
            onPress={(item) => openAdministerModal(item)}
          >
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Title.fontSize,
                fontWeight: FontSize.Antz_Body_Title.fontWeight,
                color: constThemeColor?.onSecondaryContainer,
              }}
            >
              Administer
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
};

export default PrescriptionItem;

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
      paddingHorizontal: Spacing.mini,
    },
    listCardSubText: {
      fontSize: FontSize?.Antz_Subtext_Regular?.fontSize,
      fontWeight: FontSize?.Antz_Subtext_Regular?.fontWeight,
      paddingLeft: Spacing.mini,
      color: reduxColors?.onSurfaceVariant,
    },
  });
