import {
  AntDesign,
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Text, View } from "react-native";
import { Card, Divider, Menu } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ifEmptyValue, shortenNumber } from "../utils/Utils";
import { useSelector } from "react-redux";
import Colors from "../configs/Colors";
import { LinearGradient } from "expo-linear-gradient";
import FontSize from "../configs/FontSize";
import Constants from "../configs/Constants";
import Spacing from "../configs/Spacing";
import { useEffect } from "react";

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

const MedicalStats = ({
  title,
  subtitle,
  item,
  filterData,
  filterDataStatus,
  optionData,
  optionPress,
  status,
  ...props
}) => {
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
    filterData(item.value);
  };

  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  const [moreOptionVisible, setMoreOptionVisible] = useState(false);
  const [moreOptionData, setMoreOptionData] = useState([]);

  const openMoreOption = () => setMoreOptionVisible(true);
  const closeMoreOption = () => setMoreOptionVisible(false);

  useEffect(() => {
    setMoreOptionData(optionData);
  }, []);

  return (
    <View
      style={[
        // styles.markNode,
        {
          backgroundColor: constThemeColor.onPrimaryContainer,
          //  borderRadius: wp(3),
          borderTopLeftRadius: Spacing.body,
          borderTopRightRadius: Spacing.body,
        },
      ]}
    >
      <View style={{}}>
        {/* <Card.Title
          style={[{}]}
          title={title}
          subtitle={subtitle}
          titleStyle={{
            fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
            fontSize: FontSize.Antz_Minor_Medium.fontSize,
            // color: isSwitchOn ? constThemeColor.onPrimary : Colors.black,
            color: constThemeColor.onPrimary,
            left: wp(1.5),
          }}
          subtitleStyle={{
            fontWeight: FontSize.Antz_Small.fontWeight,
            fontSize: FontSize.Antz_Small,
            // color: isSwitchOn ? constThemeColor.onPrimary : Colors.insigntText,
            color: constThemeColor.onPrimary,
            left: wp(1.5),
            marginTop: hp(-1.2),
          }}
          left={(props) => (
            <LinearGradient
              colors={[constThemeColor.secondary, constThemeColor.primary]}
              style={{
                borderRadius: wp(40),
                height: 40,
                width: 40,
                backgroundColor: constThemeColor.indertermineChip,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image source={require("../assets/home_health.png")} />
            </LinearGradient>
          )}
        /> */}

        {/* <Entypo
          name="dots-three-vertical"
          size={22}
          style={{
            color: constThemeColor.onPrimary,
            alignSelf: "flex-end",
            top: hp(2.5),
            right: wp(5),
            position: "absolute",
          }}
        /> */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: Spacing.mini,
            paddingHorizontal: Spacing.minor + Spacing.micro,
            paddingVertical: Spacing.body,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <LinearGradient
              colors={[constThemeColor.secondary, constThemeColor.primary]}
              style={{
                borderRadius: wp(40),
                height: 40,
                width: 40,
                backgroundColor: constThemeColor.indertermineChip,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image source={require("../assets/home_health.png")} />
            </LinearGradient>

            <View>
              <Text
                style={{
                  fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                  fontSize: FontSize.Antz_Minor_Medium.fontSize,
                  color: constThemeColor.onPrimary,
                  marginHorizontal: Spacing.major,
                }}
              >
                {title}
              </Text>
            </View>
          </View>

          {/* <Entypo
            name="dots-three-vertical"
            size={22}
            style={{
              color: constThemeColor.onPrimary,
            }}
            // onPress={() => alert("hi")}
          /> */}

          {/* <Menu    // remove for 3 dots option instructed by joseph
            visible={moreOptionVisible}
            onDismiss={closeMoreOption}
            style={{
              top: 120,
            }}
            anchor={
              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  openMoreOption();
                }}
              >
                <MaterialCommunityIcons
                  color={constThemeColor.onPrimary}
                  name="dots-vertical"
                  size={24}
                  style={{
                    color: constThemeColor.onPrimary,
                  }}
                />
              </TouchableOpacity>
            }
            statusBarHeight={15}
          >
            {moreOptionData.map((item, index) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Menu.Item
                    onPress={() => {
                      setMoreOptionVisible(false);
                      optionPress(item);
                    }}
                    titleStyle={{ textAlign: "left" }}
                    title={item.option}
                    key={index}
                  />

                  {item.type == status && (
                    <MaterialCommunityIcons
                      name="check-bold"
                      size={24}
                      color={constThemeColor.primary}
                      style={{ marginRight: Spacing.minor }}
                    />
                  )}
                </View>
              );
            })}
          </Menu> */}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: Spacing.major,
            paddingBottom: Spacing.minor,
          }}
        >
          <View style={{ alignItems: "center", flex: 0.5 }}>
            <TouchableOpacity
              activeOpacity={item?.medical_count == 0 ? 1 : 0.5}
              accessible={true}
              disabled={Number(item?.total_animals_sick ?? 0) === 0}
              // onPress={() => {
              //   if (item?.medical_count && item?.medical_count > 0) {
              //     navigation.navigate("MedicalRecordList", {
              //       filter_label_name: "Show All",
              //       filter_value: "all",
              //     });
              //   }
              // }}

              onPress={() => {
                navigation.navigate("SickAnimalsList", {
                  ref_type: "animals_sick",
                  ref_title: "Animal",
                });
              }}
            >
              <Text style={reduxColors.numberHeading}>
                {ifEmptyValue(item?.total_animals_sick ?? "0")}
              </Text>
            </TouchableOpacity>
            <Text style={reduxColors.numberDesp}>Total Animals sick</Text>
          </View>

          <View style={{ alignItems: "center", flex: 0.5 }}>
            <TouchableOpacity
              activeOpacity={0.5}
              accessible={true}
              disabled={Number(item?.species ?? 0) === 0}
              // onPress={() =>
              //   navigation.navigate("MedicalRecordList", {
              //     filter_label_name:
              //       Constants.MEDICAL_RECORD_FILTER_LABEL.ACTIVE_DIAGNOSIS,
              //     filter_value:
              //       Constants.MEDICAL_RECORD_FILTER_LABEL_VALUE
              //         .ACTIVE_DIAGNOSIS,
              //   })
              // }
              onPress={() => {
                navigation.navigate("SickSpeciesList", {
                  ref_type: "species",
                  ref_title: "Species",
                });
              }}
            >
              <Text style={reduxColors.numberHeading}>
                {ifEmptyValue(item?.species ?? "0")}
              </Text>
            </TouchableOpacity>
            <Text style={reduxColors.numberDesp}>Species</Text>
          </View>
        </View>
      </View>
      {/* <View
        style={{
          backgroundColor: constThemeColor.onPrimary,
          borderBottomLeftRadius: wp(3),
          borderBottomRightRadius: wp(3),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 15,
          }}
        >
          <Text style={[reduxColors.dropdown]} onPress={openMenu}>
            {selectDrop !== "" ? selectDrop : "This Month"}
          </Text>

          <Menu
            visible={visible}
            style={{
              left: wp(3.5),
              marginTop: 15,
              position: "absolute",
              // backgroundColor:'red'
            }}
            onDismiss={() => setVisible(false)}
            anchor={
            
              <AntDesign
                name="down"
                size={12}
                style={{
                  color: constThemeColor.onSurface,
                  marginTop: wp(0.5),
                  marginLeft : 8,
                }}
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
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 10,
            marginBottom: 10,
          }}
        >
          <View style={reduxColors.statistics}>
            <Text
              style={[
                reduxColors.statisticsUpValue,
                {
                  color:
                    filterDataStatus?.percentage?.diagnosis < 0
                      ? constThemeColor.tertiary
                      : constThemeColor.primary
                },
              ]}
            >
              {filterDataStatus?.percentage?.diagnosis}%
            </Text>

            <Text style={reduxColors.statisticsValue}>
              {ifEmptyValue(filterDataStatus?.count?.diagnosis)}
            </Text>

            <Text style={reduxColors.statisticsDownText}>Diagnosis</Text>
          </View>

          <View style={reduxColors.statistics}>
            <Text
              style={[
                reduxColors.statisticsUpValue,
                {
                  color:
                    filterDataStatus?.percentage?.animal < 0
                    ? constThemeColor.tertiary
                    : constThemeColor.primary
                },
              ]}
            >
              {filterDataStatus?.percentage?.animal}%
            </Text>

            <Text style={reduxColors.statisticsValue}>
              {ifEmptyValue(filterDataStatus?.count?.animal)}
            </Text>

            <Text style={reduxColors.statisticsDownText}>Animals</Text>
          </View>

          <View style={reduxColors.statistics}>
            <Text
              style={[
                reduxColors.statisticsUpValue,
                {
                  color:
                    filterDataStatus?.percentage?.quarantine < 0
                    ? constThemeColor.tertiary
                    : constThemeColor.primary
                },
              ]}
            >
              {filterDataStatus?.percentage?.quarantine}%
            </Text>

            <Text style={reduxColors.statisticsValue}>
              {ifEmptyValue(filterDataStatus?.count?.quarantine)}
            </Text>

            <Text style={reduxColors.statisticsDownText}>Quarantined</Text>
          </View>
          <View style={reduxColors.statistics}>
            <Text
              style={[
                reduxColors.statisticsUpValue,
                {
                  color:
                    filterDataStatus?.percentage?.resolved < 0
                    ? constThemeColor.tertiary
                    : constThemeColor.primary
                },
              ]}
            >
              {filterDataStatus?.percentage?.resolved}%
            </Text>
            <Text style={reduxColors.statisticsValue}>
              {ifEmptyValue(filterDataStatus?.count?.resolved)}
            </Text>
            <Text style={reduxColors.statisticsDownText}>Resolved</Text>
          </View>
        </View>
      </View> */}
    </View>
  );
};

export default MedicalStats;

const styles = (reduxColors) =>
  StyleSheet.create({
    numberHeading: {
      color: reduxColors.primaryContainer,
      fontSize: FontSize.Antz_Display_Title.fontSize,
      fontWeight: FontSize.Antz_Display_Title.fontWeight,
      textAlign: "center",
    },
    numberDesp: {
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      color: reduxColors.surfaceVariant,
      textAlign: "center",
    },
    dropdown: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.onSurface,
      // flex: 0.2,
      paddingLeft: 20,
    },
    statistics: {
      alignItems: "center",
    },
    statisticsValue: {
      fontSize: FontSize.Antz_Major_Title.fontSize,
      fontWeight: FontSize.Antz_Major_Title.fontWeight,
      color: reduxColors.onSurface,
    },
    statisticsUpValue: {
      fontSize: FontSize.Antz_Small,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
    },
    statisticsDownText: {
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      color: reduxColors.outline,
    },
  });
