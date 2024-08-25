import React, { useState } from "react";
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import SearchBox from "./SearchBox";
import { useNavigation } from "@react-navigation/native";
import { Menu, Appbar } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Badge } from "react-native-paper";
import { useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";

const MedicalHeader = (props) => {
  const navigation = useNavigation();
  const [unreadNotifications, setUnreadNotifications] = useState(5);
  const [visible, setVisible] = useState(false);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);

  const openMenu = () => setVisible(true);
  const gotoHome = () => navigation.navigate("Home");
  const closeMenu = () => setVisible(false);
  const gotoBack = () => navigation.goBack();
  const site = useSelector((state) => state.UserAuth.zoos);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  return (
    <View
      style={{
        backgroundColor: isSwitchOn
          ? constThemeColor.onSecondaryContainer
          : constThemeColor.onPrimary,
      }}
    >
      {props.route == true ? (
        <StatusBar
          barStyle={isSwitchOn ? "light-content" : "dark-content"}
          backgroundColor={
            isSwitchOn
              ? constThemeColor.onSecondaryContainer
              : constThemeColor.surfaceVariant
          }
        />
      ) : (
        <StatusBar
          barStyle={isSwitchOn ? "light-content" : "dark-content"}
          backgroundColor={
            isSwitchOn
              ? constThemeColor.onSecondaryContainer
              : constThemeColor.onPrimary
          }
        />
      )}
      {props.noIcon == true ? (
        <StatusBar
          barStyle={isSwitchOn ? "light-content" : "dark-content"}
          backgroundColor={
            isSwitchOn
              ? constThemeColor.onSecondaryContainer
              : constThemeColor.onPrimary
          }
        />
      ) : null}
      {/* {props.route == true ? (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginBottom: 8,
              alignItems: "center",
            }}
          >
            <View>
              <TouchableOpacity onPress={openMenu}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "50%",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome
                    name="location-arrow"
                    size={17}
                    color={constThemeColor?.primary}
                    style={{}}
                  />
                  <Text
                    style={{
                      fontWeight: FontSize.Antz_Body_Title.fontWeight,
                      marginLeft: 4,
                      marginRight: 2,
                      color: isSwitchOn
                        ? constThemeColor.onPrimary
                        : constThemeColor.neutralPrimary,
                    }}
                  >
                    {site !== null ? site[0]?.zoo_name : "Site Name"}
                  </Text>
                  <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                      <AntDesign
                        name="down"
                        size={12}
                        style={{
                          color: isSwitchOn
                            ? constThemeColor.onPrimary
                            : constThemeColor.neutralPrimary,
                        }}
                        onPress={openMenu}
                      />
                    }
                    statusBarHeight={15}
                  >
                    {site[0].sites?.map((item, index) => {
                      return (
                        <Menu.Item
                          onPress={() => {}}
                          title={item.site_name}
                          key={index}
                        />
                      );
                    })}
                  </Menu>
                </View>
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: FontSize.Antz_Small,
                  marginLeft: 8,
                  color: isSwitchOn
                    ? constThemeColor.onPrimary
                    : constThemeColor.neutralPrimary,
                }}
              >
                {site !== null
                  ? site[0]?.zoo_description
                  : "Site address of the zoo"}
              </Text>
            </View>
            <View>
              <Badge
                visible={unreadNotifications && unreadNotifications > 0}
                size={wp(3.8)}
                style={{ position: "absolute", top: hp(1), right: wp(1) }}
              >
                {unreadNotifications}
              </Badge>
              <Appbar.Action
                icon={unreadNotifications ? "bell" : "bell-outline"}
                size={wp(4.5)}
                accessibilityLabel="TagChat"
              />
            </View>
          </View>
          <View style={{ margin: wp(1) }}>
            <SearchBox />
          </View>
        </>
      ) : ( */}
      <View
        style={[
          {
            display: "flex",
            justifyContent: "center",
            backgroundColor: isSwitchOn
              ? constThemeColor.onSecondaryContainer
              : constThemeColor.onPrimary,
            height: 58,
          },
          props.style,
        ]}
      >
        {props.noIcon ? (
          <View
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: Spacing.minor,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={
                isSwitchOn
                  ? constThemeColor.onPrimary
                  : constThemeColor.onSecondaryContainer
              }
              onPress={props.backGoesto ? gotoHome : gotoBack}
            />
            <Text
              style={{
                marginHorizontal: Spacing.small,
                fontSize: FontSize.Antz_Medium_Medium_btn.fontSize,
                color: isSwitchOn
                  ? constThemeColor.onPrimary
                  : constThemeColor.onSecondaryContainer,
                textAlign: "center",
                fontWeight: FontSize.Antz_Major_Regular.fontWeight,
              }}
            >
              {props.title}
            </Text>
          </View>
        ) : (
          <Appbar.Header mode="small">
            <Appbar.Action icon="close" size={34} onPress={gotoBack} />

            <Appbar.Content
              displayName={props?.title ?? ""}
              style={{ alignItems: "center" }}
            />

            <Appbar.Action icon="check" size={34} onPress={props.onPress} />
          </Appbar.Header>
        )}
      </View>
      {/* )} */}
    </View>
  );
};

const styles = StyleSheet.create({});

export default MedicalHeader;
