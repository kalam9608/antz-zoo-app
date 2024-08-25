import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { Button, Menu } from "react-native-paper";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import Spacing from "../configs/Spacing";
import FontSize from "../configs/FontSize";
import { FilterMaster } from "../configs/Config";

const MenuModalComponent = ({
  dropdownValue,
  visible,
  onDismiss,
  openMenu,
  selectDrop,
  Data,
  closeMenu,
  textColor,
  labelStyle,
  style,
  iconStyle,
  loading,
  leadingIcon,
  isSetDefaultValue = false,
  isAntDesign = false,
  iconSize = 22,
  iconName = "chevron-small-down",
  isRefresh
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [selectedImage, setselectedImage] = useState("");
  const isSelectedId = (id) => {
    return selectedImage.includes(id);
  };
  const onValueChacked = (id) => {
    if (isSelectedId(id)) {
      setselectedImage(selectedImage.filter((item) => item !== id));
    } else {
      setselectedImage([selectedImage, id]);
    }
  };
  const handleDefaultValue = () => {
    const selectedItem = Data?.find((item) => item.value === dropdownValue);
    if (selectedItem) {
      setselectedImage(["", selectedItem.id]);
    }
  };



  useEffect(() => {
    // For My Journal Screen
    if (isSetDefaultValue || isRefresh) {
      handleDefaultValue();
    }
  }, [isSetDefaultValue, isRefresh]);

  useEffect(() => {
    const selectedItem = FilterMaster?.find(
      (item) => item.value === dropdownValue
    );
    if (selectedItem) {
      setselectedImage(["", selectedItem.id]);
    }
  }, [dropdownValue]);
  return (
    <Menu
      visible={visible}
      style={[
        {
          marginTop: Spacing.minor,
          borderRadius: 8,
        },
        style,
      ]}
      onDismiss={onDismiss}
      anchor={
        <View
          style={[
            {
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <TouchableOpacity
            onPress={openMenu}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 4,
              paddingLeft: 8,
            }}
          >
            <Text style={textColor} labelStyle={labelStyle}>
              {selectDrop}
            </Text>
            <View style={{ marginLeft: 4 }}>
              {isAntDesign ? (
                <AntDesign
                  name={iconName}
                  size={iconSize}
                  color={constThemeColor.onSurface}
                  style={iconStyle}
                />
              ) : (
                <Entypo
                  name={iconName}
                  size={iconSize}
                  color={constThemeColor.onSurface}
                  style={iconStyle}
                />
              )}
            </View>
          </TouchableOpacity>
          {/* <Button
            onPress={openMenu}
            textColor={textColor}
            labelStyle={labelStyle}
          >
            {selectDrop}
            <Entypo
              name="chevron-small-down"
              size={22}
              color={constThemeColor.onSurface}
              style={iconStyle}
            />
          </Button> */}
          {/* <TouchableOpacity
            onPress={openMenu}
            style={{ padding: Spacing.mini, paddingLeft: 0 }}
          >
           
          </TouchableOpacity> */}
          {loading ? (
            <ActivityIndicator
              size="small"
              color={constThemeColor.onSurfaceVarient}
            />
          ) : null}
        </View>
      }
      contentStyle={{
        backgroundColor: constThemeColor.onPrimary,
        paddingVertical: 0,
        borderRadius: 8,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {Data?.map((item, index) => {
          return (
            <Menu.Item
              onPress={() => {
                closeMenu(item);
                onValueChacked(item?.id);
              }}
              key={index}
              title={item.name}
              style={{
                backgroundColor: isSelectedId(item.id)
                  ? constThemeColor.onBackground
                  : constThemeColor.onPrimary,
                borderRadius: 8,
              }}
              titleStyle={[
                FontSize.Antz_Small,
                {
                  color: isSelectedId(item.id)
                    ? constThemeColor.primary
                    : constThemeColor.neutralPrimary,
                  paddingHorizontal: Spacing.minor,
                },
              ]}
              trailingIcon={() =>
                isSelectedId(item.id) && (
                  <MaterialIcons
                    name="check"
                    size={24}
                    color={constThemeColor.primary}
                  />
                )
              }
            />
          );
        })}
      </ScrollView>
    </Menu>
  );
};

export default MenuModalComponent;

const styles = (reduxColors) =>
  StyleSheet.create({
    titleColor: {
      color: reduxColors.primary,
    },
  });
