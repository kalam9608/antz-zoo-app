// ceated By: MD KALAM
// created At: 12/07/2023

import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
} from "react-native";
import React from "react";
import { Entypo, Ionicons } from "@expo/vector-icons";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";

const HeaderTaxonomy = (props) => {
  const navigation = useNavigation();

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <>
      <StatusBar
        barStyle={props.StatusBarStyle ? props.StatusBarStyle : "dark-content"}
      />
      <View style={[reduxColors.container]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={props.gotoBack}
            style={{
              width: 40,
              height: 40,
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color={constThemeColor.onSecondaryContainer}
            />
          </TouchableOpacity>

          <Text style={{ paddingLeft: widthPercentageToDP(2) }}>
            {props.title}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Taxonomy")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: 40,
            justifyContent: "flex-end",
          }}
        >
          <Entypo
            name="plus"
            size={24}
            color={constThemeColor.onSecondaryContainer}
          />
          <Text style={reduxColors.headerRightText}>Add Species </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default HeaderTaxonomy;
const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      padding: Spacing.minor,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerRightText: {
      color: reduxColors.onSurface,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      marginLeft: Spacing.small,
    },
  });
