import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import FontSize from "../../configs/FontSize";
import { opacityColor } from "../../utils/Utils";
import Spacing from "../../configs/Spacing";
import Background from "../BackgroundImage";

const Data = [
  {
    id: 0,
    name: "This Month",
    value: "this-month",
  },
  {
    id: 1,
    name: "Last 7 days",
    value: "last-7-days",
  },
  {
    id: 2,
    name: "Last 3 Months",
    value: "last-3-months",
  },
  {
    id: 3,
    name: "Last 6 Months",
    value: "last-6-months",
  },
  {
    id: 3,
    name: "All",
    value: "all",
  },
];

const HousingInsightCard = (props) => {
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const [visible, setVisible] = useState(false);
  const [selectDrop, setSelectDrop] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");
  const navigation = useNavigation();

  const openMenu = () => setVisible(true);
  const closeMenu = (item) => {
    setSelectDrop(item.name ?? item);
    setDropdownValue(item.value);
    setVisible(false);
  };
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);
  return (
    <>
      <View
        style={{
          marginBottom: -5,
        }}
      >
        <Background>
        <View
          style={[
            dynamicStyles.cardContainer,
            {
              backgroundColor: opacityColor(constThemeColor.neutralPrimary, 40),
              borderRadius: 10,
              borderWidth: 1,
              borderColor: opacityColor(constThemeColor.onPrimary, 20),
            },
          ]}
        >
          <Text style={dynamicStyles.titleText}>{"All time data"}</Text>
          {/* <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10,
              marginBottom: 20,
            }}
          >
            <Text style={[dynamicStyles.dropdown]}>{"Last 6 months"}</Text>

            <Menu
              visible={visible}
              style={{
                left: wp(3.5),
                marginTop: 15,
                position: "absolute",
              }}
              onDismiss={() => setVisible(false)}
              anchor={
                <Entypo
                  name="chevron-small-down"
                  size={22}
                  color={constThemeColor.primaryContainer}
                  style={{ marginTop: 2, marginLeft: 5 }}
                  onPress={openMenu}
                />
              }
              statusBarHeight={15}
            >
              {Data?.map((item, index) => {
                return (
                  <Menu.Item
                    onPress={() => closeMenu(item)}
                    key={index}
                    title={item.name}
                  />
                );
              })}
            </Menu>
          </View> */}
          <View style={dynamicStyles.dataContainer}>
            

            

            <TouchableOpacity
              disabled={Number(props?.speciesData ?? 0) === 0}
              onPress={() => props.encPress("Species")}
            >
              <View style={dynamicStyles.dataRow}>
                <Text
                  style={[
                    dynamicStyles.cardNumber,
                    {
                      color: constThemeColor.onPrimary,
                    },
                  ]}
                >
                  {props.speciesData}
                </Text>
                <Text
                  style={[
                    dynamicStyles.cardNumberTitle,
                    {
                      color: constThemeColor.onPrimary,
                    },
                  ]}
                >
                  Species
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={Number(props?.AnimalData ?? 0) === 0}
              onPress={() => props.encPress("Animals")}
            >
              <View style={dynamicStyles.dataRow}>
                <Text
                  style={[
                    dynamicStyles.cardNumber,
                    {
                      color: constThemeColor.onPrimary,
                    },
                  ]}
                >
                  {props.AnimalData}
                </Text>
                <Text
                  style={[
                    dynamicStyles.cardNumberTitle,
                    {
                      color: constThemeColor.onPrimary,
                    },
                  ]}
                >
                  Animals
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={Number(props?.enclosureData ?? 0) === 0}
              onPress={() => props.encPress("Enclosures")}
            >
              <View style={dynamicStyles.dataRow}>
                <Text
                  style={[
                    dynamicStyles.cardNumber,
                    {
                      color: constThemeColor.onPrimary,
                    },
                  ]}
                >
                  {props.enclosureData}
                </Text>
                <Text
                  style={[
                    dynamicStyles.cardNumberTitle,
                    {
                      color: constThemeColor.onPrimary,
                    },
                  ]}
                >
                  Enclosures
                </Text>
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity
              onPress={props.onPress}
              style={dynamicStyles.dataRow}
            >
              <View style={dynamicStyles.dataRow}>
                <Text
                  style={[
                    dynamicStyles.cardNumber,
                    {
                      color: constThemeColor.onPrimary,
                    },
                  ]}
                >
                  {props.mortalityData}
                </Text>
                <Text
                  style={[
                    dynamicStyles.cardNumberTitle,
                    {
                      color: constThemeColor.onPrimary,
                    },
                  ]}
                >
                  Mortality
                </Text>
              </View>
            </TouchableOpacity> */}
          </View>
        </View>
        </Background>
      </View>
    </>
  );
};

export default HousingInsightCard;
const styles = (reduxColors) =>
  StyleSheet.create({
    cardContainer: {
      backgroundColor: reduxColors.surface,
      padding: 5,
    },
    dataContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      bottom: 10,
      marginTop: 20,
    },
    titleText: {
      fontSize: FontSize.Antz_Subtext_title.fontSize,
      fontWeight: FontSize.Antz_Subtext_title.fontWeight,
      color: reduxColors.surface,
      paddingTop: Spacing.mini,
      paddingLeft: Spacing.minor,
    },
    dataRow: {
      alignItems: "center",
    },
    cardNumber: {
      fontSize: FontSize.Antz_Large_Title.fontSize,
      fontWeight: FontSize.Antz_Major_Title.fontWeight,
      color: reduxColors.onSurface,
    },
    cardNumberTitle: {
      color: reduxColors.cardLebel,
      fontSize: FontSize.Antz_Strong,
    },
    dataRow: {
      alignItems: "center",
    },
    dropdown: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.onPrimary,
      paddingLeft: 20,
    },
  });
