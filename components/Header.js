import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
/**
 * @Expo Imports
 */
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
/**
 * @Custom Imports
 */
import SearchBox from "./SearchBox";
import { saveAsyncData } from "../utils/AsyncStorageHelper";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import Colors from "../configs/Colors";
/**
 * @Redux Imports
 */
import { useSelector } from "react-redux";

/**
 * @Third Party Imports
 */
import {
  Button,
  Menu,
  Divider,
  Provider,
  IconButton,
  Appbar,
  Badge,
} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const deviceWidth = Dimensions.get("window").width;

const Header = (props) => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  // const dynamicStyles = styles(constThemeColor);
  const [unreadNotifications, setUnreadNotifications] = useState(5);
  const [visible, setVisible] = useState(false);
  const [moreOptionVisible, setMoreOptionVisible] = useState(false);
  const [moreOptionData, setMoreOptionData] = useState([]);
  useEffect(() => {
    setMoreOptionData(
      props.optionData ?? [
        {
          id: 1,
          option: (
            <Text>
              <AntDesign
                name="home"
                size={20}
                color={constThemeColor.primary}
              />
              {"  "}Home
            </Text>
          ),
          screen: "Home",
        },
      ]
    );
  }, [JSON.stringify(props.optionData)]);

  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const onSiteSelect = (item) => {
    // TODO SET THE SELECTED SITE ID TO REDUX
    saveAsyncData("@antz_selected_site", item);
    setVisible(false);
  };

  const gotoBack = () => navigation.goBack();

  const openMoreOption = () => setMoreOptionVisible(true);
  const closeMoreOption = () => setMoreOptionVisible(false);

  const site = useSelector((state) => state.UserAuth.zoos);
  const userDetails = useSelector((state) => state.UserAuth.userDetails);

  const optionPress = (item) => {
    setMoreOptionVisible(false);
    if (item.screen !== "" && item.data) {
      navigation.navigate(item.screen, { item: item.data });
    } else if (item.screen !== "") {
      navigation.navigate(item.screen);
    }
  };

  /**
   * Notification Scheduler
   */
  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: "Here is the notification body",
        data: {
          screenName: "UserDetails",
          params: { user_id: userDetails?.user_id },
        },
      },
      trigger: { seconds: 2 },
    });
  }
  return (
    <View
      style={{
        backgroundColor:
        props?.backgroundColor ?? constThemeColor.surfaceVariant,
        width: props?.onlyBackIcon && "100%"
      }}
    >
      {props.route == true ? (
        <StatusBar
          barStyle={isSwitchOn ? "light-content" : "dark-content"}
          backgroundColor={constThemeColor.surfaceVariant}
        />
      ) : (
        <StatusBar
          barStyle={isSwitchOn ? "light-content" : "dark-content"}
          backgroundColor={constThemeColor.surfaceVariant}
        />
      )}
      
      {props.noIcon == true ? (
        <StatusBar
          barStyle={isSwitchOn ? "light-content" : "dark-content"}
          backgroundColor={props.backgroundColor}
        />
      ) : null}
      
      {props.route == true ? (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 22,
              display: "flex",
              marginTop: 5,
            }}
          >
            <View style={{ flex: 1, display: "none" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={openMenu}
                  activeOpacity={0.5}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 100,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesome
                      name="location-arrow"
                      size={16}
                      color={constThemeColor.primary}
                      style={{}}
                    />
                    <Text
                      style={{
                        fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                        marginLeft: 8,
                        marginRight: 8,
                        color: constThemeColor.neutralPrimary,
                        fontSize: FontSize.Antz_Minor_Title.fontSize,
                      }}
                    >
                      {site !== null ? site[0]?.zoo_name : "Site Name"}
                    </Text>

                    <Menu
                      visible={visible}
                      style={{
                        left: 15,
                        top: 50,
                        position: "absolute",
                        height: "50%",
                      }}
                      onDismiss={closeMenu}
                      anchor={
                        <AntDesign
                          name="down"
                          size={12}
                          style={{
                            color: constThemeColor.neutralPrimary,
                            marginTop: widthPercentageToDP(1),
                          }}
                          onPress={openMenu}
                        />
                      }
                      statusBarHeight={15}
                    >
                      <ScrollView showsVerticalScrollIndicator={false}>
                        {site[0].sites?.map((item, index) => {
                          return (
                            <Menu.Item
                              key={index}
                              onPress={() => onSiteSelect(item)}
                              title={item.site_name}
                            />
                          );
                        })}
                      </ScrollView>
                    </Menu>
                  </View>
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  fontSize: FontSize.Antz_Small,
                  color: constThemeColor.neutralPrimary,
                }}
              >
                {site !== null
                  ? site[0]?.zoo_description
                  : "Site address of the zoo"}
              </Text>
            </View>
            {/* <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: 80,
                justifyContent: "flex-end",
              }}
            >
              <Appbar.Action
                icon={unreadNotifications ? "bell" : "bell-outline"}
                style={{ width: 24, height: 24, left: 13 }}
                accessibilityLabel="TagChat"
                color={constThemeColor.onSurfaceVariant}
                onPress={async () => {
                  await schedulePushNotification();
                }}
              />
              <Badge
                visible={unreadNotifications && unreadNotifications > 0}
                size={20}
                style={{
                  zIndex: 99,
                  top: -15,
                }}
              >
                {unreadNotifications}
              </Badge>
            </View> */}
          </View>

          <View
            style={{ paddingVertical: 10, paddingHorizontal: Spacing.minor }}
          >
            <SearchBox searchType={props?.searchType} />
          </View>
        </>
      ) : (
        <View
          style={[
            {
              color: constThemeColor.surfaceVariant,
               justifyContent: "center",
            },
            props.style,
          ]}
        >
          {props.noIcon ? (
            <View
              style={[
                {
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 10,
                  paddingHorizontal:props?.headerPaddingHorizontal?? Spacing.minor,
                },
              ]}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {props.showBackButton ? (
                  <TouchableOpacity
                    onPress={props?.customBack ? props?.customBack : gotoBack}
                    activeOpacity={0.5}
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 100,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: Spacing.minor,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="arrow-left"
                      size={24}
                      color={
                        props.arrowColor
                          ? constThemeColor.onPrimary
                          : constThemeColor.onSecondaryContainer
                      }
                      // style={{
                      //   paddingRight: Spacing.minor,
                      //   paddingVertical: Spacing.small,
                      // }}
                    />
                  </TouchableOpacity>
                ) : null}

                {/*  updated by md kalam :- set the header title align and show title  acording to props  */}
                <Text
                  style={[
                    FontSize.Antz_Medium_Medium,
                    {
                      color: props.titleColor
                        ? props.titleColor
                        : constThemeColor.onSecondaryContainer,
                      paddingRight: props.paddingRight,
                    },
                    {
                      backgroundColor: props.titleBackgroundColor,
                      paddingHorizontal: props.titlePaddingHorizontal,
                    },
                  ]}
                >
                  {props.mortalitySubTex ? null : props.title}
                </Text>
                {props.connectionStatus == "OPEN" &&
                props?.routeName == "chats" ? (
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: wp(50),
                      backgroundColor: constThemeColor?.primary,
                      marginHorizontal: Spacing.mini,
                      alignSelf: "center",
                    }}
                  />
                ) : props.connectionStatus != "OPEN" &&
                  props?.routeName == "chats" ? (
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: wp(50),
                      backgroundColor: constThemeColor?.error,
                      marginHorizontal: Spacing.mini,
                      alignSelf: "center",
                    }}
                  />
                ) : null}
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                {props.showCalendar ? (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity onPress={props?.openDatePicker}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: constThemeColor.subtitle,
                            ...FontSize.Antz_Body_Medium,
                          }}
                        >
                          {props?.calendarMonth} ({props?.calendarYear})
                        </Text>
                        <AntDesign
                          name="caretdown"
                          size={12}
                          style={{ paddingLeft: Spacing.small }}
                        />
                      </View>
                    </TouchableOpacity>

                    <View>
                      <MaterialCommunityIcons
                        name="calendar-today"
                        size={22}
                        style={{
                          marginRight: Spacing.minor,
                          marginLeft: Spacing.minor,
                        }}
                        color={
                          props?.isCalendarDisabled
                            ? constThemeColor.mediumGrey
                            : constThemeColor.subtitle
                        }
                        onPress={
                          props?.isCalendarDisabled
                            ? null
                            : props.handleTodayCalendarPress
                        }
                      />
                    </View>
                  </View>
                ) : null}
                {props.search ? (
                  <TouchableOpacity
                    onPress={props.gotoSearchPage}
                    activeOpacity={0.5}
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 100,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AntDesign
                      // onPress={props.gotoSearchPage}
                      name="search1"
                      size={24}
                      color={constThemeColor.onSecondaryContainer}
                      // style={{ padding: Spacing.small }}
                    />
                  </TouchableOpacity>
                ) : null}
                {/*
                author : Arnab
                date: 3.5.23
                desc: added for more function
                */}
                {props?.editButton ? (
                  <TouchableOpacity
                    onPress={props.onPressEditButton}
                    activeOpacity={0.5}
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 100,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={[
                        FontSize.Antz_Body_Title,
                        { color: constThemeColor.primary },
                      ]}
                    >
                      Edit
                    </Text>
                  </TouchableOpacity>
                ) : null}
                {props.editIconCheck ? (
                  <TouchableOpacity onPress={props.editButtonPress}>
                  <MaterialIcons
                    name="mode-edit-outline"
                    size={24}
                    color={constThemeColor.onSecondaryContainer}
                    
                  />
                  </TouchableOpacity>
                ) : null}
                {props.shareIcon ? (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 100,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {props.shareIcon}
                  </TouchableOpacity>
                ) : props.hideMenu ? null : (
                  <Menu
                    visible={moreOptionVisible}
                    onDismiss={closeMoreOption}
                    style={{
                      top: 40,
                    }}
                    anchor={
                      <TouchableOpacity
                        activeOpacity={0.5}
                        style={{
                          width: 35,
                          height: 35,
                          borderRadius: 100,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={() => {
                          openMoreOption();
                          // navigation.navigate('UserPassword')
                        }}
                      >
                        <MaterialCommunityIcons
                          color={constThemeColor.onSecondaryContainer}
                          name="dots-vertical"
                          // onPress={openMoreOption}

                          size={24}
                          style={{
                            paddingVertical: Spacing.small,
                            paddingLeft: Spacing.small,
                            marginRight: -10,
                            width: 40,
                            height: 40,
                          }}
                        />
                      </TouchableOpacity>
                    }
                    statusBarHeight={15}
                  >
                    {moreOptionData.map((item, index) => {
                      return (
                        <Menu.Item
                          onPress={() => {
                            setMoreOptionVisible(false);
                            optionPress(item);

                            // props.optionPress(item);
                          }}
                          titleStyle={{ textAlign: "center" }}
                          title={item.option}
                          key={index}
                        />
                      );
                    })}
                  </Menu>
                )}
              </View>
            </View>
          ) : (
            <>
              <StatusBar
                barStyle={"dark-content"}
                backgroundColor={constThemeColor.onPrimary}
              />

              <Appbar.Header
                mode="small"
                style={{
                  backgroundColor: constThemeColor.onPrimary,
                  // marginLeft: props?.marginLeft,
                  marginHorizontal: 2,
                }}
              >
                <Appbar.Action
                  icon="arrow-left"
                  size={34}
                  onPress={props.back ? props.back : gotoBack}
                />

                <Appbar.Content
                  title={props?.title ?? ""}
                  style={{ alignItems: "center" }}
                />
                {/* {props.requiredTitle ? (
                  <Text
                    style={{
                      fontSize: heightPercentageToDP(3),
                      color: constThemeColor.onSecondaryContainer,
                      textAlign: "center",
                      // position: "absolute",
                      // top: 10,
                      // right: 0,
                      // bottom: 0,
                      // left: 0,
                      // alignSelf: "center",
                    }}
                    // numberOfLines={1}
                  >
                    {props.title}
                  </Text>
                ) : null} */}
                {props.deletes ? (
                  ""
                ) : (
                  <Appbar.Action
                    icon="check"
                    size={34}
                    onPress={props.onPress}
                    accessible={true}
                    accessibilityLabel={"saveData"}
                    accessibilityId="saveData"
                  />
                )}
              </Appbar.Header>
            </>
          )}
        </View>
      )}
    </View>
  );
};

Header.defaultProps = {
  showBackButton: true,
};

export default Header;

//  <<<<<<<<<<<<<---------- Documentation for My header component------------>>>>>>>>> //
// step-1 --->> you have to call a function & pass it as a props named addHeader //
// step-2 --->>  you can add multiple icon into header by adding it into the function as many as you want //
// function returns multiple icons //
