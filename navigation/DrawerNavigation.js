import React, { useContext, useState } from "react";
import { Text, View, Image, StyleSheet, Button, Platform } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { default as Colors } from "../configs/Colors";
import { FontAwesome, Ionicons, Feather } from "@expo/vector-icons";

import BottomNavigator from "./BottomTabNavigation";
import { clearAsyncData } from "../utils/AsyncStorageHelper";
import BottomTab from "./BottomTab";
import { Divider, Drawer, Switch } from "react-native-paper";
import Constants from "expo-constants";
import { useDispatch, useSelector } from "react-redux";
import { setDarkMode } from "../redux/DarkModeReducer";
import { setPassCode, setSignOut } from "../redux/AuthSlice";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FontSize from "../configs/FontSize";
const Drawers = createDrawerNavigator();
/**
 * @API Imports
 */
import { SvgXml } from "react-native-svg";
import Vantara_logo from "../assets/Vantara_logo.svg";
import Config from "../configs/Config";
import { useNavigation } from "@react-navigation/native";
export const CustomDrawerContent = (props) => {
  const [active, setActive] = React.useState("");
  const version = Constants.expoConfig.version;
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const zoos = useSelector((state) => state.UserAuth.zoos);
  const dispatch = useDispatch();

  const onToggleSwitch = () => {
    dispatch(setDarkMode(!isSwitchOn));
  };
  const gotoHome = () => props.navigation.navigate("Home");
  const gotoLogout = () => {
    clearAsyncData("@antz_user_data");
    clearAsyncData("@antz_user_token");
    clearAsyncData("@antz_user_device_token");
    dispatch(setSignOut());
    dispatch(setPassCode(null));
  };

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const navigation = useNavigation();
  const openExternalLink = () => {
    setActive("fourth");
    const url = "https://app.antzsystems.com/help/";
    navigation.navigate("WebViewScreen", { url });
  };
  return (
    <>
      <DrawerContentScrollView
        scrollEnabled={false}
        {...props}
        style={{ backgroundColor: constThemeColor.onPrimary }}
      >
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {Config.vantara_build ? (
            <SvgXml xml={Vantara_logo} style={[styles.image]} />
          ) : (
            <Image
              source={require("../assets/lset.png")}
              style={{ width: 155, height: 80, margin: 30 }}
            />
          )}
        </View>
        <Divider
          style={{
            marginHorizontal: 14,
            backgroundColor: constThemeColor.surfaceVariant,
          }}
        />
        <View style={{ marginTop: hp("1%") }}>
          <DrawerItemList {...props} />
        </View>

        {zoos &&
          zoos.map((item) => {
            return (
              <Drawer.Item
                label={item.zoo_name}
                active={active === "first"}
                key={item.zoo_id}
                onPress={() => setActive("first")}
                icon={({ focused, color }) => (
                  <FontAwesome
                    name="paw"
                    size={24}
                    color={constThemeColor.neutralPrimary}
                  />
                )}
              />
            );
          })}

        <Divider
          style={{
            marginVertical: 10,
            marginHorizontal: 14,
            backgroundColor: constThemeColor.surfaceVariant,
          }}
        />

        {/* <Drawer.Item
          label="Dark Mode"
          active={active === "third"}
          onPress={() => {
            onToggleSwitch();
            setActive("third");
          }}
          right={() => {
            return <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />;
          }}
          icon={({ focused, color }) => (
            <FontAwesome
              name="moon-o"
              size={22}
              color={constThemeColor.neutralPrimary}
            />
          )}
        /> */}

        <Drawer.Item
          label="Help & Support"
          active={active === "fourth"}
          onPress={openExternalLink}
          icon={({ focused, color }) => (
            <Feather
              name="help-circle"
              size={22}
              color={constThemeColor.neutralPrimary}
            />
          )}
        />

        {/* <Drawer.Item
          label="Settings"
          active={active === "fifth"}
          onPress={() => setActive("fifth")}
          icon={({ focused, color }) => (
            <Feather
              name="settings"
              size={22}
              color={constThemeColor.neutralPrimary}
            />
          )}
        /> */}
        {/* <Drawer.Item
          label="Sign Out"
          active={active === "six"}
          icon={({ focused, color }) => (
            <Ionicons
              name="power"
              size={21}
              color={constThemeColor.neutralPrimary}
            />
          )}
          onPress={gotoLogout}
        /> */}
      </DrawerContentScrollView>

      <View style={{ backgroundColor: constThemeColor.onPrimary }}>
        <Divider
          style={{
            marginHorizontal: 14,
            backgroundColor: constThemeColor.surfaceVariant,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 30,
          }}
        >
          <Image
            source={require("../assets/antz.png")}
            style={{ width: 20, height: 20 }}
          />
          <Text
            style={{
              color: constThemeColor.outlineVariant,
              fontSize: FontSize.Antz_Subtext_Medium.fontSize,
              fontWeight: FontSize.Antz_Subtext_Medium.fontWeight,
            }}
          >
            Version{" "}
            {Constants.expoConfig.client === "ril"
              ? "AK"
              : Config.isDev
              ? "Antz Dev"
              : "Antz Staging"}
            -{version}
          </Text>
        </View>
      </View>
    </>
  );
};

const DrawerNavigator = () => (
  <Drawers.Navigator
    screenOptions={{
      itemStyle: { marginVertical: 5 },
      headerShown: false,
      drawerActiveBackgroundColor: false,
    }}
    drawerContent={(props) => <CustomDrawerContent {...props} />}
  >
    <Drawers.Screen
      component={BottomTab}
      name="Zoos"
      options={{
        drawerLabel: ({ focused, color }) => (
          <Text
            style={{
              fontSize: FontSize.Antz_Minor_Medium_title.fontSize,
              fontWeight: FontSize.Antz_Minor_Medium_title.fontWeight,
              color: "#49454F",
              marginLeft: 10,
            }}
          >
            {"Zoos"}
          </Text>
        ),
      }}
      onPress={() => setActive("first")}
    />
  </Drawers.Navigator>
);

const styles = StyleSheet.create({
  // drawerTop: {
  //   // height: "20%",
  //   // justifyContent: "center",
  //   // marginLeft: 20,
  // },
  // itemText: {
  //   marginLeft: -10,
  // },
  // iconStyle: {
  //   width: 25,
  //   color: Colors.textColor,
  //   fontSize: 20,
  //   marginLeft: 10,
  // },
  // wrapper: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   padding: 8,
  // },
  // v3Wrapper: {
  //   marginLeft: 16,
  //   marginRight: 24,
  //   padding: 0,
  // },
  // Images: {
  //   width: "65%",
  // },
});

export default DrawerNavigator;
