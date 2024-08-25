import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { TextInput, Searchbar } from "react-native-paper";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import VoiceText from "./VoiceText";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Text } from "react-native";
import FontSize from "../configs/FontSize";
import {  DrawerActions } from '@react-navigation/native';

const SearchBox = ({ style, searchType }) => {
  const [searchText, setSearchText] = useState("");
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const navigation = useNavigation();
  const toggleDrawer = () => navigation.dispatch(DrawerActions.toggleDrawer());
  const SearchScreen = () => navigation.navigate("SearchScreen", {SearchType: searchType});

  const onVoiceInput = (text) => {
    setSearchText(text);
  };
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);

  return (
    <View style={dynamicStyles.barStyle}>
      <View style={dynamicStyles.searchBar}>
        <TouchableOpacity
          onPress={() => {
            toggleDrawer();
          }}
        >
          <View style={dynamicStyles.leftIcon}>
            <MaterialIcons
              name="menu"
              size={24}
              style={{
                margin: 15,
                color: constThemeColor.neutralPrimary,
              }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            SearchScreen();
          }}
          style={{
            flex: 1,
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Text
            style={{
              fontSize: FontSize.Antz_Minor_Regular.fontSize,
              fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
              color: constThemeColor.onSurfaceVariant,
            }}
          >
            Search
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            SearchScreen();
          }}
        >
          <View style={dynamicStyles.rightIcon}>
            <MaterialIcons
              name="search"
              size={24}
              style={{
                margin: 15,
                color: constThemeColor.neutralPrimary,
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = (DarkModeReducer) =>
  StyleSheet.create({
    barStyle: {
      width: "100%",
      height: 56,
      justifyContent: "center",
      // paddingHorizontal: 15,
    },
    searchBar: {
      width: "100%",
      height: "100%",
      borderRadius: wp("50"),
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: DarkModeReducer.surface,
    },
    leftIcon: {
      width: 70,
      alignItems: "center",
    },
    rightIcon: {
      width: 70,
      alignItems: "center",
    },
  });

export default SearchBox;
