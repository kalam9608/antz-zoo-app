import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";

import { opacityColor, shortenNumber } from "../utils/Utils";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import StatsBlock from "./StatsBlock";
import Background from "./BackgroundImage";
const SpeciesInsight = ({ orderHierchyData, onStatsPress, props }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);

  const route = useRoute();
  const reduxColors = styles(constThemeColor);

  const navigation = useNavigation();
  const [showBackgroundImage, SetShowBackgroundImage] = useState(false);

  return (
    <View style={dynamicStyles.mainContainer}>
      <Background>
      <View style={[dynamicStyles.dataContainer]}>
        <TouchableOpacity
          style={dynamicStyles.dataRow}
          disabled={Number(orderHierchyData?.total_animals ?? 0) === 0}
          onPress={() => onStatsPress("population")}
        >
          <Text style={[dynamicStyles.cardNumber]}>
            {shortenNumber(orderHierchyData?.total_animals) ?? 0}
          </Text>
          <Text style={[dynamicStyles.cardNumberTitle]}>Population</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.dataRow}
          disabled={Number(orderHierchyData?.total_sites ?? 0) === 0}
          onPress={() => onStatsPress("site")}
        >
          <Text style={[dynamicStyles.cardNumber]}>
            {shortenNumber(orderHierchyData?.total_sites) ?? 0}
          </Text>
          <Text style={[dynamicStyles.cardNumberTitle]}>Sites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.dataRow}
          disabled={Number(orderHierchyData?.total_sections ?? 0) === 0}
          onPress={() => onStatsPress("section")}
        >
          <Text style={[dynamicStyles.cardNumber]}>
            {shortenNumber(orderHierchyData?.total_sections) ?? 0}
          </Text>
          <Text style={[dynamicStyles.cardNumberTitle]}>Sections</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.dataRow}
          disabled={Number(orderHierchyData?.total_enclosure ?? 0) === 0}
          onPress={() => onStatsPress("enclosure")}
        >
          <Text style={[dynamicStyles.cardNumber]}>
            {shortenNumber(orderHierchyData?.total_enclosure) ?? 0}
          </Text>
          <Text style={[dynamicStyles.cardNumberTitle]}>Enclosures</Text>
        </TouchableOpacity>
      </View>
      </Background>
      {/* navigate to another page */}
      {/* <View style={[dynamicStyles.dataContainer]}>
        <TouchableOpacity
          style={dynamicStyles.dataRow}
          disabled={Number(orderHierchyData?.total_animals ?? 0) === 0}
          onPress={() =>
            navigation.navigate("ListingData", {
              species_id: route?.params?.tsn_id,
              type: "animal",
              total_count: orderHierchyData.total_animals,
            })
          }
        >
          <Text style={[dynamicStyles.cardNumber]}>
            {shortenNumber(orderHierchyData?.total_animals) ?? 0}
          </Text>
          <Text style={[dynamicStyles.cardNumberTitle]}>Population</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.dataRow}
          disabled={Number(orderHierchyData?.total_sites ?? 0) === 0}
          onPress={() =>
            navigation.navigate("ListingData", {
              species_id: route?.params?.tsn_id,
              type: "site",
              total_count: String(orderHierchyData.total_sites),
            })
          }
        >
          <Text style={[dynamicStyles.cardNumber]}>
            {shortenNumber(orderHierchyData?.total_sites) ?? 0}
          </Text>
          <Text style={[dynamicStyles.cardNumberTitle]}>Sites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.dataRow}
          disabled={Number(orderHierchyData?.total_sections ?? 0) === 0}
          onPress={() =>
            navigation.navigate("ListingData", {
              species_id: route?.params?.tsn_id,
              type: "section",
              total_count: orderHierchyData.total_sections,
            })
          }
        >
          <Text style={[dynamicStyles.cardNumber]}>
            {shortenNumber(orderHierchyData?.total_sections) ?? 0}
          </Text>
          <Text style={[dynamicStyles.cardNumberTitle]}>Sections</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.dataRow}
          disabled={Number(orderHierchyData?.total_enclosure ?? 0) === 0}
          onPress={() =>
            navigation.navigate("ListingData", {
              species_id: route?.params?.tsn_id,
              type: "enclosure",
              total_count: orderHierchyData.total_enclosure,
            })
          }
        >
          <Text style={[dynamicStyles.cardNumber]}>
            {shortenNumber(orderHierchyData?.total_enclosure) ?? 0}
          </Text>
          <Text style={[dynamicStyles.cardNumberTitle]}>Enclosures</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default SpeciesInsight;

const styles = (reduxColors) =>
  StyleSheet.create({
    mainContainer: {
      marginVertical: -Spacing.major,
      marginTop: Spacing.body,
      paddingVertical: Spacing.minor,
      // paddingBottom: Spacing.small,
      paddingHorizontal: Spacing.major,
      borderRadius: Spacing.small,
      backgroundColor: opacityColor(reduxColors.neutralPrimary, 40),
    },
    dataContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    dataRow: {
      // flex: 1,
      alignItems: "center",
    },
    cardNumber: {
      fontSize: FontSize.Antz_Large_Title.fontSize,
      fontWeight: FontSize.Antz_Large_Title.fontWeight,
      color: reduxColors.primaryContainer,
    },
    cardNumberTitle: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.surfaceVariant,
    },
    downArrow: {
      height: 14,
      width: 14,
      alignSelf: "center",
      marginTop: Spacing.minor,
    },
  });
