/**
 * @React Imports
 */
import { View, TouchableOpacity, Text } from "react-native";
import React, { useState } from "react";

/**
 * @Expo Imports
 */
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

/**
 * @Redux Imports
 */
import { useSelector } from "react-redux";

/**
 * @Third Party Imports
 */
import { useNavigation } from "@react-navigation/native";
import { Menu } from "react-native-paper";
/**
 * @Config Imports
 */
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import { widthPercentageToDP } from "react-native-responsive-screen";

const AnimatedHeader = (props) => {
  const navigation = useNavigation();

  {
    /*
        author : Arnab
        date: 3.5.23
        desc: added for more function
      */
  }
  const [moreOptionVisible, setMoreOptionVisible] = useState(false);
  //const [moreOptionData, setMoreOptionData] = useState(props?.optionData ?? []);
  const gotoBack = () => navigation.goBack();
  const openMoreOption = () => setMoreOptionVisible(true);
  const closeMoreOption = () => setMoreOptionVisible(false);
  const optionPress = (item) => {
    setMoreOptionVisible(false);
    if (item.screen !== "") {
      navigation.navigate(item.screen, {
        item: props.itemDetails,
      });
    }
  };
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  // fot taking styles from redux use this function
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  //  const reduxColors = styles(constThemeColor);
  const moreOptionData = { id: 1, option: "QR Code", screen: "ProfileQr", key: "VIEW" };

  return (
    <>
      <View
        style={[
          {
            paddingHorizontal: Spacing.minor,
            paddingVertical: Spacing.body,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            zIndex: 2,
            alignItems: "center",
          },
          props.style,
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={props?.onBackPress ?? gotoBack}
          style={{
            width: 35,
            height: 35,
            borderRadius: 100,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={
              props?.header ? themeColors.neutralPrimary : themeColors.onPrimary
            }
            // onPress={gotoBack}
          />
        </TouchableOpacity>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          {props?.showTitle ? (
            <View style={{ alignSelf: "center" }}>
              <Text
                style={[
                  FontSize.Antz_Body_Regular,
                  { color: themeColors.onPrimary },
                ]}
              >
                {props?.subTitle}
              </Text>
            </View>
          ) : null}
          <View>
            {props?.header ? (
              <Text
                style={[
                  FontSize.Antz_Minor_Medium,
                  { color: themeColors.neutralPrimary, alignSelf: "center" },
                ]}
              >
                {props?.title?.length > 25
                  ? props?.title?.slice(0, 25) + "..."
                  : props?.title}
              </Text>
            ) : (
              <Text
                style={[
                  FontSize.Antz_Minor_Medium,
                  {
                    color: themeColors.onPrimary,
                    opacity: props?.showTitle ? 1 : 0,
                    alignSelf: "center",
                  },
                ]}
              >
                {props?.title?.length > 25
                  ? props?.title?.slice(0, 25) + "..."
                  : props?.title}
              </Text>
            )}
          </View>
        </View>
        {/*
          author : Arnab
          date: 3.5.23
          desc: added for more function
        */}
        <View style={{ flexDirection: "row" }}>
          {props.qrCard ? (
            <MaterialIcons
              name="qr-code"
              size={28}
              style={{ paddingTop: 4, paddingRight: 8 }}
              color={
                props?.header
                  ? themeColors.neutralPrimary
                  : themeColors.onPrimary
              }
              onPress={() => {
                props.optionPress(moreOptionData);
              }}
            />
          ) : null}
          {props.hideMenu ? null :
            <Menu
            visible={moreOptionVisible}
            onDismiss={closeMoreOption}
            style={{
              marginTop: 15,
            }}
            anchor={
              <TouchableOpacity
                onPress={openMoreOption}
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="dots-vertical"
                  color={
                    props?.header
                      ? themeColors.neutralPrimary
                      : themeColors.onPrimary
                  }
                  size={30}
                />
              </TouchableOpacity>
            }
            statusBarHeight={15}
          >
            {props?.optionData?.map((item, index) => {
              return (
                <Menu.Item
                  onPress={() => {
                    setMoreOptionVisible(false);
                    props.optionPress(item);
                  }}
                  title={item.option}
                  key={index}
                />
              );
            })}
          </Menu>}
        </View>
      </View>
    </>
  );
};

export default AnimatedHeader;
