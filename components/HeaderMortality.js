import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

/**
 * @Expo Imports
 */
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
/**
 * @Custom Imports
 */
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
import { Menu, Appbar } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SearchOnPage from "./searchOnPage";
import MortalitySearch from "./MortalitySearch";

const HeaderMortality = (props) => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const [moreOptionVisible, setMoreOptionVisible] = useState(false);
  const [moreOptionData, setMoreOptionData] = useState([]);

  const [isSearching, setIsSearching] = useState(false);

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

  const gotoBack = () => navigation.goBack();

  const openMoreOption = () => setMoreOptionVisible(true);
  const closeMoreOption = () => setMoreOptionVisible(false);

  const optionPress = (item) => {
    setMoreOptionVisible(false);
    if (item.screen !== "" && item.data) {
      navigation.navigate(item.screen, { item: item.data });
    } else if (item.screen !== "") {
      navigation.navigate(item.screen);
    }
  };

  return (
    <View
      style={{
        backgroundColor:
          props?.backgroundColor ?? constThemeColor.surfaceVariant,
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

      <View
        style={[
          {
            color: constThemeColor.surfaceVariant,
            justifyContent: "center",
          },
          props.style,
        ]}
      >
        {!isSearching ? (
          <View
            style={[
              {
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 10,
                paddingHorizontal: Spacing.minor,
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
                    color={constThemeColor.onSecondaryContainer}
                  />
                </TouchableOpacity>
              ) : null}

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
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              {props.search ? (
                <TouchableOpacity
                  onPress={() => setIsSearching(true)}
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
                    name="search1"
                    size={20}
                    color={constThemeColor.onSecondaryContainer}
                  />
                </TouchableOpacity>
              ) : null}

              {props.hideMenu ? null : (
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
                      }}
                    >
                      <MaterialCommunityIcons
                        color={constThemeColor.onSecondaryContainer}
                        name="dots-vertical"
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
            <View
              style={[
                {
                  paddingVertical: 2,
                  paddingHorizontal: Spacing.minor,
                },
              ]}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: Spacing.small,
                }}
              >
                {props.showBackButton ? (
                  <TouchableOpacity
                    onPress={() => {
                      setIsSearching(false);
                      props?.clearSearchText();
                    }}
                    activeOpacity={0.5}
                    style={{
                      marginRight: Spacing.minor,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="arrow-left"
                      size={24}
                      color={constThemeColor.onSecondaryContainer}
                    />
                  </TouchableOpacity>
                ) : null}

                <View
                  style={{
                    width: "80%",
                  }}
                >
                  <MortalitySearch
                    handleSearch={props?.handleSearch}
                    searchModalText={props?.searchModalText}
                    placeholderText="Search "
                    clearSearchText={props?.clearSearchText}
                  />
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

HeaderMortality.defaultProps = {
  showBackButton: true,
};

export default HeaderMortality;
