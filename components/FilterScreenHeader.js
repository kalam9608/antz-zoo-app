import React, { useState } from "react";
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Spacing from "../configs/Spacing";
import FontSize from "../configs/FontSize";

const FilterScreenHeader = ({filterValue=[]}) => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  return (
    <View
      style={{
        backgroundColor: constThemeColor.onPrimary,
        padding: Spacing.body,
        borderBottomWidth: 1,
        borderBottomColor: constThemeColor.outlineVariant,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: constThemeColor.onSecondaryContainer,
          fontSize: FontSize.Antz_Medium_Medium.fontSize,
          fontWeight: FontSize.Antz_Major_Regular.fontWeight,
        }}
      >
        Filters {`(${filterValue.length})`}
      </Text>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Entypo
          name="cross"
          size={24}
          color={constThemeColor.onSurfaceVariant}
        />
      </TouchableOpacity>
    </View>
  );
};

export default FilterScreenHeader;
