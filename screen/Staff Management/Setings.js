import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import Switch from "../../components/Switch";
import Header from "../../components/Header";
import LinkTab from "../../components/LinkTab";
import { getAsyncData, saveAsyncData } from "../../utils/AsyncStorageHelper";

const Setings = (props) => {
  // fot taking styles from redux use this function
  const [userData, setUserData] = useState(props?.route?.params?.userDetails);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const permission = useSelector((state) => state.UserAuth.permission);
  const navigation = useNavigation();

  const [switchedOn, setSwitchedOn] = useState(false);

  useEffect(() => {
    getHideStatsValue();
  }, []);

  const getHideStatsValue = async () => {
    const value = await getAsyncData("@antz_hide_stats");
    setSwitchedOn(value);
  };

  return (
    <View style={reduxColors.container}>
      <Header
        title="Settings"
        noIcon={true}
        search={false}
        hideMenu={true}
        style={{
          backgroundColor: constThemeColor.background,
        }}
      />
      <LinkTab
        tabIcon={
          <Ionicons
            name="keypad"
            size={24}
            color={constThemeColor.onSurfaceVariant}
          />
        }
        tabText="Set Passcode"
        navigateIcon={
          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color={constThemeColor.onSurfaceVariant}
          />
        }
        onPress={() => {
          navigation.navigate("ResetPasscode");
        }}
      />
      <LinkTab
        tabIcon={
          <MaterialCommunityIcons
            name="key"
            size={24}
            color={constThemeColor.onSurfaceVariant}
          />
        }
        tabText="Change Password"
        navigateIcon={
          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color={constThemeColor.onSurfaceVariant}
          />
        }
        onPress={() => {
          navigation.navigate("UserPassword", {
            userDetails: userData,
          });
        }}
      />
      {permission?.collection_view_insights == true ? (
        <LinkTab
          tabIcon={<SimpleLineIcons name="graph" size={24} color="black" />}
          tabText="Hide Stats"
          navigateIcon={
            <Switch
              active={switchedOn}
              handleToggle={() => {
                saveAsyncData("@antz_hide_stats", !switchedOn);
                setSwitchedOn((prev) => !prev);
              }}
            />
          }
          onPress={() => console.log("Hide Stats")}
        />
      ) : null}
    </View>
  );
};

export default Setings;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.background,
    },
  });
