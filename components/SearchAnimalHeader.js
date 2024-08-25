import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { TextInput, Searchbar } from "react-native-paper";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  Octicons,
} from "@expo/vector-icons";
import { useSelector } from "react-redux";
import VoiceText from "./VoiceText";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FontSize from "../configs/FontSize";

const SearchAnimalHeader = ({
  style,
  onChangeText,
  value,
  clearSearchText,
  onSubmitEditing,
  routeName,
}) => {
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = styleSheet(constThemeColor);
  const navigation = useNavigation();
  const toggleDrawer = () => navigation.toggleDrawer();
  const gotoBack = () => navigation.goBack();
  const SearchScreen = () => navigation.navigate("SearchScreen");
  return (
    <View
      style={[
        styles.barStyle,
        {
          backgroundColor: isSwitchOn
            ? constThemeColor?.onSecondaryContainer
            : constThemeColor?.onSecondary,
        },
      ]}
    >
      <View style={{ width: "100%", justifyContent: "center" }}>
        <TouchableOpacity>
          <Searchbar
            placeholder={
              routeName == "InchargeAndApproverSelect"
                ? "Search people"
                : "Search..."
            }
            inputStyle={styles.input}
            onIconPress={gotoBack}
            onSubmitEditing={onSubmitEditing}
            style={[
              styles.Searchbar,
              {
                backgroundColor: isSwitchOn
                  ? constThemeColor?.onSecondaryContainer
                  : constThemeColor?.onSecondary,
              },
            ]}
            // loading={isloadong}
            onChangeText={onChangeText}
            value={value}
            // autoFocus={true}
            icon={({ size, color }) => (
              <Ionicons
                name="arrow-back"
                size={24}
                color
                style={{
                  color: isSwitchOn
                    ? constThemeColor.onSecondary
                    : constThemeColor.onSecondaryContainer,
                }}
              />
            )}
            right={() => (
              <>
                {value !== "" && (
                  <Octicons
                    name="x"
                    size={20}
                    color={constThemeColor.onPrimaryContainer}
                    onPress={clearSearchText}
                    style={{ position: "absolute", right: 16 }}
                  />
                )}
              </>
            )}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styleSheet = (reduxColors) =>
  StyleSheet.create({
    searchBar: {
      width: "100%",
    },
    rightIcons: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      // paddingHorizontal: "3%",
      // marginHorizontal: "1%",
    },
    input: {
      // width: "40%",
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColors.gray,
    },
  });

export default SearchAnimalHeader;
